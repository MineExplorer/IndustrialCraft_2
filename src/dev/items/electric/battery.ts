/// <reference path="../ItemElectric.ts" />

class ItemBattery
extends ItemElectric {
	canProvideEnergy: boolean = true;

	constructor(stringID: string, name: string, maxCharge: number, transferLimit: number, tier: number) {
		super(stringID, name, maxCharge, transferLimit, tier, false);
		ChargeItemRegistry.addToCreative(this.id, 0);
		ChargeItemRegistry.addToCreative(this.id, maxCharge);
	}

	onIconOverride(item: ItemInstance) {
		return {name: this.icon.name, meta: Math.round((27 - item.data) / 26 * 4)};
	}
}

ItemRegistry.registerItem(new ItemBattery("storageBattery", "re_battery", 10000, 100, 1));
ItemRegistry.registerItem(new ItemBattery("storageAdvBattery", "adv_re_battery", 100000, 256, 2));
ItemRegistry.registerItem(new ItemBattery("storageCrystal", "energy_crystal", 1000000, 2048, 3));
ItemRegistry.registerItem(new ItemBattery("storageLapotronCrystal", "lapotron_crystal", 10000000, 8192, 4)).setRarity(EnumRarity.UNCOMMON);

Item.addCreativeGroup("batteryEU", Translation.translate("Batteries"), [
	ItemID.storageBattery,
	ItemID.storageAdvBattery,
	ItemID.storageCrystal,
	ItemID.storageLapotronCrystal
]);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: ItemID.storageBattery, count: 1, data: Item.getMaxDamage(ItemID.storageBattery)}, [
		" x ",
		"c#c",
		"c#c"
	], ['x', ItemID.cableTin1, 0, 'c', ItemID.casingTin, 0, '#', 331, 0]);

	Recipes.addShaped({id: ItemID.storageAdvBattery, count: 1, data: Item.getMaxDamage(ItemID.storageAdvBattery)}, [
		"xbx",
		"bab",
		"bcb"
	], ['x', ItemID.cableCopper1, 0, 'a', ItemID.dustSulfur, 0, 'b', ItemID.casingBronze, 0, 'c', ItemID.dustLead, 0]);

	Recipes.addShaped({id: ItemID.storageLapotronCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageLapotronCrystal)}, [
		"x#x",
		"xax",
		"x#x"
	], ['a', ItemID.storageCrystal, -1, 'x', ItemID.dustLapis, 0, '#', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);
});

