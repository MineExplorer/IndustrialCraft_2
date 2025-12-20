BlockRegistry.createBlock("advancedMiner", [
	{name: "Advanced Miner", texture: [["teleporter_top", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.advancedMiner, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.advancedMiner, 2, [["teleporter_top", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.advancedMiner, 2, [["teleporter_top", 1], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 1], ["miner_side", 1]]);
MachineRegistry.setStoragePlaceFunction("advancedMiner");

ItemRegistry.setRarity(BlockID.advancedMiner, EnumRarity.RARE);
ItemName.addStorageBlockTooltip("advancedMiner", 3, "4M");

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.advancedMiner, count: 1, data: 0}, [
		"pmp",
		"e#a",
		"pmp"
	], ['#', BlockID.machineBlockAdvanced, 0, 'a', BlockID.teleporter, 0, 'e', BlockID.storageMFE, -1, 'm', BlockID.miner, -1, 'p', ItemID.plateAlloy, 0]);
});

const guiAdvancedMiner = MachineRegistry.createInventoryWindow("Advanced Miner", {
	drawing: [
		{type: "bitmap", x: 400 + 2*GUI_SCALE, y: 49*GUI_SCALE, bitmap: "energy_small_background", scale: GUI_SCALE},
		{type: "bitmap", x: 400 + 28*GUI_SCALE, y: 21*GUI_SCALE, bitmap: "miner_mode", scale: GUI_SCALE},
		{type: "bitmap", x: 400, y: 98*GUI_SCALE, bitmap: "miner_info", scale: GUI_SCALE},
	],

	elements: {
		"energyScale": {type: "scale", x: 400 + 2*GUI_SCALE, y: 49*GUI_SCALE, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotScanner": {type: "slot", x: 400, y: 19*GUI_SCALE, bitmap: "slot_scanner"},
		"slotEnergy": {type: "slot", x: 400, y: 75*GUI_SCALE},
		"slot1": {type: "slot", x: 400 + 28*GUI_SCALE, y: 37*GUI_SCALE},
		"slot2": {type: "slot", x: 400 + 47*GUI_SCALE, y: 37*GUI_SCALE},
		"slot3": {type: "slot", x: 400 + 66*GUI_SCALE, y: 37*GUI_SCALE},
		"slot4": {type: "slot", x: 400 + 85*GUI_SCALE, y: 37*GUI_SCALE},
		"slot5": {type: "slot", x: 400 + 104*GUI_SCALE, y: 37*GUI_SCALE},
		"slot6": {type: "slot", x: 400 + 28*GUI_SCALE, y: 56*GUI_SCALE},
		"slot7": {type: "slot", x: 400 + 47*GUI_SCALE, y: 56*GUI_SCALE},
		"slot8": {type: "slot", x: 400 + 66*GUI_SCALE, y: 56*GUI_SCALE},
		"slot9": {type: "slot", x: 400 + 85*GUI_SCALE, y: 56*GUI_SCALE},
		"slot10": {type: "slot", x: 400 + 104*GUI_SCALE, y: 56*GUI_SCALE},
		"slot11": {type: "slot", x: 400 + 28*GUI_SCALE, y: 75*GUI_SCALE},
		"slot12": {type: "slot", x: 400 + 47*GUI_SCALE, y: 75*GUI_SCALE},
		"slot13": {type: "slot", x: 400 + 66*GUI_SCALE, y: 75*GUI_SCALE},
		"slot14": {type: "slot", x: 400 + 85*GUI_SCALE, y: 75*GUI_SCALE},
		"slot15": {type: "slot", x: 400 + 104*GUI_SCALE, y: 75*GUI_SCALE},
		"slotUpgrade1": {type: "slot", x: 871, y: 37*GUI_SCALE},
		"slotUpgrade2": {type: "slot", x: 871, y: 56*GUI_SCALE},
		"button_switch": {type: "button", x: 400 + 116*GUI_SCALE, y: 21*GUI_SCALE, bitmap: "miner_button_switch", scale: GUI_SCALE, clicker: {
			onClick: function(_, container: ItemContainer) {
				container.sendEvent("switchWhitelist", {});
			}
		}},
		"button_restart": {type: "button", x: 400 + 125*GUI_SCALE, y: 98*GUI_SCALE, bitmap: "miner_button_restart", scale: GUI_SCALE, clicker: {
			onClick: function(_, container: ItemContainer) {
				container.sendEvent("restart", {});
			}
		}},
		"button_silk": {type: "button", x: 400 + 126*GUI_SCALE, y: 41*GUI_SCALE, bitmap: "miner_button_silk_0", scale: GUI_SCALE, clicker: {
			onClick: function(_, container: ItemContainer) {
				container.sendEvent("switchSilktouch", {});
			}
		}},
		"textInfoMode": {type: "text", font: {size: 24, color: Color.GREEN}, x: 400 + 32*GUI_SCALE, y: 24*GUI_SCALE, width: 256, height: 42, text: Translation.translate("Mode: Blacklist")},
		"textInfoXYZ": {type: "text", font: {size: 24, color: Color.GREEN}, x: 400 + 4*GUI_SCALE, y: 101*GUI_SCALE, width: 100, height: 42, text: ""},
	}
});

namespace Machine {
	export class AdvancedMiner extends ElectricMachine {
		defaultValues = {
			energy: 0,
			x: 0,
			y: 0,
			z: 0,
			whitelist: false,
			silk_touch: false,
			isEnabled: true
		}

		defaultTier = 3;
		defaultDrop = BlockID.machineBlockAdvanced;
		upgrades = ["overclocker", "transformer"];

		tier: number = this.defaultTier;
		maxScanCount: number;

		getScreenByName(): UI.IWindow {
			return guiAdvancedMiner;
		}

		getTier(): number {
			return this.tier;
		}

		getEnergyStorage(): number {
			return 4000000;
		}

		setupContainer(): void {
			StorageInterface.setSlotValidatePolicy(this.container, "slotScanner", (name, id) => {
				return id == ItemID.scanner || id == ItemID.scannerAdvanced;
			});
			StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", (name, id) => {
				return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
			});
			StorageInterface.setSlotValidatePolicy(this.container, "slotUpgrade1", (name, id) => UpgradeAPI.isValidUpgrade(id, this));
			StorageInterface.setSlotValidatePolicy(this.container, "slotUpgrade2", (name, id) => UpgradeAPI.isValidUpgrade(id, this));
		}

		onInit(): void {
			super.onInit();
			this.setUpgradeStats();
		}

		getScanRadius(itemID: number): number {
			if (itemID == ItemID.scanner) return 16;
			if (itemID == ItemID.scannerAdvanced) return 32;
			return 0;
		}

		setUpgradeStats(): void {
			const upgrades = UpgradeAPI.useUpgrades(this);
			this.tier = upgrades.getTier(this.defaultTier);
			this.maxScanCount = 5 * upgrades.speedModifier;
		}

		onTick(): void {
			this.setUpgradeStats();
			this.operate();
			this.chargeSlot("slotScanner");
			this.dischargeSlot("slotEnergy");
			this.updateUi();
		}

		updateUi(): void {
			if (this.data.whitelist) {
				this.container.setText("textInfoMode", Translation.translate("Mode: Whitelist"));
			} else {
				this.container.setText("textInfoMode", Translation.translate("Mode: Blacklist"));
			}
			if (this.data.y < 0) {
				this.container.setText("textInfoXYZ", `X: ${this.data.x}, Y: ${this.data.y}, Z: ${this.data.z}`);
			} else {
				this.container.setText("textInfoXYZ", "");
			}

			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.sendEvent("setSilktouchIcon", {mode: this.data.silk_touch});
			this.container.sendChanges();
		}

		operate(): void {
			let newActive = false;
			const data = this.data;
			if (data.isEnabled && this.y + data.y >= 0 && data.energy >= 512) {
				const scanner = this.container.getSlot("slotScanner");
				const scanR = this.getScanRadius(scanner.id);
				let energyStored = ChargeItemRegistry.getEnergyStored(scanner);
				if (scanR > 0 && energyStored >= 64) {
					newActive = true;
					if (World.getThreadTime()%20 == 0) {
						if (data.y == 0) {
							data.x = -1 - scanR;
							data.y = -1;
							data.z = -scanR;
						}
						for (let i = 0; i < this.maxScanCount; i++) {
							data.x++;
							if (data.x > scanR) {
								data.x = -scanR;
								data.z++;
							}
							if (data.z > scanR) {
								data.z = -scanR;
								data.y--;
							}
							energyStored -= 64;
							const x = this.x + data.x;
							const y = this.y + data.y;
							const z = this.z + data.z;
							const block = this.region.getBlock(x, y, z);
							if (this.isValidBlock(block.id, block.data)) {
								if (this.harvestBlock(x, y, z, block))
								break;
							}
							if (energyStored < 64) break;
						}
						ChargeItemRegistry.setEnergyStored(scanner, energyStored);
					}
				}
			}
			this.setActive(newActive);
		}

		isValidBlock(id: number, data: number): boolean {
			if (id > 0 && ToolAPI.getBlockMaterialName(id) != "unbreaking") {
				return true;
			}
			return false;
		}

		harvestBlock(x: number, y: number, z: number, block: Tile): boolean {
			const item = new ItemStack(VanillaItemID.diamond_pickaxe, 1, 0);
			if (this.data.silk_touch) {
				item.addEnchant(EEnchantment.SILK_TOUCH, 1);
			}
			const drop = BlockRegistry.getBlockDrop(x, y, z, block, 100, item, this.blockSource);
			if (this.checkDrop(drop)) return false;
			this.data.energy -= 512;
			const result = this.region.breakBlockForResult(x, y, z, -1, item);
			this.drop(result.items);
			return true;
		}

		checkDrop(drop: ItemInstanceArray[]): boolean {
			if (drop.length == 0) return true;
			for (let item of drop) {
				for (let i = 0; i < 16; i++) {
					const slot = this.container.getSlot("slot"+i);
					if (slot.id == item[0] && slot.data == item[2]) {
						return !this.data.whitelist;
					}
				}
			}
			return this.data.whitelist;
		}

		drop(items: ItemInstance[]): void {
			const containers = StorageInterface.getNearestContainers(this, this.blockSource);
			StorageInterface.putItems(items, containers);
			for (let item of items) {
				if (item.count > 0) {
					this.region.dropItem(this.x + .5, this.y + 1, this.z + .5, item);
				}
			}
		}

		getDemontaged(): ItemInstance {
			const item = new ItemStack(this.blockID, 1, 0);
			if (this.data.energy > 0) {
				item.extra = new ItemExtraData().putInt("energy", this.data.energy);
			}
			return item;
		}

		onRedstoneUpdate(signal: number): void {
			this.data.isEnabled = (signal == 0);
		}

		canRotate(side: number): boolean {
			return side > 1;
		}

		/** @deprecated Container event, shouldn't be called */
		@ContainerEvent(Side.Server)
		switchWhitelist(): void {
			this.data.whitelist = !this.data.whitelist;
		}

		/** @deprecated Container event, shouldn't be called */
		@ContainerEvent(Side.Server)
		switchSilktouch(): void {
			this.data.silk_touch = !this.data.silk_touch;
		}

		/** @deprecated Container event, shouldn't be called */
		@ContainerEvent(Side.Server)
		restart(): void {
			this.data.x = this.data.y = this.data.z = 0;
		}

		/** @deprecated Container event, shouldn't be called */
		@ContainerEvent(Side.Client)
		setSilktouchIcon(container: ItemContainer, window: any, content: any, data: {mode: boolean}): void {
			if (content) {
				const iconIndex = data.mode? 1 : 0;
				content.elements.button_silk.bitmap = "miner_button_silk_" + iconIndex;
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.advancedMiner, new AdvancedMiner());
}
