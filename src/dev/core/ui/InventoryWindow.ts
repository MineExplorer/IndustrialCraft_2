function InventoryWindow(header: string, uiDescriptor: {drawing?: UI.DrawingSet, elements: UI.ElementSet}) {
	const gui = new UI.StandartWindow({
		standard: {
			header: {text: {text: Translation.translate(header)}},
			inventory: {standard: true},
			background: {standard: true}
		},

		drawing: uiDescriptor.drawing || [],
		elements: uiDescriptor.elements
	});

	Callback.addCallback("LevelLoaded", function() {
		MachineRegistry.updateGuiHeader(gui, header);
	});

	return gui;
}