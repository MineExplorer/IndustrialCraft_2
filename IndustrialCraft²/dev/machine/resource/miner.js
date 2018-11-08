IDRegistry.genBlockID("miner");
Block.createBlockWithRotation("miner", [
	{name: "Miner", texture: [["miner_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.miner, [["miner_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]], true);
MachineRenderer.registerModelWithRotation(BlockID.miner, [["miner_bottom", 1], ["machine_top", 0], ["machine_side", 0], ["miner_front", 1], ["miner_side", 0], ["miner_side", 1]]);

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
		header: {text: {text: "Miner"}},
		inventory: {standart: true},
		background: {standart: true},
	},

	params: {       
		slot: "default_slot",
		invSlot: "default_slot"              
	},

	drawing: [
		{type: "background", color: android.graphics.Color.rgb(179, 179, 179)},
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

function getBlockDrop(coords, id, data, level){
	var dropFunc = Block.dropFunctions[id];
	if(dropFunc){
		return dropFunc(coords, id, data, level, {});
	}
	if(dirtBlocksDrop[id]){
		return [[dirtBlocksDrop[id], 1, 0]];
	}
	// TO DO: other blocks
	return [[id, 1, data]];
}

MachineRegistry.registerPrototype(BlockID.miner, {
	defaultValues: {
	    power_tier: 1,
        x: 0,
        y: 0,
        z: 0,
		scanY: 0,
        scanR: 0,
		progress: 0
	},

	getGuiScreen: function(){
		return guiMiner;
	},
	
	getMiningValues: function(slot){
		if(slot.id == ItemID.drill) return {energy: 6, time: 100}
		return {energy: 20, time: 50}
	},
	
	findOre: function(level){
		var r = this.data.scanR;
		while (1){
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
		World.setBlock(x, y, z, 0);
		var drop = getBlockDrop({x: x,  y: y, z: z}, block.id, block.data, level);
		var items = [];
		for(var i in drop){
			items.push({id: drop[i][0], count: drop[i][1], data: drop[i][2]});
		}
		this.drop(items);
		this.data.progress = 0;
	},
	
	setPipe: function(x, y, z, slot){
		if(y < this.y)
			World.setBlock(this.x, y, this.z, BlockID.miningPipe, 0);
		World.setBlock(this.x, y-1, this.z, BlockID.miningPipe, 1);
		slot.count--;
		if(!slot.count) slot.id = 0;
		this.data.progress = 0;
	},
	
	drop: function(items){
		var container = World.getContainer(this.x, this.y+1, this.z);
		if(container){
			addItemsToContainers(items, [container]);
		}
		for(var i in items){
			var item = items[i]
			if(item.count > 0){
				World.drop(this.x+0.5, this.y+1, this.z+0.5, item.id, item.count, item.data);
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
		
		var lastProgress = this.data.progress;
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
						this.activate();
					}else{
						this.deactivate();
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
						this.data.progress++;
						this.data.energy -= 3;
					}
					if(this.data.progress >= 20){
						this.setPipe(this.data.x, this.data.y, this.data.z, pipeSlot);
					}
				}
				else if(this.canBeDestroyed(block.id, level)){
					var block = World.getBlock(this.data.x, this.data.y-1, this.data.z);
					var params = this.getMiningValues(drillSlot);
					if(this.data.energy >= params.energy){
						this.data.energy -= params.energy;
						this.data.progress++;
					}
					if(this.data.progress >= params.time){
						this.mineBlock(this.data.x, this.data.y-1, this.data.z, block, level);
						this.setPipe(this.data.x, this.data.y, this.data.z, pipeSlot);
					}
				}
			}
		}
		else {
			if(World.getBlockID(this.x, this.data.y, this.z) == BlockID.miningPipe){
				if(this.data.energy >= 3){
					this.data.progress++;
					this.data.energy -= 3;
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
		if(lastProgress != this.data.progress){
			this.activate();
		}else{
			this.deactivate();
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotDrill"), "Eu", this.data.energy, 128, 1);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotScanner"), "Eu", this.data.energy, 128, 1);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, 128, 1);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},

	getEnergyStorage: function(){
		return 10000;
	},
	
	init: MachineRegistry.initModel,
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy: this.deactivate,
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});