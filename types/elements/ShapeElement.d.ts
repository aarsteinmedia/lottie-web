import type { ElementInterfaceIntersect, Shape } from '../types';
import type { ShapeModifierInterface } from '../utils/shapes/ShapeModifiers';
import RenderableDOMElement from '../elements/helpers/RenderableDOMElement';
import { ProcessedElement, type SVGShapeData } from '../elements/helpers/shapes';
export default class ShapeElement extends RenderableDOMElement {
    _length?: number;
    processedElements: ProcessedElement[];
    shapeModifiers: ShapeModifierInterface[];
    shapes: SVGShapeData[];
    addProcessedElement(elem: ElementInterfaceIntersect, pos: number): void;
    addShapeToModifiers(data: SVGShapeData): void;
    isShapeInAnimatedModifiers(data: Shape): boolean;
    prepareFrame(num: number): void;
    renderModifiers(): void;
    searchProcessedElement(elem: unknown): number;
}
