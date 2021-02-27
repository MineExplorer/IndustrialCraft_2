namespace Machine {
	export class CropHarvester
		extends ElectricMachine {
		defaultValues = {
			energy: 0,
			tier: 1,
			energy_storage: 10000,
			scanX: -5,
			scanY: -1,
			scanZ: -5
		};

		upgrades = ["transformer", "energyStorage", "itemEjector"];

		getScreenByName() {
			return guiCropHarvester;
		}

		getTier(): number {
			return this.data.tier;
		}

		resetValues(): void {
			this.data.tier = this.defaultValues.tier;
			this.data.energy_storage = this.defaultValues.energy_storage;
		}

		setupContainer(): void {
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, count, data) => {
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				return UpgradeAPI.isValidUpgrade(id, this);
			});
		}

		tick(): void {
			this.resetValues();
			UpgradeAPI.executeUpgrades(this);
			StorageInterface.checkHoppers(this);

			if (this.data.energy > 100) this.scan();

			const energyStorage = this.getEnergyStorage();
			this.data.energy = Math.min(this.data.energy, energyStorage);
			this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());

			this.container.setScale("energyScale", this.data.energy / energyStorage);
			this.container.validateAll();
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
			let cropTile = this.region.getTileEntity(this.x + this.data.scanX, this.y + this.data.scanY, this.z + this.data.scanZ) as Agriculture.ICropTileEntity;

			if (cropTile && cropTile.crop && !this.isInventoryFull()) {
				let drops = null;
				let crop = cropTile.crop;
				if (cropTile.data.currentSize == crop.getOptimalHarvestSize(cropTile)) {
					drops = cropTile.performHarvest();
				} else if (cropTile.data.currentSize == cropTile.crop.getMaxSize()) {
					drops = cropTile.performHarvest();
				}
				if (drops && drops.length) {
					for (let i in drops) {
						let item = drops[i];
						this.putItem(item);
						this.data.energy -= 100;
						if (item.count > 0) {
							this.region.dropItem(this.x, this.y + 1, this.z, item.id, item.count, item.data);
						}
					}
				}
			}
		}

		putItem(item: ItemInstance): void {
			for (let i = 0; i < 15; i++) {
				let slot = this.container.getSlot("outSlot" + i);
				if (StorageInterface.addItemToSlot(item, slot) > 0) {
					slot.markDirty();
				}
			}
		}

		isInventoryFull(): boolean {
			for (let i = 0; i < 15; i++) {
				let slot = this.container.getSlot("outSlot" + i);
				let maxStack = Item.getMaxStack(slot.id);
				if (!slot.id || slot.count < maxStack) return false;
			}
			return true;
		}

		getEnergyStorage(): number {
			return this.data.energy_storage;
		}
	}
}