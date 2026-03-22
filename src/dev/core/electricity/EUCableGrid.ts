class EUCableGrid extends EnergyGrid {
	maxSafetyVoltage: number = -1;
	// TODO: rewrite to DamageArea class and divide area into chunks
	damageArea = { minX: 1e9, minY: 1e9, minZ: 1e9, maxX: -1e9, maxY: -1e9, maxZ: -1e9 };

	constructor(energyType: EnergyType, maxValue: number, blockID: number, region: BlockSource) {
		super(energyType, maxValue, blockID, region);
	}

	isValidWire(tile: Tile): boolean {
		if (super.isValidWire(tile)) return true;

		const cableData = CableRegistry.getCableData(this.blockID);
		const otherData = CableRegistry.getCableData(tile.id);
		return cableData && otherData && cableData.name == otherData.name;
	}

	mergeGrid(grid: EUCableGrid): EUCableGrid {
		super.mergeGrid(grid);
		this.damageArea = null;
		return this;
	}

	addCoords(x: number, y: number, z: number, tile: Tile): BlockNode {
		const blockNode = super.addCoords(x, y, z, tile);
		const cableData = CableRegistry.getCableData(tile.id);
		if (cableData && cableData.insulation < cableData.maxInsulation) {
			blockNode.extraData.maxSafetyVoltage = cableData.maxSafetyVoltage;
			this.damageArea = null;
			this.maxSafetyVoltage = this.maxSafetyVoltage > 0 ?
				Math.min(this.maxSafetyVoltage, cableData.maxSafetyVoltage) : cableData.maxSafetyVoltage;
		}
		return blockNode;
	}

	checkAndRebuild(): void {
		super.checkAndRebuild();
		if (this.removed) return;

		this.damageArea = null;
		this.maxSafetyVoltage = -1;
		this.blockNodes.forEachNode(blockNode => {
			const cableMaxSafetyVoltage = blockNode.extraData.maxSafetyVoltage;
			if (cableMaxSafetyVoltage) {
				this.maxSafetyVoltage = this.maxSafetyVoltage > 0 ?
					Math.min(this.maxSafetyVoltage, cableMaxSafetyVoltage) : cableMaxSafetyVoltage;
			}
		});
		if (this.maxSafetyVoltage > 0) {
			this.recalculateDamageArea();
		}
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

	dealElectrocuteDamage(voltage: number): void {
		if (!this.damageArea) {
			this.recalculateDamageArea();
		}

		const { minX, minY, minZ, maxX, maxY, maxZ } = this.damageArea;
		const entities = this.region.listEntitiesInAABB(minX - 1, minY - 1, minZ - 1, maxX + 2, maxY + 2, maxZ + 2);
		if (entities.length == 0) return;

		const damage = Math.ceil(voltage / 32);
		for (let ent of entities) {
			if (!EntityHelper.canTakeDamage(ent, DamageSource.electricity)) {
				continue;
			}
			const pos = Entity.getPosition(ent);
			if (EntityHelper.isPlayer(ent)) pos.y -= 1.62;
			for (const key in this.blockNodes.data) {
				const blockNode = this.blockNodes.data[key];
				if (!blockNode.extraData.maxSafetyVoltage || voltage <= blockNode.extraData.maxSafetyVoltage) continue;
				
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
		// TODO: use new DamageArea class and execute checks for different chunks on different ticks
		if (IC2Config.voltageEnabled && this.maxSafetyVoltage > 0 && this.energyPower > this.maxSafetyVoltage && World.getThreadTime() % 20 == 0) {
			this.dealElectrocuteDamage(this.energyPower);
		}
	}

	private recalculateDamageArea(): void {
		this.damageArea = { minX: 1e9, minY: 1e9, minZ: 1e9, maxX: -1e9, maxY: -1e9, maxZ: -1e9 };
		this.blockNodes.forEachNode(blockNode => {
			const { x, y, z } = blockNode;
			if (x < this.damageArea.minX) this.damageArea.minX = x;
			if (y < this.damageArea.minY) this.damageArea.minY = y;
			if (z < this.damageArea.minZ) this.damageArea.minZ = z;
			if (x > this.damageArea.maxX) this.damageArea.maxX = x;
			if (y > this.damageArea.maxY) this.damageArea.maxY = y;
			if (z > this.damageArea.maxZ) this.damageArea.maxZ = z;
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
