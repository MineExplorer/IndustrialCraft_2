/// <reference path="./TileEntityMachine.ts" />

interface IHeatConsumer {
	canReceiveHeat(side: number): boolean;
	heatReceive(amount: number): number;
}