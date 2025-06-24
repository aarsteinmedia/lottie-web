import type SVGEffects from '@/elements/svg/SVGEffects';
import type { ElementInterfaceIntersect, Transformer, Vector3 } from '@/types';
import BaseElement from '@/elements/BaseElement';
export default abstract class TransformElement extends BaseElement {
    _isFirstFrame?: boolean;
    finalTransform?: Transformer;
    hierarchy?: ElementInterfaceIntersect[];
    localTransforms?: Transformer[];
    mHelper: any;
    renderableEffectsManager?: SVGEffects;
    globalToLocal(point: Vector3): Vector3;
    initTransform(): void;
    renderLocalTransform(): void;
    renderTransform(): void;
    searchEffectTransforms(): void;
}
