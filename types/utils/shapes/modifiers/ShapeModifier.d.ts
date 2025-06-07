import type CVShapeData from '@/elements/helpers/shapes/CVShapeData';
import type ShapeGroupData from '@/elements/helpers/shapes/ShapeGroupData';
import type SVGShapeData from '@/elements/helpers/shapes/SVGShapeData';
import type { ElementInterfaceIntersect, Shape } from '@/types';
import type OffsetPathModifier from '@/utils/shapes/modifiers/OffsetPathModifier';
import type PuckerAndBloatModifier from '@/utils/shapes/modifiers/PuckerAndBloatModifier';
import type RepeaterModifier from '@/utils/shapes/modifiers/RepeaterModifier';
import type RoundCornersModifier from '@/utils/shapes/modifiers/RoundCornersModifier';
import type TrimModifier from '@/utils/shapes/modifiers/TrimModifier';
import type ZigZagModifier from '@/utils/shapes/modifiers/ZigZagModifier';
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer';
export type ModifierInterface = OffsetPathModifier | PuckerAndBloatModifier | RepeaterModifier | RoundCornersModifier | TrimModifier | ZigZagModifier;
export default class ShapeModifier extends DynamicPropertyContainer {
    closed?: boolean;
    elem?: ElementInterfaceIntersect;
    frameId?: number;
    k?: boolean;
    shapes: SVGShapeData[];
    addShape(data: SVGShapeData | CVShapeData): void;
    addShapeToModifier(_shapeData: SVGShapeData): void;
    init(elem: ElementInterfaceIntersect, data: Shape | Shape[], _posFromProps?: number, _elemsData?: ShapeGroupData[]): void;
    initModifierProperties(_elem: ElementInterfaceIntersect, _data: Shape | Shape[]): void;
    isAnimatedWithShape(_data: Shape): boolean;
    processKeys(): number;
}
