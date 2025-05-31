import type CVShapeData from '@/elements/helpers/shapes/CVShapeData';
import type SVGShapeData from '@/elements/helpers/shapes/SVGShapeData';
import type { ElementInterfaceIntersect, Shape } from '@/types';
import type { ShapeModifierInterface } from '@/utils/shapes/ShapeModifiers';
import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement';
import ProcessedElement from '@/elements/helpers/shapes/ProcessedElement';
export default abstract class ShapeElement extends RenderableDOMElement {
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
