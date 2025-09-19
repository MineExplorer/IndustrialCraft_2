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
		{type: "bitmap", x: 379, y: 135, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 691, y: 139, direction: 0, bitmap: "arrow_bar_scale", scale: GUI_SCALE, clicker: {
			onClick: () => {
				RV?.RecipeTypeRegistry.openRecipePage("workbench");
			}
		}},
		"energyScale": {type: "scale", x: 379, y: 135, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotInput0": {type: "slot", x: 490, y: 75},
		"slotInput1": {type: "slot", x: 550, y: 75},
		"slotInput2": {type: "slot", x: 610, y: 75},
		"slotInput3": {type: "slot", x: 490, y: 135},
		"slotInput4": {type: "slot", x: 550, y: 135},
		"slotInput5": {type: "slot", x: 610, y: 135},
		"slotInput6": {type: "slot", x: 490, y: 195},
		"slotInput7": {type: "slot", x: 550, y: 195},
		"slotInput8": {type: "slot", x: 610, y: 195},
		"slot0": {type: "slot", x: 370, y: 300},
        "slot1": {type: "slot", x: 430, y: 300},
        "slot2": {type: "slot", x: 490, y: 300},
        "slot3": {type: "slot", x: 550, y: 300},
        "slot4": {type: "slot", x: 610, y: 300},
        "slot5": {type: "slot", x: 670, y: 300},
        "slot6": {type: "slot", x: 730, y: 300},
        "slot7": {type: "slot", x: 790, y: 300},
        "slot8": {type: "slot", x: 850, y: 300},
		"slotEnergy": {type: "slot", x: 370, y: 195},
		"slotResult": {type: "slot", x: 780, y: 131, size: 68},
		"slotUpgrade1": {type: "slot", x: 880, y: 75},
		"slotUpgrade2": {type: "slot", x: 880, y: 135},
		"slotUpgrade3": {type: "slot", x: 880, y: 195},
        "slotPreviewResult": {type: "slot", x: 700, y: 75, bitmap: "transparent_slot", clicker: {
            onClick: function(_, container: ItemContainer) {
                //container.sendEvent("resetRecipeCheck", {});
            }
        }}
	}
});

namespace Machine {
	export class AutoCrafter extends ProcessingMachine {
        defaultValues = { 
            energy: 0,
			progress: 0,
            recipeChecked: false,
            inputChecked: false
        };
        defaultEnergyDemand = 16;
		defaultTier = 2;
		defaultEnergyStorage = 20000;
        defaultProcessTime = 40;
		defaultDrop = BlockID.machineBlockAdvanced;
        upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName(): UI.IWindow {
			return guiAutoCrafter;
		}

