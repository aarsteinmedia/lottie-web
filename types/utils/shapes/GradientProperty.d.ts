import type { ElementInterfaceIntersect, GradientColor } from '../../types';
import DynamicPropertyContainer from '../../utils/helpers/DynamicPropertyContainer';
import PropertyFactory from '../../utils/PropertyFactory';
export default class GradientProperty extends DynamicPropertyContainer {
    _cmdf: boolean;
    _collapsable: boolean;
    _hasOpacity: number;
    _omdf: boolean;
    c: Uint8ClampedArray;
    data: GradientColor;
    k?: boolean;
    o: Float32Array;
    prop: ReturnType<typeof PropertyFactory.getProp>;
    constructor(elem: ElementInterfaceIntersect, data: GradientColor, container: ElementInterfaceIntersect);
    checkCollapsable(): boolean;
    comparePoints(values: number[], points: number): boolean;
    getValue(forceRender?: boolean): void;
}
