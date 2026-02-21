import type { AnimationData } from '../../types';
interface CreateJSONProps {
    animation?: undefined | AnimationData;
    fileName?: string;
    shouldDownload?: boolean;
}
export declare function createJSON({ animation, fileName, shouldDownload, }: CreateJSONProps): string | null;
export {};
