IDRegistry.genItemID("jetpack");
Item.createArmorItem("jetpack", "Jetpack", {name: "electric_jetpack"}, {type: "chestplate", armor: 3, durability: 30000, texture: "armor/jetpack_1.png"});
ChargeItemRegistry.registerItem(ItemID.jetpack, "Eu", 30000, 1);
Item.registerNameOverrideFunction(ItemID.jetpack, NameOverrides.showItemStorage);

Recipes.addShaped({id: ItemID.jetpack, count: 1, data: Item.getMaxDamage(ItemID.jetpack)}, [
	"bcb",
	"bab",
	"d d"
], ['a', BlockID.storageBatBox, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0, 'd', 348, 0]);

UIbuttons.setArmorButton(ItemID.jetpack, "button_fly");
UIbuttons.setArmorButton(ItemID.jetpack, "button_hover");

Armor.registerFuncs("jetpack", {
	hurt: function(params, item, index, maxDamage){
		if(params.type==5){
			var vel = Player.getVelocity().y;
			var time = vel / -0.06;
			var height = 0.06 * time*time / 2;
			if(height < 22){
				if(height < 17){
					var damage = Math.floor(height) - 3;
				}else{
					var damage = Math.ceil(height) - 3;
				}
			}
			//Game.message(height + ", "+damage+", "+params.damage)
			if(damage <= 0 && height < 22){
				Game.prevent();
			}
			else if(params.damage > damage){
				Entity.setHealth(player, Entity.getHealth(player) + params.damage - damage);
			}
		}
		return false;
	},
	tick: function(slot, index, maxDamage){
		var extra = slot.extra;
		if(extra){
			var hover = extra.getBoolean("hover");
		}
		if(hover && slot.data < maxDamage){
			var vel = Player.getVelocity();
			if(vel.y < -0.1){
				Player.setVelocity(vel.x, -0.1, vel.z);
				if(World.getThreadTime() % 5 == 0){
					Player.setArmorSlot(1, slot.id, 1, Math.min(slot.data+20, maxDamage), extra);
				}
			}
		}
		return false;
	},
});
