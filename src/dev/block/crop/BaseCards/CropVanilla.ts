
class CropVanilla extends CropCard {

	getDiscoveredBy(): string {
		return "Notch";
	}

	getProduct(): ItemInstance {
		return { id: 0, count: 1, data: 0 }
	}

	canGrow(tileentity: ICropTileEntity) {
		const light = tileentity.region.getLightLevel(tileentity);
		return tileentity.data.currentSize < tileentity.crop.getMaxSize() && light >= 9;
	}

	getGain(te: ICropTileEntity): ItemInstance {
		return te.crop.getProduct();
	}

	getSeeds(te: ICropTileEntity) {
		if (te.data.statGain <= 1 && te.data.statGrowth <= 1 && te.data.statResistance <= 1) {
			return AgricultureAPI.abstractFunctions["CropVanilla"].getSeed();
			// TODO add types to AgricultureAPI
		}
		return AgricultureAPI.abstractFunctions["IC2CropCard"].getSeeds(te);
	}
}