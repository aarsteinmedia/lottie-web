import type DynamicPropertyContainer from '../../utils/helpers/DynamicPropertyContainer';
import HierarchyElement from '../../elements/helpers/HierarchyElement';
export default abstract class FrameElement extends HierarchyElement {
    _mdf?: boolean;
    displayStartTime: number;
    addDynamicProperty(prop: DynamicPropertyContainer): void;
    initFrame(): void;
    prepareProperties(_number: number, isVisible?: boolean): void;
}
