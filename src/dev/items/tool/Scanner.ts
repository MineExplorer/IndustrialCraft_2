let ore_blocks = [14, 15, 16, 21, 73, 74, 56, 129, 153];
if (BlockEngine.getMainGameVersion() >= 16) {
	ore_blocks.push(VanillaTileID.nether_gold_ore, VanillaTileID.gilded_blackstone, VanillaTileID.ancient_debris);
}

Callback.addCallback("PreLoaded", function() {
	for (let id in BlockID) {
		if (id.startsWith("ore") && !TileEntity.isTileEntityBlock(BlockID[id])) {
			ore_blocks.push(BlockID[id]);
		}
	}
});

class ItemScanner extends ItemElectric {
	constructor(stringID: string, name: string, maxCharge: number, transferLimit: number, tier: number) {
		super(stringID, name, maxCharge, transferLimit, tier);
	}

	getScanRadius(): number {
		return this.tier == 1 ? 3 : 6;
	}

	getEnergyPerUse(): number {
		return this.tier == 1 ? 50 : 250;
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
		let client = Network.getClientForPlayer(player);
		if (client && ICTool.useElectricItem(item, this.getEnergyPerUse(), player)) {
			SoundLib.playSoundAtEntity(player, "ODScanner.ogg");
			BlockEngine.sendMessage(client, "message.scan_result", `${coords.x}, ${coords.y}, ${coords.z}`);
			let ores = {};
			let radius = this.getScanRadius();
			let region = BlockSource.getDefaultForActor(player);
			for (let x = coords.x - radius; x <= coords.x + radius; x++) {
				for (let y = coords.y - radius; y <= coords.y + radius; y++) {
					for (let z = coords.z - radius; z <= coords.z + radius; z++) {
						let blockID = region.getBlockId(x, y, z);
						if (ore_blocks.indexOf(blockID) != -1) {
							if (!ores[blockID]) ores[blockID] = 0;
							ores[blockID]++;
						}
					}
				}
			}
			for (let id in ores) {
				let itemID = Block.convertBlockToItemId(parseInt(id));
				client.sendMessage(Item.getName(itemID, 0) + " - " + ores[id]);
			}
		}
	}
}
