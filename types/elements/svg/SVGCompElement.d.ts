import type { AnimationData, ElementInterfaceIntersect, GlobalData, LottieLayer } from '../../types';
import type { KeyframedValueProperty } from '../../utils/Properties';
import SVGBaseElement from '../../elements/svg/SVGBaseElement';
export default class SVGCompElement extends SVGBaseElement {
    _debug?: boolean;
    completeLayers: boolean;
    elements: ElementInterfaceIntersect[];
    layers: LottieLayer[];
    pendingElements: ElementInterfaceIntersect[];
    supports3d: boolean;
    tm?: KeyframedValueProperty;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    appendElementInPos(_element: ElementInterfaceIntersect, _pos: number): void;
    buildItem(_pos: number): void;
    checkPendingElements(): void;
    configAnimation(_data: AnimationData): void;
    createComp(data: LottieLayer): SVGCompElement;
    createImage(_data: LottieLayer): void;
    createNull(_data: LottieLayer): void;
    createShape(_data: LottieLayer): void;
    createSolid(_data: LottieLayer): void;
    createText(_data: LottieLayer): void;
    destroyElements(): void;
    findIndexByInd(_ind: number): void;
    getElements(): void;
    setElements(_elems: ElementInterfaceIntersect[]): void;
}
