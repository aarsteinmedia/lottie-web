import type CanvasRenderer from '../renderers/CanvasRenderer';
import type HybridRenderer from '../renderers/HybridRenderer';
import type SVGRenderer from '../renderers/SVGRenderer';
import type { EffectElement, ExpressionInterface, ExpressionInterfaces, GetInterface } from '../types';
import type Expressions from '../utils/expressions/Expressions';
import { RendererType } from '../enums';
export declare const initialDefaultFrame = -999999, roundCorner = 0.5519;
export declare const setExpressionsPlugin: (value: typeof Expressions) => void, getExpressionsPlugin: () => typeof Expressions | null, setExpressionInterfaces: (getInterface: (type: keyof ExpressionInterfaces) => ExpressionInterface) => void, getExpressionInterfaces: () => GetInterface | null;
export declare const setDefaultCurveSegments: (value: number) => void, getDefaultCurveSegments: () => number;
export declare const setWebWorker: (flag: boolean) => void, getWebWorker: () => boolean;
export declare const setSubframeEnabled: (flag: boolean) => void, getSubframeEnabled: () => boolean;
type Renderer = typeof SVGRenderer | typeof CanvasRenderer | typeof HybridRenderer;
export declare const registerRenderer: (key: RendererType, value: Renderer) => void, getRenderer: (key: RendererType) => Renderer, getRegisteredRenderer: () => RendererType;
export declare const setLocationHref: (value: string) => void, getLocationHref: () => string;
export declare const registeredEffects: {
    [id: string]: {
        countsAsEffect?: boolean;
        effect: EffectElement;
    };
}, registerEffect: (id: number, effect: EffectElement, countsAsEffect?: boolean) => void;
export declare const createElementID: () => string, setIDPrefix: (value: string) => void, getIDPrefix: () => string;
export declare const getShouldRoundValues: () => boolean, setShouldRoundValues: (value: boolean) => void, setQuality: (value: string | number) => void;
export {};
