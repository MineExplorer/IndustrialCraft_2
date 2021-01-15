IDRegistry.genBlockID("advancedMiner");
Block.createBlock("advancedMiner", [
	{name: "Advanced Miner", texture: [["teleporter_top", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true}
], "machine");

TileRenderer.setStandardModelWithRotation(BlockID.advancedMiner, 2, [["teleporter_top", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.advancedMiner, 2, [["teleporter_top", 1], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 1], ["miner_side", 1]]);
MachineRegistry.setStoragePlaceFunction("advancedMiner");

ItemRegistry.setRarity(BlockID.advancedMiner, EnumRarity.RARE);
ItemName.addStorageBlockTooltip("advancedMiner", 3, "4M");

Block.registerDropFunction("advancedMiner", function(coords, blockID, blockData, level) {
	return [];
});

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.advancedMiner, count: 1, data: 0}, [
		"pmp",
		"e#a",
		"pmp"
	], ['#', BlockID.machineBlockAdvanced, 0, 'a', BlockID.teleporter, 0, 'e', BlockID.storageMFE, -1, 'm', BlockID.miner, -1, 'p', ItemID.plateAlloy, 0]);
});


const guiAdvancedMiner = InventoryWindow("Advanced Miner", {
	drawing: [
		{type: "bitmap", x: 400 + 2*GUI_SCALE, y: 50 + 49*GUI_SCALE, bitmap: "energy_small_background", scale: GUI_SCALE},
		{type: "bitmap", x: 400 + 28*GUI_SCALE, y: 50 + 21*GUI_SCALE, bitmap: "miner_mode", scale: GUI_SCALE},
		{type: "bitmap", x: 400, y: 50 + 98*GUI_SCALE, bitmap: "miner_info", scale: GUI_SCALE},
	],

	elements: {
		"energyScale": {type: "scale", x: 400 + 2*GUI_SCALE, y: 50 + 49*GUI_SCALE, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotScanner": {type: "slot", x: 400, y: 50 + 19*GUI_SCALE, bitmap: "slot_scanner"},
		"slotEnergy": {type: "slot", x: 400, y: 290},
		"slot1": {type: "slot", x: 400 + 28*GUI_SCALE, y: 50 + 37*GUI_SCALE},
		"slot2": {type: "slot", x: 400 + 47*GUI_SCALE, y: 50 + 37*GUI_SCALE},
		"slot3": {type: "slot", x: 400 + 66*GUI_SCALE, y: 50 + 37*GUI_SCALE},
		"slot4": {type: "slot", x: 400 + 85*GUI_SCALE, y: 50 + 37*GUI_SCALE},
		"slot5": {type: "slot", x: 400 + 104*GUI_SCALE, y: 50 + 37*GUI_SCALE},
		"slot6": {type: "slot", x: 400 + 28*GUI_SCALE, y: 50 + 56*GUI_SCALE},
		"slot7": {type: "slot", x: 400 + 47*GUI_SCALE, y: 50 + 56*GUI_SCALE},
		"slot8": {type: "slot", x: 400 + 66*GUI_SCALE, y: 50 + 56*GUI_SCALE},
		"slot9": {type: "slot", x: 400 + 85*GUI_SCALE, y: 50 + 56*GUI_SCALE},
		"slot10": {type: "slot", x: 400 + 104*GUI_SCALE, y: 50 + 56*GUI_SCALE},
		"slot11": {type: "slot", x: 400 + 28*GUI_SCALE, y: 290},
		"slot12": {type: "slot", x: 400 + 47*GUI_SCALE, y: 290},
		"slot13": {type: "slot", x: 400 + 66*GUI_SCALE, y: 290},
		"slot14": {type: "slot", x: 400 + 85*GUI_SCALE, y: 290},
		"slot15": {type: "slot", x: 400 + 104*GUI_SCALE, y: 290},
		"slotUpgrade1": {type: "slot", x: 871, y: 50 + 37*GUI_SCALE},
		"slotUpgrade2": {type: "slot", x: 871, y: 50 + 56*GUI_SCALE},
		"button_switch": {type: "button", x: 400 + 116*GUI_SCALE, y: 50 + 21*GUI_SCALE, bitmap: "miner_button_switch", scale: GUI_SCALE, clicker: {
			onClick: function(_, container: ItemContainer) {
				container.sendEvent("switchWhitelist", {});
			}
		}},
		"button_restart": {type: "button", x: 400 + 125*GUI_SCALE, y: 50 + 98*GUI_SCALE, bitmap: "miner_button_restart", scale: GUI_SCALE, clicker: {
			onClick: function(_, container: ItemContainer) {
				container.sendEvent("restart", {});
			}
		}},
		"button_silk": {type: "button", x: 400 + 126*GUI_SCALE, y: 50 + 41*GUI_SCALE, bitmap: "miner_button_silk_0", scale: GUI_SCALE, clicker: {
			onClick: function(_, container: ItemContainer) {
				container.sendEvent("switchSilktouch", {});
			}
		}},
		"textInfoMode": {type: "text", font: {size: 24, color: Color.GREEN}, x: 400 + 32*GUI_SCALE, y: 50+24*GUI_SCALE, width: 256, height: 42, text: Translation.translate("Mode: Blacklist")},
		"textInfoXYZ": {type: "text", font: {size: 24, color: Color.GREEN}, x: 400 + 4*GUI_SCALE, y: 50 + 101*GUI_SCALE, width: 100, height: 42, text: ""},
	}
});

namespace Machine {
	export class AdvancedMiner
	extends ElectricMachine {
		defaultValues = {
			tier: 3,
			energy: 0,
			x: 0,
			y: 0,
			z: 0,
			whitelist: false,
			silk_touch: false,
			isEnabled: true
		}

		upgrades = ["overclocker", "transformer"];

		getScreenByName() {
			return guiAdvancedMiner;
		}

		getTier(): number {
			return this.data.tier;
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

		isValidBlock(id: number, data: number): boolean {
			if (id > 0 && ToolAPI.getBlockMaterialName(id) != "unbreaking") {
				return true;
			}
			return false;
		}

		checkDrop(drop: ItemInstanceArray[]): boolean {
			if (drop.length == 0) return true;
			for (let i in drop) {
				for (let j = 0; j < 16; j++) {
					let slot = this.container.getSlot("slot"+j);
					if (slot.id == drop[i][0] && slot.data == drop[i][2]) {return !this.data.whitelist;}
				}
			}
			return this.data.whitelist;
		}

		harvestBlock(x: number, y: number, z: number, block: Tile): boolean {
			// @ts-ignore
			let drop = ToolLib.getBlockDrop(new Vector3(x, y, z), block.id, block.data, 100, {silk: this.data.silk_touch});
			if (this.checkDrop(drop)) return false;
			this.region.setBlock(x, y, z, 0, 0);
			let items = [];
			for (let i in drop) {
				items.push(new ItemStack(drop[i][0], drop[i][1], drop[i][2], drop[i][3]));
			}
			this.drop(items);
			this.data.energy -= 512;
			return true;
		}

		drop(items: ItemInstance[]): void {
			let containers = StorageInterface.getNearestContainers(this, this.blockSource);
			StorageInterface.putItems(items, containers);
			for (let i in items) {
				let item = items[i];
				if (item.count > 0) {
					this.region.dropItem(this.x + .5, this.y + 1, this.z + .5, item.id, item.count, item.data, item.extra);
				}
			}
		}

		getScanRadius(itemID: number): number {
			if (itemID == ItemID.scanner) return 16;
			if (itemID == ItemID.scannerAdvanced) return 32;
			return 0;
		}

		tick(): void {
			if (this.data.whitelist)
				this.container.setText("textInfoMode", Translation.translate("Mode: Whitelist"));
			else
				this.container.setText("textInfoMode", Translation.translate("Mode: Blacklist"));

			let max_scan_count = 5;
			max_scan_count *= UpgradeAPI.getCountOfUpgrade(ItemID.upgradeOverclocker, this.container);
			this.data.tier = this.defaultValues.tier;
			this.data.tier += UpgradeAPI.getCountOfUpgrade(ItemID.upgradeTransformer, this.container);

			let newActive = false;
			if (this.data.isEnabled && this.y + this.data.y >= 0 && this.data.energy >= 512) {
				let scanner = this.container.getSlot("slotScanner");
				let scanR = this.getScanRadius(scanner.id);
				let energyStored = ChargeItemRegistry.getEnergyStored(scanner);
				if (scanR > 0 && energyStored >= 64) {
					newActive = true;
					if (World.getThreadTime()%20 == 0) {
						if (this.data.y == 0) {
							this.data.x = -scanR;
							this.data.y = -1;
							this.data.z = -scanR;
						}
						for (let i = 0; i < max_scan_count; i++) {
							if (this.data.x > scanR) {
								this.data.x = -scanR;
								this.data.z++;
							}
							if (this.data.z > scanR) {
								this.data.z = -scanR;
								this.data.y--;
							}
							energyStored -= 64;
							let x = this.x + this.data.x, y = this.y + this.data.y, z = this.z + this.data.z;
							this.data.x++;
							let block = this.region.getBlock(x, y, z);
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

			if (this.data.y < 0)
				this.container.setText("textInfoXYZ", "X: "+ this.data.x + ", Y: "+ Math.min(this.data.y, -1) + ", Z: "+ this.data.z);
			else
				this.container.setText("textInfoXYZ", "");

			let tier = this.getTier();
			let energyStorage = this.getEnergyStorage();
			this.data.energy -= ChargeItemRegistry.addEnergyToSlot(this.container.getSlot("slotScanner"), "Eu", this.data.energy, tier);
			this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, tier);
			this.container.setScale("energyScale", this.data.energy / energyStorage);
			this.container.sendEvent("setSilktouchIcon", {mode: this.data.silk_touch});
			this.container.sendChanges();
		}

		destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
			let itemID = Entity.getCarriedItem(player).id;
			let level = ToolAPI.getToolLevelViaBlock(itemID, this.blockID)
			let drop = MachineRegistry.getMachineDrop(coords, this.blockID, level, BlockID.machineBlockAdvanced, this.data.energy);
			if (drop.length > 0) {
				this.region.dropItem(coords.x + .5, coords.y + .5, coords.z + .5, drop[0][0], drop[0][1], drop[0][2], drop[0][3]);
			}
		}

		onRedstoneUpdate(signal: number): void {
			this.data.isEnabled = (signal == 0);
		}

		getEnergyStorage(): number {
			return 4000000;
		}

		@ContainerEvent(Side.Server)
		switchWhitelist(): void {
			this.data.whitelist = !this.data.whitelist;
		}

		@ContainerEvent(Side.Server)
		switchSilktouch(): void {
			this.data.silk_touch = !this.data.silk_touch;
		}

		@ContainerEvent(Side.Server)
		restart(): void {
			this.data.x = this.data.y = this.data.z =  0;
		}

		@ContainerEvent(Side.Client)
		setSilktouchIcon(container: any, window: any, content: any, data: {mode: boolean}): void {
			if (content) {
				let iconIndex = data.mode? 1 : 0;
				content.elements.button_silk.bitmap = "miner_button_silk_" + iconIndex;
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.advancedMiner, new AdvancedMiner());
}
