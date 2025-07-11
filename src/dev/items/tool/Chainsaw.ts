/// <reference path="ElectricTool.ts" />

class ElectricChainsaw extends ElectricTool
implements IHandEquippedFuncs {
	damage: number = 4;
	extraDamage: number;

	constructor(stringID: string, name: string, toolData: {energyPerUse: number, level: number, efficiency: number, damage: number, blockMaterials?: string[]}, maxCharge: number, transferLimit: number, tier: number) {
		super(stringID, name, maxCharge, transferLimit, tier);
		toolData.blockMaterials = ["wood", "wool", "fibre", "plant"];
		this.setToolParams(toolData);
		this.extraDamage = toolData.damage;
		ICTool.setOnHandEquipped(this.id, this);
	}

	modifyEnchant(enchantData: ToolAPI.EnchantData, item: ItemInstance, coords?: Callback.ItemUseCoordinates, block?: Tile): void {
		if (block && ToolAPI.getBlockMaterialName(block.id) == "plant") {
			enchantData.silk = true;
		}
	}

	onDestroy(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, player: number): boolean {
		if (Block.getDestroyTime(block.id) > 0) {
			if (ICTool.dischargeItem(item, this.getEnergyPerUse(item), player) && (block.id == 18 || block.id == 161)) {
				const region = WorldRegion.getForActor(player);
				region.destroyBlock(coords);
				region.dropAtBlock(coords.x, coords.y, coords.z, block.id, 1, block.data);
			}
		}
		return true;
	}

	onAttack(item: ItemInstance, victim: number, attacker: number): boolean {
		if (ICTool.dischargeItem(item, this.getEnergyPerUse(item), attacker)) {
			this.toolMaterial.damage = this.extraDamage;
		}
		else {
			this.toolMaterial.damage = 0;
		}
		return true;
	}

	onHandEquippedLocal(item: ItemInstance) {
		if (this.canEmitSound(item)) {
			ICTool.startPlaySound("ChainsawIdle.ogg", true);
		} else {
			this.stopPlaySound();
		}
	}

	onHandUnequippedLocal() {
		this.stopPlaySound();
	}

	canEmitSound(item: ItemInstance): boolean {
		return ChargeItemRegistry.getEnergyStored(item) >= this.energyPerUse;
	}

	stopPlaySound() {
		if (ICTool.stopPlaySound("ChainsawIdle.ogg")) {
			ICTool.startPlaySound("ChainsawStop.ogg", false);
		}
	}
}
