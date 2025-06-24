import type { CompElementInterface } from '@/types';
export default class ProjectInterface {
    compositions: CompElementInterface[];
    currentFrame: number;
    getComposition(name?: string): any;
    registerComposition(comp: CompElementInterface): void;
}
