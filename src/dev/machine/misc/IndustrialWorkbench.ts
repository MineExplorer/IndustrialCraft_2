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

namespace Machine {
    const guiIndustrialWorkbench = MachineRegistry.createInventoryWindow("Industrial Workbench", {
        elements: {
            "progressArrow": { type: "button", x: 565, y: 104, bitmap: "arrow_bar_background", scale: GUI_SCALE, clicker: {
                onClick: () => {
                    RV?.RecipeTypeRegistry.openRecipePage("workbench");
                }
            }},
            "slotInput0": { type: "slot", x: 370, y: 40 },
            "slotInput1": { type: "slot", x: 430, y: 40 },
            "slotInput2": { type: "slot", x: 490, y: 40 },
            "slotInput3": { type: "slot", x: 370, y: 100 },
            "slotInput4": { type: "slot", x: 430, y: 100 },
            "slotInput5": { type: "slot", x: 490, y: 100 },
            "slotInput6": { type: "slot", x: 370, y: 160 },
            "slotInput7": { type: "slot", x: 430, y: 160 },
            "slotInput8": { type: "slot", x: 490, y: 160 },
            "slotResult": { type: "slot", x: 650, y: 100, visual: true, clicker: {
                onClick: function(_, container: ItemContainer) {
                    container.sendEvent("craft", {allAtOnce: false});
                },
                onLongClick: function(_, container: ItemContainer) {
                    container.sendEvent("craft", {allAtOnce: true});
                }
            }},
            "buttonClear": {type: "button", x: 555, y: 40, bitmap: "ic2.clear_button", bitmap2: "ic2.clear_button_touched", scale: GUI_SCALE, clicker: {
                onClick: function(_, container: ItemContainer) {
                    container.sendEvent("clearGrid", {});
                }
            }},
            "slot0": { type: 'slot', x: 370, y: 250 },
            "slot1": { type: 'slot', x: 430, y: 250 },
            "slot2": { type: 'slot', x: 490, y: 250 },
            "slot3": { type: 'slot', x: 550, y: 250 },
            "slot4": { type: 'slot', x: 610, y: 250 },
            "slot5": { type: 'slot', x: 670, y: 250 },
            "slot6": { type: 'slot', x: 730, y: 250 },
            "slot7": { type: 'slot', x: 790, y: 250 },
            "slot8": { type: 'slot', x: 850, y: 250 },
            "slot9": { type: 'slot', x: 370, y: 310 },
            "slot10": { type: 'slot', x: 430, y: 310 },
            "slot11": { type: 'slot', x: 490, y: 310 },
            "slot12": { type: 'slot', x: 550, y: 310 },
            "slot13": { type: 'slot', x: 610, y: 310 },
            "slot14": { type: 'slot', x: 670, y: 310 },
            "slot15": { type: 'slot', x: 730, y: 310 },
            "slot16": { type: 'slot', x: 790, y: 310 },
            "slot17": { type: 'slot', x: 850, y: 310 },
            "slotPatternResult0": { type: "slot", x: 730, y: 40, bitmap: "ic2.locked_slot", visual: true, clicker: {
                onClick: function(_, container: ItemContainer) {
                    container.sendEvent("usePattern", {index: 0});
                }
            }},
            "slotPatternResult1": { type: "slot", x: 790, y: 40, bitmap: "ic2.locked_slot", visual: true, clicker: {
                onClick: function(_, container: ItemContainer) {
                    container.sendEvent("usePattern", {index: 1});
                }
            }},
            "slotPatternResult2": { type: "slot", x: 850, y: 40, bitmap: "ic2.locked_slot", visual: true, clicker: {
                onClick: function(_, container: ItemContainer) {
                    container.sendEvent("usePattern", {index: 2});
                }
            }},
            "slotPatternResult3": { type: "slot", x: 730, y: 100, bitmap: "ic2.locked_slot", visual: true, clicker: {
                onClick: function(_, container: ItemContainer) {
                    container.sendEvent("usePattern", {index: 3});
                }
            }},
            "slotPatternResult4": { type: "slot", x: 790, y: 100, bitmap: "ic2.locked_slot", visual: true, clicker: {
                onClick: function(_, container: ItemContainer) {
                    container.sendEvent("usePattern", {index: 4});
                }
            }},
            "slotPatternResult5": { type: "slot", x: 850, y: 100, bitmap: "ic2.locked_slot", visual: true, clicker: {
                onClick: function(_, container: ItemContainer) {
                    container.sendEvent("usePattern", {index: 5});
                }
            }},
            "slotPatternResult6": { type: "slot", x: 730, y: 160, bitmap: "ic2.locked_slot", visual: true, clicker: {
                onClick: function(_, container: ItemContainer) {
                    container.sendEvent("usePattern", {index: 6});
                }
            }},
            "slotPatternResult7": { type: "slot", x: 790, y: 160, bitmap: "ic2.locked_slot", visual: true, clicker: {
                onClick: function(_, container: ItemContainer) {
                    container.sendEvent("usePattern", {index: 7});
                }
            }},
            "slotPatternResult8": { type: "slot", x: 850, y: 160, bitmap: "ic2.locked_slot", visual: true, clicker: {
                onClick: function(_, container: ItemContainer) {
                    container.sendEvent("usePattern", {index: 8});
                }
            }},
            "buttonPlus": {type: "button", x: 910, y: 40, bitmap: "ic2.plus_button", bitmap2: "ic2.plus_button_touched", scale: GUI_SCALE, clicker: {
                onClick: function(_, container: ItemContainer) {
                    container.sendEvent("addPattern", {});
                }
            }},
            "buttonMinus": {type: "button", x: 910, y: 75, bitmap: "ic2.minus_button", bitmap2: "ic2.minus_button_touched", scale: GUI_SCALE, clicker: {
                onClick: function(_, container: ItemContainer) {
                    container.sendEvent("removePattern", {});
                }
            }}
        }
    });
	export class IndustrialWorkbench extends MachineBase {
        defaultValues = { 
            recipeChecked: false,
            patterns: {}
        };
		defaultDrop = BlockID.machineBlockBasic;

