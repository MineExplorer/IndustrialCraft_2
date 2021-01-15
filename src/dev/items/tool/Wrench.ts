class ToolWrench
extends ItemCommon {
	constructor(stringID: string, name: string, icon: string, dropChance: number) {
		super(stringID, name, icon);
		this.setMaxStack(1);
		this.setMaxDamage(161);
		this.setCategory(ItemCategory.EQUIPMENT);
		ICTool.registerWrench(this.id, dropChance);
	}
}
