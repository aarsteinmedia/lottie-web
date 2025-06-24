import type GroupEffect from '@/effects/GroupEffect';
import type { ElementInterfaceIntersect } from '@/types';
export default class SVGMatte3Effect {
    elem: ElementInterfaceIntersect;
    filterElem: SVGFilterElement;
    filterManager: GroupEffect;
    initialized?: boolean;
    constructor(filterElem: SVGFilterElement, filterManager: GroupEffect, elem: ElementInterfaceIntersect);
    findSymbol(mask: ElementInterfaceIntersect): any;
    initialize(): void;
    renderFrame(_val?: number): void;
    replaceInParent(mask: ElementInterfaceIntersect, symbolId: string): void;
    setElementAsMask(elem: ElementInterfaceIntersect, mask: ElementInterfaceIntersect): void;
}
