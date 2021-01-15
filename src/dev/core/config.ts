namespace ConfigIC {
	export let debugMode: boolean = __config__.getBool("debug_mode");
	export let soundEnabled: boolean = __config__.getBool("sound_enabled");
	export let machineSoundEnabled: boolean = __config__.getBool("machine_sounds");
	export let voltageEnabled: boolean = __config__.getBool("voltage_enabled");
	export let wireDamageEnabled: boolean = __config__.getBool("wire_damage_enabled");
	export let gameLanguage: string;
	export function reload() {
		let lang = FileTools.ReadKeyValueFile("games/com.mojang/minecraftpe/options.txt").game_language;
		gameLanguage = (lang || "en_US").substring(0, 2);
	}
}

ConfigIC.reload();

let player: number;
Callback.addCallback("LevelLoaded", function() {
	ConfigIC.reload();
	player = Player.get();
});

let isLevelDisplayed = false;
Callback.addCallback("LevelDisplayed", function() {
	isLevelDisplayed = true;
});
Callback.addCallback("LevelLeft", function() {
	isLevelDisplayed = false;
});

// debug
let lasttime = -1;
let frame = 0;

if (ConfigIC.debugMode) {
	Callback.addCallback("tick", function() {
		let t = Debug.sysTime();
		if (frame++ % 20 == 0) {
			if (lasttime != -1) {
				let tps = 1000 / (t - lasttime) * 20
				Game.tipMessage(Math.round(tps * 10) / 10 + "tps")
			}
			lasttime = t
		}
	});
}