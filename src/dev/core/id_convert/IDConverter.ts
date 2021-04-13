namespace IDConverter {
	type IDDataPair = {
		id: number;
		data: number;
	}

	const oldIDPairs: {[key: string]: IDDataPair} = {};

	export function registerOld(stringId: string, oldId: number, oldData: number): void {
		oldIDPairs[stringId] = { id: oldId, data: oldData };
	}

	export function getStack(stringId: string, count: number = 1, data: number = 0, extra: ItemExtraData = null): ItemStack {
		if (BlockEngine.getMainGameVersion() == 11) {
			const oldPair = oldIDPairs[stringId];
			if (oldPair) {
				return new ItemStack(oldPair.id, count, oldPair.data, extra);
			}
		}
		return new ItemStack(VanillaItemID[stringId], count, data, extra);
	}

	export function getIDData(stringId: string): IDDataPair {
		if (BlockEngine.getMainGameVersion() == 11) {
			return oldIDPairs[stringId];
		} else {
			return { id: VanillaItemID[stringId], data: 0 }
		}
	}

	export function getID(stringId: string): number {
		if (BlockEngine.getMainGameVersion() == 11) return oldIDPairs[stringId].id;
		else return VanillaItemID[stringId];
	}

	export function getData(stringId: string): number {
		if (BlockEngine.getMainGameVersion() == 11) return oldIDPairs[stringId].data;
		else return 0;
	}
}
