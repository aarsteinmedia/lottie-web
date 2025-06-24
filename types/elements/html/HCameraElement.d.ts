import type HCompElement from '@/elements/html/HCompElement';
import type { ElementInterfaceIntersect, GlobalData, LottieLayer, Vector3 } from '@/types';
import type ValueProperty from '@/utils/properties/ValueProperty';
import FrameElement from '@/elements/helpers/FrameElement';
import Matrix from '@/utils/Matrix';
export default class HCameraElement extends FrameElement {
    _prevMat: Matrix;
    a?: ValueProperty<Vector3>;
    comp?: HCompElement;
    mat?: Matrix;
    or?: ValueProperty<Vector3>;
    p?: ValueProperty<number[]>;
    pe?: ValueProperty;
    px?: ValueProperty;
    py?: ValueProperty;
    pz?: ValueProperty;
    rx?: ValueProperty;
    ry?: ValueProperty;
    rz?: ValueProperty;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    createElements(): void;
    getBaseElement(): null;
    hide(): void;
    prepareFrame(num: number): void;
    renderFrame(_val?: number): void;
    setup(): void;
}
