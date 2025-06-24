import type { LottieLayer } from '../types';
import HCompElement from '../elements/html/HCompElement';
import SVGCompElement from '../elements/svg/SVGCompElement';
import HybridRendererBase from '../renderers/HybridRendererBase';
export default class HybridRenderer extends HybridRendererBase {
    createComp(data: LottieLayer): HCompElement | SVGCompElement;
}
