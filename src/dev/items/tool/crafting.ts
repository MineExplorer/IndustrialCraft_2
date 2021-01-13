ItemRegistry.createItem("craftingHammer", {name: "Forge Hammer", icon: "crafting_hammer", stack: 1, maxDamage: 80, category: ItemCategory.EQUIPMENT});
ItemRegistry.createItem("cutter", {name: "cutter", icon: "cutter", stack: 1, maxDamage: 60, category: ItemCategory.EQUIPMENT});

// TODO: send packet to server
Callback.addCallback("DestroyBlockStart", function(coords, block) {
	var item = Player.getCarriedItem();
	var cableData = CableRegistry.getCableData(block.id);
	if (item.id == ItemID.cutter && cableData && cableData.insulation > 0) {
		Game.prevent();
		ItemTool.damageCarriedItem(Player.get());
		SoundManager.playSoundAtBlock(coords, "InsulationCutters.ogg", 1);
		var blockID = BlockID[cableData.name + (cableData.insulation - 1)]
		World.setBlock(coords.x, coords.y, coords.z, blockID, 0);
		World.drop(coords.x + 0.5, coords.y + 1, coords.z + 0.5, ItemID.rubber, 1, 0);
	}
});

Item.registerUseFunction("cutter", function(coords, item, block, playerUid) {
	var cableData = CableRegistry.getCableData(block.id);
	if (cableData && cableData.insulation < cableData.maxInsulation) {
		let player = new PlayerManager(playerUid);
		for (var i = 9; i < 45; i++) {
			var slot = player.getInventorySlot(i);
			if (slot.id == ItemID.rubber) {
				var blockID = BlockID[cableData.name + (cableData.insulation + 1)];
				let region = WorldRegion.getForActor(playerUid);
				region.setBlock(coords, blockID, 0);
				player.setInventorySlot(i, --slot.count ? slot.id : 0, slot.count, slot.data);
				break;
			}
		}
	}
});