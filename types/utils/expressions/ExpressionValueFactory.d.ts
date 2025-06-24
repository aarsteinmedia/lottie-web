import type BaseProperty from '@/utils/properties/BaseProperty';
import { PropType } from '@/utils/enums';
export declare class ExpressionPropertyInterface {
    defaultMultidimensionalValue: {
        mult: number;
        pv: number[];
        v: number[];
    };
    defaultUnidimensionalValue: {
        mult: number;
        pv: number;
        v: number;
    };
    completeProperty(expressionValue: BaseProperty & {
        key: (pos: number) => unknown;
    }, property: BaseProperty, type: PropType): void;
    defaultGetter(): {
        mult: number;
        pv: number;
        v: number;
    };
    getInterface(property?: BaseProperty): () => any;
    MultidimensionalPropertyInterface(propertyFromProps: null | BaseProperty): () => any;
    UnidimensionalPropertyInterface(propertyFromProps: null | BaseProperty): () => Number;
}
export default function expressionPropertyFactory(property?: BaseProperty): () => any;
