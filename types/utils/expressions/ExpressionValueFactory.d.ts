import type { Vector2 } from '../../types';
import type { MultiDimensionalProperty, ValueProperty } from '../../utils/Properties';
declare const ExpressionPropertyInterface: (property?: ValueProperty | MultiDimensionalProperty<number[]>) => ValueProperty<number> | (() => {
    mult: number;
    pv: number;
    v: number;
}) | MultiDimensionalProperty<Vector2>;
export default ExpressionPropertyInterface;
