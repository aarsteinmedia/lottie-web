import type { Characacter, DocumentData } from '../types';
export declare function isCombinedCharacter(char: number): boolean;
export declare function isFlagEmoji(string: string): boolean;
export declare function isModifier(firstCharCode: number, secondCharCode: number): boolean;
export declare function isRegionalCode(string: string): boolean;
export declare function isRegionalFlag(text: string, indexFromProps: number): boolean;
export declare function isVariationSelector(charCode: number): boolean;
export declare function isZeroWidthJoiner(charCode: number): boolean;
export default class FontManager {
    chars: Characacter[] | null;
    fonts: DocumentData[];
    isLoaded: boolean;
    typekitLoaded: number;
    private _warned;
    private checkLoadedFontsBinded;
    private initTime;
    private setIsLoadedBinded;
    constructor();
    addChars(chars?: null | Characacter[]): void;
    addFonts(fontData?: {
        list: DocumentData[];
    }, defs?: HTMLElement | SVGDefsElement): void;
    getCharData(char: Characacter | string, style?: string, font?: string): Characacter;
    getFontByName(name?: string): DocumentData;
    measureText(char: string, fontName?: string, size?: number): number;
    private checkLoadedFonts;
    private createHelper;
    private setIsLoaded;
}
