import type { Vector2 } from '../../types';
import type { TransformProperty } from '../../utils/TransformProperty';
import type { MultiDimensionalProperty, ValueProperty } from '../Properties';
export default class TransformExpressionInterface {
    transform: TransformProperty;
    get anchorPoint(): Vector2;
    get opacity(): ValueProperty<number> | MultiDimensionalProperty<Vector2> | (() => {
        mult: number;
        pv: number;
        v: number;
    });
    get orientation(): ValueProperty<number> | MultiDimensionalProperty<Vector2> | (() => {
        mult: number;
        pv: number;
        v: number;
    });
    get position(): ValueProperty<number> | MultiDimensionalProperty<number[]> | void[];
    get rotation(): ValueProperty<number> | MultiDimensionalProperty<Vector2> | (() => {
        mult: number;
        pv: number;
        v: number;
    });
    get scale(): ValueProperty<number> | MultiDimensionalProperty<Vector2> | (() => {
        mult: number;
        pv: number;
        v: number;
    });
    get skew(): ValueProperty<number> | MultiDimensionalProperty<Vector2> | (() => {
        mult: number;
        pv: number;
        v: number;
    });
    get skewAxis(): ValueProperty<number> | MultiDimensionalProperty<Vector2> | (() => {
        mult: number;
        pv: number;
        v: number;
    });
    get xPosition(): ValueProperty<number> | MultiDimensionalProperty<Vector2> | (() => {
        mult: number;
        pv: number;
        v: number;
    });
    get xRotation(): ValueProperty<number> | MultiDimensionalProperty<Vector2> | (() => {
        mult: number;
        pv: number;
        v: number;
    });
    get yPosition(): ValueProperty<number> | MultiDimensionalProperty<Vector2> | (() => {
        mult: number;
        pv: number;
        v: number;
    });
    get yRotation(): ValueProperty<number> | MultiDimensionalProperty<Vector2> | (() => {
        mult: number;
        pv: number;
        v: number;
    });
    get zPosition(): ValueProperty<number> | MultiDimensionalProperty<Vector2> | (() => {
        mult: number;
        pv: number;
        v: number;
    });
    get zRotation(): ValueProperty<number> | MultiDimensionalProperty<Vector2> | (() => {
        mult: number;
        pv: number;
        v: number;
    });
    constructor(transform: TransformProperty);
    _px(): void;
    _py(): void;
    _pz(): void;
    _transformFactory(): ValueProperty | MultiDimensionalProperty<number[]>;
    getProperty(name: string | number): ValueProperty<number> | Vector2 | MultiDimensionalProperty<number[]> | (() => {
        mult: number;
        pv: number;
        v: number;
    }) | void[] | null;
}
