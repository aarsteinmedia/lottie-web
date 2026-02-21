import type { CompElementInterface } from '../../types';
export declare class CompExpressionInterface {
    _name?: undefined | string;
    comp: CompElementInterface;
    displayStartTime: number;
    frameDuration: number;
    height?: undefined | number;
    layer: CompExpressionInterface;
    numLayers?: undefined | number;
    pixelAspect: number;
    width?: undefined | number;
    constructor(comp: CompElementInterface);
    getInterface(name?: string | number | number[]): import("./LayerInterface").LayerExpressionInterface | null;
}
