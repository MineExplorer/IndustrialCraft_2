class LaserShot {
	entity: number;
	region: WorldRegion;
	player: number;
	startPos: Vector;
	velocity: Vector;
	power: number;
	range: number;
	blockBreaks: number;
	smelt: boolean;
	dropChance: number;
	hitBlock: boolean;

	constructor(player: number, pos: Vector, vel: Vector, params: {power: number, range?: number, blockBreaks?: number, smelt?: boolean, dropChance?: number}) {
		const region = WorldRegion.getForActor(player);
		const entity = region.spawnEntity(pos.x + vel.x, pos.y + vel.y, pos.z + vel.z, EntityType.ARROW);
		Entity.setSkin(entity, "models/laser.png");
		Entity.setVelocity(entity, vel.x, vel.y, vel.z);
		this.player = player;
		this.entity = entity;
		this.region = region;
		this.startPos = pos;
		this.velocity = vel;
		this.power = params.power;
		this.range = params.range ?? 64;
		this.blockBreaks = params.blockBreaks ?? 128;
		this.smelt = params.smelt ?? false;
		this.dropChance = params.dropChance ?? 0.9;
		this.hitBlock = true;
	}

	destroyBlock(x: number, y: number, z: number, block: Tile): void {
		const hardness = Block.getDestroyTime(block.id);
		this.power -= hardness / 1.5;
		if (this.power < 0) return;
        if (hardness > 0) {
        	this.blockBreaks--;
       	}
		const drop = this.region.breakBlockForResult(x, y, z, -1, new ItemStack(ItemID.iridiumDrill, 1, 0)).items;
       	const material = ToolAPI.getBlockMaterialName(block.id);
		if (Math.random() < 0.5 && (material == "wood" || material == "plant" || material == "fibre" || material == "wool")) {
			this.region.setBlock(x, y, z, 51, 0);
		}
		for (let item of drop) {
			if (this.smelt && material == "stone") {
				this.power = 0;
				const result = Recipes.getFurnaceRecipeResult(item.id, item.data);
				if (result) {
					item.id = result.id;
					item.data = result.data;
				}
				this.region.dropAtBlock(x, y, z, item);
			}
			else if (Math.random() < this.dropChance) {
				this.region.dropAtBlock(x, y, z, item);
			}
		}
	}

	checkBlock(x: number, y: number, z: number): void {
		const block = World.getBlock(x, y, z);
		if (ToolAPI.getBlockMaterialName(block.id) == "unbreaking") {
			this.power = 0;
		}
		else if (block.id > 0 && block.id != 50 && block.id != 51) {
			this.destroyBlock(x, y, z, block);
		}
	}

	onProjectileHit(target: any): void {
		if (this.power <= 0 || this.blockBreaks <= 0) {
			LaserShotProvider.removeShot(this);
		}
		if (target.coords) {
			Game.prevent();
			const c = target.coords;
			const block = World.getBlock(c.x, c.y, c.z);
			if (block.id != 7 && block.id != 120) {
				this.destroyBlock(c.x, c.y, c.z, block);
				this.hitBlock = true;
				const vel = this.velocity;
				Entity.setVelocity(this.entity, vel.x, vel.y, vel.z);
			} else {
				LaserShotProvider.removeShot(this);
			}
		}
		else {
			if (target.entity == this.player) return;
			let damage = this.power;
			if (damage > 0) {
				if (this.smelt) damage *= 2;
				Entity.setFire(target.entity, 100, true);
				Entity.damageEntity(target.entity, damage, 3, {attacker: this.player});
			}
			LaserShotProvider.removeShot(this);
		}
	}
}
