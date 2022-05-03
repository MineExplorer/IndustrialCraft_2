class ToolWrench extends ItemCommon
implements IWrech {
	constructor(stringID: string, name: string, icon: string) {
		super(stringID, name, icon);
		this.setMaxStack(1);
		this.setMaxDamage(161);
		this.setCategory(ItemCategory.EQUIPMENT);
		ICTool.registerWrench(this.id, this);
	}

	isUseable(item: ItemInstance, damage: number): boolean {
		return true;
	}

	useItem(item: ItemStack, damage: number, player: number): void {
		item.applyDamage(damage);
		Entity.setCarriedItem(player, item.id, 1, item.data, item.extra);
		if (item.id == 0) {
			const region = WorldRegion.getForActor(player);
			region.playSoundAtEntity(player, "random.break");
		}
	}
}
