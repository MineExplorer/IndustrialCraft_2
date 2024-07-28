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
LIBRARY({
    name: "SoundLib",
    version: 3,
    shared: false,
    api: "CoreEngine"
});
var IS_OLD = getMCPEVersion().main === 28;
var SoundManager;
(function (SoundManager) {
    var settings_folder = IS_OLD ? "Horizon" : "com.mojang";
    var settings_path = "/storage/emulated/0/games/".concat(settings_folder, "/minecraftpe/options.txt");
    SoundManager.maxStreams = 0;
    SoundManager.playingStreams = [];
    SoundManager.resourcePath = "";
    SoundManager.soundData = {};
    SoundManager.audioSources = [];
    SoundManager.soundStreams = [];
    function readSettings() {
        var options = FileTools.ReadKeyValueFile(settings_path);
        var mainVolume = IS_OLD ? 1 : parseFloat(options["audio_main"]);
        SoundManager.soundVolume = mainVolume * parseFloat(options["audio_sound"]);
        SoundManager.musicVolume = mainVolume * parseFloat(options["audio_music"]);
    }
    SoundManager.readSettings = readSettings;
    function init(maxStreamsCount) {
        SoundManager.soundPool = new android.media.SoundPool.Builder().setMaxStreams(maxStreamsCount).build();
        SoundManager.maxStreams = maxStreamsCount;
        readSettings();
    }
    SoundManager.init = init;
    function setResourcePath(path) {
        SoundManager.resourcePath = path;
    }
    SoundManager.setResourcePath = setResourcePath;
    function registerSound(soundName, path, looping) {
        if (looping === void 0) { looping = false; }
        var sounds;
        if (Array.isArray(path)) {
            sounds = [];
            for (var i in path) {
                var soundPath = SoundManager.resourcePath + path[i];
                sounds.push(new Sound(soundName, SoundManager.soundPool, soundPath, looping));
            }
        }
        else {
            var soundPath = SoundManager.resourcePath + path;
            sounds = new Sound(soundName, SoundManager.soundPool, soundPath, looping);
        }
        SoundManager.soundData[soundName] = sounds;
    }
    SoundManager.registerSound = registerSound;
    function getSound(soundName) {
        var sound = SoundManager.soundData[soundName];
        if (Array.isArray(sound)) {
            return sound[Math.floor(Math.random() * sound.length)];
        }
        return sound;
    }
    SoundManager.getSound = getSound;
    /**
     * Starts playing sound and returns its streamId.
     * @param soundName
     * @param loop
     * @param volume
     * @param pitch
     * @returns
     */
    function playSound(soundName, loop, volume, pitch) {
        if (loop === void 0) { loop = false; }
        if (volume === void 0) { volume = 1; }
        if (pitch === void 0) { pitch = 1; }
        var sound;
        if (typeof soundName == "string") {
            sound = getSound(soundName);
            if (!sound) {
                Logger.Log("Cannot find sound: " + soundName, "ERROR");
                return 0;
            }
        }
        else {
            sound = soundName;
        }
        if (SoundManager.playingStreams.length >= SoundManager.maxStreams)
            return 0;
        volume *= SoundManager.soundVolume;
        var streamID = SoundManager.soundPool.play(sound.id, volume, volume, 0, loop ? -1 : 0, pitch);
        if (streamID != 0) {
            SoundManager.soundPool.setPriority(streamID, 1);
            if (Game.isDeveloperMode) {
                Game.message(streamID + " - " + sound.name + ", volume: " + volume);
            }
            if (loop) {
                SoundManager.playingStreams.push(streamID);
            }
        }
        return streamID;
    }
    SoundManager.playSound = playSound;
    function playSoundAt(x, y, z, soundName, loop, volume, pitch, radius) {
        if (loop === void 0) { loop = false; }
        if (volume === void 0) { volume = 1; }
        if (pitch === void 0) { pitch = 1; }
        if (radius === void 0) { radius = 16; }
        var p = Player.getPosition();
        var distance = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2) + Math.pow(z - p.z, 2));
        if (distance >= radius)
            return 0;
        volume *= 1 - distance / radius;
        var streamID = playSound(soundName, loop, volume, pitch);
        return streamID;
    }
    SoundManager.playSoundAt = playSoundAt;
    function playSoundAtEntity(entity, soundName, volume, pitch, radius) {
        if (radius === void 0) { radius = 16; }
        var pos = Entity.getPosition(entity);
        return playSoundAt(pos.x, pos.y, pos.z, soundName, false, volume, pitch, radius);
    }
    SoundManager.playSoundAtEntity = playSoundAtEntity;
    function playSoundAtBlock(tile, soundName, loop, volume, radius) {
        if (loop === void 0) { loop = false; }
        if (radius === void 0) { radius = 16; }
        if (tile.dimension != undefined && tile.dimension != Player.getDimension())
            return 0;
        return playSoundAt(tile.x + .5, tile.y + .5, tile.z + .5, soundName, loop, volume, 1, radius);
    }
    SoundManager.playSoundAtBlock = playSoundAtBlock;
    function createSource(sourceType, source, soundName, volume, radius) {
        if (sourceType == SourceType.ENTITY && typeof source != "number") {
            Logger.Log("Invalid source type " + typeof source + "for AudioSource.ENTITY", "ERROR");
            return null;
        }
        if (sourceType == SourceType.TILEENTITY && typeof source != "object") {
            Logger.Log("Invalid source type " + typeof source + "for AudioSource.TILEENTITY", "ERROR");
            return null;
        } /*
        let soundID = getSoundID(soundName);
        if (!soundID) {
            Logger.Log("Cannot find sound: "+ soundName, "ERROR");
            return null;
        }*/
        var audioSource = new AudioSource(sourceType, source, soundName, volume, radius);
        SoundManager.audioSources.push(audioSource);
        return audioSource;
    }
    SoundManager.createSource = createSource;
    function getSource(source, soundName) {
        for (var i in SoundManager.audioSources) {
            var audio = SoundManager.audioSources[i];
            if (audio.source == source && (!soundName || audio.soundName == soundName))
                return audio;
        }
        return null;
    }
    SoundManager.getSource = getSource;
    function getAllSources(source, soundName) {
        var sources = [];
        for (var i in SoundManager.audioSources) {
            var audio = SoundManager.audioSources[i];
            if (audio.source == source && (!soundName || audio.soundName == soundName))
                sources.push(audio);
        }
        return sources;
    }
    SoundManager.getAllSources = getAllSources;
    function removeSource(audioSource) {
        audioSource.remove = true;
    }
    SoundManager.removeSource = removeSource;
    function startPlaySound(sourceType, source, soundName, volume, radius) {
        var audioSource = getSource(source, soundName);
        if (audioSource) {
            return audioSource;
        }
        return createSource(sourceType, source, soundName, volume, radius);
    }
    SoundManager.startPlaySound = startPlaySound;
    function stopPlaySound(source, soundName) {
        for (var i in SoundManager.audioSources) {
            var audio = SoundManager.audioSources[i];
            if (audio.source == source && (!soundName || audio.soundName == soundName)) {
                audio.remove = true;
                return true;
            }
        }
        return false;
    }
    SoundManager.stopPlaySound = stopPlaySound;
    function setVolume(streamID, leftVolume, rightVolume) {
        if (rightVolume === void 0) { rightVolume = leftVolume; }
        SoundManager.soundPool.setVolume(streamID, leftVolume * SoundManager.soundVolume, rightVolume * SoundManager.soundVolume);
    }
    SoundManager.setVolume = setVolume;
    function stop(streamID) {
        SoundManager.soundPool.stop(streamID);
        var index = SoundManager.playingStreams.indexOf(streamID);
        if (index != -1) {
            SoundManager.playingStreams.splice(index, 1);
        }
    }
    SoundManager.stop = stop;
    function pause(streamID) {
        SoundManager.soundPool.pause(streamID);
    }
    SoundManager.pause = pause;
    function resume(streamID) {
        SoundManager.soundPool.resume(streamID);
    }
    SoundManager.resume = resume;
    function stopAll() {
        SoundManager.soundPool.autoPause();
        SoundManager.audioSources.splice(0);
        SoundManager.playingStreams.length = 0;
    }
    SoundManager.stopAll = stopAll;
    function autoPause() {
        SoundManager.soundPool.autoPause();
    }
    SoundManager.autoPause = autoPause;
    function autoResume() {
        SoundManager.soundPool.autoResume();
    }
    SoundManager.autoResume = autoResume;
    function release() {
        SoundManager.soundPool.release();
    }
    SoundManager.release = release;
    function tick() {
        for (var i = 0; i < SoundManager.audioSources.length; i++) {
            var audio = SoundManager.audioSources[i];
            if (audio.remove || audio.sourceType == SourceType.TILEENTITY && audio.source.remove) {
                audio.stop();
                SoundManager.audioSources.splice(i, 1);
                i--;
                continue;
            }
            if (!audio.sound.looping && Debug.sysTime() - audio.startTime >= audio.sound.getDuration()) {
                if (audio.nextSound) {
                    audio.playNextSound();
                }
                else {
                    audio.stop();
                    SoundManager.audioSources.splice(i, 1);
                    i--;
                    continue;
                }
            }
            // TODO:
            // check dimension
            if (audio.sourceType == SourceType.ENTITY && Entity.isExist(audio.source)) {
                audio.position = Entity.getPosition(audio.source);
            }
            if (!audio.isPlaying && audio.sound.looping && SoundManager.playingStreams.length < SoundManager.maxStreams) {
                //Game.message("Start play audio: "+audio.soundName);
                audio.play();
            }
            if (audio.isPlaying) {
                audio.updateVolume();
            }
        }
    }
    SoundManager.tick = tick;
    Callback.addCallback("LocalTick", function () {
        SoundManager.tick();
    });
    Callback.addCallback("MinecraftActivityStopped", function () {
        SoundManager.stopAll();
    });
    Callback.addCallback("LevelLeft", function () {
        SoundManager.stopAll();
    });
    /*Volume in the settings*/
    var prevScreen = false;
    Callback.addCallback("NativeGuiChanged", function (screenName) {
        // TODO: check audio settings screen
        var currentScreen = screenName.includes("controls_and_settings");
        if (prevScreen && !currentScreen) {
            readSettings();
        }
        prevScreen = currentScreen;
    });
})(SoundManager || (SoundManager = {}));
var Sound = /** @class */ (function () {
    function Sound(name, soundPool, path, looping) {
        this.name = name;
        this.soundPool = soundPool;
        this.path = path;
        this.looping = looping;
        this.id = soundPool.load(path, 1);
    }
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
var SoundSequence = /** @class */ (function () {
    function SoundSequence() {
        this.looping = false;
    }
    return SoundSequence;
}());
/// <reference path="IAudioSource.ts" />
var AmbientSound = /** @class */ (function () {
    function AmbientSound(soundName, volume, radius) {
        this.isPlaying = false;
        this.soundName = soundName;
        this.volume = volume;
        this.radius = radius;
    }
    return AmbientSound;
}());
/**
 * Class for playing sound from tile entity.
 */
var TileEntityAudioSource = /** @class */ (function () {
    function TileEntityAudioSource(tileEntity) {
        this.isPlaying = true;
        this.remove = false;
        this.sounds = [];
        this.networkVisibilityDistance = 128;
        this.source = tileEntity;
        this.position = {
            x: tileEntity.x + .5,
            y: tileEntity.y + .5,
            z: tileEntity.z + .5
        };
        this.dimension = tileEntity.dimension;
        this.networkEntity = new NetworkEntity(AudioSourceNetworkType, this);
    }
    TileEntityAudioSource.prototype.play = function (soundName, looping, volume, radius) {
        if (looping === void 0) { looping = false; }
        if (volume === void 0) { volume = 1; }
        if (radius === void 0) { radius = 16; }
        Debug.m("[Server] Play sound ".concat(soundName, ", ").concat(looping, ", ").concat(volume, ", ").concat(radius));
        if (looping) {
            var sound = new AmbientSound(soundName, volume, radius);
            this.sounds.push(sound);
        }
        this.networkEntity.send("play", {
            soundName: soundName,
            looping: looping,
            volume: volume,
            radius: radius
        });
    };
    TileEntityAudioSource.prototype.stop = function (soundName) {
        this.networkEntity.send("stop", {
            soundName: soundName
        });
    };
    TileEntityAudioSource.prototype.pause = function () {
        this.isPlaying = false;
        // TODO
    };
    TileEntityAudioSource.prototype.resume = function () {
        this.isPlaying = true;
        // TODO
    };
    return TileEntityAudioSource;
}());
var SoundPacket = /** @class */ (function () {
    function SoundPacket(pos, sounds) {
        this.x = pos.x;
        this.y = pos.y;
        this.z = pos.z;
        this.sounds = sounds.map(function (s) { return ({ name: s.soundName, v: s.volume, r: s.radius }); });
    }
    return SoundPacket;
}());
var AudioSourceNetworkType = new NetworkEntityType("soundlib.audiosource")
    .setClientListSetupListener(function (list, target, entity) {
    var _a = target.position, x = _a.x, y = _a.y, z = _a.z;
    list.setupDistancePolicy(x, y, z, target.dimension, target.networkVisibilityDistance || 128);
})
    .setClientEntityAddedListener(function (entity, packet) {
    var e_1, _a;
    var client = new AudioSourceClient({
        x: packet.x,
        y: packet.y,
        z: packet.z
    });
    try {
        for (var _b = __values(packet.sounds), _c = _b.next(); !_c.done; _c = _b.next()) {
            var sound = _c.value;
            client.play(sound.name, true, sound.v, sound.r);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // add as local updatable
    Updatable.addLocalUpdatable(client);
    return client;
})
    .setClientEntityRemovedListener(function (target, entity) {
    target.unload();
    target.remove = true;
})
    .setClientAddPacketFactory(function (target, entity, client) {
    return new SoundPacket(target.position, target.sounds);
})
    .addClientPacketListener("play", function (target, entity, packetData) {
    target.play(packetData.soundName, packetData.looping, packetData.volume, packetData.radius);
})
    .addClientPacketListener("stop", function (target, entity, packetData) {
    target.stop(packetData.soundName);
})
    .addClientPacketListener("setVolume", function (target, entity, packetData) {
    target.setVolume(packetData.soundName, packetData.volume);
});
/// <reference path="AudioSourceNetworkType.ts" />
var SourceType;
(function (SourceType) {
    SourceType[SourceType["ENTITY"] = 0] = "ENTITY";
    SourceType[SourceType["TILEENTITY"] = 1] = "TILEENTITY";
})(SourceType || (SourceType = {}));
var AudioSource = /** @class */ (function () {
    function AudioSource(sourceType, source, soundName, volume, radius) {
        if (volume === void 0) { volume = 1; }
        if (radius === void 0) { radius = 16; }
        this.nextSound = "";
        this.streamID = 0;
        this.isPlaying = false;
        this.startTime = 0;
        this.remove = false;
        this.soundName = soundName;
        this.source = source;
        this.sourceType = sourceType;
        if (sourceType === SourceType.ENTITY) {
            this.position = Entity.getPosition(source);
            this.dimension = Entity.getDimension(source);
        }
        else if (sourceType === SourceType.TILEENTITY) {
            this.position = { x: source.x + .5, y: source.y + .5, z: source.z + .5 };
            this.dimension = source.dimension;
        }
        this.radius = radius;
        this.volume = volume;
        this.sound = SoundManager.getSound(soundName);
        this.startTime = Debug.sysTime();
        this.play();
    }
    AudioSource.prototype.setPosition = function (x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        this.updateVolume();
        return this;
    };
    AudioSource.prototype.setSound = function (soundName) {
        this.stop();
        this.soundName = soundName;
    };
    AudioSource.prototype.setNextSound = function (soundName) {
        this.nextSound = soundName;
    };
    AudioSource.prototype.playNextSound = function () {
        this.stop();
        if (this.soundName) {
            this.soundName = this.nextSound;
            this.nextSound = "";
            this.play();
        }
    };
    AudioSource.prototype.play = function () {
        if (!this.isPlaying) {
            var pos = this.position;
            this.streamID = SoundManager.playSoundAt(pos.x, pos.y, pos.z, this.sound, true, this.volume, 1, this.radius);
            if (this.streamID != 0) {
                this.isPlaying = true;
            }
        }
    };
    AudioSource.prototype.stop = function () {
        if (this.isPlaying) {
            this.isPlaying = false;
            SoundManager.stop(this.streamID);
            this.streamID = 0;
        }
    };
    AudioSource.prototype.pause = function () {
        this.isPlaying = false;
        SoundManager.pause(this.streamID);
    };
    AudioSource.prototype.resume = function () {
        this.isPlaying = true;
        SoundManager.resume(this.streamID);
    };
    AudioSource.prototype.updateVolume = function () {
        if (this.source == Player.get())
            return;
        var s = this.position;
        var p = Player.getPosition();
        var distance = Math.sqrt(Math.pow(s.x - p.x, 2) + Math.pow(s.y - p.y, 2) + Math.pow(s.z - p.z, 2));
        if (distance > this.radius && SoundManager.playSound)
            return;
        var volume = this.volume * Math.max(0, 1 - distance / this.radius);
        SoundManager.setVolume(this.streamID, volume);
    };
    return AudioSource;
}());
Network.addClientPacket("WorldRegion.play_sound", function (data) {
    World.playSound(data.x, data.y, data.z, data.name, data.volume, data.pitch);
});
Network.addClientPacket("WorldRegion.play_sound_at", function (data) {
    World.playSoundAtEntity(data.ent, data.name, data.volume, data.pitch);
});
var SoundStream = /** @class */ (function () {
    function SoundStream(soundName, looping, volume, radius) {
        this.looping = false;
        this.streamId = 0;
        this.isPlaying = false;
        this.startTime = 0;
        this.name = soundName;
        this.volume = volume;
        this.radius = radius;
        this.sound = SoundManager.getSound(soundName); // doesn't work with sound arrays
    }
    return SoundStream;
}());
/**
 * Position in the world emiting streams.
 */
var AudioSourceClient = /** @class */ (function () {
    function AudioSourceClient(position) {
        var _this = this;
        this.isPlaying = true;
        this.remove = false;
        this.streams = [];
        // Legacy kostyl
        this.update = function () {
            for (var i = 0; i < _this.streams.length; i++) {
                var stream = _this.streams[i];
                if (!stream.looping && stream.sound.getDuration() < Debug.sysTime() - stream.startTime) {
                    if (stream.sound.nextSound) {
                        _this.playNextSound(stream, stream.sound.nextSound);
                    }
                    else {
                        _this.streams.splice(i, 1);
                        i--;
                        continue;
                    }
                }
            }
            _this.updateVolume();
        };
        this.position = position;
    }
    AudioSourceClient.prototype.setPosition = function (x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        //this.updateVolume();
    };
    AudioSourceClient.prototype.playNextSound = function (stream, nextSound) {
        SoundManager.stop(stream.streamId);
        stream.name = nextSound.name;
        stream.sound = nextSound;
        this.playSound(stream);
    };
    AudioSourceClient.prototype.play = function (soundName, looping, volume, radius) {
        if (looping === void 0) { looping = false; }
        if (volume === void 0) { volume = 1; }
        if (radius === void 0) { radius = 16; }
        Debug.m("[Client] Play sound ".concat(soundName, ", ").concat(looping, ", ").concat(volume, ", ").concat(radius));
        var stream = new SoundStream(soundName, looping, volume, radius);
        var started = this.playSound(stream);
        if (stream.looping || started) {
            this.streams.push(stream);
        }
    };
    /**
     * Plays sound if there is enough sound streams.
     * @param sound
     * @param volume
     * @returns true if sound was played, otherwise false.
     */
    AudioSourceClient.prototype.playSound = function (sound, volume) {
        if (volume === void 0) { volume = sound.volume; }
        var streamId = SoundManager.playSoundAt(this.position.x, this.position.y, this.position.z, sound.name, sound.looping, sound.volume, 1, sound.radius);
        if (streamId != 0) {
            sound.streamId = streamId;
            sound.isPlaying = true;
            return true;
        }
        return false;
    };
    AudioSourceClient.prototype.stop = function (soundName) {
        for (var i = 0; i < this.streams.length; i++) {
            var stream = this.streams[i];
            if (stream.name == soundName) {
                SoundManager.stop(stream.streamId);
                this.streams.splice(i, 1);
                break;
            }
        }
    };
    AudioSourceClient.prototype.pause = function () {
        var e_2, _a;
        try {
            for (var _b = __values(this.streams), _c = _b.next(); !_c.done; _c = _b.next()) {
                var stream = _c.value;
                SoundManager.pause(stream.streamId);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    AudioSourceClient.prototype.resume = function () {
        var e_3, _a;
        try {
            for (var _b = __values(this.streams), _c = _b.next(); !_c.done; _c = _b.next()) {
                var stream = _c.value;
                SoundManager.resume(stream.streamId);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    AudioSourceClient.prototype.setVolume = function (soundName, volume) {
        var stream = this.streams.find(function (s) { return s.name == soundName; });
        if (stream) {
            stream.volume = volume;
        }
        else {
            Logger.Log("Invalid update packet - stream for ".concat(soundName, " not found"), "[SoundLib]");
        }
    };
    AudioSourceClient.prototype.updateVolume = function () {
        var e_4, _a;
        //if (this.source == Player.get()) return;
        var s = this.position;
        var p = Player.getPosition();
        var distance = Math.sqrt(Math.pow(s.x - p.x, 2) + Math.pow(s.y - p.y, 2) + Math.pow(s.z - p.z, 2));
        try {
            for (var _b = __values(this.streams), _c = _b.next(); !_c.done; _c = _b.next()) {
                var stream = _c.value;
                if (distance <= stream.radius + 1) {
                    var volume = stream.volume * Math.max(0, 1 - distance / stream.radius);
                    if (stream.isPlaying) {
                        SoundManager.setVolume(stream.streamId, volume);
                    }
                    else {
                        this.playSound(stream, volume);
                    }
                }
                else if (stream.isPlaying) {
                    SoundManager.stop(stream.streamId);
                    stream.isPlaying = false;
                }
                ;
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
    AudioSourceClient.prototype.unload = function () {
        var e_5, _a;
        try {
            for (var _b = __values(this.streams), _c = _b.next(); !_c.done; _c = _b.next()) {
                var stream = _c.value;
                SoundManager.stop(stream.streamId);
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
    return AudioSourceClient;
}());
/// <reference path="TileEntityAudioSource.ts" />
EXPORT("SoundManager", SoundManager);
EXPORT("SourceType", SourceType);
EXPORT("TileEntityAudioSource", TileEntityAudioSource);
