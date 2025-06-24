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
    createContainerElements: () => void;
    createRenderableComponents: () => void;
    destroyBaseElement: () => void;
    getBaseElement: () => HTMLElement | SVGGElement | null;
    getMatte: (matteType?: number) => string;
    initRendererElement: () => void;
    renderedFrame?: number;
    renderedLetters: string[];
    renderElement: () => void;
    setMatte: (id: string) => void;
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
