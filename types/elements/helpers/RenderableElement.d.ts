import type { RenderableComponent, SourceRect } from '../../types';
import FrameElement from '../../elements/helpers/FrameElement';
export default class RenderableElement extends FrameElement {
    hidden?: boolean;
    isInRange?: boolean;
    isTransparent?: boolean;
    private renderableComponents;
    addRenderableComponent(component: RenderableComponent): void;
    checkLayerLimits(num: number): void;
    checkLayers(_val?: number): void;
    checkTransparency(): void;
    getLayerSize(): {
        h: number;
        w: number;
    };
    hide(): void;
    initRenderable(): void;
    prepareRenderableFrame(num: number, _?: boolean): void;
    removeRenderableComponent(component: RenderableComponent): void;
    renderRenderable(): void;
    show(): void;
    sourceRectAtTime(): SourceRect | null;
}
