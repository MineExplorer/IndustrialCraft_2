IDRegistry.genItemID("tinCanEmpty");
Item.createItem("tinCanEmpty", "Tin Can", {name: "tin_can", meta: 0});

IDRegistry.genItemID("tinCanFull");
Item.createFoodItem("tinCanFull", "Filled Tin Can", {name: "tin_can", meta: 1},{food:1});

Item.registerNameOverrideFunction(ItemID.tinCanFull, function(item, name){
	if(item.data > 0){
		return name + "\n§7" + Translation.translate("This looks bad...");
	}
	return name;
});

var decreaseCount = 0;

Callback.addCallback("FoodEaten", function(heal, satRatio){
	var item = Player.getCarriedItem();
	if(item.id = ItemID.tinCanFull){
		var hunger = Player.getHunger();
		var count = Math.min(20 - hunger, item.count) - 1;
		Player.setHunger(hunger + count);
		if(item.data == 1 && Math.random() < 0.2*count){
			Entity.addEffect(player, MobEffect.hunger, 1, 600);
		}
		if(item.data == 2){
			Entity.addEffect(player, MobEffect.poison, 1, 80);
		}
		Player.addItemToInventory(ItemID.tinCanEmpty, count+1, 0);
		decreaseCount += count;
	}
});

Callback.addCallback("tick", function(){
	var item = Player.getCarriedItem();
	if(decreaseCount){
		Player.setCarriedItem(item.id, item.count - decreaseCount, 0);
		decreaseCount = 0;
	}
});