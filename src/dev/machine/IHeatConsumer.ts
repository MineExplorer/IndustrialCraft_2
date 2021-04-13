namespace Machine {
	export interface IHeatConsumer extends TileEntity {
		canReceiveHeat(side: number): boolean;
		receiveHeat(amount: number): number;
	}
}