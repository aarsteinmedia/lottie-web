import type { ElementInterfaceUnion } from '@/types';
export default class ProcessedElement {
    elem: ElementInterfaceUnion;
    pos: number;
    constructor(element: ElementInterfaceUnion, position: number);
}
