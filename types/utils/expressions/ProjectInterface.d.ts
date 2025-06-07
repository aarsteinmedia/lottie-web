import type { CompElementInterface } from '@/types';
export default class ProjectInterface {
    compositions: CompElementInterface[];
    currentFrame: number;
    getComposition(name?: string): import("./CompInterface").default | null | undefined;
    registerComposition(comp: CompElementInterface): void;
}
