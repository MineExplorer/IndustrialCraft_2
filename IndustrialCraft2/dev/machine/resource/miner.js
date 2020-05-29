IDRegistry.genBlockID("miner");
Block.createBlock("miner", [
	{name: "Miner", texture: [["miner_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true}
], "machine");
TileRenderer.setStandartModel(BlockID.miner, [["miner_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.miner, 0, [["miner_bottom", 1], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.miner, 4, [["miner_bottom", 1], ["machine_top", 0], ["machine_side", 0], ["miner_front", 1], ["miner_side", 1], ["miner_side", 1]]);

ItemName.addTierTooltip("miner", 2);

MachineRegistry.setMachineDrop("miner", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.miner, count: 1, data: 0}, [
		"x#x",
		" b ",
		" b "
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'b', BlockID.miningPipe, 0]);
});


var guiMiner = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Miner")}},
		inventory: {standart: true},
		background: {standart: true},
	},

	drawing: [
		{type: "bitmap", x: 550, y: 150, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"energyScale": {type: "scale", x: 550, y: 150, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotDrill": {type: "slot", x: 441, y: 75, bitmap: "slot_drill", 
			isValid: function(id){
				if(id == ItemID.drill || id == ItemID.diamondDrill) return true;
				return false;
			}
		},
		"slotPipe": {type: "slot", x: 541, y: 75,
			isValid: function(id){
				if(ToolLib.isBlock(id) && !TileEntity.isTileEntityBlock(id)) return true;
				return false;
			}
		},
		"slotScanner": {type: "slot", x: 641, y: 75, bitmap: "slot_scanner", 
			isValid: function(id){
				if(id == ItemID.scanner || id == ItemID.scannerAdvanced) return true;
				return false;
			}
		},
		"slotEnergy": {type: "slot", x: 541, y: 212, isValid: MachineRegistry.isValidEUStorage},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiMiner, "Miner");
});


MachineRegistry.registerElectricMachine(BlockID.miner, {
	defaultValues: {
		meta: 0,
		x: 0,
		y: 0,
		z: 0,
		scanY: 0,
		scanR: 0,
		progress: 0,
		isActive: false
	},

	getGuiScreen: function(){
		return guiMiner;
	},
	
	getTier: function(){
		return 2;
	},
	
	getMiningValues: function(slot){
		if(slot.id == ItemID.drill) return {energy: 6, time: 100}
		return {energy: 20, time: 50}
	},
	
	findOre: function(level){
		var r = this.data.scanR;
		while (r){
			if(this.data.x > this.x + r){
				this.data.x = this.x - r;
				this.data.z++;
			}
			if(this.data.z > this.z + r) break;
			var blockID = World.getBlockID(this.data.x, this.data.scanY, this.data.z);
			if(ore_blocks.indexOf(blockID) != -1 && level >= ToolAPI.getBlockDestroyLevel(blockID)){
				return true;
			}
			this.data.x++;
		}
		return false;
	},
	
	isEmptyBlock: function(block){
		return block.id == 0 || block.id == 51 || block.id >= 8 && block.id <= 11 && block.data > 0;
	},

	canBeDestroyed: function(blockID, level){
		if(ToolAPI.getBlockMaterialName(blockID) != "unbreaking" && level >= ToolAPI.getBlockDestroyLevel(blockID)){
			return true;
		}
		return false;
	},
	
	findPath: function(x, y, z, sprc, level){
		var block = World.getBlock(x, y, z);
		if(block.id == BlockID.miningPipe || this.isEmptyBlock(block)){
			var dx = this.data.x - x;
			var dz = this.data.z - z;
			if(Math.abs(dx) == Math.abs(dz)){
				var prc = sprc;
			} else if(Math.abs(dx) > Math.abs(dz)){
				var prc = 0;
			} else {
				var prc = 1;
			}
			if(prc == 0){
				if(dx > 0) x++;
				else x--;
			} else {
				if(dz > 0) z++;
				else z--;
			}
			return this.findPath(x, y, z, sprc, level);
		} else if(this.canBeDestroyed(block.id, level)){
			return {x: x, y: y, z: z};
		}
		this.data.x++;
		return;
	},
	
	mineBlock: function(x, y, z, block, level){
		var drop = ToolLib.getBlockDrop({x: x, y: y, z: z}, block.id, block.data, level);
		var items = [];
		for(var i in drop){
			items.push({id: drop[i][0], count: drop[i][1], data: drop[i][2]});
		}
		var container = World.getContainer(x, y, z);
		if(container){
			slots = StorageInterface.getContainerSlots(container);
			for(var i in slots){
				var slot = container.getSlot(slots[i]);
				if(slot.id > 0){
					items.push({id: slot.id, count: slot.count, data: slot.data, extra: slot.extra});
					if(container.slots){
						slot.id = slot.count = slot.data = 0;
					} else {
						container.setSlot(i, 0, 0, 0);
					}
				}
			}
		}
		if(block.id == 79){
			World.setBlock(x, y, z, 8);
		} else {
			World.setBlock(x, y, z, 0);
		}
		this.drop(items);
		this.data.progress = 0;
	},
	
	setPipe: function(y, slot){
		if(y < this.y)
			World.setBlock(this.x, y, this.z, BlockID.miningPipe, 0);
		World.setBlock(this.x, y-1, this.z, BlockID.miningPipe, 1);
		slot.count--;
		if(!slot.count) slot.id = 0;
		this.data.progress = 0;
	},
	
	drop: function(items){
		var containers = StorageInterface.getNearestContainers(this, 0, true);
		StorageInterface.putItems(items, containers);
		for(var i in items){
			var item = items[i]
			if(item.count > 0){
				nativeDropItem(this.x+0.5, this.y+1, this.z+0.5, 2, item.id, item.count, item.data, item.extra);
			}
		}
	},
	
	tick: function(){
		if(this.data.progress == 0){
			var y = this.y;
			while(World.getBlockID(this.x, y-1, this.z) == BlockID.miningPipe){
				y--;
			}
			this.data.y = y;
		}
		
		var newActive = false;
		var drillSlot = this.container.getSlot("slotDrill");
		var pipeSlot = this.container.getSlot("slotPipe");
		if(drillSlot.id == ItemID.drill || drillSlot.id == ItemID.diamondDrill){
			if(this.data.y < this.y && this.data.scanY != this.data.y){
				var r = 0;
				var scanner = this.container.getSlot("slotScanner");
				var energyStored = ChargeItemRegistry.getEnergyStored(scanner);
				if(scanner.id == ItemID.scanner && energyStored >= 50){
					ChargeItemRegistry.setEnergyStored(scanner, energyStored - 50);
					r = scan_radius;
				} else if(scanner.id == ItemID.scannerAdvanced && energyStored >= 250){
					ChargeItemRegistry.setEnergyStored(scanner, energyStored - 250);
					r = adv_scan_radius;
				}
				this.data.x = this.x - r;
				this.data.z = this.z - r;
				this.data.scanY = this.data.y;
				this.data.scanR = r;
			}
			var level = ToolAPI.getToolLevel(drillSlot.id);
			if(this.data.y < this.y && this.findOre(level)){
				var dx = this.data.x - this.x;
				var dz = this.data.z - this.z;
				var prc = 0;
				if(Math.abs(dx) > Math.abs(dz)){
					prc = 1;
				}
				var coords = this.findPath(this.x, this.data.y, this.z, prc, level);
				if(coords){
					var block = World.getBlock(coords.x, coords.y, coords.z);
					var params = this.getMiningValues(drillSlot);
					if(this.data.energy >= params.energy){
						this.data.energy -= params.energy;
						this.data.progress++;
						newActive = true;
					}
					if(this.data.progress >= params.time){
						level = ToolAPI.getToolLevelViaBlock(drillSlot.id, block.id);
						this.mineBlock(coords.x, coords.y, coords.z, block, level);
					}
				}
			}
			else if(this.data.y > 0 && pipeSlot.id == BlockID.miningPipe){
				var block = World.getBlock(this.x, this.data.y-1, this.z);
				if(this.isEmptyBlock(block)){
					if(this.data.energy >= 3){
						this.data.energy -= 3;
						this.data.progress++;
						newActive = true;
					}
					if(this.data.progress >= 20){
						this.setPipe(this.data.y, pipeSlot);
					}
				}
				else if(this.canBeDestroyed(block.id, level)){
					var block = World.getBlock(this.x, this.data.y-1, this.z);
					var params = this.getMiningValues(drillSlot);
					if(this.data.energy >= params.energy){
						this.data.energy -= params.energy;
						this.data.progress++;
						newActive = true;
					}
					if(this.data.progress >= params.time){
						level = ToolAPI.getToolLevelViaBlock(drillSlot.id, block.id);
						this.mineBlock(this.x, this.data.y-1, this.z, block, level);
						this.setPipe(this.data.y, pipeSlot);
					}
				}
			}
		}
		else {
			if(World.getBlockID(this.x, this.data.y, this.z) == BlockID.miningPipe){
				if(this.data.energy >= 3){
					this.data.energy -= 3;
					this.data.progress++;
					newActive = true;
				}
				if(this.data.progress >= 20){
					this.drop([{id: BlockID.miningPipe, count: 1, data: 0}]);
					var pipeSlot = this.container.getSlot("slotPipe");
					if(pipeSlot.id != 0 && pipeSlot.id != BlockID.miningPipe && ToolLib.isBlock(pipeSlot.id) && !TileEntity.isTileEntityBlock(id)){
						var blockId = Block.convertItemToBlockId(pipeSlot.id);
						World.setBlock(this.x, this.data.y, this.z, blockId, pipeSlot.data);
						pipeSlot.count--;
						if(pipeSlot.count == 0) pipeSlot.id = 0;
					}
					else{World.setBlock(this.x, this.data.y, this.z, 0);}
					this.data.scanY = 0;
					this.data.progress = 0;
				}
			}
		}
		if(newActive){
			this.startPlaySound();
		} else {
			this.stopPlaySound();
		}
		this.setActive(newActive);

		var energyStorage = this.getEnergyStorage();
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotDrill"), "Eu", this.data.energy, 2);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotScanner"), "Eu", this.data.energy, 2);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, 2);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},

	getOperationSound: function() {
		return "MinerOp.ogg";
	},

	getEnergyStorage: function(){
		return 10000;
	},
	
	renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.miner);
