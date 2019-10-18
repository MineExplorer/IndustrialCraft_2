IDRegistry.genItemID("electricHoe");
IDRegistry.genItemID("electricTreetap");
Item.createItem("electricHoe", "Electric Hoe", {name: "electric_hoe", meta: 0}, {stack: 1, isTech: true});
Item.createItem("electricTreetap", "Electric Treetap", {name: "electric_treetap", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerItem(ItemID.electricHoe, "Eu", 10000, 1, "tool", true);
ChargeItemRegistry.registerItem(ItemID.electricTreetap, "Eu", 10000, 1, "tool", true);
Item.setToolRender(ItemID.electricHoe, true);

Item.registerNameOverrideFunction(ItemID.electricHoe, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.electricTreetap, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.electricHoe, count: 1, data: Item.getMaxDamage(ItemID.electricHoe)}, [
	"pp",
	" p",
	" x"
], ['x', ItemID.powerUnitSmall, 0, 'p', ItemID.plateIron, 0]);

Recipes.addShapeless({id: ItemID.electricTreetap, count: 1, data: Item.getMaxDamage(ItemID.electricTreetap)}, [{id: ItemID.powerUnitSmall, data: 0}, {id: ItemID.treetap, data: 0}]);

Item.registerUseFunction("electricHoe", function(coords, item, block){
	if((block.id==2 || block.id==3 || block.id==110 || block.id==243) && coords.side==1 && ICTool.useElectricItem(item, 50)){ 
		World.setBlock(coords.x, coords.y, coords.z, 60);
		World.playSoundAtEntity(Player.get(), "step.grass", 0.5, 0.75);
	}
});

Item.registerUseFunction("electricTreetap", function(coords, item, block){
	if(block.id == BlockID.rubberTreeLogLatex && block.data - 2 == coords.side && ICTool.useElectricItem(item, 50)){
		World.setBlock(coords.x, coords.y, coords.z, BlockID.rubberTreeLogLatex, block.data - 4);
		Entity.setVelocity(
			World.drop(
				coords.relative.x + 0.5,
				coords.relative.y + 0.5,
				coords.relative.z + 0.5,
				ItemID.latex, 1 + parseInt(Math.random() * 3), 0
			),
			(coords.relative.x - coords.x) * 0.25,
			(coords.relative.y - coords.y) * 0.25,
			(coords.relative.z - coords.z) * 0.25
		);
	}
});
