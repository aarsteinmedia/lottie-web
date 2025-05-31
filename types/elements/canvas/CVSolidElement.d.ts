import type { ElementInterfaceIntersect, GlobalData, LottieLayer } from '@/types';
import RenderableElement from '@/elements/helpers/RenderableElement';
export default class CVSolidElement extends RenderableElement {
    initElement: (data: LottieLayer, globalData: GlobalData, comp: import("@/types").CompElementInterface) => void;
    prepareFrame: (num: number) => void;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    renderInnerContent(): void;
}
