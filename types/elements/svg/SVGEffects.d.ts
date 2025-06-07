import type GroupEffect from '@/effects/GroupEffect';
import type { EffectElement, ElementInterfaceIntersect } from '@/types';
import type { EffectTypes } from '@/utils/enums';
export default class SVGEffects {
    filters: GroupEffect[];
    constructor(elem: ElementInterfaceIntersect);
    getEffects(type: EffectTypes): GroupEffect[];
    renderFrame(frame?: number | null): void;
}
export declare const registerEffect: (id: number, effect: EffectElement, countsAsEffect?: boolean) => void;
