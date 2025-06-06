import type SVGFillStyleData from '../../../elements/helpers/shapes/SVGFillStyleData';
import type SVGGradientFillStyleData from '../../../elements/helpers/shapes/SVGGradientFillStyleData';
import type SVGGradientStrokeStyleData from '../../../elements/helpers/shapes/SVGGradientStrokeStyleData';
import type SVGShapeData from '../../../elements/helpers/shapes/SVGShapeData';
import type SVGStrokeStyleData from '../../../elements/helpers/shapes/SVGStrokeStyleData';
import type SVGTransformData from '../../../elements/helpers/shapes/SVGTransformData';
import type { Shape } from '../../../types';
export declare function createRenderFunction(data: Shape): typeof renderFill | typeof renderGradient | typeof renderStroke | typeof renderPath | typeof renderContentTransform | null;
declare function renderContentTransform(_: Shape, itemData?: SVGTransformData, isFirstFrame?: boolean): void;
declare function renderFill(_: Shape, itemData?: SVGFillStyleData, isFirstFrame?: boolean): void;
declare function renderGradient(styleData: Shape, itemData?: SVGGradientFillStyleData, isFirstFrame?: boolean): void;
declare function renderPath(styleData: Shape, itemData?: SVGShapeData, isFirstFrame?: boolean): void;
declare function renderStroke(_: Shape, itemData?: SVGStrokeStyleData | SVGGradientStrokeStyleData, isFirstFrame?: boolean): void;
export type CreateRenderFunction = ReturnType<typeof createRenderFunction>;
declare const SVGElementsRenderer: {
    createRenderFunction: typeof createRenderFunction;
};
export default SVGElementsRenderer;
