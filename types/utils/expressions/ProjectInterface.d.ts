import type { CompElementInterface } from '../../types';
import type LayerExpressionInterface from '../../utils/expressions/LayerInterface';
import type { MaskInterface } from '../../utils/expressions/MaskInterface';
export default class ProjectInterface {
    compositions: CompElementInterface[];
    content?: ProjectInterface;
    createEffectsInterface?: (val: any, _interface?: LayerExpressionInterface) => any;
    currentFrame: number;
    registerEffectsInterface?: (val: any, _interface?: ProjectInterface) => any;
    registerMaskInterface?: (val: any, _interface?: MaskInterface) => any;
    shapeInterface?: ProjectInterface;
    text?: ProjectInterface;
    textInterface?: ProjectInterface;
    constructor(name?: string);
    registerComposition(comp: CompElementInterface): void;
}
