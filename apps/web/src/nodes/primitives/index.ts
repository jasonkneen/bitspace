import { NodeType } from '@prisma/client';
import { Image } from './Image/Image';

export const PrimitiveNodes = [Image].sort((a, b) =>
    a.displayName.localeCompare(b.displayName)
);

export type PrimitiveNode = Image;

export interface PrimitiveNodeConstructor {
    new (): PrimitiveNode;
    type: NodeType;
}