import type { ElementInterfaceIntersect, Shape } from '../../../types';
import type { ShapeModifierInterface } from '../../../utils/shapes/ShapeModifiers';
import RenderableDOMElement from '../../../elements/helpers/RenderableDOMElement';
import CVShapeData from '../../../elements/helpers/shapes/CVShapeData';
import ProcessedElement from '../../../elements/helpers/shapes/ProcessedElement';
import SVGShapeData from '../../../elements/helpers/shapes/SVGShapeData';
export default class ShapeElement extends RenderableDOMElement {
    _length?: number;
    processedElements: ProcessedElement[];
    shapeModifiers: ShapeModifierInterface[];
    shapes: (SVGShapeData | CVShapeData)[];
    addProcessedElement(elem: ElementInterfaceIntersect, pos: number): void;
    addShapeToModifiers(data: SVGShapeData | CVShapeData): void;
    isShapeInAnimatedModifiers(data: Shape): boolean;
    prepareFrame(num: number): void;
    renderModifiers(): void;
    searchProcessedElement(elem: unknown): number;
}
