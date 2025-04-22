import type DynamicPropertyContainer from '../../utils/helpers/DynamicPropertyContainer';
import HierarchyElement from '../../elements/helpers/HierarchyElement';
export default class FrameElement extends HierarchyElement {
    _mdf?: boolean;
    displayStartTime: number;
    dynamicProperties: DynamicPropertyContainer[];
    frameDuration: number;
    addDynamicProperty(prop: DynamicPropertyContainer): void;
    initFrame(): void;
    prepareProperties(_: number, isVisible?: boolean): void;
}
