declare namespace SoundManager {
    let soundVolume: number;
    let musicVolume: number;
    let soundPool: android.media.SoundPool;
    let maxStreams: number;
    let playingStreams: number;
    let resourcePath: string;
    let soundData: {
        [key: string]: Sound | Sound[];
    };
    let audioSources: Array<AudioSource>;
    function readSettings(): void;
    function init(maxStreamsCount: number): void;
    function setResourcePath(path: string): void;
    function registerSound(soundName: string, path: string | string[], looping?: boolean): void;
    function getSound(soundName: string): Sound;
    function playSound(soundName: string | Sound, volume?: number, pitch?: number): number;
    function playSoundAt(x: number, y: number, z: number, soundName: string | Sound, volume?: number, pitch?: number, radius?: number): number;
    function playSoundAtEntity(entity: number, soundName: string | Sound, volume?: number, pitch?: number, radius?: number): number;
    function playSoundAtBlock(tile: any, soundName: string | Sound, volume?: number, radius?: number): number;
    function createSource(sourceType: SourceType, source: any, soundName: string, volume?: number, radius?: number): AudioSource;
    function getSource(source: any, soundName?: string): AudioSource;
    function getAllSources(source: any, soundName?: string): AudioSource[];
    function removeSource(audioSource: AudioSource): void;
    function startPlaySound(sourceType: SourceType, source: any, soundName: string, volume?: number, radius?: number): AudioSource;
    function stopPlaySound(source: any, soundName?: string): boolean;
    function setVolume(streamID: number, leftVolume: number, rightVolume?: number): void;
    function stop(streamID: number): void;
    function pause(streamID: number): void;
    function resume(streamID: number): void;
    function stopAll(): void;
    function autoPause(): void;
    function autoResume(): void;
    function release(): void;
    function tick(): void;
}
declare class Sound {
    name: string;
    soundPool: android.media.SoundPool;
    path: string;
    looping: boolean;
    id: number;
    private duration;
    constructor(name: string, soundPool: android.media.SoundPool, path: string, looping: boolean);
    getDuration(): number;
}
declare enum SourceType {
    ENTITY = 0,
    TILEENTITY = 1
}
declare class AudioSource {
    sound: Sound;
    soundName: string;
    nextSound: string;
    sourceType: SourceType;
    source: any;
    position: Vector;
    radius: number;
    dimension: number;
    streamID: number;
    volume: number;
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
