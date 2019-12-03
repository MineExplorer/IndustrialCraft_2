LIBRARY({
    name: "SoundLib",
    version: 1,
    api: "CoreEngine"
});

let SoundAPI = {
	soundPaths: {},
	soundPlayers: [],
	maxPlayersCount: 32,

	loadSounds: function (path){
		let dirs = FileTools.GetListOfDirs(path);
		for(let i in dirs){
			dir = dirs[i];
			this.loadSounds(path + '/' + dir.name);
		}
		let files = FileTools.GetListOfFiles(path, "ogg");
		for(let i in files){
			let file = files[i];
			this.soundPaths[file.name] = path + '/' + file.name;
		}
	},
	
	getSoundPath: function(name){
		return this.soundPaths[name];
	},
	
	addSoundPlayer: function(name, isLooping, priority){
		let sound = new Sound(name, priority);
		sound.setLooping(isLooping || false);
		this.soundPlayers.push(sound);
		return sound;
	},
	
	playSound: function(name, isLooping, priority, disableMultiPlaying){
		if(!Config.soundEnabled) {return;}
		let curSound = null;
		let freePlayer = null;
		for(let i in this.soundPlayers){
			let sound = this.soundPlayers[i];
			if(sound.isPlaying()){
				if(sound.name == name && disableMultiPlaying){
					return;
				}
			}
			else if(sound.name == name) {
				curSound = sound; 
				break;
			} else if(sound.priority <= 0){
				freePlayer = sound;
			}
		}
		if(curSound){
			curSound.start();
		} 
		else if(freePlayer){
			curSound = freePlayer;
			curSound.media.reset();
			curSound.media.setDataSource(SoundAPI.getSoundPath(name));
			curSound.media.setLooping(isLooping || false);
			curSound.media.prepareAsync();
		} 
		else if(priority >= 0 || this.soundPlayers.length < this.maxPlayersCount){
			curSound = this.addSoundPlayer(name, isLooping, priority);
			curSound.prepareAsync();
		}
		Game.message(this.soundPlayers.length);
		return curSound;
	},
	
	updateVolume(){
		for(let i in this.soundPlayers){
			let sound = this.soundPlayers[i];
			sound.setVolume(sound.volume);
		}
	},
	
	createSource: function(name, coord, radius){
		
	},
	
	stopPlaySoundAtMachine: function (){
	},
}

function Sound(name, priority, media){
	if(media){
		media.reset();
	} else {
		let media = new android.media.MediaPlayer();
		SoundAPI.soundPlayers.push(sound);
	}
	media.setDataSource(SoundAPI.getSoundPath(name));
	
	this.name = name;
	this.media = media;
	this.priority = priority || 0;
	
	if(this.priority <= 0)
	this.media.setOnPreparedListener(new android.media.MediaPlayer.OnPreparedListener({
		onPrepared: function(mp){
			mp.start();
		}
	}));
	
	this.isPlaying = function(){
		return this.media.isPlaying();
	}
	
	this.isLooping = function(){
		return this.media.isLooping();
	}
	
	this.setLooping = function(isLooping){
		this.media.setLooping(isLooping);
	}
	
	this.start = function(){
		this.media.start();
	}
	
	this.pause = function(){
		this.media.pause();
	}
	
	this.seekTo = function(ms){
		this.media.seekTo(ms);
	}
	
	this.stop = function(){
		this.media.pause();
		this.media.seekTo(0);
	}
	
	this.setVolume = function(volume){
		this.volume = volume;
		volume *= gameVolume;
		this.media.setVolume(volume, volume);
	}
	
	this.setVolume(1);
}


SoundAPI.loadSounds(__dir__+"res/sounds");

Callback.addCallback("LevelLeft", function(){
	for(let i in SoundAPI.soundPlayers){
		let sound = SoundAPI.soundPlayers[i];
		if(sound.isPlaying()){
			sound.stop();
		}
	}
});

/*Volume in the settings*/
/*From SoundAPI lib by WolfTeam*/
var settings_path = "/storage/emulated/0/games/com.mojang/minecraftpe/options.txt";
var gameVolume = FileTools.ReadKeyValueFile(settings_path)["audio_sound"];
var prevScreen = false;
Callback.addCallback("NativeGuiChanged", function (screen) {
    var currentScreen = screen.startsWith("screen_world_controls_and_settings") || screen.startsWith("screen_controls_and_settings");
    if(prevScreen && !currentScreen){
        gameVolume = FileTools.ReadKeyValueFile(settings_path)["audio_sound"];
		SoundAPI.updateVolume();
    }
    prevScreen = currentScreen;
});

EXPORT("Sound", Sound);
EXPORT("SoundAPI", SoundAPI);