import type {
  LottieAsset,
  PoolElement,
  Vector2,
} from '@/types';
import type { ShapePath } from '@/utils/shapes/ShapePath';

import { getIDPrefix } from '@/utils/helpers/prefix';

interface DownloadOptions {
  mimeType: string
  name: string
}

const hasExt = (path?: string) => {
  const lastDotIndex = path?.split('/').pop()?.lastIndexOf('.');

  return (
    (lastDotIndex ?? 0) > 1 && path && path.length - 1 > (lastDotIndex ?? 0)
  );
};

/**
 * Exported functions.
 */
export const floatEqual = (a: number, b: number) =>
  Math.abs(a - b) * 100000 <= Math.min(Math.abs(a), Math.abs(b));

export const floatZero = (f: number) => Math.abs(f) <= 0.00001;

export const pointEqual = (p1: Vector2, p2: Vector2) =>
  floatEqual(p1[0], p2[0]) && floatEqual(p1[1], p2[1]);

export const createElementID = (() => {
  let _count = 0;

  return () => {
    _count++;

    return `${getIDPrefix()}__lottie_element_${_count}`;
  };
})();

export const clamp = (
  n: number, minFromProps = 0, maxFromProps = 100
) => {
  let min = minFromProps;
  let max = maxFromProps;

  if (min > max) {
    const mm = max;

    max = min;
    min = mm;
  }

  return Math.min(Math.max(n, min), max);
};

/**
   * Download file, either SVG or dotLottie.
   */
export const download = (data: string | ArrayBuffer,
  options?: DownloadOptions) => {
  const blob = new Blob([data], { type: options?.mimeType ?? '' });
  const fileName = options?.name || createElementID();
  const dataURL = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = dataURL;
  link.download = fileName;
  link.hidden = true;
  document.body.appendChild(link);

  link.click();

  setTimeout(() => {
    link.remove();
    URL.revokeObjectURL(dataURL);
  }, 1000);
};

export const getExt = (str?: string) => {
  if (typeof str !== 'string' || !str || !hasExt(str)) {
    return;
  }

  return str.split('.').pop()?.toLowerCase();
};

export const getExtFromB64 = (str: string) => {
  const mime = str.split(':')[1]?.split(';')[0];
  const ext = mime?.split('/')[1]?.split('+')[0];

  return ext;
};

/**
     * Parse URL to get filename.
     *
     * @param src - The url string.
     * @param keepExt - Whether to include file extension.
     * @returns Filename, in lowercase.
     */
export const getFilename = (src: string, keepExt?: boolean) => {
  // Because the regex strips all special characters, we need to extract the file extension, so we can add it later if we need it
  let ext = getExt(src);

  ext = ext ? `.${ext}` : undefined;

  return `${src
    .split('/')
    .pop()
    ?.replace(/\.[^.]*$/, '')
    .replaceAll(/\W+/g, '-')}${keepExt && ext ? ext : ''}`;
};

export const addExt = (ext: string, str?: string) => {
  if (!str) {
    return;
  }
  if (getExt(str)) {
    if (getExt(str) === ext) {
      return str;
    }

    return `${getFilename(str)}.${ext}`;
  }

  return `${str}.${ext}`;
};

export const isArray = <T>(input: unknown): input is T[] => {
  return Symbol.iterator in Object(input) && (input as unknown[]).length > 0;
};

/** Check if value is array. Made to work with typed arrays as well as regular. */
export const isArrayOfNum = (input: unknown): input is number[] => {
  return isArray(input) &&
    typeof input[0] === 'number';
};

export const isAudio = (asset: LottieAsset) =>
  !('h' in asset) &&
  !('w' in asset) &&
  'p' in asset &&
  'e' in asset &&
  'u' in asset &&
  'id' in asset;

export const isImage = (asset: LottieAsset) =>
  'w' in asset && 'h' in asset && !('xt' in asset) && 'p' in asset;

export const isDeclaration = (str: string) => {
  return str === 'var' || str === 'let' || str === 'const';
};

export const isShapePath = (el?: PoolElement): el is ShapePath => {

  if (!el || isArray(el)) {
    return false;
  }

  return '_type' in el && el._type === 'ShapePath';

};

export const parseBase64 = (str: string) => str.slice(Math.max(0, str.indexOf(',') + 1));

export const rgbToHex = (
  rVal: number, gVal: number, bVal: number
) => {
  const colorMap: string[] = [];
  let hex;

  for (let i = 0; i < 256; i++) {
    hex = i.toString(16);
    colorMap[i] = hex.length === 1 ? `0${hex}` : hex;
  }

  let r = rVal;
  let g = gVal;
  let b = bVal;

  if (rVal < 0) {
    r = 0;
  }
  if (gVal < 0) {
    g = 0;
  }
  if (bVal < 0) {
    b = 0;
  }

  return `#${colorMap[r]}${colorMap[g]}${colorMap[b]}`;
};

export const styleDiv = (element: HTMLElement | SVGSVGElement) => {
  element.style.position = 'absolute';
  element.style.top = '0';
  element.style.left = '0';
  element.style.display = 'block';
  element.style.transformOrigin = '0 0';
  element.style.backfaceVisibility = 'visible';
  element.style.transformStyle = 'preserve-3d';
};
