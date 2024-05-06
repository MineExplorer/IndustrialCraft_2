BlockRegistry.createBlock("nuke", [
	{name: "Nuke", texture: [["nuke_bottom", 0], ["nuke_top", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0]], inCreative: true},
	{name: "Nuke", texture: [["nuke_bottom_active", 0], ["nuke_top_active", 0], ["nuke_sides_active", 0], ["nuke_sides_active", 0], ["nuke_sides_active", 0], ["nuke_sides_active", 0]], inCreative: false},
], "machine");
BlockRegistry.setBlockMaterial(BlockID.nuke, "stone", 1);
ItemRegistry.setRarity(BlockID.nuke, EnumRarity.UNCOMMON);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.nuke, count: 1, data: 0}, [
		"ncn",
		"x#x",
		"ncn"
	], ['#', 46, -1, 'x', ItemID.uranium235, 0, 'c', ItemID.circuitAdvanced, 0, 'n', ItemID.neutronReflectorThick, 0]);

	Recipes.addShaped({id: BlockID.nuke, count: 1, data: 0}, [
		"ncn",
		"x#x",
		"ncn"
	], ['#', 46, -1, 'x', ItemID.plutonium, 0, 'c', ItemID.circuitAdvanced, 0, 'n', ItemID.neutronReflectorThick, 0]);
});

namespace Machine {
	class Nuke extends TileEntityBase {
		defaultValues = {
			activated: false,
			timer: 300
		}

		getScreenName(): string {
			return null;
		}

		explode(radius: number): void {
			SoundManager.playSound("NukeExplosion.ogg");
			const damageRad = radius * 1.5;
			const epicenter = new Vector3(this.x + .5, this.y + .5, this.z + .5);
			const entities = EntityHelper.getEntitiesInRadius(this.region, epicenter, damageRad);
			for (let ent of entities) {
				const dist = Entity.getDistanceBetweenCoords(epicenter, Entity.getPosition(ent))
				const damage = Math.ceil(damageRad*damageRad * 25 / (dist*dist));
				if (damage >= 100) {
					Entity.damageEntity(ent, damage);
				} else {
					Entity.damageEntity(ent, damage, 11);
				}
			}

			const height = radius/2;
			for (let dx = -radius; dx <= radius; dx++)
			for (let dy = -height; dy <= height; dy++)
			for (let dz = -radius; dz <= radius; dz++) {
				if (Math.sqrt(dx*dx + dy*dy*4 + dz*dz) <= radius) {
					const xx = this.x + dx, yy = this.y + dy, zz = this.z + dz;
					const block = this.blockSource.getBlock(xx, yy, zz);
					if (block.id > 0 && Block.getExplosionResistance(block.id) < 10000) {
						if (Math.random() < 0.01) {
							const drop = this.blockSource.breakBlockForJsResult(xx, yy, zz, -1, new ItemStack());
							for (let item of drop.items) {
								this.blockSource.spawnDroppedItem(xx + .5, yy + .5, zz + .5, item.id, item.count, item.data, item.extra || null);
							}
						} else {
							this.blockSource.setBlock(xx, yy, zz, 0, 0);
						}
					}
				}
			}

			RadiationAPI.addRadiationSource(epicenter.x, epicenter.y, epicenter.z, this.dimension, radius * 2, 300);
			this.sendPacket("explodeAnimation", {rad: radius});
		}

		onTick(): void {
			if (this.data.activated) {
				if (this.data.timer <= 0) {
					this.explode(20);
					this.selfDestroy();
					return;
				}
				this.data.timer--;
			}
		}

		onRedstoneUpdate(signal: number): void {
			if (signal > 0) {
				this.data.activated = true;
				this.region.setBlock(this, this.blockID, 1);
			}
		}
		
		@NetworkEvent(Side.Client)
		explodeAnimation(data: {rad: number}) {
			const radius = data.rad;
			const count = radius * radius * radius / 200;
			for (let i = 0; i < count; i++) {
				const dx = MathUtil.randomInt(-radius, radius);
				const dy = MathUtil.randomInt(-radius/2, radius/2);
				const dz = MathUtil.randomInt(-radius, radius);
				if (Math.sqrt(dx*dx + dy*dy*4 + dz*dz) <= radius) {
					Particles.addParticle(ParticleType.hugeexplosionSeed, this.x + dx, this.y + dy, this.z + dz, 0, 0, 0);
				}
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.nuke, new Nuke());
}