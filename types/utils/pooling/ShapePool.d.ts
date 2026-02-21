import type { PoolElement } from '../../types';
import { ShapePath } from '../../utils/shapes/ShapePath';
export declare const newElement: () => PoolElement, release: (element: PoolElement) => void;
export declare function clone(shape: ShapePath): ShapePath;
declare const ShapePool: {
    clone: typeof clone;
    newElement: () => PoolElement;
};
export default ShapePool;
