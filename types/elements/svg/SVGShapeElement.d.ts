import type { AnimatedContent, ElementInterfaceIntersect, GlobalData, LottieLayer, Shape, ShapeDataInterface, SVGElementInterface, Transformer } from '../../types';
import { ShapeGroupData, SVGFillStyleData, SVGGradientFillStyleData, SVGNoStyleData, SVGShapeData, SVGStrokeStyleData, SVGStyleData, SVGTransformData } from '../../elements/helpers/shapes';
import ShapeElement from '../../elements/ShapeElement';
export default class SVGShapeElement extends ShapeElement {
    _debug?: boolean;
    animatedContents: AnimatedContent[];
    prevViewData: SVGElementInterface[];
    stylesList: SVGStyleData[];
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    addToAnimatedContents(data: Shape, element: SVGElementInterface): void;
    buildExpressionInterface(): void;
    createContent(): void;
    createGroupElement(data: Shape): ShapeGroupData;
    createShapeElement(data: Shape, ownTransformers: Transformer[], level: number): SVGShapeData;
    createStyleElement(data: Shape, level: number): SVGStrokeStyleData | SVGFillStyleData | SVGNoStyleData | SVGGradientFillStyleData | null;
    createTransformElement(data: Shape, container: SVGGElement): SVGTransformData;
    destroy(): void;
    filterUniqueShapes(): void;
    getBaseElement(): void;
    getMatte(_type?: number): void;
    initSecondaryElement(): void;
    reloadShapes(): void;
    renderInnerContent(): void;
    renderShape(): void;
    searchShapes(arr: Shape[], itemsData: SVGElementInterface[], prevViewData: SVGElementInterface[], container: SVGGElement, level: number, transformers: Transformer[], renderFromProps: boolean): void;
    setElementStyles(elementData: SVGShapeData): void;
    setMatte(_id: string): void;
    setShapesAsAnimated(shapes: ShapeDataInterface[]): void;
}
