IDRegistry.genBlockID("electricHeatGenerator");
Block.createBlock("electricHeatGenerator", [
	{name: "Electric Heater", texture: [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true},
], "machine");
TileRenderer.setStandartModel(BlockID.electricHeatGenerator, [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.electricHeatGenerator, 0, [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.electricHeatGenerator, 6, [["machine_bottom", 0], ["ind_furnace_side", 1], ["heat_generator_side", 1], ["heat_pipe", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]]);

ItemName.addTierTooltip("electricHeatGenerator", 4);

MachineRegistry.setMachineDrop("electricHeatGenerator");

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.electricHeatGenerator, count: 1, data: 0}, [
		"xbx",
		"x#x",
		"xax"
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.casingIron, 0, 'a', ItemID.heatConductor, 0, 'b', ItemID.storageBattery, -1]);
});


var guiElectricHeatGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Electric Heater")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 342, y: 110, bitmap: "energy_small_background", scale: GUI_SCALE},
		{type: "bitmap", x: 461, y: 250, bitmap: "heat_generator_info", scale: GUI_SCALE}
	],
	
	elements: {
		"slot0": {type: "slot", x: 440, y: 120, maxStackSize: 1, isValid: function(id) {return id == ItemID.coil}},
		"slot1": {type: "slot", x: 500, y: 120, maxStackSize: 1, isValid: function(id) {return id == ItemID.coil}},
		"slot2": {type: "slot", x: 560, y: 120, maxStackSize: 1, isValid: function(id) {return id == ItemID.coil}},
		"slot3": {type: "slot", x: 620, y: 120, maxStackSize: 1, isValid: function(id) {return id == ItemID.coil}},
		"slot4": {type: "slot", x: 680, y: 120, maxStackSize: 1, isValid: function(id) {return id == ItemID.coil}},
		"slot5": {type: "slot", x: 440, y: 180, maxStackSize: 1, isValid: function(id) {return id == ItemID.coil}},
		"slot6": {type: "slot", x: 500, y: 180, maxStackSize: 1, isValid: function(id) {return id == ItemID.coil}},
		"slot7": {type: "slot", x: 560, y: 180, maxStackSize: 1, isValid: function(id) {return id == ItemID.coil}},
		"slot8": {type: "slot", x: 620, y: 180, maxStackSize: 1, isValid: function(id) {return id == ItemID.coil}},
		"slot9": {type: "slot", x: 680, y: 180, maxStackSize: 1, isValid: function(id) {return id == ItemID.coil}},
		"slotEnergy": {type: "slot", x: 340, y: 180, isValid: MachineRegistry.isValidEUStorage},
		"energyScale": {type: "scale", x: 342, y: 110, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"textInfo1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 530, y: 264, width: 300, height: 30, text: "0    /"},
		"textInfo2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 630, y: 264, width: 300, height: 30, text: "0"}
	}
});

Callback.addCallback("LevelLoaded", function() {
	MachineRegistry.updateGuiHeader(guiElectricHeatGenerator, "Electric Heater");
});

MachineRegistry.registerElectricMachine(BlockID.electricHeatGenerator, {
    defaultValues: {
		meta: 0,
		isActive: false
	},
    
	getGuiScreen: function() {
		return guiElectricHeatGenerator;
	},
	
	getTier: function() {
		return 4;
	},
	
	wrenchClick: function(id, count, data, coords) {
		this.setFacing(coords.side);
	},
	
	setFacing: MachineRegistry.setFacing,

	calcOutput: function() {
		var maxOutput = 0;
		for (var i = 0; i < 10; i++) {
			var slot = this.container.getSlot("slot"+i);
			if (slot.id == ItemID.coil) {
				maxOutput += 10;
			}
		}
		return maxOutput;
	},
	
	tick: function() {
		var maxOutput = this.calcOutput();
		var output = 0;
		
		if (this.data.energy >= 1) {
			var side = this.data.meta;
			var coords = StorageInterface.getRelativeCoords(this, side);
			var TE = World.getTileEntity(coords.x, coords.y, coords.z);
			if (TE && TE.canReceiveHeat && TE.canReceiveHeat(side ^ 1)) {
				output = TE.heatReceive(Math.min(maxOutput, this.data.energy));
				if (output > 0) {
					this.activate();
					this.data.energy -= output;
					var outputText = output.toString();
					for (var i = outputText.length; i < 6; i++) {
						outputText += " ";
					}
					this.container.setText("textInfo1", outputText + "/");
				}
			}
		}
		if (output == 0) {
			this.deactivate();
			this.container.setText("textInfo1", "0     /");
		}
		
		var energyStorage = this.getEnergyStorage()
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, 4);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo2", maxOutput);
	},
	
	getEnergyStorage: function() {
		return 2000;
	},
	
	renderModel: MachineRegistry.renderModelWith6Variations
});

TileRenderer.setRotationPlaceFunction(BlockID.electricHeatGenerator, true);
