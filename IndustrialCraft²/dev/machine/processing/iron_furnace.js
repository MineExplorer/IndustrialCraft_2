IDRegistry.genBlockID("ironFurnace");
Block.createBlock("ironFurnace", [
	{name: "Iron Furnace", texture: [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 0], ["iron_furnace_side", 0], ["iron_furnace_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.ironFurnace, [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 0], ["iron_furnace_side", 0], ["iron_furnace_side", 0]]);
TileRenderer.registerRotationModel(BlockID.ironFurnace, 0, [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 0], ["iron_furnace_side", 0], ["iron_furnace_side", 0]]);
TileRenderer.registerRotationModel(BlockID.ironFurnace, 4, [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 1], ["iron_furnace_side", 0], ["iron_furnace_side", 0]]);

Block.registerDropFunction("ironFurnace", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.ironFurnace, count: 1, data: 0}, [
		" x ",
		"x x",
		"x#x"
	], ['#', 61, -1, 'x', ItemID.plateIron, 0]);
});


var guiIronFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Iron Furnace")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "arrow_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "fire_background", scale: GUI_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "arrow_bar_scale", scale: GUI_SCALE},
		"burningScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 441, y: 79, isValid: function(id, count, data){
			return Recipes.getFurnaceRecipeResult(id, "iron")? true : false;
		}},
		"slotFuel": {type: "slot", x: 441, y: 218, isValid: function(id, count, data){
			return Recipes.getFuelBurnDuration(id, data) > 0;
		}},
		"slotResult": {type: "slot", x: 625, y: 148, isValid: function(){return false;}},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiIronFurnace, "Iron Furnace");
});

MachineRegistry.registerPrototype(BlockID.ironFurnace, {
	defaultValues: {
		meta: 0,
		progress: 0,
		burn: 0,
		burnMax: 0,
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiIronFurnace;
	},
	
	tick: function(){
		StorageInterface.checkHoppers(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var resultSlot = this.container.getSlot("slotResult");
		var result = Recipes.getFurnaceRecipeResult(sourceSlot.id, "iron");
		var resetProgress = true;
		if (result && (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0)) {
			if (this.data.burn == 0) {
				this.data.burn = this.data.burnMax = this.getFuel("slotFuel");
			}
			if (this.data.burn > 0) {
				resetProgress = false;
				if (this.data.progress++ >= 160) {
					sourceSlot.count--;
					resultSlot.id = result.id;
					resultSlot.data = result.data;
					resultSlot.count++;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		if (resetProgress) {
			this.data.progress = 0;
		}
		
		if(this.data.burn > 0){
			this.data.burn--;
			this.activate();
			this.startPlaySound("Machines/IronFurnaceOp.ogg");
		} else {
			this.stopPlaySound();
			this.deactivate();
		}
		
		this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
		this.container.setScale("progressScale", this.data.progress / 160);
	},
	
	getFuel: function(slotName){
		var fuelSlot = this.container.getSlot(slotName);
		if(fuelSlot.id > 0){
			var burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
			if(burn){
				if(LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)){
					var empty = LiquidRegistry.getEmptyItem(fuelSlot.id, fuelSlot.data);
					fuelSlot.id = empty.id;
					fuelSlot.data = empty.data;
					return burn;
				}
				fuelSlot.count--;
				this.container.validateSlot(slotName);
				return burn;
			}
		}
		return 0;
	},
	
	renderModel: MachineRegistry.renderModelWithRotation,
});

TileRenderer.setRotationPlaceFunction(BlockID.ironFurnace);

StorageInterface.createInterface(BlockID.ironFurnace, {
	slots: {
		"slotSource": {input: true,
			isValid: function(item, side){
				return side != 0 && Recipes.getFurnaceRecipeResult(item.id, "iron");
			}
		},
		"slotFuel": {input: true, 
			isValid: function(item, side){
				return side != 1 && Recipes.getFuelBurnDuration(item.id, item.data) > 0;
			}
		},
		"slotResult": {output: true}
	}
});