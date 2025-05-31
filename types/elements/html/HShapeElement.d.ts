import type ShapeGroupData from '../../elements/helpers/shapes/ShapeGroupData';
import type { BoundingBox, CompElementInterface, ElementInterfaceIntersect, GlobalData, LottieLayer, Shape, ShapeDataInterface, Transformer, Vector2 } from '../../types';
import type { ValueProperty } from '../../utils/Properties';
import RenderableElement from '../../elements/helpers/RenderableElement';
export default class HShapeElement extends RenderableElement {
    animatedContents: any[];
    currentBBox: BoundingBox;
    prevViewData: HShapeElement[];
    processedElements: any[];
    shapeBoundingBox: {
        bottom: number;
        left: number;
        right: number;
        top: number;
    };
    shapeCont?: SVGElement;
    shapeModifiers: any[];
    shapes: Shape[];
    shapesContainer: SVGGElement;
    stylesList: any[];
    svgElement?: SVGSVGElement;
    tempBoundingBox: {
        height: number;
        width: number;
        x: number;
        xMax: number;
        y: number;
        yMax: number;
    };
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    _renderShapeFrame(): void;
    calculateBoundingBox(itemsData: ShapeDataInterface[], boundingBox: BoundingBox): void;
    calculateF(t: number, p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, i: number): number;
    calculateShapeBoundingBox(item: ShapeDataInterface, boundingBox: BoundingBox): void;
    checkBounds(vPoint: Vector2, oPoint: Vector2, nextIPoint: Vector2, nextVPoint: Vector2, boundingBox: BoundingBox): void;
    createContent(): void;
    currentBoxContains(box: BoundingBox): boolean;
    expandStrokeBoundingBox(widthProperty: ValueProperty, boundingBox: BoundingBox): void;
    filterUniqueShapes(): void;
    getBoundsOfCurve(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2): void;
    getTransformedPoint(transformers: Transformer[], pointFromProps: number[]): number[];
    initElement(_data: LottieLayer, _globalData: GlobalData, _comp: CompElementInterface): void;
    renderInnerContent(): void;
    searchShapes(_shapes: Shape[], _itemsData: ShapeGroupData[], _prevViewData: HShapeElement[], _shapesContainer: SVGElement, _pos: number, _: unknown[], _flag: boolean): void;
}
