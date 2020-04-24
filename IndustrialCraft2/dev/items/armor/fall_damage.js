var fallHeight = 0;

Callback.addCallback("tick", function(){
    var vel = Player.getVelocity().y;
    if(vel > -0.7 && vel != fallVelocity){
        fallHeight = Player.getPosition().y;
    }
})