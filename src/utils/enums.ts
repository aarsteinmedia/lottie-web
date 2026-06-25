export enum ArrayType {
  Float32 = 'float32',
  Int16 = 'int16',
  Int32 = 'int32',
  Uint8 = 'uint8',
  Uint8c = 'uint8c',
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

export enum PreserveAspectRatio {
  Contain = 'xMidYMid meet',
  Cover = 'xMidYMid slice',
  Initial = 'none',
  None = 'xMinYMin slice',
}

export enum RendererType {
  Canvas = 'canvas',
  HTML = 'html',
  SVG = 'svg',
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

export enum EffectTypes {
  TransformEffect = 'transformEffect'
}

export enum PropType {
  MultiDimensional = 'multidimensiional',
  Shape = 'shape',
  TextSelector = 'textSelector',
  Transform = 'transform',
  UniDimensional = 'unidimensional'
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
