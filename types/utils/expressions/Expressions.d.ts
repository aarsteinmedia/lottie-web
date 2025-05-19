import type Animationitem from '../../animation/AnimationItem';
export default class Expressions {
    private registers;
    private stackCount;
    constructor(animation: Animationitem);
    resetFrame(): void;
    private popExpression;
    private pushExpression;
    private registerExpressionProperty;
    private releaseInstances;
}
