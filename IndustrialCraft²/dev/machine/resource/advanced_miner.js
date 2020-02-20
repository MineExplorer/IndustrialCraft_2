IDRegistry.genBlockID("advancedMiner");
Block.createBlock("advancedMiner", [
	{name: "Advanced Miner", texture: [["teleporter_top", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.advancedMiner, [["teleporter_top", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]], true);
TileRenderer.registerRotationModel(BlockID.advancedMiner, 0, [["teleporter_top", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.advancedMiner, 4, [["teleporter_top", 1], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 1], ["miner_side", 1]]);

ItemName.addStorageBlockTooltip("advancedMiner", 3, "4M");

Block.registerDropFunction("advancedMiner", function(coords, blockID, blockData, level){
	return [];
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.advancedMiner, count: 1, data: 0}, [
		"pmp",
		"e#a",
		"pmp"
	], ['#', BlockID.machineBlockAdvanced, 0, 'a', BlockID.teleporter, 0, 'e', BlockID.storageMFE, -1, 'm', BlockID.miner, -1, 'p', ItemID.plateAlloy, 0]);
});


var guiAdvancedMiner = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Advanced Miner")}},
		inventory: {standart: true},
		background: {standart: true},
	},

	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},

	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
		{type: "bitmap", x: 400 + 2*GUI_SCALE, y: 50 + 49*GUI_SCALE, bitmap: "energy_small_background", scale: GUI_SCALE},
		{type: "bitmap", x: 400 + 28*GUI_SCALE, y: 50 + 21*GUI_SCALE, bitmap: "miner_mode", scale: GUI_SCALE},
		{type: "bitmap", x: 400, y: 50 + 98*GUI_SCALE, bitmap: "miner_info", scale: GUI_SCALE},
	],

	elements: {
		"energyScale": {type: "scale", x: 400 + 2*GUI_SCALE, y: 50 + 49*GUI_SCALE, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotScanner": {type: "slot", x: 400, y: 50 + 19*GUI_SCALE, bitmap: "slot_scanner", 
			isValid: function(id){
				if(id == ItemID.scanner || id == ItemID.scannerAdvanced) return true;
				return false;
			}
		},
		"slotEnergy": {type: "slot", x: 400, y: 290, isValid: MachineRegistry.isValidEUStorage},
		"slot1": {type: "slot", x: 400 + 28*GUI_SCALE, y: 50 + 37*GUI_SCALE},
		"slot2": {type: "slot", x: 400 + 47*GUI_SCALE, y: 50 + 37*GUI_SCALE},
		"slot3": {type: "slot", x: 400 + 66*GUI_SCALE, y: 50 + 37*GUI_SCALE},
		"slot4": {type: "slot", x: 400 + 85*GUI_SCALE, y: 50 + 37*GUI_SCALE},
		"slot5": {type: "slot", x: 400 + 104*GUI_SCALE, y: 50 + 37*GUI_SCALE},
		"slot6": {type: "slot", x: 400 + 28*GUI_SCALE, y: 50 + 56*GUI_SCALE},
		"slot7": {type: "slot", x: 400 + 47*GUI_SCALE, y: 50 + 56*GUI_SCALE},
		"slot8": {type: "slot", x: 400 + 66*GUI_SCALE, y: 50 + 56*GUI_SCALE},
		"slot9": {type: "slot", x: 400 + 85*GUI_SCALE, y: 50 + 56*GUI_SCALE},
		"slot10": {type: "slot", x: 400 + 104*GUI_SCALE, y: 50 + 56*GUI_SCALE},
		"slot11": {type: "slot", x: 400 + 28*GUI_SCALE, y: 290},
		"slot12": {type: "slot", x: 400 + 47*GUI_SCALE, y: 290},
		"slot13": {type: "slot", x: 400 + 66*GUI_SCALE, y: 290},
		"slot14": {type: "slot", x: 400 + 85*GUI_SCALE, y: 290},
		"slot15": {type: "slot", x: 400 + 104*GUI_SCALE, y: 290},
		"slotUpgrade1": {type: "slot", x: 871, y: 50 + 37*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 871, y: 50 + 56*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"button_switch": {type: "button", x: 400 + 116*GUI_SCALE, y: 50 + 21*GUI_SCALE, bitmap: "miner_button_switch", scale: GUI_SCALE, clicker: {
			onClick: function(container, tile){
				tile.data.whitelist = !tile.data.whitelist;
			}
		}},
		"button_restart": {type: "button", x: 400 + 125*GUI_SCALE, y: 50 + 98*GUI_SCALE, bitmap: "miner_button_restart", scale: GUI_SCALE, clicker: {
			onClick: function(container, tile){
				tile.data.x = tile.data.y = tile.data.z =  0;
			}
		}},
		"button_silk": {type: "button", x: 400 + 126*GUI_SCALE, y: 50 + 41*GUI_SCALE, bitmap: "miner_button_silk_0", scale: GUI_SCALE, clicker: {
			onClick: function(container, tile){
				tile.data.silk_touch = (tile.data.silk_touch+1)%2;
			}
		}},
		"textInfoMode": {type: "text", font: {size: 24, color: Color.GREEN}, x: 400 + 32*GUI_SCALE, y: 50+24*GUI_SCALE, width: 256, height: 42, text: Translation.translate("Mode: Blacklist")},
		"textInfoXYZ": {type: "text", font: {size: 24, color: Color.GREEN}, x: 400 + 4*GUI_SCALE, y: 50 + 101*GUI_SCALE, width: 100, height: 42, text: ""},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiAdvancedMiner, "Advanced Miner");
});

