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
		this.container = new ItemContainer();
		this.resetValues();
	}

	setupContainer(): void {
		this.container.setClientContainerTypeName("eu_meter.ui");
		this.container.addServerCloseListener(() => {
			this.destroy();
		});
		this.container.addServerEventListener("reset", () => this.resetValues());
		this.container.addServerEventListener("setMode", (container, client, data: {mode: number}) => {
			this.mode = data.mode;
			this.resetValues();
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
		break;
		case 1:
			value = node.energyOut;
		break;
		case 2:
			value = node.energyIn - node.energyOut;
		break;
		case 3:
			value = node.energyPower;
		break;
		}
		this.minValue = Math.min(this.minValue, value);
		this.maxValue = Math.max(this.maxValue, value);
		this.sum += value;
		this.container.setText("textMinValue", this.displayValue(this.minValue, unit));
		this.container.setText("textMaxValue", this.displayValue(this.maxValue, unit));
		this.container.setText("textAvgValue", this.displayValue(this.sum / this.time, unit));
		this.container.setText("textTime", Translation.translate("Cycle: ") + Math.floor(this.time / 20) + " " + Translation.translate("sec"));
		this.container.sendChanges();
	}

	displayValue(value: number, unit: string): string {
		return `${Math.round(value * 100) / 100} ${unit}`;
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
		obj.setupContainer();
		return obj;
	}
}