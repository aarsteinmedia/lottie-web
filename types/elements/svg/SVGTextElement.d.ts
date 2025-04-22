import type { ElementInterfaceIntersect, GlobalData, LottieLayer, SourceRect, TextSpan } from '../../types';
import TextElement from '../../elements/TextElement';
export default class SVGTextLottieElement extends TextElement {
    _sizeChanged?: boolean;
    bbox?: {
        height: number;
        left: number;
        top: number;
        width: number;
    };
    renderedFrame?: number;
    renderedLetters: string[];
    textContainer?: SVGTextElement;
    textSpans: TextSpan[];
    private emptyShapeData;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    buildNewText(): void;
    buildShapeData(data: LottieLayer, scale: number): LottieLayer;
    buildTextContents(textArray: string[]): string[];
    createContent(): void;
    getBaseElement(): SVGGElement | HTMLElement | null;
    getMatte(_type?: number): string;
    getValue(): void;
    renderInnerContent(this: SVGTextLottieElement): void;
    setMatte(_id: string): void;
    sourceRectAtTime(): SourceRect | null;
}
