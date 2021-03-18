LIBRARY({
    name: "SoundLib",
    version: 1,
    shared: false,
    api: "CoreEngine"
});
var SoundManager;
(function (SoundManager) {
    var settings_path = "/storage/emulated/0/games/Horizon/minecraftpe/options.txt";
    SoundManager.maxStreams = 0;
    SoundManager.playingStreams = 0;
    SoundManager.soundPath = "";
    SoundManager.soundData = {};
    SoundManager.audioSources = [];
    function readSettings() {
        SoundManager.soundVolume = parseInt(FileTools.ReadKeyValueFile(settings_path)["audio_sound"]);
        SoundManager.musicVolume = parseInt(FileTools.ReadKeyValueFile(settings_path)["audio_music"]);
    }
    SoundManager.readSettings = readSettings;
    function init(maxStreamsCount) {
        SoundManager.soundPool = new android.media.SoundPool.Builder().setMaxStreams(maxStreamsCount).build();
        SoundManager.maxStreams = maxStreamsCount;
        readSettings();
    }
    SoundManager.init = init;
    function setResourcePath(path) {
        SoundManager.soundPath = path;
    }
    SoundManager.setResourcePath = setResourcePath;
    function registerSound(soundName, path, looping) {
        if (looping === void 0) { looping = false; }
        if (Array.isArray(path)) {
            var soundID = [];
            for (var i in path) {
                soundID.push(SoundManager.soundPool.load(SoundManager.soundPath + path[i], 1));
            }
        }
        else {
            path = SoundManager.soundPath + path;
            var soundID = SoundManager.soundPool.load(path, 1);
        }
        SoundManager.soundData[soundName] = { id: soundID, path: path, looping: looping };
        return soundID;
    }
    SoundManager.registerSound = registerSound;
    function getSoundData(soundName) {
        return SoundManager.soundData[soundName];
    }
    SoundManager.getSoundData = getSoundData;
    function getSoundDuration(soundName) {
        var sound = SoundManager.soundData[soundName];
        if (sound) {
            if (!sound.duration) {
                var mmr = new android.media.MediaMetadataRetriever();
                mmr.setDataSource(sound.path);
                var durationStr = mmr.extractMetadata(android.media.MediaMetadataRetriever.METADATA_KEY_DURATION);
                var duration = parseInt(durationStr);
                sound.duration = duration - duration % 50;
                //Game.message(soundName+" - "+sound.duration);
            }
            return sound.duration;
        }
        return 0;
    }
    SoundManager.getSoundDuration = getSoundDuration;
    function playSound(soundName, volume, pitch) {
        if (volume === void 0) { volume = 1; }
        if (pitch === void 0) { pitch = 1; }
        var sound = getSoundData(soundName);
        if (!sound) {
            Logger.Log("Cannot find sound: " + soundName, "ERROR");
            return 0;
        }
        if (SoundManager.playingStreams >= SoundManager.maxStreams)
            return 0;
        if (sound.looping)
            SoundManager.playingStreams++;
        var soundID = sound.id;
        if (Array.isArray(soundID)) {
            soundID = soundID[Math.floor(Math.random() * soundID.length)];
        }
        volume *= SoundManager.soundVolume;
        var streamID = SoundManager.soundPool.play(soundID, volume, volume, sound.looping ? 1 : 0, sound.looping ? -1 : 0, pitch);
        //Game.message(streamID +" - "+ soundName + ", volume: "+ volume);
        return streamID;
    }
    SoundManager.playSound = playSound;
    function playSoundAt(x, y, z, soundName, volume, pitch, radius) {
        if (volume === void 0) { volume = 1; }
        if (pitch === void 0) { pitch = 1; }
        if (radius === void 0) { radius = 16; }
        var p = Player.getPosition();
        var distance = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2) + Math.pow(z - p.z, 2));
        if (distance >= radius)
            return 0;
        volume *= 1 - distance / radius;
        var streamID = playSound(soundName, volume, pitch);
        return streamID;
    }
    SoundManager.playSoundAt = playSoundAt;
    function playSoundAtEntity(entity, soundName, volume, pitch, radius) {
        if (radius === void 0) { radius = 16; }
        var pos = Entity.getPosition(entity);
        return playSoundAt(pos.x, pos.y, pos.z, soundName, volume, pitch, radius);
    }
    SoundManager.playSoundAtEntity = playSoundAtEntity;
    function playSoundAtBlock(tile, soundName, volume, radius) {
        if (radius === void 0) { radius = 16; }
        if (tile.dimension != undefined && tile.dimension != Player.getDimension())
            return 0;
        return playSoundAt(tile.x + .5, tile.y + .5, tile.z + .5, soundName, volume, 1, radius);
    }
    SoundManager.playSoundAtBlock = playSoundAtBlock;
    function createSource(sourceType, source, soundName, volume, radius) {
        if (sourceType == SourceType.ENTITY && typeof (source) != "number") {
            Logger.Log("Invalid source type " + typeof (source) + "for AudioSource.ENTITY", "ERROR");
            return null;
        }
        if (sourceType == SourceType.TILEENTITY && typeof (source) != "object") {
            Logger.Log("Invalid source type " + typeof (source) + "for AudioSource.TILEENTITY", "ERROR");
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
        SoundManager.soundPool.setVolume(streamID, leftVolume, rightVolume);
    }
    SoundManager.setVolume = setVolume;
    function stop(streamID) {
        SoundManager.soundPool.stop(streamID);
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
        SoundManager.playingStreams = 0;
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
            var sound = SoundManager.audioSources[i];
            if (sound.remove || sound.sourceType == SourceType.TILEENTITY && sound.source.remove) {
                sound.stop();
                SoundManager.audioSources.splice(i, 1);
                i--;
                continue;
            }
            if (!sound.isLooping && Debug.sysTime() - sound.startTime >= getSoundDuration(sound.soundName)) {
                if (sound.nextSound) {
                    sound.playNextSound();
                }
                else {
                    sound.stop();
                    SoundManager.audioSources.splice(i, 1);
                    i--;
                    continue;
                }
            }
            // TODO:
            // check dimension
            if (sound.sourceType == SourceType.ENTITY && Entity.isExist(sound.source)) {
                sound.position = Entity.getPosition(sound.source);
            }
            if (!sound.isPlaying && sound.isLooping && SoundManager.playingStreams < SoundManager.maxStreams) {
                //Game.message("Start play sound: "+sound.soundName);
                sound.play();
            }
            if (sound.isPlaying) {
                sound.updateVolume();
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
        var currentScreen = screenName.includes("controls_and_settings");
        if (prevScreen && !currentScreen) {
            readSettings();
        }
        prevScreen = currentScreen;
    });
})(SoundManager || (SoundManager = {}));
var Sound = /** @class */ (function () {
    function Sound() {
    }
    return Sound;
}());
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
        if (sourceType == SourceType.ENTITY) {
            this.position = Entity.getPosition(source);
            this.dimension = Entity.getDimension(source);
        }
        if (sourceType = SourceType.TILEENTITY) {
            this.position = { x: source.x + .5, y: source.y + .5, z: source.z + .5 };
            this.dimension = source.dimension;
        }
        this.radius = radius;
        this.volume = volume;
        var soundData = SoundManager.getSoundData(soundName);
        this.isLooping = soundData.looping;
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
            this.isLooping = SoundManager.getSoundData(this.soundName).looping;
            this.nextSound = "";
            this.play();
        }
    };
    AudioSource.prototype.play = function () {
        if (!this.isPlaying) {
            var pos = this.position;
            this.streamID = SoundManager.playSoundAt(pos.x, pos.y, pos.z, this.soundName, this.volume, 1, this.radius);
            if (this.streamID != 0) {
                this.isPlaying = true;
            }
        }
    };
    AudioSource.prototype.stop = function () {
        if (this.isPlaying) {
            this.isPlaying = false;
            SoundManager.stop(this.streamID);
            SoundManager.playingStreams--;
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
        SoundManager.setVolume(this.streamID, volume * SoundManager.soundVolume);
    };
    return AudioSource;
}());
EXPORT("SoundManager", SoundManager);
EXPORT("SourceType", SourceType);
