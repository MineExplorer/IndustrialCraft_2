IDRegistry.genItemID("rshCondensator");
IDRegistry.genItemID("lzhCondensator");
Item.createItem("rshCondensator", "RSH-Condensator", {name: "rsh_condensator"}, {isTech: true});
Item.createItem("lzhCondensator", "LZH-Condensator", {name: "lzh_condensator"}, {isTech: true});
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
	var index = 0;
	var canBeRepaired = false;
	for (var i in field){
		var slot = field[i];
		if (slot.id == ItemID.rshCondensator){
			if(slot.data <= 1) break;
			canBeRepaired = true;
			slot.data = Math.max(parseInt(slot.data - 10000 / slot.count), 1);
		} else if(slot.id != 0){
			index = i;
		}
	}
	if(canBeRepaired){
		api.decreaseFieldSlot(index);
	}
	result.id = result.count = 0;
});

Recipes.addShapeless({id: ItemID.lzhCondensator, count: 1, data: 1}, [{id: ItemID.lzhCondensator, data: -1}, {id: 331, data: 0}],
function(api, field, result){
	var index = 0;
	var canBeRepaired = false;
	for (var i in field){
		var slot = field[i];
		if (slot.id == ItemID.lzhCondensator){
			if(slot.data <= 1) break;
			canBeRepaired = true;
			slot.data = Math.max(parseInt(slot.data - 10000 / slot.count), 1);
		} else if(slot.id != 0){
			index = i;
		}
	}
	if(canBeRepaired){
		api.decreaseFieldSlot(index);
	}
	result.id = result.count = 0;
});

Recipes.addShapeless({id: ItemID.lzhCondensator, count: 1, data: 1}, [{id: ItemID.lzhCondensator, data: -1}, {id: 351, data: 4}],
function(api, field, result){
	var index = 0;
	var canBeRepaired = false;
	for (var i in field){
		var slot = field[i];
		if (slot.id == ItemID.lzhCondensator){
			if(slot.data <= 1) break;
			canBeRepaired = true;
			slot.data = Math.max(parseInt(slot.data - 40000 / slot.count), 1);
		} else if(slot.id != 0){
			index = i;
		}
	}
	if(canBeRepaired){
		api.decreaseFieldSlot(index);
	}
	result.id = result.count = 0;
});