import type GroupEffect from '@/effects/GroupEffect';
import type { ElementInterfaceIntersect } from '@/types';
export default class SVGProLevelsFilter {
    feFuncA?: SVGFEFuncAElement;
    feFuncB?: SVGFEFuncBElement;
    feFuncBComposed?: SVGFEFuncBElement;
    feFuncG?: SVGFEFuncGElement;
    feFuncGComposed?: SVGFEFuncGElement;
    feFuncR?: SVGFEFuncRElement;
    feFuncRComposed?: SVGFEFuncRElement;
    filterManager: GroupEffect;
    constructor(filter: SVGFilterElement, filterManager: GroupEffect, _elem: ElementInterfaceIntersect, id: string);
    createFeFunc<T extends SVGElement>(type: string, feComponentTransfer: SVGFEComponentTransferElement): T;
    getTableValue(inputBlack: number, inputWhite: number, gamma: number, outputBlack: number, outputWhite: number): string;
    renderFrame(forceRender?: boolean): void;
}
