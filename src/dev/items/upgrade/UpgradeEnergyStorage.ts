class UpgradeEnergyStorage extends UpgradeModule
implements ItemBehavior {
    type = "energyStorage";

    onNameOverride(item: ItemInstance, name: string): string {
        let capacity = this.getExtraEnergyStorage(item);
		return name + "§7\n" + ItemName.getTranslatedTextWithParams("tooltip.upgrade.storage", ItemName.displayEnergy(capacity, false));
    }

    getExtraEnergyStorage(item: ItemInstance): number {
        return 10000;
    }
}