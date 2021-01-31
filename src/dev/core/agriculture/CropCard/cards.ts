/// <reference path="./CropCards/Basic/CropWeed.ts"/>
/// <reference path="./CropCards/Vanilla/CropWheat.ts"/>
/// <reference path="./CropCards/Vanilla/CropPumpkin.ts"/>
/// <reference path="./CropCards/Vanilla/CropMelon.ts"/>
/// <reference path="./CropCards/BaseCards/CropColorFlowerCard.ts"/>
namespace Agriculture {
	// ? "let" because addons can override general crop(i think)
	// Basic
	export let cropWeed = new CropWeed();
	// Vanilla
	export let cropWheat = new CropWheat();
	export let cropPumpkin = new CropPumpkin();
	export let cropMelon = new CropMelon();
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
}