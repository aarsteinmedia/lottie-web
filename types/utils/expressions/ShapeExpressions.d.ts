import type { SegmentLength } from '../../types';
import type ShapePath from '../../utils/shapes/ShapePath';
import { ShapeProperty } from '../../utils/shapes/ShapeProperty';
export default abstract class ShapeExpressions extends ShapeProperty {
    _segmentsLength?: SegmentLength;
    getValueAtTime: (this: import("../Properties").BaseProperty, _time?: number, _num?: number) => string | number | number[] | ShapePath | import("../../types").DocumentData | undefined;
    setGroupProperty: (this: import("../Properties").BaseProperty, propertyGroup: import("./PropertyGroupFactory").default) => void;
    inTangents(time: number): unknown[];
    isClosed(): boolean;
    normalOnPath(perc: number, time: number): number[];
    outTangents(time: number): unknown[];
    pointOnPath(perc: number, time?: number): number[] | undefined;
    points(time: number): unknown[];
    tangentOnPath(perc: number, time: number): number[];
    vectorOnPath(percFromProps: number, time: number, vectorType: string): number[];
    vertices(prop: keyof ShapePath, time?: number): unknown[];
}
