IDRegistry.genBlockID("oreWasher");
Block.createBlock("oreWasher", [
	{name: "Ore Washing Plant", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.oreWasher, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.oreWasher, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.oreWasher, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 1], ["ore_washer_side", 1], ["ore_washer_side", 1]]);
TileRenderer.setRotationFunction(BlockID.oreWasher);

ItemName.addTierTooltip("oreWasher", 1);

MachineRegistry.setMachineDrop("oreWasher", BlockID.machineBlockBasic);

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
		//13: [318, 1, ItemID.dustStone, 1]
	}, true);
});


const guiOreWasher = InventoryWindow("Ore Washing Plant", {
	drawing: [
		{type: "bitmap", x: 400, y: 50, bitmap: "ore_washer_background", scale: GUI_SCALE_NEW},
		{type: "bitmap", x: 415, y: 170, bitmap: "energy_small_background", scale: GUI_SCALE_NEW}
	],

	elements: {
		"progressScale": {type: "scale", x: 400 + 98*GUI_SCALE_NEW, y: 50 + 35*GUI_SCALE_NEW, direction: 0, bitmap: "ore_washer_bar_scale", scale: GUI_SCALE_NEW},
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
	export class OreWasher
	extends ProcessingMachine {
		defaultValues = {
			energy: 0,
			tier: 1,
			energy_storage: 10000,
			energy_consume: 16,
			work_time: 500,
			progress: 0,
		}

		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidPulling"];

		getScreenByName() {
			return guiOreWasher;
		}

		setupContainer(): void {
			this.liquidStorage.setLimit("water", 8);
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name == "slotSource") return !!this.getRecipeResult(id);
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name == "slotLiquid1") return LiquidLib.getItemLiquid(id, data) == "water";
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		checkResult(result: number[]) {
			for (let i = 1; i < 4; i++) {
				let id = result[(i-1) * 2];
				if (!id) return true;
				let count = result[(i-1) * 2 + 1];
				let resultSlot = this.container.getSlot("slotResult"+i);
				if (resultSlot.id != 0 && (resultSlot.id != id || resultSlot.count + count > 64)) {
					return false;
				}
			}
			return true;
		}

		putResult(result: number[]) {
			this.liquidStorage.getLiquid("water", 1);
			for (let i = 1; i < 4; i++) {
				let id = result[(i-1) * 2];
				if (!id) break;
				let count = result[(i-1) * 2 + 1];
				let resultSlot = this.container.getSlot("slotResult"+i);
				resultSlot.setSlot(id, resultSlot.count + count, 0);
			}
		}

		getRecipeResult(id: number) {
			return MachineRecipeRegistry.getRecipeResult("oreWasher", id);
		}

		tick(): void {
			this.resetValues();
			UpgradeAPI.executeUpgrades(this);

			let slot1 = this.container.getSlot("slotLiquid1");
			let slot2 = this.container.getSlot("slotLiquid2");
			this.getLiquidFromItem("water", slot1, slot2);

			let newActive = false;
			let sourceSlot = this.container.getSlot("slotSource");
			let result = this.getRecipeResult(sourceSlot.id);
			if (result && this.checkResult(result) && this.liquidStorage.getAmount("water") >= 1) {
				if (this.data.energy >= this.data.energy_consume) {
					this.data.energy -= this.data.energy_consume;
					this.data.progress += 1/this.data.work_time;
					newActive = true;
				}
				if (this.data.progress.toFixed(3) >= 1) {
					this.decreaseSlot(sourceSlot, 1);
					this.putResult(result);
					this.data.progress = 0;
				}
			}
			else {
				this.data.progress = 0;
			}
			this.setActive(newActive);

			let energyStorage = this.getEnergyStorage();
			this.data.energy = Math.min(this.data.energy, energyStorage);
			this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());

			this.container.setScale("progressScale", this.data.progress);
			this.liquidStorage.updateUiScale("liquidScale", "water");
			this.container.setScale("energyScale", this.data.energy / energyStorage);
		}

		getLiquidFromItem(liquid: string, inputItem: ItemInstance, outputItem: ItemInstance, byHand?: boolean) {
			return MachineRegistry.getLiquidFromItem.call(this, liquid, inputItem, outputItem, byHand);
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
			if (Entity.getSneaking(player)) {
				return this.getLiquidFromItem("lava", item, null, true);
			}
			return super.onItemUse(coords, item, player);
		}

	}

	MachineRegistry.registerPrototype(BlockID.oreWasher, new OreWasher());

	StorageInterface.createInterface(BlockID.oreWasher, {
		slots: {
			"slotSource": {input: true, isValid: (item: ItemInstance) => {
					return MachineRecipeRegistry.hasRecipeFor("oreWasher", item.id, item.data);
			}},
			"slotLiquid1": {input: true, isValid: (item: ItemInstance) => {
				return LiquidLib.getItemLiquid(item.id, item.data) == "water";
			}},
			"slotLiquid2": {output: true},
			"slotResult1": {output: true},
			"slotResult2": {output: true},
			"slotResult3": {output: true}
		},
		canReceiveLiquid: (liquid: string) => liquid == "water",
		canTransportLiquid: () => false
	});
}