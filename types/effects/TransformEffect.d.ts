import type { ValueProperty } from '../utils/Properties';
import { GroupEffect } from '../effects/EffectsManager';
import Matrix from '../utils/Matrix';
export default abstract class TransformEffect {
    _mdf?: boolean;
    _opMdf?: boolean;
    effectsManager?: GroupEffect;
    matrix?: Matrix;
    op?: ValueProperty;
    opacity: number;
    type?: string;
    init(effectsManager: GroupEffect): void;
    renderFrame(forceFrame?: boolean): void;
}
