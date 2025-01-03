import { useEffect, useMemo, useState } from 'react';
import Draggable, { DraggableProps } from 'react-draggable';

export interface CubicBezierProps {
    defaultinternalPoints?: [number, number, number, number];
    points: [number, number, number, number];
    size?: number;
    onChange: (internalPoints: [number, number, number, number]) => void;
}

export const CubicBezier = ({
    defaultinternalPoints,
    points,
    onChange,
    size = 222
}: CubicBezierProps) => {
    const [internalPoints, setInternalPoints] = useState<
        [number, number, number, number]
    >(defaultinternalPoints ?? [0, 0, 1, 1]);

    const [xy1, xy2] = useMemo(() => {
        const [x1, y1, x2, y2] = internalPoints;

        const xy1 = { x: x1 * size, y: size - y1 * size };
        const xy2 = { x: x2 * size, y: size - y2 * size };

        return [xy1, xy2];
    }, [internalPoints]);

    useEffect(() => {
        setInternalPoints(points);
    }, [points]);

    const subdivision = Math.round(size / 4);
    const subdivisionColor = `#f1f5f9`;
    const subdivisionWidth = 2;
    const handleColor = `#94a3b8`;

    return (
        <div className="relative h-[226px] w-full">
            <svg
                className="rounded-3xl"
                viewBox={`0 0 ${size} ${size}`}
                height={size}
                width={size}
                xmlns="http://www.w3.org/2000/svg"
            >
                {/** Subdivision Lines */}
                {Array.from({ length: 3 }).map((_, i) => (
                    <line
                        key={i}
                        x1={subdivision * (i + 1)}
                        x2={subdivision * (i + 1)}
                        y1={0}
                        y2={size}
                        stroke={subdivisionColor}
                        strokeWidth={subdivisionWidth}
                    />
                ))}
                {Array.from({ length: 3 }).map((_, i) => (
                    <line
                        key={i}
                        x1={0}
                        x2={size}
                        y1={subdivision * (i + 1)}
                        y2={subdivision * (i + 1)}
                        stroke={subdivisionColor}
                        strokeWidth={subdivisionWidth}
                    />
                ))}

                {/** Handle Lines */}
                <line
                    x1={0}
                    x2={xy1.x}
                    y1={size}
                    y2={xy1.y}
                    stroke={handleColor}
                    strokeWidth="2"
                />
                <line
                    x1={size}
                    x2={xy2.x}
                    y1={0}
                    y2={xy2.y}
                    stroke={handleColor}
                    strokeWidth="2"
                />

                {/** Curve */}
                <path
                    d={`M 0 ${size} C ${xy1.x} ${xy1.y}, ${xy2.x} ${xy2.y}, ${size} 0`}
                    stroke="#0000ff"
                    strokeWidth={2}
                    fill="none"
                />
            </svg>
            <ControlPoint
                position={xy1}
                onDrag={(e, data) => {
                    setInternalPoints(internalPoints => {
                        const p = [
                            data.x / size,
                            1 - data.y / size,
                            internalPoints[2],
                            internalPoints[3]
                        ] as [number, number, number, number];
                        onChange(p as [number, number, number, number]);
                        return p;
                    });
                }}
                editorSize={size}
            />
            <ControlPoint
                position={xy2}
                onDrag={(e, data) => {
                    setInternalPoints(internalPoints => {
                        const p = [
                            internalPoints[0],
                            internalPoints[1],
                            data.x / size,
                            1 - data.y / size
                        ] as [number, number, number, number];
                        onChange(p as [number, number, number, number]);
                        return p;
                    });
                }}
                editorSize={size}
            />
        </div>
    );
};

const ControlPoint = ({
    editorSize,
    ...props
}: Partial<DraggableProps> & { editorSize: number }) => {
    return (
        <Draggable
            {...props}
            onMouseDown={e => e.stopPropagation()}
            bounds={{
                left: 0,
                right: editorSize,
                top: 0,
                bottom: editorSize
            }}
        >
            <div className="w-2 h-2 rounded-full bg-[#94a3b8] absolute -top-1 -left-1" />
        </Draggable>
    );
};
