import type ShapeGroupData from '../../elements/helpers/shapes/ShapeGroupData';
import type { BoundingBox, ElementInterfaceIntersect, GlobalData, LottieLayer, Shape, ShapeDataInterface, Transformer, Vector2 } from '../../types';
import type ValueProperty from '../../utils/properties/ValueProperty';
import ShapeElement from '../../elements/ShapeElement';
export default class HShapeElement extends ShapeElement {
    animatedContents: unknown[];
    currentBBox: BoundingBox;
    prevViewData: HShapeElement[];
    shapeBoundingBox: {
        bottom: number;
        left: number;
        right: number;
        top: number;
    };
    shapeCont?: SVGElement;
    shapesContainer: SVGGElement;
    stylesList: CSSStyleDeclaration[];
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
    renderInnerContent(): void;
    searchShapes(_shapes: Shape[], _itemsData: ShapeGroupData[], _prevViewData: HShapeElement[], _shapesContainer: SVGElement, _pos: number, _: unknown[], _flag: boolean): void;
}
