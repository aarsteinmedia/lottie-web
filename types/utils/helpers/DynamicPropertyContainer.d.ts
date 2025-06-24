import type { DynamicProperty, Effect, ElementInterfaceIntersect, GradientColor, Keyframe, Shape, TextData, TextRangeValue, VectorProperty } from '../../types';
import type { PropType } from '../../utils/enums';
import type PropertyGroupFactory from '../../utils/expressions/PropertyGroupFactory';
import type TextProperty from '../../utils/text/TextProperty';
export default abstract class DynamicPropertyContainer {
    _isAnimated?: boolean;
    _mdf?: boolean;
    container?: ElementInterfaceIntersect | null;
    data?: DynamicProperty | Shape | TextProperty | TextData | TextRangeValue | VectorProperty<Keyframe[]> | GradientColor | Effect;
    dynamicProperties: DynamicPropertyContainer[];
    hd?: boolean;
    keyframes?: Keyframe[];
    propertyIndex?: number;
    propType?: PropType | false;
    addDynamicProperty(prop: DynamicPropertyContainer): void;
    getValue(_flag?: unknown): unknown;
    initDynamicPropertyContainer(container: ElementInterfaceIntersect): void;
    iterateDynamicProperties(): unknown;
    setGroupProperty(_propertyInterface: PropertyGroupFactory): void;
}
