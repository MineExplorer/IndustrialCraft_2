class UpgradeOverclocker extends UpgradeModule
implements ItemBehavior {
    type = "overclocker";

    onNameOverride(item: ItemInstance, name: string): string {
        let percent = "%%"; // it's one % in name
        if (BlockEngine.getMainGameVersion() == 11) percent += "%%";
        if (ToolHUD.currentUIscreen == "in_game_play_screen" || ToolHUD.currentUIscreen == "world_loading_progress_screen - local_world_load") {
            percent += percent; // this game is broken
        }
        const timePercent = this.getProcessTimeMultiplier(item) * 100 + percent;
        const energyDemandPercent = this.getEnergyDemandMultiplier(item) * 100  + percent;
        const timeTooltip = ItemName.getTranslatedTextWithParams("tooltip.upgrade.overclocker.time", timePercent);
        const powerTooltip = ItemName.getTranslatedTextWithParams("tooltip.upgrade.overclocker.power", energyDemandPercent);
        return name + "§7\n" + timeTooltip + "\n" + powerTooltip;
    }

    getSpeedModifier(item: ItemInstance): number {
		return 1;
	}

	getEnergyDemandMultiplier(item: ItemInstance): number {
		return 1.6;
	}

	getProcessTimeMultiplier(item: ItemInstance): number {
		return 0.7;
	}
}