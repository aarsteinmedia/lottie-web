export enum ArrayType {
  Float32 = 'float32',
  Int16 = 'int16',
  Int32 = 'int32',
  Uint8 = 'uint8',
  Uint8c = 'uint8c',
}

export enum BlendMode {
  Normal = 0,
  Multiply = 1,
  Screen = 2,
  Overlay = 3,
  Darken = 4,
  Lighten = 5,
  ColorDodge = 6,
  ColorBurn = 7,
  HardLight = 8,
  SoftLight = 9,
  Difference = 10,
  Exclusion = 11,
  Hue = 12,
  Saturation = 13,
  Color = 14,
  Luminosity = 15,
  Add = 16,
  HardMix = 17,
}

export enum BlurDirection {
  Both = 1,
  Horizontal = 2,
  Vertical = 3
}

export enum EffectType {
  Custom = 5,
  Tint = 20,
  Fill = 21,
  Stroke = 22,
  Tritone = 23,
  ProLevels = 24,
  DropShadow = 25,
  RadialWipe = 26,
  DisplacementMap = 27,
  SetMatte = 28,
  Blur = 29,
  Twirl = 30,
  MeshWarp = 31,
  Wavy = 32,
  Sphere = 33,
  Puppet = 34
}

export enum EffectTypes { TransformEffect = 'transformEffect' }

export enum FillAttribute {
  NonZero = 1,
  EvenOdd = 2,
}

export enum FillRule {
  EvenOdd = 'evenodd',
  NonZero = 'nonzero',
}

export enum GradientType {
  Linear = 1,
  Radial = 2
}

export enum GradientTypeName {
  Linear = 'linearGradient',
  Radial = 'radialGradient'
}

export enum GradientUnit {
  ObjectBoundingBox = 1,
  UserSpaceOnUse = 2
}

export enum GradientUnitName {
  ObjectBoundingBox = 'objectBoundingBox',
  UserSpaceOnUse = 'userSpaceOnUse'
}

export enum LayerType {
  PreComposition = 0,
  SolidColor = 1,
  Image = 2,
  Null = 3,
  Shape = 4,
  Text = 5,
  Audio = 6,
  VideoPlaceholder = 7,
  ImageSequence = 8,
  Video = 9,
  ImagePlaceholder = 10,
  Guide = 11,
  Adjustment = 12,
  Camera = 13,
  Light = 14,
  Data = 15,
  None = 99
}

interface LineCapEnum { [key: number]: CanvasLineCap }
interface LineJoinEnum { [key: number]: CanvasLineJoin }

export const lineCapEnum: LineCapEnum = {
    1: 'butt',
    2: 'round',
    3: 'square',
  },
  lineJoinEnum: LineJoinEnum = {
    1: 'miter',
    2: 'round',
    3: 'bevel',
  }

export enum MaskMode {
  Add = 'a',
  Darken = 'd',
  Intersect = 'i',
  Lighten = 'l',
  Luminance = 'f',
  None = 'n',
  Subtract = 's',
}

export enum MatteMode {
  Add = 1,
  Subtract = 2,
  Luminance = 3
}

export enum MatteModeName {
  Add = 'add',
  Alpha = 'alpha',
  Luminance = 'luminance',
  Subtract = 'subtract',
}

export enum Modifier {
  MouseModifier = 'ms',
  OffsetPathModifier = 'op',
  PuckerAndBloatModifier = 'pb',
  RepeaterModifier = 'rp',
  RoundCornersModifier = 'rd',
  TrimModifier = 'tm',
  ZigZagModifier = 'zz',
}

export enum PatternType {
  NotInUse = 0,
  Shape = 1,
  Image = 2
}

export enum PlayMode {
  Bounce = 'bounce',
  Normal = 'normal',
}

export enum PlayerEvent {
  Active = '_active',
  Complete = 'complete',
  ConfigError = 'configError',
  ConfigReady = 'config_ready',
  DataFailed = 'data_failed',
  DataReady = 'data_ready',
  Destroy = 'destroy',
  Destroyed = 'destroyed',
  DOMLoaded = 'DOMLoaded',
  DrawnFrame = 'drawnFrame',
  EnterFrame = 'enterFrame',
  Error = 'error',
  Frame = 'frame',
  Freeze = 'freeze',
  Idle = '_idle',
  Load = 'load',
  LoadedImages = 'loaded_images',
  Loop = 'loop',
  LoopComplete = 'loopComplete',
  MouseEnter = 'mouseenter',
  MouseLeave = 'mouseleave',
  Next = 'next',
  Pause = '_pause',
  Play = '_play',
  Previous = 'previous',
  Ready = 'ready',
  Rendered = 'rendered',
  RenderFrameError = 'renderFrameError',
  SegmentStart = 'segmentStart',
  Stop = 'stop',
}

export enum PropType {
  MultiDimensional = 'multidimensiional',
  Shape = 'shape',
  TextSelector = 'textSelector',
  Transform = 'transform',
  UniDimensional = 'unidimensional'
}

export enum PreserveAspectRatio {
  Contain = 'xMidYMid meet',
  Cover = 'xMidYMid slice',
  Initial = 'none',
  None = 'xMinYMin slice',
}

export enum RendererType {
  Canvas = 'canvas',
  SVG = 'svg',
}

export enum ShapeDirection {
  Normal = 1,
  Reversed = 3
}

export enum ShapePropertyType {
  Path = 3,
  Rectangle = 5,
  Ellipse = 6,
  Star = 7,
}

export enum ShapeType {
  Ellipse = 'el',
  Fill = 'fl',
  GradientFill = 'gf',
  GradientStroke = 'gs',
  Group = 'gr',
  Merge = 'mm',
  NoStyle = 'no',
  OffsetPath = 'op',
  Path = 'sh',
  PolygonStar = 'sr',
  PuckerBloat = 'pb',
  Rectangle = 'rc',
  Repeater = 'rp',
  RoundedCorners = 'rd',
  Stroke = 'st',
  Transform = 'tr',
  Trim = 'tm',
  Twist = 'tw',
  Unknown = 'ms',
  ZigZag = 'zz',
}

export enum SpreadMethod {
  Pad = 'pad',
  // eslint-disable-next-line no-restricted-syntax/noReflect
  Reflect = 'reflect',
  Repeat = 'repeat'
}

export enum StackingOrder {
  Above = 1,
  Below = 2
}

export enum StrokeAttributeName {
  Dash = 'd',
  Gap = 'g',
  Offset = 'o'
}

export enum StrokeAttribute {
  Dash = 'dash',
  Gap = 'gap',
  Offset = 'offset',
}

export enum StrokeLinecap {
  Butt = 1,
  Round = 2,
  Square = 3,
}

export enum StrokeLinejoin {
  Miter = 1,
  Round = 2,
  Bevel = 3
}