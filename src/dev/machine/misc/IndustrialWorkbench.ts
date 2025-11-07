BlockRegistry.createBlock("industrialCrafter", [
	{name: "Industrial Workbench", texture: [["industrial_workbench_bottom", 0], ["industrial_workbench_top", 0], ["industrial_workbench_back", 0], ["industrial_workbench_front", 0], ["industrial_workbench_left", 0], ["industrial_workbench_right", 0]], inCreative: true},
], "machine");
BlockRegistry.setBlockMaterial(BlockID.industrialCrafter, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.industrialCrafter, 2, [["industrial_workbench_bottom", 0], ["industrial_workbench_top", 0], ["industrial_workbench_back", 0], ["industrial_workbench_front", 0], ["industrial_workbench_left", 0], ["industrial_workbench_right", 0]]);
TileRenderer.setRotationFunction(BlockID.industrialCrafter);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.industrialCrafter, count: 1, data: 0}, [
		" c ",
		"a#b"
	], ['#', BlockID.machineBlockBasic, 0, 'a', ItemID.craftingHammer, 0, 'b', ItemID.cutter, 0, 'c', VanillaBlockID.crafting_table, 0]);
});

const guiIndustrialWorkbench = MachineRegistry.createInventoryWindow("Industrial Workbench", {
	drawing: [
		{type: "bitmap", x: 691, y: 104, bitmap: "arrow_bar_background", scale: GUI_SCALE},
	],

	elements: {
		"progressScale": {type: "scale", x: 691, y: 104, direction: 0, bitmap: "arrow_bar_scale", scale: GUI_SCALE, clicker: {
			onClick: () => {
				RV?.RecipeTypeRegistry.openRecipePage("workbench");
			}
		}},
		"slotInput0": {type: "slot", x: 491, y: 40},
		"slotInput1": {type: "slot", x: 551, y: 40},
		"slotInput2": {type: "slot", x: 611, y: 40},
		"slotInput3": {type: "slot", x: 491, y: 100},
		"slotInput4": {type: "slot", x: 551, y: 100},
		"slotInput5": {type: "slot", x: 611, y: 100},
		"slotInput6": {type: "slot", x: 491, y: 160},
		"slotInput7": {type: "slot", x: 551, y: 160},
		"slotInput8": {type: "slot", x: 611, y: 160},
		"slotResult": {type: "slot", x: 781, y: 100, visual: true, clicker: {
            onClick: function(_, container: ItemContainer) {
                container.sendEvent("craft", {allAtOnce: false});
            },
            onLongClick: function(_, container: ItemContainer) {
                container.sendEvent("craft", {allAtOnce: true});
            }
        }},
        "slot0": {type: "slot", x: 300 + 22*GUI_SCALE, y: 130 + 37*GUI_SCALE},
		"slot1": {type: "slot", x: 300 + 41*GUI_SCALE, y: 130 + 37*GUI_SCALE},
		"slot2": {type: "slot", x: 300 + 60*GUI_SCALE, y: 130 + 37*GUI_SCALE},
		"slot3": {type: "slot", x: 300 + 79*GUI_SCALE, y: 130 + 37*GUI_SCALE},
		"slot4": {type: "slot", x: 300 + 98*GUI_SCALE, y: 130 + 37*GUI_SCALE},
		"slot5": {type: "slot", x: 300 + 117*GUI_SCALE, y: 130 + 37*GUI_SCALE},
		"slot6": {type: "slot", x: 300 + 136*GUI_SCALE, y: 130 + 37*GUI_SCALE},
		"slot7": {type: "slot", x: 300 + 155*GUI_SCALE, y: 130 + 37*GUI_SCALE},
		"slot8": {type: "slot", x: 300 + 174*GUI_SCALE, y: 130 + 37*GUI_SCALE},
		"slot9": {type: "slot", x: 300 + 22*GUI_SCALE, y: 130 + 56*GUI_SCALE},
		"slot10": {type: "slot", x: 300 + 41*GUI_SCALE, y: 130 + 56*GUI_SCALE},
		"slot11": {type: "slot", x: 300 + 60*GUI_SCALE, y: 130 + 56*GUI_SCALE},
		"slot12": {type: "slot", x: 300 + 79*GUI_SCALE, y: 130 + 56*GUI_SCALE},
		"slot13": {type: "slot", x: 300 + 98*GUI_SCALE, y: 130 + 56*GUI_SCALE},
		"slot14": {type: "slot", x: 300 + 117*GUI_SCALE, y: 130 + 56*GUI_SCALE},
		"slot15": {type: "slot", x: 300 + 136*GUI_SCALE, y: 130 + 56*GUI_SCALE},
		"slot16": {type: "slot", x: 300 + 155*GUI_SCALE, y: 130 + 56*GUI_SCALE},
		"slot17": {type: "slot", x: 300 + 174*GUI_SCALE, y: 130 + 56*GUI_SCALE}
	}
});

