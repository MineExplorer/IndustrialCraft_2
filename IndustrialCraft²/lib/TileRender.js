LIBRARY({
	name: "TileRender",
	version: 5,
	shared: true,
	api: "CoreEngine"
});

var EntityGetYaw = ModAPI.requireGlobal("Entity.getYaw");
var EntityGetPitch = ModAPI.requireGlobal("Entity.getPitch");

var TileRenderer = {
	data: {},
	
	setStandartModel: function(id, texture, rotation){
		if(rotation){
			var textures = [
				[texture[0], texture[1], texture[2], texture[3], texture[4], texture[5]],
				[texture[0], texture[1], texture[3], texture[2], texture[5], texture[4]],
				[texture[0], texture[1], texture[5], texture[4], texture[2], texture[3]],
				[texture[0], texture[1], texture[4], texture[5], texture[3], texture[2]]
			]
			for(var i = 0; i < 4; i++){
				var render = new ICRender.Model();
				var model = BlockRenderer.createTexturedBlock(textures[i]);
				render.addEntry(model);
				BlockRenderer.enableCoordMapping(id, i, render);
			}
		}else{
			var render = new ICRender.Model();
			var model = BlockRenderer.createTexturedBlock(texture);
			render.addEntry(model);
			BlockRenderer.enableCoordMapping(id, -1, render);
		}
	},
	
	registerRenderModel: function(id, data, texture){
		var render = new ICRender.Model();
		var model = BlockRenderer.createTexturedBlock(texture);
		render.addEntry(model);
		if(!this.data[id]) this.data[id] = {};
		this.data[id][data] = render;
	},
	
	registerRotationModel: function(id, data, texture, reverse){
		reverse = reverse || 0;
		var textures = [
			[texture[0], texture[1], texture[3], texture[2], texture[5], texture[4]],
			[texture[0], texture[1], texture[2], texture[3], texture[4], texture[5]],
			[texture[0], texture[1], texture[4], texture[5], texture[3], texture[2]],
			[texture[0], texture[1], texture[5], texture[4], texture[2], texture[3]]
		]
		for(var i = 0; i < 4; i++){
			this.registerRenderModel(id, i + data + reverse * Math.pow(-1, i), textures[i]);
		}
	},
	
	registerFullRotationModel: function(id, data, texture){
		if(texture.length == 2){
			for(var i = 0; i < 6; i++){
				var textures = [];
				for(var j = 0; j < 6; j++){
					if(j == i) textures.push(texture[1]);
					else textures.push(texture[0]);
				}
				this.registerRenderModel(id, i + data, textures);
			}
		}else{
			var textures = [
				[texture[3], texture[2], texture[0], texture[1], texture[4], texture[5]],
				[texture[2], texture[3], texture[1], texture[0], texture[5], texture[4]],
				[texture[0], texture[1], texture[3], texture[2], texture[5], texture[4]],
				[texture[0], texture[1], texture[2], texture[3], texture[4], texture[5]],
				[texture[0], texture[1], texture[4], texture[5], texture[3], texture[2]],
				[texture[0], texture[1], texture[5], texture[4], texture[2], texture[3]],
			]
			for(var i = 0; i < 6; i++){
				this.registerRenderModel(id, i + data, textures[i]);
			}
		}
	},
	
	getRenderModel: function(id, data){
		var models = this.data[id];
		if(models){
			return models[data];
		}
		return 0;
	},
	
	mapAtCoords: function(x, y, z, id, data){
		var model = this.getRenderModel(id, data);
		if(model){
			BlockRenderer.mapAtCoords(x, y, z, model);
		}
	},
	
	getBlockRotation: function(isFull){
		var pitch = EntityGetPitch(Player.get());
		if(isFull){
			if(pitch < -45) return 0;
			if(pitch > 45) return 1;
		}
		var rotation = Math.floor((EntityGetYaw(Player.get())-45)%360 / 90);
		if(rotation < 0) rotation += 4;
		rotation = [3, 1, 2, 0][rotation];
		if(isFull) return rotation + 2;
		return rotation;
	},

	setRotationPlaceFunction: function(id, fullRotation){
		Block.registerPlaceFunction(id, function(coords, item, block){
			Game.prevent();
			var x = coords.relative.x
			var y = coords.relative.y
			var z = coords.relative.z
			block = World.getBlockID(x, y, z)
			if(GenerationUtils.isTransparentBlock(block)){
				World.setBlock(x, y, z, item.id, 0);
				var rotation = TileRenderer.getBlockRotation(fullRotation);
				var tile = World.addTileEntity(x, y, z);
				tile.data.meta = rotation;
				TileRenderer.mapAtCoords(x, y, z, item.id, rotation);
			}
		});
	},
}


EXPORT("TileRenderer", TileRenderer);