        setupContainer(): void {
            this.container.setGlobalAddTransferPolicy((container, name, id, amount, data) => {
                if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier()) ? amount : 0;
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this) ? amount : 0;
                if (name == "slotResult" || name == "slotPreviewResult") return 0;
                if (name.match(/slotInput[0-8]/)) {
                    const slot = this.container.getSlot(name);
                    if (slot.id == 0) {
                        this.data.recipeChecked = false;
                        return 1;
                    }
                    return 0;
                }
                return amount;
            });
            this.container.setGlobalGetTransferPolicy((container, name, id, amount, data) => {
                if (name.match(/slotInput[0-8]/)) {
                    this.data.recipeChecked = false;
                }
                else if (name.match(/slot[0-8]/)) {
                    this.data.inputChecked = false;
                }
                return amount;
            });
            this.container.setWorkbenchFieldPrefix("slotInput");
        }

        // Pattern slots have a max stack of 1
        // Before starting the machine checks that buffer slots have enough items for the recipe in the grid
        // Each time crafting is complete, items from the buffer are transferred to the grid, just like in an industrial workbench.
        // Buffer slots accept only items presented in the grid, up to the number of slots in the grid that can hold them
        // This way we ensure that the buffer will not fill up with useless items or only one type of item
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
                if (!this.data.inputChecked) {
                    const previewSlot = this.container.getSlot("slotPreviewResult");
                    const resultSlot = this.container.getSlot("slotResult");
                    if (previewSlot.id != 0 && this.validateResult(previewSlot, resultSlot) && this.hasEnoughItems()) {
                        this.data.inputChecked = true; // cache input check for optimization
                    }
                    else if (this.data.progress > 0) {
                        this.data.progress = 0;
                        this.playOnce(this.getInterruptSound());
                    }
                }
                if (this.data.inputChecked) {
                    this.data.energy -= this.energyDemand;
                    this.updateProgress();
                    if (this.isCompletedProgress()) {
                        const recipe = Recipes.getRecipeByField(this.container);
                        if (recipe) {
                            this.provideRecipe(recipe);
                        }
                        this.data.progress = 0;
                        this.data.inputChecked = false;
                    }
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
            if (!this.validateResult(result, resultSlot) || !this.hasEnoughItems()) 
                return false;

            result = Recipes.provideRecipeForPlayer(this.container, "", -1);
            if (result) {
                resultSlot.setSlot(result.id, resultSlot.count + result.count, Math.max(result.data, 0), result.extra);
                this.refillItems();
                return true;
            }
            this.resetRecipe();
            return false;
        }

        destroy(): boolean {
            this.resetRecipe();
            return false;
        }

        getInterruptSound(): string {
			return "InterruptOne.ogg";
		}

        hasEnoughItems(): boolean {
            const requiredItems: ItemInstance[] = [];
			for (let i = 0; i < 9; i++) {
                const slot = this.container.getSlot("slotInput" + i);
                if (slot.id == 0) continue;

                const item = requiredItems.find(it => this.canStackBeReplaced(it, slot));
                if (item) {
                    item.count++;
                } else {
                    requiredItems.push({id: slot.id, data: slot.data, count: 1, extra: slot.extra});
                }
            }
            
            for (let i = 0; i < 9; i++) {
                const slot = this.container.getSlot("slot" + i);
                if (slot.id == 0) continue;

                for (let item of requiredItems) {
                    if (this.canStackBeReplaced(item, slot)) {
                        item.count -= slot.count;
                        break;
                    }
                }
            }

            return requiredItems.every(it => it.count <= 0);
        }

        refillItems(): void {
            for (let i = 0; i < 9; i++) {
                const inputSlot = this.container.getSlot("slotInput" + i);
                if (inputSlot.id != 0 && inputSlot.count < Item.getMaxStack(inputSlot.id, inputSlot.data)) {
                    for (let j = 0; j < 9; j++) {
                        const slot = this.container.getSlot("slot" + j);
                        if (inputSlot.count == 0 && this.canStackBeReplaced(inputSlot, slot)) {
                            inputSlot.setSlot(slot.id, inputSlot.count + 1, slot.data, slot.extra);
                            slot.count--;
                            slot.validate();
                            slot.markDirty();
                            break;
                        }
                    }
                }
                inputSlot.validate();
                inputSlot.markDirty();
            }
        }

        canStackBeReplaced(item: ItemInstance, slot: ItemContainerSlot): boolean {
            return slot.id == item.id && (slot.data == item.data || item.data > 0 && Item.getMaxDamage(item.id) > 0);
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

        isValidInput(item: ItemInstance, side: number, tileEntity: TileEntity): boolean {
            return this.getRecipeEntriesCount(item) > 0;
        }

        getRecipeEntriesCount(item: ItemInstance): number {
            let count = 0;
            for (let i = 0; i < 9; i++) {
                const slot = this.container.getSlot("slotInput" + i);
                if (this.tileEntity.canStackBeReplaced(item, slot)) {
                    count++;
                }
            }
            return count;
        }

        addItem(item: ItemInstance, side: number = -1, maxCount: number = 64): number {
            let maxItemSlots = this.getRecipeEntriesCount(item);
            if (maxItemSlots == 0) return 0;

            let count = 0;
            const slots = this.getInputSlots(side);
			for (let slotName of slots) { // try add to existing stacks first
                const slot = this.container.getSlot(slotName);
                if (this.tileEntity.canStackBeReplaced(item, slot)) {
                    count += this.addItemToSlot(slotName, item, maxCount - count);
                    maxItemSlots--;
					if (item.count == 0 || count >= maxCount || maxItemSlots == 0) {
                        break;
                    }
                }
            }
            if (item.count > 0 && maxItemSlots > 0) {
                count += super.addItem(item, side, maxCount - count);
            }
            return count;
        }
    }

    StorageInterface.createInterface(BlockID.autoCrafter, {
		slots: {
			"slot^0-8": {input: true},
			"slotResult": {output: true}
		},
	}, AutoCrafterStorageInterface);
}