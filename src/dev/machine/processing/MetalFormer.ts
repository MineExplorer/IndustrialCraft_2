/// <reference path="BasicProcessingMachine.ts" />

BlockRegistry.createBlock("metalFormer", [
	{name: "Metal Former", texture: [["ic_machine_bottom", 0], ["metal_former_top", 0], ["ic_machine_side", 0], ["metal_former_front", 0], ["ic_machine_side", 0], ["ic_machine_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.metalFormer, "stone", 1);

TileRenderer.setStandardModel(BlockID.metalFormer, 2, [["ic_machine_bottom", 0], ["metal_former_top", 0], ["metal_former_front", 0], ["ic_machine_side", 0], ["ic_machine_side", 0], ["ic_machine_side", 0]]);
TileRenderer.setStandardModel(BlockID.metalFormer, 3, [["ic_machine_bottom", 0], ["metal_former_top", 0], ["ic_machine_side", 0], ["metal_former_front", 0], ["ic_machine_side", 0], ["ic_machine_side", 0]]);
TileRenderer.setStandardModel(BlockID.metalFormer, 4, [["ic_machine_bottom", 0], ["metal_former_top2", 0], ["ic_machine_side", 0], ["ic_machine_side", 0], ["metal_former_front", 0], ["ic_machine_side", 0]]);
TileRenderer.setStandardModel(BlockID.metalFormer, 5, [["ic_machine_bottom", 0], ["metal_former_top2", 0], ["ic_machine_side", 0], ["ic_machine_side", 0], ["ic_machine_side", 0], ["metal_former_front", 0]]);
TileRenderer.registerRenderModel(BlockID.metalFormer, 2, [["ic_machine_bottom", 0], ["metal_former_top_active", 0], ["metal_former_front_active", 0], ["ic_machine_side", 0], ["ic_machine_side", 0], ["ic_machine_side", 0]]);
TileRenderer.registerRenderModel(BlockID.metalFormer, 3, [["ic_machine_bottom", 0], ["metal_former_top_active", 0], ["ic_machine_side", 0], ["metal_former_front_active", 0], ["ic_machine_side", 0], ["ic_machine_side", 0]]);
TileRenderer.registerRenderModel(BlockID.metalFormer, 4, [["ic_machine_bottom", 0], ["metal_former_top2_active", 0], ["ic_machine_side", 0], ["ic_machine_side", 0], ["metal_former_front_active", 0], ["ic_machine_side", 0]]);
TileRenderer.registerRenderModel(BlockID.metalFormer, 5, [["ic_machine_bottom", 0], ["metal_former_top2_active", 0], ["ic_machine_side", 0], ["ic_machine_side", 0], ["ic_machine_side", 0], ["metal_former_front_active", 0]]);
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

	const rollingDictionary: MachineRecipe.ProcessingRecipeDictionary = MachineRecipeRegistry.getDictionary("metalRolling");
	// ingots
	rollingDictionary.addRecipe({id: VanillaItemID.iron_ingot}, {id: ItemID.plateIron, count: 1});
	rollingDictionary.addRecipe({id: VanillaItemID.gold_ingot}, {id: ItemID.plateGold, count: 1});
	rollingDictionary.addRecipe({id: ItemID.ingotCopper}, {id: ItemID.plateCopper, count: 1});
	rollingDictionary.addRecipe({id: ItemID.ingotTin}, {id: ItemID.plateTin, count: 1});
	rollingDictionary.addRecipe({id: ItemID.ingotBronze}, {id: ItemID.plateBronze, count: 1});
	rollingDictionary.addRecipe({id: ItemID.ingotSteel}, {id: ItemID.plateSteel, count: 1});
	rollingDictionary.addRecipe({id: ItemID.ingotLead}, {id: ItemID.plateLead, count: 1});
	rollingDictionary.addRecipe({id: ItemID.ingotSilver}, {id: ItemID.plateSilver, count: 1});
	// plates
	rollingDictionary.addRecipe({id: ItemID.plateIron}, {id: ItemID.casingIron, count: 2});
	rollingDictionary.addRecipe({id: ItemID.plateGold}, {id: ItemID.casingGold, count: 2});
	rollingDictionary.addRecipe({id: ItemID.plateTin}, {id: ItemID.casingTin, count: 2});
	rollingDictionary.addRecipe({id: ItemID.plateCopper}, {id: ItemID.casingCopper, count: 2});
	rollingDictionary.addRecipe({id: ItemID.plateBronze}, {id: ItemID.casingBronze, count: 2});
	rollingDictionary.addRecipe({id: ItemID.plateSteel}, {id: ItemID.casingSteel, count: 2});
	rollingDictionary.addRecipe({id: ItemID.plateLead}, {id: ItemID.casingLead, count: 2});
	rollingDictionary.addRecipe({id: ItemID.plateSilver}, {id: ItemID.casingSilver, count: 2});

	const cuttingDictionary: MachineRecipe.ProcessingRecipeDictionary = MachineRecipeRegistry.getDictionary("metalCutting");
	cuttingDictionary.addRecipe({id: ItemID.plateTin}, {id: ItemID.cableTin0, count: 3});
	cuttingDictionary.addRecipe({id: ItemID.plateCopper}, {id: ItemID.cableCopper0, count: 3});
	cuttingDictionary.addRecipe({id: ItemID.plateGold}, {id: ItemID.cableGold0, count: 4});
	cuttingDictionary.addRecipe({id: ItemID.plateIron}, {id: ItemID.cableIron0, count: 4});

	const extrudingDictionary: MachineRecipe.ProcessingRecipeDictionary = MachineRecipeRegistry.getDictionary("metalExtruding");
	extrudingDictionary.addRecipe({id: ItemID.ingotTin}, {id: ItemID.cableTin0, count: 3});
	extrudingDictionary.addRecipe({id: ItemID.ingotCopper}, {id: ItemID.cableCopper0, count: 3});
	extrudingDictionary.addRecipe({id: VanillaItemID.iron_ingot}, {id: ItemID.cableIron0, count: 4});
	extrudingDictionary.addRecipe({id: VanillaItemID.gold_ingot}, {id: ItemID.cableGold0, count: 4});
	extrudingDictionary.addRecipe({id: ItemID.casingTin}, {id: ItemID.tinCanEmpty, count: 1});
	extrudingDictionary.addRecipe({id: ItemID.plateIron}, {id: ItemID.fuelRod, count: 1});
});

namespace Machine {
	const enum MetalFormerMode {
		Rolling,
		Cutting,
		Extruding
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

	export class MetalFormer extends BasicProcessingMachine {
		defaultValues = {
			energy: 0,
			progress: 0,
			mode: MetalFormerMode.Rolling
		}

		defaultEnergyStorage = 4000;
		defaultEnergyDemand = 10;
		defaultProcessTime = 200;
		upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName(): UI.IWindow {
			return guiMetalFormer;
		}

		getRecipeDictionary(): MachineRecipe.ProcessingRecipeDictionary {
			return MachineRecipeRegistry.getDictionary(this.getRecipeCategory());
		}

		getRecipeCategory() {
			switch (this.data.mode) {
				case MetalFormerMode.Rolling:
					return "metalRolling";
				case MetalFormerMode.Cutting:
					return "metalCutting";
				case MetalFormerMode.Extruding:
					return "metalExtruding"
			}
		}

		onTick(): void {
			this.container.sendEvent("setModeIcon", { mode: this.data.mode });
			super.onTick();
		}

		@ContainerEvent(Side.Server, "switchMode")
		onSwitchMode(): void {
			this.data.mode = (this.data.mode + 1) % 3;
			this.data.progress = 0;
		}

		@ContainerEvent(Side.Client, "setModeIcon")
		onSetModeIcon(container: ItemContainer, window: any, content: any, data: {mode: number}): void {
			if (content) {
				content.elements.button.bitmap = "metal_former_button_" + data.mode;
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.metalFormer, new MetalFormer());

	MachineRecipeRegistry.registerDictionary("metalRolling", new MachineRecipe.ProcessingRecipeDictionary(200));
	MachineRecipeRegistry.registerDictionary("metalCutting", new MachineRecipe.ProcessingRecipeDictionary(200));
	MachineRecipeRegistry.registerDictionary("metalExtruding", new MachineRecipe.ProcessingRecipeDictionary(200));

	StorageInterface.createInterface(BlockID.metalFormer, {
		slots: {
			"slotSource": {input: true},
			"slotResult": {output: true}
		},
		isValidInput: (item: ItemInstance, side: number, tileEntity: MetalFormer) => {
			return tileEntity.isValidSource(item.id, item.data);
		}
	});
}
