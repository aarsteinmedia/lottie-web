import type { CompElementInterface } from '@/types';
export default class CompExpressionInterface {
    _name?: string;
    comp: CompElementInterface;
    displayStartTime: number;
    frameDuration: number;
    height?: number;
    layer: CompExpressionInterface;
    numLayers?: number;
    pixelAspect: number;
    width?: number;
    constructor(comp: CompElementInterface);
    getInterface(name?: string | number | number[]): any;
}
