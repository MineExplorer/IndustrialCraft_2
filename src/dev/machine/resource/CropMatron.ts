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

const сropMatronGuiElements: UI.ElementSet = {
    "energyScale": {type: "scale", x: 870, y: 270, direction: 1, value: .5, bitmap: "energy_small_scale", scale: GUI_SCALE},
    "liquidScale": {type: "scale", x: 572, y: 256, direction: 1, bitmap: "water_storage_scale", scale: GUI_SCALE},
    "slotEnergy": {type: "slot", x: 804, y: 265},
    "slotFertilizer0": {type: "slot", x: 441, y: 75, bitmap: "slot_dust"},
    "slotWeedEx0": {type: "slot", x: 441, y: 155, bitmap: "slot_weedEx"},
    "slotWaterIn": {type: "slot", x: 441, y: 235,  bitmap: "slot_cell"},
    "slotWaterOut": {type: "slot", x: 441, y: 295}
};

for (let i = 1; i < 7; i++) {
    сropMatronGuiElements["slotWeedEx" + i] = {type: "slot", x: 441 + 60*i, y: 155};
}
for (let i = 1; i < 7; i++) {
    сropMatronGuiElements["slotFertilizer" + i] = {type: "slot", x: 441 + 60*i, y: 75};
}

const guiCropMatron = InventoryWindow("Crop Matron", {
    drawing: [
        {type: "bitmap", x: 870, y: 270, bitmap: "energy_small_background", scale: GUI_SCALE},
        {type: "bitmap", x: 511, y: 243, bitmap: "water_storage_background", scale: GUI_SCALE}
	],

    elements: сropMatronGuiElements
});

namespace Machine {
    export class CropMatron
    extends ElectricMachine {
        defaultValues = {
            energy: 0,
            scanX: -5,
            scanY: -1,
            scanZ: -5
        }

        getScreenByName() {
            return guiCropMatron;
        }

        setupContainer(): void {
            this.liquidStorage.setLimit("water", 2);
            StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
                if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
                if (name == "slotWaterIn") return LiquidLib.getItemLiquid(id, data) == "water";
				if (name.startsWith("slotFertilizer")) return id == ItemID.fertilizer;
				if (name.startsWith("slotWeedEx")) return id == ItemID.weedEx;
				return false;
			});
        }

        getLiquidFromItem(liquid: string, inputItem: ItemInstance, outputItem: ItemInstance, byHand?: boolean): boolean {
			return MachineRegistry.getLiquidFromItem.call(this, liquid, inputItem, outputItem, byHand);
		}

        onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (Entity.getSneaking(player)) {
				return this.getLiquidFromItem("water", item, new ItemStack(), true);
			}
			return super.onItemUse(coords, item, player);
		}

        tick(): void {
            StorageInterface.checkHoppers(this);

            let slot1 = this.container.getSlot("slotWaterIn");
            let slot2 = this.container.getSlot("slotWaterOut");
            this.getLiquidFromItem("water", slot1, slot2);

            if (this.data.energy >= 31) {
                this.scan();
                this.setActive(true);
            } else {
                this.setActive(false);
            }

            let energyStorage = this.getEnergyStorage();
            this.data.energy = Math.min(this.data.energy, energyStorage);
            this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());

            this.container.setScale("energyScale", this.data.energy / energyStorage);
            this.liquidStorage.updateUiScale("liquidScale", "water");
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

            let tileentity = this.region.getTileEntity(this.x + this.data.scanX, this.y + this.data.scanY, this.z + this.data.scanZ);
            if (tileentity && tileentity.crop) {
                let slotFertilizer = this.getSlot("slotFertilizer");
                let weedExSlot = this.getSlot("slotWeedEx");
                if (slotFertilizer && tileentity.applyFertilizer(false)) {
                    this.decreaseSlot(slotFertilizer, 1);
                    this.data.energy -= 10;
                }
                let liquidAmount = this.liquidStorage.getAmount("water");
                if (liquidAmount > 0) {
                    let amount = tileentity.applyHydration(liquidAmount);
                    if (amount > 0) {
                        this.liquidStorage.getLiquid("water", amount / 1000);
                    }
                }
                if (weedExSlot.id && tileentity.applyWeedEx(weedExSlot.id, false)) {
                    this.data.energy -= 10;
                    if (++weedExSlot.data >= Item.getMaxDamage(weedExSlot.id)) {
                        weedExSlot.clear();
                    }
                    weedExSlot.markDirty();
                }
            }
        }

        getSlot(type: string): ItemContainerSlot {
            for (let i = 0; i < 7; i++) {
                let slot = this.container.getSlot(type + i);
                if (slot.id) return slot;
            }
            return null;
        }

        getEnergyStorage(): number {
            return 10000;
        }
    }

    MachineRegistry.registerPrototype(BlockID.cropMatron, new CropMatron());

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