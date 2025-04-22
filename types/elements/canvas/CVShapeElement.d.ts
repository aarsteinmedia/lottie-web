import type TransformEffect from '../../effects/TransformEffect';
import type { CompElementInterface, CVElement, CVStyleElement, GlobalData, LottieLayer, Shape, Transformer } from '../../types';
import type { ShapeProperty } from '../../utils/shapes/ShapeProperty';
import CVShapeData from '../../elements/helpers/shapes/CVShapeData';
import ShapeElement from '../../elements/helpers/shapes/ShapeElement';
import ShapeGroupData from '../../elements/helpers/shapes/ShapeGroupData';
import ShapeTransformManager from '../../elements/helpers/shapes/ShapeTransformManager';
import TransformProperty from '../../utils/TransformProperty';
export default class CVShapeElement extends ShapeElement {
    canvasContext?: CanvasRenderingContext2D;
    dashResetter: never[];
    prevViewData: ShapeGroupData[];
    stylesList: CVStyleElement[];
    transformHelper: TransformProperty;
    transformsManager: ShapeTransformManager;
    constructor(data: LottieLayer, globalData: GlobalData, comp: CompElementInterface);
    addTransformToStyleList(transform: Transformer): void;
    clearCanvas(_canvasContext?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null): void;
    closeStyles(styles: CVStyleElement[]): void;
    createContent(): void;
    createElements(): void;
    createGroupElement(_data?: Shape): {
        it: never[];
        prevViewData: never[];
    };
    createShapeElement(data: Shape): CVShapeData;
    createStyleElement(data: Shape, transforms: Transformer[]): CVElement;
    createTransformElement(data: Shape): {
        transform: Transformer;
    };
    destroy(): void;
    drawLayer(): void;
    exitLayer(): void;
    hideElement(): void;
    prepareLayer(): void;
    reloadShapes(): void;
    removeTransformFromStyleList(): void;
    renderFill(_styleData: any, itemData: any, groupTransform: TransformEffect): void;
    renderGradientFill(styleData: any, itemData: any, groupTransform: TransformEffect): void;
    renderInnerContent(): void;
    renderPath(pathData: Shape, itemData: CVShapeData): void;
    renderShape(parentTransform: TransformProperty, items: Shape[], data: ShapeGroupData[], isMain?: boolean): void;
    renderShapeTransform(parentTransform: TransformEffect, groupTransform: TransformEffect): void;
    renderStroke(_styleData: any, itemData: any, groupTransform: TransformEffect): void;
    renderStyledShape(styledShape: CVShapeData, shape: ShapeProperty): void;
    searchShapes(arr: Shape[], itemsData: any[], prevViewData: CVShapeElement[], shouldRenderFromProps: boolean, transforms: Transformer[]): void;
    showElement(): void;
}
