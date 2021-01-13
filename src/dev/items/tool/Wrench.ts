class ToolWrench
extends ItemIC2 {
	constructor(stringID: string, name: string, icon: string, dropChance: number) {
		super(stringID, name, icon);
		this.setMaxStack(1);
		this.setMaxDamage(161);
		this.setCategory(CreativeCategory.EQUIPMENT);
		ICTool.registerWrench(this.id, dropChance);
	}
}
