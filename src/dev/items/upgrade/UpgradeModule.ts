class UpgradeModule extends ItemCommon
implements IUpgrade, ItemBehavior {
	type: string;

	constructor(stringID: string, name: string, type: string) {
		super(stringID, `${name}_upgrade`, `upgrade_${name}`);
		this.type = type;
		UpgradeAPI.registerUpgrade(this.id, this);
	}

	onNameOverride(item: ItemInstance, name: string): string {
		switch (this.type) {
			case "overclocker": {
				let percent = "%%%%"; // it's one % in name
				if (currentUIscreen == "in_game_play_screen" || currentUIscreen == "world_loading_progress_screen - local_world_load") {
					percent += percent; // this game is broken
				}
				let timeTooltip = Translation.translate("tooltip.upgrade.overclocker.time") + 70 + percent;
				let powerTooltip = Translation.translate("tooltip.upgrade.overclocker.power") + 160 + percent;
				return name + "§7\n" + timeTooltip + "\n" + powerTooltip;
			}
			case "transformer": {
				return name + "§7\n" + Translation.translate("tooltip.upgrade.transformer");
			}
			case "energyStorage": {
				let capacity = this.getExtraEnergyStorage(item, null);
				return name + "§7\n" + Translation.translate("tooltip.upgrade.storage").replace("%s", ItemName.displayEnergy(capacity, false));
			}
			default:
				return name;
		}
	}

	getAugmentation(item: ItemInstance, machine: TileEntity): number {
		if (this.type == "overclocker") {
			return 1;
		}
		return 0;
	}

	getEnergyDemandMultiplier(item: ItemInstance, machine: TileEntity): number {
		if (this.type == "overclocker") {
			return 1.6;
		}
		return 0;
	}

	getProcessTimeMultiplier(item: ItemInstance, machine: TileEntity): number {
		if (this.type == "overclocker") {
			return 0.7;
		}
		return 0;
	}

	getExtraTier(item: ItemInstance, machine: TileEntityBase): number {
		if (this.type == "transformer") {
			return 1;
		}
		return 0;
	}

	getExtraEnergyStorage(item: ItemInstance, machine: TileEntityBase): number {
		if (this.type == "energyStorage") {
			return 10000;
		}
		return 0;
	}

	modifyRedstone(item: ItemInstance, machine: TileEntityBase): boolean {
		if (this.type == "redstone") {
			return true
		}
		return false;
	}
}