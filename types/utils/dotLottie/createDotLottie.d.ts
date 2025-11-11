import type { AnimationData, LottieManifest } from '../../types';
interface CreateDotLottieProps {
    animations?: AnimationData[];
    fileName?: string;
    manifest?: LottieManifest;
    shouldDownload?: boolean;
}
export default function createDotLottie({ animations, fileName, manifest, shouldDownload, }: CreateDotLottieProps): Promise<ArrayBuffer | null>;
export {};
