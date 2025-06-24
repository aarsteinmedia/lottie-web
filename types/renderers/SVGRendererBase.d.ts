import type { AnimationData, ElementInterfaceIntersect, LottieLayer, SVGRendererConfig } from '@/types';
import BaseRenderer from '@/renderers/BaseRenderer';
export default abstract class SVGRendererBase extends BaseRenderer {
    destroyed?: boolean;
    renderConfig?: SVGRendererConfig;
    svgElement?: SVGSVGElement;
    appendElementInPos(element: ElementInterfaceIntersect, pos: number): void;
    buildItem(pos: number): void;
    checkPendingElements(): void;
    configAnimation(animData: AnimationData): void;
    createImage(data: LottieLayer): any;
    createNull(data: LottieLayer): any;
    createShape(data: LottieLayer): any;
    createSolid(data: LottieLayer): any;
    createText(data: LottieLayer): any;
    destroy(): void;
    findIndexByInd(ind?: number): number;
    hide(): void;
    renderFrame(numFromProps?: number | null): void;
    show(): void;
    updateContainerSize(_width?: number, _height?: number): void;
}
