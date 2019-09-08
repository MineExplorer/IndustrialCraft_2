IDRegistry.genItemID("hazmatHelmet");
IDRegistry.genItemID("hazmatChestplate");
IDRegistry.genItemID("hazmatLeggings");
IDRegistry.genItemID("rubberBoots");

Item.createArmorItem("hazmatHelmet", "Scuba Helmet", {name: "hazmat_helmet"}, {type: "helmet", armor: 1, durability: 64, texture: "armor/hazmat_1.png"});
Item.createArmorItem("hazmatChestplate", "Hazmat Suit", {name: "hazmat_chestplate"}, {type: "chestplate", armor: 1, durability: 64, texture: "armor/hazmat_1.png"});
Item.createArmorItem("hazmatLeggings", "Hazmat Suit Leggings", {name: "hazmat_leggins"}, {type: "leggings", armor: 1, durability: 64, texture: "armor/hazmat_2.png"});
Item.createArmorItem("rubberBoots", "Rubber Boots", {name: "rubber_boots"}, {type: "boots", armor: 1, durability: 64, texture: "armor/rubber_1.png"});

Recipes.addShaped({id: ItemID.hazmatHelmet, count: 1, data: 0}, [
	" d ",
	"xax",
	"x#x"
], ['x', ItemID.rubber, 0, 'a', 20, -1, 'd', 351, 14, '#', 101, -1]);

Recipes.addShaped({id: ItemID.hazmatChestplate, count: 1, data: 0}, [
	"x x",
	"xdx",
	"xdx"
], ['x', ItemID.rubber, 0, 'd', 351, 14]);

Recipes.addShaped({id: ItemID.hazmatLeggings, count: 1, data: 0}, [
	"xdx",
	"x x",
	"x x"
], ['x', ItemID.rubber, 0, 'd', 351, 14]);

Recipes.addShaped({id: ItemID.rubberBoots, count: 1, data: 0}, [
	"x x",
	"x x",
	"xwx"
], ['x', ItemID.rubber, 0, 'w', 35, -1]);


var RUBBER_ARMOR_FUNC = {
	hurt: function(params, item, index, maxDamage){
		var type = params.type;
		if(type==2 || type==3 || type==11){
			item.data += params.damage;
			if(item.data >= maxDamage){
				item.id = item.count = 0;
			}
			return true;
		}
		if(type==9 && index==0){
			for(var i = 0; i < 36; i++){
				var slot = Player.getInventorySlot(i);
				if(slot.id==ItemID.cellAir){
					Game.prevent();
					Entity.addEffect(player, MobEffect.waterBreathing, 1, 2);
					Player.setInventorySlot(i, slot.count > 1 ? slot.id : 0, slot.count - 1, 0);
					Player.addItemToInventory(ItemID.cellEmpty, 1, 0);
					break;
				}
			}
		}
		if(type==5 && index==3){
			var Dp = Math.floor(params.damage/8);
			var Db = Math.floor(params.damage*7/16);
			if(Dp < 1){
				Game.prevent();
			}else{
				Entity.setHealth(player, Entity.getHealth(player) + params.damage - Dp);
			}
			item.data += Db;
			if(item.data >= maxDamage){
				item.id = item.count = 0;
			}
			return true;
		}
		return false;
	},
	tick: function(slot, index, maxDamage){
		if(index==0 && Player.getArmorSlot(1).id==ItemID.hazmatChestplate && Player.getArmorSlot(2).id==ItemID.hazmatLeggings && Player.getArmorSlot(3).id==ItemID.rubberBoots){
			if(RadiationAPI.playerRad <= 0){
				Entity.clearEffect(player, MobEffect.poison);
			}
			Entity.clearEffect(player, MobEffect.wither);
		}
		return false;
	}
};

Armor.registerFuncs("hazmatHelmet", RUBBER_ARMOR_FUNC);
Armor.registerFuncs("hazmatChestplate", RUBBER_ARMOR_FUNC);
Armor.registerFuncs("hazmatLeggings", RUBBER_ARMOR_FUNC);
Armor.registerFuncs("rubberBoots", RUBBER_ARMOR_FUNC);