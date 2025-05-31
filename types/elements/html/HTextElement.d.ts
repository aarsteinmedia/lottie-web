import type { ElementInterfaceIntersect, GlobalData, LottieLayer } from '../../types';
import TextElement from '../../elements/TextElement';
export default class HTextElement extends TextElement {
    compH?: number;
    compW?: number;
    currentBBox?: {
        w: number;
        h: number;
        x: number;
        y: number;
    };
    isMasked?: boolean;
    maskedElement?: SVGGElement | HTMLElement;
    renderedLetters: string[];
    svgElement?: SVGSVGElement;
    textPaths: SVGPathElement[];
    textSpans: HTMLElement[];
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    buildNewText(): void;
    createContent(): void;
    renderInnerContent(): void;
}
