import type { SVGFillStyleData } from '../../../elements/helpers/shapes/SVGFillStyleData';
import type { SVGGradientFillStyleData } from '../../../elements/helpers/shapes/SVGGradientFillStyleData';
import type { SVGStrokeStyleData } from '../../../elements/helpers/shapes/SVGStrokeStyleData';
import type { SVGTransformData } from '../../../elements/helpers/shapes/SVGTransformData';
import type { Shape, Transformer } from '../../../types';
import type { PropertyGroupFactory } from '../../../utils/expressions/PropertyGroupFactory';
import type { RepeaterModifier } from '../../../utils/shapes/modifiers/RepeaterModifier';
import type { RoundCornersModifier } from '../../../utils/shapes/modifiers/RoundCornersModifier';
import type { TrimModifier } from '../../../utils/shapes/modifiers/TrimModifier';
import type { EllShapeProperty } from '../../../utils/shapes/properties/EllShapeProperty';
import type { RectShapeProperty } from '../../../utils/shapes/properties/RectShapeProperty';
import type { StarShapeProperty } from '../../../utils/shapes/properties/StarShapeProperty';
export declare abstract class BaseInterface {
    _name?: string;
    mn?: string;
    nm?: string;
    numProperties?: number;
    prop?: StarShapeProperty | RectShapeProperty | EllShapeProperty | RoundCornersModifier | RepeaterModifier | TrimModifier | SVGGradientFillStyleData | SVGStrokeStyleData | SVGFillStyleData | SVGTransformData;
    propertyGroup?: PropertyGroupFactory;
    propertyIndex?: number;
    shape?: Shape;
    transform?: Transformer;
    getInterface(_value: string | number): void;
}
