IDRegistry.genBlockID("blastFurnace");
Block.createBlock("blastFurnace", [
	{name: "Blast Furnace", texture: [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true},
], "machine");
ToolAPI.registerBlockMaterial(BlockID.blastFurnace, "stone", 1, true);

TileRenderer.setHandAndUiModel(BlockID.blastFurnace, 0, [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.blastFurnace, 0, [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], true);
TileRenderer.registerModelWithRotation(BlockID.blastFurnace, 0, [["machine_advanced", 0], ["ind_furnace_side", 1], ["machine_back", 0], ["heat_pipe", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]], true);
TileRenderer.setRotationFunction(BlockID.blastFurnace, true);

MachineRegistry.setMachineDrop("blastFurnace", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.blastFurnace, count: 1, data: 0}, [
		"aaa",
		"asa",
		"axa"
	], ['s', BlockID.machineBlockBasic, 0, 'a', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);

	MachineRecipeRegistry.registerRecipesFor("blastFurnace", {
		15: {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000},
		265: {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000},
		"ItemID.dustIron": {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000},
		"ItemID.crushedPurifiedIron": {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000},
		"ItemID.crushedIron": {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000}
	}, true);
});


var guiBlastFurnace = InventoryWindow("Blast Furnace", {
	drawing: [
		{type: "bitmap", x: 450, y: 50, bitmap: "blast_furnace_background", scale: GUI_SCALE_NEW}
	],

	elements: {
		"progressScale": {type: "scale", x: 450 + 50*GUI_SCALE_NEW, y: 50 + 27*GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "blast_furnace_scale", scale: GUI_SCALE_NEW},
		"heatScale": {type: "scale", x: 450 + 46*GUI_SCALE_NEW, y: 50 + 63*GUI_SCALE_NEW, direction: 0, value: 0.5, bitmap: "heat_scale", scale: GUI_SCALE_NEW},
		"slotSource": {type: "slot", x: 450 + 9*GUI_SCALE_NEW, y: 50 + 25*GUI_SCALE_NEW, isValid: function(id) {
			return MachineRecipeRegistry.hasRecipeFor("blastFurnace", id);
		}},
		"slotResult1": {type: "slot", x: 450 + 108*GUI_SCALE_NEW, y: 50 + 48*GUI_SCALE_NEW, size: 54},
		"slotResult2": {type: "slot", x: 450 + 126*GUI_SCALE_NEW, y: 50 + 48*GUI_SCALE_NEW, size: 54},
		"slotAir1": {type: "slot", x: 450, y: 50 + 48*GUI_SCALE_NEW, bitmap: "slot_black", size: 54},
		"slotAir2": {type: "slot", x: 450 + 18*GUI_SCALE_NEW, y: 50 + 48*GUI_SCALE_NEW, bitmap: "slot_black", size: 54},
		"slotUpgrade1": {type: "slot", x: 450 + 126*GUI_SCALE_NEW, y: 50, size: 54},
		"slotUpgrade2": {type: "slot", x: 450 + 126*GUI_SCALE_NEW, y: 50 + 18*GUI_SCALE_NEW, size: 54},
		"indicator": {type: "image", x: 450 + 71*GUI_SCALE_NEW, y: 50 + 59*GUI_SCALE_NEW, bitmap: "indicator_red", scale: GUI_SCALE_NEW}
	}
});

