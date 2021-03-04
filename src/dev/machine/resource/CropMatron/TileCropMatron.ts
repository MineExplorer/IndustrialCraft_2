namespace Machine {
	export class CropMatron extends ElectricMachine {
		defaultValues = {
			energy: 0,
			scanX: -5,
			scanY: -1,
			scanZ: -5
		}

		getScreenByName() {
			return guiCropMatron;
		}

		setupContainer(): void {
			this.liquidStorage.setLimit("water", 2);
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name == "slotWaterIn") return LiquidLib.getItemLiquid(id, data) == "water";
				if (name.startsWith("slotFertilizer")) return id == ItemID.fertilizer;
				if (name.startsWith("slotWeedEx")) return id == ItemID.weedEx;
				return false;
			});
		}

		getLiquidFromItem(liquid: string, inputItem: ItemInstance, outputItem: ItemInstance, byHand?: boolean): boolean {
			return MachineRegistry.getLiquidFromItem.call(this, liquid, inputItem, outputItem, byHand);
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (Entity.getSneaking(player)) {
				return this.getLiquidFromItem("water", item, new ItemStack(), true);
			}
			return super.onItemUse(coords, item, player);
		}

		tick(): void {
			StorageInterface.checkHoppers(this);

			let slot1 = this.container.getSlot("slotWaterIn");
			let slot2 = this.container.getSlot("slotWaterOut");
			this.getLiquidFromItem("water", slot1, slot2);

			if (this.data.energy >= 31) {
				this.scan();
				this.setActive(true);
			} else {
				this.setActive(false);
			}

			const energyStorage = this.getEnergyStorage();
			this.data.energy = Math.min(this.data.energy, energyStorage);
			this.dischargeSlot("slotEnergy");

			this.container.setScale("energyScale", this.data.energy / energyStorage);
			this.updateLiquidScale("liquidScale", "water");
			this.container.sendChanges();
		}

		scan(): void {
			this.data.scanX++;
			if (this.data.scanX > 5) {
				this.data.scanX = -5;
				this.data.scanZ++;
				if (this.data.scanZ > 5) {
					this.data.scanZ = -5;
					this.data.scanY++;
					if (this.data.scanY > 1) {
						this.data.scanY = -1;
					}
				}
			}
			this.data.energy -= 1;

			let tileentity = this.region.getTileEntity(this.x + this.data.scanX, this.y + this.data.scanY, this.z + this.data.scanZ);
			if (tileentity && tileentity.crop) {
				let slotFertilizer = this.getSlot("slotFertilizer");
				let weedExSlot = this.getSlot("slotWeedEx");
				if (slotFertilizer && tileentity.applyFertilizer(false)) {
					this.decreaseSlot(slotFertilizer, 1);
					this.data.energy -= 10;
				}
				let liquidAmount = this.liquidStorage.getAmount("water");
				if (liquidAmount > 0) {
					let amount = tileentity.applyHydration(liquidAmount);
					if (amount > 0) {
						this.liquidStorage.getLiquid("water", amount / 1000);
					}
				}
				var stack = new ItemStack(weedExSlot);
				if (weedExSlot.id && tileentity.applyWeedEx(weedExSlot, false)) {
					this.data.energy -= 10;
					if (++weedExSlot.data >= stack.getMaxDamage()) {
						weedExSlot.clear();
					}
					weedExSlot.markDirty();
				}
			}
		}

		getSlot(type: string): ItemContainerSlot {
			for (let i = 0; i < 7; i++) {
				let slot = this.container.getSlot(type + i);
				if (slot.id) return slot;
			}
			return null;
		}

		getEnergyStorage(): number {
			return 10000;
		}
	}
}