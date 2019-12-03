let Config = {
	reload: function(){
		this.debugMode = __config__.getBool("debug_mode");
		this.soundEnabled = __config__.getBool("sound_enabled");
		this.machineSoundEnabled = __config__.getBool("machine_sounds");
		this.voltageEnabled = __config__.getBool("voltage_enabled");
		this.wireDamageEnabled = __config__.getBool("wire_damage_enabled");
	}
}

Config.reload();

Callback.addCallback("LevelLoaded", function(){
	Config.reload();
	player = Player.get();
});