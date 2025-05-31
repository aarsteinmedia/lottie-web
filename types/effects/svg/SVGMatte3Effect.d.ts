import type { GroupEffect } from '@/effects/EffectsManager';
import type { ElementInterfaceIntersect } from '@/types';
export default class SVGMatte3Effect {
    elem: ElementInterfaceIntersect;
    filterElem: SVGFilterElement;
    filterManager: GroupEffect;
    initialized?: boolean;
    constructor(filterElem: SVGFilterElement, filterManager: GroupEffect, elem: ElementInterfaceIntersect);
    findSymbol(mask: ElementInterfaceIntersect): ElementInterfaceIntersect | null;
    initialize(): void;
    renderFrame(): void;
    replaceInParent(mask: ElementInterfaceIntersect, symbolId: string): void;
    setElementAsMask(elem: ElementInterfaceIntersect, mask: ElementInterfaceIntersect): void;
}
