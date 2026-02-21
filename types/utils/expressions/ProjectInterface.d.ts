import type { CompElementInterface } from '../../types';
export declare class ProjectInterface {
    compositions: CompElementInterface[];
    currentFrame: number;
    getComposition(name?: string): import("./CompInterface").CompExpressionInterface | null | undefined;
    registerComposition(comp: CompElementInterface): void;
}
