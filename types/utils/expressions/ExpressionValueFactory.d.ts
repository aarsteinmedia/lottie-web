import type { Vector2 } from '../../types';
import type { MultiDimensionalProperty, ValueProperty } from '../../utils/Properties';
declare const ExpressionPropertyInterface: (property?: ValueProperty | MultiDimensionalProperty<number[]>) => ValueProperty<number> | MultiDimensionalProperty<Vector2> | (() => {
    mult: number;
    pv: number;
    v: number;
});
export default ExpressionPropertyInterface;
