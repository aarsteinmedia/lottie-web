import type { CompElementInterface, GlobalData } from '../../types';
export default class CompExpressionInterface {
    _name?: string;
    comp: CompElementInterface;
    displayStartTime: number;
    frameDuration: number;
    globalData?: GlobalData;
    height: number;
    numLayers: number;
    pixelAspect: number;
    width: number;
    constructor(comp: CompElementInterface);
    layer(name: string | number): import("./LayerInterface").default | null | undefined;
}
