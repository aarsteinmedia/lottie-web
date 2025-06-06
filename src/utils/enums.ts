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

export enum PlayerEvents {
  Complete = 'complete',
  Destroyed = 'destroyed',
  Error = 'error',
  Frame = 'frame',
  Freeze = 'freeze',
  Load = 'load',
  Loop = 'loop',
  Next = 'next',
  Pause = 'pause',
  Play = 'play',
  Previous = 'previous',
  Ready = 'ready',
  Rendered = 'rendered',
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

export const lineCapEnum: { [key: number]: CanvasLineCap } = {
    1: 'butt',
    2: 'round',
    3: 'square',
  },
  lineJoinEnum: { [key: number]: CanvasLineJoin } = {
    1: 'miter',
    2: 'round',
    3: 'bevel',
  }
