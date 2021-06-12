const cropHarvesterGuiElements: UI.ElementSet = {
	"energyScale": { type: "scale", x: 409, y: 167, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
	"slotEnergy": { type: "slot", x: 400, y: 230 },
	"slotUpgrade0": { type: "slot", x: 880, y: 110 },
	"slotUpgrade1": { type: "slot", x: 880, y: 170 },
	"slotUpgrade2": { type: "slot", x: 880, y: 230 }
};

for (let i = 0; i < 15; i++) {
	let x = i % 5;
	let y = Math.floor(i / 5) + 1;
	cropHarvesterGuiElements["outSlot" + i] = { type: "slot", x: 520 + x * 60, y: 50 + y * 60 };
};

const guiCropHarvester = MachineRegistry.createInventoryWindow("Crop Harvester", {
	drawing: [
		{ type: "bitmap", x: 409, y: 167, bitmap: "energy_small_background", scale: GUI_SCALE }
	],

	elements: cropHarvesterGuiElements
});