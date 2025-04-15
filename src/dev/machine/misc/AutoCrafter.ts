BlockRegistry.createBlock("industrialCrafter", [
	{name: "Industrial Crafter", texture: [["industrial_workbench_bottom", 0], ["industrial_workbench_top", 0], ["industrial_workbench_back", 0], ["industrial_workbench_front", 0], ["industrial_workbench_left", 0], ["industrial_workbench_right", 0]], inCreative: true},
], "machine");
BlockRegistry.setBlockMaterial(BlockID.industrialCrafter, "stone", 1);
ItemName.addTierTooltip("industrialCrafter", 3);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.industrialCrafter, count: 1, data: 0}, [
		" w ",
		"x#x",
		"abc"
	], ['#', BlockID.machineBlockAdvanced, 0, 'x', ItemID.circuitAdvanced, 0, 'a', ItemID.craftingHammer, 0, 'b', ItemID.bronzeWrench, 0, 'c', ItemID.cutter, 0]);
});

const guiAutoCrafter = MachineRegistry.createInventoryWindow("Industrial Crafter", {
	drawing: [
		{type: "bitmap", x: 691, y: 139, bitmap: "arrow_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 389, y: 135, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 691, y: 139, direction: 0, bitmap: "arrow_bar_scale", scale: GUI_SCALE, clicker: {
			onClick: () => {
				RV?.RecipeTypeRegistry.openRecipePage("Crafting");
			}
		}},
		"energyScale": {type: "scale", x: 389, y: 135, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slot0": {type: "slot", x: 491, y: 75},
		"slot1": {type: "slot", x: 551, y: 75},
		"slot2": {type: "slot", x: 611, y: 75},
		"slot3": {type: "slot", x: 491, y: 135},
		"slot4": {type: "slot", x: 551, y: 135},
		"slot5": {type: "slot", x: 611, y: 135},
		"slot6": {type: "slot", x: 491, y: 195},
		"slot7": {type: "slot", x: 551, y: 195},
		"slot8": {type: "slot", x: 611, y: 195},
		"slotEnergy": {type: "slot", x: 380, y: 195},
		"slotResult": {type: "slot", x: 781, y: 135},
		"slotUpgrade1": {type: "slot", x: 880, y: 60},
		"slotUpgrade2": {type: "slot", x: 880, y: 119},
		"slotUpgrade3": {type: "slot", x: 880, y: 178},
		"slotUpgrade4": {type: "slot", x: 880, y: 237},
        "slotPreviewResult": {type: "slot", x: 700, y: 75, bitmap: "transparent_slot", clicker: {
            onClick: function(_, container: ItemContainer) {
                container.sendEvent("resetRecipe", {});
            }
        }}
	}
});

//@ts-ignore
const WorkbenchFieldAPI = com.zhekasmirnov.innercore.api.mod.recipes.workbench.WorkbenchFieldAPI;

namespace Machine {
	export class AutoCrafter extends ProcessingMachine {
        defaultEnergyDemand = 2;
		defaultTier = 1;
		defaultEnergyStorage = 20000;
        defaultProcessTime = 40;
		defaultDrop = BlockID.machineBlockAdvanced;

		getScreenByName(): UI.IWindow {
			return guiAutoCrafter;
		}

