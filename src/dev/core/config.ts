namespace ConfigIC {
	export let debugMode: boolean;
	export let soundEnabled: boolean;
	export let machineSoundEnabled: boolean;
	export let voltageEnabled: boolean;
	export let wireDamageEnabled: boolean;

	export function getBool(name: string): boolean {
		return __config__.getBool(name);
	}

	export function getInt(name: string): number {
		return __config__.getNumber(name).intValue();
	}

	export function getFloat(name: string): number {
		return __config__.getNumber(name).floatValue();
	}

	export function reload() {
		debugMode = getBool("debug_mode");
		soundEnabled = getBool("sound_enabled");
		machineSoundEnabled = getBool("machine_sounds");
		voltageEnabled = getBool("voltage_enabled");
		wireDamageEnabled = getBool("wire_damage_enabled");
	}
}

ConfigIC.reload();

Callback.addCallback("LevelLoaded", function() {
	ConfigIC.reload();
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