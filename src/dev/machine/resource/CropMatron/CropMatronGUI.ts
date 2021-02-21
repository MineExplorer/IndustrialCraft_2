const сropMatronGuiElements: UI.ElementSet = {
	"energyScale": { type: "scale", x: 870, y: 270, direction: 1, value: .5, bitmap: "energy_small_scale", scale: GUI_SCALE },
	"liquidScale": { type: "scale", x: 572, y: 256, direction: 1, bitmap: "water_storage_scale", scale: GUI_SCALE },
	"slotEnergy": { type: "slot", x: 804, y: 265 },
	"slotFertilizer0": { type: "slot", x: 441, y: 75, bitmap: "slot_dust" },
	"slotWeedEx0": { type: "slot", x: 441, y: 155, bitmap: "slot_weedEx" },
	"slotWaterIn": { type: "slot", x: 441, y: 235, bitmap: "slot_cell" },
	"slotWaterOut": { type: "slot", x: 441, y: 295 }
};

for (let i = 1; i < 7; i++) {
	сropMatronGuiElements["slotWeedEx" + i] = { type: "slot", x: 441 + 60 * i, y: 155 };
}
for (let i = 1; i < 7; i++) {
	сropMatronGuiElements["slotFertilizer" + i] = { type: "slot", x: 441 + 60 * i, y: 75 };
}

const guiCropMatron = InventoryWindow("Crop Matron", {
	drawing: [
		{ type: "bitmap", x: 870, y: 270, bitmap: "energy_small_background", scale: GUI_SCALE },
		{ type: "bitmap", x: 511, y: 243, bitmap: "water_storage_background", scale: GUI_SCALE }
	],

	elements: сropMatronGuiElements
});