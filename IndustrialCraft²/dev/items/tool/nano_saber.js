IDRegistry.genItemID("nanoSaber");
Item.createItem("nanoSaber", "Nano Saber", {name: "nano_saber", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerItem(ItemID.nanoSaber, "Eu", 1000000, 3, "tool", true);
ItemName.setRarity(ItemID.nanoSaber, 1);
Item.registerNameOverrideFunction(ItemID.nanoSaber, ItemName.showItemStorage);

var NANO_SABER_DURABILITY = Item.getMaxDamage(ItemID.nanoSaber);

Recipes.addShaped({id: ItemID.nanoSaber, count: 1, data: NANO_SABER_DURABILITY}, [
	"ca ",
	"ca ",
	"bxb"
], ['x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, 'b', ItemID.carbonPlate, 0, "c", 348, 0], ChargeItemRegistry.transportEnergy);

ToolAPI.registerSword(ItemID.nanoSaber, {level: 0, durability: NANO_SABER_DURABILITY, damage: 4}, {
	damage: 0,
	onBroke: function(item){
		item.data = Math.min(item.data, NANO_SABER_DURABILITY);
		return true;
	},
	onAttack: function(item, mob){
		this.damage = item.data < NANO_SABER_DURABILITY ? 16 : 0;
		return true;
	}
});

Callback.addCallback("tick", function(){
	if(World.getThreadTime() % 20 == 0){
		var item = Player.getCarriedItem();
		if(item.id == ItemID.nanoSaber){
			item.data = Math.min(item.data+1280, NANO_SABER_DURABILITY);
			Player.setCarriedItem(item.id, 1, item.data);
		}
	}
});
