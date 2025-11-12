BlockRegistry.createBlock("oreWasher", [
	{name: "Ore Washing Plant", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.oreWasher, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.oreWasher, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.oreWasher, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 1], ["ore_washer_side", 1], ["ore_washer_side", 1]]);
TileRenderer.setRotationFunction(BlockID.oreWasher);

ItemName.addTierTooltip("oreWasher", 1);
ItemName.addConsumptionTooltip("oreWasher", "EU", 16);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.oreWasher, count: 1, data: 0}, [
		"aaa",
		"b#b",
		"xcx"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.electricMotor, 0, 'a', ItemID.plateIron, 0, 'b', 325, 0, 'c', ItemID.circuitBasic, 0]);

	MachineRecipeRegistry.registerRecipesFor("oreWasher", {
		"ItemID.crushedCopper": [ItemID.crushedPurifiedCopper, 1, ItemID.dustSmallCopper, 2, ItemID.dustStone, 1],
		"ItemID.crushedTin": [ItemID.crushedPurifiedTin, 1, ItemID.dustSmallTin, 2, ItemID.dustStone, 1],
		"ItemID.crushedIron": [ItemID.crushedPurifiedIron, 1, ItemID.dustSmallIron, 2, ItemID.dustStone, 1],
		"ItemID.crushedGold": [ItemID.crushedPurifiedGold, 1, ItemID.dustSmallGold, 2, ItemID.dustStone, 1],
		"ItemID.crushedSilver": [ItemID.crushedPurifiedSilver, 1, ItemID.dustSmallSilver, 2, ItemID.dustStone, 1],
		"ItemID.crushedLead": [ItemID.crushedPurifiedLead, 1, ItemID.dustSmallSulfur, 3, ItemID.dustStone, 1],
		"ItemID.crushedUranium": [ItemID.crushedPurifiedUranium, 1, ItemID.dustSmallLead, 2, ItemID.dustStone, 1],
		"minecraft:gravel": [318, 1, ItemID.dustStone, 1]
	}, true);
});


const guiOreWasher = MachineRegistry.createInventoryWindow("Ore Washing Plant", {
	drawing: [
		{type: "bitmap", x: 400, y: 50, bitmap: "ore_washer_background", scale: GUI_SCALE_NEW},
		{type: "bitmap", x: 415, y: 170, bitmap: "energy_small_background", scale: GUI_SCALE_NEW}
	],

	elements: {
		"progressScale": {type: "scale", x: 400 + 98*GUI_SCALE_NEW, y: 50 + 35*GUI_SCALE_NEW, direction: 0, bitmap: "ore_washer_bar_scale", scale: GUI_SCALE_NEW, clicker: {
			onClick: () => {
				RV?.RecipeTypeRegistry.openRecipePage("icpe_oreWasher");
			}
		}},
		"energyScale": {type: "scale", x: 415, y: 170, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE_NEW},
		"liquidScale": {type: "scale", x: 400 + 60*GUI_SCALE_NEW, y: 50 + 21*GUI_SCALE_NEW, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE_NEW},
		"slotEnergy": {type: "slot", x: 400 + 3*GUI_SCALE_NEW, y: 50 + 58*GUI_SCALE_NEW, size: 54},
		"slotLiquid1": {type: "slot", x: 400 + 33*GUI_SCALE_NEW, y: 50 + 13*GUI_SCALE_NEW, size: 54},
		"slotLiquid2": {type: "slot", x: 400 + 33*GUI_SCALE_NEW, y: 50 + 58*GUI_SCALE_NEW, size: 54},
		"slotSource": {type: "slot", x: 400 + 99*GUI_SCALE_NEW, y: 50 + 13*GUI_SCALE_NEW, size: 54},
		"slotResult1": {type: "slot", x: 400 + 81*GUI_SCALE_NEW, y: 50 + 58*GUI_SCALE_NEW, size: 54},
		"slotResult2": {type: "slot", x: 400 + 99*GUI_SCALE_NEW, y: 50 + 58*GUI_SCALE_NEW, size: 54},
		"slotResult3": {type: "slot", x: 400 + 117*GUI_SCALE_NEW, y: 50 + 58*GUI_SCALE_NEW, size: 54},
		"slotUpgrade1": {type: "slot", x: 860, y: 50 + 3*GUI_SCALE_NEW, size: 54},
		"slotUpgrade2": {type: "slot", x: 860, y: 50 + 21*GUI_SCALE_NEW, size: 54},
		"slotUpgrade3": {type: "slot", x: 860, y: 50 + 39*GUI_SCALE_NEW, size: 54},
		"slotUpgrade4": {type: "slot", x: 860, y: 50 + 57*GUI_SCALE_NEW, size: 54},
	}
});

