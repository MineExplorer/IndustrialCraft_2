class EUCableGrid extends EnergyGrid {
	maxSafetyVoltage?: number;

	constructor(energyType: EnergyType, maxValue: number, blockID: number, region: BlockSource) {
		super(energyType, maxValue, blockID, region);
		let cableData = CableRegistry.getCableData(blockID);
		if (cableData) {
			this.maxSafetyVoltage = maxSafetyVoltage[cableData.insulation];
		}
	}
	onOverload(voltage: number): void {
		if (IC2Config.voltageEnabled) {
			for (let key in this.blocksMap) {
				let coords = key.split(':');
				let x = parseInt(coords[0]), y = parseInt(coords[1]), z = parseInt(coords[2]);
				this.region.setBlock(x, y, z, 0, 0);
				this.addBurnParticles(x, y, z);
			}
			this.destroy();
		}
	}

	addBurnParticles(x: number, y: number, z: number): void {
		for (let i = 0; i < 32; i++) {
			let px = x + Math.random();
			let pz = z + Math.random();
			let py = y + Math.random();
			Particles.addParticle(ParticleType.smoke, px, py, pz, 0, 0.01, 0);
		}
	}

	canConductEnergy(coord1: Vector, coord2: Vector, side: number): boolean {
		let block1 = this.region.getBlock(coord1.x, coord1.y, coord1.z);
		let block2 = this.region.getBlock(coord2.x, coord2.y, coord2.z);
		if (!CableRegistry.canBePainted(block2.id) || block1.data == 0 || block2.data == 0 || block2.data == block1.data) {
			return true;
		}
		return false;
	}

	dealElectrocuteDamage(damage: number): void {
		let minX = 2e9, minY = 256, minZ = 2e9, maxX = -2e9, maxY = 0, maxZ = -2e9;
		for (let key in this.blocksMap) {
			let keyArr = key.split(":");
			let x = parseInt(keyArr[0]), y = parseInt(keyArr[1]), z = parseInt(keyArr[2]);
			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (z < minZ) minZ = z;
			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;
			if (z > maxZ) maxZ = z;
		}
		let region = new WorldRegion(this.region);
		let entities = region.listEntitiesInAABB(minX - 1, minY - 1, minZ - 1, maxX + 2, maxY + 2, maxZ + 2);
		for (let ent of entities) {
			if (!EntityHelper.canTakeDamage(ent, DamageSource.electricity)) continue;
			let pos = Entity.getPosition(ent);
			if (EntityHelper.isPlayer(ent)) pos.y -= 1.62;
			for (let key in this.blocksMap) {
				let keyArr = key.split(":");
				let x = parseInt(keyArr[0]) + .5, y = parseInt(keyArr[1]) + .5, z = parseInt(keyArr[2]) + .5;
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
				let damage = Math.ceil(this.energyPower / 32);
				this.dealElectrocuteDamage(damage);
			}
		}
	}
}

const maxSafetyVoltage = {
	0: 5,
	1: 128,
	2: 512
}