class EUMeterUpdatable {
	container: ItemContainer;
	mode = 0;
	time: number;
	sum: number;
	minValue: number;
	maxValue: number;
	remove: boolean;
	update: () => void;

	constructor(protected node: EnergyNode) {
		const container = new ItemContainer();
		this.setupContainer(container);
		this.container = container;
		this.resetValues();
		this.update = () => this.tick();
	}

	setupContainer(container: ItemContainer): void {
		container.setClientContainerTypeName("eu_meter.ui");
		container.addServerCloseListener(() => {
			this.destroy();
		});
		container.addServerEventListener("reset", () => this.resetValues());
		container.addServerEventListener("setMode", (container, client, data: {mode: number}) => {
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

	tick(): void {
		if (this.node.removed) {
			this.destroy();
			this.container.close();
			return;
		}
		this.time++;
		const value = this.getValue();
		this.minValue = Math.min(this.minValue, value);
		this.maxValue = Math.max(this.maxValue, value);
		this.sum += value;
		this.container.setText("textMinValue", this.displayValue(this.minValue));
		this.container.setText("textMaxValue", this.displayValue(this.maxValue));
		this.container.setText("textAvgValue", this.displayValue(this.sum / this.time));
		this.container.setText("textTime", Translation.translate("Cycle: ") + Math.floor(this.time / 20) + " " + Translation.translate("sec"));
		this.container.sendChanges();
	}

	getUnit(): string {
		return (this.mode < 3) ? "EU/t" : "V";
	}

	getValue(): number {
		switch (this.mode) {
			case 0:
				return this.node.energyIn;
			case 1:
				return this.node.energyOut;
			case 2:
				return this.node.energyIn - this.node.energyOut;
			case 3:
				return this.node.energyPower;
		}
	}

	displayValue(value: number): string {
		return `${Math.round(value * 100) / 100} ${this.getUnit()}`;
	}

	destroy(): void {
		this.remove = true;
	}
}