import type { ElementInterfaceIntersect, ExpressionProperty, VectorProperty } from '@/types';
declare function getProp<T = number | number[]>(elem: ElementInterfaceIntersect, dataFromProps?: VectorProperty<T> | ExpressionProperty, type?: number, mult?: null | number, container?: ElementInterfaceIntersect): any;
declare const PropertyFactory: {
    getProp: typeof getProp;
};
export default PropertyFactory;
