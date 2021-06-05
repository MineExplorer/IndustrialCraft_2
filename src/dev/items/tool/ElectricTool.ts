abstract class ElectricTool
extends ItemElectric
implements ToolParams {
	energyPerUse: number;
	damage: number = 0;
	toolMaterial: ToolAPI.ToolMaterial;

	constructor(stringID: string, name: string, toolData: {energyPerUse: number, level: number, efficiency: number, damage: number}, blockMaterials: string[], maxCharge: number, transferLimit: number, tier: number) {
		super(stringID, name, maxCharge, transferLimit, tier);
		this.setHandEquipped(true);
		this.energyPerUse = toolData.energyPerUse;
		let toolMaterial = {
			level: toolData.level,
			efficiency: toolData.efficiency,
			damage: toolData.damage,
			durability: Item.getMaxDamage(this.id)
		}
		ToolAPI.registerTool(this.id, toolMaterial, blockMaterials, this);
	}

	getEnergyPerUse(item: ItemInstance): number {
		return this.energyPerUse;
	}

	onBroke(): boolean {return true;}

	onAttack(item: ItemInstance, victim: number, attacker: number): boolean {
		ICTool.dischargeItem(item, this.getEnergyPerUse(item), attacker);
		return true;
	}

	onDestroy(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, player: number): boolean {
		if (Block.getDestroyTime(block.id) > 0) {
			ICTool.dischargeItem(item, this.getEnergyPerUse(item), player);
		}
		return true;
	}

	calcDestroyTime(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, params: {base: number, devider: number, modifier: number}, destroyTime: number): number {
		if (ChargeItemRegistry.getEnergyStored(item) >= this.getEnergyPerUse(item)) {
			return destroyTime;
		}
		return params.base;
	}
}