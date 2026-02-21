import type { AnimationData, LottieManifest } from '../../types';
export declare function getAnimationData(input: unknown): Promise<{
    animations?: undefined | AnimationData[];
    manifest: LottieManifest | null;
    isDotLottie: boolean;
}>;
