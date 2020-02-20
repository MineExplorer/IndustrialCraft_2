var negativePotions = [
    MobEffect.movementSlowdown,
    MobEffect.digSlowdown,
    MobEffect.confusion,
    MobEffect.blindness,
    MobEffect.hunger,
    MobEffect.weakness,
    MobEffect.poison,
    MobEffect.wither
];

IDRegistry.genItemID("terraWart");
Item.createFoodItem("terraWart", "Terra Wart", {name: "terra_wart"}, {food: 1});
Item.registerNameOverrideFunction(ItemID.terraWart, RARE_ITEM_NAME);

Callback.addCallback("FoodEaten", function(heal, satRatio){
    if(Player.getCarriedItem().id == ItemID.terraWart){
		RadiationAPI.addRadiation(-600);
		for(var i in negativePotions){
			var potionID = negativePotions[i];
			Entity.clearEffect(Player.get(), potionID);
		}
	}
});