MachineRegistry.registerElectricMachine(BlockID.advancedMiner, {
	defaultValues: {
		power_tier: 3,
		meta: 0,
		x: 0,
		y: 0,
		z: 0,
		whitelist: false,
		silk_touch: 0,
		isEnabled: true,
		isActive: false
	},
	
	upgrades: ["overclocker", "transformer"],
	
	getTransportSlots: function(){
		return {input: []};
	},
	
	getGuiScreen: function(){
		return guiAdvancedMiner;
	},
	
	isValidBlock: function(id, data){
		var material = ToolAPI.getBlockMaterial(id);
		if(id > 0 && (!material || material.name != "unbreaking")){
			return true;
		}
		return false;
	},
	
	checkDrop: function(drop){
		if(drop.length == 0) return true;
		for(var i in drop){
			for(var j = 0; j < 16; j++){
				var slot = this.container.getSlot("slot"+j);
				if(slot.id == drop[i][0] && slot.data == drop[i][2]){return !this.data.whitelist;}
			}
		}
		return this.data.whitelist;
	},
	
	harvestBlock: function(x, y, z, block){
		var drop = getBlockDrop({x: x,  y: y, z: z}, block.id, block.data, 100, {silk: this.data.silk_touch});
		if(this.checkDrop(drop)) return false;
		World.setBlock(x, y, z, 0);
		var items = [];
		for(var i in drop){
			items.push({id: drop[i][0], count: drop[i][1], data: drop[i][2]});
		}
		this.drop(items);
		this.data.energy -= 512;
		return true;
	},

	drop: function(items){
		var containers = StorageInterface.getNearestContainers(this, 0, true);
		if(containers){
			StorageInterface.putItems(items, containers, this);
		}
		for(var i in items){
			var item = items[i]
			if(item.count > 0){
				nativeDropItem(this.x+0.5, this.y+1, this.z+0.5, 1, item.id, item.count, item.data);
			}
		}
	},

	tick: function(){
		var content = this.container.getGuiContent();
		if(content){
			content.elements.button_silk.bitmap = "miner_button_silk_" + this.data.silk_touch;
		}
		
		if(this.data.whitelist)
			this.container.setText("textInfoMode", Translation.translate("Mode: Whitelist"));
		else
			this.container.setText("textInfoMode", Translation.translate("Mode: Blacklist"));
		
		this.data.power_tier = this.defaultValues.power_tier;
		var max_scan_count = 5;
		var upgrades = UpgradeAPI.getUpgrades(this, this.container);
		for(var i in upgrades){
			var item = upgrades[i];
			if(item.id == ItemID.upgradeOverclocker){
				max_scan_count *= item.count+1;
			}
			if(item.id == ItemID.upgradeTransformer){
				this.data.power_tier += item.count;
			}
		}
		
		var scanR = 0;
		if(this.data.isEnabled && this.y + this.data.y >= 0 && this.data.energy >= 512){
			var scanner = this.container.getSlot("slotScanner");
			if(scanner.id == ItemID.scanner) scanR = 16;
			if(scanner.id == ItemID.scannerAdvanced) scanR = 32;
		}
		if(scanR > 0 && scanner.data + 64 <= Item.getMaxDamage(scanner.id)){
			if(World.getThreadTime()%20==0){
				if(this.data.y == 0){
					this.data.x = -scanR;
					this.data.y = -1;
					this.data.z = -scanR;
				}
				for(var i = 0; i < max_scan_count; i++){
					if(this.data.x > scanR){
						this.data.x = -scanR;
						this.data.z++;
					}
					if(this.data.z > scanR){
						this.data.z = -scanR;
						this.data.y--;
					}
					scanner.data += 64;
					var x = this.x + this.data.x, y = this.y + this.data.y, z = this.z + this.data.z;
					this.data.x++;
					var block = World.getBlock(x, y, z);
					if(this.isValidBlock(block.id, block.data)){
						if(this.harvestBlock(x, y, z, block))
						break;
					}
					if(scanner.data + 64 > Item.getMaxDamage(scanner.id)) break;
				}
			}
			this.activate();
		}else{
			this.deactivate();
		}
		
		if(this.data.y < 0)
			this.container.setText("textInfoXYZ", "X: "+ this.data.x + ", Y: "+ Math.min(this.data.y, -1) + ", Z: "+ this.data.z);
		else
			this.container.setText("textInfoXYZ", "");
		
		var tier = this.getTier();
		var energyStorage = this.getEnergyStorage();
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotScanner"), "Eu", this.data.energy, tier);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, tier);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},

	destroyBlock: function(coords, player){
		var itemID = Player.getCarriedItem().id;
		var blockID = BlockID.advancedMiner;
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
	
	redstone: function(signal){
		this.data.isEnabled = (signal.power == 0);
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	getEnergyStorage: function(){
		return 4000000;
	},
	
	renderModel: MachineRegistry.renderModelWithRotation,
	energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

MachineRegistry.setStoragePlaceFunction("advancedMiner");
