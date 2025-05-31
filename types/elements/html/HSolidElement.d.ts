import type { ElementInterfaceIntersect, GlobalData, LottieLayer } from '@/types';
import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement';
export default class HSolidElement extends RenderableDOMElement {
    svgElement?: SVGSVGElement;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    addEffects(): void;
    checkBlendMode(): void;
    createContent(): void;
    setMatte(): void;
}
