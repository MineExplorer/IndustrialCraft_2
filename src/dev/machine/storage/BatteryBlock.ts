/// <reference path="../ElectricMachine.ts" />

namespace Machine {
	export class BatteryBlock
	extends ElectricMachine {
		hasVerticalRotation: boolean = true;

		private readonly tier: number;
		private readonly capacity: number;
		private readonly defaultDrop: number;
		private readonly guiScreen: UI.StandartWindow;

		constructor(tier: number, capacity: number, defaultDrop: number, guiScreen: UI.StandartWindow) {
			super();
			this.tier = tier;
			this.capacity = capacity;
			this.defaultDrop = defaultDrop;
			this.guiScreen = guiScreen;
		}

		getScreenByName(): UI.StandartWindow {
			return this.guiScreen;
		}

		getTier(): number {
			return this.tier;
		}

		setupContainer(): void {
			StorageInterface.setSlotValidatePolicy(this.container, "slot1", (name, id) => {
				return ChargeItemRegistry.isValidItem(id, "Eu", this.getTier());
			});
			StorageInterface.setSlotValidatePolicy(this.container, "slot2", (name, id) => {
				return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
			});
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (ICTool.isValidWrench(item)) {
				ICTool.rotateMachine(this, coords.side, item, player)
				return true;
			}
			return super.onItemUse(coords, item, player);
		}

		setFacing(side: number): boolean {
			if (super.setFacing(side)) {
				EnergyNetBuilder.rebuildTileNet(this);
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

		energyTick(type: string, src: any) {
			super.energyTick(type, src);
			var output = this.getMaxPacketSize();
			if (this.data.energy >= output) {
				this.data.energy += src.add(output) - output;
			}
		}

		getEnergyStorage(): number {
			return this.capacity;
		}

		isEnergySource(): boolean {
			return true;
		}

		canReceiveEnergy(side: number): boolean {
			return side != this.getFacing();
		}

		canExtractEnergy(side: number): boolean {
			return side == this.getFacing();
		}

		destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
			var itemID = Entity.getCarriedItem(player).id;
			var level = ToolAPI.getToolLevelViaBlock(itemID, this.blockID);
			var drop = MachineRegistry.getMachineDrop(coords, this.blockID, level, this.defaultDrop, this.data.energy);
			if (drop.length > 0) {
				this.region.dropItem(coords.x + .5, coords.y + .5, coords.z + .5, drop[0][0], drop[0][1], drop[0][2], drop[0][3]);
			}
		}
	}
}

function BatteryBlockWindow(header: string) {
	return InventoryWindow(header, {
		drawing: [
			{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE},
		],

		elements: {
			"energyScale": {type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
			"slot1": {type: "slot", x: 441, y: 75},
			"slot2": {type: "slot", x: 441, y: 212},
			"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
			"textInfo2": {type: "text", x: 642, y: 172, width: 350, height: 30, text: "40000"}
		}
	});
}

let BatteryBlockInterface = {
	slots: {
		"slot1": {input: true, output: true,
			isValid: function(item: ItemStack, side: number, tileEntity: Machine.BatteryBlock) {
				return side == 1 && ChargeItemRegistry.isValidItem(item.id, "Eu", tileEntity.getTier());
			},
			canOutput: function(item: ItemStack) {
				return ChargeItemRegistry.getEnergyStored(item) >= ChargeItemRegistry.getMaxCharge(item.id);
			}
		},
		"slot2": {input: true, output: true,
			isValid: function(item: ItemStack, side: number, tileEntity: Machine.BatteryBlock) {
				return side > 1 && ChargeItemRegistry.isValidStorage(item.id, "Eu", tileEntity.getTier());
			},
			canOutput: function(item: ItemStack) {
				return ChargeItemRegistry.getEnergyStored(item) <= 0;
			}
		}
	}
}