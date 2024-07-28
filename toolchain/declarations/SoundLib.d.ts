declare const IS_OLD: boolean;
declare namespace SoundManager {
    let soundVolume: number;
    let musicVolume: number;
    let soundPool: android.media.SoundPool;
    let maxStreams: number;
    let playingStreams: number[];
    let resourcePath: string;
    let soundData: {
        [key: string]: Sound | Sound[];
    };
    const audioSources: AudioSource[];
    const soundStreams: SoundStream[];
    function readSettings(): void;
    function init(maxStreamsCount: number): void;
    function setResourcePath(path: string): void;
    function registerSound(soundName: string, path: string | string[], looping?: boolean): void;
    function getSound(soundName: string): Sound;
    /**
     * Starts playing sound and returns its streamId.
     * @param soundName
     * @param loop
     * @param volume
     * @param pitch
     * @returns
     */
    function playSound(soundName: string | Sound, loop?: boolean, volume?: number, pitch?: number): number;
    function playSoundAt(x: number, y: number, z: number, soundName: string | Sound, loop?: boolean, volume?: number, pitch?: number, radius?: number): number;
    function playSoundAtEntity(entity: number, soundName: string | Sound, volume?: number, pitch?: number, radius?: number): number;
    function playSoundAtBlock(tile: any, soundName: string | Sound, loop?: boolean, volume?: number, radius?: number): number;
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
    nextSound: Sound;
    private duration;
    constructor(name: string, soundPool: android.media.SoundPool, path: string, looping: boolean);
    getDuration(): number;
}
declare class SoundSequence {
    currentSound: Sound;
    nextSequence: SoundSequence;
    looping: boolean;
}
interface IAudioSource {
    position: Vector;
    dimension: number;
    remove: boolean;
    play(soundName: string, looping?: boolean, volume?: number, radius?: number): void;
}
declare class AmbientSound {
    soundName: string;
    volume: number;
    radius: number;
    isPlaying: boolean;
    constructor(soundName: string, volume: number, radius: number);
}
/**
 * Class for playing sound from tile entity.
 */
declare class TileEntityAudioSource implements IAudioSource {
    source: TileEntity;
    position: Vector;
    radius: number;
    dimension: number;
    volume: number;
    isPlaying: boolean;
    remove: boolean;
    sounds: AmbientSound[];
    networkEntity: NetworkEntity;
    constructor(tileEntity: TileEntity);
    play(soundName: string, looping?: boolean, volume?: number, radius?: number): void;
    stop(soundName: string): void;
    pause(): void;
    resume(): void;
}
declare class SoundPacket {
    x: number;
    y: number;
    z: number;
    sounds: {
        name: string;
        /** Volume */
        v: number;
        /** Radius */
        r: number;
    }[];
    constructor(pos: Vector, sounds: AmbientSound[]);
}
declare const AudioSourceNetworkType: NetworkEntityType;
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
    networkEntity: NetworkEntity;
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
declare class SoundStream {
    name: string;
    sound: Sound;
    looping: boolean;
    volume: number;
    radius: number;
    streamId: number;
    isPlaying: boolean;
    startTime: number;
    constructor(soundName: string, looping: boolean, volume: number, radius: number);
}
/**
 * Position in the world emiting streams.
 */
declare class AudioSourceClient implements IAudioSource {
    position: Vector;
    dimension: number;
    volume: number;
    isPlaying: boolean;
    remove: boolean;
    streams: SoundStream[];
    constructor(position: Vector);
    setPosition(x: number, y: number, z: number): void;
    playNextSound(stream: SoundStream, nextSound: Sound): void;
    play(soundName: string, looping?: boolean, volume?: number, radius?: number): void;
    /**
     * Plays sound if there is enough sound streams.
     * @param sound
     * @param volume
     * @returns true if sound was played, otherwise false.
     */
    private playSound;
    stop(soundName: string): void;
    pause(): void;
    resume(): void;
    setVolume(soundName: string, volume: number): void;
    updateVolume(): void;
    update(): void;
    unload(): void;
}
