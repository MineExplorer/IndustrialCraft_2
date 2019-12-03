IDRegistry.genBlockID("teleporter");
Block.createBlock("teleporter", [
	{name: "Teleporter", texture: [["machine_advanced_bottom", 0], ["teleporter_top", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0]], inCreative: true},
], "opaque");
TileRenderer.setStandartModel(BlockID.teleporter, [["machine_advanced_bottom", 0], ["teleporter_top", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0]]);
TileRenderer.registerRenderModel(BlockID.teleporter, 0, [["machine_advanced_bottom", 0], ["teleporter_top", 1], ["teleporter_side", 1], ["teleporter_side", 1], ["teleporter_side", 1], ["teleporter_side", 1]]);

Block.registerDropFunction("teleporter", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockAdvanced);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.teleporter, count: 1, data: 0}, [
		"xax",
		"c#c",
		"xdx"
	], ['#', BlockID.machineBlockAdvanced, 0, 'x', ItemID.circuitAdvanced, 0, 'a', ItemID.freqTransmitter, 0, 'c', ItemID.cableOptic, 0, 'd', 264, 0]);
});


MachineRegistry.registerPrototype(BlockID.teleporter, {
	defaultValues: {
		isActive: false,
		frequency: null
	},
	
	getNearestStorages: function(x, y, z){
		var directions = StorageInterface.directionsBySide;
		var storages = [];
		for(var i in directions){
			dir = directions[i];
			var machine = EnergyTileRegistry.accessMachineAtCoords(x + dir.x, y + dir.y, z + dir.z);
			if(machine && machine.isTeleporterCompatible){
				storages.push(machine);
			}
		}
		return storages;
	},

	getWeight: function(ent){
		var type = Entity.getType(ent);
		if(ent==player || type==EntityType.MINECART) return 1000;
		if(type==EntityType.ITEM) return 100;
		if(friendlyMobs.indexOf(type) !== -1) return 200;
		if(evilMobs.indexOf(type) !== -1) return 500;
		return 0;
	},
	
	tick: function(){
		if(World.getThreadTime()%11 == 0 && this.data.isActive && this.data.frequency){
			var entities = Entity.getAll();
			var storages = this.getNearestStorages(this.x, this.y, this.z);
			var energyAvailable = 0;
			for(var i in storages){
				energyAvailable += storages[i].data.energy;
			}
			receive = this.data.frequency;
			if(energyAvailable > receive.energy * 100){
				for(var i in entities){
					var ent = entities[i];
					var c = Entity.getPosition(ent);
					var dx = Math.abs(this.x + 0.5 - c.x);
					var y = c.y - this.y;
					var dz = Math.abs(this.z + 0.5 - c.z);
					if(dx < 1.5 && dz < 1.5 && y >= 0 && y < 3){
						var weight = this.getWeight(ent);
						if(weight){
							var energyNeed = weight * receive.energy;
							if(Config.debugMode){Debug.m(energyNeed);}
							if(energyNeed < energyAvailable){
								for(var i in storages){
									var data = storages[i].data;
									var energyChange = Math.min(energyNeed, data.energy);
									data.energy -= energyChange;
									energyNeed -= energyChange;
									if(energyNeed <= 0){break;}
								}
								SoundAPI.playSound("Machines/Teleporter/TeleUse.ogg")
								Entity.setPosition(ent, receive.x+0.5, receive.y+3, receive.z+0.5);
							}
						}
					}
				}
			}
		}
	},
	
	redstone: function(signal){
		this.data.isActive = signal.power > 0;
		this.renderModel();
	},
	
	renderModel: MachineRegistry.renderModel
});
