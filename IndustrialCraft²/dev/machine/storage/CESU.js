IDRegistry.genBlockID("storageCESU");
Block.createBlock("storageCESU", [
	{name: "CESU", texture: [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.storageCESU, [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]]);
TileRenderer.registerRenderModel(BlockID.storageCESU, 0, [["cesu_front", 0], ["cesu_back", 0], ["cesu_top", 0], ["cesu_top", 0], ["cesu_side", 1], ["cesu_side", 1]]);
TileRenderer.registerRenderModel(BlockID.storageCESU, 1, [["cesu_back", 0], ["cesu_front", 0], ["cesu_top", 0], ["cesu_top", 0], ["cesu_side", 1], ["cesu_side", 1]]);
TileRenderer.registerRotationModel(BlockID.storageCESU, 2, [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]]);

Block.registerDropFunction("storageCESU", function(coords, blockID, blockData, level){
	return [];
});

ItemName.addStorageBlockTooltip("storageCESU", 2, "300K");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.storageCESU, count: 1, data: 0}, [
		"bxb",
		"aaa",
		"bbb"
	], ['x', ItemID.cableCopper1, 0, 'a', ItemID.storageAdvBattery, -1, 'b', ItemID.plateBronze, 0]);
});


var guiCESU = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("CESU")}},
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

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiCESU, "CESU");
});

MachineRegistry.registerEUStorage(BlockID.storageCESU, {
	defaultValues: {
		meta: 0
	},
	
	getGuiScreen: function(){
		return guiCESU;
	},
	
	getTier: function(){
		return 2;
	},
	
	wrenchClick: function(id, count, data, coords){
		if(this.setFacing(coords)){
			EnergyNetBuilder.rebuildTileNet(this);
			return true;
		}
		return false;
	},
		
	setFacing: MachineRegistry.setFacing,
	
	tick: function(){
		StorageInterface.checkHoppers(this);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), "Eu", energyStorage - this.data.energy, 2);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), "Eu", this.data.energy, 2);
		
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage);
	},
	
	getEnergyStorage: function(){
		return 300000;
	},
	
	canReceiveEnergy: function(side){
		return side != this.data.meta;
	},
	
	canExtractEnergy: function(side){
		return side == this.data.meta;
	},
	
	destroyBlock: function(coords, player){
		var itemID = Player.getCarriedItem().id;
		var blockID = BlockID.storageCESU;
		var level = ToolAPI.getToolLevelViaBlock(itemID, blockID);
		var drop = MachineRegistry.getMachineDrop(coords, blockID, level);
		if(drop.length > 0 && drop[0][0] == blockID){
			var extra;
			if(this.data.energy > 0){
				extra = new ItemExtraData();
				extra.putInt("Eu", this.data.energy);
			}
			nativeDropItem(coords.x, coords.y, coords.z, 0, blockID, 1, 0, extra);
		}
	},
	
	renderModel: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.id, this.data.meta);
	},
	destroy: function(){
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	}
});

MachineRegistry.setStoragePlaceFunction("storageCESU", true);

StorageInterface.createInterface(BlockID.storageCESU, {
	slots: {
		"slot1": {input: true, output: true, 
			isValid: function(item, side, tileEntity){
				return side == 1 && ChargeItemRegistry.isValidItem(item.id, "Eu", 2);
			},
			canOutput: function(item, side, tileEntity){
				return item.data <= 1;
			}
		},
		"slot2": {input: true, output: true,
			isValid: function(item, side, tileEntity){
				return side > 1 && ChargeItemRegistry.isValidStorage(item.id, "Eu", 2);
			},
			canOutput: function(item, side, tileEntity){
				return item.data == Item.getMaxDamage(item.id);
			}
		}
	}
});