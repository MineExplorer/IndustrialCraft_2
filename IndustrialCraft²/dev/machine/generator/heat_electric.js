IDRegistry.genBlockID("electricHeatGenerator");
Block.createBlock("electricHeatGenerator", [
	{name: "Electric Heat Generator", texture: [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true},
], "opaque");
TileRenderer.setStandartModel(BlockID.electricHeatGenerator, [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.electricHeatGenerator, 0, [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.electricHeatGenerator, 6, [["machine_bottom", 0], ["ind_furnace_side", 1], ["heat_generator_side", 1], ["heat_pipe", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]]);

ItemName.addTierTooltip("electricHeatGenerator", 4);

Block.registerDropFunction("electricHeatGenerator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.electricHeatGenerator);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.electricHeatGenerator, count: 1, data: 0}, [
		"xbx",
		"x#x",
		"xax"
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.casingIron, 0, 'a', ItemID.heatConductor, 0, 'b', ItemID.storageBattery, -1]);
});


var guiElectricHeatGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Electric Heat Generator")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 342, y: 110, bitmap: "energy_small_background", scale: GUI_SCALE},
		{type: "bitmap", x: 461, y: 250, bitmap: "black_line", scale: GUI_SCALE}
	],
	
	elements: {
		"slot0": {type: "slot", x: 440, y: 120, isValid: function(id, c, d, cont){return checkCoilSlot(0, id, c, d, cont)}},
		"slot1": {type: "slot", x: 500, y: 120, isValid: function(id, c, d, cont){return checkCoilSlot(1, id, c, d, cont)}},
		"slot2": {type: "slot", x: 560, y: 120, isValid: function(id, c, d, cont){return checkCoilSlot(2, id, c, d, cont)}},
		"slot3": {type: "slot", x: 620, y: 120, isValid: function(id, c, d, cont){return checkCoilSlot(3, id, c, d, cont)}},
		"slot4": {type: "slot", x: 680, y: 120, isValid: function(id, c, d, cont){return checkCoilSlot(4, id, c, d, cont)}},
		"slot5": {type: "slot", x: 440, y: 180, isValid: function(id, c, d, cont){return checkCoilSlot(5, id, c, d, cont)}},
		"slot6": {type: "slot", x: 500, y: 180, isValid: function(id, c, d, cont){return checkCoilSlot(6, id, c, d, cont)}},
		"slot7": {type: "slot", x: 560, y: 180, isValid: function(id, c, d, cont){return checkCoilSlot(7, id, c, d, cont)}},
		"slot8": {type: "slot", x: 620, y: 180, isValid: function(id, c, d, cont){return checkCoilSlot(8, id, c, d, cont)}},
		"slot9": {type: "slot", x: 680, y: 180, isValid: function(id, c, d, cont){return checkCoilSlot(9, id, c, d, cont)}},
		"slotEnergy": {type: "slot", x: 340, y: 180, isValid: MachineRegistry.isValidEUStorage},
		"energyScale": {type: "scale", x: 342, y: 110, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"textInfo1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 530, y: 264, width: 300, height: 30, text: "0    /"},
		"textInfo2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 630, y: 264, width: 300, height: 30, text: "0"}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiElectricHeatGenerator, "Electric Heat Generator");
});

function checkCoilSlot(i, id, count, data, container){
	var slot = container.getSlot("slot"+i)
	if(id == ItemID.coil && slot.id == 0){
		if(count == 1) return true;
		var slotFinded = false;
		for(var i = 9; i < 46; i++){
			var invSlot = Player.getInventorySlot(i);
			if(invSlot.id == id && invSlot.count == count){
				Player.setInventorySlot(i, id, count - 1, data);
				slotFinded = true;
				break;
			}
		}
		if(slotFinded){
			slot.id = id;
			slot.count = 1;
		}
	}
	return false;
}


MachineRegistry.registerElectricMachine(BlockID.electricHeatGenerator, {
    defaultValues: {
		meta: 0,
		energy_storage: 2000,
		isActive: false
	},
    
	getGuiScreen: function(){
		return guiElectricHeatGenerator;
	},
	
	getTier: function(){
		return 4;
	},
	
	wrenchClick: function(id, count, data, coords){
		this.setFacing(coords);
	},
	
	setFacing: MachineRegistry.setFacing,
	
	calcOutput:function(){
		var maxOutput = 0;
		for(var i = 0; i < 10; i++){
			var slot = this.container.getSlot("slot"+i);
			if(slot.id==ItemID.coil)
			maxOutput += 20;
		}
		return maxOutput;
	},
	
	tick: function(){
		var maxOutput = this.calcOutput();
		var output = 0;
		
		if(this.data.energy >= 1){
			var coords = StorageInterface.getRelativeCoords(this, this.data.meta);
			var TE = World.getTileEntity(coords.x, coords.y, coords.z);
			if(TE && TE.heatReceiveFunction && this.data.meta == TE.data.meta + Math.pow(-1, TE.data.meta)){
				output = TE.heatReceiveFunction(Math.min(maxOutput, parseInt(this.data.energy)*2));
				if(output > 0){
					this.activate();
					this.data.energy -= Math.round(output/2);
					this.container.setText("textInfo1", output + "    /");
					
				}
			}
		}
		if(output == 0){
			this.deactivate();
			this.container.setText("textInfo1", "0    /");
		}
		
		var energyStorage = this.getEnergyStorage()
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, 32, 0);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo2", maxOutput);
	},
	
	getEnergyStorage: function(){
		return 2000;
	},
	
	renderModel: MachineRegistry.renderModelWith6Sides,
	energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

TileRenderer.setRotationPlaceFunction(BlockID.electricHeatGenerator, true);
