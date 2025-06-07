import type { Constructor } from '../types';
export declare const extendPrototype: (sources: Constructor[], destination: Constructor) => void, getDescriptor: (object: unknown, prop: PropertyKey) => PropertyDescriptor | undefined, logPrototype: (sources: Constructor[], destination?: Constructor) => void;
