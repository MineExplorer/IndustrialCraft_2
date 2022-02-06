namespace ToolHUD {
	export let currentUIscreen: string;
	Callback.addCallback("NativeGuiChanged", function(screenName) {
		currentUIscreen = screenName;
		if (screenName != "in_game_play_screen" && container) {
			container.close();
		}
	});

	const buttonScale = IC2Config.getInt("button_scale");
	let isEnabled = false;
	export let container = null;
	export const Window = new UI.Window({
		location: {
			x: 1000 - buttonScale,
			y: UI.getScreenHeight()/2 - buttonScale*2,
			width: buttonScale,
			height: buttonScale*5
		},
		drawing: [{type: "background", color: 0}],
		elements: {}
	});
	Window.setAsGameOverlay(true);

	const buttonMap = {};
	export const buttons: {[key: string]: IHUDButton} = {};

	export function registerButton(button: IHUDButton): void {
		buttons[button.name] = button;
		buttonMap[button.name] = false;
	}

	export function getButton(name: string): IHUDButton {
		return buttons[name];
	}

	export function setButtonFor(id: number, name: string): void {
		getButton(name).bindItem(id);
	}

	/** @deprecated */
	export function setArmorButton(id: number, name: string) {
		setButtonFor(id, name);
	}

	export function onClick(name: string): void {
		Network.sendToServer("icpe.clickHUDButton", {name: name});
	}

	function updateUIbuttons() {
		const elements = Window.getContent().elements;
		for (let name in buttonMap) {
			if (buttonMap[name]) {
				const button = getButton(name);
				if (!elements[name]) {
					elements[name] = button.uiElement;
				}
				button.onUpdate(button.uiElement);
				buttonMap[name] = false;
			}
			else {
				elements[name] = null;
			}
		}
	}

	function onUpdate(): void {
		if (currentUIscreen == "in_game_play_screen") {
			const item = Player.getCarriedItem();
			const armor = [];
			for (let i = 0; i < 4; i++) {
				const slot = Player.getArmorSlot(i);
				if (slot.id > 0) armor.push(slot);
			}
			for (let name in buttons) {
				const button = buttons[name];
				if (button.type == "armor") {
					for (let slot of armor) {
						if (button.isBindedItem(slot.id)) {
							buttonMap[name] = true;
							isEnabled = true;
							break;
						}
					}
				} else if (button.isBindedItem(item.id)) {
					buttonMap[name] = true;
					isEnabled = true;
				}
			}
			if (isEnabled) {
				if (!container || !container.isOpened()) {
					container = new UI.Container();
					container.openAs(Window);
				}
				updateUIbuttons();
			} else if (container?.isOpened()) {
				container.close();
			}
		}
		else if (container) {
			container.close();
			container = null;
		}
		isEnabled = false;
	}

	Callback.addCallback("LocalTick", onUpdate);

	// Server Side
	Network.addServerPacket("icpe.clickHUDButton", function (client: NetworkClient, data: {name: string}) {
		const player = client.getPlayerUid();
		getButton(data.name).onClick(player);
	});

	Network.addServerPacket("icpe.setFlying", function (client: NetworkClient, data: {fly: boolean}) {
		const player = client.getPlayerUid();
		JetpackProvider.setFlying(player, data.fly);
	});
}