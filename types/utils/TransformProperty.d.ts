import type { ElementInterfaceIntersect, Shape, Vector3 } from '../types';
import type { MultiDimensionalProperty, ValueProperty } from '../utils/Properties';
import DynamicPropertyContainer from '../utils/helpers/DynamicPropertyContainer';
import Matrix from '../utils/Matrix';
export default class TransformProperty extends DynamicPropertyContainer {
    _isDirty?: boolean;
    a?: MultiDimensionalProperty<Vector3>;
    appliedTransformations: number;
    autoOriented?: boolean;
    data: Shape;
    elem: ElementInterfaceIntersect;
    frameId: number;
    o?: ValueProperty;
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
}
