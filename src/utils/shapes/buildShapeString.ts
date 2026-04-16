import type { Vector2 } from '@/Lottie';
import type { Matrix } from '@/utils/Matrix';
import type { ShapePath } from '@/utils/shapes/ShapePath';

export function buildShapeString(
  pathNodes: ShapePath,
  length: number,
  closed: boolean,
  mat: Matrix
) {
  if (length === 0) {
    return '';
  }
  const _o = pathNodes.o;
  const _i = pathNodes.i;
  const _v = pathNodes.v;
  let i;
  let vVector: Vector2 = [_v[0]?.[0] ?? 0, _v[0]?.[1] ?? 0];
  let vString = mat.applyToPointStringified(...vVector);
  let iVector: Vector2;
  let iString: string;
  let oVector: Vector2;
  let oString: string;
  let shapeString = ` M${vString}`;

  for (i = 1; i < length; i++) {
    oVector = [_o[i - 1]?.[0] ?? 0, _o[i - 1]?.[1] ?? 0];
    oString = mat.applyToPointStringified(...oVector);
    iVector = [_i[i]?.[0] ?? 0, _i[i]?.[1] ?? 0];
    iString = mat.applyToPointStringified(...iVector);
    vVector = [_v[i]?.[0] ?? 0, _v[i]?.[1] ?? 0];
    vString = mat.applyToPointStringified(...vVector);

    shapeString += ` C${oString} ${iString} ${vString}`;
  }
  if (closed) {
    oVector = [_o[i - 1]?.[0] ?? 0, _o[i - 1]?.[1] ?? 0];
    oString = mat.applyToPointStringified(...oVector);
    iVector = [_i[0]?.[0] ?? 0, _i[0]?.[1] ?? 0];
    iString = mat.applyToPointStringified(...iVector);
    vVector = [_v[0]?.[0] ?? 0, _v[0]?.[1] ?? 0];
    vString = mat.applyToPointStringified(...vVector);

    shapeString += ` C${oString} ${iString} ${vString}z`;
  }

  return shapeString;
}