var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
LIBRARY({
    name: "SoundLib",
    version: 3,
    shared: false,
    api: "CoreEngine"
});
var IS_OLD = getMCPEVersion().main === 28;
var SoundLib;
(function (SoundLib) {
    var Registry;
    (function (Registry) {
        Registry.resourcePath = __dir__;
        Registry.soundData = {};
        /**
         * Path to your resources folder
         * @param path must end with "/"
         */
        function setBasePath(path) {
            Registry.resourcePath = path;
        }
        Registry.setBasePath = setBasePath;
        /**
         * Registers sound.
         * @param name sound string identifier
         * @param filePath file path
         */
        function registerSound(name, filePath) {
            Registry.soundData[name] = new Sound(name, Registry.resourcePath + filePath);
        }
        Registry.registerSound = registerSound;
        /**
         * Registers multiple sounds for the same string id.
         * @param name string id that can be used to play one of the folowing sounds randomly
         * @param filePaths file paths array
         */
        function registerMultiSound(name, filePaths) {
            var soundIds = [];
            for (var i = 0; i < filePaths.length; i++) {
                var soundId = "".concat(name, ":").concat(i);
                Registry.soundData[soundId] = new Sound(soundId, Registry.resourcePath + filePaths[i]);
                soundIds.push(soundId);
            }
            Registry.soundData[name] = new MultiSound(name, soundIds);
        }
        Registry.registerMultiSound = registerMultiSound;
        /**
         * @param name sound name
         * @returns returns sound by its name or random sound if multi-sound id provided
         */
        function getSound(name) {
            var sound = Registry.soundData[name];
            if (!sound) {
                Logger.Log("Cannot find sound: ".concat(name), "ERROR");
                return null;
            }
            if (sound instanceof MultiSound) {
                return getSound(sound.getRandomSoundId());
            }
            return sound;
        }
        Registry.getSound = getSound;
        /**
         * @internal Returns all registered sounds
         */
        function getAllSounds() {
            return Object.values(Registry.soundData).filter(function (s) { return s instanceof Sound; });
        }
        Registry.getAllSounds = getAllSounds;
    })(Registry = SoundLib.Registry || (SoundLib.Registry = {}));
})(SoundLib || (SoundLib = {}));
/**
 * Class for wrapping SoundPool object and provide client-side methods to play sounds
 */
