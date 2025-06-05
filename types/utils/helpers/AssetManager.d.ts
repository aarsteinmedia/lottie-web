declare function loadLumaCanvas(): void;
declare function getLumaCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement;
declare function createCanvas(width: number, height: number): OffscreenCanvas | HTMLCanvasElement;
declare const AssetManager: {
    createCanvas: typeof createCanvas;
    getLumaCanvas: typeof getLumaCanvas;
    loadLumaCanvas: typeof loadLumaCanvas;
};
export default AssetManager;
