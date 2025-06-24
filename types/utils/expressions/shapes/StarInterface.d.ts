import type StarShapeProperty from '@/utils/shapes/properties/StarShapeProperty';
import BaseInterface from '@/utils/expressions/shapes/BaseInterface';
export default class StarInterface extends BaseInterface {
    prop?: StarShapeProperty;
    get innerRadius(): any;
    get innerRoundness(): any;
    get outerRadius(): any;
    get outerRoundness(): any;
    get points(): any;
    get position(): any;
    get rotation(): any;
    getInterface(value: string | number): any;
}
