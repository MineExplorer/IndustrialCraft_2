/// <reference path="EUMeterUpdatable.ts" />

class EUMeter extends ItemCommon
implements ItemBehavior {
	constructor() {
		super("EUMeter", "eu_meter", "eu_meter");
		this.setMaxStack(1);
		this.setCategory(ItemCategory.EQUIPMENT);
		ItemContainer.registerScreenFactory("eu_meter.ui", function (container, name) {
			const gui = EUMeter.gui;
			const elements = gui.getContent().elements as any;
			elements.arrow.bitmap = "eu_meter_arrow_0";
			elements.textMode2.text = Translation.translate("EnergyIn");
			return gui;
		});
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number) {
		const client = Network.getClientForPlayer(player);
		if (!client) return;

		const region = BlockSource.getDefaultForActor(player);
		const node = EnergyNet.getNodeOnCoords(region, coords.x, coords.y, coords.z);
		if (node) {
			const updatable = new EUMeterUpdatable(node);
			Updatable.addUpdatable(updatable);
			updatable.openGuiFor(client);
		}
	}

	static gui = new UI.Window({
		location: {
			x: 0,
			y: 0,
			width: 1000,
			height: 750
		},

		drawing: [
			{type: "background", color: 0},
			{type: "bitmap", x: 218, y: 30, bitmap: "eu_meter_background", scale: GUI_SCALE},
		],

		elements: {
			"arrow": {type: "image", x: 576, y: 206, bitmap: "eu_meter_arrow_0", scale: GUI_SCALE},
			"textName": {type: "text", font: {size: 32}, x: 378, y: 48, width: 256, height: 42, text: Translation.translate("eu_meter")},
			"textAvg": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 164, width: 256, height: 42, text: Translation.translate("Avg:")},
			"textAvgValue": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 194, width: 256, height: 42, text: "0 EU/t"},
			"textMaxMin": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 240, width: 256, height: 42, text: Translation.translate("Max/Min")},
			"textMaxValue": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 270, width: 256, height: 42, text: "0 EU/t"},
			"textMinValue": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 300, width: 256, height: 42, text: "0 EU/t"},
			"textMode1": {type: "text", font: {size: 22, color: Color.GREEN}, x: 554, y: 164, width: 100, height: 42, text: Translation.translate("Mode:")},
			"textMode2": {type: "text", font: {size: 22, color: Color.GREEN}, x: 554, y: 348, width: 256, height: 42, text: Translation.translate("EnergyIn")},
			"textTime": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 348, width: 256, height: 42, text: "Cycle: 0 sec"},
			"textReset": {type: "text", font: {size: 22, color: Color.GREEN}, x: 330, y: 392, width: 256, height: 42, text: Translation.translate("Reset")},
			"closeButton": {type: "button", x: 727, y: 40, bitmap: "close_button_small", scale: GUI_SCALE, clicker: {
				onClick: function(_, container: ItemContainer) {
					container.close();
				}
			}},
			"resetButton": {type: "button", x: 298, y: 385, bitmap: "eu_meter_reset_button", scale: GUI_SCALE, clicker: {
				onClick: function(_, container: ItemContainer) {
					container.sendEvent("reset", {});
				}
			}},
			"arrowButton0": {type: "button", x: 576, y: 206, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
				onClick: function(pos: Vector, container: ItemContainer) {
					container.sendEvent("setMode", {mode: 0});
					//@ts-ignore
					const elements = container.getWindow().getContent().elements;
					elements.arrow.bitmap = "eu_meter_arrow_0";
					elements.textMode2.text = Translation.translate("EnergyIn");
				}
			}},
			"arrowButton1": {type: "button", x: 640, y: 206, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
				onClick: function(pos: Vector, container: ItemContainer) {
					container.sendEvent("setMode", {mode: 1});
					//@ts-ignore
					const elements = container.getWindow().getContent().elements;
					elements.arrow.bitmap = "eu_meter_arrow_1";
					elements.textMode2.text = Translation.translate("EnergyOut");
				}
			}},
			"arrowButton2": {type: "button", x: 576, y: 270, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
				onClick: function(pos: Vector, container: ItemContainer) {
					container.sendEvent("setMode", {mode: 2});
					//@ts-ignore
					const elements = container.getWindow().getContent().elements;
					elements.arrow.bitmap = "eu_meter_arrow_2";
					elements.textMode2.text = Translation.translate("EnergyGain");
				}
			}},
			"arrowButton3": {type: "button", x: 640, y: 270, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
				onClick: function(pos: Vector, container: ItemContainer) {
					container.sendEvent("setMode", {mode: 3});
					//@ts-ignore
					const elements = container.getWindow().getContent().elements;
					elements.arrow.bitmap = "eu_meter_arrow_3";
					elements.textMode2.text = Translation.translate("Voltage");
				}
			}},
		}
	});
}

Callback.addCallback("LevelLoaded", function() {
	const content = EUMeter.gui.getContent();
	const element = content.elements.textName as UI.UITextElement;
	element.text = Translation.translate("eu_meter");
});