import type { ElementInterfaceIntersect, Vector2, Vector4 } from '../../types';
import type ShapeExpressionInterface from '../../utils/expressions/ShapeInterface';
import type TextExpressionInterface from '../../utils/expressions/TextInterface';
import MaskElement from '../../elements/MaskElement';
import MaskManager from '../../utils/expressions/MaskInterface';
import TransformExpressionInterface from '../../utils/expressions/TransformInterface';
import Matrix from '../../utils/Matrix';
export default class LayerExpressionInterface {
    _elem: ElementInterfaceIntersect;
    _name: string;
    active?: boolean;
    anchor_point: any;
    anchorPoint: any;
    content?: ShapeExpressionInterface;
    effect: any;
    hasParent: boolean;
    height?: number;
    index?: number;
    inPoint: number;
    mask?: MaskManager;
    opacity: any;
    outPoint: number;
    parent?: LayerExpressionInterface;
    position: Vector2;
    rotation: number;
    scale: number;
    shapeInterface?: ShapeExpressionInterface;
    source?: string;
    startTime: number;
    text?: TextExpressionInterface;
    textInterface?: TextExpressionInterface;
    transform?: TransformExpressionInterface;
    transformInterface: TransformExpressionInterface;
    width?: number;
    constructor(elem: ElementInterfaceIntersect);
    anchorPointDescriptor(): Vector2;
    applyPoint(matrix: Matrix, arr: number[]): number[];
    fromComp(arr: number[]): {
        x: number;
        y: number;
        z: number;
    };
    fromWorld(arr: number[], time?: number): {
        x: number;
        y: number;
        z: number;
    };
    fromWorldVec(arr: number[], time?: number): {
        x: number;
        y: number;
        z: number;
    };
    getMatrix(time?: number): Matrix;
    invertPoint(matrix: Matrix, arr: number[]): {
        x: number;
        y: number;
        z: number;
    };
    registerEffectsInterface(effects: any): void;
    registerMaskInterface(maskManager: MaskElement): void;
    sampleImage(): Vector4;
    sourceRectAtTime(): void;
    toComp(_arr: number[], _time?: number): void;
    toWorld(arr: number[], time?: number): number[];
    toWorldVec(arr: number[], time?: number): number[];
}
