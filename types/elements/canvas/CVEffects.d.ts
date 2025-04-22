import type { GroupEffect } from '../../effects/EffectsManager';
import type { ElementInterfaceIntersect } from '../../types';
export default class CVEffects {
    filters: GroupEffect[];
    constructor(elem: ElementInterfaceIntersect);
    getEffects(type: string): GroupEffect[];
    renderFrame(_isFirstFrame?: number): void;
}
