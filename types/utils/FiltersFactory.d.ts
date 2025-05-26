export declare function createAlphaToLuminanceFilter(): SVGFEColorMatrixElement;
export declare function createFilter(filId: string, skipCoordinates?: boolean): SVGFilterElement;
export declare class FeatureSupport {
    maskType: boolean;
    offscreenCanvas: boolean;
    svgLumaHidden: boolean;
    constructor();
}
declare const FiltersFactory: {
    createAlphaToLuminanceFilter: typeof createAlphaToLuminanceFilter;
    createFilter: typeof createFilter;
};
export default FiltersFactory;
