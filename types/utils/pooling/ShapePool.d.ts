import ShapePath from '@/utils/shapes/ShapePath';
export declare const newElement: any, release: any;
export declare function clone(shape: ShapePath): ShapePath;
declare const ShapePool: {
    clone: typeof clone;
    newElement: any;
};
export default ShapePool;
