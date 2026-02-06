/// <reference path="./BatteryBlock.ts" />

namespace Machine {
	export class ChargePad extends BatteryBlock {
		canRotate(side: number): boolean {
			return side > 1;
		}
        
		onTick(): void {
			super.onTick();
			if (this.data.energy < 1) return;
			
			const players = this.region.listEntitiesInAABB(this.x - 0.5, this.y, this.z - 0.5,
				this.x + 1.5, this.y + 3, this.z + 1.5, EEntityType.PLAYER);
			
			if (players.length > 0) {
				this.setActive(true);
				this.chargePlayers(players);
			} else {
				this.setActive(false);
			}
		}

		chargePlayers(players: number[]): void {
			for (let playerUid of players) {
				for (let i = 0; i < 4; i++) {
					const armorSlot = Entity.getArmorSlot(playerUid, i);
					const added = ChargeItemRegistry.addEnergyTo(armorSlot, "Eu", this.data.energy, this.getTier());
					if (added > 0) {
						Entity.setArmorSlot(playerUid, i, armorSlot.id, armorSlot.count, armorSlot.data, armorSlot.extra);
						this.data.energy -= added;
						if (this.data.energy < 1) return;
					}
				}
				
				const carriedSlot = Entity.getCarriedItem(playerUid);
				const added = ChargeItemRegistry.addEnergyTo(carriedSlot, "Eu", this.data.energy, this.getTier());
				if (added > 0) {
					Entity.setCarriedItem(playerUid, carriedSlot.id, carriedSlot.count, carriedSlot.data, carriedSlot.extra);
					this.data.energy -= added;
					if (this.data.energy < 1) break;
				}
			}
		}
	}
}