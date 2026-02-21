import type { AnimationItem } from '../animation/AnimationItem';
import type { LottieLayer, SVGRendererConfig } from '../types';
import { SVGCompElement } from '../elements/svg/SVGCompElement';
import { SVGRendererBase } from '../renderers/SVGRendererBase';
import { RendererType } from '../utils/enums';
export declare class SVGRenderer extends SVGRendererBase {
    rendererType: RendererType;
    constructor(animationItem: AnimationItem, config?: SVGRendererConfig);
    createComp(data: LottieLayer): SVGCompElement;
}
