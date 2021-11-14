BlockRegistry.createBlock("teleporter", [
	{name: "Teleporter", texture: [["machine_advanced_bottom", 0], ["teleporter_top", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0]], inCreative: true},
], "machine");
ToolAPI.registerBlockMaterial(BlockID.teleporter, "stone", 1, true);
ItemRegistry.setRarity(BlockID.teleporter, EnumRarity.RARE);

TileRenderer.setStandardModel(BlockID.teleporter, 0, [["machine_advanced_bottom", 0], ["teleporter_top", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0]]);
TileRenderer.registerRenderModel(BlockID.teleporter, 0, [["machine_advanced_bottom", 0], ["teleporter_top", 1], ["teleporter_side", 1], ["teleporter_side", 1], ["teleporter_side", 1], ["teleporter_side", 1]]);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.teleporter, count: 1, data: 0}, [
		"xax",
		"c#c",
		"xdx"
	], ['#', BlockID.machineBlockAdvanced, 0, 'x', ItemID.circuitAdvanced, 0, 'a', ItemID.freqTransmitter, 0, 'c', ItemID.cableOptic, 0, 'd', 264, 0]);
});

namespace Machine {
	export class Teleporter extends MachineBase {
		defaultValues = {
			isActive: false,
			frequency: null
		}

		defaultDrop = BlockID.machineBlockAdvanced;

		getScreenName(): string {
			return null;
		}

		getNearestStorages(): TileEntity[] {
			let storages = [];
			for (let side = 0; side < 6; side++) {
				let coords = StorageInterface.getRelativeCoords(this, side);
				let tileEntity = this.region.getTileEntity(coords);
				if (tileEntity && MachineRegistry.isMachine(tileEntity.blockID) && tileEntity.isTeleporterCompatible) {
					storages.push(tileEntity);
				}
			}
			return storages;
		}

		getWeight(ent: number): number {
			let type = Entity.getType(ent);
			if (type == 1 || type == 63 || type == EntityType.MINECART) return 1000;
			if (type == EntityType.ITEM) return 100;
			if (EntityHelper.isFriendlyMobType(type)) return 200;
			if (EntityHelper.isHostileMobType(type)) return 500;
			return 0;
		}

		onTick(): void {
			if (World.getThreadTime() % 11 == 0 && this.data.isActive && this.data.frequency) {
				let storages = this.getNearestStorages();
				let energyAvailable = 0;
				for (let i in storages) {
					energyAvailable += storages[i].data.energy;
				}
				let receive = this.data.frequency;

				if (energyAvailable > receive.energy * 100) {
					let entities = this.region.listEntitiesInAABB(this.x - 1, this.y, this.z - 1, this.x + 2, this.y + 3, this.z + 2);
					for (let ent of entities) {
						let weight = this.getWeight(ent);
						if (!weight) continue;

						let energyNeed = weight * receive.energy;
						if (Game.isDeveloperMode) Debug.m(energyNeed);
						if (energyNeed <= energyAvailable) {
							for (let i in storages) {
								let data = storages[i].data;
								let energyChange = Math.min(energyNeed, data.energy);
								data.energy -= energyChange;
								energyNeed -= energyChange;
								if (energyNeed <= 0) break;
							}
							SoundManager.playSoundAt(this.x + .5, this.y + 1, this.z + .5, "TeleUse.ogg");
							SoundManager.playSoundAt(receive.x + .5, receive.y + 1, receive.z + .5, "TeleUse.ogg");
							Entity.setPosition(ent, receive.x + .5, receive.y + 3, receive.z + .5);
						}
					}
				}
			}
		}

		onRedstoneUpdate(signal: number): void {
			let isActive = signal > 0;
			this.data.isActive = isActive
			this.setActive(isActive);
		}
	}

	MachineRegistry.registerPrototype(BlockID.teleporter, new Teleporter());
}