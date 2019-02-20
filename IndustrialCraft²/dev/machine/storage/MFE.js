IDRegistry.genBlockID("storageMFE");
Block.createBlock("storageMFE", [
	{name: "MFE", texture: [["machine_top", 0], ["machine_top", 0], ["mfe_back", 0], ["mfe_front", 0], ["mfe_side", 0], ["mfe_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.storageMFE, [["machine_top", 0], ["machine_top", 0], ["mfe_back", 0], ["mfe_front", 0], ["mfe_side", 0], ["mfe_side", 0]]);
TileRenderer.registerRenderModel(BlockID.storageMFE, 0, [["mfe_front", 0], ["mfe_back", 0], ["machine_top", 0], ["machine_top", 0], ["mfe_side", 1], ["mfe_side", 1]]);
TileRenderer.registerRenderModel(BlockID.storageMFE, 1, [["mfe_back", 0], ["mfe_front", 0], ["machine_top", 0], ["machine_top", 0], ["mfe_side", 1], ["mfe_side", 1]]);
TileRenderer.registerRotationModel(BlockID.storageMFE, 2, [["machine_top", 0], ["machine_top", 0], ["mfe_back", 0], ["mfe_front", 0], ["mfe_side", 0], ["mfe_side", 0]]);

Block.registerDropFunction("storageMFE", function(coords, blockID, blockData, level){
	return [];
});

Item.registerNameOverrideFunction(BlockID.storageMFE, function(item, name){
	item = Player.getCarriedItem();
	if(item.extra){
		var energyStored = item.extra.getInt("Eu");
		return name + "\n§7" + energyStored + "/" + 4000000 + " Eu";
	}
	return name;
});


Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.storageMFE, count: 1, data: 0}, [
		"bab",
		"axa",
		"bab"
	], ['x', BlockID.machineBlockBasic, 0, 'a', ItemID.storageCrystal, -1, 'b', ItemID.cableGold2, 0]);
});


var guiMFE = new UI.StandartWindow({
	standart: {
		header: {text: {text: "MFE"}},
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
		"textInfo2": {type: "text", x: 642, y: 172, width: 300, height: 30, text: "4000000"}
	}
});






MachineRegistry.registerPrototype(BlockID.storageMFE, {
	defaultValues: {
		power_tier: 2,
		meta: 0
	},
	
	isStorage: true,
	
	getGuiScreen: function(){
		return guiMFE;
	},
	
	wrenchClick: function(id, count, data, coords){
		if(Entity.getSneaking(player)){
			this.data.meta = coords.side + (coords.side%2)*(-2) + 1;
		}else{
			this.data.meta = coords.side;
		}
		TileRenderer.mapAtCoords(this.x, this.y, this.z, BlockID.storageMFE, this.data.meta);
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		var TRANSFER = transferByTier[2];
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), "Eu", energyStorage - this.data.energy, TRANSFER, 2);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), "Eu", this.data.energy, TRANSFER, 2);
		
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage + "");
	},
	
	getEnergyStorage: function(){
		return 4000000;
	},
	
	energyTick: function(type, src){
		var TRANSFER = 512;
		this.data.energy += src.storage(Math.min(TRANSFER*4, this.getEnergyStorage() - this.data.energy), Math.min(TRANSFER, this.data.energy));
	},
	
	destroyBlock: function(coords, player){
		var itemID = Player.getCarriedItem().id;
		var blockID = BlockID.storageMFE;
		var level = ToolAPI.getToolLevelViaBlock(itemID, blockID)
		var drop = MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
		if(drop.length > 0 && this.data.energy > 0){
			if(drop[0][0] == blockID){
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

MachineRegistry.setStoragePlaceFunction("storageMFE");
