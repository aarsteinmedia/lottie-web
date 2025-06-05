declare function createAlphaToLuminanceFilter(): SVGFEColorMatrixElement;
declare function createFilter(filId: string, skipCoordinates?: boolean): SVGFilterElement;
declare const FiltersFactory: {
    createAlphaToLuminanceFilter: typeof createAlphaToLuminanceFilter;
    createFilter: typeof createFilter;
};
export default FiltersFactory;
