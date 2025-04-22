import type ShapeGroupData from '../elements/helpers/shapes/ShapeGroupData';
import type MaskElement from '../elements/MaskElement';
import type { CompElementInterface, GlobalData, LottieLayer, Shape } from '../types';
import type CompExpressionInterface from '../utils/expressions/CompInterface';
import type LayerExpressionInterface from '../utils/expressions/LayerInterface';
import EffectsManager from '../effects/EffectsManager';
export default abstract class BaseElement {
    baseElement?: HTMLElement | SVGGElement;
    comp?: CompElementInterface;
    compInterface?: CompExpressionInterface;
    data?: LottieLayer;
    effectsManager?: EffectsManager;
    globalData?: GlobalData;
    itemsData: ShapeGroupData[];
    layerElement?: SVGGElement | HTMLElement;
    layerId?: string;
    layerInterface?: LayerExpressionInterface;
    maskManager?: MaskElement;
    shapesData: Shape[];
    type?: unknown;
    checkMasks(): boolean;
    getType(): unknown;
    initBaseData(data: LottieLayer, globalData: GlobalData, comp: CompElementInterface): void;
    initExpressions(): void;
    setBlendMode(): void;
}
