import type { GroupEffect } from '@/effects/EffectsManager';
import type { EffectElement, ElementInterfaceIntersect } from '@/types';
export default class CVEffects {
    filters: GroupEffect[];
    constructor(elem: ElementInterfaceIntersect);
    getEffects(type: string): GroupEffect[];
    renderFrame(_isFirstFrame?: number): void;
}
export declare const registerEffect: (id: number, effect: EffectElement, countsAsEffect?: boolean) => void;
