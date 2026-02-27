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
IMPORT("BlockEngine");
IMPORT("flags");
IMPORT("EnergyNet");
IMPORT("ChargeItem");
IMPORT("TileRender");
IMPORT("StorageInterface");
IMPORT("SoundLib");
IMPORT("BackpackAPI");

const startTime = Debug.sysTime();
ItemModel.setCurrentCacheGroup("industrial-craft", "2");

// constants
const GUI_SCALE = 3.2;
const GUI_SCALE_NEW = 3;
const fallVelocity = -0.0784;
const ELECTRIC_ITEM_MAX_DAMAGE = 27;

const INDEX_TO_COLOR = {
	0: "black",
	1: "red",
	2: "green",
	3: "brown",
	4: "blue",
	5: "purple",
	6: "cyan",
	7: "light_gray",
	8: "gray",
	9: "pink",
	10: "lime",
	11: "yellow",
	12: "light_blue",
	13: "magenta",
	14: "orange",
	15: "white"
}

// import values
const Color = android.graphics.Color;
const PotionEffect = Native.PotionEffect;
const ParticleType = Native.ParticleType;
const BlockSide = Native.BlockSide;
const EntityType = Native.EntityType;

// energy (Eu)
const EU = EnergyTypeRegistry.assureEnergyType("Eu", 1);

// vanilla items
Recipes.addFurnaceFuel(325, 10, 2000); // lava bucket
ChargeItemRegistry.registerFlashItem(331, "Eu", 800, 0); // redstone

type DataMap<T> = {
	[key: string]: T
}