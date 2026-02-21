export declare class LetterProps {
    __complete?: boolean;
    _mdf: {
        fc: boolean;
        m: boolean;
        o: boolean;
        p: boolean;
        sc: boolean;
        sw: boolean;
    };
    fc?: string | number[] | undefined;
    m?: number | string | undefined;
    o?: number | undefined;
    p?: number | number[] | undefined;
    sc?: string | number[] | undefined;
    sw?: number | undefined;
    t?: string | undefined;
    constructor(o?: number, sw?: number, sc?: string, fc?: string, m?: number | string, p?: number | number[]);
    update(o: number, sw: number, sc?: string, fc?: string, m?: string, p?: number[]): boolean;
}
