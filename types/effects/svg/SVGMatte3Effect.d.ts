import type { GroupEffect } from '../../effects/GroupEffect';
import type { ElementInterfaceIntersect } from '../../types';
export declare class SVGMatte3Effect {
    elem: ElementInterfaceIntersect;
    filterElem: SVGFilterElement;
    filterManager: GroupEffect;
    initialized?: boolean;
    constructor(filterElem: SVGFilterElement, filterManager: GroupEffect, elem: ElementInterfaceIntersect);
    findSymbol(mask: ElementInterfaceIntersect): (import("../../renderers/BaseRenderer").BaseRenderer & import("../../elements/ImageElement").ImageElement & import("../../elements/AudioElement").AudioElement & import("../../elements/svg/SVGShapeElement").SVGShapeElement & SVGMaskElement & import("../../elements/svg/SVGEffects").SVGEffects & import("../../elements/svg/SVGTextElement").SVGTextLottieElement & import("../../elements/canvas/CVMaskElement").CVMaskElement & import("../../elements/canvas/CVEffects").CVEffects & import("../../elements/canvas/CVTextElement").CVTextElement & import("../../renderers/SVGRenderer").SVGRenderer & import("../../renderers/CanvasRenderer").CanvasRenderer & import("../../renderers/HybridRenderer").HybridRenderer & import("../../Lottie").AnimationItem) | null | undefined;
    initialize(): void;
    renderFrame(_val?: number): void;
    replaceInParent(mask: ElementInterfaceIntersect, symbolId: string): void;
    setElementAsMask(elem: ElementInterfaceIntersect, mask: ElementInterfaceIntersect): void;
}
