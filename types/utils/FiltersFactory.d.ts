declare function createAlphaToLuminanceFilter(): any;
declare function createFilter(filId: string, skipCoordinates?: boolean): any;
declare const FiltersFactory: {
    createAlphaToLuminanceFilter: typeof createAlphaToLuminanceFilter;
    createFilter: typeof createFilter;
};
export default FiltersFactory;
