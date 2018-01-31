IDRegistry.genBlockID("storageBatBox");
Block.createBlockWithRotation("storageBatBox", [
	{name: "BatBox", texture: [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_side", 1], ["batbox_front", 0], ["batbox_side", 0], ["batbox_side", 0]], inCreative: true}
], "opaque");

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.storageBatBox, count: 1, data: 0}, [
		"xax",
		"bbb",
		"xxx"
	], ['a', ItemID.cableTin1, 0, 'x', 5, -1, 'b', ItemID.storageBattery, -1]);
});


var guiBatBox = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Bat-Box"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_BAR_STANDART_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"slot1": {type: "slot", x: 441, y: 75},
		"slot2": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 350, height: 30, text: "10000"}
	}
});




MachineRegistry.registerPrototype(BlockID.storageBatBox, {
	isStorage: true,
	
	getGuiScreen: function(){
		return guiBatBox;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage);
		
		var TRANSFER = 32;
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), Math.min(TRANSFER, energyStorage - this.data.energy), 0);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), this.data.energy, TRANSFER, 0);
	},
	
	getEnergyStorage: function(){
		return 40000;
	},
	
	energyTick: function(type, src){
		var TRANSFER = 32;
		this.data.energy += src.storage(Math.min(TRANSFER*4, this.getEnergyStorage() - this.data.energy), Math.min(TRANSFER, this.data.energy));
	}
});

ToolAPI.registerBlockMaterial(BlockID.storageBatBox, "wood");