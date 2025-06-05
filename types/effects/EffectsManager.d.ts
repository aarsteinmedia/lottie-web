import type { AngleEffect, CheckboxEffect, ColorEffect, LayerIndexEffect, MaskIndexEffect, NoValueEffect, PointEffect, SliderEffect } from '../effects';
import type { ElementInterfaceIntersect, LottieLayer } from '../types';
import type DynamicPropertyContainer from '../utils/helpers/DynamicPropertyContainer';
import GroupEffect from '../effects/GroupEffect';
export default class EffectsManager {
    _mdf?: boolean;
    effectElements: EffectInterface[];
    constructor(data: LottieLayer, element: ElementInterfaceIntersect, _dynamicProperties?: DynamicPropertyContainer[]);
}
export type EffectInterface = GroupEffect | EffectsManager | SliderEffect | AngleEffect | ColorEffect | PointEffect | CheckboxEffect | LayerIndexEffect | MaskIndexEffect | NoValueEffect;
