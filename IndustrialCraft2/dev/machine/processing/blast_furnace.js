IDRegistry.genBlockID("blastFurnace");
Block.createBlock("blastFurnace", [
	{name: "Blast Furnace", texture: [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true},
], "machine");
TileRenderer.setStandartModel(BlockID.blastFurnace, [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.blastFurnace, 0, [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.blastFurnace, 6, [["machine_advanced", 0], ["ind_furnace_side", 1], ["machine_back", 0], ["heat_pipe", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]]);

MachineRegistry.setMachineDrop("blastFurnace", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.blastFurnace, count: 1, data: 0}, [
		"aaa",
		"asa",
		"axa"
	], ['s', BlockID.machineBlockBasic, 0, 'a', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
	
	MachineRecipeRegistry.registerRecipesFor("blastFurnace", {
		15: {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000},
		265: {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000},
		"ItemID.dustIron": {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000},
		"ItemID.crushedPurifiedIron": {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000},
		"ItemID.crushedIron": {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000}
	}, true);
});


var guiBlastFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Blast Furnace")}},
		inventory: {standart: true},
		background: {standart: true}
	},

	drawing: [
		{type: "bitmap", x: 450, y: 50, bitmap: "blast_furnace_background", scale: GUI_SCALE_NEW}
	],

	elements: {
		"progressScale": {type: "scale", x: 450 + 50*GUI_SCALE_NEW, y: 50 + 27*GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "blast_furnace_scale", scale: GUI_SCALE_NEW},
		"heatScale": {type: "scale", x: 450 + 46*GUI_SCALE_NEW, y: 50 + 63*GUI_SCALE_NEW, direction: 0, value: 0.5, bitmap: "heat_scale", scale: GUI_SCALE_NEW},
		"slotSource": {type: "slot", x: 450 + 9*GUI_SCALE_NEW, y: 50 + 25*GUI_SCALE_NEW, isValid: function(id) {
			return MachineRecipeRegistry.hasRecipeFor("blastFurnace", id);
		}},
		"slotResult1": {type: "slot", x: 450 + 108*GUI_SCALE_NEW, y: 50 + 48*GUI_SCALE_NEW, size: 54, isValid: function() {return false;}},
		"slotResult2": {type: "slot", x: 450 + 126*GUI_SCALE_NEW, y: 50 + 48*GUI_SCALE_NEW, size: 54, isValid: function() {return false;}},
		"slotAir1": {type: "slot", x: 450, y: 50 + 48*GUI_SCALE_NEW, bitmap: "slot_black", size: 54, isValid: function(id) {return id == ItemID.cellAir;}},
		"slotAir2": {type: "slot", x: 450 + 18*GUI_SCALE_NEW, y: 50 + 48*GUI_SCALE_NEW, bitmap: "slot_black", size: 54, isValid: function() {return false;}},
		"slotUpgrade1": {type: "slot", x: 450 + 126*GUI_SCALE_NEW, y: 50, size: 54, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 450 + 126*GUI_SCALE_NEW, y: 50 + 18*GUI_SCALE_NEW, size: 54, isValid: UpgradeAPI.isValidUpgrade},
		"indicator": {type: "image", x: 450 + 71*GUI_SCALE_NEW, y: 50 + 59*GUI_SCALE_NEW, bitmap: "indicator_red", scale: GUI_SCALE_NEW}
	}
});

Callback.addCallback("LevelLoaded", function() {
	MachineRegistry.updateGuiHeader(guiBlastFurnace, "Blast Furnace");
});

