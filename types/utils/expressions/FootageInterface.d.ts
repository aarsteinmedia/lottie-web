import type FootageElement from '@/elements/FootageElement';
export default class FootageInterface {
    _name: string;
    currentProperty?: SVGElement | null;
    currentPropertyName: string;
    dataInterface: FootageInterface;
    elem: FootageElement;
    constructor(elem: FootageElement);
    dataInterfaceFactory(elem: FootageElement): this;
    getInterface(value: number | string): FootageInterface | null | undefined;
    init(): (value: keyof SVGElement) => "" | any | undefined;
    outlineInterface(_elem?: FootageElement): void;
    outlineInterfaceFactory(elem: FootageElement): () => (value: keyof SVGElement) => "" | any | undefined;
    searchProperty(value: keyof SVGElement): "" | ((value: keyof SVGElement) => "" | any | undefined) | undefined;
}
