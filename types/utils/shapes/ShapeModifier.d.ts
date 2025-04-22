import type SVGShapeData from '../../elements/helpers/shapes/SVGShapeData';
import type { ElementInterfaceIntersect, ElementInterfaceUnion, Shape } from '../../types';
import type OffsetPathModifier from '../../utils/shapes/OffsetPathModifier';
import type PuckerAndBloatModifier from '../../utils/shapes/PuckerAndBloatModifier';
import type RepeaterModifier from '../../utils/shapes/RepeaterModifier';
import type RoundCornersModifier from '../../utils/shapes/RoundCornersModifier';
import type TrimModifier from '../../utils/shapes/TrimModifier';
import type ZigZagModifier from '../../utils/shapes/ZigZagModifier';
import CVShapeData from '../../elements/helpers/shapes/CVShapeData';
import ShapeGroupData from '../../elements/helpers/shapes/ShapeGroupData';
import DynamicPropertyContainer from '../../utils/helpers/DynamicPropertyContainer';
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
    initModifierProperties(_elem: ElementInterfaceUnion, _data: Shape | Shape[]): void;
    isAnimatedWithShape(_data: Shape): boolean;
    processKeys(): void;
}
