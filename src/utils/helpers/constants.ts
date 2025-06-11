const degToRads = Math.PI / 180,
  initialDefaultFrame = -999999,
  roundCorner = 0.5519,
  namespaceXlink = 'http://www.w3.org/1999/xlink',
  namespaceSVG = 'http://www.w3.org/2000/svg',
  namespaceXML = 'http://www.w3.org/XML/1998/namespace',
  _isServer = () => !(typeof window !== 'undefined' && document),
  isServer = _isServer(),
  _inBrowser = () => typeof navigator !== 'undefined',
  inBrowser = _inBrowser(),
  _isSafari = (): boolean => {
    const isTrue = inBrowser
      ? /^(?:(?!chrome|android).)*safari/i.test(navigator.userAgent)
      : false

    return isTrue
  },
  isSafari = _isSafari()

export {
  degToRads,
  inBrowser,
  initialDefaultFrame,
  isSafari,
  isServer,
  namespaceSVG,
  namespaceXlink,
  namespaceXML,
  roundCorner
}