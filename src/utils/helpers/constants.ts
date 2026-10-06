const degToRads = Math.PI / 180,
  initialDefaultFrame = -999999,
  roundCorner = 0.5519,
  namespaceXLink = 'http://www.w3.org/1999/xlink',
  namespaceSVG = 'http://www.w3.org/2000/svg',
  namespaceXML = 'http://www.w3.org/XML/1998/namespace',
  _isServer = () => !(typeof window !== 'undefined' && document),
  isServer = _isServer(),
  _inBrowser = () => typeof navigator !== 'undefined',
  inBrowser = _inBrowser(),
  _isSafari = () => inBrowser && /^(?:(?!chrome|android).)*safari/i.test(navigator.userAgent),
  isSafari = _isSafari(),
  isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'development'

export {
  degToRads,
  inBrowser,
  initialDefaultFrame,
  isDev,
  isSafari,
  isServer,
  namespaceSVG,
  namespaceXLink,
  namespaceXML,
  roundCorner
}