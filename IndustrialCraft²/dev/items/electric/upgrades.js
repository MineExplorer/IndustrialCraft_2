IDRegistry.genItemID("upgradeOverclocker");
Item.createItem("upgradeOverclocker", "Overclocker Upgrade", {name: "upgrade_overclocker", meta: 0}, {stack: 16});

IDRegistry.genItemID("upgradeTransformer");
Item.createItem("upgradeTransformer", "Transformer Upgrade", {name: "upgrade_transformer", meta: 0});

IDRegistry.genItemID("upgradeEnergyStorage");
Item.createItem("upgradeEnergyStorage", "Energy Storage Upgrade", {name: "upgrade_energy_storage", meta: 0});

IDRegistry.genItemID("upgradeRedstone");
Item.createItem("upgradeRedstone", "Redstone Signal Inverter Upgrade", {name: "upgrade_redstone_inv", meta: 0});

IDRegistry.genItemID("upgradeEjector");
Item.createItem("upgradeEjector", "Ejector Upgrade", {name: "upgrade_ejector", meta: 0});
Item.registerIconOverrideFunction(ItemID.upgradeEjector, function(item, name){
	return {name: "upgrade_ejector", meta: item.data}
});

IDRegistry.genItemID("upgradePulling");
Item.createItem("upgradePulling", "Pulling Upgrade", {name: "upgrade_pulling", meta: 0});
Item.registerIconOverrideFunction(ItemID.upgradePulling, function(item, name){
	return {name: "upgrade_pulling", meta: item.data}
});

IDRegistry.genItemID("upgradeFluidEjector");
Item.createItem("upgradeFluidEjector", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 0});
Item.registerIconOverrideFunction(ItemID.upgradeFluidEjector, function(item, name){
	return {name: "upgrade_fluid_ejector", meta: item.data}
});

IDRegistry.genItemID("upgradeFluidPulling");
Item.createItem("upgradeFluidPulling", "Fluid Pulling Upgrade", {name: "upgrade_fluid_pulling", meta: 0});
Item.registerIconOverrideFunction(ItemID.upgradeFluidPulling, function(item, name){
	return {name: "upgrade_fluid_pulling", meta: item.data}
});

IDRegistry.genItemID("upgradeMFSU");
Item.createItem("upgradeMFSU", "MFSU Upgrade Kit", {name: "mfsu_upgrade", meta: 0});


Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: ItemID.upgradeOverclocker, count: 1, data: 0}, [
		"aaa",
		"x#x",
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'a', ItemID.coolantCell, 0]);
	Recipes.addShaped({id: ItemID.upgradeOverclocker, count: 3, data: 0}, [
		"aaa",
		"x#x",
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'a', ItemID.coolantCell3, 0]);
	Recipes.addShaped({id: ItemID.upgradeOverclocker, count: 6, data: 0}, [
		"aaa",
		"x#x",
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'a', ItemID.coolantCell6, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeTransformer, count: 1, data: 0}, [
		"aaa",
		"x#x",
		"aca"
	], ['#', BlockID.transformerMV, 0, 'x', ItemID.cableGold2, 0, 'a', 20, -1, 'c', ItemID.circuitBasic, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeEnergyStorage, count: 1, data: 0}, [
		"aaa",
		"x#x",
		"aca"
	], ['#', ItemID.storageBattery, -1, 'x', ItemID.cableCopper1, 0, 'a', 5, -1, 'c', ItemID.circuitBasic, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeRedstone, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x",
	], ['x', ItemID.plateTin, 0, '#', 69, -1]);
	
	Recipes.addShaped({id: ItemID.upgradeEjector, count: 1, data: 0}, [
		"aba",
		"x#x",
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'a', 33, -1, 'b', 410, 0]);
	
	Recipes.addShaped({id: ItemID.upgradePulling, count: 1, data: 0}, [
		"aba",
		"x#x",
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'a', 29, -1, 'b', 410, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeFluidEjector, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x",
	], ['x', ItemID.plateTin, 0, '#', ItemID.electricMotor, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeFluidPulling, count: 1, data: 0}, [
		"xcx",
		" # ",
		"x x",
	], ['x', ItemID.plateTin, 0, '#', ItemID.electricMotor, 0, 'c', ItemID.treetap, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeMFSU, count: 1, data: 0}, [
		"aca",
		"axa",
		"aba"
	], ['b', ItemID.wrenchBronze, 0, 'a', ItemID.storageLapotronCrystal, -1, 'x', BlockID.machineBlockAdvanced, 0, 'c', ItemID.circuitAdvanced, 0]);
});


