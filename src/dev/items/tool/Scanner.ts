let ore_blocks = [14, 15, 16, 21, 73, 74, 56, 129, 153];

Callback.addCallback("PreLoaded", function() {
	for (let id in BlockID) {
		if (id.startsWith("ore") && !TileEntity.isTileEntityBlock(BlockID[id])) {
			ore_blocks.push(BlockID[id]);
		}
	}
});

class ItemScanner
extends ItemElectric {
	energyPerUse: number;
	radius: number;

	constructor(stringID: string, name: string, maxCharge: number, transferLimit: number, tier: number) {
		super(stringID, name, maxCharge, transferLimit, tier);
	}

	getScanRadius(): number {
		return this.tier == 1 ? 3 : 6;
	}

	getEnergyPerUse(): number {
		return this.tier == 1 ? 50 : 250;
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void {
		let client = Network.getClientForPlayer(player);
		if (client && ICTool.useElectricItem(item, this.getEnergyPerUse())) {
			SoundManager.playSound("ODScanner.ogg");
			client.sendMessage(Translation.translate("Scan Result: ") + coords.x + ", " + coords.y + ", " + coords.z);
			let ores = {};
			let radius = this.getScanRadius();
			for (let x = coords.x - radius; x <= coords.x + radius; x++) {
				for (let y = coords.y - radius; y <= coords.y + radius; y++) {
					for (let z = coords.z - radius; z <= coords.z + radius; z++) {
						let blockID = World.getBlockID(x, y, z);
						if (ore_blocks.indexOf(blockID) != -1) {
							if (!ores[blockID]) ores[blockID] = 0;
							ores[blockID]++;
						}
					}
				}
			}
			for (let id in ores) {
				client.sendMessage(Item.getName(parseInt(id), 0) + " - " + ores[id])
			}
		}
	}
}

new ItemScanner("scanner", "scanner", 10000, 100, 1);
new ItemScanner("scannerAdvanced", "scanner_advanced", 100000, 256, 2);

Recipes.addShaped({id: ItemID.scanner, count: 1, data: 27}, [
	"gdg",
	"cbc",
	"xxx"
], ['x', ItemID.cableCopper1, -1, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitBasic, -1, 'd', 348, 0, 'g', ItemID.casingGold, -1], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.scannerAdvanced, count: 1, data: 27}, [
	"gbg",
	"dcd",
	"xsx"
], ['x', ItemID.cableGold2, -1, 's', ItemID.scanner, -1, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitAdvanced, -1, 'd', 348, 0, 'g', ItemID.casingGold, -1], ChargeItemRegistry.transferEnergy);
