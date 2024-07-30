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
     * Starts playing sound and returns its streamId and returns 0 if failes to play sound.
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
    private duration;
    /**
     * @param name sound name
     * @param soundPool SoundPool where sound is loaded
     * @param path file path
     * @param looping deprecated
     */
    constructor(name: string, soundPool: android.media.SoundPool, path: string, looping: boolean);
    getDuration(): number;
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
declare enum SoundStreamState {
    Idle = 0,
    Started = 1,
    Paused = 2,
    Stopped = 3
}
declare class SoundStream {
    sound: Sound;
    streamId: number;
    looping: boolean;
    volume: number;
    radius: number;
    name: string;
    state: SoundStreamState;
    startTime: number;
    onCompleteEvent?: (source: AudioSourceClient, stream: SoundStream) => void;
    constructor(sound: Sound, streamId: number, looping: boolean, volume: number, radius: number);
    setOnCompleteEvent(event: (source: AudioSourceClient, stream: SoundStream) => void): void;
    onComplete(source: AudioSourceClient): void;
    setStreamId(streamId: number): void;
    reset(): void;
    stop(): void;
    pause(): void;
    resume(): void;
    setVolume(volume: number): void;
    getDuration(): number;
    isPlaying(): boolean;
}
/**
 * Client side audio source.
 */
declare class AudioSourceClient implements Updatable {
    position: Vector;
    dimension: number;
    volume: number;
    remove: boolean;
    streams: SoundStream[];
    source: any;
    constructor(position: Vector);
    /**
     * Updates source position.
     * @param x x coord
     * @param y y coord
     * @param z z coord
     */
    setPosition(x: number, y: number, z: number): void;
    /**
     * Plays sound from this source.
     * If the sound cannot be played and its looped it creates SoundStream object in pending state,
     * otherwise it just skipped.
     * @param sound sound name or object
     * @param looping true if sound is looped, false otherwise
     * @param volume value from 0 to 1
     * @param radius the radius where the sound is heard
     * @returns SoundStream object or null.
     */
    play(sound: string | Sound, looping?: boolean, volume?: number, radius?: number): Nullable<SoundStream>;
    /**
     * Finds stream by sound name
     * @param soundName sound name
     * @returns sound stream or null
     */
    getStream(soundName: string): Nullable<SoundStream>;
    /**
     * Stops playing sound by name
     * @param soundName sound name
     * @returns true if the sound was found, false otherwise
     */
    stop(soundName: string): boolean;
    /**
     * Stops all streams
     */
    stopAll(): void;
    /**
     * Pause all streams
     */
    pauseAll(): void;
    /**
     * Resumes all streams
     */
    resumeAll(): void;
    /**
     * Sets sound volume by name
     * @param soundName sound name
     * @param volume volume
     */
    setVolume(soundName: string, volume: number): void;
    update: () => void;
    unload(): void;
    private playSound;
    private updateStreams;
    private updateVolume;
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
    networkVisibilityDistance: number;
    constructor(tileEntity: TileEntity);
    play(soundName: string, looping?: boolean, volume?: number, radius?: number): void;
    stop(soundName: string): void;
    pause(): void;
    resume(): void;
}
