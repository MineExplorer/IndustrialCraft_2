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
		if (IC2Config.getMinecraftVersion() == 11) {
			const oldPair: IDDataPair = oldData[stringId];
			return new ItemStack(oldPair.id, count, oldPair.data, extra);
		}
		return new ItemStack(VanillaItemID[stringId], count, data, extra);
	}
}
