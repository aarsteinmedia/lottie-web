import type AnimationItem from '../animation/AnimationItem';
import type { CanvasRendererConfig, LottieLayer } from '../types';
import CVCompElement from '../elements/canvas/CVCompElement';
import { RendererType } from '../enums';
import CanvasRendererBase from '../renderers/CanvasRendererBase';
import Matrix from '../utils/Matrix';
export default class CanvasRenderer extends CanvasRendererBase {
    rendererType: RendererType;
    transformMat: Matrix;
    constructor(animationItem: AnimationItem, config?: CanvasRendererConfig);
    createComp(data: LottieLayer): CVCompElement;
}
