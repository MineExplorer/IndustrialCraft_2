IDRegistry.genItemID("uraniumChunk");
Item.createItem("uraniumChunk", "Uranium", {name: "uranium"});

IDRegistry.genItemID("iridiumChunk");
Item.createItem("iridiumChunk", "Iridium", {name: "iridium"});
Item.registerNameOverrideFunction(ItemID.iridiumChunk, RARE_ITEM_NAME);