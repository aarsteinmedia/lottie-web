import type { ElementInterfaceIntersect, GlobalData, LottieLayer } from '../../types';
import { SolidElement } from '../../elements/SolidElement';
export declare class HSolidElement extends SolidElement {
    svgElement?: SVGSVGElement;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    addEffects(): void;
    checkBlendMode(): void;
    createContent(): void;
}
