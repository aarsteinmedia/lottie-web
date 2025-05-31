import type ShapePath from '@/utils/shapes/ShapePath';
export default class PoolFactory {
    private _create;
    private _length;
    private _maxLength;
    private _release?;
    private pool;
    constructor(initialLength: number, _create: (_element?: ShapePath) => unknown, _release?: <Release = unknown>(el?: Release) => void);
    newElement<T = unknown>(): T;
    release<T = unknown>(element?: T): void;
}
