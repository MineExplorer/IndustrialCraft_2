namespace ItemName {
	export function setRarity(id: number, rarity: number): void {
		ItemRegistry.setRarity(id, rarity);
	}

	export function getRarity(id: number): number {
		return ItemRegistry.getRarity(id);
	}

	export function addTooltip(id: number, tooltip: string): void {
		Item.registerNameOverrideFunction(id, function(item: ItemInstance, name: string) {
			return ItemRegistry.getItemRarityColor(item.id) + name + "\n§7" + tooltip;
		});
	}

	export function addTierTooltip(stringID: string, tier: number): void {
		addTooltip(Block.getNumericId(stringID), Translation.translate("tooltip.power_tier").replace("%s", tier.toString()));
	}

	export function addStorageBlockTooltip(stringID: string, tier: number, capacity: string): void {
		Item.registerNameOverrideFunction(Block.getNumericId(stringID), function(item: ItemInstance, name: string) {
			return ItemRegistry.getItemRarityColor(item.id) + ItemName.showBlockStorage(item, name, tier, capacity);
		});
	}

	export function showBlockStorage(item: ItemInstance, name: string, tier: number, capacity: string): string {
		const tierText = "§7" + Translation.translate("tooltip.power_tier").replace("%s", tier.toString());
		let energy = 0;
		if (item.extra) {
			energy = item.extra.getInt("energy");
		}
		const energyText = displayEnergy(energy) + "/" + capacity + " EU";
		return name + "\n" + tierText + "\n" +energyText;
	}

	export function getItemStorageText(item: ItemInstance): string {
		const capacity = ChargeItemRegistry.getMaxCharge(item.id);
		const energy = ChargeItemRegistry.getEnergyStored(item);
		return "§7" + displayEnergy(energy) + "/" + displayEnergy(capacity) + " EU";
	}

	export function showItemStorage(item: ItemInstance, name: string): string {
		const color = ItemRegistry.getItemRarityColor(item.id);
		return color + name + '\n' + ItemName.getItemStorageText(item);
	}

	export function displayEnergy(energy: number, debug: boolean = Game.isDeveloperMode): string {
		if (!debug) {
			if (energy >= 1e6) {
				return Math.floor(energy / 1e5) / 10 + "M";
			}
			if (energy >= 1000) {
				return Math.floor(energy / 100) / 10 + "K";
			}
		}
		return energy.toString();
	}
}
