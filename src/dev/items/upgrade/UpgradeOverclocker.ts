class UpgradeOverclocker extends UpgradeModule
implements ItemBehavior {
    type = "overclocker";

    onNameOverride(item: ItemInstance, name: string): string {
        let percent = "%%"; // it's one % in name
        if (BlockEngine.getMainGameVersion() == 11) percent += "%%";
        if (ToolHUD.currentUIscreen == "in_game_play_screen" || ToolHUD.currentUIscreen == "world_loading_progress_screen - local_world_load") {
            percent += percent; // this game is broken
        }
        let energyDemandPercent = this.getEnergyDemandMultiplier(item) * 100  + percent;
        let powerPercent = this.getProcessTimeMultiplier(item) * 100 + percent;
        let timeTooltip = Translation.translate("tooltip.upgrade.overclocker.time") + energyDemandPercent;
        let powerTooltip = Translation.translate("tooltip.upgrade.overclocker.power") + powerPercent;
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