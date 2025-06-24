import type { PoolElement } from '@/types';
export default class PoolFactory {
    private _create;
    private _length;
    private _maxLength;
    private _release?;
    private pool;
    constructor(initialLength: number, _create: (_element?: PoolElement) => PoolElement, _release?: (el: PoolElement) => void);
    newElement(): PoolElement;
    release(element: PoolElement): void;
}
