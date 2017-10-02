IDRegistry.genItemID("batpack");
IDRegistry.genItemID("lappack");
Item.createArmorItem("batpack", "Batpack", {name: "armor_batpack"}, {type: "chestplate", armor: 3, durability: 60000, texture: "armor/batpack_1.png", isTech: false});
Item.createArmorItem("lappack", "Lappack", {name: "armor_lappack"}, {type: "chestplate", armor: 3, durability: 300000, texture: "armor/lappack_1.png", isTech: false});
ChargeItemRegistry.registerItem(ItemID.batpack, 60000, 0);
ChargeItemRegistry.registerItem(ItemID.lappack, 300000, 1);

Recipes.addShaped({id: ItemID.batpack, count: 1, data: 60001}, [
    "bcb",
    "bab",
    "b b"
], ['a', ItemID.plateIron, 0, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitBasic, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.lappack, count: 1, data: 300001}, [
    "bcb",
    "bab",
    "b b"
], ['a', ItemID.batpack, -1, 'b', 22, 0, 'c', ItemID.circuitAdvanced, 0], RECIPE_FUNC_TRANSPORT_ENERGY);


var ENERGY_PACK_TICK = function(slot){
    var item = Player.getCarriedItem();
    var data = ChargeItemRegistry.getItemData(item.id);
    if(!data || !data.isTool || data.level > this.level || item.data <= 1){
        return false;
    }
    
    var energyAdd = Math.min(item.data - 1, Math.min(this.transfer, this.maxDamage - slot.data));
    Game.message(energyAdd);
    if(energyAdd > 0){
        slot.data += energyAdd;
        Player.setCarriedItem(item.id, 1, item.data - energyAdd);
        return true;
    }
}

Armor.registerFuncs("batpack", {maxDamage: 60001, level: 0, transfer: 32, tick: ENERGY_PACK_TICK});
Armor.registerFuncs("lappack", {maxDamage: 300001, level: 1, transfer: 128, tick: ENERGY_PACK_TICK});