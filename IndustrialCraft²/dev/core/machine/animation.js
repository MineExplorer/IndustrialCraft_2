/*var MachineRenderer = {
	models: {},
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
	registerRenderModel: function(id, texture, rotation){
		if(rotation){
			this.models[id] = [];
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
				this.models[id].push(render);
			}
		}else{
			var render = new ICRender.Model();
			var model = BlockRenderer.createTexturedBlock(texture);
			render.addEntry(model);
			this.models[id] = [render];
		}
	},
	getRenderModel: function(id, data){
		return this.models[id][data];
	}
}
*/