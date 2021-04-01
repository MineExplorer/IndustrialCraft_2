class UpgradeTransformer extends UpgradeModule
implements ItemBehavior {
    type = "transformer";

    onNameOverride(item: ItemInstance, name: string): string {
        return name + "§7\n" + Translation.translate("tooltip.upgrade.transformer");
    }

    getExtraTier(item: ItemInstance): number {
        return 1;
    }
}