IDRegistry.genItemID("ashes");
Item.createItem("ashes", "Ashes", {name: "ashes"});

IDRegistry.genItemID("slag");
Item.createItem("slag", "Slag", {name: "slag"});

IDRegistry.genItemID("bioChaff");
Item.createItem("bioChaff", "Bio Chaff", {name: "bio_chaff"});

Item.addCreativeGroup("waste", Translation.translate("Waste"), [
	ItemID.ashes,
	ItemID.slag,
	ItemID.bioChaff
]);