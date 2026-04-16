import type {
  VectorProperty,
  Shape,
  ShapeDataInterface,
  SVGElementInterface,
  Transformer,
} from '@/types';
import type { ShapeType } from '@/utils/enums';

import { createNS } from '@/utils/helpers/svgElements';

export class SVGStyleData {
  _mdf = false;
  closed: boolean;
  coOp?: undefined | number;
  d = '';
  data: Shape;
  finalTransform?: undefined | Transformer;
  gr?: undefined | SVGGElement;
  grd?: undefined | CanvasGradient;
  hd?: undefined | boolean;
  it?: undefined | ShapeDataInterface[];
  lvl: number;
  msElem: null | SVGMaskElement | SVGPathElement = null;
  pElem = createNS<SVGPathElement>('path');
  prevViewData?: undefined | SVGElementInterface[];
  pt?: undefined | VectorProperty;
  style?: undefined | SVGStyleData;
  t?: undefined | number;
  transform?: undefined | Transformer;
  ty?: undefined | ShapeType;
  type?: undefined | ShapeType;
  constructor(data: Shape, level: number) {
    this.data = data;
    this.type = data.ty;
    this.lvl = level;
    this.closed = data.hd === true;
  }

  reset() {
    this.d = '';
    this._mdf = false;
  }
}
