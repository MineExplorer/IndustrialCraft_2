IDRegistry.genItemID("nanoSaber");
Item.createItem("nanoSaber", "Nano Saber", {name: "nano_saber", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.nanoSaber, 1000000, 2, true, true);
Item.setToolRender(ItemID.nanoSaber, true);

Item.registerNameOverrideFunction(ItemID.nanoSaber, ENERGY_ITEM_NAME);

var NANO_SABER_DURABILITY = 1000001;

Recipes.addShaped({id: ItemID.nanoSaber, count: 1, data: NANO_SABER_DURABILITY}, [
	"ca ",
	"ca ",
	"bxb"
], ['x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, 'b', ItemID.carbonPlate, 0, "c", 348, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

ToolAPI.registerSword(ItemID.nanoSaber, {level: 0, durability: NANO_SABER_DURABILITY, damage: 4}, {
	damage: 0,
	onBroke: function(item){
		item.data = Math.min(item.data, NANO_SABER_DURABILITY);
		return true;
	},
	onAttack: function(item, mob){
		this.damage = item.data < NANO_SABER_DURABILITY ? 16 : 0;
		return false;
	}
});

Callback.addCallback("tick", function(){
	if(World.getThreadTime() % 20 == 0){
		var item = Player.getCarriedItem()
		if(item.id == ItemID.nanoSaber){
			item.data = Math.min(item.data+20, NANO_SABER_DURABILITY);
			Player.setCarriedItem(item.id, 1, item.data);
		}
	}
});