UpgradeAPI.registerUpgrade(ItemID.upgradeOverclocker, function(item, machine, container, data, coords){
	if(data.work_time){
		data.energy_consumption = Math.round(data.energy_consumption * Math.pow(1.6, item.count));
		data.work_time = Math.round(data.work_time * Math.pow(0.7, item.count));
	}
});

UpgradeAPI.registerUpgrade(ItemID.upgradeTransformer, function(item, machine, container, data, coords){
	data.power_tier += item.count;
});

UpgradeAPI.registerUpgrade(ItemID.upgradeEnergyStorage, function(item, machine, container, data, coords){
	data.energy_storage += 10000 * item.count;
});

UpgradeAPI.registerUpgrade(ItemID.upgradeRedstone, function(item, machine, container, data, coords){
	data.isHeating = !data.isHeating;
});

UpgradeAPI.registerUpgrade(ItemID.upgradeEjector, function(item, machine, container, data, coords){
	var items = [];
	var slots = machine.getTransportSlots().output;
	for(var i in slots){
		var slot = container.getSlot(slots[i]);
		if(slot.id){items.push(slot);}
	}
	if(items.length){
		var containers = StorageInterface.getNearestContainers(coords, item.data-1);
		StorageInterface.putItems(items, containers, machine);
	}
});

UpgradeAPI.registerUpgrade(ItemID.upgradePulling, function(item, machine, container, data, coords){
	if(World.getThreadTime()%20 == 0){
		var items = [];
		var slots = machine.getTransportSlots().input;
		for(var i in slots){
			var slot = container.getSlot(slots[i]);
			if(slot.count < Item.getMaxStack(slot.id)){
				items.push(slot);
			}
		}
		if(items.length){
			var containers = StorageInterface.getNearestContainers(coords, item.data-1);
			StorageInterface.extractItems(items, containers, machine);
		}
	}
});

UpgradeAPI.registerUpgrade(ItemID.upgradeFluidEjector, function(item, machine, container, data, coords){
	var storage = machine.liquidStorage;
	var liquid = storage.getLiquidStored();
	if(liquid){
		var storages = StorageInterface.getNearestLiquidStorages(coords, item.data-1);
		StorageInterface.transportLiquid(liquid, 0.25, storage, storages);
	}
});

UpgradeAPI.registerUpgrade(ItemID.upgradeFluidPulling, function(item, machine, container, data, coords){
	var storage = machine.liquidStorage;
	var liquid = storage.getLiquidStored();
	if(!liquid || !storage.isFull(liquid)){
		var storages = StorageInterface.getNearestLiquidStorages(coords, item.data-1);
		StorageInterface.extractLiquid(liquid, 0.25, storage, storages);
	}
});


Item.registerUseFunction("upgradeMFSU", function(coords, item, block){
	if(block.id == BlockID.storageMFE){
		var tile = World.getTileEntity(coords.x ,coords.y, coords.z);
		var data = tile.data;
		tile.selfDestroy();
		World.setBlock(coords.x ,coords.y, coords.z, BlockID.storageMFSU, 0);
		block = World.addTileEntity(coords.x ,coords.y, coords.z);
		block.data = data;
		TileRenderer.mapAtCoords(coords.x, coords.y, coords.z, BlockID.storageMFSU, data.meta);
		Player.decreaseCarriedItem(1);
	}
});

Item.registerUseFunction("upgradePulling", function(coords, item, block){
	if(item.data == 0){
		Player.setCarriedItem(ItemID.upgradePulling, item.count, coords.side+1);
	}else{
		Player.setCarriedItem(ItemID.upgradePulling, item.count);
	}
});

Item.registerUseFunction("upgradeEjector", function(coords, item, block){
	if(item.data == 0){
		Player.setCarriedItem(ItemID.upgradeEjector, item.count, coords.side+1);
	}else{
		Player.setCarriedItem(ItemID.upgradeEjector, item.count);
	}
});

Item.registerUseFunction("upgradeFluidEjector", function(coords, item, block){
	if(item.data == 0){
		Player.setCarriedItem(ItemID.upgradeFluidEjector, item.count, coords.side+1);
	}else{
		Player.setCarriedItem(ItemID.upgradeFluidEjector, item.count);
	}
});

Item.registerUseFunction("upgradeFluidPulling", function(coords, item, block){
	if(item.data == 0){
		Player.setCarriedItem(ItemID.upgradeFluidPulling, item.count, coords.side+1);
	}else{
		Player.setCarriedItem(ItemID.upgradeFluidPulling, item.count, 0);
	}
});
