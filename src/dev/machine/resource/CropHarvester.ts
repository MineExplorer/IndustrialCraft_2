IDRegistry.genBlockID("cropHarvester");
Block.createBlock("cropHarvester", [
	{name: "Crop Harvester", texture: [["machine_bottom", 0], ["crop_harvester", 0]], inCreative: true}
], "machine");
ItemName.addTierTooltip("cropHarvester", 1);

MachineRegistry.setMachineDrop("cropHarvester", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function() {
    Recipes.addShaped({id: BlockID.cropHarvester, count: 1, data: 0}, [
        "zcz",
        "s#s",
        "pap"
    ], ['#', BlockID.machineBlockBasic, 0, 'z', ItemID.circuitBasic, 0, 'c', 54, -1, 'a', ItemID.agriculturalAnalyzer, 0, 'p', ItemID.plateIron, 0, 's', 359, 0]);
});

var cropHarvesterGuiObject = {
    standard: {
        header: {text: {text: Translation.translate("Crop Harvester")}},
        inventory: {standard: true},
        background: {standard: true}
    },

    drawing: [
        {type: "bitmap", x: 409, y: 167, bitmap: "energy_small_background", scale: GUI_SCALE}
    ],

    elements: {
        "energyScale": {type: "scale", x: 409, y: 167, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
        "slotEnergy": {type: "slot", x: 400, y: 230},
        "slotUpgrade0": {type: "slot", x: 880, y: 110},
        "slotUpgrade1": {type: "slot", x: 880, y: 170},
        "slotUpgrade2": {type: "slot", x: 880, y: 230}
    }
};

for (let i = 0; i < 15; i++) {
    let x = i % 5;
    let y = Math.floor(i / 5) + 1;
    cropHarvesterGuiObject.elements["outSlot" + i] = {type: "slot", x: 520 + x*60, y: 50 + y*60};
};
// @ts-ignore
var guiCropHarvester = InventoryWindow("Crop Harvester", cropHarvesterGuiObject);

namespace Machine {
    export class CropHarvester
    extends ElectricMachine {
        defaultValues = {
            energy: 0,
            tier: 1,
            energy_storage: 10000,
            scanX: -5,
            scanY: -1,
            scanZ: -5
        };

        upgrades = ["transformer", "energyStorage", "itemEjector"];

        getScreenByName() {
            return guiCropHarvester;
        }

        getTier(): number {
            return this.data.tier;
        }

        resetValues(): void {
            this.data.tier = this.defaultValues.tier;
            this.data.energy_storage = this.defaultValues.energy_storage;
        }

        setupContainer(): void {
            StorageInterface.setGlobalValidatePolicy(this.container, (name, id, count, data) => {
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
                return UpgradeAPI.isValidUpgrade(id, this);
			});
        }

        tick(): void {
            this.resetValues();
            UpgradeAPI.executeUpgrades(this);
            StorageInterface.checkHoppers(this);

            if (this.data.energy > 100) this.scan();

            var energyStorage = this.getEnergyStorage();
            this.data.energy = Math.min(this.data.energy, energyStorage);
            this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());

            this.container.setScale("energyScale", this.data.energy / energyStorage);
            this.container.validateAll();
            this.container.sendChanges();
        }

        scan(): void {
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
            var cropTile = this.region.getTileEntity(this.x + this.data.scanX, this.y + this.data.scanY, this.z + this.data.scanZ);
            if (cropTile && cropTile.crop && !this.isInventoryFull()) {
                var drops = null;
                if (cropTile.data.currentSize == cropTile.crop.getOptimalHarvestSize(cropTile)) {
                    drops = cropTile.performHarvest();
                }
                else if (cropTile.data.currentSize == cropTile.crop.maxSize) {
                    drops = cropTile.performHarvest();
                }
                if (drops && drops.length) {
                    for (let i in drops) {
                        var item = drops[i];
                        this.putItem(item);
                        this.data.energy -= 100;

                        if (item.count > 0) {
                            this.region.dropItem(this.x, this.y + 1, this.z, item.id, item.count, item.data);
                        }
                    }
                }
            }
        }

        putItem(item: ItemInstance): void {
            for (var i = 0; i < 15; i++) {
                var slot = this.container.getSlot("outSlot" + i);
                if (!slot.id || slot.id == item.id && slot.count < Item.getMaxStack(item.id)) {
                    var add = Math.min(Item.getMaxStack(item.id) - slot.count, item.count);
                    slot.setSlot(item.id, item.count + add, item.data);
                    item.count -= add;
                }
            }
        }

        isInventoryFull(): boolean {
            for (var i = 0; i < 15; i++) {
                var slot = this.container.getSlot("outSlot" + i);
                var maxStack = Item.getMaxStack(slot.id);
                if (!slot.id || slot.count < maxStack) return false;
            }
            return true;
        }

        getEnergyStorage(): number {
            return this.data.energy_storage;
        }
    }

    MachineRegistry.registerPrototype(BlockID.cropHarvester, new CropHarvester());

    StorageInterface.createInterface(BlockID.cropHarvester, {
        slots: {
            "outSlot^0-14": {output: true}
        }
    });
}