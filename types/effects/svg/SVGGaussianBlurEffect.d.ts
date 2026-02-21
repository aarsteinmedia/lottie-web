import type { GroupEffect } from '../../effects/GroupEffect';
import type { ElementInterfaceIntersect } from '../../types';
export declare class SVGGaussianBlurEffect {
    feGaussianBlur: SVGFEGaussianBlurElement;
    filterManager: GroupEffect;
    constructor(filter: SVGFilterElement, filterManager: GroupEffect, _elem: ElementInterfaceIntersect, id: string);
    renderFrame(forceRender?: boolean): void;
}
