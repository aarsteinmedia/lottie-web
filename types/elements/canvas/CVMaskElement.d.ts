import type { ElementInterfaceIntersect, LottieLayer, Shape } from '../../types';
import { type ShapeProperty } from '../../utils/shapes/ShapeProperty';
export default class CVMaskElement {
    _isFirstFrame?: boolean;
    data: LottieLayer;
    element: ElementInterfaceIntersect;
    hasMasks: boolean;
    masksProperties: Shape[];
    viewData: ShapeProperty[];
    constructor(data: LottieLayer, element: ElementInterfaceIntersect);
    destroy(): void;
    getMaskProperty(_pos: number): void;
    renderFrame(): void;
}
