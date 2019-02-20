IDRegistry.genBlockID("storageMFSU");
Block.createBlock("storageMFSU", [
	{name: "MFSU", texture: [["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 0], ["mfsu_front", 0], ["mfsu_side", 0], ["mfsu_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.storageMFSU, [["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 0], ["mfsu_front", 0], ["mfsu_side", 0], ["mfsu_side", 0]]);
TileRenderer.registerRenderModel(BlockID.storageMFSU, 0, [["mfsu_front", 0], ["mfsu_side", 0], ["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 1], ["mfsu_side", 1]]);
TileRenderer.registerRenderModel(BlockID.storageMFSU, 1, [["mfsu_side", 0], ["mfsu_front", 0], ["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 1], ["mfsu_side", 1]]);
TileRenderer.registerRotationModel(BlockID.storageMFSU, 2, [["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 0], ["mfsu_front", 0], ["mfsu_side", 0], ["mfsu_side", 0]]);

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

Callback.addCallback("PreLoaded", function(){
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
		power_tier: 3,
		meta: 0
	},
	
	isStorage: true,
	
	getGuiScreen: function(){
		return guiMFSU;
	},
	
	wrenchClick: function(id, count, data, coords){
		if(Entity.getSneaking(player)){
			this.data.meta = coords.side + (coords.side%2)*(-2) + 1;
		}else{
			this.data.meta = coords.side;
		}
		TileRenderer.mapAtCoords(this.x, this.y, this.z, BlockID.storageMFSU, this.data.meta);
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		var TRANSFER = transferByTier[3];
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), "Eu", energyStorage - this.data.energy, TRANSFER, 3);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), "Eu", this.data.energy, TRANSFER, 3);
		
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage + "");
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
			if(drop[0][0] == blockID && this.data.energy > 0){
				var extra = new ItemExtraData();
				extra.putInt("Eu", this.data.energy);
				nativeDropItem(coords.x, coords.y, coords.z, 0, blockID, 1, 0, extra);
			}
			else{
				World.drop(coords.x, coords.y, coords.z, drop[0][0], drop[0][1], drop[0][2]);
			}
		}
	},
	
	init: MachineRegistry.updateMachine,
	destroy: function(){
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	},
});

MachineRegistry.setStoragePlaceFunction("storageMFSU");
