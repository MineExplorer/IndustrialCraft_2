namespace EUReaderGUI {
	Callback.addCallback("LevelLoaded", function() {
		const content = EUReader.gui.getContent();
		const element = content.elements.textName as UI.UITextElement;
		element.text = Translation.translate("EU Meter");
	});
}

class EUReaderUpdatable {
	container: ItemContainer;
	mode = 0;
	time: number;
	sum: number;
	minValue: number;
	maxValue: number;
	remove: boolean;

	constructor(protected node: EnergyNode) {
		const container = new ItemContainer();
		container.setClientContainerTypeName("eu_meter.ui");
		container.addServerCloseListener(() => {
			this.remove = true;
		});
		this.container = container;
		this.resetValues();
	}

	addEvents() {
		this.container.addServerEventListener("reset", () => this.resetValues());
		this.container.addServerEventListener("setMode", (container, client, data: {mode: number}) => {
			this.mode = data.mode;
		});
	}

	openGuiFor(client: NetworkClient) {
		this.container.openFor(client, "eu_meter.ui");
	}

	resetValues() {
		this.time = 0;
		this.sum = 0;
		this.minValue = 2e9;
		this.maxValue = -2e9;
	}

	update() {
		
	}
}