IDRegistry.genItemID("tinCanEmpty");
Item.createItem("tinCanEmpty", "Tin Can", {name: "tin_can", meta: 0});

IDRegistry.genItemID("tinCanFull");
Item.createItem("tinCanFull", "Filled Tin Can", {name: "tin_can", meta: 1});

Item.registerNameOverrideFunction(ItemID.tinCanFull, function(item, name){
	if(item.data > 0){
		return name + "\n§7" + Translation.translate("This looks bad...");
	}
	return name;
});

Item.registerNoTargetUseFunction("tinCanFull", function(){
	var item = Player.getCarriedItem();
	var hunger = Player.getHunger();
	var saturation = Player.getSaturation();
	var count = Math.min(20 - hunger, item.count);
	Player.setHunger(hunger + count);
	Player.setSaturation(Math.min(20, saturation + count*0.6));
	if(item.data == 1 && Math.random() < 0.2*count){
		Entity.addEffect(player, MobEffect.hunger, 1, 600);
	}
	if(item.data == 2){
		Entity.addEffect(player, MobEffect.poison, 1, 80);
	}
	if(item.count == count){
		Player.setCarriedItem(ItemID.tinCanEmpty, count, 0);
	}else{
		Player.setCarriedItem(item.id, item.count - count, item.data);
		Player.addItemToInventory(ItemID.tinCanEmpty, count, 0);
	}
});
