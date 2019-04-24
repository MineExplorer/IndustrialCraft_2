IDRegistry.genItemID("freqTransmitter");
Item.createItem("freqTransmitter", "Frequency Transmitter", {name: "frequency_transmitter"}, {stack: 1});

Recipes.addShaped({id: ItemID.freqTransmitter, count: 1, data: 0}, [
	"x",
	"#",
	"b"
], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'b', ItemID.casingIron, 0]);

Item.registerNameOverrideFunction(ItemID.freqTransmitter, function(item, name){
	var carried = Player.getCarriedItem();
	if(carried.id == item.id){
		var extra = carried.extra;
		if(extra){
			var x = extra.getInt("x");
			var y = extra.getInt("y");
			var z = extra.getInt("z");
			name += "\n§7x: " + x + ", y: " + y + ", z: " + z;
		}
	}
	return name;
});

Item.registerUseFunction("freqTransmitter", function(coords, item, block){
	var receiveCoords;
	var extra = item.extra;
	if(!extra){
		extra = new ItemExtraData();
		item.extra = extra;
	}else{
		var x = extra.getInt("x");
		var y = extra.getInt("y");
		var z = extra.getInt("z");
		receiveCoords = {x: x, z: z, y: y};
	}
	if(block.id == BlockID.teleporter){
		if(!receiveCoords){
			extra.putInt("x", coords.x);
			extra.putInt("y", coords.y);
			extra.putInt("z", coords.z);
			Player.setCarriedItem(item.id, 1, item.data, extra);
			Game.message("Frequency Transmitter linked to Teleporter");
		}
		else{
			if(x == coords.x && y == coords.y && z == coords.z){
				Game.message("Can`t link Teleporter to itself");
			}
			else{
				var data = World.getTileEntity(coords.x, coords.y, coords.z).data;
				var distance = Entity.getDistanceBetweenCoords(coords, receiveCoords);
				var basicTeleportCost = Math.floor(5 * Math.pow((distance+10), 0.7));
				receiver = World.getTileEntity(x, y, z);
				if(receiver){
					data.frequency = receiveCoords;
					data.frequency.energy = basicTeleportCost;
					data = receiver.data;
					data.frequency = coords;
					data.frequency.energy = basicTeleportCost;
					Game.message("Teleportation link established");
				}
			}
		}
	}
	else if(receiveCoords){
		Player.setCarriedItem(item.id, 1, item.data);
		Game.message("Frequency Transmitter unlinked");
	}
});