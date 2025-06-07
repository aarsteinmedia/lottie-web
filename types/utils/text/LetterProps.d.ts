export default class LetterProps {
    __complete?: boolean;
    _mdf: {
        fc: boolean;
        m: boolean;
        o: boolean;
        p: boolean;
        sc: boolean;
        sw: boolean;
    };
    fc?: string | number[];
    m?: number | string;
    o?: number;
    p?: number | number[];
    sc?: string | number[];
    sw?: number;
    t?: string;
    constructor(o?: number, sw?: number, sc?: string, fc?: string, m?: number | string, p?: number | number[]);
    update(o: number, sw: number, sc?: string, fc?: string, m?: string, p?: number[]): boolean;
}
