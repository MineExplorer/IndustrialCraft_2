namespace ItemName {
	const tooltips: {[key: number]: string[]} = {};

	/**@deprecated */
	export function setRarity(id: number, rarity: number): void {
		ItemRegistry.setRarity(id, rarity);
	}

	/**@deprecated */
	export function getRarity(id: number): number {
		return ItemRegistry.getRarity(id);
	}

	export function addTooltip(id: number, tooltip: string): void {
		if (!tooltips[id]) {
			tooltips[id] = [tooltip];
		} else {
			tooltips[id].push(tooltip);
		}
		Item.registerNameOverrideFunction(id, function(item: ItemInstance, name: string) {
			const tooltip = tooltips[item.id].join("\n");
			return ItemRegistry.getItemRarityColor(item.id) + name + "\n§7" + tooltip;
		});
	}

	/**@deprecated */
	export function addTierTooltip(blockID: string | number, tier: number): void {
		addTooltip(Block.getNumericId(blockID), getPowerTierText(tier));
	}

	export function addOutputTooltip(blockID: string | number, unit: string, minValue: number, maxValue?: number): void {
		const outputText = maxValue ? `${minValue}-${maxValue} ${unit}/t` : `${minValue} ${unit}/t`;
		addTooltip(Block.getNumericId(blockID), Translation.translate("tooltip.power_output").replace("%s", outputText));
	}

	export function addVoltageTooltip(blockID: string | number, maxVoltage: number): void {
		addTooltip(Block.getNumericId(blockID), Translation.translate("tooltip.max_voltage").replace("%s", maxVoltage.toString()));
	}

	export function addStorageBlockTooltip(blockID: string | number, tier: number, capacity: string): void {
		Item.registerNameOverrideFunction(Block.getNumericId(blockID), function(item: ItemInstance, name: string) {
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
