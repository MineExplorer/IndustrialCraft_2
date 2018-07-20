IDRegistry.genBlockID("storageCESU");
Block.createBlockWithRotation("storageCESU", [
	{name: "CESU", texture: [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]], inCreative: true}
], "opaque");

Block.registerDropFunction("storageCESU", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level);
});

Item.registerNameOverrideFunction(BlockID.storageCESU, function(item, name){
	item = Player.getCarriedItem();
	if(item.extra){
		var energyStored = item.extra.getInt("Eu");
		return name + "\n§7" + energyStored + "/" + 300000 + " Eu";
	}
	return name;
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.storageCESU, count: 1, data: 0}, [
		"bxb",
		"aaa",
		"bbb"
	], ['x', ItemID.cableCopper1, 0, 'a', ItemID.storageAdvBattery, -1, 'b', ItemID.plateBronze, 0]);
});


var guiCESU = new UI.StandartWindow({
	standart: {
		header: {text: {text: "CESU"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 441, y: 75, isValid: MachineRegistry.isValidEUItem},
		"slot2": {type: "slot", x: 441, y: 212, isValid: MachineRegistry.isValidEUStorage},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 300, height: 30, text: "300000"}
	}
});






MachineRegistry.registerPrototype(BlockID.storageCESU, {
	defaultValues: {
		power_tier: 1
	},
	
	isStorage: true,
	
	getGuiScreen: function(){
		return guiCESU;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage + "");
		
		var TRANSFER = transferByTier[1];
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), "Eu", energyStorage - this.data.energy, TRANSFER, 1);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), "Eu", this.data.energy, TRANSFER, 1);
	},
	
	getEnergyStorage: function(){
		return 300000;
	},
	
	energyTick: function(type, src){
		var TRANSFER = 128;
		this.data.energy += src.storage(Math.min(TRANSFER*4, this.getEnergyStorage() - this.data.energy), Math.min(TRANSFER, this.data.energy));
	},
	
	destroyBlock: function(coords, player){
		var itemID = Player.getCarriedItem().id;
		var blockID = BlockID.storageCESU;
		var level = ToolAPI.getToolLevelViaBlock(itemID, blockID)
		var drop = MachineRegistry.getMachineDrop(coords, blockID, level);
		if(drop.length && drop[0][0] == blockID){
			extra = new ItemExtraData();
			extra.putInt("Eu", this.data.energy);
			nativeDropItem(coords.x, coords.y, coords.z, 0, blockID, 1, 0, extra);
		}
	}
});

Block.registerPlaceFunction("storageCESU", function(coords, item, block){
	Game.prevent();
	var x = coords.relative.x
	var y = coords.relative.y
	var z = coords.relative.z
	block = World.getBlockID(x, y, z)
	if(GenerationUtils.isTransparentBlock(block)){
		World.setBlock(x, y, z, item.id, 0);
		var tile = World.addTileEntity(x, y, z);
		if(item.extra){
			tile.data.energy = item.extra.getInt("Eu") + 16;
		}
	}
});