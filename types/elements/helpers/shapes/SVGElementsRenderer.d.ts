import type SVGFillStyleData from '@/elements/helpers/shapes/SVGFillStyleData';
import type { Shape } from '@/types';
export declare function createRenderFunction(data: Shape): typeof renderFill | null;
declare function renderFill(_: Shape, itemData?: SVGFillStyleData, isFirstFrame?: boolean): void;
export type CreateRenderFunction = ReturnType<typeof createRenderFunction>;
declare const SVGElementsRenderer: {
    createRenderFunction: typeof createRenderFunction;
};
export default SVGElementsRenderer;
