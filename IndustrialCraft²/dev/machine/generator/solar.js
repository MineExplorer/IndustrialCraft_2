IDRegistry.genBlockID("solarPanel");
Block.createBlock("solarPanel", [
	{name: "Solar Panel", texture: [["machine_bottom", 0], ["solar_panel", 0], ["machine", 0], ["machine", 0], ["machine", 0], ["machine", 0]], inCreative: true}
]);

Block.registerDropFunction("solarPanel", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.solarPanel, count: 1, data: 0}, [
		"aaa",
		"xxx",
		"b#b"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.dustCoal, 0, 'b', ItemID.circuitBasic, 0, 'a', 20, 0]);
});

MachineRegistry.registerPrototype(BlockID.solarPanel, {
	isGenerator: function() {
		return true;
	},

	energyTick: function(type, src){
		if(World.getLightLevel(this.x, this.y + 1, this.z) == 15){
			src.add(1);
		}
	}
});
