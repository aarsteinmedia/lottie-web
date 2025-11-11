import type { AnimationData } from '../../types';
interface CreateJSONProps {
    animation?: AnimationData;
    fileName?: string;
    shouldDownload?: boolean;
}
export default function createJSON({ animation, fileName, shouldDownload, }: CreateJSONProps): string | null;
export {};
