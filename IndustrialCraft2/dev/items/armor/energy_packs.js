IDRegistry.genItemID("batpack");
IDRegistry.genItemID("advBatpack");
IDRegistry.genItemID("energypack");
IDRegistry.genItemID("lappack");

Item.createArmorItem("batpack", "Batpack", {name: "batpack"}, {type: "chestplate", armor: 3, durability: 27, texture: "armor/batpack_1.png", isTech: true});
Item.createArmorItem("advBatpack", "Advanced Batpack", {name: "advanced_batpack"}, {type: "chestplate", armor: 3, durability: 27, texture: "armor/advbatpack_1.png", isTech: true});
Item.createArmorItem("energypack", "Energy Pack", {name: "energy_pack"}, {type: "chestplate", armor: 3, durability: 27, texture: "armor/energypack_1.png", isTech: true});
Item.createArmorItem("lappack", "Lappack", {name: "lappack"}, {type: "chestplate", armor: 3, durability: 27, texture: "armor/lappack_1.png", isTech: true});
ItemName.setRarity(ItemID.lappack, 1);

ChargeItemRegistry.registerExtraItem(ItemID.batpack, "Eu",  60000, 100, 1, "storage", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.advBatpack, "Eu",  600000, 512, 2, "storage", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.energypack, "Eu", 2000000, 2048, 3, "storage", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.lappack, "Eu", 10000000, 8192, 4, "storage", true, true);

Item.registerNameOverrideFunction(ItemID.batpack, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.advBatpack, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.energypack, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.lappack, ItemName.showItemStorage);

Item.addCreativeGroup("batteryPack", Translation.translate("Battery Packs"), [
	ItemID.batpack,
	ItemID.advBatpack,
	ItemID.energypack,
	ItemID.lappack
]);

Recipes.addShaped({id: ItemID.batpack, count: 1, data: 27}, [
    "bcb",
    "bab",
    "b b"
], ['a', 5, -1, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitBasic, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.advBatpack, count: 1, data: 27}, [
    "bcb",
    "bab",
    "b b"
], ['a', ItemID.plateBronze, 0, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitBasic, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.energypack, count: 1, data: 27}, [
    "cbc",
    "aba",
    "b b"
], ['a', ItemID.storageCrystal, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.lappack, count: 1, data: 27}, [
    "e",
    "c",
    "a"
], ['e', ItemID.energypack, -1, 'a', ItemID.storageLapotronCrystal, -1, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);


function registerStoragePack(id, level, tranfer){
	Armor.registerFuncs(id, {
		hurt: function(){
			return false;
		},
		tick: function(slot){
			ENERGY_PACK_TICK(slot, level, tranfer);
			return false;
		}
	});
}

var ENERGY_PACK_TICK = function(slot, level, transfer){
	if(World.getThreadTime()%20==0){
		var item = Player.getCarriedItem();
		if(ChargeItemRegistry.isValidItem(item.id, "Eu", level, "tool")){
			var energyStored = ChargeItemRegistry.getEnergyStored(slot);
			var energyAdd = ChargeItemRegistry.addEnergyTo(item, "Eu", energyStored, transfer*20, level);
			if(energyAdd > 0){
				ChargeItemRegistry.setEnergyStored(slot, energyStored - energyAdd);
				Player.setCarriedItem(item.id, 1, item.data, item.extra);
				Player.setArmorSlot(1, slot.id, 1, slot.data, slot.extra);
			}
		}
	}
}

registerStoragePack("batpack", 1, 100);
registerStoragePack("advBatpack", 2, 512);
registerStoragePack("energypack", 3, 2048);
registerStoragePack("lappack", 4, 8192);
