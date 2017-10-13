IDRegistry.genItemID("debugItem");
Item.createItem("debugItem", "debug.item", {name: "debug_item", meta: 0}, {isTech: debugMode});

Item.registerUseFunction("debugItem", function(coords, item, block){
	Game.message(block.id+":"+block.data);
	var machine = EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z);
	if(machine){
		for(var i in machine.data){
			if(i != "energy_storage"){
				if(i == "energy"){
				Game.message("energy: " + machine.data[i] + "/" + machine.getEnergyStorage());}
				else{
				Game.message(i + ": " + machine.data[i]);}
			}
		}
	}
});
