import type AnimationItem from './animation/AnimationItem';
import type { AngleEffect, CheckboxEffect, ColorEffect, LayerIndexEffect, MaskIndexEffect, NoValueEffect, PointEffect, SliderEffect } from './effects';
import type { SVGDropShadowEffect, SVGFillFilter, SVGGaussianBlurEffect, SVGMatte3Effect, SVGProLevelsFilter, SVGStrokeEffect, SVGTintFilter, SVGTransformEffect, SVGTritoneFilter } from './effects/svg';
import type AudioElement from './elements/AudioElement';
import type BaseElement from './elements/BaseElement';
import type CompElement from './elements/CompElement';
import type HierarchyElement from './elements/helpers/HierarchyElement';
import type { SVGFillStyleData, SVGGradientFillStyleData, SVGGradientStrokeStyleData, SVGNoStyleData, SVGShapeData, SVGStrokeStyleData, SVGStyleData, SVGTransformData } from './elements/helpers/shapes';
import type TransformElement from './elements/helpers/TransformElement';
import type MaskElement from './elements/MaskElement';
import type PolynomialBezier from './elements/PolynomialBezier';
import type ShapeElement from './elements/ShapeElement';
import type SVGBaseElement from './elements/svg/SVGBaseElement';
import type SVGShapeElement from './elements/svg/SVGShapeElement';
import type TextElement from './elements/TextElement';
import type { PlayMode, ShapeType, RendererType } from './enums';
import type BaseRenderer from './renderers/BaseRenderer';
import type { CreateRenderFunction } from './renderers/SVGElementsRenderer';
import type AudioController from './utils/audio/AudioController';
import type FontManager from './utils/FontManager';
import type DynamicPropertyContainer from './utils/helpers/DynamicPropertyContainer';
import type Matrix from './utils/Matrix';
import type { BaseProperty, ValueProperty } from './utils/Properties';
import type ShapePath from './utils/shapes/ShapePath';
import type SlotManager from './utils/SlotManager';
import type LetterProps from './utils/text/LetterProps';
import type TextAnimatorDataProperty from './utils/text/TextAnimatorDataProperty';
import type TextProperty from './utils/text/TextProperty';
import type TransformProperty from './utils/TransformProperty';
import { getShapeProp } from './utils/shapes/ShapeProperty';
export type AnimationDirection = 1 | -1;
export type AnimationEventName = 'drawnFrame' | 'enterFrame' | 'loopComplete' | 'complete' | 'segmentStart' | 'destroy' | 'config_ready' | 'data_ready' | 'DOMLoaded' | 'error' | 'data_failed' | 'loaded_images' | '_play' | '_pause' | '_idle' | '_active' | 'configError' | 'renderFrameError';
export interface SVGGeometry {
    cx: number;
    cy: number;
    height: number;
    width: number;
}
export type SVGElementInterface = SVGShapeData | SVGTransformData | SVGFillStyleData | SVGStrokeStyleData | SVGNoStyleData | SVGGradientFillStyleData | SVGGradientStrokeStyleData;
export interface Transformer {
    _localMatMdf: boolean;
    _matMdf: boolean;
    _mdf?: boolean;
    _opMdf: boolean;
    container: SVGGElement;
    localMat: Matrix;
    localOpacity: number;
    mat: Matrix;
    matrix?: Matrix;
    mProp: TransformProperty;
    mProps: TransformProperty;
    op: ValueProperty;
    opacity: number;
}
export type ElementInterfaceUnion = BaseElement | HierarchyElement | AudioElement | CompElement | MaskElement | SVGBaseElement | SVGShapeElement | SVGTextElement | SVGStopElement | SVGStrokeStyleData | TextElement | BaseRenderer | AnimationItem | TransformElement;
export type ElementInterfaceIntersect = BaseElement & HierarchyElement & AudioElement & CompElement & MaskElement & SVGBaseElement & SVGShapeElement & SVGTextElement & SVGStopElement & SVGStrokeStyleData & TextElement & BaseRenderer & AnimationItem & TransformElement;
export interface CompInterface extends AnimationItem {
    _mdf?: boolean;
    addDynamicProperty: (prop: TextProperty | DynamicPropertyContainer) => void;
    animationItem: AnimationItem;
    assetData: ImageData;
    baseElement: SVGElement;
    buildElementParenting: (element: ElementInterfaceIntersect, parentId?: number, hierarchy?: ElementInterfaceIntersect[]) => void;
    checkParenting: () => void;
    comp: CompInterface;
    compInterface: CompInterface;
    completeLayers: boolean;
    configAnimation: (animData: AnimationData) => void;
    data: LottieLayer;
    destroy: () => void;
    dynamicProperties: DynamicPropertyContainer[];
    effectsManager: unknown;
    elements: CompInterface[];
    getBaseElement: () => SVGElement;
    getElementByPath: (val: unknown[]) => CompInterface;
    getMatte: (id?: number) => string;
    globalData: GlobalData;
    hierarchy: boolean;
    initBaseData: (data: LottieLayer, globalData: GlobalData, comp: CompInterface) => void;
    initElement: (data: LottieLayer, globalData: GlobalData, comp: CompInterface) => void;
    initExpressions: () => void;
    initFrame: () => void;
    initHierarchy: (hierarchy?: unknown[]) => void;
    initItems: () => void;
    initTransform: (data: LottieLayer, globalData: GlobalData, comp: CompInterface) => void;
    layerElement: SVGGElement;
    layers: LottieLayer[];
    maskedElement: SVGGElement;
    maskManager: MaskElement;
    matteElement: SVGGElement;
    pendingElements: ElementInterfaceIntersect[];
    prepareFrame?: (val: number) => void;
    renderConfig: SVGRendererConfig;
    renderedFrame: number;
    rendererType: RendererType;
    searchExtraCompositions: (assets: (LottieAsset | LottieLayer)[]) => void;
    setAsParent: () => void;
    setMatte: (id: string) => void;
    supports3d: boolean;
    svgElement?: SVGSVGElement;
    textProperty?: {
        currentData: {
            l: number[];
        };
    };
    tm: number;
}
export interface AnimatedContent {
    data: Shape;
    element: ShapeDataInterface | SVGElementInterface;
    fn: null | CreateRenderFunction;
}
export interface EFXElement {
    p: BaseProperty;
}
export interface KeyframesMetadata {
    __fnct?: (val: number) => number;
}
type BaseRendererConfig = {
    imagePreserveAspectRatio?: string;
    className?: string;
};
export type FilterSizeConfig = {
    width: string;
    height: string;
    x: string;
    y: string;
};
export interface Letter {
    add: number;
    an: number;
    animatorJustifyOffset: number;
    anIndexes: number[];
    extra?: number;
    ind?: number;
    l: number;
    line: number;
    n: boolean;
    val: string;
}
export type SVGRendererConfig = BaseRendererConfig & {
    title?: string;
    description?: string;
    preserveAspectRatio?: string;
    progressiveLoad?: boolean;
    hideOnTransparent?: boolean;
    viewBoxOnly?: boolean;
    viewBoxSize?: string | false;
    focusable?: boolean;
    filterSize?: FilterSizeConfig;
    contentVisibility?: string;
    runExpressions?: boolean;
    width?: number;
    height?: number;
    id?: string;
};
export type CanvasRendererConfig = BaseRendererConfig & {
    clearCanvas?: boolean;
    context?: CanvasRenderingContext2D;
    progressiveLoad?: boolean;
    preserveAspectRatio?: string;
};
export type HTMLRendererConfig = BaseRendererConfig & {
    hideOnTransparent?: boolean;
};
export type AnimationConfiguration<T extends RendererType = RendererType.Canvas | RendererType.HTML | RendererType.SVG> = {
    animationData?: AnimationData;
    animType?: RendererType;
    container?: HTMLElement;
    wrapper?: HTMLElement;
    renderer?: T;
    autoloadSegments?: boolean;
    loop?: Loop;
    autoplay?: boolean;
    initialSegment?: Vector2;
    name?: string;
    assetsPath?: string;
    rendererSettings?: {
        svg: SVGRendererConfig;
        canvas: CanvasRendererConfig;
        html: HTMLRendererConfig;
    }[T];
    audioFactory?: AudioFactory;
    path?: string;
    prerender?: boolean;
};
export interface Stop {
    s: number[];
}
export interface GradientColor {
    k: {
        a: 1 | 0;
        k: number[] | Stop[];
    };
    p: number;
}
type BoolInt = 0 | 1;
interface ShapeDataProperty {
    _mdf?: boolean;
    a: 1 | 0;
    ix?: number;
    k: ShapePath | ShapePath[];
    paths: {
        _length: number;
        _maxLength: number;
        shapes: ShapePath[];
    };
}
export interface StrokeData {
    n: 'o' | 'd' | 'g';
    nm?: 'offset' | 'dash' | 'gap';
    p: any;
    v?: VectorProperty;
}
interface ShapeColor {
    a: 1 | 0;
    ix?: number;
    k: number | number[] | ShapeColorValue[];
}
export interface ShapeColorValue {
    e: Vector4;
    i: Vector4;
    s: Vector4;
}
export interface Shape {
    _length: number;
    _processed?: boolean;
    _render?: boolean;
    a?: VectorProperty<Vector1 | Vector2 | Vector3>;
    bm?: number;
    c?: ShapeColor;
    cix?: number;
    cl?: string;
    closed?: boolean;
    d?: number | StrokeData[];
    e?: VectorProperty<Vector2>;
    eo?: VectorProperty;
    g?: GradientColor;
    h?: GenericAnimatedProperty;
    hd?: boolean;
    ind?: number;
    inv?: boolean;
    it?: Shape[];
    ix?: number;
    ks?: ShapeDataProperty;
    lc?: 1 | 2 | 3;
    lj?: 1 | 2 | 3;
    ln?: string;
    m?: 1 | 2;
    ml?: number;
    mn?: string;
    mode?: string;
    nm?: string;
    np?: number;
    o?: {
        a: 0 | 1;
        k: number;
        ix?: number;
        x?: number;
    };
    or?: {
        k: any[];
    };
    p?: VectorProperty<Vector2>;
    pt?: VectorProperty<ShapePath | ShapePath[]>;
    r?: VectorProperty<{
        e: number;
        s: number;
        t: number;
    }[]>;
    rx?: VectorProperty;
    ry?: VectorProperty;
    rz?: VectorProperty;
    s?: VectorProperty<Vector2 | Vector3>;
    sa?: VectorProperty;
    sk?: VectorProperty;
    so?: VectorProperty;
    t?: number;
    tr?: Shape;
    ty: ShapeType;
    w?: VectorProperty;
    x?: {
        a: 0 | 1;
        k: number;
        ix?: number;
    };
}
export interface StoredData {
    elem: SVGPathElement;
    expan: SVGFEMorphologyElement | null;
    filterId?: string;
    lastOperator: string;
    lastPath: string;
    lastRadius: number;
    x: ValueProperty | null;
}
export interface ViewData {
    elem: SVGPathElement;
    invRect?: SVGRectElement | null;
    lastPath: string;
    op: ValueProperty;
    prop: ReturnType<typeof getShapeProp>;
}
export interface LottieAsset {
    __used?: boolean;
    e?: BoolInt;
    h?: number;
    id?: string;
    layers: LottieLayer[] & {
        __used?: boolean;
    };
    nm?: string;
    p?: string;
    pr?: string;
    sid?: string;
    t?: string;
    u?: string;
    w?: number;
    xt?: number;
}
export interface AnimationSettings {
    autoplay?: Autoplay;
    direction?: AnimationDirection;
    loop?: Loop;
    mode?: PlayMode;
    speed?: number;
}
interface Animation extends AnimationSettings {
    id: string;
}
export type ValueOf<T> = T[keyof T];
export interface AnimationConfig extends Animation {
    url: string;
}
export interface LottieManifest {
    animations: Animation[];
    author?: string;
    description?: string;
    generator?: string;
    keywords?: string;
    version?: string;
}
type Autoplay = boolean | '' | 'autoplay' | null;
type Loop = boolean | '' | 'loop' | null | number;
type Vector1 = number;
export type Vector2 = [number, number];
export type Vector3 = [number, number, number];
export type Vector4 = [number, number, number, number];
export type VectorProperty<T = Vector1> = {
    a: 1 | 0;
    k: T;
    v?: number;
    ix?: number;
    sid?: number;
    _mdf?: boolean;
};
export interface Coordinates {
    c?: boolean;
    x: number | number[];
    y: number | number[];
}
export interface MaskData {
    c?: boolean;
    e?: Coordinates[];
    i: Coordinates;
    o: Coordinates;
    s: Coordinates[];
    t: number;
}
export interface Mask {
    cl?: string;
    d?: number;
    inv: boolean;
    mode: string;
    nm: string;
    o: {
        a: 0 | 1;
        k: number;
        ix?: number;
        x?: number;
    };
    pt: {
        a: 0 | 1;
        k: MaskData | MaskData[];
        ix?: number;
    };
    x: {
        a: 0 | 1;
        k: number;
        ix?: number;
    };
}
interface LayerStyle {
    a?: {
        a: 0 | 1;
        k: number;
    };
    bm?: {
        a: 0 | 1;
        k: number;
    };
    c: {
        a: 0 | 1;
        k: Vector3 | Vector4;
    };
    ch?: {
        a: 0 | 1;
        k: number;
    };
    d?: {
        a: 0 | 1;
        k: number;
    };
    mn: string;
    nm: string;
    no?: {
        a: 0 | 1;
        k: number;
    };
    o?: {
        a: 0 | 1;
        k: number;
    };
    s: {
        a: 0 | 1;
        k: number;
    };
    ty: number;
}
export interface DocumentData extends FontList {
    __complete?: boolean;
    ascent?: number;
    boxWidth?: Vector2 | number;
    f: string;
    fc?: Vector3 | string;
    fillColorAnim?: boolean;
    finalLineHeight?: number;
    finalSize?: number;
    finalText: string[];
    j?: number;
    justifyOffset?: number;
    k: {
        s: LetterProps | DocumentData;
        t: number;
    }[];
    l?: Letter[];
    lh: number;
    lineWidths: number[];
    ls?: number;
    of?: string;
    ps?: Vector2 | null;
    s: number;
    sc?: Vector3;
    sid?: unknown;
    strokeColorAnim?: boolean;
    strokeWidthAnim?: boolean;
    sw?: number;
    sz: Vector2[];
    t: string | number;
    tr: number;
    yOffset?: number;
}
export interface TextRangeValue {
    a: {
        a: 0 | 1;
        k: number;
    };
    b: number;
    e: {
        a: 0 | 1;
        k: number;
    };
    ne: {
        a: 0 | 1;
        k: number;
    };
    o: {
        a: 0 | 1;
        k: number;
    };
    r: number;
    rn: 0 | 1;
    s: {
        a: 0 | 1;
        k: number;
    };
    sh: number;
    sm: {
        a: 0 | 1;
        k: number;
    };
    t: 0 | 1;
    totalChars: number;
    xe: {
        a: 0 | 1;
        k: number;
    };
}
export interface ShapeDataInterface {
    _isAnimated: boolean;
    caches: string[];
    container: ElementInterfaceIntersect;
    elements: ElementInterfaceIntersect[];
    lStr: string;
    lvl: number;
    setAsAnimated: () => void;
    sh: {
        propType: string;
        k: boolean;
        kf: boolean;
        _mdf: boolean;
        comp: ElementInterfaceIntersect;
        paths: ShapeElement;
    };
    styles: SVGStyleData[];
    transform: Transformer;
    transformers: Transformer[];
}
export interface TextData {
    __complete: boolean;
    a?: TextAnimatorDataProperty[];
    ascent: number;
    boxWidth: Vector2;
    d?: DocumentData;
    f: string;
    fc: string;
    fillColorAnim: boolean;
    finalLineHeight: number;
    finalSize: number;
    finalText: string[];
    fStyle: string;
    fWeight: string;
    justifyOffset: number;
    l: Letter[];
    lh: number;
    lineWidths: number[];
    ls: number;
    m?: {
        g: number;
        a: {
            a: 0 | 1;
            k: Vector2;
            ix?: number;
        };
    };
    of: string;
    p?: TextPathData;
    ps: null | Vector2;
    s: number;
    sc: string;
    strokeColorAnim: boolean;
    strokeWidthAnim: boolean;
    sw: number;
    t: string;
    tr: number;
    yOffset: number;
}
interface TextPathData {
    a: any;
    f: any;
    l: any;
    m?: number;
    p: any;
    r: any;
}
export type EffectElement = typeof SliderEffect | typeof AngleEffect | typeof ColorEffect | typeof PointEffect | typeof CheckboxEffect | typeof NoValueEffect | typeof LayerIndexEffect | typeof MaskIndexEffect | typeof SVGTintFilter | typeof SVGFillFilter | typeof SVGStrokeEffect | typeof SVGTritoneFilter | typeof SVGProLevelsFilter | typeof SVGDropShadowEffect | typeof SVGMatte3Effect | typeof SVGGaussianBlurEffect | typeof SVGTransformEffect;
export interface EffectValue {
    ty: number;
    v: {
        a: 1 | 0;
        k: number | Vector3 | Vector4;
    };
}
export interface Effect {
    ef: EffectValue[];
    en: 1 | 0;
    fs?: FilterSizeConfig;
    ix?: number;
    nm?: string;
    np: number;
    ty: number;
}
export interface FontList {
    cache?: Record<string, unknown>;
    fClass: string;
    fFamily: string;
    fName: string;
    fOrigin: string;
    fPath: string;
    fStyle: string;
    fWeight: string;
    helper?: {
        measureText: (str: string, fontName?: string, size?: number) => number;
    };
    loaded?: boolean;
    monoCase?: {
        node: HTMLElement;
        parent: HTMLElement;
        w: number;
    };
    origin: number;
    sansCase?: {
        node: HTMLElement;
        parent: HTMLElement;
        w: number;
    };
}
export interface Characacter {
    ch?: Characacter;
    data: LottieLayer;
    fFamily?: string;
    shapes: Shape[];
    size: number;
    style?: string;
    t: number;
    w: number;
}
export interface AnimationData {
    __complete?: boolean;
    $schema?: string;
    ao?: boolean | 0 | 1;
    assets: LottieAsset[];
    chars: Characacter[];
    ddd: 0 | 1;
    fonts: {
        list: DocumentData[];
    };
    fr: number;
    h: number;
    ip: number;
    layers: LottieLayer[];
    markers?: MarkerData[];
    meta?: {
        a: string;
        d: string;
        k: string;
        tc: string;
        g: string;
    };
    mn?: string;
    nm: string;
    op: number;
    segments: {
        time: number;
    }[];
    slots?: {
        [key: string]: {
            p: any;
        };
    };
    v: string;
    w: number;
}
export interface LottieLayer {
    __used?: boolean;
    _render?: boolean;
    ao?: 0 | 1 | boolean;
    au?: {
        lv?: {
            k: number[];
        };
    };
    bm?: number;
    chars?: Characacter[];
    cl?: string;
    completed?: boolean;
    ct?: 0 | 1;
    ddd?: 0 | 1;
    ef?: Readonly<Effect[]>;
    fonts?: {
        list: DocumentData[];
    };
    fr?: number;
    h?: number;
    hasMask?: boolean;
    hd?: boolean;
    height?: number;
    id?: string;
    ind?: number;
    ip: number;
    ks: Shape;
    layers?: LottieLayer[] & {
        __used?: boolean;
    };
    ln?: string;
    masksProperties?: Shape[];
    nm: string;
    op: number;
    parent?: number;
    refId?: string;
    sc?: string;
    sh?: number;
    shapes: Shape[];
    singleShape?: boolean;
    slots?: {
        [key: string]: {
            p: any;
        };
    };
    sr?: number;
    st: number;
    sw?: number;
    sy?: LayerStyle[];
    t?: TextData;
    td?: 0 | 1;
    textData?: {
        height: number;
        width: number;
    };
    tm?: AnimatedProperty;
    tp?: number;
    tt?: number;
    ty: number;
    w?: number;
    width?: number;
    xt?: number;
}
export interface AnimatedProperty<T = number> {
    _placeholder?: boolean;
    a: 0 | 1;
    ix?: number;
    v?: T;
}
interface GenericAnimatedProperty extends AnimatedProperty {
    k: number | number[];
}
export interface Marker {
    cm: string;
    dr: number;
    tm: number;
}
export interface MarkerData {
    duration: number;
    payload?: Record<string, unknown>;
    time: number;
}
export interface DataFunctionManager {
    checkChars?: (animationData: AnimationData) => void;
    checkColors?: (animationData: AnimationData) => void;
    checkPathProperties?: (animationData: AnimationData) => void;
    checkShapes?: (animationData: AnimationData) => void;
    completeData?: (animationData: AnimationData) => void;
    completeLayers?: (layers: LottieLayer[], comps: LottieComp[]) => void;
}
export interface WorkerEvent {
    data: {
        id: string;
        type: string;
        path: string;
        fullPath: string;
        animation: AnimationData;
    };
}
export type Merge<A, B> = Partial<A | B> & {
    [K in keyof (A | B)]: (A & B)[K];
} & (Partial<Omit<A & B, keyof (A | B)>> extends infer O ? {
    [K in keyof O]: O[K];
} : never);
export interface ExpressionsPlugin {
    initExpressions(animItem: AnimationItem): void;
    resetFrame(): void;
}
export interface Audio {
    pause(): void;
    play(): void;
    playing(): boolean;
    rate(val: number): void;
    resume(): void;
    seek(val?: number): number;
    setRate(val: number): void;
    volume(val: number): void;
}
export type AudioFactory = (path?: string) => Audio;
type LottieComp = LottieLayer | LottieAsset;
export interface ImageData {
    assetData: LottieAsset;
    img: null | SVGElement | HTMLCanvasElement | HTMLMediaElement;
}
export interface Keyframe {
    e: Vector2;
    h?: number;
    i: Coordinates;
    keyframeMetadata: any;
    n: string;
    o: Coordinates;
    s: any;
    t: number;
    ti: Vector2;
    to: Vector2;
}
export interface Caching {
    _lastAddedLength: number;
    _lastKeyframeIndex: number;
    _lastPoint: number;
    lastFrame: number;
    lastIndex: number;
    value: any;
}
export interface GlobalData {
    _mdf?: boolean;
    audioController?: AudioController;
    compSize?: {
        w: number;
        h: number;
    };
    defs: SVGDefsElement;
    fontManager?: FontManager;
    frameId: number;
    frameNum?: number;
    frameRate: number;
    getAssetData: AnimationItem['getAssetData'];
    getAssetsPath: AnimationItem['getAssetsPath'];
    imageLoader?: any;
    nm?: string;
    progressiveLoad?: boolean;
    projectInterface?: any;
    renderConfig?: SVGRendererConfig | CanvasRendererConfig | HTMLRendererConfig;
    slotManager?: SlotManager;
}
export interface SourceRect {
    height: number;
    left: number;
    top: number;
    width: number;
}
export interface IntersectData {
    bez: PolynomialBezier;
    cx: number;
    cy: number;
    height: number;
    t: number;
    t1: number;
    t2: number;
    width: number;
}
export {};
