import type { Shape } from '../../types';
import type LayerExpressionInterface from '../../utils/expressions/LayerInterface';
import ShapeGroupData from '../../elements/helpers/shapes/ShapeGroupData';
import ShapePathInterface from '../../utils/expressions/shapes/ShapePathInterface';
export default class ShapeExpressionInterface {
    _name: string;
    numProperties: number;
    propertyGroup: any;
    private interfaces;
    constructor(shapes: Shape[], view: ShapeGroupData[], propertyGroup: LayerExpressionInterface);
    contentsInterfaceFactory(shape: Shape, view: ShapeGroupData, propertyGroup: (val: any) => any): {
        (value: string | number): ShapePathInterface | null;
        propertyGroup: (val?: number) => any;
        numProperties: number;
        transform: any;
        propertyIndex: number | undefined;
        _name: string | undefined;
    };
    defaultInterfaceFactory(_shape?: Shape, _view?: any, _propertyGroup?: any): () => null;
    ellipseInterfaceFactory(shape: Shape, view: any, propertyGroup: any): any;
    fillInterfaceFactory(shape: Shape, view: any, propertyGroup: any): any;
    gradientFillInterfaceFactory(shape: Shape, view: any, propertyGroup: any): any;
    groupInterfaceFactory(shape: Shape, view: any, propertyGroup: any): {
        (value: string | number): any;
        propertyGroup: (val?: number) => any;
        content: {
            (value: string | number): ShapePathInterface | null;
            propertyGroup: (val?: number) => any;
            numProperties: number;
            transform: any;
            propertyIndex: number | undefined;
            _name: string | undefined;
        };
        transform: any;
        numProperties: number | undefined;
        propertyIndex: number | undefined;
        nm: string | undefined;
        mn: string | undefined;
    };
    iterateElements(shapes: null | Shape[], view: any, propertyGroup: any): any[];
    rectInterfaceFactory(shape: Shape, view: any, propertyGroup: any): any;
    repeaterInterfaceFactory(shape: Shape, view: any, propertyGroup: any): any;
    roundedInterfaceFactory(shape: Shape, view: any, propertyGroup: any): any;
    starInterfaceFactory(shape: Shape, view: any, propertyGroup: any): any;
    strokeInterfaceFactory(shape: Shape, view: any, propertyGroup: any): any;
    transformInterfaceFactory(shape: Shape, view: any, propertyGroup: any): any;
    trimInterfaceFactory(shape: Shape, view: any, propertyGroup: any): any;
}
