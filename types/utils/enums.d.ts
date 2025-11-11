export declare enum ArrayType {
    Float32 = "float32",
    Int16 = "int16",
    Int32 = "int32",
    Uint8 = "uint8",
    Uint8c = "uint8c"
}
export declare enum Modifier {
    MouseModifier = "ms",
    OffsetPathModifier = "op",
    PuckerAndBloatModifier = "pb",
    RepeaterModifier = "rp",
    RoundCornersModifier = "rd",
    TrimModifier = "tm",
    ZigZagModifier = "zz"
}
export declare enum PlayMode {
    Bounce = "bounce",
    Normal = "normal"
}
export declare enum PlayerEvents {
    Complete = "complete",
    Destroyed = "destroyed",
    Error = "error",
    Frame = "frame",
    Freeze = "freeze",
    Load = "load",
    Loop = "loop",
    Next = "next",
    Pause = "pause",
    Play = "play",
    Previous = "previous",
    Ready = "ready",
    Rendered = "rendered",
    Stop = "stop"
}
export declare enum PreserveAspectRatio {
    Contain = "xMidYMid meet",
    Cover = "xMidYMid slice",
    Initial = "none",
    None = "xMinYMin slice"
}
export declare enum RendererType {
    Canvas = "canvas",
    HTML = "html",
    SVG = "svg"
}
export declare enum ShapeType {
    Ellipse = "el",
    Fill = "fl",
    GradientFill = "gf",
    GradientStroke = "gs",
    Group = "gr",
    Merge = "mm",
    NoStyle = "no",
    OffsetPath = "op",
    Path = "sh",
    PolygonStar = "sr",
    PuckerBloat = "pb",
    Rectangle = "rc",
    Repeater = "rp",
    RoundedCorners = "rd",
    Stroke = "st",
    Transform = "tr",
    Trim = "tm",
    Twist = "tw",
    Unknown = "ms",
    ZigZag = "zz"
}
export declare enum EffectTypes {
    TransformEffect = "transformEffect"
}
export declare enum PropType {
    MultiDimensional = "multidimensiional",
    Shape = "shape",
    TextSelector = "textSelector",
    Transform = "transform",
    UniDimensional = "unidimensional"
}
interface LineCapEnum {
    [key: number]: CanvasLineCap;
}
interface LineJoinEnum {
    [key: number]: CanvasLineJoin;
}
export declare const lineCapEnum: LineCapEnum, lineJoinEnum: LineJoinEnum;
export {};
