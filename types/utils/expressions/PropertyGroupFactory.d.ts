import type { LayerExpressionInterface } from '../../utils/expressions/LayerInterface';
import type { BaseProperty } from '../../utils/properties/BaseProperty';
export declare class PropertyGroupFactory {
    interfaceFunction: (val: string | number) => BaseProperty;
    parentPropertyGroup: LayerExpressionInterface;
    constructor(interfaceFunction: (val: number | string) => BaseProperty, parentPropertyGroup: LayerExpressionInterface);
    getInterface(val?: number): any;
}
