IDRegistry.genItemID("EUMeter");
Item.createItem("EUMeter", "EU Meter", {name: "eu_meter", meta: 0}, {stack: 1});
/*
Recipes.addShaped({id: ItemID.EUMeter, count: 1, data: 0}, [
	" g ",
	"xcx",
	"x x"
], ['c', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'g', 348, -1]);
*/
Item.registerUseFunction("EUMeter", function(coords, item, block){
	var tile = EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z);
	if(tile){
		for (var i in tile.__energyNets){
			var net = tile.__energyNets[i];
			if(net) Game.message(net.toString());
		}
		return;
	}
	var net = EnergyNetBuilder.getNetOnCoords(coords.x, coords.y, coords.z);
	if(net) Game.message(net.toString());
});