import type { ElementInterfaceIntersect, Shape, Vector3 } from '../types';
import type LayerExpressionInterface from '../utils/expressions/LayerInterface';
import DynamicPropertyContainer from '../utils/helpers/DynamicPropertyContainer';
import Matrix from '../utils/Matrix';
import { BaseProperty, type MultiDimensionalProperty, type ValueProperty } from '../utils/Properties';
export default class TransformProperty extends BaseProperty {
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
    propType: 'transform';
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
    constructor(elem: ElementInterfaceIntersect, data: Shape, container: ElementInterfaceIntersect);
    addDynamicProperty(prop: DynamicPropertyContainer): void;
    applyToMatrix(mat: Matrix): void;
    autoOrient(): void;
    getValue(forceRender?: boolean): void;
    precalculateMatrix(): void;
    setGroupProperty(_propertyGroup: LayerExpressionInterface): void;
}
declare const TransformPropertyFactory: {
    getTransformProperty: (elem: ElementInterfaceIntersect, data: Shape, container: ElementInterfaceIntersect) => TransformProperty;
};
export { TransformPropertyFactory };
