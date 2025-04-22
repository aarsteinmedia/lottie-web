import type { MultiDimensionalProperty, ValueProperty } from '../../utils/Properties';
import { Vector2 } from '../../Lottie';
declare const ExpressionPropertyInterface: (property?: ValueProperty | MultiDimensionalProperty<number[]>) => ValueProperty<number> | (() => {
    mult: number;
    pv: number;
    v: number;
}) | MultiDimensionalProperty<Vector2>;
export default ExpressionPropertyInterface;
