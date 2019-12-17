IDRegistry.genBlockID("solarDistiller");
Block.createBlock("solarDistiller", [
	{name: "Solar Distiller", texture: [["machine_bottom", 0], ["solar_distiller", 0], ["solar_distiller", 0], ["solar_distiller", 0], ["solar_distiller", 0], ["solar_distiller", 0]], inCreative: true}
], "opaque");

Block.registerDropFunction("solarDistiller", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.solarDistiller, count: 1, data: 0}, [
		"aaa",
		"a a",
		"c#c"
	], ['#', BlockID.machineBlockBasic, 0, 'a', 20, -1, 'c', ItemID.cellEmpty, 0]);
});


var guiSolarDistiller = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Solar Distiller")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	params: {       
		slot: "default_slot",
		invSlot: "default_slot"              
	},
	
	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
	],
	
	elements: {
		"slotEnergy": {type: "slot", x: 600, y: 130, isValid: function(id){return ChargeItemRegistry.isValidItem(id, "Eu", 0);}},
		"sun": {type: "image", x: 608, y: 194, bitmap: "sun_off", scale: GUI_SCALE}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiSolarDistiller, "Solar Distiller");
});

MachineRegistry.registerPrototype(BlockID.solarDistiller, {
	defaultValues: {
		canSeeSky: false
	},
	
	getGuiScreen: function(){
		return guiSolarDistiller;
	},
	
	init: function(){
		this.data.canSeeSky = GenerationUtils.canSeeSky(this.x, this.y + 1, this.z);
	},
	
	tick: function(){
		var content = this.container.getGuiContent();
		if(World.getThreadTime()%100 == 0){
			this.data.canSeeSky = GenerationUtils.canSeeSky(this.x, this.y + 1, this.z);
		}
		if(this.data.canSeeSky && World.getLightLevel(this.x, this.y + 1, this.z) == 15){
			
			if(content){ 
				content.elements["sun"].bitmap = "sun_on";
			}
		}
		else if(content){ 
			content.elements["sun"].bitmap = "sun_off";
		}
	}
});
