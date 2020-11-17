IDRegistry.genBlockID("rtHeatGenerator");
Block.createBlock("rtHeatGenerator", [
	{name: "Radioisotope Heat Generator", texture: [["machine_bottom", 0], ["rt_heat_generator_top", 0], ["rt_generator_side", 0], ["heat_pipe", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]], inCreative: true},
], "machine");
ToolAPI.registerBlockMaterial(BlockID.rtHeatGenerator, "stone", 1, true);

TileRenderer.setHandAndUiModel(BlockID.rtHeatGenerator, 0, [["machine_bottom", 0], ["rt_heat_generator_top", 0], ["rt_generator_side", 0], ["heat_pipe", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.rtHeatGenerator, 0, [["machine_bottom", 0], ["rt_heat_generator_top", 0], ["rt_generator_side", 0], ["heat_pipe", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]], true);
TileRenderer.registerModelWithRotation(BlockID.rtHeatGenerator, 0, [["machine_bottom", 0], ["rt_heat_generator_top", 1], ["rt_generator_side", 0], ["heat_pipe", 1], ["rt_generator_side", 0], ["rt_generator_side", 0]], true);
TileRenderer.setRotationFunction(BlockID.rtHeatGenerator, true);

MachineRegistry.setMachineDrop("rtHeatGenerator");

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.rtHeatGenerator, count: 1, data: 0}, [
		"ccc",
		"c#c",
		"cxc"
	], ['#', BlockID.reactorChamber, 0, 'x', ItemID.heatConductor, 0, 'c', ItemID.casingIron, 0]);
});

var guiRTHeatGenerator = new UI.StandartWindow({
	standard: {
		header: {text: {text: Translation.translate("Radioisotope Heat Generator")}},
		inventory: {standard: true},
		background: {standard: true}
	},
	
	drawing: [
		{type: "bitmap", x: 380, y: 250, bitmap: "heat_generator_info", scale: GUI_SCALE}
	],
	
	elements: {
		"slot0": {type: "slot", x: 420, y: 100, isValid: function(id){ return id == ItemID.rtgPellet }},
		"slot1": {type: "slot", x: 480, y: 100, isValid: function(id){ return id == ItemID.rtgPellet }},
		"slot2": {type: "slot", x: 540, y: 100, isValid: function(id){ return id == ItemID.rtgPellet }},
		"slot3": {type: "slot", x: 420, y: 160, isValid: function(id){ return id == ItemID.rtgPellet }},
		"slot4": {type: "slot", x: 480, y: 160, isValid: function(id){ return id == ItemID.rtgPellet }},
		"slot5": {type: "slot", x: 540, y: 160, isValid: function(id){ return id == ItemID.rtgPellet }},
		"textInfo1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 450, y: 264, width: 300, height: 30, text: "0     /"},
		"textInfo2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 550, y: 264, width: 300, height: 30, text: "0"}
	}
});

Callback.addCallback("LevelLoaded", function() {
	MachineRegistry.updateGuiHeader(guiRTHeatGenerator, "Radioisotope Heat Generator");
});


class TileEntityRTHeatGenerator extends TileEntityMachine {
	defaultValues: {
		isActive: false
	}
    
	getScreenByName() {
		return guiRTHeatGenerator;
	}

	setupContainer() {
		this.container.setGlobalAddTransferPolicy((contaier, name, id, amount, data) => {
			return (id == ItemID.rtgPellet)? amount : 0
		});
	}

	tick() {
		var output = 1;
		for (var i = 0; i < 6; i++) {
			var slot = this.container.getSlot("slot"+i);
			if (slot.id == ItemID.rtgPellet) {
				output *= 2;
			}
		}
		if (output < 2) output = 0;
		var maxOutput = output;

		if (output > 0) {
			var side = this.data.meta;
			var coords = StorageInterface.getRelativeCoords(this, side);
			var TE = World.getTileEntity(coords.x, coords.y, coords.z, this.blockSource);
			if (TE && TE.canReceiveHeat && TE.canReceiveHeat(side ^ 1)) {
				output = TE.heatReceive(output);
			}
		}

		this.setActive(output > 0);
		var outputText = output.toString();
		for (var i = outputText.length; i < 6; i++) {
			outputText += " ";
		}
		this.container.setText("textInfo1", outputText + "/");
		this.container.setText("textInfo2", maxOutput);
		this.container.sendChanges();
	}
}

MachineRegistry.registerGenerator(BlockID.rtHeatGenerator, new TileEntityRTHeatGenerator());
