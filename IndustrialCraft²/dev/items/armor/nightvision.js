IDRegistry.genItemID("nightvisionGoggles");
Item.createArmorItem("nightvisionGoggles", "Nightvision Goggles", {name: "nightvision"}, {type: "helmet", armor: 1, durability: 100000, texture: "armor/nightvision_1.png", isTech: false});
ChargeItemRegistry.registerItem(ItemID.nightvisionGoggles, 100000, 0, true);
Item.registerNameOverrideFunction(ItemID.nightvisionGoggles, ENERGY_ITEM_NAME);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.nightvisionGoggles, count: 1, data: Item.getMaxDamage(ItemID.nightvisionGoggles)}, [
		"ibi",
		"aca",
		"r r"
	], ['a', 102, 0, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitAdvanced, 0, "i", ItemID.casingIron, 0, "r", ItemID.rubber, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
});

UIbuttons.setButton(ItemID.nightvisionGoggles, "button_nightvision");

Armor.registerFuncs("nightvisionGoggles", {
	hurt: function(){
		return false;
	},
	tick: function(slot, index, maxDamage){
		if(UIbuttons.nightvision && slot.data < maxDamage){
			var coords = Player.getPosition();
			if(World.getLightLevel(coords.x, coords.y, coords.z)==15){
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
