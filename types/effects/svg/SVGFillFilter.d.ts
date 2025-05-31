import type { GroupEffect } from '@/effects/EffectsManager';
import type { ElementInterfaceIntersect } from '@/types';
export default class SVGFillFilter {
    filterManager: GroupEffect;
    matrixFilter: SVGFEColorMatrixElement;
    constructor(filter: SVGFilterElement, filterManager: GroupEffect, _elem: ElementInterfaceIntersect, id: string);
    renderFrame(forceRender?: boolean): void;
}
