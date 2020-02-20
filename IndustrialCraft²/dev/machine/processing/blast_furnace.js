IDRegistry.genBlockID("blastFurnace");
Block.createBlock("blastFurnace", [
	{name: "Blast Furnace", texture: [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true},
], "opaque");
TileRenderer.setStandartModel(BlockID.blastFurnace, [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.blastFurnace, 0, [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.blastFurnace, 6, [["machine_advanced", 0], ["ind_furnace_side", 1], ["machine_back", 0], ["heat_pipe", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]]);

Block.registerDropFunction("blastFurnace", function(coords, blockID, blockData, level, enchant){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.blastFurnace, count: 1, data: 0}, [
		"aaa",
		"asa",
		"axa"
	], ['s', BlockID.machineBlockBasic, 0, 'a', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
	
	MachineRecipeRegistry.registerRecipesFor("blastFurnace", {
		15: {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000},
		265: {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000},
		"ItemID.dustIron": {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000},
		"ItemID.crushedPurifiedIron": {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000},
		"ItemID.crushedIron": {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000}
	}, true);
});


var guiBlastFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Blast Furnace")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	params: {       
		slot: "default_slot",
		invSlot: "default_slot"              
	},
	
	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
		{type: "bitmap", x: 400, y: 50, bitmap: "blast_furnace_background", scale: GUI_SCALE},
		{type: "bitmap", x: 540 + 6*GUI_SCALE, y: 110 + 8*GUI_SCALE, bitmap: "progress_scale_background", scale: GUI_SCALE*1.01}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 540 + 6*GUI_SCALE, y: 110 + 8*GUI_SCALE, direction: 1, value: 0.5, bitmap: "progress_scale", scale: GUI_SCALE*1.01},
		"heatScale": {type: "scale", x: 336 + 66*GUI_SCALE, y: 47 + 64*GUI_SCALE, direction: 0, value: 0.5, bitmap: "heat_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 400 + 6*GUI_SCALE, y: 70 + 16*GUI_SCALE, isValid: function(id){
			return MachineRecipeRegistry.hasRecipeFor("blastFurnace", id);
		}},
		"slotResult1": {type: "slot", x: 340 + 124*GUI_SCALE, y: 140 + 20*GUI_SCALE, isValid: function(){return false;}},
		"slotResult2": {type: "slot", x: 400 + 124*GUI_SCALE, y: 140 + 20*GUI_SCALE, isValid: function(){return false;}},
		"slotAir1": {type: "slot", x: 20 + 118*GUI_SCALE, y: 170 + 10*GUI_SCALE, isValid: function(id){return id == ItemID.cellAir;}},
		"slotAir2": {type: "slot", x: 80 + 118*GUI_SCALE, y: 170 + 10*GUI_SCALE, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 330 + 145*GUI_SCALE, y: 50 + 4*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 330 + 145*GUI_SCALE, y: 50 + 22*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"indicator": {type: "image", x: 344 + 88*GUI_SCALE, y: 53 + 58*GUI_SCALE, bitmap: "indicator_red", scale: GUI_SCALE}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiBlastFurnace, "Blast Furnace");
});

