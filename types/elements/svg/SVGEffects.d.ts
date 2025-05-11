import type { GroupEffect } from '../../effects/EffectsManager';
import type { ElementInterfaceIntersect } from '../../types';
export default class SVGEffects {
    filters: GroupEffect[];
    constructor(elem: ElementInterfaceIntersect);
    getEffects(type: string): GroupEffect[];
    renderFrame(frame?: number | null): void;
}
