IDRegistry.genItemID("freqTransmitter");
Item.createItem("freqTransmitter", "Frequency Transmitter", {name: "frequency_transmitter"});

Recipes.addShaped({id: ItemID.freqTransmitter, count: 1, data: 0}, [
	"x",
	"#",
	"b"
], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'b', ItemID.casingIron, 0]);

var teleporterFrequency;
Item.registerUseFunction("freqTransmitter", function(coords, item, block){
	if(block.id==BlockID.teleporter){
		if(!teleporterFrequency){
			teleporterFrequency = coords;
			Game.message("Frequency Transmitter linked to Teleporter");
		}
		else{
			if(teleporterFrequency == coords){
				Game.message("Can`t link Teleporter to itself");
			}
			else{
				var receiver = teleporterFrequency;
				var data = EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z).data;
				var distance = Entity.getDistanceBetweenCoords(coords, receiver);
				var basicTeleportationCost = Math.floor(5 * Math.pow((distance+10), 0.7));
				data.frequency = receiver;
				data.frequency.energy = basicTeleportationCost;
				data = EnergyTileRegistry.accessMachineAtCoords(receiver.x, receiver.y, receiver.z).data;
				data.frequency = coords;
				data.frequency.energy = basicTeleportationCost;
				Game.message("Teleportation link established");
			}
		}
	}
	else if(teleporterFrequency){
		teleporterFrequency = null;
		Game.message("Frequency Transmitter unlinked");
	}
});