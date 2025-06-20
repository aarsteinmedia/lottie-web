import type { AnimationData, LottieManifest } from '../../types';
export default function getLottieJSON(resp: Response): Promise<{
    data: AnimationData[];
    manifest: LottieManifest;
}>;
