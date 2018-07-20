IDRegistry.genBlockID("storageMFSU");
Block.createBlockWithRotation("storageMFSU", [
	{name: "MFSU", texture: [["mfsu", 0], ["mfsu", 1], ["mfsu", 1], ["mfsu", 2], ["mfsu", 1], ["mfsu", 1]], inCreative: true}
], "opaque");

Block.registerDropFunction("storageMFSU", function(coords, blockID, blockData, level){
	return [];
});

Item.registerNameOverrideFunction(BlockID.storageMFSU, function(item, name){
	item = Player.getCarriedItem();
	if(item.extra){
		var energyStored = item.extra.getInt("Eu");
		return name + "\n§7" + energyStored + "/" + 60000000 + " Eu";
	}
	return name;
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.storageMFSU, count: 1, data: 0}, [
		"aca",
		"axa",
		"aba"
	], ['b', BlockID.storageMFE, -1, 'a', ItemID.storageLapotronCrystal, -1, 'x', BlockID.machineBlockAdvanced, 0, 'c', ItemID.circuitAdvanced, 0]);
});


var guiMFSU = new UI.StandartWindow({
	standart: {
		header: {text: {text: "MFSU"}},
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
		"textInfo1": {type: "text", x: 642, y: 142, width: 350, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 350, height: 30, text: "40000000"}
	}
});




MachineRegistry.registerPrototype(BlockID.storageMFSU, {
	defaultValues: {
		power_tier: 3
	},
	
	isStorage: true,
	
	getGuiScreen: function(){
		return guiMFSU;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage + "");
		
		var TRANSFER = transferByTier[3];
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), "Eu", energyStorage - this.data.energy, TRANSFER, 3);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), "Eu", this.data.energy, TRANSFER, 3);
	},
	
	getEnergyStorage: function(){
		return 60000000;
	},
	
	energyTick: function(type, src){
		var TRANSFER = 2048;
		this.data.energy += src.storage(Math.min(TRANSFER*4, this.getEnergyStorage() - this.data.energy), Math.min(TRANSFER, this.data.energy));
	},
	
	destroyBlock: function(coords, player){
		var itemID = Player.getCarriedItem().id;
		var blockID = BlockID.storageMFSU;
		var level = ToolAPI.getToolLevelViaBlock(itemID, blockID)
		var drop = MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockAdvanced);
		if(drop.length > 0){
			if(drop[0][0] == blockID){
				extra = new ItemExtraData();
				extra.putInt("Eu", this.data.energy);
				nativeDropItem(coords.x, coords.y, coords.z, 0, blockID, 1, 0, extra);
			}
			else{
				World.drop(coords.x, coords.y, coords.z, drop[0][0], drop[0][1], drop[0][2]);
			}
		}
	}
});

Block.registerPlaceFunction("storageMFSU", function(coords, item, block){
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