        setupContainer(): void {
            StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
                if (name == "slotResult" || name == "slotPreviewResult") return false;
				return true;
			});
            this.container.setWorkbenchFieldPrefix("slot");
        }

		onTick(): void {
			this.useUpgrades();
			StorageInterface.checkHoppers(this);
            if (this.data.energy >= this.energyDemand) {
                if (this.data.progress == 0) {
                    let result = Recipes.getRecipeResult(this.container);
                    let resultSlot = this.container.getSlot("slotResult");
                    if (this.validateResult(result, resultSlot)) {
                        this.data.energy -= this.energyDemand;
			            this.updateProgress();
                        this.container.setSlot("slotPreviewResult", result.id, result.count, result.data, result.extra);
                    }
                }
                else {
                    // skip intermediate checks for optimization
                    this.data.energy -= this.energyDemand;
                    this.updateProgress();
                }
            }
            if (+this.data.progress.toFixed(3) >= 1) {
                const recipe = Recipes.getRecipeByField(this.container);
                if (!recipe || !this.provideRecipe(recipe)) {
                    this.playOnce(this.getInterruptSound());
                    this.resetPreviewSlot();
                }
                this.data.progress = 0;
            }

            this.dischargeSlot("slotEnergy");

            this.container.setScale("progressScale", this.data.progress);
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.sendChanges();
		}

        validateResult(item: ItemInstance, resultSlot: ItemContainerSlot): boolean {
            return item && (resultSlot.id == 0 || resultSlot.id == item.id && resultSlot.data == item.data && resultSlot.count + item.count <= Item.getMaxStack(item.id, item.data))
        }

        provideRecipe(recipe: Recipes.WorkbenchRecipe): boolean {
            let result = recipe.getResult();
            const resultSlot = this.container.getSlot("slotResult");
            if (!this.validateResult(result, resultSlot)) 
                return false;

            result = Recipes.provideRecipeForPlayer(this.container, "", -1);
            if (result) {
                resultSlot.setSlot(result.id, resultSlot.count + result.count, Math.max(result.data, 0), result.extra);
                this.equalizeItems();
                return true;
            }
            return false;
        }

        destroy(): boolean {
            this.resetRecipe();
            return false;
        }

        getInterruptSound(): string {
			return "InterruptOne.ogg";
		}

        equalizeItems(item?: ItemInstance): void {
            let totalItems: {item: ItemStack, slots: ItemContainerSlot[]}[] = [];
			for (let i = 0; i < 9; i++) {
                const slotName = "slot" + i;
                const slot = this.container.getSlot(slotName);
                if ((!item || slot.id == item.id && slot.data == item.data) && Item.getMaxStack(slot.id, slot.data) > 1) {
                    let found = false;
                    for (let group of totalItems) {
                        if (group.item.id == slot.id && group.item.data == slot.data) {
                            group.item.count += slot.count;
                            group.slots.push(slot);
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        totalItems.push({item: new ItemStack(slot), slots: [slot]});
                    }
                }
            }

            for (let group of totalItems) {
                const avgCount = Math.floor(group.item.count / group.slots.length);
                let leftCount = group.item.count % group.slots.length;
                for (let slot of group.slots) {
                    slot.count = avgCount;
                    if (leftCount > 0) {
                        slot.count++;
                        leftCount--;
                    }
                    slot.markDirty();
                }
            }
        }

        
        resetPreviewSlot() {
            this.container.setSlot("slotPreviewResult", 0, 0, 0);
        }

        @ContainerEvent(Side.Server)
        resetRecipe() {
            this.resetPreviewSlot();
            for (let i = 0; i < 9; i++) {
                const slot = this.container.getSlot("slot" + i);
                slot.validate();
            }
        }
	}

	MachineRegistry.registerPrototype(BlockID.industrialCrafter, new AutoCrafter());

    export class AutoCrafterStorageInterface extends StorageInterface.TileEntityInterface {
        container: ItemContainer;
        tileEntity: AutoCrafter;
        getInputSlots(side?: number): string[] {
            const inputSlots = [];
            for (let slotName in this.slots) {
                const slotData = this.slots[slotName];
                if (slotData.input && this.tileEntity.container.getSlot(slotName).id != 0) {
                    inputSlots.push(slotName);
                }
            }
            return inputSlots;
        }

        addItem(item: ItemInstance, side: number = -1, maxCount: number = 64): number {
            if (Item.getMaxStack(item.id, item.data) == 1) {
                return this.addNonStackableItem(item);
            }
            const added = super.addItem(item, side, maxCount);
            if (added > 0) {
                this.tileEntity.equalizeItems(item);
            }
            return added;
		}

        addNonStackableItem(item: ItemInstance): number {
            let added = 0;
            for (let i = 0; i < 9; i++) {
                const slotName = "slot" + i;
                const slot = this.container.getSlot(slotName);
                if (slot.id == item.id && slot.count < 1 && 
                  (slot.data == item.data || this.isGhostSlot(slot))) {
                    slot.setSlot(item.id, 1, item.data, item.extra);
                    item.count--;
                    if (item.count == 0) {
                        item.id = item.data = 0;
                        item.extra = null;
                    }
                    added++;
                }
            }
            return added;
        }

        isGhostSlot(slot: ItemContainerSlot): boolean {
            return slot.count == 0 && slot.data > 0 && Item.getMaxDamage(slot.id) > 0;
        }
    }

    StorageInterface.createInterface(BlockID.industrialCrafter, {
		slots: {
			"slot^0-8": {input: true},
			"slotResult": {output: true}
		},
	}, AutoCrafterStorageInterface);
}