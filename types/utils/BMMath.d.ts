import type { BMMath as BMMathType } from '../types';
declare const bmPow: (x: number, y: number) => number, bmSqrt: (x: number) => number, bmFloor: (x: number) => number, bmMax: (...values: number[]) => number, bmMin: (...values: number[]) => number;
declare const BMMath: BMMathType;
declare function bmRnd(value: number): number;
export { bmFloor, BMMath, bmMax, bmMin, bmPow, bmRnd, bmSqrt, };
