class EUCableGrid extends EnergyGrid {
	maxSafetyVoltage?: number;
	cubeArea = { minX: 1e9, minY: 1e9, minZ: 1e9, maxX: -1e9, maxY: -1e9, maxZ: -1e9 };

	constructor(energyType: EnergyType, maxValue: number, blockID: number, region: BlockSource) {
		super(energyType, maxValue, blockID, region);
		const cableData = CableRegistry.getCableData(blockID);
		if (cableData && cableData.insulation < cableData.maxInsulation) {
			this.maxSafetyVoltage = CableRegistry.maxSafetyVoltage[cableData.insulation];
		}
	}

	mergeGrid(grid: EUCableGrid): EUCableGrid {
		super.mergeGrid(grid);
		this.recalculateCubeArea();
		return this;
	}

	addCoords(x: number, y: number, z: number, tile: Tile): BlockNode {
		const blockNode = super.addCoords(x, y, z, tile);
		this.cubeArea = null;
		return blockNode;
	}

	removeCoords(x: number, y: number, z: number): BlockNode {
		const blockNode = super.removeCoords(x, y, z);
		if (blockNode) {
			this.cubeArea = null;
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

	dealElectrocuteDamage(damage: number): void {
		if (!this.cubeArea) {
			this.recalculateCubeArea();
		}
		const { minX, minY, minZ, maxX, maxY, maxZ } = this.cubeArea;
		const entities = this.region.listEntitiesInAABB(minX - 1, minY - 1, minZ - 1, maxX + 2, maxY + 2, maxZ + 2);
		if (entities.length == 0) return;

		for (let ent of entities) {
			if (!EntityHelper.canTakeDamage(ent, DamageSource.electricity)) {
				continue;
			}
			const pos = Entity.getPosition(ent);
			if (EntityHelper.isPlayer(ent)) pos.y -= 1.62;
			for (const key in this.blockNodes.data) {
				const blockNode = this.blockNodes.data[key];
				const cx = blockNode.x + .5, cy = blockNode.y + .5, cz = blockNode.z + .5;
				if (Math.abs(pos.x - cx) <= 1.5 && Math.abs(pos.y - cy) <= 1.5 && Math.abs(pos.z - cz) <= 1.5) {
					if (damage > 16) Entity.setFire(ent, 20, true);
					Entity.damageEntity(ent, damage);
					break;
				}
			}
		}
	}

	tick(): void {
		super.tick();
		if (IC2Config.voltageEnabled && this.energyPower > this.maxSafetyVoltage && World.getThreadTime()%20 == 0) {
			const damage = Math.ceil(this.energyPower / 32);
			this.dealElectrocuteDamage(damage);
		}
	}

	private recalculateCubeArea(): void {
		this.cubeArea = { minX: 1e9, minY: 1e9, minZ: 1e9, maxX: -1e9, maxY: -1e9, maxZ: -1e9 };
		this.blockNodes.forEachNode(blockNode => {
			const { x, y, z } = blockNode;
			if (x < this.cubeArea.minX) this.cubeArea.minX = x;
			if (y < this.cubeArea.minY) this.cubeArea.minY = y;
			if (z < this.cubeArea.minZ) this.cubeArea.minZ = z;
			if (x > this.cubeArea.maxX) this.cubeArea.maxX = x;
			if (y > this.cubeArea.maxY) this.cubeArea.maxY = y;
			if (z > this.cubeArea.maxZ) this.cubeArea.maxZ = z;
		});
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
