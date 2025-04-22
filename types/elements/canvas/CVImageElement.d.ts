import type { ElementInterfaceIntersect, GlobalData, LottieAsset, LottieLayer } from '../../types';
import RenderableElement from '../../elements/helpers/RenderableElement';
export default class CVImageElement extends RenderableElement {
    assetData: LottieAsset | null;
    canvasContext?: CanvasRenderingContext2D;
    img: HTMLCanvasElement;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    clearCanvas(): void;
    createContainerElements(): void;
    createContent(): void;
    createElements(): void;
    createRenderableComponents(): void;
    destroy(): void;
    exitLayer(): void;
    hideElement(): void;
    initElement(_data: LottieLayer, _globalData: GlobalData, _comp: ElementInterfaceIntersect): void;
    initRendererElement(): void;
    prepareFrame(_num: number): void;
    prepareLayer(): void;
    renderFrame(): void;
    renderInnerContent(): void;
    setMatte(): void;
    showElement(): void;
}
