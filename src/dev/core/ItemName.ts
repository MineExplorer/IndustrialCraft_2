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

	export function addTooltip(id: number, tooltip: string, ...params: any[]): void {
		if (params.length > 0) {
			tooltip = getTranslatedTextWithParams(tooltip, ...params);
		}
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
		addTooltip(Block.getNumericId(blockID), getTranslatedTextWithParams("tooltip.power_output", outputText));
	}

	export function addConsumptionTooltip(blockID: string | number, powerConsumption: number, maxVoltage: number): void {
		addTooltip(Block.getNumericId(blockID), getTranslatedTextWithParams("tooltip.power_consumption", powerConsumption, maxVoltage));
	}

	export function addStorageBlockTooltip(blockID: string | number, tier: number, capacity: string): void {
		Item.registerNameOverrideFunction(Block.getNumericId(blockID), function(item: ItemInstance, name: string) {
			const color = ItemRegistry.getItemRarityColor(item.id);
			return color + name + "\n§7" + getBlockStorageText(item, tier, capacity);
		});
	}

	export function getTranslatedTextWithParams(key: string, ...params: any[]): string {
		let text = Translation.translate(key);
		for (let param of params) {
			text = text.replace("%s", param.toString());
		}
		return text;
	}

	export function getBlockStorageText(item: ItemInstance, tier: number, capacity: string): string {
		const energy = item.extra ? item.extra.getInt("energy") : 0;
		return `${getPowerTierText(tier)}\n${displayEnergy(energy)}/${capacity} EU`;
	}

	export function getPowerTierText(tier: number): string {
		return getTranslatedTextWithParams("tooltip.power_tier", tier);
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
