import { Connection as NodlConnection } from '@bitspace/circuit';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { NODE_POSITION_OFFSET_X } from '../../constants';
import { StoreContext } from '../../stores/CanvasStore/CanvasStore';
import { fromCanvasCartesianPoint } from '../../utils/coordinates/coordinates';
import { ConnectionProps } from './Connection.types';
import { quadraticCurve } from './Connection.utils';
import { motion } from 'framer-motion';
import posthog from 'posthog-js';

const INPUT_PORT_OFFSET_X = 16;
const INPUT_PORT_OFFSET_Y = 12;

const OUTPUT_PORT_OFFSET_X = 0;
const OUTPUT_PORT_OFFSET_Y = 12;

const defaultPosition = { x: 0, y: 0 };

export const Connection = observer(
    <T,>({ output, connection }: ConnectionProps<T>) => {
        const [pathString, setPathString] = React.useState('');
        const [fromPos, setFromPos] = React.useState(defaultPosition);
        const [toPos, setToPos] = React.useState(defaultPosition);
        const { store } = React.useContext(StoreContext);

        React.useEffect(() => {
            return autorun(() => {
                if (connection) {
                    const outputElement = connection
                        ? store.portElements.get(connection.from.id)
                        : output
                          ? store.portElements.get(output.id)
                          : undefined;

                    const inputElement =
                        connection && store.portElements.get(connection.to.id);

                    if (!outputElement || !inputElement) {
                        return;
                    }

                    const fromPosition = store.getNodeByPortId(
                        connection.from.id
                    )?.position;
                    const toPosition = store.getNodeByPortId(
                        connection.to.id
                    )?.position;

                    if (!fromPosition || !toPosition) {
                        return;
                    }

                    const outputCartesian = fromCanvasCartesianPoint(
                        fromPosition.x + NODE_POSITION_OFFSET_X,
                        fromPosition.y
                    );

                    const inputCartesian = fromCanvasCartesianPoint(
                        toPosition.x - NODE_POSITION_OFFSET_X,
                        toPosition.y
                    );

                    const outputPortPosition = {
                        x: outputCartesian.x,
                        y: outputCartesian.y + outputElement.offsetTop
                    };

                    const inputPortPosition = {
                        x: inputCartesian.x + inputElement.offsetLeft,
                        y: inputCartesian.y + inputElement.offsetTop
                    };

                    const newFromPos = {
                        x: outputPortPosition.x + OUTPUT_PORT_OFFSET_X,
                        y: outputPortPosition.y + OUTPUT_PORT_OFFSET_Y
                    };

                    const newToPos = {
                        x: inputPortPosition.x - INPUT_PORT_OFFSET_X,
                        y: inputPortPosition.y + INPUT_PORT_OFFSET_Y
                    };

                    setFromPos(newFromPos);
                    setToPos(newToPos);

                    setPathString(quadraticCurve(newFromPos, newToPos));
                }
            });
        }, []);

        React.useEffect(() => {
            if (output) {
                return autorun(() => {
                    const outputElement = connection
                        ? store.portElements.get(connection.from.id)
                        : output
                          ? store.portElements.get(output.id)
                          : undefined;

                    if (!outputElement) {
                        return;
                    }

                    const outputPosition = store.getNodeByPortId(
                        output.id
                    )?.position;

                    if (!outputPosition) {
                        return;
                    }

                    const outputCartesian = fromCanvasCartesianPoint(
                        outputPosition.x + NODE_POSITION_OFFSET_X,
                        outputPosition.y
                    );

                    const outputPortPosition = {
                        x: outputCartesian.x,
                        y: outputCartesian.y + outputElement.offsetTop
                    };

                    const newFromPos = {
                        x: outputPortPosition.x + OUTPUT_PORT_OFFSET_X,
                        y: outputPortPosition.y + OUTPUT_PORT_OFFSET_Y
                    };

                    setFromPos(newFromPos);
                    setToPos(store.mousePosition);

                    setPathString(
                        quadraticCurve(newFromPos, store.mousePosition)
                    );
                });
            }
        }, [output]);

        const handleClick = React.useCallback(() => {
            if (connection) {
                connection.dispose();

                posthog.capture('Connection removed on connection click');
            }
        }, [connection]);

        const selectedConnection =
            connection &&
            store.selectedNodes
                ?.flatMap(node => node.connections)
                .includes(connection as NodlConnection<unknown>);
        const strokeColor = selectedConnection || output ? '#444' : '#ced5db';

        return (
            <motion.g
                variants={{
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1,
                        transition: {
                            duration: 1
                        }
                    }
                }}
            >
                <path
                    className="connector"
                    d={pathString}
                    fill="none"
                    strokeWidth="2"
                    stroke={strokeColor}
                    onClick={handleClick}
                />
                <path
                    className="port"
                    d={`M${fromPos.x},${fromPos.y},${fromPos.x + 2},${fromPos.y}`}
                    fill="none"
                    strokeWidth="8"
                    stroke={strokeColor}
                />
                <path
                    className="port"
                    d={`M${toPos.x - 2},${toPos.y},${toPos.x},${toPos.y}`}
                    fill="none"
                    strokeWidth="8"
                    stroke={strokeColor}
                />
            </motion.g>
        );
    }
);