		getScreenByName(): UI.IWindow {
			return guiIndustrialWorkbench;
		}

        onInit(): void {
            super.onInit();
            this.data.patterns ??= {};
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
            this.container.clearSlot("slotResult");
            for (let i = 0; i < 9; i++) {
                this.container.clearSlot("slotPatternResult" + i);
            }
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
                            inputSlot.count == 0 && (inputSlot.data == -1 || inputSlot.data > 0 && Item.getMaxDamage(slot.id) > 0)) // allow damaged items to be replaced
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

        clearGridForPlayer(playerUid: number): void {
            this.container.clearSlot("slotResult");
            let player: PlayerActor;
            for (let i = 0; i < 9; i++) {
                const inputSlot = this.container.getSlot("slotInput" + i);
                if (inputSlot.id == 0) continue;
                
                this.addItemToBuffer(inputSlot);
                if (inputSlot.count > 0) {
                    player ??= new PlayerActor(playerUid);
                    player.addItemToInventory(inputSlot.id, inputSlot.count, inputSlot.data, inputSlot.extra || null, true);
                }
                inputSlot.clear();
            }
        }

        clearPattern(index: number): void {
            this.container.getSlot("slotPatternResult" + index).clear();
            delete this.data.patterns["_" + index];
        }

        savePattern(result: ItemInstance, index: number) {
            const entryArray = this.getRecipeEntries();
            if (!entryArray)
                return;

            this.container.setSlot("slotPatternResult" + index, result.id, result.count, result.data, result.extra);
            const pattern = {};
            for (let j = 0; j < 9; j++) {
                const inputSlot = this.container.getSlot("slotInput" + j);
                const entry = entryArray.find(e => e.id == inputSlot.id && (e.data == inputSlot.data || e.data == -1));
                if (entry) {
                    pattern["_" + j] = {id: entry.id, data: entry.data};
                }
            }
            this.data.patterns["_" + index] = pattern;
            this.container.sendChanges();
        }

