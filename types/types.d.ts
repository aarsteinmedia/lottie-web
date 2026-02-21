import type { AnimationItem } from './animation/AnimationItem';
import type { AngleEffect, CheckboxEffect, ColorEffect, LayerIndexEffect, MaskIndexEffect, NoValueEffect, PointEffect, SliderEffect } from './effects';
import type { CVTransformEffect } from './effects/canvas/CVTransformEffect';
import type { SVGDropShadowEffect } from './effects/svg/SVGDropShadowEffect';
import type { SVGFillFilter } from './effects/svg/SVGFillFilter';
import type { SVGGaussianBlurEffect } from './effects/svg/SVGGaussianBlurEffect';
import type { SVGMatte3Effect } from './effects/svg/SVGMatte3Effect';
import type { SVGProLevelsFilter } from './effects/svg/SVGProLevelsFilter';
import type { SVGStrokeEffect } from './effects/svg/SVGStrokeEffect';
import type { SVGTintFilter } from './effects/svg/SVGTintFilter';
import type { SVGTransformEffect } from './effects/svg/SVGTransformEffect';
import type { SVGTritoneFilter } from './effects/svg/SVGTritoneFilter';
import type { AudioElement } from './elements/AudioElement';
import type { CVCompElement } from './elements/canvas/CVCompElement';
import type { CVEffects } from './elements/canvas/CVEffects';
import type { CVMaskElement } from './elements/canvas/CVMaskElement';
import type { CVShapeElement } from './elements/canvas/CVShapeElement';
import type { CVTextElement } from './elements/canvas/CVTextElement';
import type { CVShapeData } from './elements/helpers/shapes/CVShapeData';
import type { CreateRenderFunction } from './elements/helpers/shapes/SVGElementsRenderer';
import type { SVGFillStyleData } from './elements/helpers/shapes/SVGFillStyleData';
import type { SVGGradientFillStyleData } from './elements/helpers/shapes/SVGGradientFillStyleData';
import type { SVGGradientStrokeStyleData } from './elements/helpers/shapes/SVGGradientStrokeStyleData';
import type { SVGNoStyleData } from './elements/helpers/shapes/SVGNoStyleData';
import type { SVGShapeData } from './elements/helpers/shapes/SVGShapeData';
import type { SVGStrokeStyleData } from './elements/helpers/shapes/SVGStrokeStyleData';
import type { SVGStyleData } from './elements/helpers/shapes/SVGStyleData';
import type { SVGTransformData } from './elements/helpers/shapes/SVGTransformData';
import type { HCompElement } from './elements/html/HCompElement';
import type { ImageElement } from './elements/ImageElement';
import type { MaskElement } from './elements/MaskElement';
import type { ShapeElement } from './elements/ShapeElement';
import type { SVGCompElement } from './elements/svg/SVGCompElement';
import type { SVGEffects } from './elements/svg/SVGEffects';
import type { SVGShapeElement } from './elements/svg/SVGShapeElement';
import type { SVGTextLottieElement } from './elements/svg/SVGTextElement';
import type { BaseRenderer } from './renderers/BaseRenderer';
import type { CanvasRenderer } from './renderers/CanvasRenderer';
import type { HybridRenderer } from './renderers/HybridRenderer';
import type { SVGRenderer } from './renderers/SVGRenderer';
import type { AudioController } from './utils/audio/AudioController';
import type { BezierData } from './utils/Bezier';
import type { PlayMode, ShapeType, RendererType, PreserveAspectRatio } from './utils/enums';
import type { CompExpressionInterface } from './utils/expressions/CompInterface';
import type { FootageInterface } from './utils/expressions/FootageInterface';
import type { LayerExpressionInterface } from './utils/expressions/LayerInterface';
import type { ProjectInterface } from './utils/expressions/ProjectInterface';
import type { ShapeExpressionInterface } from './utils/expressions/shapes/ShapeInterface';
import type { TextExpressionInterface } from './utils/expressions/TextInterface';
import type { FontManager } from './utils/FontManager';
import type { DynamicPropertyContainer } from './utils/helpers/DynamicPropertyContainer';
import type { ImagePreloader } from './utils/ImagePreloader';
import type { Matrix } from './utils/Matrix';
import type { PolynomialBezier } from './utils/PolynomialBezier';
import type { BaseProperty } from './utils/properties/BaseProperty';
import type { MultiDimensionalProperty } from './utils/properties/MultiDimensionalProperty';
import type { TransformProperty } from './utils/properties/TransformProperty';
import type { ValueProperty } from './utils/properties/ValueProperty';
import type { DashProperty } from './utils/shapes/properties/DashProperty';
import type { EllShapeProperty } from './utils/shapes/properties/EllShapeProperty';
import type { GradientProperty } from './utils/shapes/properties/GradientProperty';
import type { RectShapeProperty } from './utils/shapes/properties/RectShapeProperty';
import type { KeyframedShapeProperty, ShapeProperty } from './utils/shapes/properties/ShapeProperty';
import type { StarShapeProperty } from './utils/shapes/properties/StarShapeProperty';
import type { ShapePath } from './utils/shapes/ShapePath';
import type { SlotManager } from './utils/SlotManager';
import type { LetterProps } from './utils/text/LetterProps';
import type { TextAnimatorDataProperty } from './utils/text/TextAnimatorDataProperty';
import type { TextProperty } from './utils/text/TextProperty';
export type AnimationDirection = 1 | -1;
export type AnimationEventName = 'drawnFrame' | 'enterFrame' | 'loopComplete' | 'complete' | 'segmentStart' | 'destroy' | 'config_ready' | 'data_ready' | 'DOMLoaded' | 'error' | 'data_failed' | 'loaded_images' | '_play' | '_pause' | '_idle' | '_active' | 'configError' | 'renderFrameError';
export interface SVGGeometry {
    cx: number;
    cy: number;
    height: number;
    width: number;
}
export interface Constructor {
    name: string;
    prototype: any;
}
export interface TextSpan {
    children: SVGSVGElement[];
    childSpan?: null | SVGTextElement | SVGGElement;
    elem?: number[][];
    glyph: null | SVGCompElement | SVGShapeElement;
    span: null | SVGTextElement | SVGGElement;
    style?: CSSStyleDeclaration;
}
export type SVGElementInterface = SVGShapeData | SVGTransformData | SVGFillStyleData | SVGStrokeStyleData | SVGNoStyleData | SVGGradientFillStyleData | SVGGradientStrokeStyleData;
export interface Transformer {
    _localMatMdf: boolean;
    _matMdf: boolean;
    _mdf?: boolean;
    _opMdf: boolean;
    container: SVGGElement;
    key?: string;
    localMat: Matrix;
    localOpacity: number;
    mat: Matrix;
    matrix?: Matrix;
    mProp: TransformProperty;
    mProps: TransformProperty;
    op: ValueProperty;
    opacity: number;
}
type RendererIntersect = SVGRenderer & CanvasRenderer & HybridRenderer;
export type ElementInterfaceIntersect = CompElementInterface & RenderableComponentIntersect & RendererIntersect & AnimationItem;
type RenderableComponentIntersect = ImageElement & AudioElement & SVGShapeElement & SVGMaskElement & SVGEffects & SVGTextLottieElement & CVMaskElement & CVEffects & CVTextElement;
export type RenderableComponent = ImageElement | AudioElement | MaskElement | SVGShapeElement | SVGEffects | SVGTextLottieElement | CVMaskElement | CVEffects | CVTextElement;
export interface TransformCanvas {
    h: number;
    props?: Float32Array;
    sx: number;
    sy: number;
    tx: number;
    ty: number;
    w: number;
}
export type PoolElement = ShapePath | number[] | BezierLength | SegmentLength;
export interface BezierLength {
    addedLength: number;
    lengths: number[];
    percents: number[];
}
export interface SegmentLength {
    lengths: BezierLength[];
    totalLength: number;
}
export type CVElementIntersect = CVTextElement | CVShapeElement | CVCompElement;
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
export type GetInterface = (type: keyof ExpressionInterfaces) => ExpressionInterface;
export type ExpressionInterface = ExpressionInterfaces[keyof ExpressionInterfaces];
export interface ExpressionInterfaces {
    comp: typeof CompExpressionInterface;
    effects: unknown;
    footage: typeof FootageInterface;
    layer: typeof LayerExpressionInterface;
    shape: typeof ShapeExpressionInterface;
    text: typeof TextExpressionInterface;
}
export interface ThreeDElement {
    container: HTMLElement;
    perspectiveElem: HTMLElement;
    type: string;
}
export interface AnimatedContent {
    data: Shape;
    element: ShapeDataInterface | SVGElementInterface;
    fn: null | CreateRenderFunction;
}
export type CompElementInterface = BaseRenderer | CVCompElement | HCompElement | SVGCompElement;
export interface CVStyleElement {
    closed: boolean;
    co?: string;
    coOp?: number;
    da?: Float32Array;
    data: Shape;
    do?: number;
    elements: CVShapeData[];
    grd?: string;
    lc?: CanvasLineCap;
    lj?: CanvasLineJoin;
    ml?: number;
    preTransforms: TransformSequence;
    r?: 'evenodd' | 'nonzero';
    transforms: Transformer[];
    type: ShapeType;
    wi?: number;
}
export interface CVElement {
    a?: ValueProperty;
    c?: MultiDimensionalProperty<number[]>;
    d?: DashProperty;
    e?: MultiDimensionalProperty;
    g?: GradientProperty;
    h?: ValueProperty;
    it: CVElement[];
    o?: ValueProperty;
    prevViewData: CVElement[];
    s?: MultiDimensionalProperty;
    style?: CVStyleElement;
    w?: ValueProperty;
}
export interface ThreeDElements {
    container: HTMLElement;
    endPos: number;
    perspectiveElem: HTMLDivElement;
    startPos: number;
    type: string;
}
export interface EFXElement {
    p: BaseProperty;
}
export interface KeyframesMetadata {
    __fnct?: (val: number) => number | number[];
    bezierData?: BezierData;
}
interface BaseRendererConfig {
    className?: string;
    imagePreserveAspectRatio?: string;
}
export interface FilterSizeConfig {
    height: string;
    width: string;
    x: string;
    y: string;
}
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
    xOffset: number;
    yOffset: number;
}
export type SVGRendererConfig = BaseRendererConfig & {
    title?: undefined | string;
    description?: undefined | string;
    preserveAspectRatio?: undefined | string;
    progressiveLoad?: undefined | boolean;
    hideOnTransparent?: undefined | boolean;
    viewBoxOnly?: undefined | boolean;
    viewBoxSize?: undefined | string | false;
    focusable?: undefined | boolean;
    filterSize?: undefined | FilterSizeConfig;
    contentVisibility?: undefined | string;
    runExpressions?: undefined | boolean;
    width?: undefined | number;
    height?: undefined | number;
    id?: undefined | string;
};
export type CanvasRendererConfig = BaseRendererConfig & {
    clearCanvas?: boolean;
    context?: null | CanvasRenderingContext2D;
    contentVisibility: string;
    id: string;
    imagePreserveAspectRatio: PreserveAspectRatio;
    preserveAspectRatio: PreserveAspectRatio;
    progressiveLoad?: boolean;
    runExpressions?: boolean;
    dpr?: number;
};
export type HTMLRendererConfig = BaseRendererConfig & {
    hideOnTransparent?: boolean;
    filterSize?: {
        width: string;
        height: string;
        y: string;
        x: string;
    };
    runExpressions?: boolean;
};
export interface AnimationConfiguration<T extends RendererType = RendererType.Canvas | RendererType.HTML | RendererType.SVG> {
    animationData?: AnimationData | undefined;
    animType?: RendererType;
    assetsPath?: string;
    audioFactory?: AudioFactory;
    autoloadSegments?: boolean;
    autoplay?: boolean;
    container?: HTMLElement;
    initialSegment?: Vector2;
    loop?: HTMLBooleanAttribute;
    name?: string;
    path?: string;
    prerender?: boolean;
    renderer?: T;
    rendererSettings?: {
        svg: SVGRendererConfig;
        canvas: CanvasRendererConfig;
        html: HTMLRendererConfig;
    }[T];
    wrapper?: HTMLElement;
}
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
export type DynamicProperty = ({
    hd?: boolean;
} & VectorProperty<number | number[] | Keyframe[]>);
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
    p: BaseProperty;
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
    _shouldRender?: boolean | undefined;
    a?: VectorProperty<Vector1 | Vector2 | Vector3>;
    bm?: number;
    c?: ShapeColor;
    cix?: number;
    cl?: string;
    closed?: boolean;
    d?: number | StrokeData[];
    dc?: number;
    e?: VectorProperty<Vector2>;
    eo?: VectorProperty;
    g?: GradientColor;
    h?: VectorProperty;
    hd?: boolean;
    ind?: number;
    inv?: boolean;
    ir?: {
        ix?: number;
    };
    is?: {
        ix?: number;
    };
    it?: Shape[];
    ix?: number;
    ks?: ShapeDataProperty;
    lc?: 1 | 2 | 3;
    lj?: 1 | 2 | 3;
    ln?: string;
    m?: 1 | 2;
    maxDist?: number;
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
        k: Keyframe[];
        ix?: number;
    };
    os?: {
        ix?: number;
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
    sy?: number;
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
    filterId?: undefined | string;
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
    prop: ShapeProperty | KeyframedShapeProperty | RectShapeProperty | EllShapeProperty | StarShapeProperty | null;
}
export interface LottieAsset {
    __used?: boolean;
    e?: BoolInt;
    h?: number;
    id?: string;
    layers?: LottieLayer[] & {
        __used?: boolean;
    };
    nm?: string;
    p?: undefined | string;
    pr?: string;
    sid?: string;
    t?: string;
    u?: string;
    w?: number;
    xt?: number;
}
export type HTMLBooleanAttribute = boolean | string | number | null;
export interface AnimationSettings {
    autoplay?: HTMLBooleanAttribute;
    direction?: AnimationDirection;
    loop?: HTMLBooleanAttribute;
    mode?: PlayMode;
    speed?: number;
}
export interface LottieAnimation extends AnimationSettings {
    id: string;
}
export type ValueOf<T> = T[keyof T];
export interface AnimationConfig extends LottieAnimation {
    url: string;
}
export interface LottieManifest {
    animations: LottieAnimation[];
    author?: string;
    description?: string;
    generator?: string;
    keywords?: string;
    version?: string;
}
type Vector1 = number;
export type Vector2 = [number, number];
export type Vector3 = [number, number, number];
export type Vector4 = [number, number, number, number];
export interface VectorProperty<T = Vector1> {
    _mdf?: boolean;
    a: 1 | 0;
    ix?: number;
    k: T;
    s?: number;
    sid?: number;
    v?: T;
    z?: number;
}
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
export interface TransformSequence {
    _mdf?: undefined | boolean;
    [key: string]: unknown;
    finalTransform?: Matrix;
    transforms?: {
        transform: Transformer;
    }[];
}
export type BMMath = Omit<Math, 'abs'> & {
    abs: (val: number | number[]) => number | number[];
    seedrandom: (val: number) => number;
};
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
    l: Letter[];
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
    sz?: Vector2;
    t: string | number;
    tr: number;
    x?: string;
    yOffset?: number;
}
export interface TransformNode {
    p?: number[];
    pts?: number[];
    t: string;
}
export interface BezierPoint {
    partialLength: number;
    point: number[];
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
    hd?: boolean;
    ne?: {
        a: 0 | 1;
        k: number;
    };
    o?: {
        a: 0 | 1;
        k: number;
    };
    r: number;
    rn: 0 | 1;
    s?: {
        a: 0 | 1;
        k: number;
    };
    sh: number;
    sm?: {
        a: 0 | 1;
        k: number;
    };
    t: 0 | 1;
    totalChars: number;
    xe?: {
        a: 0 | 1;
        k: number;
    };
}
export interface ShapeDataInterface {
    _isAnimated: boolean;
    caches: string[];
    container: ElementInterfaceIntersect;
    elements: ElementInterfaceIntersect[];
    it: ShapeDataInterface[];
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
        v: {
            v: number[][];
            o: number[][];
            i: number[][];
            c?: number[][];
            _length: number;
        };
    };
    style?: CSSStyleDeclaration;
    styles: SVGStyleData[];
    transform: Transformer;
    transformers: Transformer[];
    w?: ValueProperty;
}
export interface TextData {
    __complete: boolean;
    _mdf?: boolean;
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
    hd?: boolean;
    justifyOffset: number;
    l: Letter[];
    lh: number;
    lineWidths: number[];
    ls: number;
    m?: {
        _mdf?: boolean;
        g: number;
        a: {
            a: 0 | 1;
            k: Vector2;
            ix?: number;
        };
        v: any;
    };
    n?: any;
    of: string;
    p?: TextVectorData;
    ps: null | Vector2;
    r?: {
        v: number[];
    };
    s: number;
    sc: string;
    strokeColorAnim: boolean;
    strokeWidthAnim: boolean;
    sw: number;
    t: string;
    tr: number;
    yOffset: number;
}
export interface PathInfo {
    segments: BezierData[];
    tLength: 0;
}
export interface TextVectorData {
    _mdf?: boolean;
    a?: VectorProperty;
    f?: VectorProperty;
    l: VectorProperty;
    m: number;
    n?: VectorProperty;
    p?: VectorProperty;
    r?: VectorProperty;
    v?: VectorProperty;
}
export interface TextPathData {
    _mdf?: boolean | undefined;
    a?: ValueProperty | undefined;
    f?: ValueProperty | undefined;
    l: ValueProperty | undefined;
    m?: null | ShapeProperty | KeyframedShapeProperty | RectShapeProperty | EllShapeProperty | StarShapeProperty | undefined;
    n?: ValueProperty | undefined;
    p?: ValueProperty | undefined;
    pi?: PathInfo | undefined;
    r?: ValueProperty | undefined;
    v?: ValueProperty | undefined;
}
export type EffectElement = typeof SliderEffect | typeof AngleEffect | typeof ColorEffect | typeof PointEffect | typeof CheckboxEffect | typeof NoValueEffect | typeof LayerIndexEffect | typeof MaskIndexEffect | typeof SVGTintFilter | typeof SVGFillFilter | typeof SVGStrokeEffect | typeof SVGTritoneFilter | typeof SVGProLevelsFilter | typeof SVGDropShadowEffect | typeof SVGMatte3Effect | typeof SVGGaussianBlurEffect | typeof SVGTransformEffect | typeof CVTransformEffect;
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
    mn?: string;
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
    helper?: undefined | {
        measureText: (str: string, fontName?: string, size?: number) => number;
    };
    loaded?: boolean;
    monoCase?: undefined | {
        node: HTMLElement;
        parent: HTMLElement;
        w: number;
    };
    origin: number;
    sansCase?: undefined | {
        node: HTMLElement;
        parent: HTMLElement;
        w: number;
    };
}
export interface Characacter {
    ch?: Characacter;
    data?: LottieLayer;
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
    chars: Characacter[] | null;
    ddd: 0 | 1;
    fonts?: {
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
    segments?: {
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
    ef?: Effect[];
    en?: number;
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
    mn?: string;
    nm: string;
    np?: string;
    op: number;
    parent?: number;
    pe?: VectorProperty;
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
    tg?: string;
    tm?: VectorProperty;
    tp?: undefined | number;
    tt?: number;
    ty: number;
    w?: number;
    width?: number;
    xt?: number;
}
export interface Marker {
    cm: string;
    dr: number;
    tm: number;
}
export interface BoundingBox {
    h: number;
    height: number;
    w: number;
    width: number;
    x: number;
    xMax: number;
    y: number;
    yMax: number;
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
export interface Audio {
    pause: () => void;
    play: () => void;
    playing: () => boolean;
    rate: (val: number) => void;
    resume: () => void;
    seek: (val?: number) => number;
    setRate: (val: number) => void;
    volume: (val: number) => void;
}
export type AudioFactory = (path?: string) => Audio;
type LottieComp = LottieLayer | LottieAsset;
export interface ImageData {
    assetData: LottieAsset;
    img: null | SVGElement | HTMLCanvasElement | HTMLMediaElement;
}
export interface CanvasItem {
    c: MultiDimensionalProperty<Vector3>;
    d?: {
        dashoffset: string;
        _mdf?: boolean;
    };
    it?: CanvasItem;
    o: ValueProperty;
    prevViewData?: CanvasItem;
    style: {
        closed?: boolean;
        co: string;
        coOp: number;
        data: LottieLayer;
        elements: Transformer[];
        lc: string;
        lj: string;
        ml: number;
        preTransforms: any;
        transforms: any[];
        type: string;
        wi: number;
    };
    w?: {
        _mdf?: boolean;
        v: number;
    };
}
export interface Keyframe {
    e: Vector3;
    h?: number;
    i: Coordinates;
    keyframeMetadata?: {
        length: number;
        name: string;
    };
    n: string;
    o: Coordinates;
    s: ShapePath[] | Vector3 | null;
    t: number;
    ti: Vector2 | null;
    to?: Vector2 | null;
}
export type EffectFunction = (...args: any[]) => any;
export type TextEffectFunction = (data: DocumentData, value: string) => DocumentData;
export interface Caching {
    _lastAddedLength: number;
    _lastKeyframeIndex: number;
    _lastPoint: number;
    lastFrame: number;
    lastIndex: number;
    lastTime: number;
    shapeValue: ShapePath | null;
    value: number | number[];
}
export interface GlobalData {
    _mdf?: undefined | boolean;
    audioController?: AudioController;
    blendMode?: string;
    canvasContext?: undefined | null | CanvasRenderingContext2D;
    comp?: CompElementInterface;
    compSize?: {
        w: number;
        h: number;
    };
    currentGlobalAlpha: number;
    defs: SVGDefsElement;
    fontManager?: FontManager;
    frameId: number;
    frameNum?: undefined | number;
    frameRate: number;
    getAssetData: AnimationItem['getAssetData'];
    getAssetsPath: AnimationItem['getAssetsPath'];
    imageLoader?: ImagePreloader | null;
    isDashed?: boolean;
    mouseX?: number;
    mouseY?: number;
    nm?: string;
    popExpression: () => void;
    progressiveLoad?: undefined | boolean;
    projectInterface: ProjectInterface;
    pushExpression: () => void;
    registerExpressionProperty: (expression: ExpressionProperty) => void;
    renderConfig?: SVGRendererConfig | CanvasRendererConfig | HTMLRendererConfig;
    renderer?: CanvasRenderer | SVGRenderer;
    slotManager?: SlotManager;
    transformCanvas?: TransformCanvas;
}
export type ExpressionProperty = VectorProperty<Keyframe[]> & {
    release?: () => void;
    x: string;
};
export type ExpressionReturn = ((val?: unknown) => unknown) | BaseProperty;
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
export interface ConvertParams {
    animations?: AnimationData[];
    currentAnimation?: number;
    fileName?: string;
    generator?: string;
    isDotLottie?: boolean;
    manifest?: LottieManifest;
    shouldDownload?: boolean;
    src?: string;
    typeCheck?: boolean;
}
interface AnimationAttributes extends AnimationSettings {
    id: string;
    url: string;
}
export interface AddAnimationParams {
    configs: AnimationAttributes[];
    fileName?: string;
    generator: string;
    id?: string;
    shouldDownload?: boolean;
    src?: string;
}
export interface Result {
    error?: string;
    result?: null | string | ArrayBuffer;
    success: boolean;
}
export interface Cartesian3D {
    x: number;
    y: number;
    z: number;
}
declare global {
    interface Document {
        _isProxy?: boolean;
    }
}
export {};
