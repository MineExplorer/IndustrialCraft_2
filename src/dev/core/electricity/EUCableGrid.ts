/// <reference path="CableDamageArea.ts" />

class EUCableGrid extends EnergyGrid {
	damageEnabled: boolean;
	damageArea: CableDamageArea = null;

	constructor(energyType: EnergyType, maxValue: number, blockID: number, region: BlockSource) {
		super(energyType, maxValue, blockID, region);
		this.damageEnabled = !!CableRegistry.getCableData(blockID);
	}

	isValidWire(tile: Tile): boolean {
		if (super.isValidWire(tile)) return true;

		const cableData = CableRegistry.getCableData(this.blockID);
		const otherData = CableRegistry.getCableData(tile.id);
		return cableData && otherData && cableData.name == otherData.name;
	}

	mergeGrid(grid: EUCableGrid): EUCableGrid {
		super.mergeGrid(grid);
		this.resetDamageArea();
		return this;
	}

	addCoords(x: number, y: number, z: number, tile: Tile): BlockNode {
		const blockNode = super.addCoords(x, y, z, tile);
		const cableData = CableRegistry.getCableData(tile.id);
		if (cableData && cableData.insulation < cableData.maxInsulation) {
			blockNode.extraData.maxSafetyVoltage = cableData.maxSafetyVoltage;
			this.resetDamageArea();
		}
		return blockNode;
	}

	removeCoords(x: number, y: number, z: number): BlockNode {
		const blockNode = super.removeCoords(x, y, z);
		if (blockNode) {
			this.resetDamageArea();
		}
		return blockNode;
	}

	onOverload(packetSize: number): void {
		if (IC2Config.voltageEnabled) {
			const region = new WorldRegion(this.region);
			this.blockNodes.forEachNode(blockNode => {
				const coords = { x: blockNode.x, y: blockNode.y, z: blockNode.z };
				region.setBlock(coords, 0, 0);
				region.sendPacketInRadius(coords, 64, "ic2.cableBurnParticles", coords);
			});
			this.destroy();
		}
	}

	addBurnParticles(x: number, y: number, z: number): void {
		for (let i = 0; i < 32; i++) {
			const px = x + Math.random();
			const pz = z + Math.random();
			const py = y + Math.random();
			Particles.addParticle(ParticleType.smoke, px, py, pz, 0, 0.01, 0);
		}
	}

	canConductEnergy(coord1: Vector, coord2: Vector, side: number): boolean {
		const block1 = this.region.getBlock(coord1.x, coord1.y, coord1.z);
		const block2 = this.region.getBlock(coord2.x, coord2.y, coord2.z);
		if (!CableRegistry.canBePainted(block2.id) || block1.data == 0 || block2.data == 0 || block2.data == block1.data) {
			return true;
		}
		return false;
	}

	tick(): void {
		super.tick();
		if (IC2Config.voltageEnabled && this.damageEnabled && this.energyPower > 0) {
			this.dealElectrocuteDamage(this.energyPower);
		}
	}

	private dealElectrocuteDamage(voltage: number): void {
		const damageArea = this.getOrCreateDamageArea();
		if (damageArea.isEmpty() || voltage <= damageArea.maxSafetyVoltage) return;

		const threadTime = World.getThreadTime();
		const chunks = damageArea.getChunkBatch(threadTime);
		const damage = Math.ceil(voltage / 32);
		const affectedEntities: {[key: number]: boolean} = {};
		for (let chunk of chunks) {
			if (voltage <= chunk.maxSafetyVoltage) continue;

			const entities = this.region.listEntitiesInAABB(chunk.minX - 1, chunk.minY - 1, chunk.minZ - 1, chunk.maxX + 2, chunk.maxY + 2, chunk.maxZ + 2);
			for (let ent of entities) {
				if (affectedEntities[ent] || !EntityHelper.canTakeDamage(ent, DamageSource.electricity)) {
					continue;
				}

				const pos = Entity.getPosition(ent);
				if (EntityHelper.isPlayer(ent)) pos.y -= 1.62;

				for (let blockNode of chunk.nodes) {
					if (voltage <= blockNode.extraData.maxSafetyVoltage) continue;

					const cx = blockNode.x + .5, cy = blockNode.y + .5, cz = blockNode.z + .5;
					if (Math.abs(pos.x - cx) <= 1.5 && Math.abs(pos.y - cy) <= 1.5 && Math.abs(pos.z - cz) <= 1.5) {
						affectedEntities[ent] = true;
						if (damage > 16) Entity.setFire(ent, 20, true);
						Entity.damageEntity(ent, damage);
						break;
					}
				}
			}
		}
	}

	private getOrCreateDamageArea(): CableDamageArea {
		if (!this.damageArea) {
			this.damageArea = new CableDamageArea(this.blockNodes.data);
		}
		return this.damageArea;
	}

	private resetDamageArea(): void {
		this.damageArea = null;
	}
}

Network.addClientPacket("ic2.cableBurnParticles", function(data: {x: number, y: number, z: number}) {
	for (let i = 0; i < 32; i++) {
		const px = data.x + Math.random();
		const pz = data.z + Math.random();
		const py = data.y + Math.random();
		Particles.addParticle(ParticleType.smoke2, px, py, pz, 0, 0.01, 0);
	}
});
