class CropBaseMetalCommon extends CropCard {

	getProperties(): CropCardProperties {
		return {
			tier: 6,
			chemistry: 2,
			consumable: 0,
			defensive: 0,
			colorful: 1,
			weed: 0
		}
	}

	getMaxSize(): number {
		return 4;
	}

	getRootsLength(te: ICropTileEntity) {
		return 5
	}

	getCropRootsRequirement(): any {

	}

	canGrow(tileentity: ICropTileEntity): boolean {
		if (tileentity.data.currentSize < 3) return true;
		if (tileentity.data.currentSize == 3) {
			// TODO check it
			if (!this.getCropRootsRequirement() || this.getCropRootsRequirement().length == 0) return true;
			for (const req of this.getCropRootsRequirement()) {
				// TODO check eval
				if (tileentity.isBlockBelow(eval(req))) return true;
			}
		}
		return false;
	}

	dropGainChance(): number {
		return AgricultureAPI.abstractFunctions["IC2CropCard"] / 2;
	}

	getGrowthDuration(tileentity: ICropTileEntity): number {
		if (tileentity.data.currentSize == 3) {
			return 2000;
		}
		return 800;
	}

	getSizeAfterHarvest(tileentity: ICropTileEntity): number {
		return 2;
	}
}