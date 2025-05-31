import type { ElementInterfaceIntersect, GlobalData, LottieAsset, LottieLayer } from '../../types';
import RenderableElement from '../../elements/helpers/RenderableElement';
export default class CVImageElement extends RenderableElement {
    assetData: LottieAsset | null;
    canvasContext?: CanvasRenderingContext2D;
    clearCanvas: (canvasContext?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null) => void;
    createContainerElements: () => void;
    createElements: () => void;
    createRenderableComponents: () => void;
    exitLayer: () => void;
    hideElement: () => void;
    img: HTMLCanvasElement;
    initElement: (data: LottieLayer, globalData: GlobalData, comp: import("../../types").CompElementInterface) => void;
    initRendererElement: () => void;
    prepareFrame: (num: number) => void;
    prepareLayer: () => void;
    renderFrame: (forceRender?: number) => void;
    setBlendMode: () => void;
    show: () => void;
    showElement: () => void;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    createContent(): void;
    destroy(): void;
    renderInnerContent(): void;
}
