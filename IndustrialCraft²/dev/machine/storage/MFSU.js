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

ItemName.addStorageBlockTooltip("storageMFSU", 4, "60M");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.storageMFSU, count: 1, data: 0}, [
		"aca",
		"axa",
		"aba"
	], ['b', BlockID.storageMFE, -1, 'a', ItemID.storageLapotronCrystal, -1, 'x', BlockID.machineBlockAdvanced, 0, 'c', ItemID.circuitAdvanced, 0]);
});


var guiMFSU = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("MFSU")}},
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
		"textInfo2": {type: "text", x: 642, y: 172, width: 350, height: 30, text: "60000000"}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiMFSU, "MFSU");
});

MachineRegistry.registerEUStorage(BlockID.storageMFSU, {
	getGuiScreen: function(){
		return guiMFSU;
	},
	
	getTier: function(){
		return 4;
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
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), "Eu", energyStorage - this.data.energy, 4);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), "Eu", this.data.energy, 4);
		
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage);
	},
	
	getEnergyStorage: function(){
		return 60000000;
	},
	
	canReceiveEnergy: function(side){
		return side != this.data.meta;
	},
	
	canExtractEnergy: function(side){
		return side == this.data.meta;
	},
	
	destroyBlock: function(coords, player){
		var itemID = Player.getCarriedItem().id;
		var blockID = this.id;
		var level = ToolAPI.getToolLevelViaBlock(itemID, blockID);
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
	
	renderModel: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.id, this.data.meta);
	},
	destroy: function(){
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	}
});

MachineRegistry.setStoragePlaceFunction("storageMFSU", true);

StorageInterface.createInterface(BlockID.storageMFSU, {
	slots: {
		"slot1": {input: true, output: true, 
			isValid: function(item, side, tileEntity){
				return side == 1 && ChargeItemRegistry.isValidItem(item.id, "Eu", 4);
			},
			canOutput: function(item, side, tileEntity){
				return item.data <= 1;
			}
		},
		"slot2": {input: true, output: true,
			isValid: function(item, side, tileEntity){
				return side > 1 && ChargeItemRegistry.isValidStorage(item.id, "Eu", 4);
			},
			canOutput: function(item, side, tileEntity){
				return item.data == Item.getMaxDamage(item.id);
			}
		}
	}
});