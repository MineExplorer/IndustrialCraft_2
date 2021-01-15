/*
  ___               _                 _            _           _      ____                    __   _   
 ║_ _║  _ __     __║ ║  _   _   ___  ║ ║_   _ __  ║_║   __ _  ║ ║    / ___║  _ __    __ _   _/ _║ ║ ║_ 
  ║ ║  ║ '_ \   / _` ║ ║ ║ ║ ║ / __║ ║ __║ ║ '__║ ,─╗  / _` ║ ║ ║   ║ ║     ║ '__║  / _` ║ [  _]  ║ __║
  ║ ║  ║ ║ ║ ║ ║ (_║ ║ ║ ║_║ ║ \__ \ ║ ║_  ║ ║    ║ ║ ║ (_║ ║ ║ ║   ║ ║___  ║ ║    ║ (_║ ║  ║ ║   ║ ║_ 
 ║___║ ║_║ ║_║  \__,_║  \__,_║ |___/  \__║ ║_║    ║_║  \__,_║ ║_║    \____║ ║_║     \__,_║  ║_║    \__║
 
 by MineExplorer (vk.com/vlad.gr2027) and NikolaySavenko (vk.com/savenkons)
 based on Industrial Core by zheka_smirnov (vk.com/zheka_smirnov)

 This code is a copyright, do not distribute.
*/

// libraries
IMPORT("flags");
IMPORT("ToolLib");
IMPORT("BlockEngine");
IMPORT("EnergyNet");
IMPORT("ChargeItem");
IMPORT("TileRender");
IMPORT("StorageInterface");
IMPORT("LiquidLib");
IMPORT("SoundLib");
IMPORT("BackpackAPI");

// constants
const GUI_SCALE = 3.2;
const GUI_SCALE_NEW = 3;
const fallVelocity = -0.0784;
const ELECTRIC_ITEM_MAX_DAMAGE = 27;

// import values
const Color = android.graphics.Color;
const PotionEffect = Native.PotionEffect;
const ParticleType = Native.ParticleType;
const BlockSide = Native.BlockSide;
const EntityType = Native.EntityType;

// energy (Eu)
const EU = EnergyTypeRegistry.assureEnergyType("Eu", 1);

// API
function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addShapelessRecipe(result: ItemInstance, source: ItemInstance[]): void {
	let ingredients = [];
	for (let i in source) {
		let item = source[i];
		for (let n = 0; n < item.count; n++) {
			ingredients.push(item);
		}
	}
	Recipes.addShapeless(result, ingredients);
}

// vanilla items
Recipes.addFurnaceFuel(325, 10, 2000); // lava bucket
ChargeItemRegistry.registerFlashItem(331, "Eu", 800, 0); // redstone
