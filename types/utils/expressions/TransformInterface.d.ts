import type { Vector2 } from '../../types';
import type { TransformProperty } from '../../utils/TransformProperty';
import type { MultiDimensionalProperty, ValueProperty } from '../Properties';
export default class TransformExpressionInterface {
    transform: TransformProperty;
    get anchorPoint(): Vector2;
    get opacity(): ValueProperty<number> | (() => {
        mult: number;
        pv: number;
        v: number;
    }) | MultiDimensionalProperty<Vector2>;
    get orientation(): ValueProperty<number> | (() => {
        mult: number;
        pv: number;
        v: number;
    }) | MultiDimensionalProperty<Vector2>;
    get position(): ValueProperty<number> | MultiDimensionalProperty<number[]> | void[];
    get rotation(): ValueProperty<number> | (() => {
        mult: number;
        pv: number;
        v: number;
    }) | MultiDimensionalProperty<Vector2>;
    get scale(): ValueProperty<number> | (() => {
        mult: number;
        pv: number;
        v: number;
    }) | MultiDimensionalProperty<Vector2>;
    get skew(): ValueProperty<number> | (() => {
        mult: number;
        pv: number;
        v: number;
    }) | MultiDimensionalProperty<Vector2>;
    get skewAxis(): ValueProperty<number> | (() => {
        mult: number;
        pv: number;
        v: number;
    }) | MultiDimensionalProperty<Vector2>;
    get xPosition(): ValueProperty<number> | (() => {
        mult: number;
        pv: number;
        v: number;
    }) | MultiDimensionalProperty<Vector2>;
    get xRotation(): ValueProperty<number> | (() => {
        mult: number;
        pv: number;
        v: number;
    }) | MultiDimensionalProperty<Vector2>;
    get yPosition(): ValueProperty<number> | (() => {
        mult: number;
        pv: number;
        v: number;
    }) | MultiDimensionalProperty<Vector2>;
    get yRotation(): ValueProperty<number> | (() => {
        mult: number;
        pv: number;
        v: number;
    }) | MultiDimensionalProperty<Vector2>;
    get zPosition(): ValueProperty<number> | (() => {
        mult: number;
        pv: number;
        v: number;
    }) | MultiDimensionalProperty<Vector2>;
    get zRotation(): ValueProperty<number> | (() => {
        mult: number;
        pv: number;
        v: number;
    }) | MultiDimensionalProperty<Vector2>;
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
