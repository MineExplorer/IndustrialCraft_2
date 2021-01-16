namespace ItemName {
	export function addTooltip(id: number, tooltip: string): void {
		Item.registerNameOverrideFunction(id, function(item: ItemInstance, name: string) {
			return ItemRegistry.getRarityColor(item.id) + name + "\n§7" + tooltip;
		});
	}

	export function addTierTooltip(stringID: string, tier: number): void {
		addTooltip(Block.getNumericId(stringID), Translation.translate("Power Tier: ") + tier);
	}

	export function addStorageBlockTooltip(stringID: string, tier: number, capacity: string): void {
		Item.registerNameOverrideFunction(Block.getNumericId(stringID), function(item: ItemInstance, name: string) {
			return ItemRegistry.getRarityColor(item.id) + ItemName.showBlockStorage(item, name, tier, capacity);
		});
	}

	export function showBlockStorage(item: ItemInstance, name: string, tier: number, capacity: string): string {
		let tierText = "§7" + Translation.translate("Power Tier: ") + tier;

		let energy = 0;
		if (item.extra) {
			energy = item.extra.getInt("energy");
		}
		let energyText = displayEnergy(energy) + "/" + capacity + " EU";

		return name + "\n" + tierText + "\n" +energyText;
	}

	export function getItemStorageText(item: ItemInstance): string {
		let capacity = ChargeItemRegistry.getMaxCharge(item.id);
		let energy = ChargeItemRegistry.getEnergyStored(item);
		return "§7" + displayEnergy(energy) + "/" + displayEnergy(capacity) + " EU";
	}

	export function showItemStorage(item: ItemInstance, name: string): string {
		let color = ItemRegistry.getRarityColor(item.id);
		return color + name + '\n' + ItemName.getItemStorageText(item);
	}

	export function displayEnergy(energy: number) {
		if (!ConfigIC.debugMode) {
			if (energy >= 1e6) {
				return Math.floor(energy / 1e5) / 10 + "M";
			}
			if (energy >= 1000) {
				return Math.floor(energy / 100) / 10 + "K";
			}
		}
		return energy;
	}

	export function getSideName(side: number): string {
		let sideNames = {
			en: [
				"first valid",
				"bottom",
				"top",
				"north",
				"south",
				"east",
				"west"
			],
			ru: [
				"первой подходящей",
				"нижней",
				"верхней",
				"северной",
				"южной",
				"восточной",
				"западной"
			],
			zh: [
				"初次生效",
				"底部",
				"顶部",
				"北边",
				"南边",
				"东边",
				"西边"
			],
			es: [
				"Primera vez efectivo",
				"abajo",
				"arriba",
				"norte",
				"sur",
				"este",
				"oeste"
			],
			pt: [
				"Primeira vez eficaz",
				"o lado de baixo",
				"o lado de cima",
				"o norte",
				"o sul",
				"o leste",
				"o oeste"
			]
		}
		if (sideNames[ConfigIC.gameLanguage]) {
			return sideNames[ConfigIC.gameLanguage][side+1];
		} else {
			return sideNames["en"][side+1];
		}
	}
}
