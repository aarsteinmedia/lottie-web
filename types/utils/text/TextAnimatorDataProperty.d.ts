import type { ElementInterfaceIntersect } from '../../types';
import type { MultiDimensionalProperty } from '../../utils/properties/MultiDimensionalProperty';
import type { NoProperty } from '../../utils/properties/NoProperty';
import type { ValueProperty } from '../../utils/properties/ValueProperty';
import { TextSelectorProperty } from '../../utils/text/TextSelectorProperty';
export declare class TextAnimatorDataProperty {
    a?: {
        a: ValueProperty | NoProperty;
        fb: ValueProperty | NoProperty;
        fc: ValueProperty | NoProperty;
        fh: ValueProperty | NoProperty;
        fs: ValueProperty | NoProperty;
        o: ValueProperty | NoProperty;
        p: MultiDimensionalProperty | NoProperty;
        r: ValueProperty | NoProperty;
        rx: ValueProperty | NoProperty;
        ry: ValueProperty | NoProperty;
        s: ValueProperty | NoProperty;
        sa: ValueProperty | NoProperty;
        sc: ValueProperty | NoProperty;
        sk: ValueProperty | NoProperty;
        sw: ValueProperty | NoProperty;
        t: ValueProperty | NoProperty;
    };
    s?: TextSelectorProperty;
    constructor(elem: ElementInterfaceIntersect, animatorProps?: TextAnimatorDataProperty, container?: ElementInterfaceIntersect);
}
