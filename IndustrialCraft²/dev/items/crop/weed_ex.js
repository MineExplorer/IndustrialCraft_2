IDRegistry.genItemID("weedEx");
Item.createItem("weedEx", "Weed EX", {name: "weed_ex"},{stack:1});
Item.setMaxDamage(ItemID.weedEx, 10);

Callback.addCallback("PostLoaded", function(){
    Recipes.addShaped({id: ItemID.weedEx, count: 1, data: 0}, [
        "z",
        "x",
        "c"
    ], ['z', 331, 0,'x',ItemID.grinPowder,0,'c',ItemID.cellEmpty,0]);
});
