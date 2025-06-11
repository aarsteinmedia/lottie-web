import {
  inBrowser, isSafari, isServer
} from '@/utils'

export const degToRads = Math.PI / 180,
  initialDefaultFrame = -999999,
  roundCorner = 0.5519,
  namespaceXlink = 'http://www.w3.org/1999/xlink',
  namespaceSVG = 'http://www.w3.org/2000/svg',
  namespaceXML = 'http://www.w3.org/XML/1998/namespace',
  _isServer = isServer(),
  _inBrowser = inBrowser(),
  _isSafari = isSafari()