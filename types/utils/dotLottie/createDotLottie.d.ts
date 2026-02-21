import type { AnimationData, LottieManifest } from '../../types';
interface CreateDotLottieProps {
    animations?: undefined | AnimationData[];
    fileName?: undefined | string;
    manifest?: undefined | LottieManifest;
    shouldDownload?: undefined | boolean;
}
export declare function createDotLottie({ animations, fileName, manifest, shouldDownload, }: CreateDotLottieProps): Promise<ArrayBuffer | null>;
export {};
