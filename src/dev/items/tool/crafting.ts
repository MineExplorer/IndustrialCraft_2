ItemRegistry.createItem("craftingHammer", {name: "forge_hammer", icon: "crafting_hammer", stack: 1, maxDamage: 80, category: ItemCategory.EQUIPMENT});
ItemRegistry.createItem("cutter", {name: "cutter", icon: "cutter", stack: 1, maxDamage: 60, category: ItemCategory.EQUIPMENT});

// TODO: send packet to server
Callback.addCallback("DestroyBlockStart", function(coords, block) {
	let item = Player.getCarriedItem();
	let cableData = CableRegistry.getCableData(block.id);
	if (item.id == ItemID.cutter && cableData && cableData.insulation > 0) {
		Game.prevent();
		ToolLib.breakCarriedTool(1, Player.get());
		SoundManager.playSoundAtBlock(coords, "InsulationCutters.ogg", 1);
		let blockID = BlockID[cableData.name + (cableData.insulation - 1)]
		World.setBlock(coords.x, coords.y, coords.z, blockID, 0);
		World.drop(coords.x + 0.5, coords.y + 1, coords.z + 0.5, ItemID.rubber, 1, 0);
	}
});

Item.registerUseFunction("cutter", function(coords, item, block, playerUid) {
	let cableData = CableRegistry.getCableData(block.id);
	if (cableData && cableData.insulation < cableData.maxInsulation) {
		let player = new PlayerInterface(playerUid);
		for (let i = 9; i < 45; i++) {
			let stack = player.getInventorySlot(i);
			if (stack.id == ItemID.rubber) {
				let blockID = Block.getNumericId(cableData.name + (cableData.insulation + 1));
				let region = WorldRegion.getForActor(playerUid);
				region.setBlock(coords, blockID, 0);
				stack.decrease(1);
				player.setInventorySlot(i, stack);
				break;
			}
		}
	}
});