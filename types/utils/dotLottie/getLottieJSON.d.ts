import type { AnimationData, LottieManifest } from '../../types';
export declare function getLottieJSON(resp: Response): Promise<{
    data: AnimationData[];
    manifest: LottieManifest;
}>;
