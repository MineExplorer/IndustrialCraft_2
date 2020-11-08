var negativePotions = [
    PotionEffect.movementSlowdown,
    PotionEffect.digSlowdown,
    PotionEffect.confusion,
    PotionEffect.blindness,
    PotionEffect.hunger,
    PotionEffect.weakness,
    PotionEffect.poison,
    PotionEffect.wither
];

IDRegistry.genItemID("terraWart");
Item.createFoodItem("terraWart", "Terra Wart", {name: "terra_wart"}, {food: 1});
ItemName.setRarity(ItemID.terraWart, 2, true);

Callback.addCallback("FoodEaten", function(heal, satRatio) {
    if (Player.getCarriedItem().id == ItemID.terraWart) {
		RadiationAPI.addRadiation(-600);
		for (var i in negativePotions) {
			var potionID = negativePotions[i];
			Entity.clearEffect(Player.get(), potionID);
		}
	}
});