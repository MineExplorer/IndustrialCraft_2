declare const IS_OLD: boolean;
declare namespace SoundRegistry {
    let resourcePath: string;
    const soundData: {
        [key: string]: Sound | MultiSound;
    };
    /**
     * Path to your resources folder
     * @param path must end with "/"
     */
    function setBasePath(path: string): void;
    function registerSound(name: string, filePath: string): void;
    function registerMultiSound(name: string, filePaths: string[]): void;
    function getSound(name: string): Nullable<Sound>;
    function getAllSounds(): Sound[];
}
/**
 * For wrapping SoundPool object
 */
declare class SoundManagerClient {
    settingsFolder: string;
    settingsPath: string;
    soundVolume: number;
    musicVolume: number;
    soundPool: android.media.SoundPool;
    maxStreams: number;
    constructor(maxStreamsCount: number, sounds: Sound[]);
    readSettings(): void;
    loadSounds(sounds: Sound[]): void;
    /**
     * Starts playing sound and returns its streamId or 0 if failes to play sound.
     * @param sound sound name or object
     * @param looping true if sound is looped, false otherwise
     * @param volume value from 0 to 1
     * @param pitch value from 0 to 1
     * @returns stream id
     */
    playSound(sound: string | Sound, looping?: boolean, volume?: number, pitch?: number): number;
    playSoundAt(x: number, y: number, z: number, sound: string | Sound, looping?: boolean, volume?: number, pitch?: number, radius?: number): number;
    setVolume(streamID: number, leftVolume: number, rightVolume?: number): void;
    stop(streamID: number): void;
    setLooping(streamID: number, looping: boolean): void;
    pause(streamID: number): void;
    resume(streamID: number): void;
    stopAll(): void;
    pauseAll(): void;
    resumeAll(): void;
    release(): void;
}
declare namespace SoundManager {
    type SoundPacketData = {
        x: number;
        y: number;
        z: number;
        name: string;
        volume: number;
        pitch: number;
        radius: number;
    };
    function getClient(): SoundManagerClient;
    /**
     * Initializes client side code
     * @param maxStreamsCount max count of concurrently playing streams
     */
    function init(maxStreamsCount: number): void;
    function playSoundAt(coords: Vector, dimension: number, soundName: string, volume?: number, pitch?: number, radius?: number): number;
    function playSoundAt(x: number, y: number, z: number, dimension: number, soundName: string, volume?: number, pitch?: number, radius?: number): number;
    function playSoundAtEntity(entity: number, soundName: string, volume?: number, pitch?: number, radius?: number): number;
    function playSoundAtBlock(coords: Vector, dimension: number, soundName: string, volume?: number, radius?: number): number;
}
declare class Sound {
    name: string;
    path: string;
    internalId: number;
    private duration;
    /**
     * @param name sound name id
     * @param path file path
     */
    constructor(name: string, path: string);
    load(soundPool: android.media.SoundPool): void;
    getDuration(): number;
}
declare class MultiSound {
    name: string;
    sounds: string[];
    constructor(name: string, sounds: string[]);
    getRandomSoundId(): string;
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
    relativePosition?: Vector;
    name: string;
    state: SoundStreamState;
    startTime: number;
    onCompleteEvent?: (source: AudioSourceClient, stream: SoundStream) => void;
    private _soundClient;
    constructor(sound: Sound, streamId: number, looping: boolean, volume: number, radius: number, relativePosition?: Vector);
    setOnCompleteEvent(event: (source: AudioSourceClient, stream: SoundStream) => void): void;
    onComplete(source: AudioSourceClient): void;
    setStreamId(streamId: number): void;
    reset(): void;
    stop(): void;
    pause(): void;
    resume(): void;
    updateVolume(volumeMod: number): void;
    getDuration(): number;
    isPlaying(): boolean;
}
/**
 * Client side audio source.
 */
declare class AudioSourceClient implements Updatable {
    position: Vector;
    volume: number;
    remove: boolean;
    streams: SoundStream[];
    entitySource?: number;
    constructor(entity: number);
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
    play(soundName: string, looping?: boolean, volume?: number, radius?: number, relativePosition?: Vector): Nullable<SoundStream>;
    /**
     * Start playing sound from this source if it's not started.
     * @param sound sound name or object
     * @param looping true if sound is looped, false otherwise
     * @param volume value from 0 to 1
     * @param radius the radius where the sound is heard
     * @returns SoundStream object or null.
     */
    playSingle(soundName: string, looping?: boolean, volume?: number, radius?: number, relativePosition?: Vector): void;
    /**
     * Finds stream by sound name
     * @param soundName sound name
     * @returns sound stream or null
     */
    getStream(soundName: string): Nullable<SoundStream>;
    isPlaying(soundName: string): boolean;
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
    getAbsolutePosition(relativeCoords: Vector): Vector;
    private playSound;
    private updateStreams;
    private updateVolume;
}
