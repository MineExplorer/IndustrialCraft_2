class ElectricWrench
extends ItemElectric
implements IWrech {
	dropChance = 1;
	energyPerUse = 100;

	constructor() {
		super("electricWrench", "electric_wrench", 10000, 100, 1);
		ICTool.registerWrench(this.id, this);
	}

	isUseable(item: ItemInstance, damage: number): boolean {
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		return energyStored >= this.energyPerUse * damage;
	}

	useItem(item: ItemStack, damage: number, player: number): void {
		ICTool.useElectricItem(item, this.energyPerUse * damage, player);
	}
}
