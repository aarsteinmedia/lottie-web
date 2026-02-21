import type { GroupEffect } from '../../effects/GroupEffect';
import type { EffectElement, ElementInterfaceIntersect } from '../../types';
export declare class CVEffects {
    filters: GroupEffect[];
    constructor(elem: ElementInterfaceIntersect);
    getEffects(type: string): GroupEffect[];
    renderFrame(_isFirstFrame?: number): void;
}
export declare const registerEffect: (id: number, effect: EffectElement, countsAsEffect?: boolean) => void;
