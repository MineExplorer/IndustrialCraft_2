namespace ItemName {
	type ItemTooltip = {text: string, params: (string | number)[]}
	const tooltips: KeyValueMap<ItemTooltip[]> = {};

	export function addTooltip(id: number, text: string, ...params: (string | number)[]): void {
		const tooltip: ItemTooltip = {text: text, params: params};
		if (!tooltips[id]) {
			tooltips[id] = [tooltip];
		} else {
			tooltips[id].push(tooltip);
		}
		Item.registerNameOverrideFunction(id, tooltipNameOverrideFunc);
	}

	export function addTierTooltip(blockID: string | number, tier: number): void {
		addTooltip(Block.getNumericId(blockID), "tooltip.power_tier", tier);
	}

	export function addProductionTooltip(blockID: string | number, unit: string, minValue: number, maxValue?: number): void {
		const outputText = maxValue ? `${minValue}-${maxValue} ${unit}/t` : `${minValue} ${unit}/t`;
		addTooltip(Block.getNumericId(blockID), "tooltip.power_production", outputText);
	}

	export function addConsumptionTooltip(blockID: string | number, unit: string, minValue: number, maxValue?: number): void {
		const consumptionText = maxValue ? `${minValue}-${maxValue} ${unit}/t` : `${minValue} ${unit}/t`;
		addTooltip(Block.getNumericId(blockID), "tooltip.power_consumption", consumptionText);
	}

	export function addStorageBlockTooltip(blockID: string | number, tier: number, capacity: string, output?: number): void {
		Item.registerNameOverrideFunction(Block.getNumericId(blockID), function(item: ItemInstance, name: string) {
			const color = ItemRegistry.getItemRarityColor(item.id);
			return color + name + "\n§7" + getBlockStorageText(item, tier, capacity, output);
		});
	}

	export function getTranslatedTextWithParams(key: string, ...params: (string | number)[]): string {
		let text = Translation.translate(key);
		for (let param of params) {
			text = text.replace("%s", param.toString());
		}
		return text;
	}

	export function getBlockStorageText(item: ItemInstance, tier: number, capacity: string, output?: number): string {
		const energy = item.extra?.getInt("energy") || 0;
		let tooltip = getPowerTierText(tier) + '\n';
		if (output) {
			tooltip += `${getTranslatedTextWithParams("tooltip.power_output", output)} EU/t\n`;
		}
		tooltip += `${displayEnergy(energy)}/${capacity} EU`;
		return tooltip;
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

	const tooltipNameOverrideFunc = function(item: ItemInstance, name: string) {
		const tooltip = tooltips[item.id]
			.map(tooltip => getTranslatedTextWithParams(tooltip.text, ...tooltip.params))
			.join("\n");
		return ItemRegistry.getItemRarityColor(item.id) + name + "\n§7" + tooltip;
	}
}
