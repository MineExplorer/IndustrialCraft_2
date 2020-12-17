IDRegistry.genBlockID("teleporter");
Block.createBlock("teleporter", [
	{name: "Teleporter", texture: [["machine_advanced_bottom", 0], ["teleporter_top", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0]], inCreative: true},
], "machine");
ToolAPI.registerBlockMaterial(BlockID.teleporter, "stone", 1, true);
ItemName.setRarity(BlockID.teleporter, 2, true);

TileRenderer.setStandardModel(BlockID.teleporter, 0, [["machine_advanced_bottom", 0], ["teleporter_top", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0]]);
TileRenderer.registerRenderModel(BlockID.teleporter, 0, [["machine_advanced_bottom", 0], ["teleporter_top", 1], ["teleporter_side", 1], ["teleporter_side", 1], ["teleporter_side", 1], ["teleporter_side", 1]]);

MachineRegistry.setMachineDrop("teleporter", BlockID.machineBlockAdvanced);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.teleporter, count: 1, data: 0}, [
		"xax",
		"c#c",
		"xdx"
	], ['#', BlockID.machineBlockAdvanced, 0, 'x', ItemID.circuitAdvanced, 0, 'a', ItemID.freqTransmitter, 0, 'c', ItemID.cableOptic, 0, 'd', 264, 0]);
});

namespace Machine {
	export class Teleporter
	extends MachineBase {
		defaultValues = {
			frequency: null
		}

		getNearestStorages(x: number, y: number, z: number): TileEntity[] {
			var directions = StorageInterface.directionsBySide;
			var storages = [];
			for (var i in directions) {
				var dir = directions[i];
				var machine = EnergyTileRegistry.accessMachineAtCoords(x + dir.x, y + dir.y, z + dir.z);
				if (machine && machine.isTeleporterCompatible) {
					storages.push(machine);
				}
			}
			return storages;
		}

		getWeight(ent: number): number {
			var type = Entity.getType(ent);
			if (type == 1 || type == EntityType.MINECART) return 1000;
			if (type == EntityType.ITEM) return 100;
			if (isFriendlyMob(type)) return 200;
			if (isHostileMob(type)) return 500;
			return 0;
		}

		tick(): void {
			if (World.getThreadTime()%11 == 0 && this.data.isActive && this.data.frequency) {
				var entities = Entity.getAll();
				var storages = this.getNearestStorages(this.x, this.y, this.z);
				var energyAvailable = 0;
				for (var i in storages) {
					energyAvailable += storages[i].data.energy;
				}
				var receive = this.data.frequency;
				if (energyAvailable > receive.energy * 100) {
					for (var i in entities) {
						var ent = entities[i];
						var c = Entity.getPosition(ent);
						var dx = Math.abs(this.x + 0.5 - c.x);
						var y = c.y - this.y;
						var dz = Math.abs(this.z + 0.5 - c.z);
						if (dx < 1.5 && dz < 1.5 && y >= 0 && y < 3) {
							var weight = this.getWeight(ent);
							if (weight) {
								var energyNeed = weight * receive.energy;
								if (ConfigIC.debugMode) {Debug.m(energyNeed);}
								if (energyNeed < energyAvailable) {
									for (var i in storages) {
										var data = storages[i].data;
										var energyChange = Math.min(energyNeed, data.energy);
										data.energy -= energyChange;
										energyNeed -= energyChange;
										if (energyNeed <= 0) {break;}
									}
									SoundManager.playSoundAt(this.x + .5, this.y + 1, this.z + .5, "TeleUse.ogg");
									SoundManager.playSoundAt(receive.x + .5, receive.y + 1, receive.z + .5, "TeleUse.ogg");
									Entity.setPosition(ent, receive.x + .5, receive.y + 3, receive.z + .5);
								}
							}
						}
					}
				}
			}
		}

		onRedstoneUpdate(signal: number): void {
			this.setActive(signal > 0);
		}
	}

	MachineRegistry.registerPrototype(BlockID.teleporter, new Teleporter());
}