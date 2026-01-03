BlockRegistry.createBlock("icFermenter", [
	{name: "Fermenter", texture: [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]], inCreative: true},
], "machine");
BlockRegistry.setBlockMaterial(BlockID.icFermenter, "stone", 1);

TileRenderer.setHandAndUiModel(BlockID.icFermenter, 0, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.icFermenter, 0, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]], true);
TileRenderer.registerModelWithRotation(BlockID.icFermenter, 0, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 1], ["heat_pipe", 1], ["ic_fermenter_side", 1], ["ic_fermenter_side", 1]], true);
TileRenderer.setRotationFunction(BlockID.icFermenter, true);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.icFermenter, count: 1, data: 0}, [
		"aaa",
		"ccc",
		"axa"
	], ['c', ItemID.cellEmpty, 0, 'a', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
});


const guiFermenter = MachineRegistry.createInventoryWindow("Fermenter", {
	drawing: [
		{type: "bitmap", x: 390, y: 80, bitmap: "fermenter_background", scale: GUI_SCALE},
		{type: "bitmap", x: 758, y: 95, bitmap: "liquid_bar", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 492, y: 150, direction: 0, value: .5, bitmap: "fermenter_progress_scale", scale: GUI_SCALE, clicker: {
			onClick: () => {
				RV?.RecipeTypeRegistry.openRecipePage("icpe_fermenter");
			}
		}},
		"fertilizerScale": {type: "scale", x: 480, y: 301, direction: 0, value: .5, bitmap: "fertilizer_progress_scale", scale: GUI_SCALE},
		"biogasScale": {type: "scale", x: 771, y: 108, direction: 1, bitmap: "liquid_biogas", scale: GUI_SCALE},
		"biomassScale": {type: "scale", x: 483, y: 179, direction: 1, bitmap: "biomass_scale", scale: GUI_SCALE},
		"slotBiomass0": {type: "slot", x: 400, y: 162},
		"slotBiomass1": {type: "slot", x: 400, y: 222},
		"slotFertilizer": {type: "slot", x: 634, y: 282, bitmap: "slot_black"},
		"slotBiogas0": {type: "slot", x: 832, y: 155},
		"slotBiogas1": {type: "slot", x: 832, y: 215},
		"slotUpgrade1": {type: "slot", x: 765, y: 290},
		"slotUpgrade2": {type: "slot", x: 825, y: 290}
	}
});

namespace Machine {
	export class Fermenter extends MachineBase
	implements IHeatConsumer {
		inputTank: BlockEngine.LiquidTank;
		outputTank: BlockEngine.LiquidTank;

		defaultValues = {
			heat: 0,
			progress: 0,
			fertilizer: 0,
		}

		upgrades = ["itemEjector", "itemPulling", "fluidEjector", "fluidPulling"];

		getScreenByName(): UI.IWindow {
			return guiFermenter;
		}

		setupContainer(): void {
			this.inputTank = this.addLiquidTank("inputTank", 10000, ["biomass"]);
			this.outputTank = this.addLiquidTank("outputTank", 2000, ["biogas"]);

			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, count, data, extra) => {
				if (name == "slotBiomass0") return LiquidItemRegistry.getItemLiquid(id, data, extra) == "biomass";
				if (name == "slotBiogas0") return LiquidItemRegistry.canBeFilledWithLiquid(id, data, extra, "biogas");
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		onTick(): void {
			UpgradeAPI.useUpgrades(this);
			StorageInterface.checkHoppers(this);
			this.setActive(this.data.heat > 0);

			if (this.data.heat > 0) {
				this.data.progress += this.data.heat;
				this.data.heat = 0;

				if (this.data.progress >= 4000) {
					this.inputTank.getLiquid("biomass", 20);
					this.outputTank.addLiquid("biogas", 400);
					this.data.fertilizer++;
					this.data.progress = 0;
				}

				const outputSlot = this.container.getSlot("slotFertilizer");
				if (this.data.fertilizer >= 25) {
					this.data.fertilizer = 0;
					outputSlot.setSlot(ItemID.fertilizer, outputSlot.count + 1, 0);
				}
			}

			let slot1 = this.container.getSlot("slotBiomass0");
			let slot2 = this.container.getSlot("slotBiomass1");
			this.inputTank.getLiquidFromItem(slot1, slot2);

			slot1 = this.container.getSlot("slotBiogas0");
			slot2 = this.container.getSlot("slotBiogas1");
			this.outputTank.addLiquidToItem(slot1, slot2);

			this.inputTank.updateUiScale("biomassScale");
			this.outputTank.updateUiScale("biogasScale");
			this.container.setScale("progressScale", this.data.progress / 4000);
			this.container.setScale("fertilizerScale", this.data.fertilizer / 25);
			this.container.sendChanges();
		}

		canReceiveHeat(side: number): boolean {
			return side == this.getFacing();
		}

		receiveHeat(amount: number): number {
			const outputSlot = this.container.getSlot("slotFertilizer");
			if (this.inputTank.getAmount("biomass") >= 20 && this.outputTank.getAmount("biogas") <= 1600 && outputSlot.count < 64) {
				this.data.heat = amount;
				return amount;
			}
			return 0;
		}

		canRotate(): boolean {
			return true;
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (Entity.getSneaking(player)) {
				if (MachineRegistry.fillTankOnClick(this.inputTank, item, player)) {
					this.preventClick();
					return true;
				}
			}
			return super.onItemUse(coords, item, player);
		}
	}

	MachineRegistry.registerPrototype(BlockID.icFermenter, new Fermenter());

	MachineRegistry.createFluidStorageInterface(BlockID.icFermenter, {
		slots: {
			"slotBiomass0": {input: true, isValid: (item: ItemInstance) => {
				return LiquidItemRegistry.getItemLiquid(item.id, item.data, item.extra) == "biomass"
			}},
			"slotBiomass1": {output: true},
			"slotBiogas0": {input: true, isValid: (item: ItemInstance) => {
				return LiquidItemRegistry.canBeFilledWithLiquid(item.id, item.data, item.extra, "biogas")
			}},
			"slotBiogas1": {output: true},
			"slotFertilizer": {output: true}
		},
		getInputTank: function() {
			return this.tileEntity.inputTank;
		},
		getOutputTank: function() {
			return this.tileEntity.outputTank;
		}
	});
}