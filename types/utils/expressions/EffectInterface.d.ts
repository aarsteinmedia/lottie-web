import type { BaseElement } from '../../elements/BaseElement';
import type { Effect } from '../../types';
import type { LayerExpressionInterface } from '../../utils/expressions/LayerInterface';
export declare class GroupEffectInterface {
    effectElements: Effect[];
    effects: Effect[];
    get numProperties(): number;
    constructor(effects: Effect[], effectElements: Effect[]);
    getInterface(name: string | number): Effect | null | undefined;
}
export declare class EffectsExpressionInterface {
    effectElements: Effect[];
    effects: Effect[];
    effectsData: Effect[];
    createEffectsInterface(elem: BaseElement, propertyGroup: LayerExpressionInterface): GroupEffectInterface | null;
    private createGroupInterface;
    private createValueInterface;
}
