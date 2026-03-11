BlockRegistry.createBlock("blastFurnace", [
	{name: "Industrial Blast Furnace", texture: [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true},
], "machine");
BlockRegistry.setBlockMaterial(BlockID.blastFurnace, "stone", 1);

TileRenderer.setHandAndUiModel(BlockID.blastFurnace, 0, [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.blastFurnace, 0, [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], true);
TileRenderer.registerModelWithRotation(BlockID.blastFurnace, 0, [["machine_advanced", 0], ["ind_furnace_side", 1], ["machine_back", 0], ["heat_pipe", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]], true);
TileRenderer.setRotationFunction(BlockID.blastFurnace, true);

ItemName.addConsumptionTooltip("blastFurnace", "HU", 1, 100);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.blastFurnace, count: 1, data: 0}, [
		"aaa",
		"asa",
		"axa"
	], ['s', BlockID.machineBlockBasic, 0, 'a', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);

	const dictionary: MachineRecipe.BlastFurnaceRecipeDictionary = MachineRecipeRegistry.getDictionary("blastFurnace");
	dictionary.addRecipe({id: VanillaBlockID.iron_ore}, [{id: ItemID.ingotSteel, count: 1}, {id: ItemID.slag, count: 1}], 120_000);
	dictionary.addRecipe({id: VanillaItemID.iron_ingot}, [{id: ItemID.ingotSteel, count: 1}, {id: ItemID.slag, count: 1}], 120_000);
	dictionary.addRecipe({id: ItemID.dustIron}, [{id: ItemID.ingotSteel, count: 1}, {id: ItemID.slag, count: 1}], 120_000);
	dictionary.addRecipe({id: ItemID.crushedPurifiedIron}, [{id: ItemID.ingotSteel, count: 1}, {id: ItemID.slag, count: 1}], 120_000);
	dictionary.addRecipe({id: ItemID.crushedIron}, [{id: ItemID.ingotSteel, count: 1}, {id: ItemID.slag, count: 1}], 120_000);
});

namespace Machine {
	const guiBlastFurnace = MachineRegistry.createInventoryWindow("Industrial Blast Furnace", {
		drawing: [
			{type: "bitmap", x: 450, y: 50, bitmap: "blast_furnace_background", scale: GUI_SCALE_NEW}
		],

		elements: {
			"progressScale": {type: "scale", x: 450 + 50*GUI_SCALE_NEW, y: 50 + 27*GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "blast_furnace_scale", scale: GUI_SCALE_NEW, clicker: {
				onClick: () => {
					RV?.RecipeTypeRegistry.openRecipePage("icpe_blastFurnace");
				}
			}},
			"heatScale": {type: "scale", x: 450 + 46*GUI_SCALE_NEW, y: 50 + 63*GUI_SCALE_NEW, direction: 0, value: 0.5, bitmap: "heat_scale", scale: GUI_SCALE_NEW},
			"slotSource": {type: "slot", x: 450 + 9*GUI_SCALE_NEW, y: 50 + 25*GUI_SCALE_NEW},
			"slotResult1": {type: "slot", x: 450 + 108*GUI_SCALE_NEW, y: 50 + 48*GUI_SCALE_NEW, size: 54},
			"slotResult2": {type: "slot", x: 450 + 126*GUI_SCALE_NEW, y: 50 + 48*GUI_SCALE_NEW, size: 54},
			"slotAir1": {type: "slot", x: 450, y: 50 + 48*GUI_SCALE_NEW, bitmap: "slot_black", size: 54},
			"slotAir2": {type: "slot", x: 450 + 18*GUI_SCALE_NEW, y: 50 + 48*GUI_SCALE_NEW, bitmap: "slot_black", size: 54},
			"slotUpgrade1": {type: "slot", x: 450 + 126*GUI_SCALE_NEW, y: 50, size: 54},
			"slotUpgrade2": {type: "slot", x: 450 + 126*GUI_SCALE_NEW, y: 50 + 18*GUI_SCALE_NEW, size: 54},
			"indicator": {type: "image", x: 450 + 71*GUI_SCALE_NEW, y: 50 + 59*GUI_SCALE_NEW, bitmap: "indicator_red", scale: GUI_SCALE_NEW}
		}
	});

