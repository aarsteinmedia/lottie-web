import type { SVGFillStyleData, SVGGradientFillStyleData, SVGGradientStrokeStyleData, SVGShapeData, SVGStrokeStyleData, SVGTransformData } from '../elements/helpers/shapes';
import type { Shape } from '../types';
export declare function createRenderFunction(data: Shape): typeof renderFill | typeof renderGradient | typeof renderStroke | typeof renderPath | typeof renderContentTransform | null;
declare function renderContentTransform(_: Shape, itemData?: SVGTransformData, isFirstFrame?: boolean): void;
declare function renderFill(_: Shape, itemData?: SVGFillStyleData, isFirstFrame?: boolean): void;
declare function renderGradient(styleData: Shape, itemData?: SVGGradientFillStyleData, isFirstFrame?: boolean): void;
declare function renderPath(styleData: Shape, itemData?: SVGShapeData, isFirstFrame?: boolean): void;
declare function renderStroke(_: Shape, itemData?: SVGStrokeStyleData | SVGGradientStrokeStyleData, isFirstFrame?: boolean): void;
export type CreateRenderFunction = ReturnType<typeof createRenderFunction>;
export {};