namespace Machine {
	export class IndustrialWorkbench extends MachineBase {
        defaultValues = { 
            recipeChecked: false
        };
		defaultDrop = BlockID.machineBlockBasic;

		getScreenByName(): UI.IWindow {
			return guiIndustrialWorkbench;
		}

        setupContainer(): void {
            StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
                if (name.match(/slotInput[0-8]/)) {
                    this.data.recipeChecked = false;
                }
				return true;
			});
            this.container.setGlobalGetTransferPolicy((container, name, id, amount, data) => {
                if (name.match(/slotInput[0-8]/)) {
                    this.data.recipeChecked = false;
                }
                return amount;
            });
            this.container.setWorkbenchFieldPrefix("slotInput");
        }

		onTick(): void {
			StorageInterface.checkHoppers(this);

            if (!this.data.recipeChecked) {
                const result = Recipes.getRecipeResult(this.container);
                if (result) {
                    this.container.setSlot("slotResult", result.id, result.count, result.data, result.extra);
                } else {
                    this.container.setSlot("slotResult", 0, 0, 0);
                }
                this.data.recipeChecked = true;
            }

            this.container.sendChanges();
		}
        
        destroy(): boolean {
            this.container.setSlot("slotResult", 0, 0, 0);
            return false;
        }

        provideRecipe(playerUid: number, allAtOnce: boolean): void {
            const recipe = Recipes.getRecipeByField(this.container, "");
            while(recipe) {
                const result = Recipes.provideRecipeForPlayer(this.container, "", playerUid);
                if (result) {
                    new PlayerActor(playerUid).addItemToInventory(result.id, result.count, result.data !== -1 ? result.data : 0, result.extra || null, true);
                    this.refillItems();
                }
                const newRecipe = Recipes.getRecipeByField(this.container, "");
                if (newRecipe !== recipe) {
                    if (newRecipe) {
                        const result = newRecipe.getResult();
                        this.container.setSlot("slotResult", result.id, result.count, result.data, result.extra);
                    } else {
                        this.container.setSlot("slotResult", 0, 0, 0);
                    }
                    break;
                }
                if (!allAtOnce) {
                    break;
                }
            }
            this.container.sendChanges();
        }

        refillItems(): void {
            for (let i = 0; i < 9; i++) {
                const inputSlot = this.container.getSlot("slotInput" + i);
                if (inputSlot.id != 0 && inputSlot.count < Item.getMaxStack(inputSlot.id, inputSlot.data)) {
                    for (let j = 0; j < 18; j++) {
                        const slot = this.container.getSlot("slot" + j);
                        if (slot.id == inputSlot.id && (slot.data == inputSlot.data || 
                            inputSlot.count == 0 && inputSlot.data > 0 && Item.getMaxDamage(slot.id) > 0) // allow damaged items to be replaced
                        ) {
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

        /** @deprecated Container event, shouldn't be called directly */
        @ContainerEvent(Side.Server)
        craft(packetData: {allAtOnce: boolean}, client: NetworkClient) {
            this.provideRecipe(client.getPlayerUid(), packetData.allAtOnce);
        }
	}

	MachineRegistry.registerPrototype(BlockID.industrialCrafter, new IndustrialWorkbench());

    StorageInterface.createInterface(BlockID.industrialCrafter, {
		slots: {
			"slot^0-17": {input: true}
		}
	});
}