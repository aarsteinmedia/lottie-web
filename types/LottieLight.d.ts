import { play, pause, togglePause, setSpeed, setDirection, stop, registerAnimation, resize, goToAndStop, destroy, freeze, unfreeze, setVolume, mute, unmute, getRegisteredAnimations, loadAnimation } from './animation/AnimationManager';
export declare const setSubframeRendering: (flag: boolean) => void;
declare const Lottie: {
    destroy: typeof destroy;
    freeze: typeof freeze;
    getRegisteredAnimations: typeof getRegisteredAnimations;
    goToAndStop: typeof goToAndStop;
    loadAnimation: typeof loadAnimation;
    mute: typeof mute;
    pause: typeof pause;
    play: typeof play;
    registerAnimation: typeof registerAnimation;
    resize: typeof resize;
    setDirection: typeof setDirection;
    setLocationHref: (value: string) => void;
    setPrefix: (value: string) => void;
    setQuality: (value: string | number) => void;
    setSpeed: typeof setSpeed;
    setSubframeRendering: (flag: boolean) => void;
    setVolume: typeof setVolume;
    stop: typeof stop;
    togglePause: typeof togglePause;
    unfreeze: typeof unfreeze;
    unmute: typeof unmute;
    useWebWorker: (flag: boolean) => void;
    version: string;
};
export { loadAnimation };
export default Lottie;
