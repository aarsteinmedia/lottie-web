import type CVShapeElement from '../../../elements/canvas/CVShapeElement';
import type ShapeTransformManager from '../../../elements/helpers/shapes/ShapeTransformManager';
import type { CVStyleElement, Shape } from '../../../types';
import type Matrix from '../../../utils/Matrix';
import { type ShapeProperty } from '../../../utils/shapes/ShapeProperty';
export default class CVShapeData {
    _isAnimated?: boolean;
    sh: ShapeProperty | null;
    styledShapes: CVShapeData[];
    tr: number[];
    transforms?: {
        finalTransform: Matrix;
    };
    trNodes: any[];
    constructor(element: CVShapeElement, data: Shape, styles: CVStyleElement[], transformsManager: ShapeTransformManager);
    setAsAnimated(): void;
}
