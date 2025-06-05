import type { Audio, ElementInterfaceIntersect, GlobalData, LottieAsset, LottieLayer } from '../types';
import type MultiDimensionalProperty from '../utils/properties/MultiDimensionalProperty';
import type ValueProperty from '../utils/properties/ValueProperty';
import RenderableElement from '../elements/helpers/RenderableElement';
export default class AudioElement extends RenderableElement {
    _canPlay: boolean;
    _currentTime: number;
    _isPlaying: boolean;
    _previousVolume: number | null;
    _volume: number;
    _volumeMultiplier?: number;
    assetData: null | LottieAsset;
    audio: Audio;
    lv: MultiDimensionalProperty;
    tm: ValueProperty;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    getBaseElement(): null;
    hide(): void;
    initExpressions(): void;
    pause(): void;
    prepareFrame(num: number): void;
    renderFrame(_val?: number): void;
    resume(): void;
    setRate(rateValue: number): void;
    show(): void;
    sourceRectAtTime(): null;
    volume(volumeValue: number): void;
}
