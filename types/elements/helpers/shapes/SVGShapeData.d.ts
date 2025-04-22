import type SVGStyleData from '../../../elements/helpers/shapes/SVGStyleData';
import type { ShapeType } from '../../../enums';
import type { ShapeDataInterface, SVGElementInterface, Transformer } from '../../../types';
import type ShapeCollection from '../../../utils/shapes/ShapeCollection';
import type ShapePath from '../../../utils/shapes/ShapePath';
import type { ShapeProperty } from '../../../utils/shapes/ShapeProperty';
export default class SVGShapeData {
    _isAnimated: boolean;
    _length?: number;
    caches: string[];
    data?: SVGShapeData;
    gr?: SVGGElement;
    hd?: boolean;
    it: ShapeDataInterface[];
    localShapeCollection?: ShapeCollection;
    lStr: string;
    lvl: number;
    pathsData: ShapePath[];
    prevViewData: SVGElementInterface[];
    sh: ShapeProperty;
    shape?: ShapeProperty;
    style?: SVGStyleData;
    styles: SVGStyleData[];
    transform?: Transformer;
    transformers: Transformer[];
    ty?: ShapeType;
    constructor(transformers: Transformer[], level: number, shape: ShapeProperty);
    setAsAnimated(): void;
}
