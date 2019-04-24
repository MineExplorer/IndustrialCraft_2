Block.createSpecialType({
	destroytime: 2,
	explosionres: 0.5,
	opaque: false,
	lightopacity: 0,
	renderlayer: 3,
	lightlevel: 15
}, "light");

IDRegistry.genBlockID("luminator");
Block.createBlock("luminator", [
	{name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false},
	{name: "Luminator", texture: [["luminator", 0]], inCreative: true},
	{name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false},
	{name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false},
	{name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false},
	{name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false}
], "part");

Block.setBlockShape(BlockID.luminator, {x: 0, y: 15/16, z: 0}, {x: 1, y: 1, z: 1}, 0);
Block.setBlockShape(BlockID.luminator, {x: 0, y: 0, z: 0}, {x: 1, y: 1/16, z: 1}, 1);
Block.setBlockShape(BlockID.luminator, {x: 0, y: 0, z: 15/16}, {x: 1, y: 1, z: 1}, 2);
Block.setBlockShape(BlockID.luminator, {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1/16}, 3);
Block.setBlockShape(BlockID.luminator, {x: 15/16, y: 0, z: 0}, {x: 1, y: 1, z: 1}, 4);
Block.setBlockShape(BlockID.luminator, {x: 0, y: 0, z: 0}, {x: 1/16, y: 1, z: 1}, 5);

Block.registerDropFunction("luminator", function(coords, blockID, blockData, level, enchant){
	return [[blockID, 1, 1]];
});


IDRegistry.genBlockID("luminator_on");
Block.createBlock("luminator_on", [
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false},
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false},
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false},
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false},
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false},
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false}
], "light");

Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 15/16, z: 0}, {x: 1, y: 1, z: 1}, 0);
Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 0, z: 0}, {x: 1, y: 1/16, z: 1}, 1);
Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 0, z: 15/16}, {x: 1, y: 1, z: 1}, 2);
Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1/16}, 3);
Block.setBlockShape(BlockID.luminator_on, {x: 15/16, y: 0, z: 0}, {x: 1, y: 1, z: 1}, 4);
Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 0, z: 0}, {x: 1/16, y: 1, z: 1}, 5);

Block.registerDropFunction("luminator_on", function(coords, blockID, blockData, level, enchant){
	return [[BlockID.luminator, 1, 1]];
});


Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.luminator, count: 8, data: 1}, [
		"cxc",
		"aba",
		"aaa",
	], ['a', 20, 0, 'x', ItemID.cableCopper1, 0, 'b', ItemID.cableTin0, 0, 'c', ItemID.casingIron, 0]);
});



MachineRegistry.registerElectricMachine(BlockID.luminator, {
	defaultValues: {
		isActive: false
	},
	
	getEnergyStorage: function(){
		return 100;
	},
	
	click: function(id, count, data, coords){
		this.data.isActive = true;
		return true;
	},
	
	tick: function(type, src){
		if(this.data.isActive && this.data.energy >= 0.25){
			var x = this.x, y = this.y, z = this.z;
			var blockData = World.getBlock(x, y, z).data;
			var data = this.data;
			this.selfDestroy();
			World.setBlock(x, y, z, BlockID.luminator_on, blockData);
			var tile = World.addTileEntity(x, y, z);
			tile.data = data;
		}
	},
	
	energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

MachineRegistry.registerElectricMachine(BlockID.luminator_on, {
	defaultValues: {
		isActive: true
	},
	
	getEnergyStorage: function(){
		return 100;
	},
	
	disable: function(){
		var x = this.x, y = this.y, z = this.z;
		var blockData = World.getBlock(x, y, z).data;
		var data = this.data;
		this.selfDestroy();
		World.setBlock(x, y, z, BlockID.luminator, blockData);
		tile = World.addTileEntity(x, y, z);
		tile.data = data;
	},
	
	click: function(id, count, data, coords){
		this.data.isActive = false;
		this.disable();
		return true;
	},
	
	tick: function(type, src){
		if(this.data.energy < 0.25){
			this.disable();
		}else{
			this.data.energy -= 0.25;
		}
	},
	
	energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

Block.registerPlaceFunction("luminator", function(coords, item, block){
	Game.prevent();
	var x = coords.relative.x
	var y = coords.relative.y
	var z = coords.relative.z
	block = World.getBlockID(x, y, z)
	if(GenerationUtils.isTransparentBlock(block)){
		World.setBlock(x, y, z, item.id, coords.side);
		World.addTileEntity(x, y, z);
	}
});