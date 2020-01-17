IDRegistry.genItemID("cropSeedBag");
Item.createItem("cropSeedBag", "Crop Seed Bag", {name: "crop_seed_bag"},{stack:1,isTech:true});
Item.registerUseFunction("cropSeedBag", function(coords, item, block){
    if(block.id==BlockID.perches){
        var te = World.getTileEntity(coords.x,coords.y,coords.z);
        if(!te.data.crop){
            var data = {
                statGrowth:item.extra.getInt("growth"),
                statGain:item.extra.getInt("gain"),
                statResistance:item.extra.getInt("resistance"),
                scanLevel:item.extra.getInt("scan")
            };
            var decrease = te.tryPlantIn(item.data, 1, data.statGrowth, data.statGain, data.statResistance, data.scanLevel);
            if(decrease)Player.decreaseCarriedItem(1);
        }
    }
});
var nameOverrideFunctionForSeedBag = function(item, name){
    var extra = item.extra|| AgricultureAPI.addDefaultExtra(item);
    var scan = extra.getInt("scan");
    var cropClassName = AgricultureAPI.cropCards[item.data].name;
    var newName = (scan>0? Translation.translate(cropClassName) : "Unknown")+ " Seeds"+'\n';
    if(scan>=4){
        newName+="§2Gr: "+extra.getInt("growth")+'\n';
        newName+="§6Ga: "+extra.getInt("gain")+'\n';
        newName+="§bRe: "+extra.getInt("resistance")+'\n';
    }
    if(debugMode)newName+="[DEBUGMODE]scan: "+extra.getInt("scan")+'\n';
    newName+='\n';
    return newName;
};
Item.registerNameOverrideFunction(ItemID.cropSeedBag, nameOverrideFunctionForSeedBag);