MachineRegistry.registerPrototype(BlockID.blastFurnace, {
	defaultValues:{
		meta: 0,
		progress: 0,
		air: 0,
		sourceID: 0,
		isActive: false,
		isHeating: false,
		heat: 0,
		signal: 0
	},
	
	upgrades: ["redstone", "itemEjector", "itemPulling"],
	
	getGuiScreen: function() {
       return guiBlastFurnace;
    },
	
	wrenchClick: function(id, count, data, coords) {
		this.setFacing(coords.side);
	},
	
	setFacing: MachineRegistry.setFacing,
	
	checkResult: function(result) {
		for (var i = 1; i < 3; i++) {
			var id = result[(i-1)*2];
			var count = result[(i-1)*2+1];
			var resultSlot = this.container.getSlot("slotResult"+i);
			if ((resultSlot.id != id || resultSlot.count + count > 64) && resultSlot.id != 0) {
				return false;
			}
		}
		return true;
	},
	
	putResult: function(result) {
		for (var i = 1; i < 3; i++) {
			var id = result[(i-1)*2];
			var count = result[(i-1)*2+1];
			var resultSlot = this.container.getSlot("slotResult"+i);
			if (id) {
				resultSlot.id = id;
				resultSlot.count += count;
			}
		}
	},
	
	controlAir: function() {
		var slot1 = this.container.getSlot("slotAir1");
		var slot2 = this.container.getSlot("slotAir2");
		if (this.data.air == 0) {
			if (slot1.id==ItemID.cellAir && (slot2.id==0 || slot2.id==ItemID.cellEmpty && slot2.count < 64)) {
				slot1.count--;
				slot2.id = ItemID.cellEmpty;
				slot2.count++;
				this.data.air = 1000;
			}
		}
		if (this.data.air > 0) {
			this.data.air--;
			return true;
		}
		return false;
	},
	
	controlAirImage: function(content, set) {
		if (content) {
			if (set)		
			content.elements["indicatorAir"] = null;
			else
			content.elements["indicatorAir"] = {type: "image", x: 344 + 110*GUI_SCALE_NEW, y: 53 + 20*GUI_SCALE_NEW, bitmap: "no_air_image", scale: GUI_SCALE_NEW};
		}
	},
	
	setIndicator: function(content,set) {
		if (content) {
			if (set)
			content.elements["indicator"].bitmap = "indicator_green";
			else
			content.elements["indicator"].bitmap = "indicator_red";
		}
	},
	
    tick: function() {
		this.data.isHeating = this.data.signal > 0;
		UpgradeAPI.executeUpgrades(this);
		
		var maxHeat = this.getMaxHeat();
		this.data.heat = Math.min(this.data.heat, maxHeat);
		this.container.setScale("heatScale", this.data.heat / maxHeat);
		var content = this.container.getGuiContent();
		
		if (this.data.heat >= maxHeat) {
			this.setIndicator(content, true);
			var sourceSlot = this.container.getSlot("slotSource");
			var source = this.data.sourceID || sourceSlot.id;
			var result = MachineRecipeRegistry.getRecipeResult("blastFurnace", source);
			if (result && this.checkResult(result.result)) {
				if (this.controlAir()) {
					this.controlAirImage(content, true);
					this.data.progress++;
					this.container.setScale("progressScale", this.data.progress / result.duration);
					this.activate();
					
					if (!this.data.sourceID) {
						this.data.sourceID = source;
						sourceSlot.count--;
					}
					
					if (this.data.progress >= result.duration) {
						this.putResult(result.result);
						this.data.progress = 0;
						this.data.sourceID = 0;
					}
					this.container.validateAll();
				}
				else this.controlAirImage(content, false);
			}
		} else {
			this.setIndicator(content, false);
			this.deactivate();
		}
		
		if (this.data.heat > 0) this.data.heat--;
		if (this.data.sourceID == 0) {
			this.container.setScale("progressScale", 0);
		}
    },
	
	getMaxHeat: function() {
		return 50000;
	},
	
	redstone: function(signal) {
		this.data.signal = signal.power > 0;
	},
	
	canReceiveHeat: function(side) {
		return this.data.meta == side;
	},
	
	heatReceive: function(amount) {
		var slot = this.container.getSlot("slotSource");
		if (this.data.isHeating || this.data.sourceID > 0 || MachineRecipeRegistry.getRecipeResult("blastFurnace", slot.id)) {
			amount = Math.min(this.getMaxHeat() - this.data.heat, amount);
			this.data.heat += amount + 1;
			return amount;
		}
		return 0;
	},
	
	renderModel: MachineRegistry.renderModelWith6Variations,
});

TileRenderer.setRotationPlaceFunction(BlockID.blastFurnace, true);

StorageInterface.createInterface(BlockID.blastFurnace, {
	slots: {
		"slotSource": {input: true,
			isValid: function(item) {
				return MachineRecipeRegistry.hasRecipeFor("blastFurnace", item.id);
			}
		},
		"slotAir1": {input: true, 
			isValid: function(item) {
				return item.id == ItemID.cellAir;
			}
		},
		"slotAir2": {output: true},
		"slotResult1": {output: true},
		"slotResult2": {output: true}
	}
});
