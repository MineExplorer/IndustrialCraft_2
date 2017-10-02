IDRegistry.genItemID("jetpack");
Item.createArmorItem("jetpack", "Jetpack", {name: "armor_jetpack"}, {type: "chestplate", armor: 3, durability: 30000, texture: "armor/jetpack_1.png", isTech: false});
ChargeItemRegistry.registerItem(ItemID.jetpack, 30000, 0, true);

Recipes.addShaped({id: ItemID.jetpack, count: 1, data: Item.getMaxDamage(ItemID.jetpack)}, [
	"bcb",
	"bab",
	"d d"
], ['a', BlockID.storageBatBox, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0, "d", 348, 0]);

UIbuttons.setButton(ItemID.jetpack, "button_fly");

Armor.registerFuncs("jetpack", {
	maxDamage: Item.getMaxDamage(ItemID.jetpack),
	tick: function(slot, inventory){
		var vel = Player.getVelocity();
		if(vel.y < -0.226 && vel.y > -0.9){
			Entity.addEffect(player, MobEffect.jump, 255, 2);
		}
		return false;
	}
});
