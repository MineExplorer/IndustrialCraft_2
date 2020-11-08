declare type SoundData = {
    id: number | number[];
    path: string;
    looping: boolean;
    duration?: number;
};
declare var settings_path: string;
declare abstract class SoundManager {
    static soundVolume: number;
    static musicVolume: number;
    private static soundPool;
    static maxStreams: number;
    static playingStreams: number;
    private static soundPath;
    private static soundData;
    private static audioSources;
    static init(maxStreams: number): void;
    static setResourcePath(path: string): void;
    static registerSound(soundName: string, path: string | string[], looping?: boolean): void;
    static getSoundData(soundName: string): SoundData;
    static getSoundDuration(soundName: string): any;
    static playSound(soundName: string, volume?: number, pitch?: number): number;
    static playSoundAt(x: number, y: number, z: number, soundName: string, volume?: number, pitch?: number, radius?: number): number;
    static playSoundAtEntity(entity: number, soundName: string, volume: number, pitch: number, radius?: number): number;
    static playSoundAtBlock(tile: any, soundName: string, volume: number, radius?: number): number;
    static createSource(sourceType: SourceType, source: any, soundName: string, volume?: number, radius?: number): AudioSource;
    static getSource(source: any, soundName?: string): AudioSource;
    static getAllSources(source: any, soundName?: string): AudioSource[];
    static removeSource(audioSource: AudioSource): void;
    static startPlaySound(sourceType: SourceType, source: any, soundName: string, volume?: number, radius?: number): AudioSource;
    static startPlaySound(sourceType: SourceType.PLAYER, soundName: string, volume?: number): AudioSource;
    static stopPlaySound(source: any, soundName?: string): boolean;
    static setVolume(streamID: number, leftVolume: number, rightVolume?: number): void;
    static stop(streamID: number): void;
    static pause(streamID: number): void;
    static resume(streamID: number): void;
    static stopAll(): void;
    static autoPause(): void;
    static autoResume(): void;
    static release(): void;
    static tick(): void;
}
declare var prevScreen: boolean;
declare class Sound {
    soundID: number;
    path: number;
    constructor();
}
declare enum SourceType {
    PLAYER = 0,
    ENTITY = 1,
    TILEENTITY = 2
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
