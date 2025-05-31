import type { GroupEffect } from '@/effects/EffectsManager';
import type { EffectElement, ElementInterfaceIntersect } from '@/types';
export default class SVGEffects {
    filters: GroupEffect[];
    constructor(elem: ElementInterfaceIntersect);
    getEffects(type: string): GroupEffect[];
    renderFrame(frame?: number | null): void;
}
export declare const registerEffect: (id: number, effect: EffectElement, countsAsEffect?: boolean) => void;
