/**
 * API for integrating other mods with IndustrialCraft PE
 */
namespace IntegrationAPI {
	/**
	 * Registers item in Recycler blacklist.
	 * @param id item id
	 */
	export function addToRecyclerBlacklist(id: number): void {
		Machine.recyclerBlacklist.push(id);
	}
	/**
	 * Alllows item to be stored in Tool Box.
	 * @param id item id
	 */
	export function addToolBooxValidItem(id: number): void {
		toolboxItems.push(id);
	}
	/**
	 * Allows ore to be detected by Scanner and mined by Miner.
	 * Block ids starting with "ore" or ending with "_ore" are automatically registered.
	 * @param id block id
	 */
	export function registerOreForScanner(id: number) {
		if (!scannerOreBlocks.includes(id)) {
			scannerOreBlocks.push(id);
		}
	}
}