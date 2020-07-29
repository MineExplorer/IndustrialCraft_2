IDRegistry.genBlockID("nuke");
Block.createBlock("nuke", [
    { name: "Nuke", texture: [["nuke_bottom", 0], ["nuke_top", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0]], inCreative: true }
], "machine");
ItemName.setRarity(BlockID.nuke, 1, true);
TileRenderer.setStandartModel(BlockID.nuke, [["nuke_bottom", 0], ["nuke_top", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0]]);
TileRenderer.registerRenderModel(BlockID.nuke, 0, [["tnt_active", 0]]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.nuke, count: 1, data: 0 }, [
        "ncn",
        "x#x",
        "ncn"
    ], ['#', 46, -1, 'x', ItemID.uranium235, 0, 'c', ItemID.circuitAdvanced, 0, 'n', ItemID.neutronReflectorThick, 0]);
    Recipes.addShaped({ id: BlockID.nuke, count: 1, data: 0 }, [
        "ncn",
        "x#x",
        "ncn"
    ], ['#', 46, -1, 'x', ItemID.plutonium, 0, 'c', ItemID.circuitAdvanced, 0, 'n', ItemID.neutronReflectorThick, 0]);
});
MachineRegistry.registerPrototype(BlockID.nuke, {
    defaultValues: {
        activated: false,
        timer: 300
    },
    explode: function (radius) {
        SoundManager.playSound("NukeExplosion.ogg");
        var entities = Entity.getAll();
        var rad = radius * 1.5;
        for (var i_1 in entities) {
            var ent = entities[i_1];
            var dist = Entity.getDistanceBetweenCoords(this, Entity.getPosition(ent));
            if (dist <= rad) {
                var damage = Math.ceil(rad * rad * 25 / (dist * dist));
                if (damage >= 100) {
                    Entity.damageEntity(ent, damage);
                }
                else {
                    Entity.damageEntity(ent, damage, 11);
                }
            }
        }
        var height = radius / 2;
        for (var dx = -radius; dx <= radius; dx++)
            for (var dy = -height; dy <= height; dy++)
                for (var dz = -radius; dz <= radius; dz++) {
                    if (Math.sqrt(dx * dx + dy * dy * 4 + dz * dz) <= radius) {
                        var xx = this.x + dx, yy = this.y + dy, zz = this.z + dz;
                        var block = World.getBlock(xx, yy, zz);
                        if (block.id > 0 && Block.getExplosionResistance(block.id) < 10000) {
                            World.setBlock(xx, yy, zz, 0);
                            if (Math.random() < 0.01) {
                                var drop = ToolLib.getBlockDrop({ x: xx, y: yy, z: zz }, block.id, block.data, 100);
                                if (drop)
                                    for (var i_2 in drop) {
                                        var item = drop[i_2];
                                        World.drop(xx, yy, zz, item[0], item[1], item[2]);
                                    }
                            }
                        }
                        if (Math.random() < 0.001) {
                            Particles.addParticle(ParticleType.hugeexplosionSeed, xx, yy, zz, 0, 0, 0);
                        }
                    }
                }
        RadiationAPI.addRadiationSource(this.x + .5, this.y + .5, this.z + .5, radius * 2, 600);
    },
    tick: function () {
        if (this.data.activated) {
            if (this.data.timer <= 0) {
                this.explode(20);
                this.selfDestroy();
                return;
            }
            if (this.data.timer % 10 < 5) {
                TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, 0);
            }
            else {
                BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
            }
            this.data.timer--;
        }
    },
    redstone: function (signal) {
        if (signal.power > 0) {
            this.data.activated = true;
        }
    },
    destroy: function () {
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
    }
});
