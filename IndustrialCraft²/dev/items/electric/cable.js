IDRegistry.genItemID("cableTin0");
IDRegistry.genItemID("cableTin1");
Item.createItem("cableTin0", "Tin Cable", {name: "cable_tin", meta: 0});
Item.createItem("cableTin1", "Insulated Tin Cable", {name: "cable_tin", meta: 1});

IDRegistry.genItemID("cableCopper0");
IDRegistry.genItemID("cableCopper1");
Item.createItem("cableCopper0", "Copper Cable", {name: "cable_copper", meta: 0});
Item.createItem("cableCopper1", "Insulated Copper Cable", {name: "cable_copper", meta: 1});

IDRegistry.genItemID("cableGold0");
IDRegistry.genItemID("cableGold1");
IDRegistry.genItemID("cableGold2");
Item.createItem("cableGold0", "Gold Cable", {name: "cable_gold", meta: 0});
Item.createItem("cableGold1", "Insulated Gold Cable", {name: "cable_gold", meta: 1});
Item.createItem("cableGold2", "2x Ins. Gold Cable", {name: "cable_gold", meta: 2});

IDRegistry.genItemID("cableIron0");
IDRegistry.genItemID("cableIron1");
IDRegistry.genItemID("cableIron2");
IDRegistry.genItemID("cableIron3");
Item.createItem("cableIron0", "HV Cable", {name: "cable_iron", meta: 0});
Item.createItem("cableIron1", "Insulated HV Cable", {name: "cable_iron", meta: 1});
Item.createItem("cableIron2", "2x Ins. HV Cable", {name: "cable_iron", meta: 2});
Item.createItem("cableIron3", "3x Ins. HV Cable", {name: "cable_iron", meta: 3});

IDRegistry.genItemID("cableOptic");
Item.createItem("cableOptic", "Glass Fibre Cable", {name: "cable_optic", meta: 0});

Recipes.addShaped({id: ItemID.cableOptic, count: 3, data: 0}, [
	"aaa",
	"x#x",
	"aaa"
], ['#', ItemID.dustSilver, 0, 'x', ItemID.dustEnergium, 0, 'a', 20, -1]);

Callback.addCallback("PreLoaded", function(){
	// cutting recipes
	addRecipeWithCraftingTool({id: ItemID.cableTin0, count: 3, data: 0}, [{id: ItemID.plateTin, data: 0}], ItemID.cutter);
	addRecipeWithCraftingTool({id: ItemID.cableCopper0, count: 3, data: 0}, [{id: ItemID.plateCopper, data: 0}], ItemID.cutter);
	addRecipeWithCraftingTool({id: ItemID.cableGold0, count: 4, data: 0}, [{id: ItemID.plateGold, data: 0}], ItemID.cutter);

	// isolation recipes
	Recipes.addShapeless({id: ItemID.cableTin1, count: 1, data: 0}, [{id: ItemID.cableTin0, data: 0}, {id: ItemID.rubber, data: 0}]);
	Recipes.addShapeless({id: ItemID.cableCopper1, count: 1, data: 0}, [{id: ItemID.cableCopper0, data: 0}, {id: ItemID.rubber, data: 0}]);
	
	Recipes.addShapeless({id: ItemID.cableGold1, count: 1, data: 0}, [{id: ItemID.cableGold0, data: 0}, {id: ItemID.rubber, data: 0}]);
	Recipes.addShapeless({id: ItemID.cableGold2, count: 1, data: 0}, [{id: ItemID.cableGold1, data: 0}, {id: ItemID.rubber, data: 0}]);
	addShapelessRecipe({id: ItemID.cableGold2, count: 1, data: 2}, [{id: ItemID.cableGold0, count: 1, data: 0}, {id: ItemID.rubber, count: 2, data: 0}]);

	Recipes.addShapeless({id: ItemID.cableIron1, count: 1, data: 0}, [{id: ItemID.cableIron0, data: 0}, {id: ItemID.rubber, data: 0}]);
	Recipes.addShapeless({id: ItemID.cableIron2, count: 1, data: 0}, [{id: ItemID.cableIron1, data: 0}, {id: ItemID.rubber, data: 0}]);
	Recipes.addShapeless({id: ItemID.cableIron3, count: 1, data: 0}, [{id: ItemID.cableIron2, data: 0}, {id: ItemID.rubber, data: 0}]);
	addShapelessRecipe({id: ItemID.cableIron3, count: 1, data: 0}, [{id: ItemID.cableIron0, count: 1, data: 0}, {id: ItemID.rubber, count: 3, data: 0}]);
});


// place funcs
function registerCablePlaceFunc(nameID, blockID, blockData){
	Item.registerUseFunction(nameID, function(coords, item, block){
		var place = coords.relative;
		if(World.getBlockID(place.x, place.y, place.z) == 0){
			World.setBlock(place.x, place.y, place.z, blockID, blockData);
			Player.setCarriedItem(item.id, item.count - 1, item.data);
			EnergyTypeRegistry.onWirePlaced(place.x, place.y, place.z);
		}
	});
}

registerCablePlaceFunc("cableTin0", BlockID.cableTin, 0);
registerCablePlaceFunc("cableTin1", BlockID.cableTin, 1);

registerCablePlaceFunc("cableCopper0", BlockID.cableCopper, 0);
registerCablePlaceFunc("cableCopper1", BlockID.cableCopper, 1);

registerCablePlaceFunc("cableGold0", BlockID.cableGold, 0);
registerCablePlaceFunc("cableGold1", BlockID.cableGold, 1);
registerCablePlaceFunc("cableGold2", BlockID.cableGold, 2);

registerCablePlaceFunc("cableIron0", BlockID.cableIron, 0);
registerCablePlaceFunc("cableIron1", BlockID.cableIron, 1);
registerCablePlaceFunc("cableIron2", BlockID.cableIron, 2);
registerCablePlaceFunc("cableIron3", BlockID.cableIron, 3);

registerCablePlaceFunc("cableOptic", BlockID.cableOptic, 0);
