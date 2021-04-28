namespace EUMeterGUI {
	Callback.addCallback("LevelLoaded", function() {
		const content = EUMeter.gui.getContent();
		const element = content.elements.textName as UI.UITextElement;
		element.text = Translation.translate("EU Meter");
	});
}

class EUMeterUpdatable {
	container: ItemContainer;
	mode = 0;
	time: number;
	sum: number;
	minValue: number;
	maxValue: number;
	remove: boolean;

	constructor(protected node: EnergyNode) {
		const container = new ItemContainer();
		this.setupContainer(container);
		this.container = container;
		this.resetValues();
	}

	setupContainer(container: ItemContainer): void {
		container.setClientContainerTypeName("eu_meter.ui");
		container.addServerCloseListener(() => {
			this.destroy();
		});
		container.addServerEventListener("reset", () => this.resetValues());
		container.addServerEventListener("setMode", (container, client, data: {mode: number}) => {
			this.mode = data.mode;
		});
	}

	openGuiFor(client: NetworkClient): void {
		this.container.openFor(client, "eu_meter.ui");
	}

	resetValues(): void {
		this.time = 0;
		this.sum = 0;
		this.minValue = 2e9;
		this.maxValue = -2e9;
	}

	update(): void {
		let node = this.node;
		if (node.removed) {
			this.destroy();
			this.container.close();
			return;
		}
		this.time++;
		let unit = (this.mode < 3) ? "EU/t" : "V";
		let value: number;
		switch (this.mode) {
		case 0:
			value = node.energyIn;
		case 1:
			value = node.energyOut;
		case 2:
			value = node.energyIn - node.energyOut;
		case 3:
			value = node.energyPower;
		break;
		}
		this.minValue = Math.min(this.minValue, value);
		this.maxValue = Math.max(this.maxValue, value);
		this.sum += value;
		this.container.setText("textMinValue", `${this.roundValue(this.minValue)} ${unit}`);
		this.container.setText("textMaxValue", `${this.roundValue(this.maxValue)} ${unit}`);
		this.container.setText("textAvgValue", `${this.roundValue(this.sum / this.time)} ${unit}`);
		this.container.setText("textTime", Translation.translate("Cycle: ") + Math.floor(this.time / 20) + " " + Translation.translate("sec"));
		this.container.sendChanges();
	}

	roundValue(value: number): number {
		return Math.round(value * 100) / 100;
	}

	destroy(): void {
		this.remove = true;
	}

	static getUpdatable(node: EnergyNode): EUMeterUpdatable {
		let instance = new EUMeterUpdatable(node);
		let obj: any = {};
		for (let key in instance) {
			obj[key] = instance[key];
		}
		return obj;
	}
}