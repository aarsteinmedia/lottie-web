import type CVMaskElement from '@/elements/canvas/CVMaskElement';
import type MaskElement from '@/elements/MaskElement';
import type { ElementInterfaceIntersect, Shape, ViewData } from '@/types';
declare class MaskInterface {
    _data: Shape;
    _mask: ViewData;
    get maskOpacity(): number;
    get maskPath(): any;
    constructor(mask: ViewData, data: Shape);
}
export default class MaskManagerInterface {
    _masksInterfaces: MaskInterface[];
    maskManager: MaskElement | CVMaskElement;
    constructor(maskManager: MaskElement | CVMaskElement, _elem?: ElementInterfaceIntersect);
    getInterface(name: string): MaskInterface | null | undefined;
}
export {};
