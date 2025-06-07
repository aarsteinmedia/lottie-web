import type AudioElement from '@/elements/AudioElement';
import type { AudioFactory } from '@/types';
export declare class AudioController {
    audioFactory?: AudioFactory;
    audios: AudioElement[];
    isPlaying?: boolean;
    private _isMuted;
    private _volume;
    constructor(audioFactory?: AudioFactory);
    addAudio(audio: AudioElement): void;
    createAudio(assetPath?: string): any;
    getVolume(): number;
    mute(): void;
    pause(): void;
    resume(): void;
    setAudioFactory(audioFactory: AudioFactory): void;
    setRate(rateValue: number): void;
    setVolume(value: number): void;
    unmute(): void;
    private _updateVolume;
}
export default function audioControllerFactory(factory?: AudioFactory): AudioController;
