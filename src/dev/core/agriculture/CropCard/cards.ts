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
	CropCardManager.registerCropCard(new CropWeed());
	CropCardManager.registerCropCard(new CropVenomilia());
	CropCardManager.registerCropCard(new CropStickreed());
	CropCardManager.registerCropCard(new CropTerraWart());
	CropCardManager.registerCropCard(new CropRedWheat());
	CropCardManager.registerCropCard(new CropCoffee());
	CropCardManager.registerCropCard(new CropHops());
	CropCardManager.registerCropCard(new CropEatingplant());
	// Vanilla
	CropCardManager.registerCropCard(new CropWheat());
	CropCardManager.registerCropCard(new CropPotato());
	CropCardManager.registerCropCard(new CropPumpkin());
	CropCardManager.registerCropCard(new CropCarrots());
	CropCardManager.registerCropCard(new CropBeetroots());
	CropCardManager.registerCropCard(new CropMelon());
	CropCardManager.registerCropCard(new CropReed());
	CropCardManager.registerCropCard(new CropCocoa());
	CropCardManager.registerCropCard(new CropNetherWart());
	// Mushroom
	CropCardManager.registerCropCard(new CropRedMushroom());
	CropCardManager.registerCropCard(new CropBrownMushroom());
	// Flowers
	CropCardManager.registerCropCard(new CropColorFlowerCard("dandelion", ["Yellow", "Flower"], IDConverter.getStack("black_dye"), {
		id: 37,
		size: 4,
		growth: 1,
		gain: 1,
		resistance: 1,
		addToCreative: true
	}));
	CropCardManager.registerCropCard(new CropColorFlowerCard("rose", ["Red", "Flower", "Rose"], IDConverter.getStack("red_dye"), {
		id: 38,
		size: 4,
		growth: 1,
		gain: 1,
		resistance: 1,
		addToCreative: true
	}));
	CropCardManager.registerCropCard(new CropColorFlowerCard("blackthorn", ["Black", "Flower", "Rose"], IDConverter.getStack("black_dye")));
	CropCardManager.registerCropCard(new CropColorFlowerCard("tulip", ["Purple", "Flower", "Tulip"], IDConverter.getStack("purple_dye")));
	CropCardManager.registerCropCard(new CropColorFlowerCard("cyazint", ["Blue", "Flower"], IDConverter.getStack("cyan_dye")));
	// Metal common
	CropCardManager.registerCropCard(new CropBaseMetalCommon("ferru",
		["Gray", "Leaves", "Metal"],
		[15, 42],
		{ id: ItemID.dustSmallIron, count: 1, data: 0 }));
	CropCardManager.registerCropCard(new CropBaseMetalCommon("cyprium",
		["Orange", "Leaves", "Metal"],
		[BlockID.blockCopper, BlockID.oreCopper],
		{ id: ItemID.dustSmallCopper, count: 1, data: 0 }));
	CropCardManager.registerCropCard(new CropBaseMetalCommon("stagnium",
		["Shiny", "Leaves", "Metal"],
		[BlockID.blockTin, BlockID.oreTin],
		{ id: ItemID.dustSmallTin, count: 1, data: 0 }));
	CropCardManager.registerCropCard(new CropBaseMetalCommon("plumbiscus",
		["Shiny", "Leaves", "Metal"],
		[BlockID.blockLead, BlockID.oreLead],
		{ id: ItemID.dustSmallLead, count: 1, data: 0 }));
	CropCardManager.registerCropCard(new CropBaseMetalUncommon("aurelia",
		["Gold", "Leaves", "Metal"],
		[14, 41],
		{ id: 371, count: 1, data: 0 }));
	CropCardManager.registerCropCard(new CropBaseMetalUncommon("shining",
		["Silver", "Leaves", "Metal"],
		[BlockID.blockSilver, BlockID.oreSilver],
		{ id: ItemID.dustSmallSilver, count: 1, data: 0 }));
}