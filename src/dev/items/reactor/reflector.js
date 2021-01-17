IDRegistry.genItemID("neutronReflector");
IDRegistry.genItemID("neutronReflectorThick");
IDRegistry.genItemID("neutronReflectorIridium");
Item.createItem("neutronReflector", "Neutron Reflector", {name: "neutron_reflector", meta: 0});
Item.createItem("neutronReflectorThick", "Thick Neutron Reflector", {name: "neutron_reflector", meta: 1});
Item.createItem("neutronReflectorIridium", "Iridium Neutron Reflector", {name: "neutron_reflector", meta: 2});
ItemReactor.registerComponent(ItemID.neutronReflector, new ItemReactor.Reflector(30000));
ItemReactor.registerComponent(ItemID.neutronReflectorThick, new ItemReactor.Reflector(120000));
ItemReactor.registerComponent(ItemID.neutronReflectorIridium, new ItemReactor.ReflectorIridium());

Item.addCreativeGroup("ic2_reactorNeutronReflector", Translation.translate("Neutron Reflectors"), [
    ItemID.neutronReflector,
    ItemID.neutronReflectorThick,
    ItemID.neutronReflectorIridium
]);

Recipes.addShaped({id: ItemID.neutronReflector, count: 1, data: 0}, [
	"bab",
	"axa",
	"bab"
], ["x", ItemID.plateCopper, 0, 'a', ItemID.dustCoal, 0, 'b', ItemID.dustTin, 0]);

Recipes.addShaped({id: ItemID.neutronReflectorThick, count: 1, data: 0}, [
	"axa",
	"xax",
	"axa"
], ["x", ItemID.neutronReflector, 0, 'a', ItemID.plateCopper, 0]);

Recipes.addShaped({id: ItemID.neutronReflectorIridium, count: 1, data: 0}, [
	"aaa",
	"bxb",
	"aaa"
], ["x", ItemID.plateReinforcedIridium, 0, 'a', ItemID.neutronReflectorThick, 0, 'b', ItemID.densePlateCopper, 0]);

Recipes.addShaped({id: ItemID.neutronReflectorIridium, count: 1, data: 0}, [
	"aba",
	"axa",
	"aba"
], ["x", ItemID.plateReinforcedIridium, 0, 'a', ItemID.neutronReflectorThick, 0, 'b', ItemID.densePlateCopper, 0]);
