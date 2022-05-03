namespace ItemName {
	/**@deprecated */
	export function setRarity(id: number, rarity: number): void {
		ItemRegistry.setRarity(id, rarity);
	}

	/**@deprecated */
	export function getRarity(id: number): number {
		return ItemRegistry.getRarity(id);
	}

	export function addTooltip(id: number, tooltip: string): void {
		Item.registerNameOverrideFunction(id, function(item: ItemInstance, name: string) {
			return ItemRegistry.getItemRarityColor(item.id) + name + "\n§7" + tooltip;
		});
	}

	export function addTierTooltip(stringID: string, tier: number): void {
		addTooltip(Block.getNumericId(stringID), getPowerTierText(tier));
	}

	export function addStorageBlockTooltip(stringID: string, tier: number, capacity: string): void {
		Item.registerNameOverrideFunction(Block.getNumericId(stringID), function(item: ItemInstance, name: string) {
			const color = ItemRegistry.getItemRarityColor(item.id);
			return color + name + "\n§7" + getBlockStorageText(item, tier, capacity);
		});
	}

	export function getBlockStorageText(item: ItemInstance, tier: number, capacity: string): string {
		const energy = item.extra ? item.extra.getInt("energy") : 0;
		return `${getPowerTierText(tier)}\n${displayEnergy(energy)}/${capacity} EU`;
	}

	export function getPowerTierText(tier: number): string {
		return Translation.translate("tooltip.power_tier").replace("%s", tier.toString());
	}

	export function getItemStorageText(item: ItemInstance): string {
		const energy = ChargeItemRegistry.getEnergyStored(item);
		const capacity = ChargeItemRegistry.getMaxCharge(item.id);
		return `${displayEnergy(energy)}/${displayEnergy(capacity)} EU`;
	}

	export function displayEnergy(energy: number, debug: boolean = Game.isDeveloperMode): string {
		if (!debug) {
			if (energy >= 1e9) {
				return Math.floor(energy / 1e8) / 10 + "B";
			}
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
