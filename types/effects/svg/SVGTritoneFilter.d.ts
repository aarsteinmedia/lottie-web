import type { GroupEffect } from '../../effects/GroupEffect';
import type { ElementInterfaceIntersect } from '../../types';
export declare class SVGTritoneFilter {
    feFuncB: SVGFEFuncBElement;
    feFuncG: SVGFEFuncGElement;
    feFuncR: SVGFEFuncRElement;
    filterManager: GroupEffect;
    matrixFilter: SVGFEComponentTransferElement;
    constructor(filter: SVGFilterElement, filterManager: GroupEffect, _elem: ElementInterfaceIntersect, id: string);
    renderFrame(forceRender?: boolean): void;
}
