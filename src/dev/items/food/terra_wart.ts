const negativePotions = [
    PotionEffect.movementSlowdown,
    PotionEffect.digSlowdown,
    PotionEffect.confusion,
    PotionEffect.blindness,
    PotionEffect.hunger,
    PotionEffect.weakness,
    PotionEffect.poison,
    PotionEffect.wither
];

ItemRegistry.createItem("terraWart", {type: "food", name: "Terra Wart", icon: "terra_wart", food: 1, rarity: EnumRarity.RARE});

Callback.addCallback("FoodEaten", function(heal: number, satRatio: number, player: number) {
    if (Entity.getCarriedItem(player).id == ItemID.terraWart) {
		RadiationAPI.addRadiation(-600);
		for (var i in negativePotions) {
			var potionID = negativePotions[i];
			Entity.clearEffect(player, potionID);
		}
	}
});
