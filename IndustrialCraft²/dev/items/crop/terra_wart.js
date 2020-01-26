IDRegistry.genItemID("terraWart");
Item.createFoodItem("terraWart", "Terra Wart", {name: "terra_wart"}, {food: 1});
Callback.addCallback("FoodEaten", function(heal, satRatio){
    RadiationAPI.addRadiation(-600);
    Entity.clearEffects(Player.get());
});