/// <reference path="UpgradeModule.ts" />

abstract class UpgradeTransporting extends UpgradeModule {
	onNameOverride(item: ItemInstance, name: string) {
		let sideName = Translation.translate(this.getSideName(item.data - 1));
		return name + "§7\n" + Translation.translate(this.getTooltip()).replace("%s", sideName);
	}

	getSideName(side: number): string {
		switch(side) {
			case 0:
				return "ic2.dir.bottom";
			case 1:
				return "ic2.dir.top";
			case 2:
				return "ic2.dir.north";
			case 3:
				return "ic2.dir.south";
			case 4: {
				return "ic2.dir.east";
			}
			case 5: {
				return "ic2.dir.west";
			}
			default: {
				"tooltip.upgrade.anyside";
			}
		}
	}

	getTooltip(): string {
		return "";
	}

	onIconOverride(item: ItemInstance): Item.TextureData {
		return {name: this.icon.name, meta: item.data}
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
		if (item.data == 0) {
			Entity.setCarriedItem(player, this.id, item.count, coords.side + 1);
		} else {
			Entity.setCarriedItem(player, this.id, item.count, 0);
		}
	}
}