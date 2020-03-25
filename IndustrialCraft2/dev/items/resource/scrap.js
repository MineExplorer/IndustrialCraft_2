IDRegistry.genItemID("scrap");
Item.createItem("scrap", "Scrap", {name: "scrap"});
Recipes.addFurnaceFuel(ItemID.scrap, 0, 350);

IDRegistry.genItemID("scrapBox");
Item.createItem("scrapBox", "Scrap Box", {name: "scrap_box"});
Recipes.addFurnaceFuel(ItemID.scrapBox, 0, 3150);

Recipes.addShaped({id: ItemID.scrapBox, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx"
], ['x', ItemID.scrap, 0]);
	
MachineRecipeRegistry.addRecipeFor("catalyser", ItemID.scrap, {input: 5000, output: 30000});
MachineRecipeRegistry.addRecipeFor("catalyser", ItemID.scrapBox, {input: 45000, output: 270000});


var SCRAP_BOX_RANDOM_DROP = [
	{chance: 0.1, id: 264, data: 0},
	{chance: 1.8, id: 15, data: 0},
	{chance: 1, id: 14, data: 0},
	{chance: 3, id: 331, data: 0},
	{chance: 0.8, id: 348, data: 0},
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
	{chance: 1.2, id: ItemID.dustCoal, data: 0},
	{chance: 1.2, id: ItemID.dustCopper, data: 0},
	{chance: 1.2, id: ItemID.dustTin, data: 0},
	{chance: 1.2, id: ItemID.dustIron, data: 0},
	{chance: 0.8, id: ItemID.dustGold, data: 0},
	{chance: 0.8, id: ItemID.dustLead, data: 0},
	{chance: 0.6, id: ItemID.dustSilver, data: 0},
	{chance: 0.4, id: ItemID.dustDiamond, data: 0},
	{chance: 0.4, id: BlockID.oreUranium, data: 0},
	{chance: 2, id: BlockID.oreCopper, data: 0},
	{chance: 1.5, id: BlockID.oreTin, data: 0},
	{chance: 1, id: BlockID.oreLead, data: 0},
	{chance: 2, id: ItemID.rubber, data: 0},
	{chance: 2, id: ItemID.latex, data: 0},
	{chance: 2.5, id: ItemID.tinCanFull, data: 0},
];

function getScrapDropItem(){
	var total = 0;
	for (var i in SCRAP_BOX_RANDOM_DROP){
		total += SCRAP_BOX_RANDOM_DROP[i].chance;
	}
	var random = Math.random() * total * 1.35;
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

Item.registerUseFunction("scrapBox", function(coords, item, block){
	var drop = getScrapDropItem();
	World.drop(coords.relative.x + 0.5, coords.relative.y + 0.1, coords.relative.z + 0.5, drop.id, 1, drop.data);
	Player.decreaseCarriedItem(1);
});