var SoundManagerClient = /** @class */ (function () {
    function SoundManagerClient(maxStreamsCount, globalVolume) {
        this.settingsFolder = IS_OLD ? "Horizon" : "com.mojang";
        this.settingsPath = "/storage/emulated/0/games/".concat(this.settingsFolder, "/minecraftpe/options.txt");
        this.maxStreams = 0;
        this.soundPool = new android.media.SoundPool.Builder().setMaxStreams(maxStreamsCount).build();
        this.maxStreams = maxStreamsCount;
        this.globalVolume = globalVolume;
        this.readSettings();
    }
    SoundManagerClient.prototype.readSettings = function () {
        var options = FileTools.ReadKeyValueFile(this.settingsPath);
        var mainVolume = IS_OLD ? 1 : parseFloat(options["audio_main"]);
        this.soundVolume = mainVolume * parseFloat(options["audio_sound"]);
        this.musicVolume = mainVolume * parseFloat(options["audio_music"]);
    };
    SoundManagerClient.prototype.getSoundVolume = function () {
        return this.globalVolume * this.soundVolume;
    };
    SoundManagerClient.prototype.getMusicVolume = function () {
        return this.globalVolume * this.musicVolume;
    };
    SoundManagerClient.prototype.loadSounds = function (sounds) {
        var e_1, _a;
        var startTime = Debug.sysTime();
        try {
            for (var sounds_1 = __values(sounds), sounds_1_1 = sounds_1.next(); !sounds_1_1.done; sounds_1_1 = sounds_1.next()) {
                var sound = sounds_1_1.value;
                sound.load(this.soundPool);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (sounds_1_1 && !sounds_1_1.done && (_a = sounds_1.return)) _a.call(sounds_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var loadTime = Debug.sysTime() - startTime;
        Logger.Log("Loaded sounds in ".concat(loadTime, " ms"), "SoundLib");
    };
    /**
     * Starts playing sound and returns its streamId or 0 if failes to play sound.
     * @param sound sound name or object
     * @param looping true if sound is looped, false otherwise
     * @param volume value from 0 to 1
     * @param pitch value from 0 to 1
     * @returns stream id
     */
    SoundManagerClient.prototype.playSound = function (sound, looping, volume, pitch) {
        if (looping === void 0) { looping = false; }
        if (volume === void 0) { volume = 1; }
        if (pitch === void 0) { pitch = 1; }
        if (typeof sound === "string") {
            sound = SoundLib.Registry.getSound(sound);
        }
        if (!sound || !sound.isLoaded()) {
            Logger.Log("Attempted to play not loaded sound ".concat(sound.name), "ERROR");
            return 0;
        }
        volume *= this.getSoundVolume();
        var startTime = Debug.sysTime();
        var streamId = this.soundPool.play(sound.internalId, volume, volume, 0, looping ? -1 : 0, pitch);
        if (streamId != 0) {
            this.soundPool.setPriority(streamId, 1);
            if (Game.isDeveloperMode) {
                Debug.m("Playing sound ".concat(sound.name, " - id: ").concat(streamId, ", volume: ").concat(volume, " (took ").concat(Debug.sysTime() - startTime, " ms)"));
            }
        }
        else if (Game.isDeveloperMode) {
            Debug.m("Failed to play sound ".concat(sound.name, ", volume: ").concat(volume));
        }
        return streamId;
    };
    SoundManagerClient.prototype.playSoundAt = function (x, y, z, sound, looping, volume, pitch, radius) {
        if (looping === void 0) { looping = false; }
        if (volume === void 0) { volume = 1; }
        if (pitch === void 0) { pitch = 1; }
        if (radius === void 0) { radius = 16; }
        var p = Player.getPosition();
        var distance = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2) + Math.pow(z - p.z, 2));
        if (distance >= radius) {
            return 0;
        }
        volume *= 1 - distance / radius;
        return this.playSound(sound, looping, volume, pitch);
        ;
    };
    SoundManagerClient.prototype.setVolume = function (streamID, leftVolume, rightVolume) {
        if (rightVolume === void 0) { rightVolume = leftVolume; }
        var soundVolume = this.getSoundVolume();
        this.soundPool.setVolume(streamID, leftVolume * soundVolume, rightVolume * soundVolume);
    };
    SoundManagerClient.prototype.stop = function (streamID) {
        this.soundPool.stop(streamID);
    };
    SoundManagerClient.prototype.setLooping = function (streamID, looping) {
        this.soundPool.setLoop(streamID, looping ? -1 : 0);
    };
    SoundManagerClient.prototype.pause = function (streamID) {
        this.soundPool.pause(streamID);
    };
    SoundManagerClient.prototype.resume = function (streamID) {
        this.soundPool.resume(streamID);
    };
    SoundManagerClient.prototype.stopAll = function () {
        this.soundPool.autoPause();
    };
    SoundManagerClient.prototype.pauseAll = function () {
        this.soundPool.autoPause();
    };
    SoundManagerClient.prototype.resumeAll = function () {
        this.soundPool.autoResume();
    };
    SoundManagerClient.prototype.release = function () {
        this.soundPool.release();
    };
    return SoundManagerClient;
}());
/// <reference path="./SoundManagerClient.ts" />
var SoundLib;
(function (SoundLib) {
    var _client;
    /**
     * @returns SoundManagerClient if it was initialized or null
     */
    function getClient() {
        return _client;
    }
    SoundLib.getClient = getClient;
    /**
     * Initializes client side code if the current instance of game is not a dedicated server
     * @param maxStreamsCount max count of concurrently playing streams
     * @param globalVolume volume modifier for all sounds
     */
    function initClient(maxStreamsCount, globalVolume) {
        if (globalVolume === void 0) { globalVolume = 1; }
        if (!Game.isDedicatedServer || !Game.isDedicatedServer()) {
            _client = new SoundManagerClient(maxStreamsCount, globalVolume);
            _client.loadSounds(SoundLib.Registry.getAllSounds());
        }
    }
    SoundLib.initClient = initClient;
    function playSoundAt(x, y, z, dimension, soundName, volume, pitch, radius) {
        if (typeof x == "object") {
            var coords = x;
            return playSoundAt(coords.x, coords.y, coords.z, y, z, dimension, soundName, volume);
        }
        var sound = SoundLib.Registry.getSound(soundName);
        if (!sound)
            return;
        radius !== null && radius !== void 0 ? radius : (radius = 16);
        sendPacketInRadius({ x: x, y: y, z: z }, dimension, radius, "SoundManager.play_sound", {
            x: x,
            y: y,
            z: z,
            name: sound.name,
            volume: volume !== null && volume !== void 0 ? volume : 1,
            pitch: pitch !== null && pitch !== void 0 ? pitch : 1,
            radius: radius
        });
    }
    SoundLib.playSoundAt = playSoundAt;
    /**
     * Plays sound at entity coords and dimension
     * @param entity entity id
     * @param soundName sound name
     * @param volume value from 0 to 1
     * @param pitch value from 0 to 1
     * @param radius radius in blocks, 16 by default
     */
    function playSoundAtEntity(entity, soundName, volume, pitch, radius) {
        var pos = Entity.getPosition(entity);
        var dimension = Entity.getDimension(entity);
        return playSoundAt(pos.x, pos.y, pos.z, dimension, soundName, volume, pitch, radius);
    }
    SoundLib.playSoundAtEntity = playSoundAtEntity;
    /**
     * Plays sound at center of the block
     * @param coords block coords
     * @param dimension dimension
     * @param soundName sound name
     * @param volume value from 0 to 1
     * @param pitch value from 0 to 1
     * @param radius radius in blocks, 16 by default
     */
    function playSoundAtBlock(coords, dimension, soundName, volume, pitch, radius) {
        return playSoundAt(coords.x + .5, coords.y + .5, coords.z + .5, dimension, soundName, volume, pitch, radius);
    }
    SoundLib.playSoundAtBlock = playSoundAtBlock;
    /**
     * Sends network packet for players within a radius from specified coords.
     * @param coords coordinates from which players will be searched
     * @param radius radius within which players will receive packet
     * @param packetName name of the packet to send
     * @param data packet data object
     */
    function sendPacketInRadius(coords, dimension, radius, packetName, data) {
        var e_2, _a;
        var clientsList = Network.getConnectedClients();
        try {
            for (var _b = __values(clientsList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var client = _c.value;
                var player = client.getPlayerUid();
                var entPos = Entity.getPosition(player);
                if (Entity.getDimension(player) == dimension && Entity.getDistanceBetweenCoords(entPos, coords) <= radius) {
                    client.send(packetName, data);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    Callback.addCallback("MinecraftActivityStopped", function () {
        _client === null || _client === void 0 ? void 0 : _client.stopAll();
    });
    Callback.addCallback("LocalLevelLeft", function () {
        _client === null || _client === void 0 ? void 0 : _client.stopAll();
    });
    /*Volume in the settings*/
    var prevScreen = false;
    Callback.addCallback("NativeGuiChanged", function (screenName) {
        // TODO: check audio settings screen
        var currentScreen = screenName.includes("controls_and_settings");
        if (prevScreen && !currentScreen && _client) {
            _client.readSettings();
        }
        prevScreen = currentScreen;
    });
    Network.addClientPacket("SoundManager.play_sound", function (data) {
        _client === null || _client === void 0 ? void 0 : _client.playSoundAt(data.x, data.y, data.z, data.name, false, data.volume, data.pitch, data.radius);
    });
})(SoundLib || (SoundLib = {}));
var Sound = /** @class */ (function () {
    /**
     * @param name sound name id
     * @param path file path
     */
    function Sound(name, path) {
        this.name = name;
        this.path = path;
    }
    Sound.prototype.load = function (soundPool) {
        this.internalId = soundPool.load(this.path, 1);
    };
    Sound.prototype.isLoaded = function () {
        return !!this.internalId;
    };
    Sound.prototype.getDuration = function () {
        if (!this.duration) {
            var mmr = new android.media.MediaMetadataRetriever();
            mmr.setDataSource(this.path);
            var durationStr = mmr.extractMetadata(android.media.MediaMetadataRetriever.METADATA_KEY_DURATION);
            var duration = parseInt(durationStr);
            this.duration = duration - duration % 50;
            Logger.Log("Sound ".concat(this.name, ": duration ").concat(this.duration, " ms"), "DEBUG");
        }
        return this.duration;
    };
    return Sound;
}());
/// <reference path="./Sound.ts" />
var MultiSound = /** @class */ (function () {
    function MultiSound(name, sounds) {
        this.name = name;
        this.sounds = sounds;
    }
    MultiSound.prototype.getRandomSoundId = function () {
        var randomIdx = Math.floor(Math.random() * this.sounds.length);
        return this.sounds[randomIdx];
    };
    return MultiSound;
}());
var SoundStreamState;
(function (SoundStreamState) {
    SoundStreamState[SoundStreamState["Idle"] = 0] = "Idle";
    SoundStreamState[SoundStreamState["Started"] = 1] = "Started";
    SoundStreamState[SoundStreamState["Paused"] = 2] = "Paused";
    SoundStreamState[SoundStreamState["Stopped"] = 3] = "Stopped";
})(SoundStreamState || (SoundStreamState = {}));
var SoundStream = /** @class */ (function () {
    function SoundStream(sound, streamId, looping, volume, radius, relativePosition) {
        this.sound = sound;
        this.streamId = streamId;
        this.looping = looping;
        this.volume = volume;
        this.radius = radius;
        this.relativePosition = relativePosition;
        this.name = sound.name;
        this.setStreamId(streamId);
        this._soundClient = SoundLib.getClient();
    }
    SoundStream.prototype.setOnCompleteEvent = function (event) {
        this.onCompleteEvent = event;
    };
    SoundStream.prototype.onComplete = function (source) {
        this.state = SoundStreamState.Stopped;
        if (this.onCompleteEvent) {
            this._soundClient.stop(this.streamId);
            this.onCompleteEvent(source, this);
        }
    };
    SoundStream.prototype.setStreamId = function (streamId) {
        this.streamId = streamId;
        if (streamId != 0) {
            this.state = SoundStreamState.Started;
            this.startTime = Debug.sysTime();
        }
        else {
            this.state = SoundStreamState.Idle;
        }
    };
    SoundStream.prototype.reset = function () {
        this._soundClient.stop(this.streamId);
        this.state = SoundStreamState.Idle;
    };
    SoundStream.prototype.stop = function () {
        this._soundClient.stop(this.streamId);
        this.state = SoundStreamState.Stopped;
    };
    SoundStream.prototype.pause = function () {
        this._soundClient.pause(this.streamId);
        this.state = SoundStreamState.Paused;
    };
    SoundStream.prototype.resume = function () {
        this._soundClient.resume(this.streamId);
        this.state = SoundStreamState.Started;
    };
    SoundStream.prototype.updateVolume = function (volumeMod) {
        this._soundClient.setVolume(this.streamId, this.volume * volumeMod);
    };
    SoundStream.prototype.getDuration = function () {
        if (!this.startTime)
            return 0;
        return Debug.sysTime() - this.startTime;
    };
    SoundStream.prototype.isPlaying = function () {
        return this.state === SoundStreamState.Started;
    };
    return SoundStream;
}());
/// <reference path="./SoundStream.ts" />
/**
 * Client side audio source.
 */
var AudioSourceClient = /** @class */ (function () {
    function AudioSourceClient(position) {
        var _this = this;
        this.remove = false;
        this.streams = [];
        // Horrible legacy
        this.update = function () {
            _this.onUpdate();
        };
        this.position = position;
    }
    /**
     * Updates source position.
     * @param x x coord
     * @param y y coord
     * @param z z coord
     */
    AudioSourceClient.prototype.setPosition = function (x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    };
    /**
     * Plays sound from this source.
     * If the sound cannot be played and its looped it creates SoundStream object in a pending state,
     * otherwise it is just skipped.
     * @param sound sound name
     * @param looping true if sound is looped, false otherwise
     * @param volume value from 0 to 1
     * @param radius the radius where the sound is heard
     * @returns SoundStream object or null.
     */
    AudioSourceClient.prototype.play = function (soundName, looping, volume, radius, relativePosition) {
        if (looping === void 0) { looping = false; }
        if (volume === void 0) { volume = 1; }
        if (radius === void 0) { radius = 16; }
        var sound = SoundLib.Registry.getSound(soundName);
        if (!sound) {
            return null;
        }
        var sourcePos = relativePosition ? this.getAbsolutePosition(relativePosition) : this.position;
        var streamId = this.playSound(sourcePos, sound, looping, volume, radius);
        if (streamId != 0 || looping) {
            var stream = new SoundStream(sound, streamId, looping, volume, radius, relativePosition);
            this.streams.push(stream);
            return stream;
        }
        return null;
    };
    /**
     * Start playing sound from this source if it's not started.
     * @param sound sound name
     * @param looping true if sound is looped, false otherwise
     * @param volume value from 0 to 1
     * @param radius the radius where the sound is heard
     * @returns SoundStream object or null.
     */
    AudioSourceClient.prototype.playSingle = function (soundName, looping, volume, radius, relativePosition) {
        if (!this.getStream(soundName)) {
            this.play(soundName, looping, volume, radius, relativePosition);
        }
    };
    /**
     * Finds stream by sound name
     * @param soundName sound name
     * @returns sound stream or null
     */
    AudioSourceClient.prototype.getStream = function (soundName) {
        return this.streams.find(function (s) { return s.name == soundName; }) || null;
    };
    /**
     * Сhecks if the given sound is playing
     * @param soundName sound name
     */
    AudioSourceClient.prototype.isPlaying = function (soundName) {
        var stream = this.getStream(soundName);
        return stream && stream.isPlaying();
    };
    /**
     * Stops playing sound by name
     * @param soundName sound name
     * @returns true if the sound was found, false otherwise
     */
    AudioSourceClient.prototype.stop = function (soundName) {
        var stream = this.streams.find(function (s) { return s.name == soundName && s.state != SoundStreamState.Stopped; });
        if (stream) {
            stream.stop();
            return true;
        }
        return false;
    };
    /**
     * Stops all streams
     */
    AudioSourceClient.prototype.stopAll = function () {
        var e_3, _a;
        try {
            for (var _b = __values(this.streams), _c = _b.next(); !_c.done; _c = _b.next()) {
                var stream = _c.value;
                stream.stop();
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.streams.length = 0;
    };
    /**
     * Pause all streams
     */
    AudioSourceClient.prototype.pauseAll = function () {
        var e_4, _a;
        try {
            for (var _b = __values(this.streams), _c = _b.next(); !_c.done; _c = _b.next()) {
                var stream = _c.value;
                stream.pause();
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    /**
     * Resumes all streams
     */
    AudioSourceClient.prototype.resumeAll = function () {
        var e_5, _a;
        try {
            for (var _b = __values(this.streams), _c = _b.next(); !_c.done; _c = _b.next()) {
                var stream = _c.value;
                stream.resume();
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    /**
     * Sets sound volume by name
     * @param soundName sound name
     * @param volume volume
     */
    AudioSourceClient.prototype.setVolume = function (soundName, volume) {
        var stream = this.getStream(soundName);
        if (stream) {
            stream.volume = volume;
        }
    };
    AudioSourceClient.prototype.onUpdate = function () {
        this.updateStreams();
        this.updateVolume();
    };
    AudioSourceClient.prototype.unload = function () {
        this.stopAll();
        this.remove = true;
    };
    AudioSourceClient.prototype.getAbsolutePosition = function (relativeCoords) {
        return {
            x: this.position.x + relativeCoords.x,
            y: this.position.y + relativeCoords.y,
            z: this.position.z + relativeCoords.z
        };
    };
    AudioSourceClient.prototype.playSound = function (position, sound, looping, volume, radius) {
        var streamId = SoundLib.getClient().playSoundAt(position.x, position.y, position.z, sound, looping, volume, 1, radius);
        return streamId;
    };
    AudioSourceClient.prototype.updateStreams = function () {
        for (var i = 0; i < this.streams.length; i++) {
            var stream = this.streams[i];
            if (stream.state == SoundStreamState.Stopped) {
                this.streams.splice(i--, 1);
            }
            else if (!stream.looping && stream.sound.getDuration() <= stream.getDuration()) {
                this.streams.splice(i--, 1);
                stream.onComplete(this);
            }
        }
    };
    AudioSourceClient.prototype.updateVolume = function () {
        var e_6, _a;
        var playerPos = Player.getPosition();
        try {
            for (var _b = __values(this.streams), _c = _b.next(); !_c.done; _c = _b.next()) {
                var stream = _c.value;
                var sourcePos = stream.relativePosition ? this.getAbsolutePosition(stream.relativePosition) : this.position;
                var distance = Entity.getDistanceBetweenCoords(sourcePos, playerPos);
                if (stream.looping && distance >= stream.radius) {
                    if (stream.isPlaying()) {
                        stream.reset();
                    }
                }
                else {
                    var volumeMod = Math.max(0, 1 - distance / stream.radius);
                    if (stream.state == SoundStreamState.Idle) {
                        var streamId = this.playSound(sourcePos, stream.sound, stream.looping, stream.volume * volumeMod, stream.radius);
                        if (streamId != 0) {
                            stream.setStreamId(streamId);
                        }
                    }
                    else {
                        stream.updateVolume(volumeMod);
                    }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    return AudioSourceClient;
}());
var AudioSourceEntityClient = /** @class */ (function (_super) {
    __extends(AudioSourceEntityClient, _super);
    function AudioSourceEntityClient(entity) {
        var _this = _super.call(this, Entity.getPosition(entity)) || this;
        _this.entity = entity;
        _this.entity = entity;
        return _this;
    }
    AudioSourceEntityClient.prototype.onUpdate = function () {
        if (Entity.isExist(this.entity)) {
            this.position = Entity.getPosition(this.entity);
        }
        _super.prototype.onUpdate.call(this);
    };
    AudioSourceEntityClient.prototype.updateVolume = function () {
        if (this.entity != Player.get()) {
            _super.prototype.updateVolume.call(this);
        }
    };
    return AudioSourceEntityClient;
}(AudioSourceClient));
/// <reference path="./AudioSource/AudioSourceEntityClient.ts" />
EXPORT("SoundLib", SoundLib);
EXPORT("SoundStream", SoundStream);
EXPORT("AudioSourceClient", AudioSourceClient);
EXPORT("AudioSourceEntityClient", AudioSourceEntityClient);
