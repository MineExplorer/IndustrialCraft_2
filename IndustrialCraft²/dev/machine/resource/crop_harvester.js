IDRegistry.genBlockID("cropHarvester");
Block.createBlock("cropHarvester", [
	{name: "Crop Harvester", texture: [["machine_bottom", 0], ["crop_harvester", 0]], inCreative: true}
], "opaque");

ItemName.addTierTooltip("cropHarvester", 1);

Block.registerDropFunction("cropHarvester", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PreLoaded", function(){
    Recipes.addShaped({id: BlockID.cropHarvester, count: 1, data: 0}, [
        "zcz",
        "s#s",
        "pap"
    ], ['#', BlockID.machineBlockBasic, 0, 'z', ItemID.circuitBasic, 0, 'c', 54, -1, 'a', ItemID.agriculturalAnalyzer, 0, 'p', ItemID.plateIron, 0, 's', 359, 0]);
});

var cropHarvesterGuiObject = {
    standart: {
        header: {text: {text: Translation.translate("Crop Harvester")}},
        inventory: {standart: true},
        background: {standart: true}
    },

    drawing: [
        {type: "bitmap", x: 409, y: 167, bitmap: "energy_small_background", scale: GUI_SCALE}
    ],

    elements: {
        "energyScale": {type: "scale", x: 409, y: 167, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
        "slotEnergy": {type: "slot", x: 400, y: 230, isValid: MachineRegistry.isValidEUStorage},
        "slotUpgrade0": {type: "slot", x: 880, y: 110, isValid: UpgradeAPI.isValidUpgrade},
        "slotUpgrade1": {type: "slot", x: 880, y: 170, isValid: UpgradeAPI.isValidUpgrade},
        "slotUpgrade2": {type: "slot", x: 880, y: 230, isValid: UpgradeAPI.isValidUpgrade}
    }
};

for(let i = 0; i < 15; i++){
    let x = i % 5;
    let y = Math.floor(i / 5) + 1;
    cropHarvesterGuiObject.elements["outSlot" + i] = {type: "slot", x: 520 + x*60, y: 50 + y*60};
};


var guiCropHarvester = new UI.StandartWindow(cropHarvesterGuiObject);
Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiCropHarvester, "Crop Harvester");
});

MachineRegistry.registerElectricMachine(BlockID.cropHarvester, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 10000,
        scanX: -5,
        scanY: -1,
        scanZ: -5
    },
	
    upgrades: ["transformer", "energyStorage", "itemEjector"],
	
    getGuiScreen: function(){
        return guiCropHarvester;
    },
	
    getTier: function(){
        return this.data.power_tier;
    },
	
    resetValues: function(){
        this.data.power_tier = this.defaultValues.power_tier;
        this.data.energy_storage = this.defaultValues.energy_storage;
    },
	
    tick: function(){
        this.resetValues();
        UpgradeAPI.executeUpgrades(this);
        StorageInterface.checkHoppers(this);

        if(this.data.energy > 100) this.scan();

        var energyStorage = this.getEnergyStorage();
        this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());

        this.container.setScale("energyScale", this.data.energy / energyStorage);
        this.container.validateAll();
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
        var cropTile = World.getTileEntity(this.x + this.data.scanX, this.y + this.data.scanY, this.z + this.data.scanZ);
        if(cropTile && cropTile.crop && !this.isInvFull()){
            var drops = null;
            if(cropTile.data.currentSize == cropTile.crop.getOptimalHarvestSize(cropTile)){
                drops = cropTile.performHarvest();
            }
            else if (cropTile.data.currentSize == cropTile.crop.maxSize) {
                drops = cropTile.performHarvest();
            }
            if(drops && drops.length){
                for(let i in drops){
                    var item = drops[i];
                    this.putItem(item);
                    this.data.energy -= 100;

                    if(item.count > 0){
                        World.drop(this.x, this.y + 1, this.z, item.id, item.count, item.data);
                    }
                }
            }
        }
    },
	
    putItem: function(item){
        for(var i = 0; i < 15; i++){
            var slot = this.container.getSlot("outSlot" + i);
            if(!slot.id || slot.id == item.id && slot.count < Item.getMaxStack(item.id)){
                var add = Math.min(Item.getMaxStack(item.id) - slot.count, item.count);
                slot.id = item.id;
                slot.count += add;
                slot.data = item.data;
                item.count -= add;
            }
        }
    },
	
    isInvFull: function(){
        for(var i = 0; i < 15; i++){
            var slot = this.container.getSlot("outSlot" + i);
            var maxStack = Item.getMaxStack(slot.id);
            if(!slot.id || slot.count < maxStack) return false;
        }
        return true;
    },
	
    getEnergyStorage: function(){
        return this.data.energy_storage;
    },
	
    energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

StorageInterface.createInterface(BlockID.cropHarvester, {
	slots: {
		"outSlot^0-14": {output: true}
	}
});