import type { ElementInterfaceIntersect, LottieLayer } from '@/types';
import type { PropType } from '@/utils/enums';
import type PropertyInterface from '@/utils/expressions/PropertyInterface';
export default abstract class DynamicPropertyContainer {
    _isAnimated?: boolean;
    _mdf?: boolean;
    container?: ElementInterfaceIntersect | null;
    data?: LottieLayer;
    dynamicProperties: DynamicPropertyContainer[];
    propType?: PropType | false;
    addDynamicProperty(prop: DynamicPropertyContainer): void;
    getValue(_flag?: boolean): number | number[];
    initDynamicPropertyContainer(container: ElementInterfaceIntersect): void;
    iterateDynamicProperties(): number;
    setGroupProperty(_propertyInterface: PropertyInterface): void;
}
