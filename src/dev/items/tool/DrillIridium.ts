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
				return Translation.translate("Mode: ") + Translation.translate("Fortune III");
			case 1:
				return Translation.translate("Mode: ") + Translation.translate("Silk Touch");
			case 2:
				return Translation.translate("Mode: ") + "3x3 " + Translation.translate("Fortune III");
			case 3:
				return Translation.translate("Mode: ") + "3x3 " + Translation.translate("Silk Touch");
		}
	}

	onNameOverride(item: ItemInstance, name: string): string {
		name = super.onNameOverride(item, name);
		let mode = this.readMode(item.extra);
		return name + "\n" + this.getModeName(mode);
	}

	onModeSwitch(item: ItemInstance, player: number): void {
		let client = Network.getClientForPlayer(player);
		let extra = item.extra || new ItemExtraData();
		let mode = (extra.getInt("mode") + 1) % 4;
		extra.putInt("mode", mode);
		switch (mode) {
			case 0:
				client.sendMessage("§e" + this.getModeName(mode));
			break;
			case 1:
				client.sendMessage("§9" + this.getModeName(mode));
			break;
			case 2:
				client.sendMessage("§c" + this.getModeName(mode));
			break;
			case 3:
				client.sendMessage("§2" + this.getModeName(mode));
			break;
		}
		Entity.setCarriedItem(player, item.id, 1, item.data, extra);
	}

	modifyEnchant(enchant: ToolAPI.EnchantData, item: ItemInstance): void {
		let mode = this.readMode(item.extra);
		if (mode % 2 == 0) {
			enchant.fortune = 3;
		} else {
			enchant.silk = true;
		}
	}

	getOperationRadius(side: number): Vector {
		let rad = {x: 1, y: 1, z: 1};
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
			let mode = this.readMode(item.extra);
			let material = ToolAPI.getBlockMaterialName(block.id);
			if (mode >= 2 && (material == "dirt" || material == "stone")) {
				destroyTime = 0;
				let rad = this.getOperationRadius(coords.side);
				for (let xx = coords.x - rad.x; xx <= coords.x + rad.x; xx++)
				for (let yy = coords.y - rad.y; yy <= coords.y + rad.y; yy++)
				for (let zz = coords.z - rad.z; zz <= coords.z + rad.z; zz++) {
					let blockID = World.getBlockID(xx, yy, zz);
					let material = ToolAPI.getBlockMaterial(blockID);
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
		let region = WorldRegion.getForActor(player);
		let mode = this.readMode(item.extra);
		let material = ToolAPI.getBlockMaterialName(block.id);
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (mode >= 2 && (material == "dirt" || material == "stone") && energyStored >= this.energyPerUse) {
			let consume = 0;
			let rad = this.getOperationRadius(coords.side);
			for (let xx = coords.x - rad.x; xx <= coords.x + rad.x; xx++)
			for (let yy = coords.y - rad.y; yy <= coords.y + rad.y; yy++)
			for (let zz = coords.z - rad.z; zz <= coords.z + rad.z; zz++) {
				if (xx == coords.x && yy == coords.y && zz == coords.z) {
					continue;
				}
				let blockID = region.getBlockId(xx, yy, zz);
				material = ToolAPI.getBlockMaterialName(blockID);
				if (material == "dirt" || material == "stone") {
					consume += this.energyPerUse;
					region.destroyBlock(xx, yy, zz, true, player);
					if (energyStored < consume + this.energyPerUse) {
						ICTool.dischargeItem(item, consume, player);
						return true;
					}
				}
			}
			if (consume > 0) ICTool.dischargeItem(item, consume, player);
		}
		return true;
	}
}
