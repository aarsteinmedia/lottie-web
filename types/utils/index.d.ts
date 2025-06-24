import type { LottieAsset, PoolElement, Vector2 } from '@/types';
import type ShapePath from '@/utils/shapes/ShapePath';
export declare const floatEqual: (a: number, b: number) => boolean, floatZero: (f: number) => boolean, pointEqual: (p1: Vector2, p2: Vector2) => boolean, createElementID: () => string, clamp: (n: number, minFromProps?: number, maxFromProps?: number) => number, download: (data: string | ArrayBuffer, options?: {
    name: string;
    mimeType: string;
}) => void, getExt: (str?: string) => string | undefined, getExtFromB64: (str: string) => string | undefined, getFilename: (src: string, keepExt?: boolean) => string, addExt: (ext: string, str?: string) => string | undefined, isArray: <T>(input: unknown) => input is T[], isArrayOfNum: (input: unknown) => input is number[], isAudio: (asset: LottieAsset) => boolean, isImage: (asset: LottieAsset) => boolean, isDeclaration: (str: string) => str is "var" | "let" | "const", isShapePath: (el?: PoolElement) => el is ShapePath, parseBase64: (str: string) => string, rgbToHex: (rVal: number, gVal: number, bVal: number) => string, styleDiv: (element: HTMLElement | SVGSVGElement) => void;
