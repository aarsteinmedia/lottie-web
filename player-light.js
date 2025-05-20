import { isServer, createElementID, PreserveAspectRatio, PlayerEvents, RendererType } from '@aarsteinmedia/lottie-web/utils';
export { PlayerEvents } from '@aarsteinmedia/lottie-web/utils';
import Lottie from '@aarsteinmedia/lottie-web/light';
import { strFromU8, unzip as unzip$1 } from 'fflate';

/**
 * Credit to: Leonardo Favre https://github.com/leofavre/observed-properties.
 */ const updateOnConnected = Symbol('UPDATE_ON_CONNECTED');
if (isServer()) {
  // Mock HTMLElement for server-side rendering
  global.HTMLElement = // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class EmptyHTMLElement {
    };
}
/**
 * HTMLElement enhanced to track property changes.
 */ class PropertyCallbackElement extends HTMLElement {
  constructor() {
    super();
    if (updateOnConnected in this) {
      this[updateOnConnected] = [];
    }
    const { observedProperties = [] } = this.constructor;
    const { length } = observedProperties;
    for (let i = 0; i < length; i++) {
      const initialValue = this[observedProperties[i]], cachedValue = Symbol(observedProperties[i]);
      this[cachedValue] = initialValue;
      Object.defineProperty(this, observedProperties[i], {
        get() {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return this[cachedValue];
        },
        set(value) {
          const oldValue = this[cachedValue];
          this[cachedValue] = value;
          this.propertyChangedCallback(observedProperties[i], oldValue, value);
        }
      });
      if (typeof initialValue !== 'undefined' && updateOnConnected in this && Array.isArray(this[updateOnConnected])) {
        this[updateOnConnected].push(observedProperties[i]);
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async connectedCallback() {
    let arr = [];
    if (updateOnConnected in this && Array.isArray(this[updateOnConnected])) {
      arr = this[updateOnConnected];
    }
    const { length } = arr;
    for (let i = 0; i < length; i++) {
      if (!('propertyChangedCallback' in this) || typeof this.propertyChangedCallback !== 'function') {
        continue;
      }
      if (arr[i] in this) {
        this.propertyChangedCallback(arr[i], undefined, this[arr[i]]);
      }
    }
  }
  propertyChangedCallback(_name, _oldValue, _value) {
    throw new Error(`${this.constructor.name}: Method propertyChangedCallback is not implemented`);
  }
}

var ObjectFit = /*#__PURE__*/ function (ObjectFit) {
  ObjectFit["Contain"] = "contain";
  ObjectFit["Cover"] = "cover";
  ObjectFit["Fill"] = "fill";
  ObjectFit["None"] = "none";
  ObjectFit["ScaleDown"] = "scale-down";
  return ObjectFit;
}({});
var PlayerState = /*#__PURE__*/ function (PlayerState) {
  PlayerState["Completed"] = "completed";
  PlayerState["Destroyed"] = "destroyed";
  PlayerState["Error"] = "error";
  PlayerState["Frozen"] = "frozen";
  PlayerState["Loading"] = "loading";
  PlayerState["Paused"] = "paused";
  PlayerState["Playing"] = "playing";
  PlayerState["Stopped"] = "stopped";
  return PlayerState;
}({});
var PlayMode = /*#__PURE__*/ function (PlayMode) {
  PlayMode["Bounce"] = "bounce";
  PlayMode["Normal"] = "normal";
  return PlayMode;
}({});

var css_248z = "* {\n  box-sizing: border-box;\n}\n\n:host {\n  --lottie-player-toolbar-height: 35px;\n  --lottie-player-toolbar-background-color: #fff;\n  --lottie-player-toolbar-icon-color: #000;\n  --lottie-player-toolbar-icon-hover-color: #000;\n  --lottie-player-toolbar-icon-active-color: #4285f4;\n  --lottie-player-seeker-track-color: rgb(0 0 0 / 20%);\n  --lottie-player-seeker-thumb-color: #4285f4;\n  --lottie-player-seeker-display: block;\n\n  width: 100%;\n  height: 100%;\n\n  &:not([hidden]) {\n    display: block;\n  }\n\n  .main {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n    width: 100%;\n    margin: 0;\n    padding: 0;\n  }\n\n  .animation {\n    width: 100%;\n    height: 100%;\n    display: flex;\n    margin: 0;\n    padding: 0;\n  }\n\n  [data-controls='true'] .animation {\n    height: calc(100% - 35px);\n  }\n\n  .animation-container {\n    position: relative;\n  }\n\n  .popover {\n    position: absolute;\n    right: 5px;\n    bottom: 40px;\n    background-color: var(--lottie-player-toolbar-background-color);\n    border-radius: 5px;\n    padding: 10px 15px;\n    border: solid 2px var(--lottie-player-toolbar-icon-color);\n    animation: fade-in 0.2s ease-in-out;\n\n    &::before {\n      content: '';\n      right: 10px;\n      border: 7px solid transparent;\n      margin-right: -7px;\n      height: 0;\n      width: 0;\n      position: absolute;\n      pointer-events: none;\n      top: 100%;\n      border-top-color: var(--lottie-player-toolbar-icon-color);\n    }\n  }\n\n  .error {\n    display: flex;\n    margin: auto;\n    justify-content: center;\n    height: 100%;\n    align-items: center;\n\n    & svg {\n      width: 100%;\n      height: auto;\n    }\n  }\n\n  .toolbar {\n    display: flex;\n    place-items: center center;\n    background: var(--lottie-player-toolbar-background-color);\n    margin: 0;\n    height: 35px;\n    padding: 5px;\n    border-radius: 5px;\n    gap: 5px;\n\n    &.has-error {\n      pointer-events: none;\n      opacity: 0.5;\n    }\n\n    & button {\n      cursor: pointer;\n      fill: var(--lottie-player-toolbar-icon-color);\n      color: var(--lottie-player-toolbar-icon-color);\n      background: none;\n      border: 0;\n      padding: 0;\n      outline: 0;\n      height: 100%;\n      margin: 0;\n      align-items: center;\n      gap: 5px;\n      opacity: 0.9;\n\n      &:not([hidden]) {\n        display: flex;\n      }\n\n      &:hover {\n        opacity: 1;\n      }\n\n      &[data-active='true'] {\n        opacity: 1;\n        fill: var(--lottie-player-toolbar-icon-active-color);\n      }\n\n      &:disabled {\n        opacity: 0.5;\n      }\n\n      &:focus {\n        outline: 0;\n      }\n\n      & svg {\n        pointer-events: none;\n\n        & > * {\n          fill: inherit;\n        }\n      }\n\n      &.disabled svg {\n        display: none;\n      }\n    }\n  }\n\n  .progress-container {\n    position: relative;\n    width: 100%;\n\n    &.simple {\n      margin-right: 12px;\n    }\n  }\n\n  .seeker {\n    appearance: none;\n    outline: none;\n    width: 100%;\n    height: 20px;\n    border-radius: 3px;\n    border: 0;\n    cursor: pointer;\n    background-color: transparent;\n\n    display: var(--lottie-player-seeker-display);\n    color: var(--lottie-player-seeker-thumb-color);\n    margin: 0;\n    padding: 7.5px 0;\n    position: relative;\n    z-index: 1;\n\n    &::-webkit-slider-runnable-track,\n    &::-webkit-slider-thumb {\n      appearance: none;\n      outline: none;\n    }\n\n    &::-webkit-slider-thumb {\n      height: 15px;\n      width: 15px;\n      border-radius: 50%;\n      border: 0;\n      background-color: var(--lottie-player-seeker-thumb-color);\n      cursor: pointer;\n      -webkit-transition: transform 0.2s ease-in-out;\n      transition: transform 0.2s ease-in-out;\n      transform: scale(0);\n    }\n\n    &:hover::-webkit-slider-thumb,\n    &:focus::-webkit-slider-thumb {\n      transform: scale(1);\n    }\n\n    &::-moz-range-progress {\n      background-color: var(--lottie-player-seeker-thumb-color);\n      height: 5px;\n      border-radius: 3px;\n    }\n\n    &::-moz-range-thumb {\n      height: 15px;\n      width: 15px;\n      border-radius: 50%;\n      background-color: var(--lottie-player-seeker-thumb-color);\n      border: 0;\n      cursor: pointer;\n      -moz-transition: transform 0.2s ease-in-out;\n      transition: transform 0.2s ease-in-out;\n      transform: scale(0);\n    }\n\n    &:hover::-moz-range-thumb,\n    &:focus::-moz-range-thumb {\n      transform: scale(1);\n    }\n\n    &::-ms-track {\n      width: 100%;\n      height: 5px;\n      cursor: pointer;\n      background: transparent;\n      border-color: transparent;\n      color: transparent;\n    }\n\n    &::-ms-fill-upper {\n      background: var(--lottie-player-seeker-track-color);\n      border-radius: 3px;\n    }\n\n    &::-ms-fill-lower {\n      background-color: var(--lottie-player-seeker-thumb-color);\n      border-radius: 3px;\n    }\n\n    &::-ms-thumb {\n      border: 0;\n      height: 15px;\n      width: 15px;\n      border-radius: 50%;\n      background: var(--lottie-player-seeker-thumb-color);\n      cursor: pointer;\n      -ms-transition: transform 0.2s ease-in-out;\n      transition: transform 0.2s ease-in-out;\n      transform: scale(0);\n    }\n\n    &:hover::-ms-thumb {\n      transform: scale(1);\n    }\n\n    &:focus {\n      &::-ms-thumb {\n        transform: scale(1);\n      }\n\n      &::-ms-fill-lower,\n      &::-ms-fill-upper {\n        background: var(--lottie-player-seeker-track-color);\n      }\n    }\n  }\n\n  & progress {\n    appearance: none;\n    outline: none;\n    position: absolute;\n    width: 100%;\n    height: 5px;\n    border-radius: 3px;\n    border: 0;\n    top: 0;\n    left: 0;\n    margin: 7.5px 0;\n    background-color: var(--lottie-player-seeker-track-color);\n    pointer-events: none;\n\n    &::-webkit-progress-inner-element {\n      border-radius: 3px;\n      overflow: hidden;\n    }\n\n    &::-webkit-slider-runnable-track {\n      background-color: transparent;\n    }\n\n    &::-webkit-progress-value {\n      background-color: var(--lottie-player-seeker-thumb-color);\n    }\n  }\n\n  & *::-moz-progress-bar {\n    background-color: var(--lottie-player-seeker-thumb-color);\n  }\n}\n\n@keyframes fade-in {\n  0% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@media (prefers-color-scheme: dark) {\n  :host {\n    --lottie-player-toolbar-background-color: #000;\n    --lottie-player-toolbar-icon-color: #fff;\n    --lottie-player-toolbar-icon-hover-color: #fff;\n    --lottie-player-seeker-track-color: rgb(255 255 255 / 60%);\n  }\n}\n";

/**
 * Render Controls.
 */ function renderControls() {
  if (!this.shadow) {
    return;
  }
  const slot = this.shadow.querySelector('slot[name=controls]');
  if (!slot) {
    return;
  }
  if (!this.controls) {
    slot.innerHTML = '';
    return;
  }
  slot.innerHTML = /* HTML */ `<div class="lottie-controls toolbar ${this.playerState === PlayerState.Error ? 'has-error' : ''}" aria-label="Lottie Animation controls"><button class="togglePlay" data-active="false" tabindex="0" aria-label="Toggle Play/Pause"><svg width="24" height="24" aria-hidden="true" focusable="false"><path d="M8.016 5.016L18.985 12 8.016 18.984V5.015z"/></svg></button> <button class="stop" data-active="true" tabindex="0" aria-label="Stop"><svg width="24" height="24" aria-hidden="true" focusable="false"><path d="M6 6h12v12H6V6z"/></svg></button> <button class="prev" tabindex="0" aria-label="Previous animation" hidden><svg width="24" height="24" aria-hidden="true" focusable="false"><path d="M17.9 18.2 8.1 12l9.8-6.2v12.4zm-10.3 0H6.1V5.8h1.5v12.4z"/></svg></button> <button class="next" tabindex="0" aria-label="Next animation" hidden><svg width="24" height="24" aria-hidden="true" focusable="false"><path d="m6.1 5.8 9.8 6.2-9.8 6.2V5.8zM16.4 5.8h1.5v12.4h-1.5z"/></svg></button><form class="progress-container${this.simple ? ' simple' : ''}"><input class="seeker" type="range" min="0" max="100" step="1" value="${this._seeker.toString()}" aria-valuemin="0" aria-valuemax="100" role="slider" aria-valuenow="${this._seeker.toString()}" tabindex="0" aria-label="Slider for search"><progress max="100" value="${this._seeker}"></progress></form>${this.simple ? '' : /* HTML */ `<button class="toggleLoop" data-active="${this.loop}" tabindex="0" aria-label="Toggle loop"><svg width="24" height="24" aria-hidden="true" focusable="false"><path d="M17.016 17.016v-4.031h1.969v6h-12v3l-3.984-3.984 3.984-3.984v3h10.031zM6.984 6.984v4.031H5.015v-6h12v-3l3.984 3.984-3.984 3.984v-3H6.984z"/></svg></button> <button class="toggleBoomerang" data-active="${this.mode === PlayMode.Bounce}" aria-label="Toggle boomerang" tabindex="0"><svg width="24" height="24" aria-hidden="true" focusable="false"><path d="m11.8 13.2-.3.3c-.5.5-1.1 1.1-1.7 1.5-.5.4-1 .6-1.5.8-.5.2-1.1.3-1.6.3s-1-.1-1.5-.3c-.6-.2-1-.5-1.4-1-.5-.6-.8-1.2-.9-1.9-.2-.9-.1-1.8.3-2.6.3-.7.8-1.2 1.3-1.6.3-.2.6-.4 1-.5.2-.2.5-.2.8-.3.3 0 .7-.1 1 0 .3 0 .6.1.9.2.9.3 1.7.9 2.4 1.5.4.4.8.7 1.1 1.1l.1.1.4-.4c.6-.6 1.2-1.2 1.9-1.6.5-.3 1-.6 1.5-.7.4-.1.7-.2 1-.2h.9c1 .1 1.9.5 2.6 1.4.4.5.7 1.1.8 1.8.2.9.1 1.7-.2 2.5-.4.9-1 1.5-1.8 2-.4.2-.7.4-1.1.4-.4.1-.8.1-1.2.1-.5 0-.9-.1-1.3-.3-.8-.3-1.5-.9-2.1-1.5-.4-.4-.8-.7-1.1-1.1h-.3zm-1.1-1.1c-.1-.1-.1-.1 0 0-.3-.3-.6-.6-.8-.9-.5-.5-1-.9-1.6-1.2-.4-.3-.8-.4-1.3-.4-.4 0-.8 0-1.1.2-.5.2-.9.6-1.1 1-.2.3-.3.7-.3 1.1 0 .3 0 .6.1.9.1.5.4.9.8 1.2.5.4 1.1.5 1.7.5.5 0 1-.2 1.5-.5.6-.4 1.1-.8 1.6-1.3.1-.3.3-.5.5-.6zM13 12c.5.5 1 1 1.5 1.4.5.5 1.1.9 1.9 1 .4.1.8 0 1.2-.1.3-.1.6-.3.9-.5.4-.4.7-.9.8-1.4.1-.5 0-.9-.1-1.4-.3-.8-.8-1.2-1.7-1.4-.4-.1-.8-.1-1.2 0-.5.1-1 .4-1.4.7-.5.4-1 .8-1.4 1.2-.2.2-.4.3-.5.5z"/></svg></button> <button class="toggleSettings" aria-label="Settings" aria-haspopup="true" aria-expanded="${Boolean(this._isSettingsOpen)}" aria-controls="${this._identifier}-settings"><svg width="24" height="24" aria-hidden="true" focusable="false"><circle cx="12" cy="5.4" r="2.5"/><circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="18.6" r="2.5"/></svg></button><div id="${this._identifier}-settings" class="popover" hidden><button class="snapshot" aria-label="Download still image" tabindex="0"><svg width="24" height="24" aria-hidden="true" focusable="false"><path d="M16.8 10.8 12 15.6l-4.8-4.8h3V3.6h3.6v7.2h3zM12 15.6H3v4.8h18v-4.8h-9zm7.8 2.4h-2.4v-1.2h2.4V18z"/></svg> Download still image</button></div>`}</div>`;
  const togglePlay = this.shadow.querySelector('.togglePlay');
  if (togglePlay instanceof HTMLButtonElement) {
    togglePlay.onclick = this.togglePlay;
  }
  const stop = this.shadow.querySelector('.stop');
  if (stop instanceof HTMLButtonElement) {
    stop.onclick = this.stop;
  }
  const prev = this.shadow.querySelector('.prev');
  if (prev instanceof HTMLButtonElement) {
    prev.onclick = this.prev;
  }
  const next = this.shadow.querySelector('.next');
  if (next instanceof HTMLButtonElement) {
    next.onclick = this.next;
  }
  const seeker = this.shadow.querySelector('.seeker');
  if (seeker instanceof HTMLInputElement) {
    seeker.onchange = this._handleSeekChange;
    seeker.onmousedown = this._freeze;
  }
  if (!this.simple) {
    const toggleLoop = this.shadow.querySelector('.toggleLoop');
    if (toggleLoop instanceof HTMLButtonElement) {
      toggleLoop.onclick = this.toggleLoop;
    }
    const toggleBoomerang = this.shadow.querySelector('.toggleBoomerang');
    if (toggleBoomerang instanceof HTMLButtonElement) {
      toggleBoomerang.onclick = this.toggleBoomerang;
    }
    const snapshot = this.shadow.querySelector('.snapshot');
    if (snapshot instanceof HTMLButtonElement) {
      snapshot.onclick = () => this.snapshot(true);
    }
    const toggleSettings = this.shadow.querySelector('.toggleSettings');
    if (toggleSettings instanceof HTMLButtonElement) {
      toggleSettings.onclick = this._handleSettingsClick;
      toggleSettings.onblur = this._handleBlur;
    }
  }
}

/**
 * Render Player.
 */ function renderPlayer() {
  if (!this.shadow) {
    return;
  }
  const ariaLabel = this.description ? `aria-label="${this.description}` : '';
  this.template.innerHTML = /* HTML */ `<div class="animation-container main" data-controls="${this.controls ?? false}" lang="${this.description ? document.documentElement.lang : 'en'}" ${ariaLabel} data-loaded="${this._playerState.loaded}"><figure class="animation" style="background:${this.background}">${this.playerState === PlayerState.Error ? /* HTML */ `<div class="error"><svg preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="1920" height="1080" viewBox="0 0 1920 1080"><path fill="#fff" d="M0 0h1920v1080H0z"/><path fill="#3a6d8b" d="M1190.2 531 1007 212.4c-22-38.2-77.2-38-98.8.5L729.5 531.3c-21.3 37.9 6.1 84.6 49.5 84.6l361.9.3c43.7 0 71.1-47.3 49.3-85.2zM937.3 288.7c.2-7.5 3.3-23.9 23.2-23.9 16.3 0 23 16.1 23 23.5 0 55.3-10.7 197.2-12.2 214.5-.1 1-.9 1.7-1.9 1.7h-18.3c-1 0-1.8-.7-1.9-1.7-1.4-17.5-13.4-162.9-11.9-214.1zm24.2 283.8c-13.1 0-23.7-10.6-23.7-23.7s10.6-23.7 23.7-23.7 23.7 10.6 23.7 23.7-10.6 23.7-23.7 23.7zM722.1 644h112.6v34.4h-70.4V698h58.8v31.7h-58.8v22.6h72.4v36.2H722.1V644zm162 57.1h.6c8.3-12.9 18.2-17.8 31.3-17.8 3 0 5.1.4 6.3 1v32.6h-.8c-22.4-3.8-35.6 6.3-35.6 29.5v42.3h-38.2V685.5h36.4v15.6zm78.9 0h.6c8.3-12.9 18.2-17.8 31.3-17.8 3 0 5.1.4 6.3 1v32.6h-.8c-22.4-3.8-35.6 6.3-35.6 29.5v42.3h-38.2V685.5H963v15.6zm39.5 36.2c0-31.3 22.2-54.8 56.6-54.8 34.4 0 56.2 23.5 56.2 54.8s-21.8 54.6-56.2 54.6c-34.4-.1-56.6-23.3-56.6-54.6zm74 0c0-17.4-6.1-29.1-17.8-29.1-11.7 0-17.4 11.7-17.4 29.1 0 17.4 5.7 29.1 17.4 29.1s17.8-11.8 17.8-29.1zm83.1-36.2h.6c8.3-12.9 18.2-17.8 31.3-17.8 3 0 5.1.4 6.3 1v32.6h-.8c-22.4-3.8-35.6 6.3-35.6 29.5v42.3h-38.2V685.5h36.4v15.6z"/><path fill="none" d="M718.9 807.7h645v285.4h-645z"/><text fill="#3a6d8b" style="text-align:center;position:absolute;left:100%;font-size:47px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'.SFNSText-Regular',sans-serif" x="50%" y="848.017" text-anchor="middle">${this._errorMessage}</text></svg></div>` : ''}</figure><slot name="controls"></slot></div>`;
  this.shadow.adoptedStyleSheets = [
    DotLottiePlayer.styles
  ];
  this.shadow.appendChild(this.template.content.cloneNode(true));
}

const hasExt = (path) => {
  const lastDotIndex = path.split('/').pop()?.lastIndexOf('.');
  return (lastDotIndex ?? 0) > 1 && path.length - 1 > (lastDotIndex ?? 0);
};
/**
 * Get extension from filename, URL or path.
 *
 * @param str - Filename, URL or path.
 */ const getExt = (str) => {
  if (typeof str !== 'string' || !str || !hasExt(str)) {
    return;
  }
  return str.split('.').pop()?.toLowerCase();
};
const getMimeFromExt = (ext = '') => {
  switch (ext) {
    case 'svg':
    case 'svg+xml':
      {
        return 'image/svg+xml';
      }
    case 'jpg':
    case 'jpeg':
      {
        return 'image/jpeg';
      }
    case 'png':
    case 'gif':
    case 'webp':
    case 'avif':
      {
        return `image/${ext}`;
      }
    case 'mp3':
    case 'mpeg':
    case 'wav':
      {
        return `audio/${ext}`;
      }
    default:
      {
        return '';
      }
  }
}, isAudio = (asset) => !('h' in asset) && !('w' in asset) && 'p' in asset && 'e' in asset && 'u' in asset && 'id' in asset, parseBase64 = (str) => str.slice(Math.max(0, str.indexOf(',') + 1)), isBase64 = (str) => {
  if (!str) {
    return false;
  }
  const regex = /^(?:[0-9a-z+/]{4})*(?:[0-9a-z+/]{2}==|[0-9a-z+/]{3}=)?$/i;
  return regex.test(parseBase64(str));
}, isImage = (asset) => 'w' in asset && 'h' in asset && !('xt' in asset) && 'p' in asset, resolveAssets = async (unzipped, assets) => {
  if (!Array.isArray(assets)) {
    return;
  }
  const toResolve = [], { length } = assets;
  for (let i = 0; i < length; i++) {
    if (!isAudio(assets[i]) && !isImage(assets[i])) {
      continue;
    }
    const type = isImage(assets[i]) ? 'images' : 'audio', u8 = unzipped[`${type}/${assets[i].p}`];
    if (u8.length === 0) {
      continue;
    }
    toResolve.push(new Promise((resolveAsset) => {
      const assetB64 = isServer() ? Buffer.from(u8).toString('base64') : btoa(// eslint-disable-next-line unicorn/no-array-reduce
        u8.reduce((dat, byte) => `${dat}${String.fromCharCode(byte)}`, ''));
      assets[i].p = assets[i].p?.startsWith('data:') || isBase64(assets[i].p) ? assets[i].p : `data:${getMimeFromExt(getExt(assets[i].p))};base64,${assetB64}`;
      assets[i].e = 1;
      assets[i].u = '';
      resolveAsset();
    }));
  }
  await Promise.all(toResolve);
}, unzip = async (resp) => {
  const buffer = new Uint8Array(await resp.arrayBuffer()), unzipped = await new Promise((resolve, reject) => {
    unzip$1(buffer, (err, file) => {
      if (err) {
        reject(err);
      }
      resolve(file);
    });
  });
  return unzipped;
}, getManifest = (unzipped) => {
  const file = strFromU8(unzipped['manifest.json'], false), manifest = JSON.parse(file);
  if (!('animations' in manifest)) {
    throw new Error('Manifest not found');
  }
  if (manifest.animations.length === 0) {
    throw new Error('No animations listed in manifest');
  }
  return manifest;
}, prepareString = (str) => str.replaceAll(new RegExp(/"""/, 'g'), '""').replaceAll(/(["'])(.*?)\1/g, (_match, quote, content) => {
  const replacedContent = content.replaceAll(/[^\w\s.#]/g, '');
  return `${quote}${replacedContent}${quote}`;
}), getLottieJSON = async (resp) => {
  const unzipped = await unzip(resp), manifest = getManifest(unzipped), data = [], toResolve = [], { length } = manifest.animations;
  for (let i = 0; i < length; i++) {
    const str = strFromU8(unzipped[`animations/${manifest.animations[i].id}.json`]), lottie = JSON.parse(prepareString(str));
    toResolve.push(resolveAssets(unzipped, lottie.assets));
    data.push(lottie);
  }
  await Promise.all(toResolve);
  return {
    data,
    manifest
  };
};
const aspectRatio = (objectFit) => {
  switch (objectFit) {
    case ObjectFit.Contain:
    case ObjectFit.ScaleDown:
      {
        return 'xMidYMid meet';
      }
    case ObjectFit.Cover:
      {
        return 'xMidYMid slice';
      }
    case ObjectFit.Fill:
      {
        return 'none';
      }
    case ObjectFit.None:
      {
        return 'xMinYMin slice';
      }
    default:
      {
        return 'xMidYMid meet';
      }
  }
}, download = (data, options) => {
  const blob = new Blob([
    data
  ], {
    type: options?.mimeType
  }), fileName = options?.name || createElementID(), dataURL = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = dataURL;
  link.download = fileName;
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    link.remove();
    URL.revokeObjectURL(dataURL);
  }, 1000);
}, frameOutput = (frame) => ((frame ?? 0) + 1).toString().padStart(3, '0'), handleErrors = (err) => {
  const res = {
    message: 'Unknown error',
    status: isServer() ? 500 : 400
  };
  if (err && typeof err === 'object') {
    if ('message' in err && typeof err.message === 'string') {
      res.message = err.message;
    }
    if ('status' in err) {
      res.status = Number(err.status);
    }
  }
  return res;
}, getAnimationData = async (input) => {
  try {
    if (!input || typeof input !== 'string' && typeof input !== 'object') {
      throw new Error('Broken file or invalid file format');
    }
    if (typeof input !== 'string') {
      const animations = Array.isArray(input) ? input : [
        input
      ];
      return {
        animations,
        isDotLottie: false,
        manifest: null
      };
    }
    const result = await fetch(input);
    if (!result.ok) {
      throw new Error(result.statusText);
    }
        /**
       * Check if file is JSON, first by parsing file name for extension,
       * then – if filename has no extension – by cloning the response
       * and parsing it for content.
       */ const ext = getExt(input);
    if (ext === 'json' || !ext) {
      if (ext) {
        const lottie = await result.json();
        return {
          animations: [
            lottie
          ],
          isDotLottie: false,
          manifest: null
        };
      }
      const text = await result.clone().text();
      try {
        const lottie = JSON.parse(text);
        return {
          animations: [
            lottie
          ],
          isDotLottie: false,
          manifest: null
        };
      } catch (error) {
        /* empty */
}
    }
    const { data, manifest } = await getLottieJSON(result);
    return {
      animations: data,
      isDotLottie: true,
      manifest
    };
  } catch (error) {
    console.error(`❌ ${handleErrors(error).message}`);
    return {
      animations: null,
      isDotLottie: false,
      manifest: null
    };
  }
}, getFilename = (src, keepExt) => {
  // Because the regex strips all special characters, we need to extract the file extension, so we can add it later if we need it
  `.${getExt(src)}`;
  return `${src.replace(/\.[^.]*$/, '').replaceAll(/\W+/g, '')}${''}`.toLowerCase();
};

/**
 * DotLottie Player Web Component.
 */ class DotLottiePlayer extends PropertyCallbackElement {
    /**
   * Attributes to observe.
   */ static get observedAttributes() {
    return [
      'animateOnScroll',
      'autoplay',
      'controls',
      'direction',
      'hover',
      'loop',
      'mode',
      'speed',
      'src',
      'subframe'
    ];
  }
  static get observedProperties() {
    return [
      'playerState',
      '_isSettingsOpen',
      '_seeker',
      '_currentAnimation',
      '_animations'
    ];
  }
    /**
   * Return the styles for the component.
   */ static get styles() {
    const styleSheet = new CSSStyleSheet();
    void styleSheet.replace(css_248z);
    return styleSheet;
  }
    /**
   * Whether to trigger next frame with scroll.
   */ set animateOnScroll(value) {
    this.setAttribute('animateOnScroll', Boolean(value).toString());
  }
  get animateOnScroll() {
    const val = this.getAttribute('animateOnScroll');
    return Boolean(val === 'true' || val === '' || val === '1');
  }
    /**
   * Autoplay.
   */ set autoplay(value) {
    this.setAttribute('autoplay', Boolean(value).toString());
  }
  get autoplay() {
    const val = this.getAttribute('autoplay');
    return Boolean(val === 'true' || val === '' || val === '1');
  }
    /**
   * Background color.
   */ set background(value) {
    this.setAttribute('background', value);
  }
  get background() {
    return this.getAttribute('background') || 'transparent';
  }
    /**
   * Show controls.
   */ set controls(value) {
    this.setAttribute('controls', Boolean(value).toString());
  }
  get controls() {
    const val = this.getAttribute('controls');
    return Boolean(val === 'true' || val === '' || val === '1');
  }
    /**
   * Number of times to loop.
   */ set count(value) {
    this.setAttribute('count', value.toString());
  }
  get count() {
    const val = this.getAttribute('count');
    if (val) {
      return Number(val);
    }
    return 0;
  }
    /**
   * Description for screen readers.
   */ set description(value) {
    if (value) {
      this.setAttribute('description', value);
    }
  }
  get description() {
    return this.getAttribute('description');
  }
    /**
   * Direction of animation.
   */ set direction(value) {
    this.setAttribute('direction', value.toString());
  }
  get direction() {
    const val = Number(this.getAttribute('direction'));
    if (val === -1) {
      return val;
    }
    return 1;
  }
    /**
   * Whether to play on mouseover.
   */ set hover(value) {
    this.setAttribute('hover', value.toString());
  }
  get hover() {
    const val = this.getAttribute('hover');
    return Boolean(val === 'true' || val === '' || val === '1');
  }
    /**
   * Pause between loop intrations, in miliseconds.
   */ set intermission(value) {
    this.setAttribute('intermission', value.toString());
  }
  get intermission() {
    const val = Number(this.getAttribute('intermission'));
    if (!isNaN(val)) {
      return val;
    }
    return 0;
  }
    /**
   * Loop animation.
   */ set loop(value) {
    this.setAttribute('loop', Boolean(value).toString());
  }
  get loop() {
    const val = this.getAttribute('loop');
    return Boolean(val === 'true' || val === '' || val === '1');
  }
    /**
   * Play mode.
   */ set mode(value) {
    this.setAttribute('mode', value.toString());
  }
  get mode() {
    const val = this.getAttribute('mode');
    if (val === PlayMode.Bounce) {
      return val;
    }
    return PlayMode.Normal;
  }
    /**
   * Resizing to container.
   */ set objectfit(value) {
    this.setAttribute('objectfit', value);
  }
  get objectfit() {
    const val = this.getAttribute('objectfit');
    if (val && Object.values(ObjectFit).includes(val)) {
      return val;
    }
    return ObjectFit.Contain;
  }
    /**
   * Resizing to container (Deprecated).
   */ set preserveAspectRatio(value) {
    this.setAttribute('preserveAspectRatio', value || PreserveAspectRatio.Contain);
  }
  get preserveAspectRatio() {
    const val = this.getAttribute('preserveAspectRatio');
    if (val && Object.values(PreserveAspectRatio).includes(val)) {
      return val;
    }
    return null;
  }
    /**
   * Hide advanced controls.
   */ set simple(value) {
    this.setAttribute('simple', value.toString());
  }
  get simple() {
    const val = this.getAttribute('simple');
    return Boolean(val === 'true' || val === '' || val === '1');
  }
    /**
   * Speed.
   */ set speed(value) {
    this.setAttribute('speed', value.toString());
  }
  get speed() {
    const val = this.getAttribute('speed');
    if (val !== null && !isNaN(Number(val))) {
      return Number(val);
    }
    return 1;
  }
    /**
   * Source, either path or JSON string.
   */ set src(value) {
    this.setAttribute('src', value || '');
  }
  get src() {
    return this.getAttribute('src');
  }
    /**
   * Subframe.
   */ set subframe(value) {
    this.setAttribute('subframe', Boolean(value).toString());
  }
  get subframe() {
    const val = this.getAttribute('subframe');
    return Boolean(val === 'true' || val === '' || val === '1');
  }
  constructor() {
    super(), /**
   * Player state.
   */ this.playerState = PlayerState.Loading, /**
   * Animation Container.
   */ this._container = null, this._errorMessage = 'Something went wrong', this._identifier = this.id || createElementID(), /**
   * Whether settings toolbar is open.
   */ this._isSettingsOpen = false, this._playerState = {
        count: 0,
        loaded: false,
        prev: PlayerState.Loading,
        scrollTimeout: null,
        scrollY: 0,
        visible: false
      }, this._render = renderPlayer, this._renderControls = renderControls, /**
   * Seeker.
   */ this._seeker = 0, /**
   * This is included in watched properties,
   * so that next-button will show up
   * on load, if controls are visible.
   */ this._animations = [], /**
   * Which animation to show, if several.
   */ this._currentAnimation = 0, this._isBounce = false, /**
   * AnimationItem | null = null.
   */ this._lottieInstance = null, /**
   * Multi-animation settings.
   */ this._multiAnimationSettings = [], /**
   * Handle settings click event.
   */ this._handleSettingsClick = ({ target }) => {
        this._toggleSettings();
        // Because Safari does not add focus on click, we need to add it manually, so the onblur event will fire
        if (target instanceof HTMLElement) {
          target.focus();
        }
      };
    this._complete = this._complete.bind(this);
    this._dataFailed = this._dataFailed.bind(this);
    this._dataReady = this._dataReady.bind(this);
    this._DOMLoaded = this._DOMLoaded.bind(this);
    this._enterFrame = this._enterFrame.bind(this);
    this._freeze = this._freeze.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
    this._handleScroll = this._handleScroll.bind(this);
    this._handleSeekChange = this._handleSeekChange.bind(this);
    this._handleWindowBlur = this._handleWindowBlur.bind(this);
    this._loopComplete = this._loopComplete.bind(this);
    this._mouseEnter = this._mouseEnter.bind(this);
    this._mouseLeave = this._mouseLeave.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);
    this._switchInstance = this._switchInstance.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.stop = this.stop.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.snapshot = this.snapshot.bind(this);
    this.toggleLoop = this.toggleLoop.bind(this);
    this.toggleBoomerang = this.toggleBoomerang.bind(this);
    this.destroy = this.destroy.bind(this);
    this.template = document.createElement('template');
    this.shadow = this.attachShadow({
      mode: 'open'
    });
  }
    /**
   * Runs when the value of an attribute is changed on the component.
   */ async attributeChangedCallback(name, _oldValue, value) {
    if (!this._lottieInstance || !this.shadow) {
      return;
    }
    if (name === 'animateOnScroll') {
      if (value === '' || Boolean(value)) {
        this._lottieInstance.autoplay = false;
        addEventListener('scroll', this._handleScroll, {
          capture: true,
          passive: true
        });
        return;
      }
      removeEventListener('scroll', this._handleScroll, true);
    }
    if (name === 'autoplay') {
      if (this.animateOnScroll) {
        return;
      }
      if (value === '' || Boolean(value)) {
        this.play();
        return;
      }
      this.stop();
    }
    if (name === 'controls') {
      this._renderControls();
    }
    if (name === 'direction') {
      if (Number(value) === -1) {
        this.setDirection(-1);
        return;
      }
      this.setDirection(1);
    }
    if (name === 'hover' && this._container) {
      if (value === '' || Boolean(value)) {
        this._container.addEventListener('mouseenter', this._mouseEnter);
        this._container.addEventListener('mouseleave', this._mouseLeave);
        return;
      }
      this._container.removeEventListener('mouseenter', this._mouseEnter);
      this._container.removeEventListener('mouseleave', this._mouseLeave);
    }
    if (name === 'loop') {
      const toggleLoop = this.shadow.querySelector('.toggleLoop');
      if (toggleLoop instanceof HTMLButtonElement) {
        toggleLoop.dataset.active = value;
      }
      this.setLoop(value === '' || Boolean(value));
    }
    if (name === 'mode') {
      const toggleBoomerang = this.shadow.querySelector('.toggleBoomerang');
      if (toggleBoomerang instanceof HTMLButtonElement) {
        toggleBoomerang.dataset.active = (value === PlayMode.Bounce).toString();
      }
      this._isBounce = value === PlayMode.Bounce;
    }
    if (name === 'speed') {
      const val = Number(value);
      if (val && !isNaN(val)) {
        this.setSpeed(val);
      }
    }
    if (name === 'src') {
      await this.load(value);
    }
    if (name === 'subframe') {
      this.setSubframe(value === '' || Boolean(value));
    }
  }
    /**
   * Initialize everything on component first render.
   */ async connectedCallback() {
    await super.connectedCallback();
    this._render();
    if (!this.shadow) {
      throw new Error('Missing Shadow element');
    }
    this._container = this.shadow.querySelector('.animation');
    this._renderControls();
    // Add listener for Visibility API's change event.
    if (typeof document.hidden !== 'undefined') {
      document.addEventListener('visibilitychange', this._onVisibilityChange);
    }
    // Add intersection observer for detecting component being out-of-view.
    this._addIntersectionObserver();
    // Setup lottie player
    await this.load(this.src);
    this.dispatchEvent(new CustomEvent(PlayerEvents.Rendered));
  }
    /**
   * Destroy animation and element.
   */ destroy() {
    if (!this._lottieInstance?.destroy) {
      return;
    }
    this.playerState = PlayerState.Destroyed;
    this._removeEventListeners();
    this._lottieInstance.destroy();
    this._lottieInstance = null;
    this.dispatchEvent(new CustomEvent(PlayerEvents.Destroyed));
    this.remove();
    document.removeEventListener('visibilitychange', this._onVisibilityChange);
  }
    /**
   * Cleanup on component destroy.
   */ disconnectedCallback() {
    // Remove intersection observer for detecting component being out-of-view
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
      this._intersectionObserver = undefined;
    }
    // Remove the attached Visibility API's change event listener
    document.removeEventListener('visibilitychange', this._onVisibilityChange);
    // Destroy the animation instance
    // if (!this._lottieInstance?.destroy) {
    //   return
    // }
    this.destroy();
  }
    /**
   * Returns the Lottie instance used in the component.
   */ getLottie() {
    return this._lottieInstance;
  }
    /**
   * Get Lottie Manifest.
   */ getManifest() {
    return this._manifest;
  }
    /**
   * Get Multi-animation settings.
   *
   */ getMultiAnimationSettings() {
    return this._multiAnimationSettings;
  }
    /**
   * Get playback segment.
   *
   */ getSegment() {
    return this._segment;
  }
    /**
   * Initialize Lottie Web player.
   */ async load(src) {
    if (!this.shadowRoot || !src) {
      return;
    }
    // Load the resource
    try {
      const { animations, manifest } = await getAnimationData(src);
      if (!animations || animations.some((animation) => !this._isLottie(animation))) {
        throw new Error('Broken or corrupted file');
      }
      this._isBounce = this.mode === PlayMode.Bounce;
      if (this._multiAnimationSettings.length > 0 && this._multiAnimationSettings[this._currentAnimation]?.mode) {
        this._isBounce = this._multiAnimationSettings[this._currentAnimation].mode === PlayMode.Bounce;
      }
      // Override loop and autoplay set in manifest for single animation
      if (manifest?.animations.length === 1) {
        manifest.animations[0].autoplay = this.autoplay;
        manifest.animations[0].loop = this.loop;
      }
      this._animations = animations;
      this._manifest = manifest ?? {
        animations: [
          {
            autoplay: !this.animateOnScroll && this.autoplay,
            direction: this.direction,
            id: createElementID(),
            loop: this.loop,
            mode: this.mode,
            speed: this.speed
          }
        ]
      };
      // Clear previous animation, if any
      this._lottieInstance?.destroy();
      this.playerState = PlayerState.Stopped;
      // Initialize lottie player and load animation
      if (!isServer()) {
        this._lottieInstance = Lottie.loadAnimation({
          ...this._getOptions(),
          animationData: animations[this._currentAnimation]
        });
      }
      if (!this.animateOnScroll && (this.autoplay || this._multiAnimationSettings[this._currentAnimation]?.autoplay)) {
        this.play();
      }
    } catch (error) {
      this._errorMessage = handleErrors(error).message;
      this.playerState = PlayerState.Error;
      this.dispatchEvent(new CustomEvent(PlayerEvents.Error));
      return;
    }
    this._addEventListeners();
        /**
       *??
       */ const speed = this._multiAnimationSettings[this._currentAnimation]?.speed ?? this.speed, /**
       * This._manifest.animations[this._currentAnimation].speed,.
       */ direction = this._multiAnimationSettings[this._currentAnimation]?.direction ?? this.direction;
    // this._manifest.animations[this._currentAnimation].direction ??
    // 1
    // Set initial playback speed and direction
    this._lottieInstance?.setSpeed(speed);
    this._lottieInstance?.setDirection(direction);
    this._lottieInstance?.setSubframe(Boolean(this.subframe));
    // Start playing if autoplay is enabled
    if (this.autoplay || this.animateOnScroll) {
      if (this.direction === -1) {
        this.seek('99%');
      }
      if (!('IntersectionObserver' in window)) {
        if (!this.animateOnScroll) {
          this.play();
        }
        this._playerState.visible = true;
      }
      this._addIntersectionObserver();
    }
  }
    /**
   * Skip to next animation.
   */ next() {
    this._currentAnimation++;
    this._switchInstance();
  }
    /**
   * Pause.
   */ pause() {
    if (!this._lottieInstance) {
      return;
    }
    this._playerState.prev = this.playerState;
    try {
      this._lottieInstance.pause();
      this.dispatchEvent(new CustomEvent(PlayerEvents.Pause));
    } finally {
      this.playerState = PlayerState.Paused;
    }
  }
    /**
   * Play.
   */ play() {
    if (!this._lottieInstance) {
      return;
    }
    this._playerState.prev = this.playerState;
    try {
      this._lottieInstance.play();
      this.dispatchEvent(new CustomEvent(PlayerEvents.Play));
    } finally {
      this.playerState = PlayerState.Playing;
    }
  }
    /**
   * Skip to previous animation.
   */ prev() {
    this._currentAnimation--;
    this._switchInstance(true);
  }
    /**
   * Name: string, oldValue: string, newValue: string.
   */ propertyChangedCallback(name, _oldValue, value) {
    if (!this.shadow) {
      return;
    }
    const togglePlay = this.shadow.querySelector('.togglePlay'), stop = this.shadow.querySelector('.stop'), prev = this.shadow.querySelector('.prev'), next = this.shadow.querySelector('.next'), seeker = this.shadow.querySelector('.seeker'), progress = this.shadow.querySelector('progress'), popover = this.shadow.querySelector('.popover');
    if (!(togglePlay instanceof HTMLButtonElement) || !(stop instanceof HTMLButtonElement) || !(next instanceof HTMLButtonElement) || !(prev instanceof HTMLButtonElement) || !(seeker instanceof HTMLInputElement) || !(progress instanceof HTMLProgressElement)) {
      return;
    }
    if (name === 'playerState') {
      togglePlay.dataset.active = (value === PlayerState.Playing || value === PlayerState.Paused).toString();
      stop.dataset.active = (value === PlayerState.Stopped).toString();
      if (value === PlayerState.Playing) {
        togglePlay.innerHTML = /* HTML */ `<svg width="24" height="24" aria-hidden="true" focusable="false"><path d="M14.016 5.016H18v13.969h-3.984V5.016zM6 18.984V5.015h3.984v13.969H6z"/></svg>`;
      } else {
        togglePlay.innerHTML = /* HTML */ `<svg width="24" height="24" aria-hidden="true" focusable="false"><path d="M8.016 5.016L18.985 12 8.016 18.984V5.015z"/></svg>`;
      }
    }
    if (name === '_seeker' && typeof value === 'number') {
      seeker.value = value.toString();
      seeker.ariaValueNow = value.toString();
      progress.value = value;
    }
    if (name === '_animations' && Array.isArray(value) && this._currentAnimation + 1 < value.length) {
      next.hidden = false;
    }
    if (name === '_currentAnimation' && typeof value === 'number') {
      if (value + 1 >= this._animations.length) {
        next.hidden = true;
      } else {
        next.hidden = false;
      }
      if (value) {
        prev.hidden = false;
      } else {
        prev.hidden = true;
      }
    }
    if (name === '_isSettingsOpen' && typeof value === 'boolean' && popover instanceof HTMLDivElement) {
      popover.hidden = !value;
    }
  }
    /**
   * Reload animation.
   */ async reload() {
    if (!this.src) {
      return;
    }
    this._lottieInstance?.destroy();
    await this.load(this.src);
  }
    /**
   * Seek to a given frame.
   *
   * @param value - Frame to seek to.
   */ seek(value) {
    if (!this._lottieInstance) {
      return;
    }
    // Extract frame number from either number or percentage value
    const matches = value.toString().match(/^(\d+)(%?)$/);
    if (!matches) {
      return;
    }
    // Calculate and set the frame number
    const frame = Math.round(matches[2] === '%' ? this._lottieInstance.totalFrames * Number(matches[1]) / 100 : Number(matches[1]));
    // Set seeker to new frame number
    this._seeker = frame;
    // Send lottie player to the new frame
    if (this.playerState === PlayerState.Playing || this.playerState === PlayerState.Frozen && this._playerState.prev === PlayerState.Playing) {
      this._lottieInstance.goToAndPlay(frame, true);
      this.playerState = PlayerState.Playing;
      return;
    }
    this._lottieInstance.goToAndStop(frame, true);
    this._lottieInstance.pause();
  }
    /**
   * Dynamically set count for loops.
   */ setCount(value) {
    this.count = value;
  }
    /**
   * Animation play direction.
   *
   * @param value - Animation direction.
   */ setDirection(value) {
    if (!this._lottieInstance) {
      return;
    }
    this._lottieInstance.setDirection(value);
  }
    /**
   * Set loop.
   */ setLoop(value) {
    if (!this._lottieInstance) {
      return;
    }
    this._lottieInstance.setLoop(value);
  }
    /**
   * Set Multi-animation settings.
   */ setMultiAnimationSettings(settings) {
    this._multiAnimationSettings = settings;
  }
    /**
   * Set playback segment.
   */ setSegment(segment) {
    this._segment = segment;
  }
    /**
   * Set animation playback speed.
   *
   * @param value - Playback speed.
   */ setSpeed(value = 1) {
    if (!this._lottieInstance) {
      return;
    }
    this._lottieInstance.setSpeed(value);
  }
    /**
   * Toggles subframe, for more smooth animations.
   *
   * @param value - Whether animation uses subframe.
   */ setSubframe(value) {
    if (!this._lottieInstance) {
      return;
    }
    this._lottieInstance.setSubframe(value);
  }
    /**
   * Snapshot and download the current frame as SVG.
   */ snapshot(shouldDownload = true, name = 'AM Lottie') {
    try {
      if (!this.shadowRoot) {
        throw new Error('Unknown error');
      }
      // Get SVG element and serialize markup
      const svgElement = this.shadowRoot.querySelector('.animation svg');
      if (!svgElement) {
        throw new Error('Could not retrieve animation from DOM');
      }
      const data = svgElement instanceof Node ? new XMLSerializer().serializeToString(svgElement) : null;
      if (!data) {
        throw new Error('Could not serialize SVG element');
      }
      if (shouldDownload) {
        download(data, {
          mimeType: 'image/svg+xml',
          name: `${getFilename(this.src || name)}-${frameOutput(this._seeker)}.svg`
        });
      }
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
    /**
   * Stop.
   */ stop() {
    if (!this._lottieInstance) {
      return;
    }
    this._playerState.prev = this.playerState;
    this._playerState.count = 0;
    try {
      this._lottieInstance.stop();
      this.dispatchEvent(new CustomEvent(PlayerEvents.Stop));
    } finally {
      this.playerState = PlayerState.Stopped;
    }
  }
    /**
   * Toggle Boomerang.
   */ toggleBoomerang() {
    const curr = this._multiAnimationSettings[this._currentAnimation];
    if (curr.mode !== undefined) {
      if (curr.mode === PlayMode.Normal) {
        curr.mode = PlayMode.Bounce;
        this._isBounce = true;
        return;
      }
      curr.mode = PlayMode.Normal;
      this._isBounce = false;
      return;
    }
    if (this.mode === PlayMode.Normal) {
      this.mode = PlayMode.Bounce;
      this._isBounce = true;
      return;
    }
    this.mode = PlayMode.Normal;
    this._isBounce = false;
  }
    /**
   * Toggle loop.
   */ toggleLoop() {
    const hasLoop = !this.loop;
    this.loop = hasLoop;
    this.setLoop(hasLoop);
  }
    /**
   * Toggle playing state.
   */ togglePlay() {
    if (!this._lottieInstance) {
      return;
    }
    const { currentFrame, playDirection, totalFrames } = this._lottieInstance;
    if (this.playerState === PlayerState.Playing) {
      this.pause();
      return;
    }
    if (this.playerState !== PlayerState.Completed) {
      this.play();
      return;
    }
    this.playerState = PlayerState.Playing;
    if (this._isBounce) {
      this.setDirection(playDirection * -1);
      this._lottieInstance.goToAndPlay(currentFrame, true);
      return;
    }
    if (playDirection === -1) {
      this._lottieInstance.goToAndPlay(totalFrames, true);
      return;
    }
    this._lottieInstance.goToAndPlay(0, true);
  }
    /**
   * Freeze animation.
   * This internal state pauses animation and is used to differentiate between
   * user requested pauses and component instigated pauses.
   */ _freeze() {
    if (!this._lottieInstance) {
      return;
    }
    this._playerState.prev = this.playerState;
    try {
      this._lottieInstance.pause();
      this.dispatchEvent(new CustomEvent(PlayerEvents.Freeze));
    } finally {
      this.playerState = PlayerState.Frozen;
    }
  }
    /**
   * Handle blur.
   */ _handleBlur() {
    setTimeout(() => {
      this._toggleSettings(false);
    }, 200);
  }
    /**
   * Handles click and drag actions on the progress track.
   */ _handleSeekChange({ target }) {
    if (!(target instanceof HTMLInputElement) || !this._lottieInstance || isNaN(Number(target.value))) {
      return;
    }
    this.seek(Math.round(Number(target.value) / 100 * this._lottieInstance.totalFrames));
  }
    /**
   * Add event listeners.
   */ _addEventListeners() {
    this._toggleEventListeners('add');
  }
    /**
   * Add IntersectionObserver.
   */ _addIntersectionObserver() {
    if (!this._container || this._intersectionObserver || !('IntersectionObserver' in window)) {
      return;
    }
    this._intersectionObserver = new IntersectionObserver((entries) => {
      const { length } = entries;
      for (let i = 0; i < length; i++) {
        if (!entries[i].isIntersecting || document.hidden) {
          if (this.playerState === PlayerState.Playing) {
            this._freeze();
          }
          this._playerState.visible = false;
          continue;
        }
        if (!this.animateOnScroll && this.playerState === PlayerState.Frozen) {
          this.play();
        }
        if (!this._playerState.scrollY) {
          this._playerState.scrollY = scrollY;
        }
        this._playerState.visible = true;
      }
    });
    this._intersectionObserver.observe(this._container);
  }
  _complete() {
    if (!this._lottieInstance) {
      return;
    }
    if (this._animations.length > 1) {
      if (this._multiAnimationSettings[this._currentAnimation + 1]?.autoplay) {
        this.next();
        return;
      }
      if (this.loop && this._currentAnimation === this._animations.length - 1) {
        this._currentAnimation = 0;
        this._switchInstance();
        return;
      }
    }
    const { currentFrame, totalFrames } = this._lottieInstance;
    this._seeker = Math.round(currentFrame / totalFrames * 100);
    this.playerState = PlayerState.Completed;
    this.dispatchEvent(new CustomEvent(PlayerEvents.Complete, {
      detail: {
        frame: currentFrame,
        seeker: this._seeker
      }
    }));
  }
  _dataFailed() {
    this.playerState = PlayerState.Error;
    this.dispatchEvent(new CustomEvent(PlayerEvents.Error));
  }
  _dataReady() {
    this.dispatchEvent(new CustomEvent(PlayerEvents.Load));
  }
  _DOMLoaded() {
    this._playerState.loaded = true;
    this.dispatchEvent(new CustomEvent(PlayerEvents.Ready));
  }
  _enterFrame() {
    if (!this._lottieInstance) {
      return;
    }
    const { currentFrame, totalFrames } = this._lottieInstance;
    this._seeker = Math.round(currentFrame / totalFrames * 100);
    this.dispatchEvent(new CustomEvent(PlayerEvents.Frame, {
      detail: {
        frame: currentFrame,
        seeker: this._seeker
      }
    }));
  }
    /**
   * Get options from props.
   */ _getOptions() {
    if (!this._container) {
      throw new Error('Container not rendered');
    }
    const preserveAspectRatio = this.preserveAspectRatio ?? (this.objectfit && aspectRatio(this.objectfit)), currentAnimationSettings = this._multiAnimationSettings.length > 0 ? this._multiAnimationSettings[this._currentAnimation] : undefined, currentAnimationManifest = this._manifest?.animations[this._currentAnimation];
    // Loop
    let hasLoop = Boolean(this.loop);
    if (currentAnimationManifest?.loop !== undefined //&&
    ) {
      hasLoop = Boolean(currentAnimationManifest.loop);
    }
    if (currentAnimationSettings?.loop !== undefined) {
      hasLoop = Boolean(currentAnimationSettings.loop);
    }
    // Autoplay
    let hasAutoplay = Boolean(this.autoplay);
    if (currentAnimationManifest?.autoplay !== undefined //&&
    ) {
      hasAutoplay = Boolean(currentAnimationManifest.autoplay);
    }
    if (currentAnimationSettings?.autoplay !== undefined) {
      hasAutoplay = Boolean(currentAnimationSettings.autoplay);
    }
    if (this.animateOnScroll) {
      hasAutoplay = false;
    }
    // Segment
    let initialSegment = this._segment;
    if (this._segment?.every((val) => val > 0)) {
      initialSegment = [
        this._segment[0] - 1,
        this._segment[1] - 1
      ];
    }
    if (this._segment?.some((val) => val < 0)) {
      initialSegment = undefined;
    }
    const options = {
      autoplay: hasAutoplay,
      container: this._container,
      initialSegment,
      loop: hasLoop,
      renderer: RendererType.SVG,
      rendererSettings: {
        hideOnTransparent: true,
        imagePreserveAspectRatio: preserveAspectRatio,
        preserveAspectRatio,
        progressiveLoad: true
      }
    };
    return options;
  }
    /**
   * Handle scroll.
   */ _handleScroll() {
    if (!this.animateOnScroll || !this._lottieInstance) {
      return;
    }
    if (isServer()) {
      console.warn('DotLottie: Scroll animations might not work properly in a Server Side Rendering context. Try to wrap this in a client component.');
      return;
    }
    if (this._playerState.visible) {
      if (this._playerState.scrollTimeout) {
        clearTimeout(this._playerState.scrollTimeout);
      }
      this._playerState.scrollTimeout = setTimeout(() => {
        this.playerState = PlayerState.Paused;
      }, 400);
      const adjustedScroll = scrollY > this._playerState.scrollY ? scrollY - this._playerState.scrollY : this._playerState.scrollY - scrollY, clampedScroll = Math.min(Math.max(adjustedScroll / 3, 1), this._lottieInstance.totalFrames * 3), roundedScroll = clampedScroll / 3;
      window.requestAnimationFrame(() => {
        if (roundedScroll < (this._lottieInstance?.totalFrames ?? 0)) {
          this.playerState = PlayerState.Playing;
          this._lottieInstance?.goToAndStop(roundedScroll, true);
        } else {
          this.playerState = PlayerState.Paused;
        }
      });
    }
  }
  _handleWindowBlur({ type }) {
    if (this.playerState === PlayerState.Playing && type === 'blur') {
      this._freeze();
    }
    if (type === 'focus') {
      // This timeout is set to not prevent toggling play after freeze event
      setTimeout(() => {
        if (this.playerState === PlayerState.Frozen) {
          this.play();
        }
      }, 100);
    }
  }
  _isLottie(json) {
    const mandatory = [
      'v',
      'ip',
      'op',
      'layers',
      'fr',
      'w',
      'h'
    ];
    return mandatory.every((field) => Object.hasOwn(json, field));
  }
  _loopComplete() {
    if (!this._lottieInstance) {
      return;
    }
    const { playDirection, // firstFrame,
      totalFrames } = this._lottieInstance, inPoint = this._segment ? this._segment[0] : 0, outPoint = this._segment ? this._segment[0] : totalFrames;
    if (this.count) {
      if (this._isBounce) {
        this._playerState.count += 0.5;
      } else {
        this._playerState.count += 1;
      }
      if (this._playerState.count >= this.count) {
        this.setLoop(false);
        this.playerState = PlayerState.Completed;
        this.dispatchEvent(new CustomEvent(PlayerEvents.Complete));
        return;
      }
    }
    this.dispatchEvent(new CustomEvent(PlayerEvents.Loop));
    if (this._isBounce) {
      this._lottieInstance.goToAndStop(playDirection === -1 ? inPoint : outPoint * 0.99, true);
      this._lottieInstance.setDirection(playDirection * -1);
      return setTimeout(() => {
        if (!this.animateOnScroll) {
          this._lottieInstance?.play();
        }
      }, this.intermission);
    }
    this._lottieInstance.goToAndStop(playDirection === -1 ? outPoint * 0.99 : inPoint, true);
    return setTimeout(() => {
      if (!this.animateOnScroll) {
        this._lottieInstance?.play();
      }
    }, this.intermission);
  }
    /**
   * Handle MouseEnter.
   */ _mouseEnter() {
    if (this.hover && this.playerState !== PlayerState.Playing) {
      this.play();
    }
  }
    /**
   * Handle MouseLeave.
   */ _mouseLeave() {
    if (this.hover && this.playerState === PlayerState.Playing) {
      this.stop();
    }
  }
    /**
   * Handle visibility change events.
   */ _onVisibilityChange() {
    if (document.hidden && this.playerState === PlayerState.Playing) {
      this._freeze();
      return;
    }
    if (this.playerState === PlayerState.Frozen) {
      this.play();
    }
  }
    /**
   * Remove event listeners.
   */ _removeEventListeners() {
    this._toggleEventListeners('remove');
  }
  _switchInstance(isPrevious = false) {
    // Bail early if there is not animation to play
    if (!this._animations[this._currentAnimation]) {
      return;
    }
    try {
      // Clear previous animation
      this._lottieInstance?.destroy();
      // Re-initialize lottie player
      this._lottieInstance = Lottie.loadAnimation({
        ...this._getOptions(),
        animationData: this._animations[this._currentAnimation]
      });
      // Check play mode for current animation
      if (this._multiAnimationSettings[this._currentAnimation]?.mode) {
        this._isBounce = this._multiAnimationSettings[this._currentAnimation].mode === PlayMode.Bounce;
      }
      // Remove event listeners to new Lottie instance, and add new
      this._removeEventListeners();
      this._addEventListeners();
      this.dispatchEvent(new CustomEvent(isPrevious ? PlayerEvents.Previous : PlayerEvents.Next));
      if (this._multiAnimationSettings[this._currentAnimation]?.autoplay ?? this.autoplay) {
        if (this.animateOnScroll) {
          this._lottieInstance.goToAndStop(0, true);
          this.playerState = PlayerState.Paused;
          return;
        }
        this._lottieInstance.goToAndPlay(0, true);
        this.playerState = PlayerState.Playing;
        return;
      }
      this._lottieInstance.goToAndStop(0, true);
      this.playerState = PlayerState.Stopped;
    } catch (error) {
      this._errorMessage = handleErrors(error).message;
      this.playerState = PlayerState.Error;
      this.dispatchEvent(new CustomEvent(PlayerEvents.Error));
    }
  }
    /**
   * Toggle event listeners.
   */ _toggleEventListeners(action) {
    if (!this._lottieInstance) {
      throw new Error('No Lottie Instance');
    }
    const method = action === 'add' ? 'addEventListener' : 'removeEventListener';
    this._lottieInstance[method]('enterFrame', this._enterFrame);
    this._lottieInstance[method]('complete', this._complete);
    this._lottieInstance[method]('loopComplete', this._loopComplete);
    this._lottieInstance[method]('DOMLoaded', this._DOMLoaded);
    this._lottieInstance[method]('data_ready', this._dataReady);
    this._lottieInstance[method]('data_failed', this._dataFailed);
    if (this._container && this.hover) {
      this._container[method]('mouseenter', this._mouseEnter);
      this._container[method]('mouseleave', this._mouseLeave);
    }
    window[method]('focus', this._handleWindowBlur, {
      capture: false,
      passive: true
    });
    window[method]('blur', this._handleWindowBlur, {
      capture: false,
      passive: true
    });
    if (this.animateOnScroll) {
      window[method]('scroll', this._handleScroll, {
        capture: true,
        passive: true
      });
    }
  }
    /**
   * Toggle show Settings.
   */ _toggleSettings(flag) {
    if (flag === undefined) {
      this._isSettingsOpen = !this._isSettingsOpen;
      return;
    }
    this._isSettingsOpen = flag;
  }
}

const tagName = 'dotlottie-player';
if (!isServer()) {
    /**
   * Expose DotLottiePlayer class as global variable.
   */ globalThis.dotLottiePlayer = () => new DotLottiePlayer();
    /**
   * Add a definition for the custom element to the custom element registry,
   * mapping its name to the constructor which will be used to create it.
   */ customElements.define('dotlottie-player', DotLottiePlayer);
}

export { PlayMode, PlayerState, DotLottiePlayer as default, tagName };
