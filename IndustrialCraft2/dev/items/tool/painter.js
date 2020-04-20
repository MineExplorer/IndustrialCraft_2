IDRegistry.genItemID("icPainter");
Item.createItem("icPainter", "Painter", {name: "ic_painter", meta: 0});

let painterCreativeGroup = [ItemID.icPainter];
const colorNames = ["Black", "Red", "Green", "Brown", "Blue", "Purple", "Cyan", "Light Grey", "Dark Grey", "Pink", "Lime", "Yellow", "Light Blue", "Magenta", "Orange", "White"];

for(let i = 1; i <= 16; i++){
	IDRegistry.genItemID("icPainter"+i);
	Item.createItem("icPainter"+i, colorNames[i - 1] + " Painter", {name: "ic_painter", meta: i});
	Item.setMaxDamage(ItemID["icPainter"+i], 16);
	painterCreativeGroup.push(ItemID["icPainter"+i]);
}

Item.addCreativeGroup("ic2_painter", Translation.translate("Painters"), painterCreativeGroup);

Recipes.addShaped({id: ItemID.icPainter, count: 1, data: 0}, [
	" aa",
	" xa",
	"x  "
], ['x', 265, -1, 'a', 35, 0]);

Recipes.addShapeless({id: ItemID.icPainter1, count: 1, data: 0}, [{id: ItemID.icPainter, data: 0}, {id: 351, data: 16}]);
Recipes.addShapeless({id: ItemID.icPainter2, count: 1, data: 0}, [{id: ItemID.icPainter, data: 0}, {id: 351, data: 1}]);
Recipes.addShapeless({id: ItemID.icPainter3, count: 1, data: 0}, [{id: ItemID.icPainter, data: 0}, {id: 351, data: 2}]);
Recipes.addShapeless({id: ItemID.icPainter4, count: 1, data: 0}, [{id: ItemID.icPainter, data: 0}, {id: 351, data: 17}]);
Recipes.addShapeless({id: ItemID.icPainter5, count: 1, data: 0}, [{id: ItemID.icPainter, data: 0}, {id: 351, data: 18}]);

for(let i = 6; i <= 15; i++){
	Recipes.addShapeless({id: ItemID["icPainter"+i], count: 1, data: 0}, [{id: ItemID.icPainter, data: 0}, {id: 351, data: i-1}]);
}

Recipes.addShapeless({id: ItemID.icPainter16, count: 1, data: 0}, [{id: ItemID.icPainter, data: 0}, {id: 351, data: 19}]);

for(let i = 1; i <= 16; i++){
	let index = i-1;
	Item.registerUseFunction("icPainter"+i, function(coords, item, block){
		if(CableRegistry.canBePainted(block.id) && block.data != index){
			World.setBlock(coords.x, coords.y, coords.z, block.id, index);
			item.data++;
			if(item.data >= Item.getMaxDamage(item.id))
				item.id = ItemID.icPainter;
			Player.setCarriedItem(item.id, 1, item.data);
			SoundAPI.playSound("Tools/Painters.ogg");
		}
	});
}