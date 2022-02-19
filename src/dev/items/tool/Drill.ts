/// <reference path="ElectricTool.ts" />

class ToolDrill extends ElectricTool {
	constructor(stringID: string, name: string, toolData: {energyPerUse: number, level: number, efficiency: number, damage: number, blockMaterials?: string[]}, maxCharge: number, transferLimit: number, tier: number) {
		super(stringID, name, maxCharge, transferLimit, tier);
		toolData.blockMaterials = ["stone", "dirt"];
		this.setToolParams(toolData);
	}

	onDestroy(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, player: number): boolean {
		if (Block.getDestroyTime(block.id) > 0) {
			ICTool.dischargeItem(item, this.energyPerUse, player);
			this.playDestroySound(item, block, player);
		}
		return true;
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, playerUid: number): void {
		let region = WorldRegion.getForActor(playerUid);
		let place = coords as Vector;
		if (!World.canTileBeReplaced(block.id, block.data)) {
			place = coords.relative;
			let block2 = region.getBlock(place);
			if (!World.canTileBeReplaced(block2.id, block2.data)) {
				return;
			}
		}
		let player = new PlayerEntity(playerUid);
		for (let i = 0; i < 36; i++) {
			let stack = player.getInventorySlot(i);
			if (stack.id != 50) continue;
			if (Block.isSolid(block.id)) {
				region.setBlock(place, 50, (6 - coords.side)%6);
			} else {
				let blockID = region.getBlockId(place.x, place.y - 1, place.z);
				if (Block.isSolid(blockID)) {
					region.setBlock(place, 50, 5);
				} else {
					break;
				}
			}
			stack.decrease(1);
			player.setInventorySlot(i, stack);
			break;
		}
	}

	continueDestroyBlock(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, progress: number): void {
		if (progress > 0) {
			this.playDestroySound(item, block, Player.get());
		}
	}

	playDestroySound(item: ItemInstance, block: Tile, player: number): void {
		if (IC2Config.soundEnabled && ChargeItemRegistry.getEnergyStored(item) >= this.energyPerUse) {
			let hardness = Block.getDestroyTime(block.id);
			if (hardness > 1 || hardness < 0) {
				SoundManager.startPlaySound(SourceType.ENTITY, player, "DrillHard.ogg");
			}
			else if (hardness > 0) {
				SoundManager.startPlaySound(SourceType.ENTITY, player, "DrillSoft.ogg");
			}
		}
	}
}