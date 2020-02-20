IDRegistry.genBlockID("miner");
Block.createBlock("miner", [
	{name: "Miner", texture: [["miner_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.miner, [["miner_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.miner, 0, [["miner_bottom", 1], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.miner, 4, [["miner_bottom", 1], ["machine_top", 0], ["machine_side", 0], ["miner_front", 1], ["miner_side", 1], ["miner_side", 1]]);

ItemName.addTierTooltip("miner", 2);

Block.registerDropFunction("miner", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

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

	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},

	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
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
				if(id < 256 || id >= 8192) return true;
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


var dropData0 = [3, 25, 39, 40, 46, 50, 53, 54, 58, 65, 72, 96, 107, 134, 135, 136, 143, 146, 163, 164, 165, 170, 183, 184, 185, 186, 187];
// noDrop = [6, 18, 30, 31, 32, 59, 81, 83, 86, 92, 99, 100, 103, 104, 105, 106, 111, 115, 127, 131, 132, 140, 141, 142, 161, 175, 244];

function getBlockDrop(coords, id, data, level, enchant, smelt){
	if(smelt){
		if(id == 78) return [];
		if(id == 80){
			World.setBlock(coords.x, coords.y, coords.z, 8);
			return [];
		}
	}
	var dropFunc = Block.dropFunctions[id];
	if(dropFunc){
		return dropFunc(coords, id, data, level, enchant || {});
	}
	if(id==5 || id == 19 || id==35 || id==85 || id==144 || id==171) return [[id, 1, data]];
	if(id == 17 || id == 162) return [[id, 1, data%4]];
	if(id == 26) return [[355, 1, 0]];
	if(id == 47){
		if(enchant.silk) return [[47, 1, 0]];
		return [[340, 3, 0]];
	}
	if(id == 55) return [[331, 1, 0]];
	if(id == 60) return [[3, 1, 0]];
	if(id == 63 || id == 68) return [[338, 1, 0]];
	if(id == 64) return [[324, 1, 0]];
	if(id == 75 || id == 76) return [[76, 1, 0]];
	if(id == 79 || id == 174){
		World.setBlock(coords.x, coords.y, coords.z, 8);
		return [];
	}
	if(id == 93 || id == 94) return [[356, 1, 0]];
	if(id == 149 || id == 150) return [[404, 1, 0]];
	if(id == 151 || id == 178) return [[151, 1, 0]];
	if(id == 158) return [[158, 1, data%8]];
	if(id == 193) return [[427, 1, 0]];
	if(id == 194) return [[428, 1, 0]];
	if(id == 195) return [[429, 1, 0]];
	if(id == 196) return [[430, 1, 0]];
	if(id == 197) return [[431, 1, 0]];
	if(dropData0.indexOf(id) != -1) return [[id, 1, 0]];
	return [];
}

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
			if(this.data.x > this.x+r){
				this.data.x = this.x-r;
				this.data.z++;
			}
			if(this.data.z > this.z+r) break;
			var blockID = World.getBlockID(this.data.x, this.data.scanY, this.data.z);
			if(ore_blocks.indexOf(blockID) != -1 && level >= ToolAPI.getBlockDestroyLevel(blockID)){
				return true;
			}
			this.data.x++;
		}
		return false;
	},
	
	isValid: function(block){
		if(block.id == 0 || block.id > 7 && block.id < 12 && block.data > 0) return true;
		return false;
	},

	canBeDestroyed: function(blockID, level){
		var material = ToolAPI.getBlockMaterial(blockID);
		if(!material || material.name != "unbreaking" && level >= ToolAPI.getBlockDestroyLevel(blockID)){
			return true;
		}
		return false;
	},
	
	findPath: function(x, y, z, sprc, level){
		var block = World.getBlock(x, y, z);
		if(block.id==BlockID.miningPipe || this.isValid(block)){
			var dx = this.data.x - x;
			var dz = this.data.z - z;
			if(Math.abs(dx) == Math.abs(dz)){
				var prc = sprc;
			}else if(Math.abs(dx) > Math.abs(dz)){
				var prc = 0;
			}else{
				var prc = 1;
			}
			if(prc == 0){
				if(dx > 0) x++;
				else x--;
			}else{
				if(dz > 0) z++;
				else z--;
			}
			return this.findPath(x, y, z, sprc, level);
		}else if(this.canBeDestroyed(block.id, level)){
			return {x: x, y: y, z: z};
		}
		this.data.x++;
		return;
	},
	
	mineBlock: function(x, y, z, block, level){
		var drop = getBlockDrop({x: x,  y: y, z: z}, block.id, block.data, level);
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
					}else{
						container.setSlot(i, 0, 0, 0);
					}
				}
			}
		}
		World.setBlock(x, y, z, 0);
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
		if(containers){
			StorageInterface.putItems(items, containers, this);
		}
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
				if(scanner.id == ItemID.scanner && scanner.data + 50 <= Item.getMaxDamage(scanner.id)){
					scanner.data += 50;
					r = scan_radius;
				}else if(scanner.id == ItemID.scannerAdvanced && scanner.data + 250 <= Item.getMaxDamage(scanner.id)){
					scanner.data += 250;
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
				var coords  = this.findPath(this.x, this.data.y, this.z, prc, level);
				if(coords){
					var block = World.getBlock(coords.x, coords.y, coords.z);
					var params = this.getMiningValues(drillSlot);
					if(this.data.energy >= params.energy){
						this.data.energy -= params.energy;
						this.data.progress++;
						newActive = true;
					}
					if(this.data.progress >= params.time){
						this.mineBlock(coords.x, coords.y, coords.z, block, level);
					}
				}
			}
			else if(this.data.y > 0 && pipeSlot.id == BlockID.miningPipe){
				var block = World.getBlock(this.x, this.data.y-1, this.z);
				if(this.isValid(block)){
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
					if(pipeSlot.id < 256 && pipeSlot.id > 0 || pipeSlot.id >= 8192 && pipeSlot.id != BlockID.miningPipe){
						World.setBlock(this.x, this.data.y, this.z, pipeSlot.id, pipeSlot.data);
						pipeSlot.count--;
						if(!pipeSlot.count) pipeSlot.id = 0;
					}
					else{World.setBlock(this.x, this.data.y, this.z, 0);}
					this.data.progress = 0;
				}
			}
		}
		if(newActive){
			this.startPlaySound("Machines/MinerOp.ogg");
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

	getEnergyStorage: function(){
		return 10000;
	},
	
	renderModel: MachineRegistry.renderModelWithRotation,
	energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

TileRenderer.setRotationPlaceFunction(BlockID.miner);
