import type { DocumentData, LottieAsset, LottieLayer } from '../types';
export default class SlotManager {
    animationData: LottieLayer;
    constructor(animationData: LottieLayer);
    getProp(data: DocumentData | LottieLayer | LottieAsset): any;
}
