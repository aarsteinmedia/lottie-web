import type { ElementInterfaceIntersect } from '../../../types';
import type { MouseModifier } from '../../../utils/shapes/modifiers/MouseModifier';
import type { OffsetPathModifier } from '../../../utils/shapes/modifiers/OffsetPathModifier';
import type { PuckerAndBloatModifier } from '../../../utils/shapes/modifiers/PuckerAndBloatModifier';
import type { RepeaterModifier } from '../../../utils/shapes/modifiers/RepeaterModifier';
import type { TrimModifier } from '../../../utils/shapes/modifiers/TrimModifier';
import type { ZigZagModifier } from '../../../utils/shapes/modifiers/ZigZagModifier';
export type ShapeModifierInterface = TrimModifier | PuckerAndBloatModifier | RepeaterModifier | ZigZagModifier | OffsetPathModifier;
type Modifier = typeof TrimModifier | typeof PuckerAndBloatModifier | typeof RepeaterModifier | typeof ZigZagModifier | typeof OffsetPathModifier | typeof MouseModifier;
export declare function getModifier<T extends ShapeModifierInterface>(nm: string, _elem?: ElementInterfaceIntersect, _data?: unknown): T;
export declare function registerModifier(nm: string, factory: Modifier): void;
declare const ShapeModifiers: {
    getModifier: typeof getModifier;
    registerModifier: typeof registerModifier;
};
export default ShapeModifiers;
