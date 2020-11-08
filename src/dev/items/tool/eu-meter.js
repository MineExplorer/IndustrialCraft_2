IDRegistry.genItemID("EUMeter");
Item.createItem("EUMeter", "EU Meter", {name: "eu_meter", meta: 0}, {stack: 1});

Recipes.addShaped({id: ItemID.EUMeter, count: 1, data: 0}, [
	" g ",
	"xcx",
	"x x"
], ['c', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'g', 348, -1]);


var guiEUReader = new UI.Window({
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
		"textName": {type: "text", font: {size: 36}, x: 378, y: 46, width: 256, height: 42, text: Translation.translate("EU Meter")},
		"textAvg": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 164, width: 256, height: 42, text: Translation.translate("Avg:")},
		"textAvgValue": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 194, width: 256, height: 42, text: "0 EU/t"},
		"textMaxMin": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 240, width: 256, height: 42, text: Translation.translate("Max/Min")},
		"textMax": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 270, width: 256, height: 42, text: "0 EU/t"},
		"textMin": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 300, width: 256, height: 42, text: "0 EU/t"},
		"textMode1": {type: "text", font: {size: 22, color: Color.GREEN}, x: 554, y: 164, width: 100, height: 42, text: Translation.translate("Mode:")},
		"textMode2": {type: "text", font: {size: 22, color: Color.GREEN}, x: 554, y: 348, width: 256, height: 42, text: Translation.translate("EnergyIn")},
		"textTime": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 348, width: 256, height: 42, text: "Cycle: 0 sec"},
		"textReset": {type: "text", font: {size: 22, color: Color.GREEN}, x: 330, y: 392, width: 256, height: 42, text: Translation.translate("Reset")},
		"closeButton": {type: "button", x: 727, y: 40, bitmap: "close_button_small", scale: GUI_SCALE, clicker: {
			onClick: function(container) {
				container.close();
				EUReader.container = null;
				EUReader.net = null;
				EUReader.tile = null;
			}
		}},
		"resetButton": {type: "button", x: 298, y: 385, bitmap: "eu_meter_reset_button", scale: GUI_SCALE, clicker: {
			onClick: function(container) {
				EUReader.resetValues();
			}
		}},
		"arrowButton0": {type: "button", x: 576, y: 206, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
			onClick: function(container) {
				EUReader.mode = 0;
				EUReader.resetValues();
				var elements = container.getGuiContent().elements;
				elements.arrow.bitmap = "eu_meter_arrow_0";
				elements.textMode2.text = Translation.translate("EnergyIn");
			}
		}},
		"arrowButton1": {type: "button", x: 640, y: 206, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
			onClick: function(container) {
				EUReader.mode = 1;
				EUReader.resetValues();
				var elements = container.getGuiContent().elements;
				elements.arrow.bitmap = "eu_meter_arrow_1";
				elements.textMode2.text = Translation.translate("EnergyOut");
			}
		}},
		"arrowButton2": {type: "button", x: 576, y: 270, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
			onClick: function(container) {
				EUReader.mode = 2;
				EUReader.resetValues();
				var elements = container.getGuiContent().elements;
				elements.arrow.bitmap = "eu_meter_arrow_2";
				elements.textMode2.text = Translation.translate("EnergyGain");
			}
		}},
		"arrowButton3": {type: "button", x: 640, y: 270, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
			onClick: function(container) {
				EUReader.mode = 3;
				EUReader.resetValues();
				var elements = container.getGuiContent().elements;
				elements.arrow.bitmap = "eu_meter_arrow_3";
				elements.textMode2.text = Translation.translate("Voltage");
			}
		}},
	}
});

Callback.addCallback("LevelLoaded", function() {
	var content = guiEUReader.getContent();
	content.elements.textName.text = Translation.translate("EU Meter");
});

Callback.addCallback("MinecraftActivityStopped", function() {
	if (EUReader.container && EUReader.container.isOpened()) {
		EUReader.container.close();
		EUReader.container = null;
	}
});

var EUReader = {
	container: null,
	mode: 0,
	time: 0,
	sum: 0,
	minValue: 0,
	maxValue: 0,
	net: null,
	tile: null,
	resetValues: function() {
		this.time = 0;
		this.sum = 0;
		this.minValue = 2e9;
		this.maxValue = -2e9;
	}
}

Item.registerUseFunction("EUMeter", function(coords, item, block) {
	var tile = EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z);
	if (tile) {
		var net = tile.__energyNets.Eu;
	} else {
		var net = EnergyNetBuilder.getNetOnCoords(coords.x, coords.y, coords.z);
	}
	if (!EUReader.container && (net || tile)) {
		EUReader.net = net;
		EUReader.tile = tile;
		EUReader.resetValues();
		EUReader.container = new UI.Container();
		EUReader.container.openAs(guiEUReader);
	}
});

Callback.addCallback("tick", function() {
	var item = Player.getCarriedItem()
	if (item.id == ItemID.EUMeter) {
		if (EUReader.container) {
			var r = function(x) {return Math.round(x * 100) / 100 || 0};
			var currentValue = 0;
			var elements = guiEUReader.content.elements;
			if (EUReader.mode < 3) {
				var unit = " EU/t";
				var energyIn = energyOut = 0;
				if (EUReader.tile) {
					energyIn = r(EUReader.tile.last_energy_receive);
					if (EUReader.net) {
						energyOut = r(EUReader.net.lastTransfered);
					}
				}
				else if (EUReader.net) {
					energyIn = energyOut = r(EUReader.net.lastTransfered);
				}
				switch (EUReader.mode) {
					case 0:
						currentValue = energyIn;
					break;
					case 1:
						currentValue = energyOut;
					break;
					case 2:
						currentValue = energyIn - energyOut;
					break;
				}
			} else {
				var unit = " V";
				if (EUReader.tile) {
					currentValue = r(EUReader.tile.last_voltage);
				}
				else if (EUReader.net) {
					currentValue = r(EUReader.net.lastVoltage);
				}
			}
			EUReader.time++;
			EUReader.sum += currentValue;
			EUReader.maxValue = Math.max(currentValue, EUReader.maxValue);
			EUReader.minValue = Math.min(currentValue, EUReader.minValue);
			elements.textAvgValue.text = r(EUReader.sum / EUReader.time) + unit;
			elements.textMax.text = EUReader.maxValue + unit;
			elements.textMin.text = EUReader.minValue + unit;
			elements.textTime.text = Translation.translate("Cycle: ") + Math.floor(EUReader.time/20) + " " + Translation.translate("sec");
		}
	}
});
