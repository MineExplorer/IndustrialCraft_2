abstract class CropCard {
	getBaseSeed(): BaseSeed {
		return {
			size: 1,
			growth: 1,
			gain: 1,
			resistance: 1,
			addToCreative: true
		}
	}

	getProperties(): CropCardProperties {
		return {
			tier: 0,
			chemistry: 0,
			consumable: 0,
			defensive: 0,
			colorful: 0,
			weed: 0
		}
	}

	getMaxSize(): number {
		return 1;
	}

	getOptimalHarvestSize(te: ICropTileEntity): number {
		return te.crop.getMaxSize();
	}

	getDiscoveredBy(): string {
		return "IC2 Team";
	}

	isWeed(te: ICropTileEntity): boolean {
		return false;
	}

	tick(te: ICropTileEntity): void { }

	dropGainChance(te: ICropTileEntity): number {
		return Math.pow(0.95, te.crop.getProperties().tier);
	}

	canGrow(te: ICropTileEntity): boolean {
		return te.data.currentSize < te.crop.getMaxSize();
	}

	canCross(te: ICropTileEntity): boolean {
		return te.data.currentSize >= 3;
	}

	canBeHarvested(te: ICropTileEntity): boolean {
		return te.data.currentSize == te.crop.getMaxSize();
	}

	getGrowthDuration(te: ICropTileEntity): number {
		return te.crop.getProperties().tier * 200;
	}

	getSeeds(te: ICropTileEntity): SeedBagStackData {
		return te.generateSeeds(te.data);
	}

	getSeedDropChance(te: ICropTileEntity): number {
		if (te.data.currentSize == 1) return 0;
		let base = .5;
		if (te.data.currentSize == 2) base /= 2;
		base *= Math.pow(0.8, te.crop.getProperties().tier);
		return base;
	}

	onLeftClick(te: ICropTileEntity): boolean {
		return te.pick();
	}

	onRightClick(te: ICropTileEntity): boolean {
		return te.performManualHarvest()
	}

	onEntityCollision(te: ICropTileEntity): boolean {
		return true;
	}

	getSizeAfterHarvest(te: ICropTileEntity): number {
		return 1;
	}

	getRootsLength(te: ICropTileEntity): number {
		return 1;
	}
}