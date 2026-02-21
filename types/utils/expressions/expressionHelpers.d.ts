import type { ElementInterfaceIntersect, ExpressionProperty } from '../../types';
import type { PropertyGroupFactory } from '../../utils/expressions/PropertyGroupFactory';
import type { BaseProperty } from '../../utils/properties/BaseProperty';
import type { KeyframedValueProperty } from '../../utils/properties/KeyframedValueProperty';
declare function searchExpressions(elem: ElementInterfaceIntersect, data?: ExpressionProperty, prop?: KeyframedValueProperty): void;
declare function getValueAtTime(this: BaseProperty, frameNumFromProps: number): number | number[] | undefined;
declare function getSpeedAtTime(this: BaseProperty, frameNum: number): number;
declare function getVelocityAtTime(this: BaseProperty, frameNum: number): number | number[];
declare function getStaticValueAtTime(this: BaseProperty, _time?: number, _num?: number): string | number | number[] | import("../../types").DocumentData | import("../shapes/ShapePath").ShapePath | undefined;
declare function setGroupProperty(this: BaseProperty, propertyGroup: PropertyGroupFactory): void;
declare const expressionHelpers: {
    getSpeedAtTime: typeof getSpeedAtTime;
    getStaticValueAtTime: typeof getStaticValueAtTime;
    getValueAtTime: typeof getValueAtTime;
    getVelocityAtTime: typeof getVelocityAtTime;
    searchExpressions: typeof searchExpressions;
    setGroupProperty: typeof setGroupProperty;
};
export default expressionHelpers;
