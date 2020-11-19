IDRegistry.genBlockID("cropMatron");
Block.createBlock("cropMatron", [
	{name: "Crop Matron", texture: [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0]], inCreative: true}
], "machine");

TileRenderer.setStandardModelWithRotation(BlockID.cropMatron, 2, [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.cropMatron, 2, [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 3], ["cropmatron_side", 1], ["cropmatron_side", 2], ["cropmatron_side", 2]]);
TileRenderer.setRotationFunction(BlockID.cropMatron, true);

ItemName.addTierTooltip("cropMatron", 1);

MachineRegistry.setMachineDrop("cropMatron", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function() {
    Recipes.addShaped({id: BlockID.cropMatron, count: 1, data: 0}, [
        "cxc",
        "a#a",
        "nnn"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', 54, -1, 'c', ItemID.circuitBasic, 0, 'a', ItemID.cellEmpty, 0, 'n', ItemID.cropStick, 0]);
});

function isFertilizer(id) {
	return id == ItemID.fertilizer;
}
function isWeedEx(id) {
	return id == ItemID.weedEx;
}

var newGuiMatronObject = {
	drawing: [
        {type: "bitmap", x: 870, y: 270, bitmap: "energy_small_background", scale: GUI_SCALE},
        {type: "bitmap", x: 511, y: 243, bitmap: "water_storage_background", scale: GUI_SCALE}
	],

	elements: {
        "energyScale": {type: "scale", x: 870, y: 270, direction: 1, value: .5, bitmap: "energy_small_scale", scale: GUI_SCALE},
        "liquidScale": {type: "scale", x: 572, y: 256, direction: 1, bitmap: "water_storage_scale", scale: GUI_SCALE},
        "slotEnergy": {type: "slot", x: 804, y: 265, isValid: MachineRegistry.isValidEUStorage},
        "slotFertilizer0": {type: "slot", x: 441, y: 75, bitmap: "slot_dust", isValid: isFertilizer},
        "slotWeedEx0": {type: "slot", x: 441, y: 155, bitmap: "slot_weedEx", isValid: isWeedEx},
        "slotWaterIn": {type: "slot", x: 441, y: 235,  bitmap: "slot_cell", isValid: function(id, count, data) {
            return LiquidLib.getItemLiquid(id, data) == "water";
        }},
        "slotWaterOut": {type: "slot", x: 441, y: 295, isValid: function() {
            return false;
        }}
	}
};

for (let i = 1; i < 7; i++) {
    newGuiMatronObject.elements["slotWeedEx" + i] = {type: "slot", x: 441 + 60*i, y: 155, isValid: isWeedEx};
}
for (let i = 1; i < 7; i++) {
    newGuiMatronObject.elements["slotFertilizer" + i] = {type: "slot", x: 441 + 60*i, y: 75, isValid: isFertilizer};
}
// @ts-ignore
var guiCropMatron = InventoryWindow("Crop Matron", newGuiMatronObject);

namespace Machine {
    export class CropMatron
    extends ElectricMachine {
        constructor() {
            super(1);
        }

        defaultValues = {
            energy: 0,
            power_tier: 1,
            energy_storage: 10000,
            meta: 0,
            isActive: false,
            scanX: -5,
            scanY: -1,
            scanZ: -5
        }

        getGuiScreen() {
            return guiCropMatron;
        }

        setupContainer() {
            this.liquidStorage.setLimit("water", 2);
        }
        
        getLiquidFromItem(liquid: string, inputItem: ItemInstance, outputItem: ItemInstance, byHand?: boolean) {
			return MachineRegistry.getLiquidFromItem.call(this, liquid, inputItem, outputItem, byHand);
		}
        
        onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
			if (Entity.getSneaking(player)) {
				return this.getLiquidFromItem("water", item, new ItemStack(), true);
			}
			return false;
		}
        
        tick() {
            StorageInterface.checkHoppers(this);

            var slot1 = this.container.getSlot("slotWaterIn");
            var slot2 = this.container.getSlot("slotWaterOut");
            this.getLiquidFromItem("water", slot1, slot2);
            
            if (this.data.energy >= 31) {
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
        }

        scan() {
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

            var tileentity = World.getTileEntity(this.x + this.data.scanX, this.y + this.data.scanY, this.z + this.data.scanZ, this.blockSource);
            if (tileentity && tileentity.crop) {
                var slotFertilizer = this.getSlot("slotFertilizer");
                var weedExSlot = this.getSlot("slotWeedEx");
                if (slotFertilizer && tileentity.applyFertilizer(false)) {
                    slotFertilizer.count--;
                    this.data.energy -= 10;
                }
                var liquidAmount = this.liquidStorage.getAmount("water");
                if (liquidAmount > 0) {
                    var amount = tileentity.applyHydration(liquidAmount);
                    if (amount > 0) {
                        this.liquidStorage.getLiquid("water", amount / 1000);
                    }
                }
                if (weedExSlot && tileentity.applyWeedEx(weedExSlot.id, false)) {
                    this.data.energy -= 10;
                    if (++weedExSlot.data >= Item.getMaxDamage(weedExSlot.id)) weedExSlot.id = 0;
                }
                this.container.validateAll();
            }
        }

        getSlot(type) {
            for (let i = 0; i < 7; i++) {
                var slot = this.container.getSlot(type + i);
                if (slot.id) return slot;
            }
            return null;
        }

        getTier() {
            return this.data.power_tier;
        }

        getEnergyStorage() {
            return this.data.energy_storage;
        }
    }

    MachineRegistry.registerElectricMachine(BlockID.cropMatron, new CropMatron());

    StorageInterface.createInterface(BlockID.cropMatron, {
        slots: {
            "slotFertilizer^0-6": {input: true, isValid: (item: ItemInstance) => item.id == ItemID.fertilizer},
            "slotWeedEx^0-6": {input: true, isValid: (item: ItemInstance) => item.id == ItemID.weedEx},
            "slotWaterIn": {input: true, isValid: (item: ItemInstance) => {
                return LiquidLib.getItemLiquid(item.id, item.data) == "water";
            }},
            "slotWaterOut": {output: true}
        },
        canReceiveLiquid: (liquid: string) => liquid == "water"
    });
}