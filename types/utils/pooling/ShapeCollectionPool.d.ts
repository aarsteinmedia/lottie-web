import ShapeCollection from '@/utils/shapes/ShapeCollection';
export declare function newShapeCollection(): ShapeCollection;
export declare function releaseShape(shapeCollection: ShapeCollection): void;
declare const ShapeCollectionPool: {
    newShapeCollection: typeof newShapeCollection;
    releaseShape: typeof releaseShape;
};
export default ShapeCollectionPool;
