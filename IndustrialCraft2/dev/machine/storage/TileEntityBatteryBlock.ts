/// <reference path="../TileEntityElectricMachine.ts" />

class TileEntityBatteryBlock extends TileEntityElectricMachine {
	private readonly capacity: number;
	private readonly defaultDrop: number;
	private readonly guiScreen: UI.StandartWindow;

	constructor(tier: number, capacity: number, defaultDrop: number, guiScreen: UI.StandartWindow) {
		super(tier);
		this.capacity = capacity;
		this.defaultDrop = defaultDrop;
		this.guiScreen = guiScreen;
	}

	getScreenByName(screenName: string): UI.StandartWindow {
		return screenName == "main" ? this.guiScreen : null;
	}

	isValidInputItem(slotName: string, id: number, amount: number) {
		var tier = this.getTier();
		if (slotName == "slot1" && ChargeItemRegistry.isValidItem(id, "Eu", tier)) {
			return amount;
		}
		if (slotName == "slot2" && ChargeItemRegistry.isValidStorage(id, "Eu", tier)) {
			return amount;
		}
		return 0;
	}

	init(): void {
		if (this.data.meta != undefined) {
			this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, this.data.meta + 2);
			delete this.data.meta;
		}

		this.container.setGlobalAddTransferPolicy((container, name, id, amount, data, extra, playerUid) => this.isValidInputItem(name, id, amount));
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
		if (ICTool.isValidWrench(item, 1)) {
			if (this.onWrenchUse(coords, item, player))
				ICTool.useWrench(coords, item, 1);
			return true;
		}
		return false;
	}

	onWrenchUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
		let newFacing = coords.side;
		if (Entity.getSneaking(player)) {
			newFacing ^= 1;
		}
		if (this.setFacing(newFacing)) {
			EnergyNetBuilder.rebuildTileNet(this);
			return true;
		}
		return false;
	}

	getFacing(): number {
		return this.blockSource.getBlockData(this.x, this.y, this.z);
	}

	setFacing(side: number): boolean {
		if (this.getFacing() != side) {
			this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, side);
			return true;
		}
		return false;
	}

	tick(): void {
		StorageInterface.checkHoppers(this);

		var tier = this.getTier();
		var energyStorage = this.getEnergyStorage();
		this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot("slot2"), "Eu", energyStorage - this.data.energy, tier);
		this.data.energy -= ChargeItemRegistry.addEnergyToSlot(this.container.getSlot("slot1"), "Eu", this.data.energy, tier);

		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage);
		this.container.sendChanges();
	}

	getEnergyStorage(): number {
		return this.capacity;
	}

	canReceiveEnergy(side: number): boolean {
		return side != this.data.meta;
	}

	canExtractEnergy(side: number): boolean {
		return side == this.data.meta;
	}

	destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
		var itemID = Entity.getCarriedItem(player).id;
		var level = ToolAPI.getToolLevelViaBlock(itemID, this.blockID)
		var drop = MachineRegistry.getMachineDrop(coords, this.blockID, level, this.defaultDrop, this.data.energy);
		if (drop.length > 0) {
			this.blockSource.spawnDroppedItem(coords.x + .5, coords.y + .5, coords.z + .5, drop[0][0], drop[0][1], drop[0][2]);
		}
	}
}

let BatteryBlockInterface = {
	slots: {
		"slot1": {input: true, output: true,
			isValid: function(item: ItemStack, side: number, tileEntity: TileEntityBatteryBlock) {
				return side == 1 && ChargeItemRegistry.isValidItem(item.id, "Eu", tileEntity.getTier());
			},
			canOutput: function(item: ItemStack) {
				return ChargeItemRegistry.getEnergyStored(item) >= ChargeItemRegistry.getMaxCharge(item.id);
			}
		},
		"slot2": {input: true, output: true,
			isValid: function(item: ItemStack, side: number, tileEntity: TileEntityBatteryBlock) {
				return side > 1 && ChargeItemRegistry.isValidStorage(item.id, "Eu", tileEntity.getTier());
			},
			canOutput: function(item: ItemStack) {
				return ChargeItemRegistry.getEnergyStored(item) <= 0;
			}
		}
	}
}