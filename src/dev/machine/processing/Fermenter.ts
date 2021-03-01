IDRegistry.genBlockID("icFermenter");
Block.createBlock("icFermenter", [
	{name: "Fermenter", texture: [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]], inCreative: true},
], "machine");
ToolAPI.registerBlockMaterial(BlockID.icFermenter, "stone", 1, true);

TileRenderer.setHandAndUiModel(BlockID.icFermenter, 0, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.icFermenter, 0, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]], true);
TileRenderer.registerModelWithRotation(BlockID.icFermenter, 0, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 1], ["heat_pipe", 1], ["ic_fermenter_side", 1], ["ic_fermenter_side", 1]], true);
TileRenderer.setRotationFunction(BlockID.icFermenter, true);

MachineRegistry.setMachineDrop("icFermenter");

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.icFermenter, count: 1, data: 0}, [
		"aaa",
		"ccc",
		"axa"
	], ['c', ItemID.cellEmpty, 0, 'a', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
});


const guiFermenter = InventoryWindow("Fermenter", {
	drawing: [
		{type: "bitmap", x: 390, y: 80, bitmap: "fermenter_background", scale: GUI_SCALE},
		{type: "bitmap", x: 758, y: 95, bitmap: "liquid_bar", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 492, y: 150, direction: 0, value: .5, bitmap: "fermenter_progress_scale", scale: GUI_SCALE},
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
		defaultValues = {
			heat: 0,
			progress: 0,
			fertilizer: 0,
		}

		upgrades = ["itemEjector", "itemPulling", "fluidEjector", "fluidPulling"];

		getScreenByName() {
			return guiFermenter;
		}

		setupContainer(): void {
			this.liquidStorage.setLimit("biomass", 10);
			this.liquidStorage.setLimit("biogas", 2);

			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, count, data) => {
				if (name == "slotBiomass0") return LiquidLib.getItemLiquid(id, data) == "biomass";
				if (name == "slotBiogas0") return !!LiquidLib.getFullItem(id, data, "biogas");
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		tick(): void {
			UpgradeAPI.executeUpgrades(this);
			this.setActive(this.data.heat > 0);

			if (this.data.heat > 0) {
				this.data.progress += this.data.heat;
				this.data.heat = 0;

				if (this.data.progress >= 4000) {
					this.liquidStorage.getLiquid("biomass", 0.02);
					this.liquidStorage.addLiquid("biogas", 0.4);
					this.data.fertilizer++;
					this.data.progress = 0;
				}

				let outputSlot = this.container.getSlot("slotFertilizer");
				if (this.data.fertilizer >= 25) {
					this.data.fertilizer = 0;
					outputSlot.setSlot(ItemID.fertilizer, outputSlot.count + 1, 0);
				}
			}

			let slot1 = this.container.getSlot("slotBiomass0");
			let slot2 = this.container.getSlot("slotBiomass1");
			this.getLiquidFromItem("biomass", slot1, slot2);

			slot1 = this.container.getSlot("slotBiogas0");
			slot2 = this.container.getSlot("slotBiogas1");
			this.addLiquidToItem("biogas", slot1, slot2);

			this.container.setScale("progressScale", this.data.progress / 4000);
			this.container.setScale("fertilizerScale", this.data.fertilizer / 25);
			this.updateLiquidScale("biomassScale", "biomass");
			this.updateLiquidScale("biogasScale", "biogas");
			this.container.sendChanges();
		}

		canReceiveHeat(side: number): boolean {
			return side == this.getFacing();
		}

		heatReceive(amount: number): number {
			let outputSlot = this.container.getSlot("slotFertilizer");
			if (this.liquidStorage.getAmount("biomass").toFixed(3) as any >= 0.02 && this.liquidStorage.getAmount("biogas") <= 1.6 && outputSlot.count < 64) {
				this.data.heat = amount;
				return amount;
			}
			return 0;
		}

		getLiquidFromItem(liquid: string, inputItem: ItemInstance, outputItem: ItemInstance, byHand?: boolean): boolean {
			return MachineRegistry.getLiquidFromItem.call(this, liquid, inputItem, outputItem, byHand);
		}

		addLiquidToItem(liquid: string, inputItem: ItemInstance, outputItem: ItemInstance): void {
			return MachineRegistry.addLiquidToItem.call(this, liquid, inputItem, outputItem);
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (Entity.getSneaking(player)) {
				let liquid = this.liquidStorage.getLiquidStored();
				if (this.getLiquidFromItem(liquid, item, new ItemStack(), true)) {
					return true;
				}
			}
			if (ICTool.isValidWrench(item)) {
				ICTool.rotateMachine(this, coords.side, item, player)
				return true;
			}
			return super.onItemUse(coords, item, player);
		}
	}

	MachineRegistry.registerPrototype(BlockID.icFermenter, new Fermenter());

	StorageInterface.createInterface(BlockID.icFermenter, {
		slots: {
			"slotBiomass0": {input: true},
			"slotBiomass1": {output: true},
			"slotBiogas0": {input: true},
			"slotBiogas1": {output: true},
			"slotFertilizer": {output: true}
		},
		canReceiveLiquid: (liquid: string) => liquid == "biomass",
		canTransportLiquid: () => true,
		getLiquidStored: (storage: string) => {
			return storage == "input" ? "biomass" : "biogas";
		}
	});
}