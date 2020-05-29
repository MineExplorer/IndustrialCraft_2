LIBRARY({
    name: "SoundLib",
    version: 1,
    shared: false,
    api: "CoreEngine"
});
/*Volume in the settings*/
var settings_path = "/storage/emulated/0/games/Horizon/minecraftpe/options.txt";
var prevScreen = false;
Callback.addCallback("NativeGuiChanged", function (screenName) {
    var currentScreen = screenName.includes("controls_and_settings");
    if (prevScreen && !currentScreen) {
        SoundAPI.soundVolume = FileTools.ReadKeyValueFile(settings_path)["audio_sound"];
        SoundAPI.musicVolume = FileTools.ReadKeyValueFile(settings_path)["audio_music"];
        //SoundAPI.updateVolume();
    }
    prevScreen = currentScreen;
});
var SoundAPI;
(function (SoundAPI) {
    SoundAPI.soundVolume = FileTools.ReadKeyValueFile(settings_path)["audio_sound"];
    SoundAPI.musicVolume = FileTools.ReadKeyValueFile(settings_path)["audio_music"];
    SoundAPI.soundManagers = [];
    //export var soundPlayers: Array<SoundPlayer> = [];
    function addSoundManager(soundManager) {
        this.soundManagers.push(soundManager);
    }
    SoundAPI.addSoundManager = addSoundManager;
    function stopAllSounds() {
        for (var i in this.soundManagers) {
            this.soundManagers[i].stopAll();
        }
    }
    SoundAPI.stopAllSounds = stopAllSounds;
})(SoundAPI || (SoundAPI = {}));
var SoundManager = /** @class */ (function () {
    function SoundManager(maxStreams) {
        this.playingStreams = 0;
        this.soundIDs = {};
        this.audioSources = [];
        this.soundPool = new android.media.SoundPool.Builder().setMaxStreams(maxStreams).build();
        this.maxStreams = maxStreams;
        SoundAPI.addSoundManager(this);
    }
    SoundManager.prototype.loadSound = function (soundName, path) {
        var soundID = this.soundPool.load(path, 1);
        this.soundIDs[soundName] = soundID;
        return soundID;
    };
    SoundManager.prototype.loadSoundsFromDir = function (path) {
        var dir = new java.io.File(path);
        var files = dir.listFiles();
        for (var i in files) {
            var item = files[i];
            if (item.isDirectory()) {
                this.loadSoundsFromDir(item.getAbsolutePath());
            }
            else {
                this.loadSound(item.getName(), item.getAbsolutePath());
            }
        }
    };
    SoundManager.prototype.getSoundID = function (soundName) {
        return this.soundIDs[soundName] || 0;
    };
    SoundManager.prototype.playSound = function (soundName, volume, pitch, isLooping) {
        if (volume === void 0) { volume = 1; }
        if (pitch === void 0) { pitch = 1; }
        if (isLooping === void 0) { isLooping = false; }
        var soundID = this.getSoundID(soundName);
        if (!soundID) {
            Logger.Log("Cannot find sound: " + soundName, "ERROR");
            return 0;
        }
        if (this.playingStreams >= this.maxStreams)
            return 0;
        if (isLooping)
            this.playingStreams++;
        volume *= SoundAPI.soundVolume;
        var streamID = this.soundPool.play(soundID, volume, volume, isLooping ? 1 : 0, isLooping ? -1 : 0, pitch);
        Game.message(streamID + " - " + soundName + ", volume: " + volume);
        return streamID;
    };
    SoundManager.prototype.playSoundAt = function (x, y, z, soundName, volume, pitch, isLooping, radius) {
        if (volume === void 0) { volume = 1; }
        if (pitch === void 0) { pitch = 1; }
        if (isLooping === void 0) { isLooping = false; }
        if (radius === void 0) { radius = 16; }
        var p = Player.getPosition();
        var distance = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2) + Math.pow(z - p.z, 2));
        if (distance >= radius)
            return 0;
        volume *= 1 - distance / radius;
        var streamID = this.playSound(soundName, volume, pitch, isLooping);
        return streamID;
    };
    SoundManager.prototype.playSoundAtEntity = function (entity, soundName, volume, pitch, isLooping, radius) {
        if (isLooping === void 0) { isLooping = false; }
        if (radius === void 0) { radius = 16; }
        var pos = Entity.getPosition(entity);
        return this.playSoundAt(pos.x, pos.y, pos.z, soundName, volume, pitch, isLooping, radius);
    };
    SoundManager.prototype.playSoundAtBlock = function (tile, soundName, volume, radius) {
        if (radius === void 0) { radius = 16; }
        if (tile.dimension != undefined && tile.dimension != Player.getDimension())
            return 0;
        return this.playSoundAt(tile.x + .5, tile.y + .5, tile.z + .5, soundName, volume, 1, false, radius);
    };
    SoundManager.prototype.createSource = function (source, soundName, isLooping, volume) {
        var soundID = this.getSoundID(soundName);
        if (!soundID) {
            Logger.Log("Cannot find sound: " + soundName, "ERROR");
            return null;
        }
        var audioSource = new AudioSource(this, source, soundName, isLooping, volume);
        this.audioSources.push(audioSource);
        return audioSource;
    };
    SoundManager.prototype.getSource = function (source, soundName) {
        for (var i in this.audioSources) {
            var audio = this.audioSources[i];
            if (audio.source == source && (!soundName || audio.soundName == soundName))
                return audio;
        }
        return null;
    };
    SoundManager.prototype.getAllSources = function (source, soundName) {
        var sources = [];
        for (var i in this.audioSources) {
            var audio = this.audioSources[i];
            if (audio.source == source && (!soundName || audio.soundName == soundName))
                sources.push(audio);
        }
        return sources;
    };
    SoundManager.prototype.removeSource = function (audioSource) {
        for (var i in this.audioSources) {
            var audio = this.audioSources[i];
            if (audio == audioSource) {
                audio.isRemoved = true;
                return;
            }
        }
    };
    SoundManager.prototype.removeSourceFrom = function (source, soundName) {
        for (var i in this.audioSources) {
            var audio = this.audioSources[i];
            if (audio.source == source && (!soundName || audio.soundName == soundName)) {
                audio.isRemoved = true;
                return;
            }
        }
    };
    SoundManager.prototype.setVolume = function (streamID, leftVolume, rightVolume) {
        if (rightVolume === void 0) { rightVolume = leftVolume; }
        this.soundPool.setVolume(streamID, leftVolume, rightVolume);
    };
    SoundManager.prototype.stop = function (streamID) {
        this.soundPool.stop(streamID);
    };
    SoundManager.prototype.pause = function (streamID) {
        this.soundPool.pause(streamID);
    };
    SoundManager.prototype.resume = function (streamID) {
        this.soundPool.resume(streamID);
    };
    SoundManager.prototype.stopAll = function () {
        this.soundPool.autoPause();
        this.audioSources = [];
        this.playingStreams = 0;
    };
    SoundManager.prototype.autoPause = function () {
        this.soundPool.autoPause();
    };
    SoundManager.prototype.autoResume = function () {
        this.soundPool.autoResume();
    };
    SoundManager.prototype.release = function () {
        this.soundPool.release();
    };
    SoundManager.prototype.tick = function () {
        for (var i in this.audioSources) {
            var sound = this.audioSources[i];
            if (sound.isRemoved) {
                sound.stop();
                this.audioSources.splice(i, 1);
                i--;
                continue;
            }
            if (sound.sourceType == AudioSourceType.ENTITY && Entity.isExist(sound.source)) {
                sound.position = Entity.getPosition(sound.source);
            }
            if (!sound.isPlaying && this.playingStreams < this.maxStreams) {
                Game.message("Start play sound: " + sound.soundName);
                sound.play();
            }
            if (sound.isPlaying) {
                sound.updateVolume();
            }
        }
    };
    return SoundManager;
}());
Callback.addCallback("LocalTick", function () {
    for (var i in SoundAPI.soundManagers) {
        SoundAPI.soundManagers[i].tick();
    }
});
Callback.addCallback("MinecraftActivityStopped", function () {
    SoundAPI.stopAllSounds();
});
Callback.addCallback("LevelLeft", function () {
    SoundAPI.stopAllSounds();
});
var AudioSourceType;
(function (AudioSourceType) {
    AudioSourceType[AudioSourceType["PLAYER"] = 0] = "PLAYER";
    AudioSourceType[AudioSourceType["ENTITY"] = 1] = "ENTITY";
    AudioSourceType[AudioSourceType["TILEENTITY"] = 2] = "TILEENTITY";
})(AudioSourceType || (AudioSourceType = {}));
var AudioSource = /** @class */ (function () {
    function AudioSource(soundManager, source, soundName, isLooping, volume, radius) {
        if (volume === void 0) { volume = 1; }
        if (radius === void 0) { radius = 16; }
        this.streamID = 0;
        this.isPlaying = false;
        this.isRemoved = false;
        this.soundManager = soundManager;
        this.soundName = soundName;
        this.source = source;
        if (source.class == java.lang.Long) {
            this.sourceType = AudioSourceType.ENTITY;
            this.position = Entity.getPosition(source);
            this.dimension = Player.getDimension();
            Game.message(source);
        }
        else {
            this.sourceType = AudioSourceType.TILEENTITY;
            this.position = { x: source.x + .5, y: source.y + .5, z: source.z + .5 };
            this.dimension = source.dimension;
        }
        this.radius = radius;
        this.volume = volume;
        this.isLooping = isLooping;
        this.play();
    }
    AudioSource.prototype.setPosition = function (x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        this.updateVolume();
        return this;
    };
    AudioSource.prototype.setDimension = function (dimensionId) {
        this.dimension = dimensionId;
    };
    AudioSource.prototype.setSound = function (soundName) {
        this.stop();
        this.soundName = soundName;
        this.play();
    };
    AudioSource.prototype.setNextSound = function (soundName) {
    };
    AudioSource.prototype.play = function () {
        if (!this.isPlaying) {
            var pos = this.position;
            this.streamID = this.soundManager.playSoundAt(pos.x, pos.y, pos.z, this.soundName, this.volume, 1, this.isLooping, this.radius);
            if (this.streamID != 0) {
                this.isPlaying = true;
            }
        }
    };
    AudioSource.prototype.stop = function () {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.soundManager.stop(this.streamID);
            this.soundManager.playingStreams--;
            this.streamID = 0;
        }
    };
    AudioSource.prototype.pause = function () {
        this.isPlaying = false;
        this.soundManager.pause(this.streamID);
    };
    AudioSource.prototype.resume = function () {
        this.isPlaying = true;
        this.soundManager.resume(this.streamID);
    };
    AudioSource.prototype.updateVolume = function () {
        var s = this.position;
        var p = Player.getPosition();
        var distance = Math.sqrt(Math.pow(s.x - p.x, 2) + Math.pow(s.y - p.y, 2) + Math.pow(s.z - p.z, 2));
        if (distance > this.radius && this.soundManager.playSound)
            return;
        var volume = this.volume * Math.max(0, 1 - distance / this.radius);
        this.soundManager.setVolume(this.streamID, volume * SoundAPI.soundVolume);
    };
    return AudioSource;
}());
EXPORT("SoundManager", SoundManager);
//EXPORT("AudioSource", AudioSource);
