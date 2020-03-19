IDRegistry.genItemID("nightvisionGoggles");
Item.createArmorItem("nightvisionGoggles", "Nightvision Goggles", {name: "nightvision"}, {type: "helmet", armor: 1, durability: 100000, texture: "armor/nightvision_1.png", isTech: true});
ChargeItemRegistry.registerItem(ItemID.nightvisionGoggles, "Eu", 100000, 256, 2, "armor", true);
Item.registerNameOverrideFunction(ItemID.nightvisionGoggles, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.nightvisionGoggles, count: 1, data: Item.getMaxDamage(ItemID.nightvisionGoggles)}, [
	"xbx",
	"aga",
	"rcr"
], ['a', BlockID.luminator, -1, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitAdvanced, 0, 'x', ItemID.heatExchangerAdv, 1, 'g', 20, 0,'r', ItemID.rubber, 0], ChargeItemRegistry.transferEnergy);

UIbuttons.setArmorButton(ItemID.nightvisionGoggles, "button_nightvision");

Armor.registerFuncs("nightvisionGoggles", {
	hurt: function(){
		return false;
	},
	tick: function(slot, index, maxDamage){
		var extra = slot.extra;
		var nightvision = extra? extra.getBoolean("nv") : false;
		if(nightvision && slot.data < maxDamage){
			var coords = Player.getPosition();
			var time = World.getWorldTime()%24000;
			if(World.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000){
				Entity.addEffect(Player.get(), MobEffect.blindness, 1, 25);
			}
			Entity.addEffect(Player.get(), MobEffect.nightVision, 1, 225);
			if(World.getThreadTime()%20==0){
				slot.data = Math.min(slot.data+20, maxDamage);
				return true;
			}
		}
		return false;
	}
});
