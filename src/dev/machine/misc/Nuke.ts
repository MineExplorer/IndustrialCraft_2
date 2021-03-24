IDRegistry.genBlockID("nuke");
Block.createBlock("nuke", [
	{name: "Nuke", texture: [["nuke_bottom", 0], ["nuke_top", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.nuke, "stone", 1, true);
ItemRegistry.setRarity(BlockID.nuke, EnumRarity.UNCOMMON);

TileRenderer.setStandardModel(BlockID.nuke, 0, [["nuke_bottom", 0], ["nuke_top", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0]]);
TileRenderer.registerRenderModel(BlockID.nuke, 0, [["tnt_active", 0]]);

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
			let entities = Entity.getAll();
			let damageRad = radius * 1.5;
			for (let i in entities) {
				let ent = entities[i];
				let dist = Entity.getDistanceBetweenCoords(this, Entity.getPosition(ent))
				if (dist <= damageRad) {
					let damage = Math.ceil(damageRad*damageRad * 25 / (dist*dist));
					if (damage >= 100) {
						Entity.damageEntity(ent, damage);
					} else {
						Entity.damageEntity(ent, damage, 11);
					}
				}
			}

			let height = radius/2;
			for (let dx = -radius; dx <= radius; dx++)
			for (let dy = -height; dy <= height; dy++)
			for (let dz = -radius; dz <= radius; dz++) {
				if (Math.sqrt(dx*dx + dy*dy*4 + dz*dz) <= radius) {
					let xx = this.x + dx, yy = this.y + dy, zz = this.z + dz;
					let block = this.blockSource.getBlock(xx, yy, zz);
					if (block.id > 0 && Block.getExplosionResistance(block.id) < 10000) {
						this.blockSource.setBlock(xx, yy, zz, 0, 0);
						if (Math.random() < 0.01) {
							let drop = ToolLib.getBlockDrop(new Vector3(xx, yy, zz), block.id, block.data, 100);
							if (drop)
							for (let i in drop) {
								let item = drop[i];
								this.blockSource.spawnDroppedItem(xx + .5, yy + .5, zz + .5, item[0], item[1], item[2], item[3] || null);
							}
						}
					}
				}
			}

			RadiationAPI.addRadiationSource(this.x + .5, this.y + .5, this.z + .5, this.dimension, radius * 2, 300);
			this.sendPacket("explodeAnimation", {rad: radius});
		}

		onTick(): void {
			if (this.data.activated) {
				if (this.data.timer <= 0) {
					this.explode(20);
					this.selfDestroy();
					return;
				}
				if (this.data.timer % 10 < 5) {
					this.sendPacket("renderLitModel", {lit: true});
				} else {
					this.sendPacket("renderLitModel", {lit: false});
				}
				this.data.timer--;
			}
		}

		onRedstoneUpdate(signal: number): void {
			if (signal > 0) {
				this.data.activated = true;
			}
		}

		destroy(): boolean {
			BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
			return false;
		}

		@NetworkEvent(Side.Client)
		explodeAnimation(data: {rad: number}) {
			let radius = data.rad;
			let count = radius * radius * radius / 25;
			for (let i = 0; i < count; i++) {
				let dx = randomInt(-radius, radius);
				let dy = randomInt(-radius/2, radius/2);
				let dz = randomInt(-radius, radius);
				if (Math.sqrt(dx*dx + dy*dy*4 + dz*dz) <= radius) {
					Particles.addParticle(ParticleType.hugeexplosionSeed, this.x + dx, this.y + dy, this.z + dz, 0, 0, 0);
				}
			}
		}

		@NetworkEvent(Side.Client)
		renderLitModel(data: {lit: boolean}) {
			if (data.lit) {
				TileRenderer.mapAtCoords(this.x, this.y, this.z, BlockID.nuke, 0);
			} else {
				BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.nuke, new Nuke());
}