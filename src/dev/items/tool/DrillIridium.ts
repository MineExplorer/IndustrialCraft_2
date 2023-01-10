/// <reference path="Drill.ts" />

class ToolDrillIridium extends ToolDrill
implements IModeSwitchable {
	constructor() {
		super("iridiumDrill", "iridium_drill", {energyPerUse: 800, level: 100, efficiency: 24, damage: 5}, 1000000, 2048, 3);
		this.setGlint(true);
		this.setRarity(EnumRarity.RARE);
		ToolHUD.setButtonFor(this.id, "button_switch");
	}

	readMode(extra: ItemExtraData): number {
		if (!extra) return 0;
		return extra.getInt("mode");
	}

	getModeName(mode: number): string {
		switch (mode) {
			case 0:
				return Translation.translate("Mode: %s").replace("%s", Translation.translate("iridium_drill.fortune"));
			case 1:
				return Translation.translate("Mode: %s").replace("%s", Translation.translate("iridium_drill.silk_touch"));
			case 2:
				return Translation.translate("Mode: %s").replace("%s", Translation.translate("iridium_drill.fortune_3x3"));
			case 3:
				return Translation.translate("Mode: %s").replace("%s", Translation.translate("iridium_drill.silk_touch_3x3"));
		}
	}

	onNameOverride(item: ItemInstance, name: string): string {
		name = super.onNameOverride(item, name);
		const mode = this.readMode(item.extra);
		return name + "\n" + this.getModeName(mode);
	}

	onModeSwitch(item: ItemInstance, player: number): void {
		const extra = item.extra || new ItemExtraData();
		const mode = (extra.getInt("mode") + 1) % 4;
		extra.putInt("mode", mode);
		Entity.setCarriedItem(player, item.id, 1, item.data, extra);
		const client = Network.getClientForPlayer(player);
		switch (mode) {
			case 0:
				BlockEngine.sendMessage(client, "§e", "Mode: %s", "iridium_drill.fortune");
			break;
			case 1:
				BlockEngine.sendMessage(client, "§9", "Mode: %s", "iridium_drill.silk_touch");
			break;
			case 2:
				BlockEngine.sendMessage(client, "§c", "Mode: %s", "iridium_drill.fortune_3x3");
			break;
			case 3:
				BlockEngine.sendMessage(client, "§2", "Mode: %s", "iridium_drill.silk_touch_3x3");
			break;
		}
	}

	modifyEnchant(enchant: ToolAPI.EnchantData, item: ItemInstance): void {
		const mode = this.readMode(item.extra);
		if (mode % 2 == 0) {
			enchant.fortune = 3;
		} else {
			enchant.silk = true;
		}
	}

	getOperationRadius(side: number): Vector {
		const rad = {x: 1, y: 1, z: 1};
		if (side == BlockSide.EAST || side == BlockSide.WEST)
			rad.x = 0;
		if (side == BlockSide.UP || side == BlockSide.DOWN)
			rad.y = 0;
		if (side == BlockSide.NORTH || side == BlockSide.SOUTH)
			rad.z = 0;
		return rad;
	}

	calcDestroyTime(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, params: {base: number, devider: number, modifier: number}, destroyTime: number): number {
		if (ChargeItemRegistry.getEnergyStored(item) >= this.getEnergyPerUse(item)) {
			const mode = this.readMode(item.extra);
			const material = ToolAPI.getBlockMaterialName(block.id);
			if (mode >= 2 && (material == "dirt" || material == "stone")) {
				destroyTime = 0;
				const rad = this.getOperationRadius(coords.side);
				for (let xx = coords.x - rad.x; xx <= coords.x + rad.x; xx++)
				for (let yy = coords.y - rad.y; yy <= coords.y + rad.y; yy++)
				for (let zz = coords.z - rad.z; zz <= coords.z + rad.z; zz++) {
					const blockID = World.getBlockID(xx, yy, zz);
					const material = ToolAPI.getBlockMaterial(blockID);
					if (material && (material.name == "dirt" || material.name == "stone")) {
						destroyTime = Math.max(destroyTime, Block.getDestroyTime(blockID) / material.multiplier / this.toolMaterial.efficiency);
					}
				}
			}
			return destroyTime;
		}
		return params.base;
	}

	onDestroy(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, player: number): boolean {
		this.playDestroySound(item, block, player);
		const mode = this.readMode(item.extra);
		const material = ToolAPI.getBlockMaterialName(block.id);
		const energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (mode >= 2 && (material == "dirt" || material == "stone") && energyStored >= this.energyPerUse * 2) {
			const consume = this.destroy3x3Area(coords, player, energyStored);
			if (consume > 0) {
				ICTool.dischargeItem(item, consume, player);
			}
		}
		else if (Block.getDestroyTime(block.id) > 0) {
			ICTool.dischargeItem(item, this.energyPerUse, player);
		}
		return true;
	}

	private destroy3x3Area(coords: Callback.ItemUseCoordinates, player: number, energyStored: number): number {
		const region = WorldRegion.getForActor(player);
		let consume = this.energyPerUse;
		const rad = this.getOperationRadius(coords.side);
		for (let xx = coords.x - rad.x; xx <= coords.x + rad.x; xx++)
		for (let yy = coords.y - rad.y; yy <= coords.y + rad.y; yy++)
		for (let zz = coords.z - rad.z; zz <= coords.z + rad.z; zz++) {
			if (xx == coords.x && yy == coords.y && zz == coords.z) {
				continue;
			}
			const blockID = region.getBlockId(xx, yy, zz);
			const material = ToolAPI.getBlockMaterialName(blockID);
			if (material == "dirt" || material == "stone") {
				consume += this.energyPerUse;
				region.destroyBlock(xx, yy, zz, true, player);
				if (energyStored < consume + this.energyPerUse) {
					return consume;
				}
			}
		}
		return consume;
	}
}
