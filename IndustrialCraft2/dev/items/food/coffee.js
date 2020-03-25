var CoffeeMug = {
    effectTimer: 0,
    amplifier: 0,
    amplifyEffect: function(potionId, maxAmplifier, extraDuration){
        if(this.effectTimer > 0){
            this.effectTimer += extraDuration;
            if (this.amplifier < maxAmplifier) this.amplifier++;

            Entity.addEffect(Player.get(), potionId, this.amplifier, this.effectTimer);
            return this.amplifier;
        }
        Entity.addEffect(Player.get(), potionId, 1, 300);
        this.effectTimer = 300;
        return 1;
    },
    tick: function(){
        if(this.effectTimer > 1){
            this.effectTimer--;
            return;
        }
        if(this.effectTimer == 1){
            this.effectTimer--;
            this.amplifier = 0;
        }
    },
    onDeath: function(entity){
        if(entity != Player.get()) return;
        this.effectTimer = 0;
        this.amplifier = 0;
    },
    onFoodEaten: function(heal, satRatio){
        var maxAmplifier = 0;
        var extraDuration = 0;
        var itemId = Player.getCarriedItem().id;
        switch(itemId){
            case ItemID.mugCoffee :
                maxAmplifier = 6;
                extraDuration = 1200;
                break;
            case ItemID.mugColdCoffee :
                maxAmplifier = 1;
                extraDuration = 600;
                break;
            case ItemID.mugDarkCoffee :
                maxAmplifier = 5;
                extraDuration = 1200;
                break;
            case ItemID.terraWart :
                if(this.amplifier < 3) return;
                this.amplifier = 2;
                break;
            case 351:
                this.amplifier = 0;
                this.effectTimer = 0;
                break;
            default : return;
        }
        var highest = 0;
        var x = CoffeeMug.amplifyEffect(MobEffect.movementSpeed, maxAmplifier, extraDuration);
        if (x > highest) highest = x;
        x = CoffeeMug.amplifyEffect(MobEffect.digSpeed, maxAmplifier, extraDuration);

        if (x > highest) highest = x;
        if (itemId == ItemID.mugCoffee) highest -= 2;

        if (highest >= 3) {
            var badEffectTime = (highest - 2) * 200;
            Entity.addEffect(Player.get(), MobEffect.confusion, 1, badEffectTime);
            this.effectTimer = badEffectTime;
            if (highest >= 4){
                Entity.addEffect(Player.get(), MobEffect.harm, highest - 3, 1);
            }
        }

        Player.addItemToInventory(ItemID.mugEmpty, 1, 0);
    }
};

IDRegistry.genItemID("mugColdCoffee");
Item.createFoodItem("mugColdCoffee", "Cold Coffee", {name: "mug_cold_coffee"}, {stack: 1});

IDRegistry.genItemID("mugDarkCoffee");
Item.createFoodItem("mugDarkCoffee", "Dark Coffee", {name: "mug_dark_coffee"}, {stack: 1});

IDRegistry.genItemID("mugCoffee");
Item.createFoodItem("mugCoffee", "Coffee", {name: "mug_coffee"}, {stack: 1});

Callback.addCallback("FoodEaten", CoffeeMug.onFoodEaten);
Callback.addCallback("tick", CoffeeMug.tick);
Callback.addCallback("EntityDeath", CoffeeMug.onDeath);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: ItemID.mugColdCoffee, count: 1, data: 0}, [
		"x",
		"y",
		"z",
	], ['x', ItemID.coffeePowder, 0, 'y', 325, 8, 'z', ItemID.mugEmpty, 0],
	function(api, field, result){
		Player.addItemToInventory(325, 1, 0);
	});
	
	Recipes.addShaped({id: ItemID.mugCoffee, count: 1, data: 0}, [
		"x",
		"y",
		"z",
	], ['x', 353, 0, 'y', 325, 1, 'z', ItemID.mugDarkCoffee, 0]);
	
	Recipes.addFurnace(ItemID.mugColdCoffee, ItemID.mugDarkCoffee, 0);
});
