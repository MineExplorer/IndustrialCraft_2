namespace IC2Config {
	export let soundEnabled = getBool("sound_enabled");
	export let machineSoundEnabled = getBool("machine_sounds");
	export let voltageEnabled = getBool("voltage_enabled");

	export function getBool(name: string): boolean {
		return __config__.getBool(name);
	}

	export function getInt(name: string): number {
		return __config__.getNumber(name).intValue();
	}

	export function getFloat(name: string): number {
		return __config__.getNumber(name).floatValue();
	}
}

let isLevelDisplayed = false;
Callback.addCallback("LevelDisplayed", function() {
	isLevelDisplayed = true;
});
Callback.addCallback("LevelLeft", function() {
	isLevelDisplayed = false;
});

// show tps
let lasttime = -1;
let frame = 0;

Callback.addCallback("tick", function() {
	if (Game.isDeveloperMode) {
		let t = Debug.sysTime();
		if (frame++ % 20 == 0) {
			if (lasttime != -1) {
				let tps = 1000 / (t - lasttime) * 20
				Game.tipMessage(Math.round(tps * 10) / 10 + "tps")
			}
			lasttime = t
		}
	}
});