export const DEG_TO_RAD = Math.PI / 180,
  INITIAL_DEFAULT_FRAME = -999999,
  ROUND_CORNER = 0.5519,
  NAMESPACE_X_LINK = 'http://www.w3.org/1999/xlink',
  NAMESPACE_SVG = 'http://www.w3.org/2000/svg',
  IS_SERVER = !(typeof window !== 'undefined' && document),
  IN_BROWSER = typeof navigator !== 'undefined',
  IS_DEV = typeof process !== 'undefined' && process.env.NODE_ENV === 'development'

/** @deprecated use DEG_TO_RAD instead */
export const degToRads = DEG_TO_RAD

/** @deprecated use IN_BROWSER instead */
export const inBrowser = IN_BROWSER

/** @deprecated use IS_SERVER instead */
export const isServer = IS_SERVER

/** @deprecated use NAMESPACE_SVG instead */
export const namespaceSVG = NAMESPACE_SVG
