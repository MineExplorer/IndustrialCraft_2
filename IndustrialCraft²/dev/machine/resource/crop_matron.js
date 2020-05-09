IDRegistry.genBlockID("cropMatron");
Block.createBlock("cropMatron", [
	{name: "Crop Matron", texture: [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.cropMatron, [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0]], true);
TileRenderer.registerRotationModel(BlockID.cropMatron, 0, [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0]]);
TileRenderer.registerRotationModel(BlockID.cropMatron, 4, [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 3], ["cropmatron_side", 1], ["cropmatron_side", 2], ["cropmatron_side", 2]]);

ItemName.addTierTooltip("cropMatron", 1);

Block.registerDropFunction("cropMatron", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PreLoaded", function(){
    Recipes.addShaped({id: BlockID.cropMatron, count: 1, data: 0}, [
        "cxc",
        "a#a",
        "nnn"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', 54, -1, 'c', ItemID.circuitBasic, 0, 'a', ItemID.cellEmpty, 0, 'n', ItemID.cropStick, 0]);
});

function isFertilizer(id){
	return id == ItemID.fertilizer;
}
function isWeedEx(id){
	return id == ItemID.weedEx;
}

var newGuiMatronObject = {
	standart: {
		header: {text: {text: Translation.translate("Crop Matron")}},
		inventory: {standart: true},
		background: {standart: true}
	},

	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},

	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
        {type: "bitmap", x: 870, y: 270, bitmap: "energy_small_background", scale: GUI_SCALE},
        {type: "bitmap", x: 511, y: 243, bitmap: "water_storage", scale: GUI_SCALE}
	],

	elements: {
        "energyScale": {type: "scale", x: 870, y: 270, direction: 1, value: .5, bitmap: "energy_small_scale", scale: GUI_SCALE},
        "liquidScale": {type: "scale", x: 572, y: 256, direction: 1, value: 1, bitmap: "matron_water_storage", scale: GUI_SCALE},
        "slotEnergy": {type: "slot", x: 804, y: 265, isValid: MachineRegistry.isValidEUStorage},
        "slotFertilizer0": {type: "slot", x: 441, y: 75, bitmap: "dust_slot", isValid: isFertilizer},
        "slotWeedEx0": {type: "slot", x: 441, y: 155, bitmap: "weedEx_slot", isValid: isWeedEx},
        "slotWaterIn": {type: "slot", x: 441, y: 235,  bitmap: "cell_slot", isValid: function(id, count, data){
            return LiquidLib.getItemLiquid(id, data) == "water";
        }},
        "slotWaterOut": {type: "slot", x: 441, y: 295, isValid: function(){
            return false;
        }}
	}
};

for(let i = 1; i < 7; i++){
    newGuiMatronObject.elements["slotWeedEx" + i] = {type: "slot", x: 441 + 60*i, y: 155, isValid: isWeedEx};
}
for(let i = 1; i < 7; i++){
    newGuiMatronObject.elements["slotFertilizer" + i] = {type: "slot", x: 441 + 60*i, y: 75, isValid: isFertilizer};
}

var guiCropMatron = new UI.StandartWindow(newGuiMatronObject);

Callback.addCallback("LevelLoaded", function(){
    MachineRegistry.updateGuiHeader(guiCropMatron, "Crop Matron");
});

MachineRegistry.registerElectricMachine(BlockID.cropMatron, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 10000,
        meta: 0,
        isActive: false,
        scanX: -5,
        scanY: -1,
        scanZ: -5
    },

    getGuiScreen: function(){
        return guiCropMatron;
    },

    init: function(){
		this.liquidStorage.setLimit("water", 2);
		this.renderModel();
    },
	
	getLiquidFromItem: MachineRegistry.getLiquidFromItem,
	
	click: function(id, count, data, coords){
		if(Entity.getSneaking(player)){
			return this.getLiquidFromItem("water", {id: id, count: count, data: data}, null, true);
		}
	},
	
    tick: function(){
        StorageInterface.checkHoppers(this);

        var slot1 = this.container.getSlot("slotWaterIn");
		var slot2 = this.container.getSlot("slotWaterOut");
		this.getLiquidFromItem("water", slot1, slot2);
		
        if(this.data.energy >= 31){
            this.scan();
            this.setActive(true);
        } else {
			this.setActive(false);
        }

		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());

        this.container.setScale("energyScale", this.data.energy / energyStorage);
        this.liquidStorage.updateUiScale("liquidScale", "water");
    },

    scan: function(){
        this.data.scanX++;
        if (this.data.scanX > 5) {
            this.data.scanX = -5;
            this.data.scanZ++;
            if (this.data.scanZ > 5) {
                this.data.scanZ = -5;
                this.data.scanY++;
                if (this.data.scanY > 1) {
                    this.data.scanY = -1;
                }
            }
        }
        this.data.energy -= 1;

        var tileentity = World.getTileEntity(this.x + this.data.scanX, this.y + this.data.scanY, this.z + this.data.scanZ);
        if(tileentity && tileentity.crop){
            var slotFertilizer = this.getSlot("slotFertilizer");
            var weedExSlot = this.getSlot("slotWeedEx");
            if(slotFertilizer && tileentity.applyFertilizer(false)){
                slotFertilizer.count--;
                this.data.energy -= 10;
            }
            var liquidAmount = this.liquidStorage.getAmount("water");
            if(liquidAmount > 0){
                amount = tileentity.applyHydration(liquidAmount);
                if(amount > 0){
                    this.liquidStorage.getLiquid("water", amount / 1000);
                }
            }
            if(weedExSlot && tileentity.applyWeedEx(weedExSlot.id, false)){
                this.data.energy -= 10;
                weedExSlot.data++;
                if(weedExSlot.data >= 10) weedExSlot.id = 0;
            }
            this.container.validateAll();
        }
    },

    getSlot: function(type){
        for(let i = 0; i < 7; i++){
            var slot = this.container.getSlot(type + i);
            if(slot.id) return slot;
        }
        return null;
    },

    getTier: function(){
        return this.data.power_tier;
    },

    getEnergyStorage: function(){
        return this.data.energy_storage;
    },

    renderModel: MachineRegistry.renderModelWithRotation,
    energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

TileRenderer.setRotationPlaceFunction(BlockID.cropMatron, true);

StorageInterface.createInterface(BlockID.cropMatron, {
	slots: {
		"slotFertilizer^0-6": {input: true, isValid: function(item){
			return item.id == ItemID.fertilizer;
		}},
		"slotWeedEx^0-6": {input: true, isValid: function(item){
			return item.id == ItemID.weedEx;
        }},
        "slotWaterIn": {input: true, isValid: function(item){
			return LiquidLib.getItemLiquid(item.id, item.data) == "water";
        }},
        "slotWaterOut": {output: true}
    },
    canReceiveLiquid: function(liquid, side){return liquid == "water"}
});