import type ShapeElement from '../../../elements/helpers/shapes/ShapeElement';
import type { CVStyleElement, Shape } from '../../../types';
import ShapeTransformManager from '../../../elements/helpers/shapes/ShapeTransformManager';
import { type ShapeProperty } from '../../../utils/shapes/ShapeProperty';
export default class CVShapeData {
    _isAnimated?: boolean;
    sh: ShapeProperty | null;
    styledShapes: CVShapeData[];
    tr: number[];
    transforms: ReturnType<typeof ShapeTransformManager.prototype.addTransformSequence>;
    trNodes: any[];
    constructor(element: ShapeElement, data: Shape, styles: CVStyleElement[], transformsManager: ShapeTransformManager);
    setAsAnimated(): void;
}
