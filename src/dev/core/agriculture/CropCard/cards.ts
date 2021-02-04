/// <reference path="./CropCards/Basic/CropWeed.ts"/>
/// <reference path="./CropCards/Basic/CropVenomilia.ts"/>
/// <reference path="./CropCards/Basic/CropTerraWart.ts"/>
/// <reference path="./CropCards/Basic/CropRedWheat.ts"/>
/// <reference path="./CropCards/Basic/CropStickreed.ts"/>
/// <reference path="./CropCards/Basic/CropCoffee.ts"/>
/// <reference path="./CropCards/Basic/CropHops.ts"/>
/// <reference path="./CropCards/Basic/CropEatingplant.ts"/>
/// <reference path="./CropCards/Vanilla/CropWheat.ts"/>
/// <reference path="./CropCards/Vanilla/CropPumpkin.ts"/>
/// <reference path="./CropCards/Vanilla/CropCocoa.ts"/>
/// <reference path="./CropCards/Vanilla/CropPotato.ts"/>
/// <reference path="./CropCards/Vanilla/CropMelon.ts"/>
/// <reference path="./CropCards/Vanilla/CropReed.ts"/>
/// <reference path="./CropCards/Vanilla/CropReed.ts"/>
/// <reference path="./CropCards/Vanilla/CropCarrots.ts"/>
/// <reference path="./CropCards/Vanilla/CropBeetroots.ts"/>
/// <reference path="./CropCards/Vanilla/CropNetherWart.ts"/>
/// <reference path="./CropCards/Mushroom/CropRedMushroom.ts"/>
/// <reference path="./CropCards/Mushroom/CropBrownMushroom.ts"/>
/// <reference path="./CropCards/BaseCards/CropColorFlowerCard.ts"/>
/// <reference path="./CropCards/BaseCards/Metal/CropBaseMetalCommon.ts"/>
/// <reference path="./CropCards/BaseCards/Metal/CropBaseMetalUncommon.ts"/>
namespace Agriculture {
	// ? "let" because addons can override general crop(i think)
	// Basic
	export let cropWeed = new CropWeed();
	export let cropVenomilia = new CropVenomilia();
	export let cropStickreed = new CropStickreed();
	export let cropTerraWart = new CropTerraWart();
	export let cropRedWheat = new CropRedWheat();
	export let cropCoffee = new CropCoffee();
	export let cropHops = new CropHops();
	export let cropEatingplant = new CropEatingplant();
	// Vanilla
	export let cropWheat = new CropWheat();
	export let cropPotato = new CropPotato();
	export let cropPumpkin = new CropPumpkin();
	export let cropCarrots = new CropCarrots();
	export let cropBeetroots = new CropBeetroots();
	export let cropMelon = new CropMelon();
	export let cropReed = new CropReed();
	export let cropCocoa = new CropCocoa();
	export let cropNetherWart = new CropNetherWart();
	// Mushroom
	export let cropRedMushroom = new CropRedMushroom();
	export let cropBrownMushroom = new CropBrownMushroom();
	// Flowers
	export let flowerDandelion = new CropColorFlowerCard("dandelion", ["Yellow", "Flower"], 0, {
		id: 37,
		size: 4,
		growth: 1,
		gain: 1,
		resistance: 1,
		addToCreative: true
	});
	export let flowerRose = new CropColorFlowerCard("rose", ["Red", "Flower", "Rose"], 1, {
		id: 38,
		size: 4,
		growth: 1,
		gain: 1,
		resistance: 1,
		addToCreative: true
	});
	export let flowerBlackthorn = new CropColorFlowerCard("blackthorn", ["Black", "Flower", "Rose"], 0);
	export let flowerTulip = new CropColorFlowerCard("tulip", ["Purple", "Flower", "Tulip"], 5);
	export let flowerCyazint = new CropColorFlowerCard("cyazint", ["Blue", "Flower"], 6);
	// Metal common
	export let cropMetalFerru = new CropBaseMetalCommon("ferru",
		["Gray", "Leaves", "Metal"],
		[15, 42],
		{ id: ItemID.dustSmallIron, count: 1, data: 0 });
	export let cropMetalCyprium = new CropBaseMetalCommon("cyprium",
		["Orange", "Leaves", "Metal"],
		[BlockID.blockCopper, BlockID.oreCopper],
		{ id: ItemID.dustSmallCopper, count: 1, data: 0 });
	export let cropMetalStagnium = new CropBaseMetalCommon("stagnium",
		["Shiny", "Leaves", "Metal"],
		[BlockID.blockTin, BlockID.oreTin],
		{ id: ItemID.dustSmallTin, count: 1, data: 0 });
	export let cropMetalPlumbiscus = new CropBaseMetalCommon("plumbiscus",
		["Shiny", "Leaves", "Metal"],
		[BlockID.blockLead, BlockID.oreLead],
		{ id: ItemID.dustSmallLead, count: 1, data: 0 });
	export let cropMetalAurelia = new CropBaseMetalUncommon("aurelia",
		["Gold", "Leaves", "Metal"],
		[14, 41],
		{ id: 371, count: 1, data: 0 });
	export let cropMetalShining = new CropBaseMetalUncommon("shining",
		["Silver", "Leaves", "Metal"],
		[BlockID.blockSilver, BlockID.oreSilver],
		{ id: ItemID.dustSmallSilver, count: 1, data: 0 });
}