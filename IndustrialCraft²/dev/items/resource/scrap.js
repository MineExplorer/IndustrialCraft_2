IDRegistry.genItemID("scrap");
Item.createItem("scrap", "Scrap", {name: "scrap"});

IDRegistry.genItemID("scrapBox");
Item.createItem("scrapBox", "Scrap Box", {name: "scrap_box"});

Recipes.addShaped({id: ItemID.scrapBox, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.scrap, -1]);
	
MachineRecipeRegistry.addRecipeFor("catalyser", ItemID.scrap, {input: 5000, output: 30000});
MachineRecipeRegistry.addRecipeFor("catalyser", ItemID.scrapBox, {input: 45000, output: 270000});

Item.registerUseFunction("scrapBox", function(coords, item, block){
	var drop = getScrapDropItem();
	World.drop(coords.relative.x + 0.5, coords.relative.y + 0.1, coords.relative.z + 0.5, drop.id, 1, drop.data);
	item.count--;
	if(!item.count){item.id = 0;}
	Player.setCarriedItem(item.id, item.count, 0);
});











	
var SCRAP_BOX_RANDOM_DROP = [
	{chance: .1, id: 264, data: 0},
	{chance: 1.8, id: 15, data: 0},
	{chance: 1.0, id: 14, data: 0},
	{chance: 3, id: 331, data: 0},
	{chance: 0.5, id: 348, data: 0},
	{chance: 5, id: 351, data: 15},
	{chance: 2, id: 17, data: 0},
	{chance: 2, id: 6, data: 0},
	{chance: 2, id: 263, data: 0},
	{chance: 3, id: 260, data: 0},
	{chance: 2.1, id: 262, data: 0},
	{chance: 1, id: 354, data: 0},
	{chance: 3, id: 296, data: 0},
	{chance: 5, id: 280, data: 0},
	{chance: 3.5, id: 287, data: 0},
	{chance: 10, id: 3, data: 0},
	{chance: 3, id: 12, data: 0},
	{chance: 3, id: 13, data: 0},
	{chance: 4, id: 2, data: 0},
	{chance: 1.0, id: ItemID.dustIron, data: 0},
	{chance: 0.8, id: ItemID.dustGold, data: 0},
	{chance: 1.2, id: ItemID.dustCopper, data: 0},
	{chance: 1.2, id: ItemID.dustLead, data: 0},
	{chance: 1.2, id: ItemID.dustTin, data: 0},
	{chance: 1.2, id: ItemID.dustCoal, data: 0},
	{chance: 0.4, id: ItemID.dustDiamond, data: 0},
	{chance: 1.0, id: ItemID.casingIron, data: 0},
	{chance: 0.8, id: ItemID.casingGold, data: 0},
	{chance: 1.2, id: ItemID.casingCopper, data: 0},
	{chance: 1.2, id: ItemID.casingLead, data: 0},
	{chance: 1.2, id: ItemID.casingTin, data: 0},
	{chance: 1.2, id: ItemID.casingCoal, data: 0},
	{chance: 0.4, id: ItemID.casingDiamond, data: 0},
	{chance: 2, id: ItemID.rubber, data: 0},
	{chance: 2, id: ItemID.latex, data: 0},
	{chance: 0.4, id: ItemID.uraniumChunk, data: 0},
	{chance: 2.5, id: ItemID.oreCrushedCopper, data: 0},
	{chance: 1.5, id: ItemID.oreCrushedTin, data: 0},
	{chance: 1.5, id: ItemID.oreCrushedLead, data: 0},
];

function getScrapDropItem(){
	var total = 0;
	for (var i in SCRAP_BOX_RANDOM_DROP){
		total += SCRAP_BOX_RANDOM_DROP[i].chance;
	}
	var random = Math.random() * total * 1.4;
	var current = 0;
	for (var i in SCRAP_BOX_RANDOM_DROP){
		var drop = SCRAP_BOX_RANDOM_DROP[i];
		if (current < random && current + drop.chance > random){
			return drop;
		}
		current += drop.chance;
	}
	
	return {id: ItemID.scrap, data: 0};
}