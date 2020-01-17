IDRegistry.genItemID("perches");
Item.createItem("perches", "Perches", {name: "crop_stick"});
Callback.addCallback("PostLoaded", function(){
    Recipes.addShaped({id: ItemID.perches , count: 2 , data: 0}, [
     "x x",
     "x x"
], ['x',280,0]);
});
Item.registerUseFunction("perches",function(coords,item,block){
    if(block.id==60&&coords.side==1){
        World.setBlock(coords.relative.x,coords.relative.y,coords.relative.z,BlockID.perches,0);
        World.addTileEntity(coords.relative.x,coords.relative.y,coords.relative.z);
        Player.decreaseCarriedItem(1);
    }
});