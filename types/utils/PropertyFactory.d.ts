import type { ElementInterfaceIntersect, ExpressionProperty, VectorProperty } from '../types';
import { KeyframedMultidimensionalProperty } from '../utils/properties/KeyframedMultidimensionalProperty';
import { KeyframedValueProperty } from '../utils/properties/KeyframedValueProperty';
import { MultiDimensionalProperty } from '../utils/properties/MultiDimensionalProperty';
import { NoProperty } from '../utils/properties/NoProperty';
import { ValueProperty } from '../utils/properties/ValueProperty';
declare function getProp<T = number | number[]>(elem: ElementInterfaceIntersect, dataFromProps?: VectorProperty<T> | ExpressionProperty, type?: number, mult?: null | number, container?: ElementInterfaceIntersect): ValueProperty<number> | KeyframedValueProperty | NoProperty | MultiDimensionalProperty<number[]> | KeyframedMultidimensionalProperty<import("../types").Vector2>;
declare const PropertyFactory: {
    getProp: typeof getProp;
};
export default PropertyFactory;
