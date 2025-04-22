import type { AnimationItem } from '../../Lottie';
export default class Expressions {
    private registers;
    private stackCount;
    constructor(animation: AnimationItem);
    resetFrame(): void;
    private popExpression;
    private pushExpression;
    private registerExpressionProperty;
    private releaseInstances;
}
