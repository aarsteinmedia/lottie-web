import type { ElementInterfaceIntersect } from '@/types';
export default class TextExpressionInterface {
    _sourceText?: {
        value: string;
        style?: {
            fillColor: string;
        };
    };
    elem: ElementInterfaceIntersect;
    get sourceText(): {
        value: string;
        style?: {
            fillColor: string;
        };
    };
    constructor(elem: ElementInterfaceIntersect);
    getInterface(name: string): {
        value: string;
        style?: {
            fillColor: string;
        };
    } | null;
}
