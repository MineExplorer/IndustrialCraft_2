IDRegistry.genItemID("latex");
Item.createItem("latex", "Latex", { name: "latex", data: 0 });
IDRegistry.genItemID("rubber");
Item.createItem("rubber", "Rubber", { name: "rubber", data: 0 });
Recipes.addFurnace(ItemID.latex, ItemID.rubber, 0);
Recipes.addShaped({ id: 50, count: 4, data: 0 }, [
    "x",
    "#"
], ['x', ItemID.latex, 0, '#', 280, 0]);
Recipes.addShaped({ id: 29, count: 1, data: 0 }, [
    "x",
    "p"
], ['x', ItemID.latex, 0, 'p', 33, 0]);
