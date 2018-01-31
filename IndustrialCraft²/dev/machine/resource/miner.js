IDRegistry.genBlockID("miner");
Block.createBlockWithRotation("miner", [
	{name: "Miner", texture: [["miner_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true}
], "opaque");

Block.registerDropFunction("miner", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

var guiMiner = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Miner"}},
		inventory: {standart: true},
		background: {bitmap: "machine_background"}
	},
	
	params: {       
		slot: "default_slot",
		invSlot: "default_slot"              
	},
	
	drawing: [
		{type: "bitmap", x: 550, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"energyScale": {type: "scale", x: 550, y: 150, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotDrill": {type: "slot", x: 441, y: 75, bitmap: "slot_drill"},
		"slotPipe": {type: "slot", x: 541, y: 75},
		"slotScanner": {type: "slot", x: 641, y: 75, bitmap: "slot_scanner"},
		"slotEnergy": {type: "slot", x: 541, y: 212}
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
	return [[id, 1, data]];
}

MachineRegistry.registerPrototype(BlockID.miner, {
	defaultValues: {
		y: -1,
		progress: 0
	},
	
	getGuiScreen: function(){
		return guiMiner;
	},
	
	drop: function(items){
		var container = World.getContainer(this.x, this.y+1, this.z);
		if(container){
			addItemsToContainers(items, [container]);}
			for(var i in items){
				var item = items[i]
				if(item.count > 0){
				World.drop(this.x+0.5, this.y+1, this.z+0.5, item.id, item.count, item.data);
			}
		}
	},
	
	tick: function(){
		if(World.getThreadTime()%20==0){
			this.data.y = this.y - 1;
			while(World.getBlockID(this.x, this.data.y, this.z) == BlockID.miningPipe){
				this.data.y--;
			}
			var drillSlot = this.container.getSlot("slotDrill");
			if(drillSlot.id == ItemID.drill || drillSlot.id == ItemID.diamondDrill){
				var block = World.getBlock(this.x, this.data.y, this.z);
				if(block.id==0 || (drillSlot.id == ItemID.drill && World.getThreadTime()%80==0 || drillSlot.id == ItemID.diamondDrill && World.getThreadTime()%40==0) && this.data.energy >= 250 && block.id != 7 && block.id != 8 && block.id != 10 && block.id != 120){
					if(block.id > 0){
						World.setBlock(this.x, this.data.y, this.z, 0);
						var coords = {x: this.x, y: this.data.y, z: this.z};
						var drop = getBlockDrop(coords, block.id, block.data, ToolAPI.getToolLevel(drillSlot.id));
						var items = [];
						for(var i in drop){
							items.push({id: drop[i][0], count: drop[i][1], data: drop[i][2]});
						}
						this.drop(items);
						this.data.energy -= 250;
					}
					var pipeSlot = this.container.getSlot("slotPipe");
					if(pipeSlot.id == BlockID.miningPipe && this.data.energy >= 60){
						if(this.data.y+1 < this.y){
						World.setBlock(this.x, this.data.y+1, this.z, BlockID.miningPipe, 0);}
						World.setBlock(this.x, this.data.y, this.z, BlockID.miningPipe, 1);
						pipeSlot.count--;
						if(!pipeSlot.count) pipeSlot.id = 0;
						this.data.energy -= 60;
						this.data.y--;
					}
				}
			}
			else if(this.data.y < this.y - 1){
				if(World.getBlockID(this.x, this.data.y+1, this.z) == BlockID.miningPipe){
					this.drop([{id: BlockID.miningPipe, count: 1, data: 0}]);
					var pipeSlot = this.container.getSlot("slotPipe");
					if(pipeSlot.id != 0 && pipeSlot.id != BlockID.miningPipe){
						World.setBlock(this.x, this.data.y+1, this.z, pipeSlot.id, pipeSlot.data);
						pipeSlot.count--;
						if(!pipeSlot.count) pipeSlot.id = 0;
					}
					else{World.setBlock(this.x, this.data.y+1, this.z, 0);}
				}
			}
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return 10000;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.miner, count: 1, data: 0}, [
		"x#x",
		" b ",
		" b "
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'b', BlockID.miningPipe, 0]);
});