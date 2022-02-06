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
        super("terraWart", "terra_wart", "terra_wart", {saturation: "poor", canAlwaysEat: true});
        this.setRarity(EnumRarity.RARE);
    }

    onFoodEaten(item: ItemInstance, food: number, saturation: number, player: number) {
        RadiationAPI.addRadiation(player, -600);
		for (let i in negativePotions) {
			let potionID = negativePotions[i];
			Entity.clearEffect(player, potionID);
		}
    }
}

ItemRegistry.registerItem(new ItemTerraWart());