import type { AnimationData, LottieManifest } from '@/types';
export default function createDotLottie({ animations, fileName, manifest, shouldDownload, }: {
    animations?: AnimationData[];
    manifest?: LottieManifest;
    fileName?: string;
    shouldDownload?: boolean;
}): Promise<ArrayBuffer | null>;
