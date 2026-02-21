import type Expressions from '../../utils/expressions/Expressions';
import type { getInterface } from '../../utils/expressions/InterfacesProvider';
export declare const setExpressionsPlugin: (value: typeof Expressions) => void, getExpressionsPlugin: () => {
    initExpressions: (animation: import("../../Lottie").AnimationItem) => void;
    resetFrame: () => void;
} | null, setExpressionInterfaces: (value: typeof getInterface) => void, getExpressionInterfaces: () => typeof getInterface | null;
