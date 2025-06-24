import type TransformEffect from '../../effects/TransformEffect';
import type ShapeGroupData from '../../elements/helpers/shapes/ShapeGroupData';
import type SVGGradientFillStyleData from '../../elements/helpers/shapes/SVGGradientFillStyleData';
import type { CanvasItem, CompElementInterface, CVElement, CVStyleElement, GlobalData, LottieLayer, Shape, Transformer } from '../../types';
import type { ShapeProperty } from '../../utils/shapes/properties/ShapeProperty';
import CVShapeData from '../../elements/helpers/shapes/CVShapeData';
import ShapeTransformManager from '../../elements/helpers/shapes/ShapeTransformManager';
import ShapeElement from '../../elements/ShapeElement';
export default class CVShapeElement extends ShapeElement {
    canvasContext?: CanvasRenderingContext2D;
    clearCanvas: (canvasContext?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null) => void;
    createContainerElements: () => void;
    createRenderableComponents: () => void;
    dashResetter: number[];
    exitLayer: () => void;
    hide: () => void;
    initRendererElement: () => void;
    prepareLayer: () => void;
    prevViewData: ShapeGroupData[];
    renderFrame: (forceRender?: number) => void;
    setBlendMode: () => void;
    show: () => void;
    stylesList: CVStyleElement[];
    transformHelper: Transformer;
    transformsManager: ShapeTransformManager;
    constructor(data: LottieLayer, globalData: GlobalData, comp: CompElementInterface);
    addTransformToStyleList(transform: Transformer): void;
    closeStyles(styles: CVStyleElement[]): void;
    createContent(): void;
    createGroupElement(_data?: Shape): {
        it: never[];
        prevViewData: never[];
    };
    createShapeElement(data: Shape): CVShapeData;
    createStyleElement(data: Shape, transforms: {
        transform: Transformer;
    }[]): CVElement | null;
    createTransformElement(data: Shape): {
        transform: Transformer;
    };
    destroy(): void;
    drawLayer(): void;
    reloadShapes(): void;
    removeTransformFromStyleList(): void;
    renderFill(_styleData: any, itemData: CanvasItem, groupTransform: TransformEffect): void;
    renderGradientFill(styleData: Shape, itemData: SVGGradientFillStyleData, groupTransform: TransformEffect): void;
    renderInnerContent(): void;
    renderPath(pathData: Shape, itemData: CVShapeData): void;
    renderShape(parentTransform: Transformer, items: Shape[], data: ShapeGroupData[], isMain?: boolean): void;
    renderShapeTransform(parentTransform: Transformer, groupTransform: Transformer): void;
    renderStroke(_styleData: Shape, itemData: CanvasItem, groupTransform: TransformEffect): void;
    renderStyledShape(styledShape: CVShapeData, shape: ShapeProperty): void;
    searchShapes(arr: Shape[], itemsData: CanvasItem[], prevViewData: CVShapeElement[], shouldRenderFromProps: boolean, transforms: Transformer[]): void;
}