MachineRegistry.registerPrototype(BlockID.blastFurnace, {
	defaultValues:{
		meta: 0,
		progress: 0,
		air: 0,
		sourceID: 0,
		isActive: false,
		isHeating: false,
		heat: 0,
		signal: 0
	},
	
	upgrades: ["redstone", "itemEjector", "itemPulling"],
	
	getGuiScreen: function(){
       return guiBlastFurnace;
    },
	
	wrenchClick: function(id, count, data, coords){
		this.setFacing(coords);
	},
	
	setFacing: MachineRegistry.setFacing,
	
	checkResult: function(result){
		for(var i = 1; i < 3; i++){
			var id = result[(i-1)*2];
			var count = result[(i-1)*2+1];
			var resultSlot = this.container.getSlot("slotResult"+i);
			if((resultSlot.id != id || resultSlot.count + count > 64) && resultSlot.id != 0){
				return false;
			}
		}
		return true;
	},
	
	putResult: function(result){
		for(var i = 1; i < 3; i++){
			var id = result[(i-1)*2];
			var count = result[(i-1)*2+1];
			var resultSlot = this.container.getSlot("slotResult"+i);
			if(id){
				resultSlot.id = id;
				resultSlot.count += count;
			}
		}
	},
	
	controlAir: function(){
		var slot1 = this.container.getSlot("slotAir1");
		var slot2 = this.container.getSlot("slotAir2");
		if(this.data.air == 0){
			if(slot1.id==ItemID.cellAir && (slot2.id==0 || slot2.id==ItemID.cellEmpty && slot2.count < 64)){
				slot1.count--;
				slot2.id = ItemID.cellEmpty;
				slot2.count++;
				this.data.air = 1000;
			}
		}
		if(this.data.air > 0){
			this.data.air--;
			return true;
		}
		return false;
	},
	
	controlAirImage: function(content, set){
		if(content){
			if(set)		
			content.elements["indicatorAir"] = null;
			else
			content.elements["indicatorAir"] = {type: "image", x: 344 + 110*GUI_SCALE, y: 53 + 20*GUI_SCALE, bitmap: "no_air_image", scale: GUI_SCALE};
		}
	},
	
	setIndicator: function(content,set){
		if(content){
			if(set)
			content.elements["indicator"].bitmap = "indicator_green";
			else
			content.elements["indicator"].bitmap = "indicator_red";
		}
	},
	
    tick: function(){
		this.data.isHeating = this.data.signal > 0;
		UpgradeAPI.executeUpgrades(this);
		
		var maxHeat = this.getMaxHeat();
		this.container.setScale("heatScale", this.data.heat / maxHeat);
		var content = this.container.getGuiContent();
		
		if(this.data.heat >= maxHeat){
			this.setIndicator(content, true);
			var sourceSlot = this.container.getSlot("slotSource");
			var source = this.data.sourceID || sourceSlot.id;
			var result = MachineRecipeRegistry.getRecipeResult("blastFurnace", source);
			if(result && this.checkResult(result.result)){
				if(this.controlAir()){
					this.controlAirImage(content, true);
					this.data.progress++;
					this.container.setScale("progressScale", this.data.progress / result.duration);
					this.activate();
					
					if(!this.data.sourceID){
						this.data.sourceID = source;
						sourceSlot.count--;
					}
					
					if(this.data.progress >= result.duration){
						this.putResult(result.result);
						this.data.progress = 0;
						this.data.sourceID = 0;
					}
					this.container.validateAll();
				}
				else this.controlAirImage(content, false);
			}
		}else{
			this.setIndicator(content, false);
			this.deactivate();
		}
		
		this.data.heat = Math.max(this.data.heat - 1, 0);
		if(this.data.sourceID == 0){
			this.container.setScale("progressScale", 0);
		}
    },
	
	getMaxHeat: function(){
		return 47500;
	},
	
	redstone: function(signal){
		this.data.signal = signal.power > 0;
	},
	
	canReceiveHeat: function(side){
		return this.data.meta == side + Math.pow(-1, side);
	},
	
	heatReceive: function(amount){
		var slot = this.container.getSlot("slotSource");
		if(this.data.isHeating || this.data.sourceID > 0 || MachineRecipeRegistry.getRecipeResult("blastFurnace", slot.id)){
			amount = Math.min(this.getMaxHeat() - this.data.heat, Math.min(amount, 20));
			this.data.heat += amount;
			return amount;
		}
		return 0;
	},
	
	renderModel: MachineRegistry.renderModelWith6Sides,
});

TileRenderer.setRotationPlaceFunction(BlockID.blastFurnace, true);

StorageInterface.createInterface(BlockID.blastFurnace, {
	slots: {
		"slotSource": {input: true,
			isValid: function(item){
				return MachineRecipeRegistry.hasRecipeFor("blastFurnace", item.id);
			}
		},
		"slotAir1": {input: true, 
			isValid: function(item){
				return item.id == ItemID.cellAir;
			}
		},
		"slotAir2": {output: true},
		"slotResult1": {output: true},
		"slotResult2": {output: true}
	}
});
