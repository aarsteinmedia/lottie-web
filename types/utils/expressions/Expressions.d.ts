import type { AnimationItem } from '../../Lottie';
declare function initExpressions(animation: AnimationItem): void;
declare const Expressions: {
    initExpressions: typeof initExpressions;
    resetFrame: () => void;
};
export default Expressions;
