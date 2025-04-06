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
		{type: "bitmap", x: 750, y: 146, bitmap: "arrow_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 750, y: 146, direction: 0, bitmap: "arrow_bar_scale", scale: GUI_SCALE, clicker: {
			onClick: () => {
				RV?.RecipeTypeRegistry.openRecipePage("crafting");
			}
		}},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slot0": {type: "slot", x: 511, y: 75},
		"slot1": {type: "slot", x: 571, y: 75},
		"slot2": {type: "slot", x: 631, y: 75},
		"slot3": {type: "slot", x: 511, y: 135},
		"slot4": {type: "slot", x: 571, y: 135},
		"slot5": {type: "slot", x: 631, y: 135},
		"slot6": {type: "slot", x: 511, y: 195},
		"slot7": {type: "slot", x: 571, y: 195},
		"slot8": {type: "slot", x: 631, y: 195},
		"slotEnergy": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 825, y: 142},
		"slotUpgrade1": {type: "slot", x: 900, y: 60},
		"slotUpgrade2": {type: "slot", x: 900, y: 119},
		"slotUpgrade3": {type: "slot", x: 900, y: 178},
		"slotUpgrade4": {type: "slot", x: 900, y: 237},
		//"textInfo1": {type: "text", x: 402, y: 143, width: 100, height: 30, text: Translation.translate("Heat:")},
		//"textInfo2": {type: "text", x: 402, y: 173, width: 100, height: 30, text: "0%"},
	}
});

//@ts-ignore
const WorkbenchFieldAPI = com.zhekasmirnov.innercore.api.mod.recipes.workbench.WorkbenchFieldAPI;

namespace Machine {
	export class AutoCrafter extends ProcessingMachine {
        energyDemand = 2;
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
                if (name == "slotResult") return false;
				return true;
			});
            this.container.setWorkbenchFieldPrefix("slot");
        }

		onTick(): void {
			this.useUpgrades();
			StorageInterface.checkHoppers(this);
            if (this.data.energy >= this.energyDemand) {
                if (this.data.progress == 0) {
                    let item = Recipes.getRecipeResult(this.container);
                    let resultSlot = this.container.getSlot("slotResult");
                    if (this.validateResult(item, resultSlot)) {
                        this.data.energy -= this.energyDemand;
			            this.updateProgress();
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
                }
                this.data.progress = 0;
            }

            this.dischargeSlot("slotEnergy");

            this.container.setScale("progressScale", this.data.progress);
            this.container.setScale("energyScale", this.getRelativeEnergy());
            Game.message(this.getRelativeEnergy());
            this.container.sendChanges();
		}

        validateResult(item: ItemInstance, resultSlot: ItemContainerSlot): boolean {
            return item && (resultSlot.id == 0 || resultSlot.id == item.id && resultSlot.data == item.data && resultSlot.count + item.count <= Item.getMaxStack(item.id, item.data))
        }

        provideRecipe(recipe: Recipes.WorkbenchRecipe): boolean {
            const result = recipe.getResult();
            const resultSlot = this.container.getSlot("slotResult");
            if (!this.validateResult(result, resultSlot)) 
                return false;

            const api = new WorkbenchFieldAPI(this.container);
            const craftingFunction = recipe.getCallback();
            if (craftingFunction) {
                craftingFunction(api, this.container.asScriptableField() as UI.Slot[], result, -1);
                for (let i = 0; i < 9; i++) {
                    const slot = this.container.getSlot("slot" + i);
                    slot.validate();
                }
            }
            else {
                for (let i = 0; i < 9; i++) {
                    const slot = this.container.getSlot("slot" + i);
                    slot.setSlot(slot.id, slot.count - 1, slot.data);
                    slot.validate();
                }
            }

            resultSlot.set(result.id, resultSlot.count + result.count, result.data, result.extra);
            return true;
        }

        getInterruptSound(): string {
			return "InterruptOne.ogg";
		}
	}

	MachineRegistry.registerPrototype(BlockID.industrialCrafter, new AutoCrafter());

    StorageInterface.createInterface(BlockID.industrialCrafter, {
		slots: {
			"slot^0-8": {input: true},
			"slotResult": {output: true}
		}
	});
}