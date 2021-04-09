namespace IDConverter {
	type IDDataPair = {
		id: number;
		data: number;
	}

	const oldData = {};

	export function registerOld(stringId: string, oldId: number, oldData: number): void {
		oldData[stringId] = { id: oldId, data: oldData };
	}

	export function getStack(stringId: string, count: number = 1, data: number = 0, extra: ItemExtraData = null): ItemStack {
		if (BlockEngine.getMainGameVersion() == 11) {
			const oldPair: IDDataPair = oldData[stringId];
			return new ItemStack(oldPair.id, count, oldPair.data, extra);
		}
		return new ItemStack(VanillaItemID[stringId], count, data, extra);
	}

	export function getIDData(stringId: string): IDDataPair {
		if (BlockEngine.getMainGameVersion() == 11) {
			return oldData[stringId];
		} else {
			return { id: VanillaItemID[stringId], data: 0 }
		}
	}

	export function getID(stringId: string): number {
		if (BlockEngine.getMainGameVersion() == 11) return oldData[stringId].id;
		else return VanillaItemID[stringId];
	}

	export function getData(stringId: string): number {
		if (BlockEngine.getMainGameVersion() == 11) return oldData[stringId].data;
		else return 0;
	}
}
