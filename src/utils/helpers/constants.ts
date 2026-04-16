const degToRads = Math.PI / 180;
const initialDefaultFrame = -999999;
const roundCorner = 0.5519;
const namespaceXlink = 'http://www.w3.org/1999/xlink';
const namespaceSVG = 'http://www.w3.org/2000/svg';
const namespaceXML = 'http://www.w3.org/XML/1998/namespace';
const _isServer = () => !(typeof window !== 'undefined' && document);
const isServer = _isServer();
const _inBrowser = () => typeof navigator !== 'undefined';
const inBrowser = _inBrowser();
const _isSafari = (): boolean => {
  const isTrue = inBrowser
    ? /^(?:(?!chrome|android).)*safari/i.test(navigator.userAgent)
    : false;

  return isTrue;
};
const isSafari = _isSafari();

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
};