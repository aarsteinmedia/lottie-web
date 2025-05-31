import type { DynamicProperty, Effect, ElementInterfaceIntersect, GradientColor, Shape, TextData, TextRangeValue, VectorProperty } from '../../types';
import type { PropType } from '../../utils/enums';
import type PropertyInterface from '../../utils/expressions/PropertyInterface';
import type TextProperty from '../text/TextProperty';
export default abstract class DynamicPropertyContainer {
    _isAnimated?: boolean;
    _mdf?: boolean;
    container?: ElementInterfaceIntersect | null;
    data?: DynamicProperty | Shape | TextProperty | TextData | TextRangeValue | VectorProperty<Keyframe[]> | GradientColor | Effect;
    dynamicProperties: DynamicPropertyContainer[];
    hd?: boolean;
    propType?: PropType | false;
    addDynamicProperty(prop: DynamicPropertyContainer): void;
    getValue(_flag?: unknown): unknown;
    initDynamicPropertyContainer(container: ElementInterfaceIntersect): void;
    iterateDynamicProperties(): unknown;
    setGroupProperty(_propertyInterface: PropertyInterface): void;
}