namespace Machine {
	export class BlastFurnace
	extends MachineBase
	implements IHeatConsumer {
		defaultValues = {
			progress: 0,
			air: 0,
			sourceID: 0,
			isActive: false,
			isHeating: false,
			heat: 0,
			signal: 0
		}

		upgrades = ["redstone", "itemEjector", "itemPulling"]

		getScreenByName() {
		   return guiBlastFurnace;
		}

		setupContainer() {
			StorageInterface.setSlotValidatePolicy(this.container, "sourceSlot", (name, id) => MachineRecipeRegistry.hasRecipeFor("blastFurnace", id));
			StorageInterface.setSlotValidatePolicy(this.container, "slotAir1", (name, id) => id == ItemID.cellAir);
			this.container.setSlotAddTransferPolicy("slotAir2", () => 0);
			this.container.setSlotAddTransferPolicy("slotResult1", () => 0);
			this.container.setSlotAddTransferPolicy("slotResult2", () => 0);
			StorageInterface.setSlotValidatePolicy(this.container, "slotUpgrade1", (name, id) => UpgradeAPI.isValidUpgrade(id, this));
			StorageInterface.setSlotValidatePolicy(this.container, "slotUpgrade2", (name, id) => UpgradeAPI.isValidUpgrade(id, this));
		}

		checkResult(result: number[]) {
			for (var i = 1; i < 3; i++) {
				var id = result[(i-1) *2 ];
				if (!id) break;
				var count = result[(i-1) * 2 + 1];
				var resultSlot = this.container.getSlot("slotResult"+i);
				if (resultSlot.id != 0 && (resultSlot.id != id || resultSlot.count + count > 64)) {
					return false;
				}
			}
			return true;
		}

		putResult(result: number[]) {
			for (var i = 1; i < 3; i++) {
				var id = result[(i-1) *2];
				if (!id) break;
				var count = result[(i-1) * 2 + 1];
				var resultSlot = this.container.getSlot("slotResult"+i);
				resultSlot.setSlot(id, resultSlot.count + count, 0);
			}
		}

		controlAir() {
			var slot1 = this.container.getSlot("slotAir1");
			var slot2 = this.container.getSlot("slotAir2");
			if (this.data.air == 0) {
				if (slot1.id == ItemID.cellAir && (slot2.id == 0 || slot2.id == ItemID.cellEmpty && slot2.count < 64)) {
					slot1.setSlot(slot1.id, slot1.count - 1, 0);
					slot1.validate();
					slot2.setSlot(ItemID.cellEmpty, slot2.count + 1, 0);
					this.data.air = 1000;
				}
			}
			if (this.data.air > 0) {
				this.data.air--;
				return true;
			}
			return false;
		}

		@ContainerEvent(Side.Client)
		showAirImage(contaier: any, window: any, content: any, data: {show: boolean}) {
			if (content) {
				if (data.show)
					content.elements["indicatorAir"] = {type: "image", x: 344 + 110*GUI_SCALE_NEW, y: 53 + 20*GUI_SCALE_NEW, bitmap: "no_air_image", scale: GUI_SCALE_NEW};
				else
					content.elements["indicatorAir"] = null;
			}
		}

		@ContainerEvent(Side.Client)
		setIndicator(contaier: any, window: any, content: any, data: string) {
			if (content) {
				content.elements["indicator"].bitmap = "indicator_" + data;
			}
		}

		tick() {
			this.data.isHeating = this.data.signal > 0;
			UpgradeAPI.executeUpgrades(this);

			var maxHeat = this.getMaxHeat();
			this.data.heat = Math.min(this.data.heat, maxHeat);
			this.container.setScale("heatScale", this.data.heat / maxHeat);

			if (this.data.heat >= maxHeat) {
				this.container.sendEvent("setIndicator", "green");
				var sourceSlot = this.container.getSlot("slotSource");
				var source = this.data.sourceID || sourceSlot.id;
				var result = MachineRecipeRegistry.getRecipeResult("blastFurnace", source);
				if (result && this.checkResult(result.result)) {
					if (this.controlAir()) {
						this.container.sendEvent("showAirImage", {show: true});
						this.data.progress++;
						this.container.setScale("progressScale", this.data.progress / result.duration);
						this.setActive(true);

						if (!this.data.sourceID) {
							this.data.sourceID = source;
							this.decreaseSlot(sourceSlot, 1);
						}

						if (this.data.progress >= result.duration) {
							this.putResult(result.result);
							this.data.progress = 0;
							this.data.sourceID = 0;
						}
					} else {
						this.container.sendEvent("showAirImage", {show: false});
					}
				}
			} else {
				this.container.sendEvent("setIndicator", "red");
				this.setActive(false);
			}

			if (this.data.heat > 0) this.data.heat--;
			if (this.data.sourceID == 0) {
				this.container.setScale("progressScale", 0);
			}
			this.container.sendChanges();
		}

		getMaxHeat() {
			return 50000;
		}

		redstone(signal) {
			this.data.signal = signal.power > 0;
		}

		canReceiveHeat(side: number) {
			return side == this.getFacing();
		}

		heatReceive(amount: number) {
			var slot = this.container.getSlot("slotSource");
			if (this.data.isHeating || this.data.sourceID > 0 || MachineRecipeRegistry.getRecipeResult("blastFurnace", slot.id)) {
				amount = Math.min(this.getMaxHeat() - this.data.heat, amount);
				this.data.heat += amount + 1;
				return amount;
			}
			return 0;
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (ICTool.isValidWrench(item)) {
				ICTool.rotateMachine(this, coords.side, item, player)
				return true;
			}
			return super.onItemUse(coords, item, player);
		}
	}

	MachineRegistry.registerPrototype(BlockID.blastFurnace, new BlastFurnace());

	StorageInterface.createInterface(BlockID.blastFurnace, {
		slots: {
			"slotSource": {input: true, isValid: (item: ItemInstance) => {
				return MachineRecipeRegistry.hasRecipeFor("blastFurnace", item.id);
			}},
			"slotAir1": {input: true, isValid: (item: ItemInstance) => item.id == ItemID.cellAir},
			"slotAir2": {output: true},
			"slotResult1": {output: true},
			"slotResult2": {output: true}
		}
	});
}