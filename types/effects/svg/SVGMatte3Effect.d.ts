import type GroupEffect from '../../effects/GroupEffect';
import type { ElementInterfaceIntersect } from '../../types';
export default class SVGMatte3Effect {
    elem: ElementInterfaceIntersect;
    filterElem: SVGFilterElement;
    filterManager: GroupEffect;
    initialized?: boolean;
    constructor(filterElem: SVGFilterElement, filterManager: GroupEffect, elem: ElementInterfaceIntersect);
    findSymbol(mask: ElementInterfaceIntersect): (import("../../renderers/BaseRenderer").default & import("../../elements/ImageElement").default & import("../../elements/AudioElement").default & import("../../elements/svg/SVGShapeElement").default & SVGMaskElement & import("../../elements/svg/SVGEffects").default & import("../../elements/svg/SVGTextElement").default & import("../../elements/canvas/CVMaskElement").default & import("../../elements/canvas/CVEffects").default & import("../../elements/canvas/CVTextElement").default & import("../../renderers/SVGRenderer").default & import("../../renderers/CanvasRenderer").default & import("../../renderers/HybridRenderer").default & import("../../Lottie").AnimationItem) | null | undefined;
    initialize(): void;
    renderFrame(_val?: number): void;
    replaceInParent(mask: ElementInterfaceIntersect, symbolId: string): void;
    setElementAsMask(elem: ElementInterfaceIntersect, mask: ElementInterfaceIntersect): void;
}
