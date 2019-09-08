IDRegistry.genItemID("rshCondensator");
IDRegistry.genItemID("lzhCondensator");
Item.createItem("rshCondensator", "RSH-Condensator", {name: "rsh_condensator"}, {stack: 1});
Item.createItem("lzhCondensator", "LZH-Condensator", {name: "lzh_condensator"}, {stack: 1});
ReactorAPI.registerComponent(ItemID.rshCondensator, new ReactorAPI.condensator(20000));
ReactorAPI.registerComponent(ItemID.lzhCondensator, new ReactorAPI.condensator(100000));

Recipes.addShaped({id: ItemID.rshCondensator, count: 1, data: 1}, [
	"rrr",
	"rar",
	"rxr"
], ['a', ItemID.heatVent, 1, 'x', ItemID.heatExchanger, 1, 'r', 331, 0]);

Recipes.addShaped({id: ItemID.lzhCondensator, count: 1, data: 1}, [
	"rar",
	"cbc",
	"rxr"
], ['a', ItemID.heatVentReactor, 1, 'b', 22, -1, 'c', ItemID.rshCondensator, -1, 'x', ItemID.heatExchangerReactor, 1, 'r', 331, 0]);

Recipes.addShapeless({id: ItemID.rshCondensator, count: 1, data: 1}, [{id: ItemID.rshCondensator, data: -1}, {id: 331, data: 0}],
function(api, field, result){
	for (var i in field){
		if (field[i].id == ItemID.rshCondensator){
			if(field[i].data <= 1) break;
			field[i].data = Math.max(field[i].data - 10000, 1);
		}
		else {
			api.decreaseFieldSlot(i);
		}
	}
	result.id = result.count = 0;
});

Recipes.addShapeless({id: ItemID.lzhCondensator, count: 1, data: 1}, [{id: ItemID.lzhCondensator, data: -1}, {id: 331, data: 0}],
function(api, field, result){
	for (var i in field){
		if (field[i].id == ItemID.lzhCondensator){
			if(field[i].data <= 1) break;
			field[i].data = Math.max(field[i].data - 10000, 1);
		}
		else {
			api.decreaseFieldSlot(i);
		}
	}
	result.id = result.count = 0;
});

Recipes.addShapeless({id: ItemID.lzhCondensator, count: 1, data: 1}, [{id: ItemID.lzhCondensator, data: -1}, {id: 351, data: 4}],
function(api, field, result){
	for (var i in field){
		if (field[i].id == ItemID.lzhCondensator){
			if(field[i].data <= 1) break;
			field[i].data = Math.max(field[i].data - 40000, 1);
		}
		else {
			api.decreaseFieldSlot(i);
		}
	}
	result.id = result.count = 0;
});