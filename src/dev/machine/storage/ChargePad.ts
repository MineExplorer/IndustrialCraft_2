/// <reference path="./BatteryBlock.ts" />

namespace Machine {
	export class ChargePad extends BatteryBlock {
		constructor(tier: number, capacity: number, defaultDrop: number, guiScreen: UI.StandartWindow, public carriedOnly: boolean = false) {
			super(tier, capacity, defaultDrop, guiScreen);
		}

		canRotate(side: number): boolean {
			return side > 1;
		}
        
		onTick(): void {
			super.onTick();
			const threadTime = World.getThreadTime();
			if (threadTime % 2 != 0) return;
			
			let newActive = false;
			if (this.data.energy >= 1) {
				const playerHeight = 1.62;
				const players = this.region.listEntitiesInAABB(this.x - 0.5, this.y + 1 + playerHeight, this.z - 0.5,
					this.x + 1.5, this.y + 3, this.z + 1.5, EEntityType.PLAYER);
				if (players.length > 0) {
					newActive = true;
					const chargeRate = 10;
					if (threadTime % chargeRate == 0) {
						this.chargePlayers(players, this.getMaxPacketSize() * chargeRate);
					}
				}
			}

			this.setActive(newActive);
		}

		chargePlayers(players: number[], energy: number): void {
			for (let playerUid of players) {
				const actor = new PlayerEntity(playerUid);
				for (let i = 0; i < 4; i++) {
					const armorSlot = actor.getArmor(i);
					const added = ChargeItemRegistry.addEnergyTo(armorSlot, "Eu", Math.min(energy, this.data.energy), this.getTier(), true);
					if (added > 0) {
						actor.setArmor(i, armorSlot);
						this.data.energy -= added;
						if (this.data.energy < 1) return;
					}
				}
				
				const startSlot = this.carriedOnly ? actor.getSelectedSlot() : 0;
				const endSlot = this.carriedOnly ? startSlot : 35;
				for (let i = startSlot; i <= endSlot; i++) {
					const invSlot = actor.getInventorySlot(i);
					const added = ChargeItemRegistry.addEnergyTo(invSlot, "Eu", Math.min(energy, this.data.energy), this.getTier(), true);
					if (added > 0) {
						actor.setInventorySlot(i, invSlot);
						this.data.energy -= added;
						if (this.data.energy < 1) break;
					}
				}
			}
		}
	}
}