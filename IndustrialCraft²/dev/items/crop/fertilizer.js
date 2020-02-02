IDRegistry.genItemID("fertilizer");
Item.createItem("fertilizer", "Fertilizer", {name: "fertilizer"},{});
Callback.addCallback("PostLoaded", function(){
    Recipes.addShaped({id: ItemID.fertilizer , count: 2 , data: 0}, [
         "xz"
    ], ['x',ItemID.scrap,0,'z',351,15]);
    Recipes.addShaped({id: ItemID.fertilizer , count: 2 , data: 0}, [
         "xxz"
    ], ['x',ItemID.scrap,0,'z',ItemID.fertilizer,0]);
});