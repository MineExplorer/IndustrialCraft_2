BlockRegistry.createBlock("genWatermill", [
	{name: "Water Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["watermill_back", 0], ["windmill", 0], ["watermill_left", 0], ["watermill_right", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.genWatermill, "stone", 1);
ItemName.addTierTooltip(BlockID.genWatermill, 1);

TileRenderer.setStandardModelWithRotation(BlockID.genWatermill, 2, [["machine_bottom", 0], ["machine_top", 0], ["watermill_back", 0], ["windmill", 0], ["watermill_left", 0], ["watermill_right", 0]]);
TileRenderer.registerModelWithRotation(BlockID.genWatermill, 2, [["machine_bottom", 0], ["machine_top", 0], ["watermill_back", 0], ["windmill_rotating", 0], ["watermill_left", 0], ["watermill_right", 0]]);
TileRenderer.setRotationFunction(BlockID.genWatermill);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.genWatermill, count: 1, data: 0}, [
		"x x",
		"a#a",
		"xcx"
	], ['#', BlockID.primalGenerator, -1, 'x', ItemID.plateSteel, 0, 'a', ItemID.casingSteel, 0, 'c', ItemID.coil, 0]);
});

namespace Machine {
	export class WaterGenerator extends Generator {
		defaultValues = {
			energy: 0,
			output: 0,
			biome: null,
			ticker: -1,
			blockCount: 0
		}

		BASE_POWER = 3;

		isOcean(biome: number): boolean {
			return biome == 0 || biome == 24;
		}

		isRiver(biome: number): boolean {
			return biome == 7;
		}

		getBiome(x: number, z: number): number {
			const coords = [[x, z], [x-7, z], [x+7, z], [x, z-7], [x, z+7]];
			for (let c of coords) {
				let biome = this.region.getBiome(c[0], c[1]);
				if (this.isOcean(biome)) {
					return biome;
				}
				if (this.isRiver(biome)) {
					return biome;
				}
			}
			return -1;
		}

		onInit(): void {
			super.onInit();
			if (this.data.biome == null) {
				this.data.biome = this.getBiome(this.x, this.z);
				this.data.ticker = -1; // for old blocks
				if (this.data.biome == -1) {
					this.selfDestroy();
				}
			}
		}

		updateBlockCount(): void {
			let blockCount = 0;
			if (this.y >= 32 && this.y < 64) {
				for (let x = -1; x <= 1; x++)
				for (let y = -1; y <= 1; y++)
				for (let z = -1; z <= 1; z++) {
					const coords = new Vector3(this.x + x, this.y + y, this.z + z);
					const blockId = this.region.getExtraBlock(coords).id || this.region.getBlockId(coords);
					if (blockId == 8 || blockId == 9) {
						blockCount++;
					}
				}
			}
			this.data.blockCount = blockCount;
		}

		onTick(): void {
			if (++this.data.ticker % 128 == 0) {
				this.updateBlockCount();
				let output = this.BASE_POWER;
				if (this.isOcean(this.data.biome)) {
					output *= 1.5 * Math.sin(World.getWorldTime()%6000 / (6000 / Math.PI));
				}
				else {
					const wether = World.getWeather();
					if (wether.thunder) {
						output *= 2;
					}
					else if (wether.rain) {
						output *= 1.5;
					}
				}
				output *= this.data.blockCount / 26;
				this.data.output = Math.round(output * 10) / 10;
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

	MachineRegistry.registerPrototype(BlockID.genWatermill, new WaterGenerator());
}