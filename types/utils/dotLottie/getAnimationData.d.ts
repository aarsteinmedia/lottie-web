import type { AnimationData, LottieManifest } from '@/types';
export default function getAnimationData(input: unknown): Promise<{
    animations?: AnimationData[];
    manifest: LottieManifest | null;
    isDotLottie: boolean;
}>;
