/// <reference path="./CropCards/Basic/CropWeed.ts"/>
/// <reference path="./CropCards/Vanilla/CropWheat.ts"/>
/// <reference path="./CropCards/Vanilla/CropPumpkin.ts"/>
/// <reference path="./CropCards/Vanilla/CropMelon.ts"/>
namespace Agriculture {
	// ? "let" because addons can override general crop(i think)
	// Basic
	export let cropWeed = new CropWeed();
	// Vanilla
	export let cropWheat = new CropWheat();
	export let cropPumpkin = new CropPumpkin();
	export let cropMelon = new CropMelon();
}