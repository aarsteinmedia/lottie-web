import type { ElementInterfaceIntersect, VectorProperty } from '../types';
import { KeyframedMultidimensionalProperty, KeyframedValueProperty, MultiDimensionalProperty, NoProperty, ValueProperty } from '../utils/Properties';
export default function PropertyFactory(elem: ElementInterfaceIntersect, dataFromProps?: VectorProperty<number | number[]>, type?: number, mult?: null | number, container?: ElementInterfaceIntersect): ValueProperty<number> | KeyframedValueProperty | NoProperty | MultiDimensionalProperty<number[]> | KeyframedMultidimensionalProperty<import("../types").Vector2>;
