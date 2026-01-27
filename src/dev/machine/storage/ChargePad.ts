/// <reference path="./BatteryBlock.ts" />

namespace Machine {
	export class ChargePad extends BatteryBlock {
		canRotate(side: number): boolean {
			return side > 1;
		}
        
		onTick(): void {
			super.onTick();
		}
	}
}