namespace Machine {
	export class OreWasher extends ProcessingMachine {
		liquidTank: BlockEngine.LiquidTank;

		defaultEnergyStorage = 10000;
		defaultEnergyDemand = 16;
		defaultProcessTime = 500;
		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidPulling"];

		getScreenByName(): UI.IWindow {
			return guiOreWasher;
		}

		setupContainer(): void {
			this.liquidTank = this.addLiquidTank("fluid", 8000, ["water"]);

			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data, extra) => {
				if (name == "slotSource") return !!this.getRecipeResult(id);
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name == "slotLiquid1") return LiquidItemRegistry.getItemLiquid(id, data, extra) == "water";
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		checkResult(result: number[]) {
			for (let i = 1; i < 4; i++) {
				const id = result[(i-1) * 2];
				if (!id) return true;
				const count = result[(i-1) * 2 + 1];
				const resultSlot = this.container.getSlot("slotResult"+i);
				if (resultSlot.id != 0 && (resultSlot.id != id || resultSlot.count + count > 64)) {
					return false;
				}
			}
			return true;
		}

		putResult(result: number[]) {
			this.liquidTank.getLiquid(1000);
			for (let i = 1; i < 4; i++) {
				const id = result[(i-1) * 2];
				if (!id) break;
				const count = result[(i-1) * 2 + 1];
				const resultSlot = this.container.getSlot("slotResult"+i);
				resultSlot.setSlot(id, resultSlot.count + count, 0);
			}
		}

		getRecipeResult(id: number): number[] {
			return MachineRecipeRegistry.getRecipeResult("oreWasher", id);
		}

		onTick(): void {
			this.useUpgrades();
			StorageInterface.checkHoppers(this);

			const slot1 = this.container.getSlot("slotLiquid1");
			const slot2 = this.container.getSlot("slotLiquid2");
			this.liquidTank.getLiquidFromItem(slot1, slot2);

			let newActive = false;
			const sourceSlot = this.container.getSlot("slotSource");
			const result = this.getRecipeResult(sourceSlot.id);
			if (result && this.checkResult(result) && this.liquidTank.getAmount("water") >= 1000) {
				if (this.data.energy >= this.energyDemand) {
					this.data.energy -= this.energyDemand;
					this.updateProgress();
					newActive = true;
				}
				if (this.isCompletedProgress()) {
					this.decreaseSlot(sourceSlot, 1);
					this.putResult(result);
					this.data.progress = 0;
				}
			}
			else {
				this.data.progress = 0;
			}
			this.setActive(newActive);

			this.dischargeSlot("slotEnergy");

			this.liquidTank.updateUiScale("liquidScale");
			this.container.setScale("progressScale", this.data.progress);
			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.sendChanges();
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
			if (Entity.getSneaking(player)) {
				if (MachineRegistry.fillTankOnClick(this.liquidTank, item, player)) {
					this.preventClick();
					return true;
				}
			}
			return super.onItemUse(coords, item, player);
		}
	}

	MachineRegistry.registerPrototype(BlockID.oreWasher, new OreWasher());

	MachineRegistry.createFluidStorageInterface(BlockID.oreWasher, {
		slots: {
			"slotSource": {input: true, isValid: (item: ItemInstance) => {
				return MachineRecipeRegistry.hasRecipeFor("oreWasher", item.id, item.data);
			}},
			"slotLiquid1": {input: true, isValid: (item: ItemInstance) => {
				return LiquidItemRegistry.getItemLiquid(item.id, item.data, item.extra) == "water";
			}},
			"slotLiquid2": {output: true},
			"slotResult1": {output: true},
			"slotResult2": {output: true},
			"slotResult3": {output: true}
		},
		canTransportLiquid: () => false
	});
}