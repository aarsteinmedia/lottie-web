export default class PropertyInterface {
    private propertyGroup;
    _name: string;
    constructor(propertyName: string, propertyGroup: (val: number) => unknown);
    _propertyGroup(val?: number): unknown;
}
