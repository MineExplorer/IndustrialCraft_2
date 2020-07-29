IDRegistry.genBlockID("rubberTreeLeaves");
Block.createBlock("rubberTreeLeaves", [
    { name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: false },
    { name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: false },
    { name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: true }
], {
    destroytime: 0.2,
    explosionres: 1,
    renderallfaces: true,
    renderlayer: 1,
    lightopacity: 1,
    translucency: 0.5,
    sound: "grass"
});
Block.registerDropFunction("rubberTreeLeaves", function (coords, blockID, blockData, level, enchant) {
    if (level > 0 || Player.getCarriedItem().id == 359) {
        return [[blockID, 1, 2]];
    }
    if (Math.random() < .04) {
        return [[BlockID.rubberTreeSapling, 1, 0]];
    }
    return [];
});
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLeaves, "plant");
function checkLeaves(x, y, z, explored) {
    var blockID = World.getBlockID(x, y, z);
    if (blockID == BlockID.rubberTreeLog || blockID == BlockID.rubberTreeLogLatex) {
        return true;
    }
    if (blockID == BlockID.rubberTreeLeaves) {
        explored[x + ':' + y + ':' + z] = true;
    }
    return false;
}
function checkLeavesFor6Sides(x, y, z, explored) {
    return checkLeaves(x - 1, y, z, explored) ||
        checkLeaves(x + 1, y, z, explored) ||
        checkLeaves(x, y, z - 1, explored) ||
        checkLeaves(x, y, z + 1, explored) ||
        checkLeaves(x, y - 1, z, explored) ||
        checkLeaves(x, y + 1, z, explored);
}
function updateLeaves(x, y, z) {
    for (var xx = x - 1; xx <= x + 1; xx++) {
        for (var yy = y - 1; yy <= y + 1; yy++) {
            for (var zz = z - 1; zz <= z + 1; zz++) {
                var block = World.getBlock(xx, yy, zz);
                if (block.id == BlockID.rubberTreeLeaves && block.data == 0) {
                    World.setBlock(xx, yy, zz, BlockID.rubberTreeLeaves, 1);
                }
            }
        }
    }
}
Block.setRandomTickCallback(BlockID.rubberTreeLeaves, function (x, y, z, id, data) {
    if (data == 1) {
        var explored = {};
        explored[x + ':' + y + ':' + z] = true;
        for (var i_1 = 0; i_1 < 4; i_1++) {
            var checkingLeaves = explored;
            explored = {};
            for (var coords in checkingLeaves) {
                var c = coords.split(':');
                if (checkLeavesFor6Sides(parseInt(c[0]), parseInt(c[1]), parseInt(c[2]), explored)) {
                    World.setBlock(x, y, z, BlockID.rubberTreeLeaves, 0);
                    return;
                }
            }
        }
        World.setBlock(x, y, z, 0);
        updateLeaves(x, y, z);
        var dropFunc = Block.dropFunctions[id];
        var drop = dropFunc(null, id, data, 0, {});
        for (var i_2 in drop) {
            World.drop(x, y, z, drop[i_2][0], drop[i_2][1], drop[i_2][2]);
        }
    }
});
Callback.addCallback("DestroyBlock", function (coords, block, player) {
    updateLeaves(coords.x, coords.y, coords.z);
});
