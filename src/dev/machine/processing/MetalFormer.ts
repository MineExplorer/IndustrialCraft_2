/// <reference path="ProcessingMachine.ts" />

BlockRegistry.createBlock("metalFormer", [
	{name: "Metal Former", texture: [["machine_bottom", 0], ["metal_former_top", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.metalFormer, "stone", 1);

TileRenderer.setStandardModel(BlockID.metalFormer, 2, [["machine_bottom", 0], ["metal_former_top", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setStandardModel(BlockID.metalFormer, 3, [["machine_bottom", 0], ["metal_former_top", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setStandardModel(BlockID.metalFormer, 4, [["machine_bottom", 0], ["metal_former_top2", 0], ["machine_side", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0]]);
TileRenderer.setStandardModel(BlockID.metalFormer, 5, [["machine_bottom", 0], ["metal_former_top2", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0], ["metal_former_front", 0]]);
TileRenderer.registerRenderModel(BlockID.metalFormer, 2, [["machine_bottom", 0], ["metal_former_top_active", 0], ["metal_former_front", 1], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRenderModel(BlockID.metalFormer, 3, [["machine_bottom", 0], ["metal_former_top_active", 0], ["machine_side", 0], ["metal_former_front", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRenderModel(BlockID.metalFormer, 4, [["machine_bottom", 0], ["metal_former_top2_active", 0], ["machine_side", 0], ["machine_side", 0], ["metal_former_front", 1], ["machine_side", 0]]);
TileRenderer.registerRenderModel(BlockID.metalFormer, 5, [["machine_bottom", 0], ["metal_former_top2_active", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0], ["metal_former_front", 1]]);
TileRenderer.setRotationFunction(BlockID.metalFormer);

ItemName.addTierTooltip("metalFormer", 1);
ItemName.addConsumptionTooltip("metalFormer", "EU", 10);

Callback.addCallback("PreLoaded", function() {
	function isToolboxEmpty(slot: ItemInstance) {
		let container = BackpackRegistry.containers["d" + slot.data];
		if (container) {
			for (let i = 1; i <= 10; i++) {
				if (container.getSlot("slot"+i).id != 0) {
					return false;
				}
			}
		}
		return true;
	}
	Recipes.addShaped({id: BlockID.metalFormer, count: 1, data: 0}, [
		" x ",
		"b#b",
		"ccc"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'b', ItemID.toolbox, -1, 'c', ItemID.coil, 0],
	function(api, field, result) {
		if (isToolboxEmpty(field[3]) && isToolboxEmpty(field[5])) {
			for (let i = 0; i < field.length; i++) {
				api.decreaseFieldSlot(i);
			}
		}
		else {
			result.id = result.count = 0;
		}
	});

	class MetalFormerRecipeDictionary extends ProcessingRecipeDictionary<Machine.MetalFormerRecipe> {
		getCompoundKey(recipe: Machine.MetalFormerRecipe): string {
			return recipe.mode + ":" + recipe.input.id;
		}
	}

	const metalFormerDictionary = new MetalFormerRecipeDictionary(200);
	// rolling
	metalFormerDictionary.registerList([
		// ingots
		{ mode: 0, input: {id: VanillaItemID.iron_ingot}, result: {id: ItemID.plateIron, count: 1} },
		{ mode: 0, input: {id: VanillaItemID.gold_ingot}, result: {id: ItemID.plateGold, count: 1} },
		{ mode: 0, input: {id: ItemID.ingotCopper}, result: {id: ItemID.plateCopper, count: 1} },
		{ mode: 0, input: {id: ItemID.ingotTin}, result: {id: ItemID.plateTin, count: 1} },
		{ mode: 0, input: {id: ItemID.ingotBronze}, result: {id: ItemID.plateBronze, count: 1} },
		{ mode: 0, input: {id: ItemID.ingotSteel}, result: {id: ItemID.plateSteel, count: 1} },
		{ mode: 0, input: {id: ItemID.ingotLead}, result: {id: ItemID.plateLead, count: 1} },
		{ mode: 0, input: {id: ItemID.ingotSilver}, result: {id: ItemID.plateSilver, count: 1} },

		// plates
		{ mode: 0, input: {id: ItemID.plateIron}, result: {id: ItemID.casingIron, count: 2} },
		{ mode: 0, input: {id: ItemID.plateGold}, result: {id: ItemID.casingGold, count: 2} },
		{ mode: 0, input: {id: ItemID.plateTin}, result: {id: ItemID.casingTin, count: 2} },
		{ mode: 0, input: {id: ItemID.plateCopper}, result: {id: ItemID.casingCopper, count: 2} },
		{ mode: 0, input: {id: ItemID.plateBronze}, result: {id: ItemID.casingBronze, count: 2} },
		{ mode: 0, input: {id: ItemID.plateSteel}, result: {id: ItemID.casingSteel, count: 2} },
		{ mode: 0, input: {id: ItemID.plateLead}, result: {id: ItemID.casingLead, count: 2} },
		{ mode: 0, input: {id: ItemID.plateSilver}, result: {id: ItemID.casingSilver, count: 2} }
	]);

	// cutting
	metalFormerDictionary.registerList([
		{ mode: 1, input: {id: ItemID.plateTin}, result: {id: ItemID.cableTin0, count: 3} },
		{ mode: 1, input: {id: ItemID.plateCopper}, result: {id: ItemID.cableCopper0, count: 3} },
		{ mode: 1, input: {id: ItemID.plateGold}, result: {id: ItemID.cableGold0, count: 4} },
		{ mode: 1, input: {id: ItemID.plateIron}, result: {id: ItemID.cableIron0, count: 4} }
	]);

	// extruding
	metalFormerDictionary.registerList([
		{ mode: 2, input: {id: ItemID.ingotTin}, result: {id: ItemID.cableTin0, count: 3} },
		{ mode: 2, input: {id: ItemID.ingotCopper}, result: {id: ItemID.cableCopper0, count: 3} },
		{ mode: 2, input: {id: VanillaItemID.iron_ingot}, result: {id: ItemID.cableIron0, count: 4} },
		{ mode: 2, input: {id: VanillaItemID.gold_ingot}, result: {id: ItemID.cableGold0, count: 4} },
		{ mode: 2, input: {id: ItemID.casingTin}, result: {id: ItemID.tinCanEmpty, count: 1} },
		{ mode: 2, input: {id: ItemID.plateIron}, result: {id: ItemID.fuelRod, count: 1} }
	]);

	MachineRecipeRegistry.registerDictionary("metalFormer", metalFormerDictionary);
});

namespace Machine {
	export type MetalFormerRecipe = {
		input: {id: number, count?: number, data?: number}
		result: {id: number, count: number, data?: number, extra?: ItemExtraData},
		mode: number,
		processTime?: number
	}

	const guiMetalFormer = MachineRegistry.createInventoryWindow("Metal Former", {
		drawing: [
			{type: "bitmap", x: 530, y: 164, bitmap: "metalformer_bar_background", scale: GUI_SCALE},
			{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE},
		],

		elements: {
			"progressScale": {type: "scale", x: 530, y: 164, direction: 0, bitmap: "metalformer_bar_scale", scale: GUI_SCALE, clicker: {
				onClick: () => {
					RV?.RecipeTypeRegistry.openRecipePage("icpe_metalFormer");
				}
			}},
			"energyScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
			"slotSource": {type: "slot", x: 441, y: 79},
			"slotEnergy": {type: "slot", x: 441, y: 218},
			"slotResult": {type: "slot", x: 717, y: 148},
			"slotUpgrade1": {type: "slot", x: 870, y: 60},
			"slotUpgrade2": {type: "slot", x: 870, y: 119},
			"slotUpgrade3": {type: "slot", x: 870, y: 178},
			"slotUpgrade4": {type: "slot", x: 870, y: 237},
			"button": {type: "button", x: 572, y: 210, bitmap: "metal_former_button_0", scale: GUI_SCALE, clicker: {
				onClick: function(_, container: ItemContainer) {
					container.sendEvent("switchMode", {});
				}
			}}
		}
	});

	export class MetalFormer extends ProcessingMachine {
		defaultValues = {
			energy: 0,
			progress: 0,
			mode: 0
		}

		defaultEnergyStorage = 4000;
		defaultEnergyDemand = 10;
		defaultProcessTime = 200;
		upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName(): UI.IWindow {
			return guiMetalFormer;
		}

		getRecipeResult(id: number): ProcessingRecipe {
			return MachineRecipeRegistry.getRecipe("metalFormer", this.data.mode, id);
		}

		onTick(): void {
			this.container.sendEvent("setModeIcon", { mode: this.data.mode });
			super.onTick();
		}

		@ContainerEvent(Side.Server, "switchMode")
		onSwitchMode(): void {
			this.data.mode = (this.data.mode + 1) % 3;
		}

		/** @deprecated Container event, shouldn't be called */
		@ContainerEvent(Side.Client)
		setModeIcon(container: ItemContainer, window: any, content: any, data: {mode: number}): void {
			if (content) {
				content.elements.button.bitmap = "metal_former_button_" + data.mode;
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.metalFormer, new MetalFormer());

	StorageInterface.createInterface(BlockID.metalFormer, {
		slots: {
			"slotSource": {input: true},
			"slotResult": {output: true}
		},
		isValidInput: (item: ItemInstance) => {
			return MachineRecipeRegistry.hasRecipeFor("metalFormer0", item.id) ||
			MachineRecipeRegistry.hasRecipeFor("metalFormer1", item.id) ||
			MachineRecipeRegistry.hasRecipeFor("metalFormer2", item.id);
		}
	});
}