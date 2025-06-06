import type { ElementInterfaceIntersect, Shape, Vector3 } from '../types';
import type DynamicPropertyContainer from '../utils/helpers/DynamicPropertyContainer';
import type MultiDimensionalProperty from '../utils/properties/MultiDimensionalProperty';
import type ValueProperty from '../utils/properties/ValueProperty';
import Matrix from '../utils/Matrix';
import BaseProperty from '../utils/properties/BaseProperty';
export declare class TransformProperty extends BaseProperty {
    _isDirty?: boolean;
    _opMdf?: boolean;
    _transformCachingAtTime?: {
        v: Matrix;
    };
    a?: MultiDimensionalProperty<number[]>;
    appliedTransformations: number;
    autoOriented?: boolean;
    data: Shape;
    elem: ElementInterfaceIntersect;
    o?: ValueProperty;
    opacity?: number;
    or?: MultiDimensionalProperty<Vector3>;
    p?: MultiDimensionalProperty<Vector3>;
    pre: Matrix;
    px?: ValueProperty;
    py?: ValueProperty;
    pz?: ValueProperty;
    r?: ValueProperty;
    rx?: ValueProperty;
    ry?: ValueProperty;
    rz?: ValueProperty;
    s?: MultiDimensionalProperty<Vector3>;
    sa?: ValueProperty;
    sk?: ValueProperty;
    v: Matrix;
    private defaultVector;
    constructor(elem: ElementInterfaceIntersect, data: Shape, container: ElementInterfaceIntersect | null);
    addDynamicProperty(prop: DynamicPropertyContainer): void;
    applyToMatrix(mat: Matrix): void;
    autoOrient(): void;
    getValue(forceRender?: boolean): number;
    precalculateMatrix(): void;
}
declare const TransformPropertyFactory: {
    getTransformProperty: (elem: ElementInterfaceIntersect, data: Shape, container: ElementInterfaceIntersect) => TransformProperty;
};
export default TransformPropertyFactory;
