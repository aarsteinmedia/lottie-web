import type CVMaskElement from '../../elements/canvas/CVMaskElement';
import type MaskElement from '../../elements/MaskElement';
import type { ElementInterfaceIntersect, ExpressionInterface, SourceRect } from '../../types';
import type { GroupEffectInterface } from '../../utils/expressions/EffectInterface';
import type ShapeExpressionInterface from '../../utils/expressions/shapes/ShapeInterface';
import type TextExpressionInterface from '../../utils/expressions/TextInterface';
import MaskManagerInterface from '../../utils/expressions/MaskInterface';
import TransformExpressionInterface from '../../utils/expressions/TransformInterface';
import Matrix from '../../utils/Matrix';
export default class LayerExpressionInterface {
    _elem: ElementInterfaceIntersect;
    _name?: string;
    anchor_point: ExpressionInterface;
    anchorPoint: ExpressionInterface;
    content?: ShapeExpressionInterface;
    effect: ExpressionInterface;
    height?: number;
    index?: number;
    inPoint: number;
    mask?: MaskManagerInterface;
    opacity: ExpressionInterface;
    outPoint: number;
    position: ExpressionInterface;
    rotation: ExpressionInterface;
    scale: ExpressionInterface;
    shapeInterface?: ShapeExpressionInterface;
    source?: string;
    sourceRectAtTime: () => SourceRect | null;
    startTime: number;
    text?: TextExpressionInterface;
    textInterface?: TextExpressionInterface;
    transformInterface: TransformExpressionInterface;
    width?: number;
    get active(): boolean | undefined;
    get hasParent(): boolean;
    get parent(): LayerExpressionInterface | null;
    get transform(): TransformExpressionInterface;
    constructor(elem: ElementInterfaceIntersect);
    applyPoint(matrix: Matrix, arr: number[]): number[];
    fromComp(arr: number[]): {
        x: number;
        y: number;
        z: number;
    };
    fromWorld(arr: number[], time: number): {
        x: number;
        y: number;
        z: number;
    };
    fromWorldVec(arr: number[], time: number): {
        x: number;
        y: number;
        z: number;
    };
    getInterface(name: string | number): unknown;
    getMatrix(time?: number): Matrix;
    invertPoint(matrix: Matrix, arr: number[]): {
        x: number;
        y: number;
        z: number;
    };
    registerEffectsInterface(effects: null | GroupEffectInterface): void;
    registerMaskInterface(maskManager: MaskElement | CVMaskElement): void;
    sampleImage(): number[];
    toComp(_arr: number[], _time: number): void;
    toWorld(arr: number[], time: number): number[];
    toWorldVec(arr: number[], time?: number): number[];
}
