import type FootageElement from '../../elements/FootageElement';
declare class OutlineInterface {
    private currentProperty;
    private currentPropertyName;
    private elem;
    constructor(elem: FootageElement);
    init: () => (value: keyof typeof this.currentProperty) => any;
    searchProperty: (value: keyof typeof this.currentProperty) => any;
}
declare class DataInterface {
    _name: string;
    elem: FootageElement;
    outlineInterface: OutlineInterface;
    constructor(elem: FootageElement);
    interfaceFunction: (value: string) => ((value: keyof typeof this.currentProperty) => any) | null;
}
export default class FootageInterface {
    _name: string;
    dataInterface: DataInterface;
    elem: FootageElement;
    constructor(elem: FootageElement);
    interfaceFunction: (value: string) => DataInterface | null;
}
export {};
