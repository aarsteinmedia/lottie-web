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
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    buildNewText(): void;
    buildShapeData(data: LottieLayer, scale: number): LottieLayer;
    buildTextContents(textArray: string[]): string[];
    createContent(): void;
    getMatte(_type?: number): string;
    getValue(): void;
    renderInnerContent(): void;
    setMatte(_id: string): void;
    sourceRectAtTime(): SourceRect | null;
}
