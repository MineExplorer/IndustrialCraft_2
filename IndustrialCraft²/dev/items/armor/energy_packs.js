IDRegistry.genItemID("batpack");
IDRegistry.genItemID("advBatpack");
IDRegistry.genItemID("energypack");
IDRegistry.genItemID("lappack");

Item.createArmorItem("batpack", "Batpack", {name: "batpack"}, {type: "chestplate", armor: 3, durability: 60000, texture: "armor/batpack_1.png", isTech: false});
Item.createArmorItem("advBatpack", "Advanced Batpack", {name: "advanced_batpack"}, {type: "chestplate", armor: 3, durability: 600000, texture: "armor/advbatpack_1.png", isTech: false});
Item.createArmorItem("energypack", "Energy Pack", {name: "energy_pack"}, {type: "chestplate", armor: 3, durability: 2000000, texture: "armor/energypack_1.png", isTech: false});
Item.createArmorItem("lappack", "Lappack", {name: "lappack"}, {type: "chestplate", armor: 3, durability: 10000000, texture: "armor/lappack_1.png", isTech: false});

ChargeItemRegistry.registerItem(ItemID.batpack, "Eu",  60000, 0, true);
ChargeItemRegistry.registerItem(ItemID.advBatpack, "Eu",  600000, 1, true);
ChargeItemRegistry.registerItem(ItemID.energypack, "Eu", 2000000, 2, true);
ChargeItemRegistry.registerItem(ItemID.lappack, "Eu", 10000000, 3, true);

Item.registerNameOverrideFunction(ItemID.batpack, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.advBatpack, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.energypack, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.lappack, ENERGY_ITEM_NAME);

Recipes.addShaped({id: ItemID.batpack, count: 1, data: Item.getMaxDamage(ItemID.batpack)}, [
    "bcb",
    "bab",
    "b b"
], ['a', 5, -1, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitBasic, 0], ChargeItemRegistry.transportEnergy);

Recipes.addShaped({id: ItemID.advBatpack, count: 1, data: Item.getMaxDamage(ItemID.advBatpack)}, [
    "bcb",
    "bab",
    "b b"
], ['a', ItemID.plateBronze, 0, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitBasic, 0], ChargeItemRegistry.transportEnergy);

Recipes.addShaped({id: ItemID.energypack, count: 1, data: Item.getMaxDamage(ItemID.energypack)}, [
    "cbc",
    "aba",
    "b b"
], ['a', ItemID.storageCrystal, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transportEnergy);

Recipes.addShaped({id: ItemID.lappack, count: 1, data: Item.getMaxDamage(ItemID.lappack)}, [
    "bcb",
    "bab",
    "b b"
], ['a', ItemID.energypack, -1, 'b', 22, 0, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transportEnergy);


function registerStoragePack(id, level, tranfer){
	Armor.registerFuncs(id, {
		hurt: function(){
			return false;
		},
		tick: function(slot, index, maxDamage){
			return ENERGY_PACK_TICK(slot, maxDamage, level, tranfer);
		}
	});
}

var ENERGY_PACK_TICK = function(slot, maxDamage, level, transfer){
	if(World.getThreadTime()%20==0){
	    var item = Player.getCarriedItem();
	    var energyAdd = ChargeItemRegistry.addEnergyTo(item, "Eu", item.data - 1, transfer*20, level);
	    if(energyAdd > 0){
	        slot.data += energyAdd;
	        Player.setCarriedItem(item.id, 1, item.data, item.extra);
	        return true;
		}
    }
    return false;
}

registerStoragePack("batpack", 0, 32);
registerStoragePack("advBatpack", 1, 256);
registerStoragePack("energypack", 2, 2048);
registerStoragePack("lappack", 3, 8192);