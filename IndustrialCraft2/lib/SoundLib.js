LIBRARY({
    name: "SoundLib",
    version: 1,
    shared: false,
    api: "CoreEngine"
});
var SoundManager = /** @class */ (function () {
    function SoundManager() {
    }
    SoundManager.init = function (maxStreams) {
        this.soundPool = new android.media.SoundPool.Builder().setMaxStreams(maxStreams).build();
        this.maxStreams = maxStreams;
    };
    SoundManager.setResourcePath = function (path) {
        this.soundPath = path;
    };
    SoundManager.registerSound = function (soundName, path, looping) {
        if (looping === void 0) { looping = false; }
        if (Array.isArray(path)) {
            var soundID = [];
            for (var i in path) {
                soundID.push(this.soundPool.load(this.soundPath + path[i], 1));
            }
        }
        else {
            path = this.soundPath + path;
            var soundID = this.soundPool.load(path, 1);
        }
        this.soundData[soundName] = { id: soundID, path: path, looping: looping };
        return soundID;
    };
    SoundManager.getSoundData = function (soundName) {
        return this.soundData[soundName];
    };
    SoundManager.getSoundDuration = function (soundName) {
        var soundData = this.soundData[soundName];
        if (soundData) {
            if (!soundData.duration) {
                var mmr = new android.media.MediaMetadataRetriever();
                mmr.setDataSource(soundData.path);
                var durationStr = mmr.extractMetadata(android.media.MediaMetadataRetriever.METADATA_KEY_DURATION);
                var duration = parseInt(durationStr);
                soundData.duration = duration - duration % 50;
                Game.message(soundName + " - " + soundData.duration);
            }
            return soundData.duration;
        }
        return 0;
    };
    SoundManager.playSound = function (soundName, volume, pitch) {
        if (volume === void 0) { volume = 1; }
        if (pitch === void 0) { pitch = 1; }
        var soundData = this.getSoundData(soundName);
        if (!soundData) {
            Logger.Log("Cannot find sound: " + soundName, "ERROR");
            return 0;
        }
        if (this.playingStreams >= this.maxStreams)
            return 0;
        if (soundData.looping)
            this.playingStreams++;
        var soundID = soundData.id;
        if (Array.isArray(soundID)) {
            soundID = soundID[Math.floor(Math.random() * soundID.length)];
        }
        Game.message(volume + " - " + this.soundVolume);
        volume *= this.soundVolume;
        var streamID = this.soundPool.play(soundID, volume, volume, soundData.looping ? 1 : 0, soundData.looping ? -1 : 0, pitch);
        Game.message(streamID + " - " + soundName + ", volume: " + volume);
        return streamID;
    };
    SoundManager.playSoundAt = function (x, y, z, soundName, volume, pitch, radius) {
        if (volume === void 0) { volume = 1; }
        if (pitch === void 0) { pitch = 1; }
        if (radius === void 0) { radius = 16; }
        var p = Player.getPosition();
        var distance = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2) + Math.pow(z - p.z, 2));
        if (distance >= radius)
            return 0;
        volume *= 1 - distance / radius;
        var streamID = this.playSound(soundName, volume, pitch);
        return streamID;
    };
    SoundManager.playSoundAtEntity = function (entity, soundName, volume, pitch, radius) {
        if (radius === void 0) { radius = 16; }
        var pos = Entity.getPosition(entity);
        return this.playSoundAt(pos.x, pos.y, pos.z, soundName, volume, pitch, radius);
    };
    SoundManager.playSoundAtBlock = function (tile, soundName, volume, radius) {
        if (radius === void 0) { radius = 16; }
        if (tile.dimension != undefined && tile.dimension != Player.getDimension())
            return 0;
        return this.playSoundAt(tile.x + .5, tile.y + .5, tile.z + .5, soundName, volume, 1, radius);
    };
    SoundManager.createSource = function (sourceType, source, soundName, volume, radius) {
        if (sourceType == AudioSourceType.ENTITY && typeof (source) != "number") {
            Logger.Log("Invalid source type " + typeof (source) + "for AudioSource.ENTITY", "ERROR");
            return null;
        }
        if (sourceType == AudioSourceType.TILEENTITY && typeof (source) != "object") {
            Logger.Log("Invalid source type " + typeof (source) + "for AudioSource.TILEENTITY", "ERROR");
            return null;
        } /*
        var soundID = this.getSoundID(soundName);
        if (!soundID) {
            Logger.Log("Cannot find sound: "+ soundName, "ERROR");
            return null;
        }*/
        var audioSource = new AudioSource(sourceType, source, soundName, volume, radius);
        this.audioSources.push(audioSource);
        return audioSource;
    };
    SoundManager.getSource = function (source, soundName) {
        for (var i in this.audioSources) {
            var audio = this.audioSources[i];
            if (audio.source == source && (!soundName || audio.soundName == soundName))
                return audio;
        }
        return null;
    };
    SoundManager.getAllSources = function (source, soundName) {
        var sources = [];
        for (var i in this.audioSources) {
            var audio = this.audioSources[i];
            if (audio.source == source && (!soundName || audio.soundName == soundName))
                sources.push(audio);
        }
        return sources;
    };
    SoundManager.removeSource = function (audioSource) {
        audioSource.remove = true;
    };
    SoundManager.startPlaySound = function (sourceType, source, soundName, volume, radius) {
        if (sourceType == AudioSourceType.PLAYER && typeof (source) != "number") {
            volume = soundName;
            soundName = source;
            source = Player.get();
        }
        var audioSource = this.getSource(source, soundName);
        if (audioSource) {
            return audioSource;
        }
        return this.createSource(sourceType, source, soundName, volume, radius);
    };
    SoundManager.stopPlaySound = function (source, soundName) {
        for (var i in this.audioSources) {
            var audio = this.audioSources[i];
            if (audio.source == source && (!soundName || audio.soundName == soundName)) {
                audio.remove = true;
                return true;
            }
        }
        return false;
    };
    SoundManager.setVolume = function (streamID, leftVolume, rightVolume) {
        if (rightVolume === void 0) { rightVolume = leftVolume; }
        this.soundPool.setVolume(streamID, leftVolume, rightVolume);
    };
    SoundManager.stop = function (streamID) {
        this.soundPool.stop(streamID);
    };
    SoundManager.pause = function (streamID) {
        this.soundPool.pause(streamID);
    };
    SoundManager.resume = function (streamID) {
        this.soundPool.resume(streamID);
    };
    SoundManager.stopAll = function () {
        this.soundPool.autoPause();
        this.audioSources.splice(0);
        this.playingStreams = 0;
    };
    SoundManager.autoPause = function () {
        this.soundPool.autoPause();
    };
    SoundManager.autoResume = function () {
        this.soundPool.autoResume();
    };
    SoundManager.release = function () {
        this.soundPool.release();
    };
    SoundManager.tick = function () {
        for (var i in this.audioSources) {
            var sound = this.audioSources[i];
            if (sound.remove || sound.sourceType == AudioSourceType.TILEENTITY && sound.source.remove) {
                sound.stop();
                this.audioSources.splice(i, 1);
                i--;
                continue;
            }
            if (!sound.isLooping && Debug.sysTime() - sound.startTime >= this.getSoundDuration(sound.soundName)) {
                if (sound.nextSound) {
                    sound.playNextSound();
                }
                else {
                    sound.stop();
                    this.audioSources.splice(i, 1);
                    i--;
                    continue;
                }
            }
            // TODO:
            // check dimension
            if (sound.sourceType == AudioSourceType.ENTITY && Entity.isExist(sound.source)) {
                sound.position = Entity.getPosition(sound.source);
            }
            if (!sound.isPlaying && sound.isLooping && this.playingStreams < this.maxStreams) {
                Game.message("Start play sound: " + sound.soundName);
                sound.play();
            }
            if (sound.isPlaying) {
                sound.updateVolume();
            }
        }
    };
    SoundManager.soundVolume = FileTools.ReadKeyValueFile(settings_path)["audio_sound"];
    SoundManager.musicVolume = FileTools.ReadKeyValueFile(settings_path)["audio_music"];
    SoundManager.maxStreams = 0;
    SoundManager.playingStreams = 0;
    SoundManager.soundPath = "";
    SoundManager.soundData = {};
    SoundManager.audioSources = [];
    return SoundManager;
}());
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
var settings_path = "/storage/emulated/0/games/Horizon/minecraftpe/options.txt";
var prevScreen = false;
Callback.addCallback("NativeGuiChanged", function (screenName) {
    var currentScreen = screenName.includes("controls_and_settings");
    if (prevScreen && !currentScreen) {
        SoundManager.soundVolume = FileTools.ReadKeyValueFile(settings_path)["audio_sound"];
        SoundManager.musicVolume = FileTools.ReadKeyValueFile(settings_path)["audio_music"];
    }
    prevScreen = currentScreen;
});
var Sound = /** @class */ (function () {
    function Sound() {
    }
    return Sound;
}());
var AudioSourceType;
(function (AudioSourceType) {
    AudioSourceType[AudioSourceType["PLAYER"] = 0] = "PLAYER";
    AudioSourceType[AudioSourceType["ENTITY"] = 1] = "ENTITY";
    AudioSourceType[AudioSourceType["TILEENTITY"] = 2] = "TILEENTITY";
})(AudioSourceType || (AudioSourceType = {}));
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
        if (sourceType == AudioSourceType.ENTITY) {
            this.position = Entity.getPosition(source);
            this.dimension = Player.getDimension();
        }
        if (sourceType = AudioSourceType.TILEENTITY) {
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
            if (this.sourceType == AudioSourceType.PLAYER) {
                this.streamID = SoundManager.playSound(this.soundName, this.volume, 1);
            }
            else {
                var pos = this.position;
                this.streamID = SoundManager.playSoundAt(pos.x, pos.y, pos.z, this.soundName, this.volume, 1, this.radius);
            }
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
        if (this.sourceType == AudioSourceType.PLAYER)
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
EXPORT("AudioSource", AudioSourceType);
