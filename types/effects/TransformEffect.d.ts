import type GroupEffect from '@/effects/GroupEffect';
import type ValueProperty from '@/utils/properties/ValueProperty';
import Matrix from '@/utils/Matrix';
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
