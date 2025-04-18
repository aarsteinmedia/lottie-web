import type { ElementInterfaceIntersect } from '../../types';
export default abstract class DynamicPropertyContainer {
    _isAnimated?: boolean;
    _mdf?: boolean;
    container?: ElementInterfaceIntersect | null;
    dynamicProperties: DynamicPropertyContainer[];
    propType?: string | false;
    addDynamicProperty(prop: DynamicPropertyContainer): void;
    getValue(_flag?: boolean): void;
    initDynamicPropertyContainer(container: ElementInterfaceIntersect): void;
    iterateDynamicProperties(): void;
}
