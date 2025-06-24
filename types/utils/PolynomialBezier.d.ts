import type { Vector2 } from '@/types';
import type ShapePath from '@/utils/shapes/ShapePath';
export default class PolynomialBezier {
    a: Vector2;
    b: Vector2;
    c: Vector2;
    d: Vector2;
    points: [Vector2, Vector2, Vector2, Vector2];
    constructor(p0: Vector2, p1FromProps: Vector2, p2FromProps: Vector2, p3: Vector2, linearize?: boolean);
    boundingBox(): {
        bottom: any;
        cx: number;
        cy: number;
        height: number;
        left: any;
        right: any;
        top: any;
        width: number;
    };
    bounds(): {
        x: {
            max: any;
            min: any;
        };
        y: {
            max: any;
            min: any;
        };
    };
    derivative(t: number): any[];
    inflectionPoints(): number[];
    intersections(other: PolynomialBezier, toleranceFromProps?: number, maxRecursionFromProps?: number): number[][];
    normalAngle(t: number): number;
    point(t: number): any[];
    split(t: number): PolynomialBezier[];
    tangentAngle(t: number): number;
    private _extrema;
}
export declare function shapeSegment(shapePath: ShapePath, index: number): PolynomialBezier;
export declare function shapeSegmentInverted(shapePath: ShapePath, index: number): PolynomialBezier;