        addItemToBuffer(item: ItemInstance) {
            // merge stacks first, than fill empty slots
            for (let j = 0; j < 18; j++) {
                const bufferSlot = this.container.getSlot("slot" + j);
                if (bufferSlot.id == item.id && bufferSlot.data == item.data) {
                    StorageInterface.addItemToSlot(item, bufferSlot);
                    bufferSlot.markDirty();
                    if (item.count == 0)
                        break;
                }
            }
            if (item.count == 0)
                return;
            for (let j = 0; j < 18; j++) {
                const bufferSlot = this.container.getSlot("slot" + j);
                if (bufferSlot.id == 0) {
                    StorageInterface.addItemToSlot(item, bufferSlot);
                    bufferSlot.markDirty();
                    if (item.count == 0)
                        break;
                }
            }
        }

        getRecipeEntries(): Nullable<Recipes.RecipeEntry[]> {
            const recipe = Recipes.getRecipeByField(this.container, "");
            if (!recipe)
                return null;

            const javaEntries = recipe.getEntryCollection().toArray();
            const entryArray: Recipes.RecipeEntry[] = [];
            for (let i = 0; i < javaEntries.length; i++) {
                entryArray.push(javaEntries[i]);
            }
            return entryArray;
        }

        @ContainerEvent(Side.Server, "craft")
        onCraft(packetData: {allAtOnce: boolean}, client: NetworkClient) {
            this.provideRecipe(client.getPlayerUid(), packetData.allAtOnce);
        }

        @ContainerEvent(Side.Server, "clearGrid")
        onClearGrid(packetData: {}, client: NetworkClient) {
            this.clearGridForPlayer(client.getPlayerUid());
            this.container.sendChanges();
        }

        @ContainerEvent(Side.Server, "addPattern")
        onAddPattern(packetData: {}, client: NetworkClient) {
            const resultSlot = this.container.getSlot("slotResult");
            if (resultSlot.id == 0) return;

            for (let i = 0; i < 9; i++) {
                const patternResultSlot = this.container.getSlot("slotPatternResult" + i);
                if (patternResultSlot.id == 0) {
                    this.savePattern(resultSlot, i);
                    break;
                }
            }
        }

        @ContainerEvent(Side.Server, "removePattern")
        onRemovePattern(packetData: {}, client: NetworkClient) {
            const resultSlot = this.container.getSlot("slotResult");
            let lastSeenIndex = -1;
            // Remove the pattern matching the result slot, or the last one if none match
            for (let i = 0; i < 9; i++) {
                const patternResultSlot = this.container.getSlot("slotPatternResult" + i);
                if (patternResultSlot.id != 0) {
                    lastSeenIndex = i;
                }
                if (resultSlot.id != 0 && patternResultSlot.id == resultSlot.id && patternResultSlot.count == resultSlot.count && patternResultSlot.data == resultSlot.data) {
                    this.clearPattern(i);
                    return;
                }
            }
            if (lastSeenIndex != -1) {
                this.clearPattern(lastSeenIndex);
            }
        }

        @ContainerEvent(Side.Server, "usePattern")
        onUsePattern({index}: {index: number}, client: NetworkClient) {
            const pattern = this.data.patterns["_" + index];
            if (pattern) {
                this.clearGridForPlayer(client.getPlayerUid());
                for (let j in pattern) {
                    this.container.setSlot("slotInput" + j[1], pattern[j].id, 0, pattern[j].data);
                }
                this.refillItems();
                this.data.recipeChecked = false;
                this.container.sendChanges();
            }
        }
	}

	MachineRegistry.registerPrototype(BlockID.industrialCrafter, new IndustrialWorkbench());

    StorageInterface.createInterface(BlockID.industrialCrafter, {
		slots: {
			"slot^0-17": {input: true}
		}
	});
}