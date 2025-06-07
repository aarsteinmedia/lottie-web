import type { ElementInterfaceIntersect, GlobalData, LottieLayer } from '@/types';
import CVBaseElement from '@/elements/canvas/CVBaseElement';
export default class CVSolidElement extends CVBaseElement {
    initElement: (data: LottieLayer, globalData: GlobalData, comp: import("@/types").CompElementInterface) => void;
    prepareFrame: (num: number) => void;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    renderInnerContent(): void;
}
