namespace WindSim {
	export let windStrength = randomInt(5, 25);

	export function getWindAt(height: number) {
		let windMultiplier = Math.max(1 - Math.abs((160 - height)/96) ** 2, 0);
		const wether = World.getWeather();
		if (wether.thunder)
			windMultiplier *= 1.5;
		else if (wether.rain)
			windMultiplier *= 1.25;
		return windStrength * windMultiplier;
	}

	function updateWind(): void {
		if (World.getThreadTime() % 128 != 0) {return;}

		let upChance = 10;
		let downChance = 10;
		if (windStrength > 20) {
			upChance -= windStrength - 20;
		} else if (windStrength < 10) {
			downChance -= 10 - windStrength;
		}
		if (Math.random()*100 < upChance) {
			windStrength++;
		} else if (Math.random()*100 < downChance) {
			windStrength--;
		}
	}

	Callback.addCallback("tick", function () {
		updateWind();
	});

	Saver.addSavesScope("windSim",
		function read(scope: {strength: number}) {
			windStrength = scope.strength || randomInt(5, 25);
		},
		function save() {
			return {strength: windStrength};
		}
	);
}
