class EUCableGrid extends EnergyGrid {
	onOverload(voltage: number): void {
		if (ConfigIC.voltageEnabled) {
			for (let key in this.blocksMap) {
				let coords = key.split(':');
				// @ts-ignore
				let x = Math.floor(coords[0]), y = Math.floor(coords[1]), z = Math.floor(coords[2]);
				World.setBlock(x, y, z, 0, 0);
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
		let block2 = World.getBlock(coord2.x, coord2.y, coord2.z);
		if (!CableRegistry.canBePainted(block2.id) || block2.data == 0 || block2.data == block1.data) {
			return true;
		}
		return false;
	}
}