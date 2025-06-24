import type { ElementInterfaceIntersect, GlobalData, LottieLayer, SourceRect, TextSpan } from '@/types';
import TextElement from '@/elements/TextElement';
export default class SVGTextLottieElement extends TextElement {
    _sizeChanged?: boolean;
    bbox?: {
        height: number;
        left: number;
        top: number;
        width: number;
    };
    createContainerElements: any;
    createRenderableComponents: any;
    destroyBaseElement: any;
    getBaseElement: any;
    getMatte: any;
    initRendererElement: any;
    renderedFrame?: number;
    renderedLetters: string[];
    renderElement: any;
    setMatte: any;
    textContainer?: SVGTextElement;
    textSpans: TextSpan[];
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    buildNewText(): void;
    buildShapeData(data: LottieLayer, scale: number): LottieLayer;
    buildTextContents(textArray: string[]): string[];
    createContent(): void;
    getValue(): void;
    renderInnerContent(): void;
    sourceRectAtTime(): SourceRect | null;
}
