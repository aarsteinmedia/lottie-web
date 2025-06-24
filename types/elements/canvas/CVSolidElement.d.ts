import type { ElementInterfaceIntersect, GlobalData, LottieLayer } from '@/types';
import CVBaseElement from '@/elements/canvas/CVBaseElement';
export default class CVSolidElement extends CVBaseElement {
    initElement: any;
    prepareFrame: any;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    renderInnerContent(): void;
}
