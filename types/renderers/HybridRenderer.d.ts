import type { AnimationItem } from '../Lottie';
import type { HTMLRendererConfig, LottieLayer } from '../types';
import HCompElement from '../elements/html/HCompElement';
import SVGCompElement from '../elements/svg/SVGCompElement';
import HybridRendererBase from '../renderers/HybridRendererBase';
export default class HybridRenderer extends HybridRendererBase {
    constructor(animationItem: AnimationItem, config?: HTMLRendererConfig);
    createComp(data: LottieLayer): HCompElement | SVGCompElement;
}
