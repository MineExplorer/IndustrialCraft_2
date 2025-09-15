BlockRegistry.createBlock("autoCrafter", [
	{name: "Automatic Crafter", texture: [["autocrafter_bottom", 0], ["autocrafter_top", 0], ["autocrafter_back", 0], ["autocrafter_front", 0], ["autocrafter_left", 0], ["autocrafter_right", 0]], inCreative: true},
], "machine");
BlockRegistry.setBlockMaterial(BlockID.autoCrafter, "stone", 1);
ItemName.addTierTooltip("autoCrafter", 2);

TileRenderer.setStandardModelWithRotation(BlockID.autoCrafter, 2, [["autocrafter_bottom", 0], ["autocrafter_top", 0], ["autocrafter_back", 0], ["autocrafter_front", 0], ["autocrafter_left", 0], ["autocrafter_right", 0]]);
TileRenderer.setRotationFunction(BlockID.autoCrafter);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.autoCrafter, count: 1, data: 0}, [
		" w ",
		"x#x",
		" e "
	], ['#', BlockID.machineBlockAdvanced, 0, 'w', BlockID.industrialCrafter, 0, 'x', ItemID.circuitAdvanced, 0, 'e', ItemID.electricWrench, -1]);
});

const guiAutoCrafter = MachineRegistry.createInventoryWindow("Automatic Crafter", {
	drawing: [
		{type: "bitmap", x: 691, y: 139, bitmap: "arrow_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 389, y: 135, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 691, y: 139, direction: 0, bitmap: "arrow_bar_scale", scale: GUI_SCALE, clicker: {
			onClick: () => {
				RV?.RecipeTypeRegistry.openRecipePage("workbench");
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
                container.sendEvent("resetRecipeCheck", {});
            }
        }}
	}
});

namespace Machine {
	export class AutoCrafter extends ProcessingMachine {
        defaultValues = { 
            energy: 0,
			progress: 0,
            recipeChecked: false
        };
        defaultEnergyDemand = 2;
		defaultTier = 2;
		defaultEnergyStorage = 20000;
        defaultProcessTime = 40;
		defaultDrop = BlockID.machineBlockAdvanced;
        upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName(): UI.IWindow {
			return guiAutoCrafter;
		}

        setupContainer(): void {
            StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
                if (name == "slotResult" || name == "slotPreviewResult") return false;
                
                const slot = this.container.getSlot(name);
                if (slot.id == 0) {
                    this.data.recipeChecked = false;
                }
				return true;
			});
            this.container.setGlobalGetTransferPolicy((container, name, id, amount, data) => {
                if (name.match(/slot[0-8]/)) {
                    this.data.recipeChecked = false;
                }
                return amount;
            });
            this.container.setWorkbenchFieldPrefix("slot");
        }

		onTick(): void {
			this.useUpgrades();
			StorageInterface.checkHoppers(this);

            if (!this.data.recipeChecked) {
                const result = Recipes.getRecipeResult(this.container);
                if (result) {
                    this.container.setSlot("slotPreviewResult", result.id, result.count, result.data, result.extra);
                } else {
                    this.resetRecipe();
                    if (this.data.progress > 0) {
                        this.data.progress = 0;
                        this.playOnce(this.getInterruptSound());
                    }
                }
                this.data.recipeChecked = true;
            }

            if (this.data.energy >= this.energyDemand) {
                if (this.data.progress == 0) {
                    const recipeResult = Recipes.getRecipeResult(this.container);
                    const resultSlot = this.container.getSlot("slotResult");
                    if (this.validateResult(recipeResult, resultSlot)) {
                        this.data.energy -= this.energyDemand;
                        this.updateProgress();
                    }
                }
                else {
                    // skip intermediate checks for optimization
                    this.data.energy -= this.energyDemand;
                    this.updateProgress();
                }
                
                if (this.isCompletedProgress()) {
                    const recipe = Recipes.getRecipeByField(this.container);
                    if (recipe) {
                        this.provideRecipe(recipe)
                    }
                    this.data.progress = 0;
                }
            }

            this.dischargeSlot("slotEnergy");

            this.container.setScale("progressScale", this.data.progress);
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.sendChanges();
		}

        validateResult(item: ItemInstance, resultSlot: ItemContainerSlot): boolean {
            return item && (resultSlot.id == 0 || resultSlot.id == item.id && 
                (item.data == -1 || resultSlot.data == item.data) && 
                resultSlot.count + item.count <= Item.getMaxStack(item.id, item.data))
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

        equalizeItems(item?: {id: number, data: number}): void {
            let totalItems: {item: ItemStack, slots: ItemContainerSlot[]}[] = [];
			for (let i = 0; i < 9; i++) {
                const slot = this.container.getSlot("slot" + i);
                if ((!item || slot.id == item.id && slot.data == item.data) && slot.extra == null && Item.getMaxStack(slot.id, slot.data) > 1) {
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

        resetRecipe() {
            this.container.setSlot("slotPreviewResult", 0, 0, 0);
            for (let i = 0; i < 9; i++) {
                const slot = this.container.getSlot("slot" + i);
                slot.validate();
            }
        }

        @ContainerEvent(Side.Server)
        resetRecipeCheck() {
            this.data.recipeChecked = false;
        }
	}

	MachineRegistry.registerPrototype(BlockID.autoCrafter, new AutoCrafter());

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
            const addedItem = {id: item.id, data: item.data};
            const added = super.addItem(item, side, maxCount);
            if (added > 0) {
                this.tileEntity.equalizeItems(addedItem);
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

    StorageInterface.createInterface(BlockID.autoCrafter, {
		slots: {
			"slot^0-8": {input: true},
			"slotResult": {output: true}
		},
	}, AutoCrafterStorageInterface);
}