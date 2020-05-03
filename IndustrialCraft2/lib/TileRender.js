LIBRARY({
	name: "TileRender",
	version: 16,
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
		} else {
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
		} else {
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

	setRotationPlaceFunction: function(id, fullRotation, placeSound){
		Block.registerPlaceFunction(id, function(coords, item, block){
			var place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
			World.setBlock(place.x, place.y, place.z, item.id, 0);
			World.playSound(place.x, place.y, place.z, placeSound || "dig.stone", 1, 0.8)
			var rotation = TileRenderer.getBlockRotation(fullRotation);
			var tile = World.addTileEntity(place.x, place.y, place.z);
			tile.data.meta = rotation;
			TileRenderer.mapAtCoords(place.x, place.y, place.z, item.id, rotation);
		});
	},
	
	setupWireModel: function(id, data, width, groupName, preventSelfAdd) {
		var render = new ICRender.Model();
		var shape = new ICRender.CollisionShape();

		var group = ICRender.getGroup(groupName);
		if (!preventSelfAdd) {
			group.add(id, data);
		}
		
		// connections
		width /= 2;
		var boxes = [
			{side: [1, 0, 0], box: [0.5 + width, 0.5 - width, 0.5 - width, 1, 0.5 + width, 0.5 + width]},
			{side: [-1, 0, 0], box: [0, 0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width]},
			{side: [0, 1, 0], box: [0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width, 1, 0.5 + width]},
			{side: [0, -1, 0], box: [0.5 - width, 0, 0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width]},
			{side: [0, 0, 1], box: [0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, 1]},
			{side: [0, 0, -1], box: [0.5 - width, 0.5 - width, 0, 0.5 + width, 0.5 + width, 0.5 - width]},
		]
		
		for (var i in boxes) {
			var box = boxes[i];
			// render
			var model = BlockRenderer.createModel();
			model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], id, data);
			var condition = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], group, false);
			render.addEntry(model).setCondition(condition);
			// collision shape
			var entry = shape.addEntry();
			entry.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5]);
			entry.setCondition(condition);
		}
		
		// central box
		var model = BlockRenderer.createModel();
		model.addBox(0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, id, data);
		render.addEntry(model);
		
		var entry = shape.addEntry();
		entry.addBox(0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width);
		
		width = Math.max(width, 0.25);
		Block.setShape(id, 0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, data);
		
		BlockRenderer.setStaticICRender(id, data, render);
		BlockRenderer.setCustomCollisionShape(id, data, shape);
	},
	
	// deprecated, use rendertypes
	setPlantModel: function(){},
	setCropModel: function(){},

	setEmptyCollisionShape: function(id){
		var shape = new ICRender.CollisionShape();
		shape.addEntry().addBox(1, 1, 1, 0, 0, 0);
		BlockRenderer.setCustomCollisionShape(id, -1, shape);
	},
	
	getCropModel: function(texture){
        var render = new ICRender.Model();
        var model = BlockRenderer.createModel();
        model.addBox(0.25, 0, 0, 0.25, 1, 1, texture[0], texture[1]);
        model.addBox(0.75, 0, 0, 0.75, 1, 1, texture[0], texture[1]);
        model.addBox(0, 0, 0.25, 1, 1, 0.25, texture[0], texture[1]);
        model.addBox(0, 0, 0.75, 1, 1, 0.75, texture[0], texture[1]);
        render.addEntry(model);
        return render;
    },
	
	setSlabShape: function(id, count){
		for(var i = 0; i < count; i++){
			Block.setShape(id, 0, 0, 0, 1, 0.5, 1, i);
		}
		for(var i = count; i < count*2; i++){
			Block.setShape(id, 0, 0.5, 0, 1, 1, 1, i);
		}
	},
	
	setSlabPlaceFunction: function(id, count, fullBlockID){
		Block.registerPlaceFunction(id, function(coords, item, block){
			if(block.id == item.id && block.data%count == item.data && parseInt(block.data/count) == (coords.side+1)%2){
				World.setBlock(coords.x, coords.y, coords.z, fullBlockID, item.data);
				return;
			}
			var place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
			if(coords.vec.y - place.y < 0.5){
				World.setBlock(place.x, place.y, place.z, item.id, item.data);
			}
			else {
				World.setBlock(place.x, place.y, place.z, item.id, item.data + count);
			}
		});
	}
}


EXPORT("TileRenderer", TileRenderer);