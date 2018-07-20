IDRegistry.genBlockID("blastFurnace");
Block.createBlockWithRotation("blastFurnace", [
	{name: "Blast Furnace", texture: [["ind_furnace_side", 0], ["ind_furnace_side", 0], ["machine_bottom", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true},
	{name: "Blast Furnace", texture: [["machine_bottom", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: false},
	{name: "Blast Furnace", texture: [["heat_pipe", 0], ["machine_bottom", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: false}
], "opaque");

MachineRenderer.setStandartModel(BlockID.blastFurnace, [["ind_furnace_side", 0], ["ind_furnace_side", 0], ["machine_bottom", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.blastFurnace, [["ind_furnace_side", 1], ["ind_furnace_side", 1], ["machine_bottom", 0], ["heat_pipe", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]], true);

Block.registerDropFunction("blastFurnace", function(coords, blockID, blockData, level, enchant){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("ItemUse", function(coords,item,block){
	if(item.id==BlockID.blastFurnace){
		var pitch = Entity.getLookAngle(Player.get()).pitch;
		if(pitch>VIEW_CONST){
			World.setBlock(coords.relative.x,coords.relative.y,coords.relative.z,BlockID.blastFurnace,8);
		}else if(pitch<-VIEW_CONST){
			World.setBlock(coords.relative.x,coords.relative.y,coords.relative.z,BlockID.blastFurnace,4);
		}
	}
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.blastFurnace, count: 1, data: 0}, [
		"aaa",
		"asa",
		"axa"
	], ['s', BlockID.machineBlockBasic, 0,'a', ItemID.casingIron, 0,'x', ItemID.heatConductor, 0]);
});

Callback.addCallback("PreLoaded", function(){
	MachineRecipeRegistry.registerRecipesFor("blastFrunace", {
		265: {result: [ItemID.ingotSteel, 1, ItemID.slag, 1]},
		"ItemID.dustIron": {result: [ItemID.ingotSteel, 1, ItemID.slag, 1]},
		"ItemID.crushedPurifiedIron": {result: [ItemID.ingotSteel, 1, ItemID.slag, 1]},
		"ItemID.crushedIron": {result: [ItemID.ingotSteel, 1, ItemID.slag, 1]}
	}, true);
});

var guiBlastFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Blast Furnace"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	params: {       
		slot: "default_slot",
		invSlot: "default_slot"              
	},
	
	drawing: [
		{type: "background", color: android.graphics.Color.rgb(179, 179, 179)},
		{type: "bitmap", x: 400, y: 50, bitmap: "blast_furnace_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 540 + 6*GUI_BAR_STANDART_SCALE, y: 110 + 8*GUI_BAR_STANDART_SCALE, bitmap: "progress_scale_background", scale: GUI_BAR_STANDART_SCALE*1.01}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 540 + 6*GUI_BAR_STANDART_SCALE, y: 110 + 8*GUI_BAR_STANDART_SCALE, direction: 1, value: 0.5, bitmap: "progress_scale", scale: GUI_BAR_STANDART_SCALE*1.01},
		"heatScale": {type: "scale", x: 336 + 66*GUI_BAR_STANDART_SCALE, y: 47 + 64*GUI_BAR_STANDART_SCALE, direction: 0, value: 0.5, bitmap: "heat_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 400 + 6*GUI_BAR_STANDART_SCALE, y: 70 + 16*GUI_BAR_STANDART_SCALE},
		"slotResult1": {type: "slot", x: 340 + 124*GUI_BAR_STANDART_SCALE, y: 140 + 20*GUI_BAR_STANDART_SCALE},
		"slotResult2": {type: "slot", x: 400 + 124*GUI_BAR_STANDART_SCALE, y: 140 + 20*GUI_BAR_STANDART_SCALE},
		"slotAir1": {type: "slot", x: 20 + 118*GUI_BAR_STANDART_SCALE, y: 170 + 10*GUI_BAR_STANDART_SCALE},
		"slotAir2": {type: "slot", x: 80 + 118*GUI_BAR_STANDART_SCALE, y: 170 + 10*GUI_BAR_STANDART_SCALE},
		"slotUpgrade1": {type: "slot", x: 330 + 145*GUI_BAR_STANDART_SCALE, y: 50 + 4*GUI_BAR_STANDART_SCALE, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade2": {type: "slot", x: 330 + 145*GUI_BAR_STANDART_SCALE, y: 50 + 22*GUI_BAR_STANDART_SCALE, isValid: UpgradeAPI.isUpgrade},
		"indicator": {type: "image", x: 344 + 88*GUI_BAR_STANDART_SCALE, y: 53 + 58*GUI_BAR_STANDART_SCALE, bitmap: "indicator_red", scale: GUI_BAR_STANDART_SCALE}
	}
});

MachineRegistry.registerPrototype(BlockID.blastFurnace, {
	defaultValues:{
		progress: 0,
		temp: 0,
		airCell:0,
		hasRecipe:false,
		work_time: 6000,
		isActive: false,
		isHeating: false,
		heat: 0,
		signal: 0
	},
	
	getGuiScreen: function(){
       return guiBlastFurnace;
    },
	
	getTransportSlots: function(){
		return {input: ["slotAir1","slotSource"],output:["slotAir2","slotResult2","slotResult1"]};
	},
	
	setDefaultValues: function(){		
		this.data.work_time = this.defaultValues.work_time;
		this.data.isHeating = this.data.signal > 0;
	},
	
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
	
	putResult: function(result, sourceSlot){
		sourceSlot.count--;
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
	
	controlAir:function(){
		var avaribleProgress = this.data.airCell * 18;       
		var numerlicProgress = parseInt(this.data.progress*100);
		var inputSlot = this.container.getSlot("slotAir1");
		var outputSlot = this.container.getSlot("slotAir2");
		if(numerlicProgress<=avaribleProgress){
			return true;
		}else if((outputSlot.id==0||(outputSlot.id==ItemID.cellEmpty&&outputSlot.count<64))&&inputSlot.id==ItemID.cellAir){
			if(outputSlot.id!=0){
				outputSlot.count++;
			}else{
				outputSlot.id=ItemID.cellEmpty;
				outputSlot.count = 1;
			}
			inputSlot.count--;
			this.data.airCell++;
			this.container.validateAll();
			return true;
		}
		return false
	},
	
	controlAirImage:function(content,set){
		if(content){
			if(set){			
				content.elements["indicatorAir"] = null;
			}else{
				content.elements["indicatorAir"] = {type: "image", x: 344 + 110*GUI_BAR_STANDART_SCALE, y: 53 + 20*GUI_BAR_STANDART_SCALE, bitmap: "no_air_image", scale: GUI_BAR_STANDART_SCALE};
			}
		}	
	},
	
	setInducator:function(content,set){
		if(content){	
			if(set){
			content.elements["indicator"].bitmap = "indicator_green";}
			else{
			content.elements["indicator"].bitmap = "indicator_red";}
		};
	},
	
	checkRecipe:function(){
		if(!this.data.hasRecipe){
			var sourceSlot = this.container.getSlot("slotSource");
			if(MachineRecipeRegistry.getRecipeResult("blastFrunace", sourceSlot.id, sourceSlot.data)){
				this.data.hasRecipe = MachineRecipeRegistry.getRecipeResult("blastFrunace", sourceSlot.id, sourceSlot.data);
				sourceSlot.count--;
				this.container.validateAll();
				this.usingTemp = true;
			}
			
		}
	},
	
    tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeUpgrades(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var content = this.container.getGuiContent();
		
		if(this.data.hasRecipe&&this.checkResult(this.data.hasRecipe.result)){
			if(Math.round((this.data.temp/this.getTempStorage())*100)>99){
				if(this.controlAir()){
					this.controlAirImage(content,true);
					this.data.progress += 1/this.data.work_time;
				}else{
					this.controlAirImage(content,false);
				}
				
				if(this.data.progress >= 1){
					this.putResult(this.data.hasRecipe.result, sourceSlot);
					this.data.progress = 0;
					this.data.airCell = 0;
					this.data.hasRecipe = 0;
					this.container.validateAll();
					this.usingTemp = false;
				}
				this.activate();
				this.setInducator(content,true);
			}else{
				this.setInducator(content,false);
				this.deactivate();
			}
		}else{
			this.setInducator(content,false);
			this.checkRecipe();
			this.deactivate();
		}
		
		this.tempTick(.1);
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("heatScale", this.data.temp / this.getTempStorage()||0);
    },
	
	getTempStorage:function(){
		return 50000;
	},
	
	tempTick:function(amount){
		if(this.data.temp){
			this.data.temp-=amount;
		}
	},
	
	usingTemp:false,
	
	redstone: function(signal){
		this.data.signal = signal.power > 0;
	},
	init: MachineRegistry.initModel,
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy:  function(){this.deactivate()}, 
},true);