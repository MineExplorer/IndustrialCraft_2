declare namespace SoundManager {
    type SoundData = {
        id: number | number[];
        path: string;
        looping: boolean;
        duration?: number;
    };
    export let soundVolume: number;
    export let musicVolume: number;
    export let soundPool: android.media.SoundPool;
    export let maxStreams: number;
    export let playingStreams: number;
    export let soundPath: string;
    export let soundData: object;
    export let audioSources: Array<AudioSource>;
    export function readSettings(): void;
    export function init(maxStreamsCount: number): void;
    export function setResourcePath(path: string): void;
    export function registerSound(soundName: string, path: string | string[], looping?: boolean): void;
    export function getSoundData(soundName: string): SoundData;
    export function getSoundDuration(soundName: string): any;
    export function playSound(soundName: string, volume?: number, pitch?: number): number;
    export function playSoundAt(x: number, y: number, z: number, soundName: string, volume?: number, pitch?: number, radius?: number): number;
    export function playSoundAtEntity(entity: number, soundName: string, volume?: number, pitch?: number, radius?: number): number;
    export function playSoundAtBlock(tile: any, soundName: string, volume?: number, radius?: number): number;
    export function createSource(sourceType: SourceType, source: any, soundName: string, volume?: number, radius?: number): AudioSource;
    export function getSource(source: any, soundName?: string): AudioSource;
    export function getAllSources(source: any, soundName?: string): AudioSource[];
    export function removeSource(audioSource: AudioSource): void;
    export function startPlaySound(sourceType: SourceType, source: any, soundName: string, volume?: number, radius?: number): AudioSource;
    export function stopPlaySound(source: any, soundName?: string): boolean;
    export function setVolume(streamID: number, leftVolume: number, rightVolume?: number): void;
    export function stop(streamID: number): void;
    export function pause(streamID: number): void;
    export function resume(streamID: number): void;
    export function stopAll(): void;
    export function autoPause(): void;
    export function autoResume(): void;
    export function release(): void;
    export function tick(): void;
    export {};
}
declare class Sound {
    soundID: number;
    path: number;
    constructor();
}
declare enum SourceType {
    ENTITY = 0,
    TILEENTITY = 1
}
declare class AudioSource {
    soundName: string;
    nextSound: string;
    sourceType: SourceType;
    source: any;
    position: Vector;
    radius: number;
    dimension: number;
    streamID: number;
    volume: number;
    isLooping: boolean;
    isPlaying: boolean;
    startTime: number;
    remove: boolean;
    constructor(sourceType: SourceType, source: any, soundName: string, volume?: number, radius?: number);
    setPosition(x: number, y: number, z: number): this;
    setSound(soundName: string): void;
    setNextSound(soundName: string): void;
    playNextSound(): void;
    play(): void;
    stop(): void;
    pause(): void;
    resume(): void;
    updateVolume(): void;
}
