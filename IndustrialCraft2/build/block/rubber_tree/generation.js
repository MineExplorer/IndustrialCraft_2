var RubberTreeGenerator = {
    biomeData: {},
    getBiomeChance: function (biomeID) {
        var chance = this.biomeData[biomeID] || 0;
        return chance / 100;
    },
    generateRubberTree: function (x, y, z, random) {
        if (!random)
            random = new java.util.Random(Debug.sysTime());
        var minHeight = 3, maxHeight = 8;
        var height = this.getGrowHeight(x, y, z, random.nextInt(maxHeight - minHeight + 1) + minHeight);
        if (height >= minHeight) {
            var treeholechance = 0.25;
            for (var ys = 0; ys < height; ys++) {
                if (random.nextDouble() < treeholechance) {
                    treeholechance -= 0.1;
                    World.setBlock(x, y + ys, z, BlockID.rubberTreeLogLatex, 4 + random.nextInt(4));
                }
                else {
                    World.setBlock(x, y + ys, z, BlockID.rubberTreeLog, 0);
                }
            }
            var leavesStart = parseInt(height / 2);
            var leavesEnd = height;
            for (var ys = leavesStart; ys <= leavesEnd; ys++) {
                for (var xs = -2; xs <= 2; xs++) {
                    for (var zs = -2; zs <= 2; zs++) {
                        var radius = 2.5 + random.nextDouble() * 0.5;
                        if (ys == leavesEnd)
                            radius /= 2;
                        if (Math.sqrt(xs * xs + zs * zs) <= radius) {
                            this.setLeaves(x + xs, y + ys, z + zs);
                        }
                    }
                }
            }
            var pikeHeight = 2 + parseInt(random.nextDouble() * 2);
            for (var ys = 1; ys <= pikeHeight; ys++) {
                this.setLeaves(x, y + ys + height, z);
            }
        }
    },
    getGrowHeight: function (x, y, z, max) {
        var height = 0;
        while (height < max + 2) {
            var blockID = World.getBlockID(x, y + height, z);
            if (blockID != 0)
                break;
            height++;
        }
        return height > 2 ? height - 2 : 0;
    },
    setLeaves: function (x, y, z, leaves) {
        var blockID = World.getBlockID(x, y, z);
        if (blockID == 0 || blockID == 106) {
            World.setBlock(x, y, z, BlockID.rubberTreeLeaves, 0);
        }
    }
};
var ForestBiomeIDs = [4, 18, 27, 28, 132, 155, 156];
var JungleBiomeIDs = [21, 22, 23, 149, 151];
var SwampBiomeIDs = [6, 134];
var chance = __config__.getNumber("rubber_tree_gen.plains");
RubberTreeGenerator.biomeData[1] = chance;
chance = __config__.getNumber("rubber_tree_gen.forest");
ForestBiomeIDs.forEach(function (id) {
    RubberTreeGenerator.biomeData[id] = chance;
});
chance = __config__.getNumber("rubber_tree_gen.jungle");
JungleBiomeIDs.forEach(function (id) {
    RubberTreeGenerator.biomeData[id] = chance;
});
chance = __config__.getNumber("rubber_tree_gen.swamp");
SwampBiomeIDs.forEach(function (id) {
    RubberTreeGenerator.biomeData[id] = chance;
});
World.addGenerationCallback("GenerateChunk", function (chunkX, chunkZ, random) {
    var biome = World.getBiome((chunkX + 0.5) * 16, (chunkZ + 0.5) * 16);
    if (random.nextDouble() < RubberTreeGenerator.getBiomeChance(biome)) {
        var treeCount = 1 + random.nextInt(6);
        for (var i = 0; i < treeCount; i++) {
            var coords = GenerationUtils.findSurface(chunkX * 16 + random.nextInt(16), 96, chunkZ * 16 + random.nextInt(16));
            if (World.getBlockID(coords.x, coords.y, coords.z) == 2) {
                RubberTreeGenerator.generateRubberTree(coords.x, coords.y + 1, coords.z, random);
            }
        }
    }
}, "rubber_tree");
