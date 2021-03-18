namespace Machine {
	export interface IHeatConsumer {
		canReceiveHeat(side: number): boolean;
		heatReceive(amount: number): number;
	}
}