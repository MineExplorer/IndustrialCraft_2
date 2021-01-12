IDRegistry.genItemID("containmentBox");
Item.createItem("containmentBox", "containment_box", {name: "containment_box", meta: 0}, {stack: 1});

Recipes.addShaped({id: ItemID.containmentBox, count: 1, data: 0}, [
	"aaa",
	"axa",
	"aaa",
], ['x', 54, -1, 'a', ItemID.casingLead, 0]);

let guiContainmentBox = new UI.StandartWindow({
	standard: {
		header: {text: {text: Translation.translate("Containment Box")}},
		inventory: {standard: true},
		background: {standard: true}
	},

	drawing: [
		{type: "background", color: Color.parseColor("#d5d9b9")},
		{type: "bitmap", x: 415, y: 112, bitmap: "containment_box_image", scale: GUI_SCALE},
		{type: "bitmap", x: 805, y: 112, bitmap: "containment_box_image", scale: GUI_SCALE},
		{type: "bitmap", x: 415, y: 232, bitmap: "containment_box_image", scale: GUI_SCALE},
		{type: "bitmap", x: 805, y: 232, bitmap: "containment_box_image", scale: GUI_SCALE},
	],

	elements: {
		"slot0": {type: "slot", x: 530, y: 120},
		"slot1": {type: "slot", x: 590, y: 120},
		"slot2": {type: "slot", x: 650, y: 120},
		"slot3": {type: "slot", x: 710, y: 120},
		"slot4": {type: "slot", x: 530, y: 180},
		"slot5": {type: "slot", x: 590, y: 180},
		"slot6": {type: "slot", x: 650, y: 180},
		"slot7": {type: "slot", x: 710, y: 180},
		"slot8": {type: "slot", x: 530, y: 240},
		"slot9": {type: "slot", x: 590, y: 240},
		"slot10": {type: "slot", x: 650, y: 240},
		"slot11": {type: "slot", x: 710, y: 240},
	}
});

BackpackRegistry.register(ItemID.containmentBox, {
	title: "Containment Box",
	gui: guiContainmentBox,
	isValidItem: function(id, count, data) {
		return RadiationAPI.isRadioactiveItem(id)
	}
});
