IDRegistry.genItemID("nightvisionGoggles");
Item.createArmorItem("nightvisionGoggles", "Nightvision Goggles", {name: "nightvision"}, {type: "helmet", armor: 1, durability: 100000, texture: "armor/nightvision_1.png", isTech: false});
ChargeItemRegistry.registerItem(ItemID.nightvisionGoggles, "Eu", 100000, 1);
Item.registerNameOverrideFunction(ItemID.nightvisionGoggles, ENERGY_ITEM_NAME);

Recipes.addShaped({id: ItemID.nightvisionGoggles, count: 1, data: Item.getMaxDamage(ItemID.nightvisionGoggles)}, [
	"ibi",
	"aga",
	"rcr"
], ['a', BlockID.luminator, -1, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitAdvanced, 0, 'g', 20, 0, 'i', ItemID.casingIron, 0, 'r', ItemID.rubber, 0], ChargeItemRegistry.transportEnergy);

UIbuttons.setButton(ItemID.nightvisionGoggles, "button_nightvision");

Armor.registerFuncs("nightvisionGoggles", {
	hurt: function(){
		return false;
	},
	tick: function(slot, index, maxDamage){
		var extra = slot.extra;
		if(extra){
			var nightvision = extra.getBoolean("nv");
		}
		if(nightvision && slot.data < maxDamage){
			var coords = Player.getPosition();
			var time = World.getWorldTime()%24000;
			if(World.getLightLevel(coords.x, coords.y, coords.z) > 13 && time >= 0 && time <= 12000){
				Entity.addEffect(player, MobEffect.blindness, 1, 25);
			}
			Entity.addEffect(player, MobEffect.nightVision, 1, 225);
			if(World.getThreadTime()%20==0){
				slot.data = Math.min(slot.data+20, maxDamage);
				return true;
			}
		}
		return false;
	}
});
