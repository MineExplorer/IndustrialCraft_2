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
    ], ['#', BlockID.machineBlockBasic, 0, 'x', 54, 0, 'c', ItemID.circuitBasic, 0, 'a', ItemID.cellEmpty, 0, 'n', ItemID.perches, 0]);
});

function isFertilizer(id){
    return id == ItemID.fertilizer;
};
function isWeedEx(id){
    return id == ItemID.weedEx;
};
function isWater(id){
    return id == ItemID.hydrationCell;
};
var guiCropMatron = new UI.StandartWindow({
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
        {type: "bitmap", x: 350, y: 150, bitmap: "energy_small_background", scale: GUI_SCALE}
    ],
    
    elements: {
        "energyScale": {type: "scale", x: 350, y: 150, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_SCALE},
        "slotFertilizer0": {type: "slot", x: 441, y: 75, bitmap: "dust_slot", isValid: isFertilizer},
        "slotFertilizer1": {type: "slot", x: 441, y: 135, isValid: isFertilizer},
        "slotFertilizer2": {type: "slot", x: 441, y: 195, isValid: isFertilizer},
        "slotWeedEx0": {type: "slot", x: 641, y: 75, bitmap: "weedEx_slot", isValid: isWeedEx},
        "slotWeedEx1": {type: "slot", x: 641, y: 135, isValid: isWeedEx},
        "slotWeedEx2": {type: "slot", x: 641, y: 195, isValid: isWeedEx},
        "slotWater0": {type: "slot", x: 541, y: 75,  bitmap: "cap_slot",isValid: isWater},
        "slotWater1": {type: "slot", x: 541, y: 135, isValid: isWater},
        "slotWater2": {type: "slot", x: 541, y: 195, isValid: isWater},
    }
});

Callback.addCallback("LevelLoaded", function(){
    MachineRegistry.updateGuiHeader(guiCropMatron, "Crop Matron");
});

MachineRegistry.registerElectricMachine(BlockID.cropMatron, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 1000,
        meta: 0,
        isActive: false,
        scanX: -4,
        scanY: -1,
        scanZ: -4
    },
    
    getGuiScreen: function(){
        return guiCropMatron;
    },
    
    getTier: function(){
        return this.data.power_tier;
    },
    
    tick: function(){
		StorageInterface.checkHoppers(this);
        if(this.data.energy >= 31){
            this.scan();
            this.setActive(true);
        } else {
			this.setActive(false);
		}
        var energyStorage = this.getEnergyStorage();
        this.container.setScale("energyScale", this.data.energy / energyStorage);
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
            var hydrationSlot = this.getSlot("slotWater");
            var weedExSlot = this.getSlot("slotWeedEx");
            if(slotFertilizer && tileentity.applyFertilizer(false)){
                slotFertilizer.count--;
                this.data.energy -= 10;
            }
            if(hydrationSlot){
                var hydrationAmount = tileentity.applyHydration(hydrationSlot.id, hydrationSlot.data, false);
                if(hydrationAmount){
                    this.data.energy -= 10;
                    hydrationSlot.data += hydrationAmount;
                    if(hydrationSlot.data >= 1000) hydrationSlot.id = 0;
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
        for(var i = 0; i < 3; i++){
            var slot = this.container.getSlot(type + i);
            if(slot.id) return slot;
        }
        return null;
    },
    
    getEnergyStorage: function(){
        return this.data.energy_storage;
    },
    
    renderModel: MachineRegistry.renderModelWithRotation,
    energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

TileRenderer.setRotationPlaceFunction(BlockID.cropMatron);
StorageInterface.createInterface(BlockID.cropMatron, {
	slots: {
		"slotFertilizer^0-2": {input: true, isValid: function(item){
			return item.id == ItemID.fertilizer;
		}},
		"slotWeedEx^0-2": {input: true, isValid: function(item){
			return item.id == ItemID.weedEx;
		}},
		"slotWater^0-2": {input: true, isValid: function(item){
			return item.id == ItemID.hydrationCell;
		}}
	}
});