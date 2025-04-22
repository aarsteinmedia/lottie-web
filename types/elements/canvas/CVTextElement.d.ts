import type { ElementInterfaceIntersect, GlobalData, LottieLayer, TextSpan } from '../../types';
import type LetterProps from '../../utils/text/LetterProps';
import TextElement from '../../elements/TextElement';
export default class CVTextElement extends TextElement {
    canvasContext?: CanvasRenderingContext2D;
    currentRender: unknown;
    fill?: boolean;
    fillColorAnim: boolean;
    justifyOffset: number;
    renderedLetters: LetterProps[];
    stroke?: boolean;
    strokeColorAnim: boolean;
    strokeWidthAnim: boolean;
    textSpans: TextSpan[];
    tHelper: CanvasRenderingContext2D | null;
    values: {
        fill: string;
        fValue: string;
        stroke: string;
        sWidth: number;
    };
    yOffset: number;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    buildNewText(): void;
    clearCanvas(_canvasContext?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null): void;
    createElements(): void;
    exitLayer(): void;
    hideElement(): void;
    prepareLayer(): void;
    renderInnerContent(): void;
    showElement(): void;
}
