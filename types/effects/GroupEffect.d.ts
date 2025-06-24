import type { Effect, EFXElement, ElementInterfaceIntersect, LottieLayer } from '@/types';
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer';
export default class GroupEffect extends DynamicPropertyContainer {
    data?: Effect;
    effectElements: EFXElement[];
    getValue: any;
    type?: string;
    constructor(data: Effect, element: ElementInterfaceIntersect, layer: LottieLayer);
    init(data: Effect, element: ElementInterfaceIntersect, layer: LottieLayer): void;
    renderFrame(_frame?: number | null): void;
}
