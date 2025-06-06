import type CVBaseElement from '../../elements/canvas/CVBaseElement';
import type CVShapeElement from '../../elements/canvas/CVShapeElement';
import type { LottieLayer, Shape } from '../../types';
import type { ShapeProperty } from '../../utils/shapes/properties/ShapeProperty';
export default class CVMaskElement {
    _isFirstFrame?: boolean;
    data: LottieLayer;
    element: CVShapeElement | CVBaseElement;
    hasMasks: boolean;
    masksProperties: Shape[];
    viewData: ShapeProperty[];
    constructor(data: LottieLayer, element: CVShapeElement | CVBaseElement);
    destroy(): void;
    getMaskProperty(pos: number): ShapeProperty;
    renderFrame(_num?: number): void;
}
