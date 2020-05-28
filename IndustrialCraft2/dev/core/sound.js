/*
var ICAudioManager = {
	soundManager: new SoundManager(8),
	machineSoundManager: new SoundManager(16),

	loadSounds: function(){
		this.soundsManager.loadSoundsFromDir(__dir__ + "res/sounds/Tools");
		this.machineSoundManager.loadSoundsFromDir(__dir__ + "res/sounds/Generators");
		this.machineSoundManager.loadSoundsFromDir(__dir__ + "res/sounds/Machines");
	}

var MachineSound = new SoundManager(16);


}
ICAudioManager.loadSounds();*/
var ICAudioManager = new SoundManager(16);
ICAudioManager.loadSoundsFromDir(__dir__ + "res/sounds");
