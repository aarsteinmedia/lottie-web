import type { DocumentData, ElementInterfaceIntersect, GlobalData, LottieLayer, Shape, Vector3 } from '../types';
import type Matrix from '../utils/Matrix';
import RenderableDOMElement from '../elements/helpers/RenderableDOMElement';
import { RendererType } from '../utils/enums';
import LetterProps from '../utils/text/LetterProps';
import TextAnimatorProperty from '../utils/text/TextAnimatorProperty';
import TextProperty from '../utils/text/TextProperty';
export default abstract class TextElement extends RenderableDOMElement {
    emptyProp?: LetterProps;
    lettersChangedFlag?: boolean;
    renderType?: RendererType;
    textAnimator?: TextAnimatorProperty;
    textProperty?: TextProperty;
    applyTextPropertiesToMatrix(documentData: DocumentData, matrixHelper: Matrix, lineNumber: number, xPos: number, yPos: number): void;
    buildColor(colorData: Vector3): string;
    buildNewText(): void;
    canResizeFont(_canResize: boolean): void;
    createPathShape(matrixHelper: Matrix, shapes: Shape[]): string;
    initElement(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect): void;
    prepareFrame(num: number): void;
    setMinimumFontSize(_fontSize: number): void;
    updateDocumentData(newData: DocumentData, index: number): void;
    validateText(): void;
}