	export class BlastFurnace extends MachineBase
	implements IHeatConsumer {
		defaultValues = {
			progress: 0,
			maxProgress: 0,
			air: 0,
			sourceID: 0,
			heat: 0,
		}

		maxHeatConsumption = 100;
		defaultDrop = BlockID.machineBlockBasic;
		upgrades = ["redstone", "itemEjector", "itemPulling"];

		isHeating: boolean = false;
		isPowered: boolean;
		upgradeSet?: UpgradeAPI.UpgradeSet;

		getScreenByName(): UI.IWindow {
		   return guiBlastFurnace;
		}

		setupContainer(): void {
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, count, data) => {
				if (name == "slotSource") return !!this.getRecipe(id);
				if (name == "slotAir1") return id == ItemID.cellAir;
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		canRotate(): boolean {
			return true;
		}

		getRecipeDictionary(): MachineRecipe.BlastFurnaceRecipeDictionary {
			return MachineRecipeRegistry.getDictionary("blastFurnace");
		}

		getRecipe(id: number): Nullable<BlastFurnaceRecipe> {
			return this.getRecipeDictionary().getRecipe(id, 0);
		}
		
		checkResult(result: ItemOutputEntry[]): boolean {
			for (let i = 0; i < result.length; i++) {
				const entry = result[i - 1];
				const resultSlot = this.container.getSlot("slotResult" + (i + 1));
				const itemData = entry.data || 0;
				if (resultSlot.id != 0 && (resultSlot.id != entry.id || resultSlot.data != itemData || resultSlot.count + entry.count > 64)) {
					return false;
				}
			}
			return true;
		}

		putResult(result: ItemOutputEntry[]): void {
			for (let i = 0; i < result.length; i++) {
				const entry = result[i];
				if (entry.chance != null && Math.random() >= entry.chance) {
					continue;
				}
				const resultSlot = this.container.getSlot("slotResult" + (i + 1));
				resultSlot.setSlot(entry.id, resultSlot.count + entry.count, entry.data || 0, entry.extra || null);
			}
		}

		controlAir(): boolean {
			const slot1 = this.container.getSlot("slotAir1");
			const slot2 = this.container.getSlot("slotAir2");
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

		useUpgrades(): void {
			const upgrades = UpgradeAPI.performUpgrades(this.upgradeSet);
			this.isHeating = upgrades.getRedstoneInput(this.isPowered) || this.data.sourceID > 0;
		}

		onInit(): void {
			super.onInit();
			this.upgradeSet = UpgradeAPI.getUpgradeSet(this);
		}

		onTick(): void {
			this.useUpgrades();
			StorageInterface.checkHoppers(this);

			const maxHeat = this.getMaxHeat();
			this.data.heat = Math.min(this.data.heat, maxHeat);
			this.container.setScale("heatScale", this.data.heat / maxHeat);

			if (this.data.heat >= maxHeat) {
				this.container.sendEvent("setIndicator", "green");
			} else {
				this.container.sendEvent("setIndicator", "red");
				this.setActive(false);
			}

			if (this.data.heat > 0 && !this.isHeating) {
				this.data.heat--;
			}
			
			const relativeProgress = this.data.maxProgress > 0 ? this.data.progress / this.data.maxProgress : 0;
			this.container.setScale("progressScale", relativeProgress);
			this.container.sendChanges();
		}

		getMaxHeat(): number {
			return 50000;
		}

		onRedstoneUpdate(signal: number): void {
			this.isPowered = signal > 0;
		}

		canReceiveHeat(side: number): boolean {
			return side == this.getFacing();
		}

		receiveHeat(amount: number): number {
			const slot = this.container.getSlot("slotSource");
			if (this.isHeating || this.getRecipe(slot.id)) {
				amount = Math.min(this.maxHeatConsumption, amount);
				const maxHeat = this.getMaxHeat();
				const heatingAmount = Math.min(maxHeat - this.data.heat, amount);
				if (heatingAmount > 0) {
					this.data.heat += heatingAmount;
					amount -= heatingAmount;
				}
				if (amount > 0 && this.data.heat >= maxHeat) {
					const progressAmount = this.performRecipe(amount);
					return heatingAmount + progressAmount;
				}
				return heatingAmount;
			}
			return 0;
		}

		performRecipe(receivedHeat: number): number {
			const sourceSlot = this.container.getSlot("slotSource");
			const sourceID = this.data.sourceID || sourceSlot.id;
			const recipe = this.getRecipe(sourceID);
			if (recipe && (this.data.sourceID || recipe.source.count <= sourceSlot.count) && this.checkResult(recipe.result)) {
				if (this.controlAir()) {
					this.container.sendEvent("setAirImage", {show: false});
					this.data.progress += receivedHeat;
					this.data.maxProgress = recipe.heatCost;
					this.setActive(true);

					if (!this.data.sourceID) {
						this.data.sourceID = sourceID;
						this.isHeating = true;
						this.decreaseSlot(sourceSlot, recipe.source.count);
					}

					if (this.data.progress >= recipe.heatCost) {
						this.putResult(recipe.result);
						this.data.progress = 0;
						this.data.maxProgress = 0;
						this.data.sourceID = 0;
					}

					return receivedHeat;
				}
				this.container.sendEvent("setAirImage", {show: true});
			}
			this.setActive(false);
			return 0;
		}

		@ContainerEvent(Side.Client, "setAirImage")
		onSetAirImage(container: ItemContainer, window: any, content: any, data: {show: boolean}): void {
			if (content) {
				if (!data.show) {
					content.elements["indicatorAir"] = {type: "image", x: 344 + 128*GUI_SCALE_NEW, y: 53 + 20*GUI_SCALE_NEW, bitmap: "no_air_image", scale: GUI_SCALE_NEW};
				}
				else if (!content.elements["indicatorAir"]) {
					content.elements["indicatorAir"] = null;
				}
			}
		}

		@ContainerEvent(Side.Client, "setIndicator")
		onSetIndicator(container: ItemContainer, window: any, content: any, data: string): void {
			if (content) {
				content.elements["indicator"].bitmap = "indicator_" + data;
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.blastFurnace, new BlastFurnace());

	MachineRecipeRegistry.registerDictionary("blastFurnace", new MachineRecipe.BlastFurnaceRecipeDictionary());

	StorageInterface.createInterface(BlockID.blastFurnace, {
		slots: {
			"slotSource": {input: true, isValid: (item: ItemInstance, side: number, tileEntity: BlastFurnace) => {
				return !!tileEntity.getRecipe(item.id);
			}},
			"slotAir1": {input: true, isValid: (item: ItemInstance) => item.id == ItemID.cellAir},
			"slotAir2": {output: true},
			"slotResult1": {output: true},
			"slotResult2": {output: true}
		}
	});
}

