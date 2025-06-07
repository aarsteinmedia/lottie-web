import type { AnimationData, LottieLayer } from '../types';
declare function completeLayers(layers: LottieLayer[], comps: LottieLayer[]): void;
declare function completeData(animationData: AnimationData): void;
declare const DataFunctions: {
    checkChars: (animationData: AnimationData) => void;
    checkColors: (animationData: AnimationData) => void;
    checkPathProperties: (animationData: AnimationData) => void;
    checkShapes: (animationData: AnimationData) => void;
    completeData: typeof completeData;
    completeLayers: typeof completeLayers;
};
export default DataFunctions;
