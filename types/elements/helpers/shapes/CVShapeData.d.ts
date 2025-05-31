import type CVShapeElement from '@/elements/canvas/CVShapeElement';
import type ShapeTransformManager from '@/elements/helpers/shapes/ShapeTransformManager';
import type { CVStyleElement, Shape } from '@/types';
import ShapeData from '@/elements/helpers/shapes/ShapeData';
export default class CVShapeData extends ShapeData {
    constructor(element: CVShapeElement, data: Shape, styles: CVStyleElement[], transformsManager: ShapeTransformManager);
}
