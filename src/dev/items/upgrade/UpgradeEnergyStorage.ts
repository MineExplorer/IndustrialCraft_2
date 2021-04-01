class UpgradeEnergyStorage extends UpgradeModule
implements ItemBehavior {
    type = "energyStorage";

    onNameOverride(item: ItemInstance, name: string): string {
        let capacity = this.getExtraEnergyStorage(item);
		return name + "§7\n" + Translation.translate("tooltip.upgrade.storage").replace("%s", ItemName.displayEnergy(capacity, false));
    }

    getExtraEnergyStorage(item: ItemInstance): number {
        return 10000;
    }
}