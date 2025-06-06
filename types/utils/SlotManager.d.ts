import type { DocumentData, LottieAsset, LottieLayer } from '../types';
export declare class SlotManager {
    animationData: LottieLayer;
    constructor(animationData: LottieLayer);
    getProp(data: DocumentData | LottieLayer | LottieAsset): any;
}
export default function slotFactory(animationData: LottieLayer): SlotManager;
