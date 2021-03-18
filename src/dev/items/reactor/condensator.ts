/// <reference path="api/Condensator.ts" />

ItemRegistry.createItem("rshCondensator", {name: "rsh_condensator", icon: "rsh_condensator", inCreative: false});
ItemRegistry.createItem("lzhCondensator", {name: "lzh_condensator", icon: "lzh_condensator", inCreative: false});

Item.addToCreative(ItemID.rshCondensator, 1, 1);
Item.addToCreative(ItemID.lzhCondensator, 1, 1);

ReactorItem.registerComponent(ItemID.rshCondensator, new ReactorItem.Condensator(20000));
ReactorItem.registerComponent(ItemID.lzhCondensator, new ReactorItem.Condensator(100000));

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
function(api, field, result) {
	let index = 0;
	let canBeRepaired = false;
	for (let i = 0; i < field.length; i++) {
		let slot = field[i];
		if (slot.id == ItemID.rshCondensator) {
			if (slot.data <= 1) break;
			canBeRepaired = true;
			slot.data = Math.max(Math.floor(slot.data - 10000 / slot.count), 1);
		} else if (slot.id != 0) {
			index = i;
		}
	}
	if (canBeRepaired) {
		api.decreaseFieldSlot(index);
	}
	result.id = result.count = 0;
});

Recipes.addShapeless({id: ItemID.lzhCondensator, count: 1, data: 1}, [{id: ItemID.lzhCondensator, data: -1}, {id: 331, data: 0}],
function(api, field, result) {
	let index = 0;
	let canBeRepaired = false;
	for (let i = 0; i < field.length; i++) {
		let slot = field[i];
		if (slot.id == ItemID.lzhCondensator) {
			if (slot.data <= 1) break;
			canBeRepaired = true;
			slot.data = Math.max(Math.floor(slot.data - 10000 / slot.count), 1);
		} else if (slot.id != 0) {
			index = i;
		}
	}
	if (canBeRepaired) {
		api.decreaseFieldSlot(index);
	}
	result.id = result.count = 0;
});

Recipes.addShapeless({id: ItemID.lzhCondensator, count: 1, data: 1}, [{id: ItemID.lzhCondensator, data: -1}, {id: 351, data: 4}],
function(api, field, result) {
	let index = 0;
	let canBeRepaired = false;
	for (let i = 0; i < field.length; i++) {
		let slot = field[i];
		if (slot.id == ItemID.lzhCondensator) {
			if (slot.data <= 1) break;
			canBeRepaired = true;
			slot.data = Math.max(Math.floor(slot.data - 40000 / slot.count), 1);
		} else if (slot.id != 0) {
			index = i;
		}
	}
	if (canBeRepaired) {
		api.decreaseFieldSlot(index);
	}
	result.id = result.count = 0;
});