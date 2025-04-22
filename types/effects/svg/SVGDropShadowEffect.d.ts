import type { GroupEffect } from '../../effects/EffectsManager';
import type { ElementInterfaceIntersect } from '../../types';
import SVGComposableEffect from '../../effects/svg/SVGComposableEffect';
export default class SVGDropShadowEffect extends SVGComposableEffect {
    feFlood: SVGFEFloodElement;
    feGaussianBlur: SVGFEGaussianBlurElement;
    feOffset: SVGFEOffsetElement;
    filterManager: GroupEffect;
    constructor(filter: SVGFilterElement, filterManager: GroupEffect, _elem: ElementInterfaceIntersect, id: string, source: string);
    renderFrame(forceRender?: boolean): void;
}
