import type { AnimationData } from '@/types';
export default function createJSON({ animation, fileName, shouldDownload, }: {
    animation?: AnimationData;
    fileName?: string;
    shouldDownload?: boolean;
}): string | null;
