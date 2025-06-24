import type { TransformProperty } from '@/utils/TransformProperty';
export default class TransformExpressionInterface {
    transform: TransformProperty;
    get anchorPoint(): any;
    get opacity(): any;
    get orientation(): any;
    get position(): any;
    get rotation(): any;
    get scale(): any;
    get skew(): any;
    get skewAxis(): any;
    get xPosition(): any;
    get xRotation(): any;
    get yPosition(): any;
    get yRotation(): any;
    get zPosition(): any;
    get zRotation(): any;
    private _px;
    private _py;
    private _pz;
    private _transformFactory;
    constructor(transform: TransformProperty);
    getInterface(name: string | number): any;
}
