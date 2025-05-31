export declare function loadLumaCanvas(): void;
export declare function getLumaCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement;
export declare function createCanvas(width: number, height: number): OffscreenCanvas | HTMLCanvasElement;
declare const AssetManager: {
    createCanvas: typeof createCanvas;
    getLumaCanvas: typeof getLumaCanvas;
    loadLumaCanvas: typeof loadLumaCanvas;
};
export default AssetManager;
