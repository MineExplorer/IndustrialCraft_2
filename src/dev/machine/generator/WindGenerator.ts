BlockRegistry.createBlock("genWindmill", [
	{name: "Wind Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["windmill", 0], ["windmill", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.genWindmill, "stone", 1);
ItemName.addProductionTooltip(BlockID.genWindmill, "EU", 0, EnergyProductionModifiers.Windmill);

TileRenderer.setStandardModelWithRotation(BlockID.genWindmill, 2, [["machine_bottom", 0], ["machine_top", 0], ["windmill", 0], ["windmill", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.genWindmill, 2, [["machine_bottom", 0], ["machine_top", 0], ["windmill_rotating", 0], ["windmill_rotating", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.genWindmill);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.genWindmill, count: 1, data: 0}, [
		"x x",
		" # ",
		"xcx"
	], ['#', BlockID.primalGenerator, -1, 'x', ItemID.plateSteel, 0, 'c', ItemID.coil, 0]);
});

namespace Machine {
	export class WindGenerator extends Generator {
		defaultValues = {
			energy: 0,
			output: 0,
			ticker: -1,
			blockCount: 0
		}

		updateBlockCount(): void {
			let blockCount = -1;
			for (let x = -4; x <= 4; x++)
			for (let y = -3; y <= 3; y++)
			for (let z = -4; z <= 4; z++) {
				if (this.blockSource.getBlockId(this.x + x, this.y + y, this.z + z) != 0) {
					blockCount++;
				}
			}
			this.data.blockCount = blockCount;
		}

		onInit(): void {
			super.onInit();
			if (this.dimension != 0)
				this.selfDestroy();
		}

		onTick(): void {
			if (++this.data.ticker % 128 == 0) {
				if (this.data.ticker % 1024 == 0) {
					this.updateBlockCount();
				}
				let wind = WindSim.getWindAt(this.y) * (1 - this.data.blockCount/567);
				if (wind < 0) wind = 0;
				const rawOutput = wind / 30 * EnergyProductionModifiers.Windmill;
				this.data.output = Math.round(rawOutput * 10)/10;
			}
			this.setActive(this.data.output > 0);
		}

		energyTick(type: string, src: EnergyTileNode): void {
			if (this.data.output > 0) {
				src.add(this.data.output);
			}
		}

		canRotate(side: number): boolean {
			return side > 1;
		}
	}

	MachineRegistry.registerPrototype(BlockID.genWindmill, new WindGenerator());
}
