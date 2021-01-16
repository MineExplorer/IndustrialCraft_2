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

class ItemTerraWart
extends ItemFood {
    constructor() {
        super("terraWart", "Terra Wart", "terra_wart", 1);
        this.setRarity(EnumRarity.RARE);
    }

    onFoodEaten(item: ItemInstance, food: number, saturation: number, player: number) {
        RadiationAPI.addRadiation(-600);
		for (let i in negativePotions) {
			let potionID = negativePotions[i];
			Entity.clearEffect(player, potionID);
		}
    }
}

ItemRegistry.registerItem(new ItemTerraWart());