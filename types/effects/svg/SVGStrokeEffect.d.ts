import type GroupEffect from '@/effects/GroupEffect';
import type { ElementInterfaceIntersect } from '@/types';
export default class SVGStrokeEffect {
    elem: ElementInterfaceIntersect;
    filterManager: GroupEffect;
    initialized: boolean;
    masker?: SVGMaskElement;
    pathMasker?: SVGGElement;
    paths: {
        m: number;
        p: SVGPathElement;
    }[];
    constructor(_fil: SVGFilterElement, filterManager: GroupEffect, elem: ElementInterfaceIntersect);
    initialize(): void;
    renderFrame(forceRender?: boolean): void;
}
