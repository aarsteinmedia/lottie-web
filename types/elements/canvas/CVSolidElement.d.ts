import type { ElementInterfaceIntersect, GlobalData, LottieLayer } from '../../types';
import RenderableElement from '../../elements/helpers/RenderableElement';
export default class CVSolidElement extends RenderableElement {
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    initElement(_data: LottieLayer, _globalData: GlobalData, _comp: ElementInterfaceIntersect): void;
    prepareFrame(_num: number): void;
    renderInnerContent(): void;
}
