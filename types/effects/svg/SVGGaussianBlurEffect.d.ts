import type { GroupEffect } from '@/effects/EffectsManager';
import type { ElementInterfaceIntersect } from '@/types';
export default class SVGGaussianBlurEffect {
    feGaussianBlur: SVGFEGaussianBlurElement;
    filterManager: GroupEffect;
    constructor(filter: SVGFilterElement, filterManager: GroupEffect, _elem: ElementInterfaceIntersect, id: string);
    renderFrame(forceRender?: boolean): void;
}
