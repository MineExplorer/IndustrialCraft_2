class EUCableGrid extends EnergyGrid {
	maxSafetyVoltage?: number;

	constructor(energyType: EnergyType, maxValue: number, blockID: number, region: BlockSource) {
		super(energyType, maxValue, blockID, region);
		const cableData = CableRegistry.getCableData(blockID);
		if (cableData) {
			this.maxSafetyVoltage = CableRegistry.maxSafetyVoltage[cableData.insulation];
		}
	}

	onOverload(voltage: number): void {
		if (IC2Config.voltageEnabled) {
			const region = new WorldRegion(this.region);
			for (let key in this.blocksMap) {
				const coords = this.getCoordsFromString(key);
				region.setBlock(coords, 0, 0);
				region.sendPacketInRadius(coords, 64, "ic2.cableBurnParticles", coords);
			}
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

	dealElectrocuteDamage(damage: number): void {
		let minX = 2e9, minY = 256, minZ = 2e9, maxX = -2e9, maxY = 0, maxZ = -2e9;
		for (let key in this.blocksMap) {
			const {x, y, z} = this.getCoordsFromString(key);
			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (z < minZ) minZ = z;
			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;
			if (z > maxZ) maxZ = z;
		}
		const region = new WorldRegion(this.region);
		const entities = region.listEntitiesInAABB(minX - 1, minY - 1, minZ - 1, maxX + 2, maxY + 2, maxZ + 2);
		for (let ent of entities) {
			if (!EntityHelper.canTakeDamage(ent, DamageSource.electricity)) continue;
			const pos = Entity.getPosition(ent);
			if (EntityHelper.isPlayer(ent)) pos.y -= 1.62;
			for (let key in this.blocksMap) {
				const keyArr = key.split(":");
				const x = parseInt(keyArr[0]) + .5, y = parseInt(keyArr[1]) + .5, z = parseInt(keyArr[2]) + .5;
				if (Math.abs(pos.x - x) <= 1.5 && Math.abs(pos.y - y) <= 1.5 && Math.abs(pos.z - z) <= 1.5) {
					Entity.damageEntity(ent, damage);
					break;
				}
			}
		}
	}

	tick(): void {
		super.tick();
		if (IC2Config.voltageEnabled && this.maxSafetyVoltage && World.getThreadTime()%20 == 0) {
			if (this.energyPower > this.maxSafetyVoltage) {
				const damage = Math.ceil(this.energyPower / 32);
				this.dealElectrocuteDamage(damage);
			}
		}
	}

	getCoordsFromString(coordKey: string): Vector {
		const coordArray = coordKey.split(':').map((c) => parseInt(c));
		return {x: coordArray[0], y: coordArray[1], z: coordArray[2]};
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
