ItemRegistry.createItem("craftingHammer", {name: "forge_hammer", icon: "crafting_hammer", stack: 1, maxDamage: 80, category: ItemCategory.EQUIPMENT});
ItemRegistry.createItem("cutter", {name: "cutter", icon: "cutter", stack: 1, maxDamage: 60, category: ItemCategory.EQUIPMENT});

Item.registerUseFunction("cutter", function(coords, item, block, playerUid) {
	let cableData = CableRegistry.getCableData(block.id);
	if (cableData && cableData.insulation < cableData.maxInsulation) {
		let player = new PlayerEntity(playerUid);
		for (let i = 0; i < 36; i++) {
			let stack = player.getInventorySlot(i);
			if (stack.id == ItemID.rubber) {
				let blockID = CableRegistry.getBlockID(cableData.name, cableData.insulation + 1);
				let region = BlockSource.getDefaultForActor(playerUid);
				region.setBlock(coords.x, coords.y, coords.z, blockID, 0);
				stack.decrease(1);
				player.setInventorySlot(i, stack);
				if (block.data > 0) {
					EnergyGridBuilder.rebuildWireGrid(region, coords.x, coords.y, coords.z)
				}
				break;
			}
		}
	}
});

Callback.addCallback("DestroyBlockStart", function (coords: Callback.ItemUseCoordinates, block: Tile, playerUid: number): void {
	let item = Entity.getCarriedItem(playerUid);
	let cableData = CableRegistry.getCableData(block.id);
	if (item.id == ItemID.cutter && cableData && cableData.insulation > 0) {
		Game.prevent();
		Network.sendToServer(IC2NetworkPackets.cutterLongClick, { x: coords.x, y: coords.y, z: coords.z });
	}
});

Network.addServerPacket(IC2NetworkPackets.cutterLongClick, function (client: NetworkClient, coords: Vector) {
	let playerUid = client.getPlayerUid();
	let player = new PlayerEntity(playerUid);
	let item = player.getCarriedItem();
	let region = BlockSource.getDefaultForActor(playerUid);
	let block = region.getBlock(coords.x, coords.y, coords.z);
	let cableData = CableRegistry.getCableData(block.id);
	if (item.id == ItemID.cutter && cableData && cableData.insulation > 0) {
		item.applyDamage(1);
		player.setCarriedItem(item);
		SoundManager.playSoundAtBlock(coords, "InsulationCutters.ogg");
		let blockID = CableRegistry.getBlockID(cableData.name, cableData.insulation - 1);
		region.setBlock(coords.x, coords.y, coords.z, blockID, 0);
		region.spawnDroppedItem(coords.x + .5, coords.y + 1, coords.z + .5, ItemID.rubber, 1, 0);
		if (block.data > 0) {
			EnergyGridBuilder.rebuildWireGrid(region, coords.x, coords.y, coords.z)
		}
	}
});