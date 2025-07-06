declare namespace SoundLib {
    namespace Registry {
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
}
/**
 * Class for wrapping SoundPool object and provide client-side methods to play sounds
 */
declare class SoundManagerClient {
    settingsFolder: string;
    settingsPath: string;
    globalVolume: number;
    soundVolume: number;
    musicVolume: number;
    soundPool: android.media.SoundPool;
    maxStreams: number;
    constructor(maxStreamsCount: number, globalVolume: number, sounds: Sound[]);
    readSettings(): void;
    getSoundVolume(): number;
    getMusicVolume(): number;
    loadSounds(sounds: Sound[]): void;
    /**
     * Starts playing ssoundVolumeound and returns its streamId or 0 if failes to play sound.
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
declare namespace SoundLib {
    /**
     * @returns SoundManagerClient if it was initialized or null
     */
    function getClient(): Nullable<SoundManagerClient>;
    /**
     * Initializes client side code if the current instance of game has a client
     * @param maxStreamsCount max count of concurrently playing streams
     * @param globalVolume volume modifier for all sounds
     */
    function init(maxStreamsCount: number, globalVolume?: number): void;
    /**
     * Plays sound at coords
     * @param coords coords
     * @param dimension dimension
     * @param soundName sound name
     * @param volume value from 0 to 1
     * @param pitch value from 0 to 1
     * @param radius radius in blocks, 16 by default
     */
    function playSoundAt(coords: Vector, dimension: number, soundName: string, volume?: number, pitch?: number, radius?: number): void;
    /**
     * Plays sound at coords
     * @param x x coord
     * @param y y coord
     * @param z z coord
     * @param dimension dimension
     * @param soundName sound name
     * @param radius radius in blocks, 16 by default
     * @param volume value from 0 to 1
     * @param pitch value from 0 to 1
     */
    function playSoundAt(x: number, y: number, z: number, dimension: number, soundName: string, radius?: number, volume?: number, pitch?: number): void;
    /**
     * Plays sound at entity coords and dimension
     * @param entity entity id
     * @param soundName sound name
     * @param radius radius in blocks, 16 by default
     * @param volume value from 0 to 1
     * @param pitch value from 0 to 1
     */
    function playSoundAtEntity(entity: number, soundName: string, radius?: number, volume?: number, pitch?: number): void;
    /**
     * Plays sound at center of the block
     * @param coords block coords
     * @param dimension dimension
     * @param soundName sound name
     * @param radius radius in blocks, 16 by default
     * @param volume value from 0 to 1
     * @param pitch value from 0 to 1
     */
    function playSoundAtBlock(coords: Vector, dimension: number, soundName: string, radius?: number, volume?: number, pitch?: number): void;
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
     * @param sound sound name
     * @param looping true if sound is looped, false otherwise
     * @param volume value from 0 to 1
     * @param radius the radius where the sound is heard
     * @returns SoundStream object or null.
     */
    play(soundName: string, looping?: boolean, volume?: number, radius?: number, relativePosition?: Vector): Nullable<SoundStream>;
    /**
     * Start playing sound from this source if it's not started.
     * @param sound sound name
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
    onUpdate(): void;
    update: () => void;
    unload(): void;
    getAbsolutePosition(relativeCoords: Vector): Vector;
    protected playSound(position: Vector, sound: Sound, looping: boolean, volume: number, radius: number): number;
    protected updateStreams(): void;
    protected updateVolume(): void;
}
declare class AudioSourceEntityClient extends AudioSourceClient {
    entity: number;
    constructor(entity: number);
    onUpdate(): void;
    protected updateVolume(): void;
}
