class ToolWrench
extends ItemCommon
implements IWrech {
	dropChance: number;

	constructor(stringID: string, name: string, icon: string, dropChance: number) {
		super(stringID, name, icon);
		this.setMaxStack(1);
		this.setMaxDamage(161);
		this.setCategory(ItemCategory.EQUIPMENT);

		this.dropChance = dropChance;
		ICTool.registerWrench(this.id, this);
	}

	isUseable(item: ItemInstance, damage: number): boolean {
		return true;
	}

	useItem(item: ItemStack, damage: number, player: number): boolean {
		item.applyDamage(damage);
		Entity.setCarriedItem(player, item.id, 1, item.data, item.extra);
		return true;
	}
}
