import type { GroupEffect } from '../../effects/EffectsManager';
import type { ElementInterfaceIntersect } from '../../types';
import SVGComposableEffect from '../../effects/svg/SVGComposableEffect';
export default class SVGTintFilter extends SVGComposableEffect {
    filterManager: GroupEffect;
    linearFilter: SVGFEColorMatrixElement;
    matrixFilter: SVGFEColorMatrixElement;
    constructor(filter: SVGFilterElement, filterManager: GroupEffect, _elem: ElementInterfaceIntersect, id: string, source: string);
    renderFrame(forceRender?: boolean): void;
}
