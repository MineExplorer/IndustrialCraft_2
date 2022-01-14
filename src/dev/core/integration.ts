namespace IntegrationAPI {
	export function addToRecyclerBlacklist(id: number): void {
		recyclerBlacklist.push(id);
	}
	export function addToolBooxValidItem(id: number): void {
		toolboxItems.push(id);
	}
}