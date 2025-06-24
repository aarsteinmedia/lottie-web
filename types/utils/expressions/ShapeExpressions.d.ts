import type { SegmentLength } from '@/types';
import type ShapePath from '@/utils/shapes/ShapePath';
import { ShapeProperty } from '@/utils/shapes/properties/ShapeProperty';
export default abstract class ShapeExpressions extends ShapeProperty {
    _segmentsLength?: SegmentLength;
    getValueAtTime: any;
    setGroupProperty: any;
    inTangents(time: number): any;
    isClosed(): boolean;
    normalOnPath(perc: number, time: number): number[];
    outTangents(time: number): any;
    pointOnPath(perc: number, time?: number): any;
    points(time: number): any;
    tangentOnPath(perc: number, time: number): number[];
    vectorOnPath(percFromProps: number, time: number, vectorType: string): number[];
    vertices(prop: keyof ShapePath, time?: number): any;
}
