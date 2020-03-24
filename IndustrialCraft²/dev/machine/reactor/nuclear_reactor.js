IDRegistry.genBlockID("nuclearReactor");
Block.createBlock("nuclearReactor", [
	{name: "Nuclear Reactor", texture: [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]], inCreative: true},
], "opaque");
TileRenderer.setStandartModel(BlockID.nuclearReactor, [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]]);
TileRenderer.registerRenderModel(BlockID.nuclearReactor, 0, [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1]]);

IDRegistry.genBlockID("reactorChamber");
Block.createBlock("reactorChamber", [
	{name: "Reactor Chamber", texture: [["machine_bottom", 0], ["machine_top", 0], ["reactor_chamber", 0], ["reactor_chamber", 0], ["reactor_chamber", 0], ["reactor_chamber", 0]], inCreative: true},
], "opaque");

Block.registerDropFunction("nuclearReactor", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.primalGenerator);
});

Block.registerDropFunction("reactorChamber", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.nuclearReactor, count: 1, data: 0}, [
		"xcx",
		"aaa",
		"x#x"
	], ['#', BlockID.primalGenerator, 0, 'a', BlockID.reactorChamber, 0, 'x', ItemID.densePlateLead, 0, 'c', ItemID.circuitAdvanced, 0]);
	
	Recipes.addShaped({id: BlockID.reactorChamber, count: 1, data: 0}, [
		" x ",
		"x#x",
		" x "
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.plateLead, 0]);
});

function checkReactorSlot(i, id, count, data, container){
	if(container.tileEntity.tnt.length > 0){
		return false;
	}
	let slot = container.getSlot("slot"+i);
	if(ReactorAPI.isReactorItem(id) && slot.id == 0){
		if(count == 1) return true;
		let slotFinded = false;
		for(let i = 9; i < 46; i++){
			let invSlot = Player.getInventorySlot(i);
			if(invSlot.id == id && invSlot.count == count && invSlot.data == data){
				Player.setInventorySlot(i, id, count - 1, data);
				slotFinded = true;
				break;
			}
		}
		if(slotFinded){
			slot.id = id;
			slot.count = 1;
			slot.data = data;
		}
	}
	return false;
}

let reactorElements = {
	"heatScale": {type: "scale", x: 340 + GUI_SCALE*2, y: 420 + GUI_SCALE*2, direction: 0, value: 0.5, bitmap: "reactor_heat_scale", scale: GUI_SCALE},
	"textInfo": {type: "text", font: {size: 24, color: Color.GREEN}, x: 675 + GUI_SCALE*2, y: 432, width: 256, height: 42, text: Translation.translate("Generating: ")},
}

for(let y = 0; y < 6; y++){
	for(let x = 0; x < 9; x++){
		let i = y*9+x;
		reactorElements["slot"+i] = {type: "slot", x: 400 + 59 * x, y: 50 + 59 * y, isValid: function(id, count, data, container){
			return checkReactorSlot(i, id, count, data, container);
		}}
	}
}

let guiNuclearReactor = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Nuclear Reactor")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 340, y: 420, bitmap: "reactor_info", scale: GUI_SCALE},
	],
	
	elements: reactorElements
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiNuclearReactor, "Nuclear Reactor");
});

let EUReactorModifier = 5;

MachineRegistry.registerGenerator(BlockID.nuclearReactor, {
	defaultValues: {
		isEnabled: false,
		isActive: false,
		heat: 0,
		maxHeat: 10000,
		hem: 1,
		output: 0,
		boomPower: 0
	},
	
	chambers: [],
	
	tnt: [],
	
	getGuiScreen: function(){
		return guiNuclearReactor;
	},
	
	init: function(){
		this.chambers = [];
		this.tnt = [];
		this.renderModel();
		this.rebuildEnergyNet();
	},
	
	rebuildEnergyNet: function(){
		let net = this.__energyNets.Eu;
		if (net) {
			EnergyNetBuilder.removeNet(net);
		}
		net = EnergyNetBuilder.buildForTile(this, EU);
		this.__energyNets.Eu = net;
		for (let i = 0; i < 6; i++) {
			let c = StorageInterface.getRelativeCoords(this, i);
			if(World.getBlockID(c.x, c.y, c.z) == BlockID.reactorChamber){
				let tileEnt = World.getTileEntity(c.x, c.y, c.z);
				if(tileEnt){
					this.addChamber(tileEnt);
				}
			}
		}
	},
	
	addChamber: function(chamber){
		if(chamber.removed || (chamber.core && chamber.core != this)){
			return;
		}
		if(this.chambers.indexOf(chamber) == -1){
			this.chambers.push(chamber);
			chamber.core = this;
			chamber.container = this.container;
			chamber.data.x = this.x;
			chamber.data.y = this.y;
			chamber.data.z = this.z;
		}
		let net = this.__energyNets.Eu;
		let chamberNets = chamber.__energyNets;
		if(chamberNets.Eu){
			if(chamberNets.Eu != net){
			EnergyNetBuilder.mergeNets(net, chamberNets.Eu);}
		} else {
			for (let side = 0; side < 6; side++) {
				let c = StorageInterface.getRelativeCoords(chamber, side);
				EnergyNetBuilder.buildTileNet(net, c.x, c.y, c.z, side + Math.pow(-1, side));
			}
		}
		chamberNets.Eu = net;
	},
	
	removeChamber: function(chamber){
		this.chambers.splice(this.chambers.indexOf(chamber), 1);
		this.rebuildEnergyNet();
		let x = this.getReactorSize();
		for(let y = 0; y < 6; y++){
			let slot = this.container.getSlot("slot"+(y*9+x));
			if(slot.id > 0){
				World.drop(chamber.x+.5, chamber.y+.5, chamber.z+.5, slot.id, slot.count, slot.data);
				slot.id = slot.count = slot.data = 0;
			}
		}
	},
	
	
	getReactorSize: function(){
		return 3 + this.chambers.length;
	},
	
	click: function(id, count, data, coords){
		if(id == BlockID.reactorChamber) return true;
		return false;
	},
	
	processChambers: function() {
        let size = this.getReactorSize();
        for (let pass = 0; pass < 2; pass++) {
            for (let y = 0; y < 6; y++) {
                for (let x = 0; x < size; x++) {
                    let slot = this.container.getSlot("slot"+(y*9+x));
					let component = ReactorAPI.getComponent(slot.id);
                    if(component){
						component.processChamber(slot, this, x, y, pass == 0);
					}
                }
            }
        }
    },
	
	tick: function(){
		let content = this.container.getGuiContent();
		let reactorSize = this.getReactorSize();
		if (content) {
			for(let y = 0; y < 6; y++){
				for(let x = 0; x < 9; x++){
					let newX = (x < reactorSize) ? 400 + 59 * x : 1400;
					content.elements["slot"+(y*9+x)].x = newX;
				}
			}
		}
		if (this.data.isEnabled) {
			if(World.getThreadTime()%20 == 0){
				this.data.maxHeat = 10000;
				this.data.hem = 1;
				this.data.output = 0;
				this.processChambers();
				this.calculateHeatEffects();
			}
		} else {
			this.data.output = 0;
		}
		this.setActive(this.data.heat >= 1000 || this.data.output > 0);
		
		if(this.data.output > 0){
			this.startPlaySound();
		} else {
			this.stopPlaySound();
		}
		
		this.container.setScale("heatScale", this.data.heat / this.data.maxHeat);
		this.container.setText("textInfo", "Generating: " + this.getEnergyOutput() + " EU/t");
	},
	
	energyTick: function(type, src){
		src.add(this.getEnergyOutput());
	},
	
	redstone: function(signal){
		this.data.isEnabled = signal.power > 0;
	},
	
	getEnergyOutput: function(){
		return parseInt(this.data.output * EUReactorModifier);
	},
	
	startPlaySound: function(){
		if(!Config.machineSoundEnabled){return;}
		if(!this.remove){
			if(!this.audioSource){
				let sound = SoundAPI.playSoundAt(this, "Generators/NuclearReactor/NuclearReactorLoop.ogg", true, 16);
				this.audioSource = sound;
			}
			if(this.data.output < 40){
				var geigerSound = "Generators/NuclearReactor/GeigerLowEU.ogg";
			} else if(this.data.output < 80){
				var geigerSound = "Generators/NuclearReactor/GeigerMedEU.ogg";
			} else {
				var geigerSound = "Generators/NuclearReactor/GeigerHighEU.ogg";
			}
			if(!this.audioSourceGeiger){
				this.audioSourceGeiger = SoundAPI.playSoundAt(this, geigerSound, true, 16);
			} 
			else if(this.audioSourceGeiger.name != geigerSound){
				this.audioSourceGeiger.stop();
				this.audioSourceGeiger = SoundAPI.playSoundAt(this, geigerSound, true, 16);
			}
		}
	},
	stopPlaySound: function(){
		if(this.audioSource && this.audioSource.isPlaying()){
			this.audioSource.stop();
			this.audioSource = null;
		}
		if(this.audioSourceGeiger && this.audioSourceGeiger.isPlaying()){
			this.audioSourceGeiger.stop();
			this.audioSourceGeiger = null;
		}
	},

	getHeat: function(){
		return this.data.heat;
	},
	
	setHeat: function(heat){
		this.data.heat = heat;
	},
	
	addHeat: function(amount){
		this.data.heat += amount;
	},
	
	getMaxHeat: function(){
		return this.data.maxHeat;
	},
	
	setMaxHeat: function(newMaxHeat){
		this.data.maxHeat = newMaxHeat;
	},
	
	getHeatEffectModifier: function(){
		return this.data.hem;
	},
	
	setHeatEffectModifier: function(newHEM){
		this.data.hem = newHEM;
	},
	
	getItemAt: function(x, y) {
        if (x < 0 || x >= this.getReactorSize() || y < 0 || y >= 6) {
            return null;
        }
        return this.container.getSlot("slot"+(y*9+x));
    },
	
	setItemAt: function(x, y, id, count, data) {
        if (x < 0 || x >= this.getReactorSize() || y < 0 || y >= 6) {
            return null;
        }
        this.container.setSlot("slot"+(y*9+x), id, count || 0, data || 0);
    },
	
	addOutput: function(energy){
		this.data.output += energy;
	},
	
	destroyBlock: function(coords, player){
		for(let i in this.chambers){
			let c = this.chambers[i];
			World.destroyBlock(c.x, c.y, c.z, true);
		}
	},
	
	renderModel: MachineRegistry.renderModel,
	
	explode: function() {
		if (this.tnt.length > 0) {
			for(let i = 0; i < this.tnt.length; i++){
				if(!Entity.isExist(this.tnt[i])){
					RadiationAPI.addRadiationSource(this.x + 0.5, this.y + 0.5, this.z + 0.5, this.data.boomPower, 600);
					this.selfDestroy();
					return;
				}
				Entity.setPosition(this.tnt[i], this.x + 0.5, this.y + 0.5, this.z + 0.5);
			}
		} else {
			let explode = false;
			let boomPower = 10;
			let boomMod = 1;
			for (let i = 0; i < this.getReactorSize() * 6; i++) {
				let slot = this.container.getSlot("slot"+i);
				let component = ReactorAPI.getComponent(slot.id);
				if (component) {
					let f = component.influenceExplosion(slot, this)
					if(f > 0 && f < 1){
						boomMod *= f;
					} else {
						if (f >= 1) explode = true;
						boomPower += f;
					}
				}
				this.container.setSlot("slot"+i, 0, 0, 0);
			}
			if(explode){
				this.data.boomPower = Math.min(boomPower * this.data.hem * boomMod, __config__.access("reactor_explosion_max_power"));
				for(let i = 0; i < 5; i++){
					this.tnt.push(Entity.spawn(this.x + 0.5, this.y + 0.5, this.z + 0.5, EntityType.PRIMED_TNT));
				}
			}
		}
		//World.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, 0.5);
	},
	
	calculateHeatEffects: function() {
        let power = this.data.heat / this.data.maxHeat;
        if (power >= 1) {
            this.explode();
        }
		if (power >= 0.85 && Math.random() <= 0.2 * this.data.hem) {
			let coord = this.getRandCoord(2);
			let block = World.getBlockID(coord.x, coord.y, coord.z);
			let material = ToolAPI.getBlockMaterialName(block);
			if (block == BlockID.nuclearReactor){
				let tileEntity = World.getTileEntity(coord.x, coord.y, coord.z);
				if(tileEntity){
					tileEntity.explode();
				}
			}
			else if (material == "stone" || material == "dirt") {
				World.setBlock(coord.x, coord.y, coord.z, 11, 1);
			}
		} 
		if (power >= 0.7 && World.getThreadTime()%20 == 0) {
			let entities = Entity.getAll();
			for(let i in entities){
				let ent = entities[i];
				if(isMob(ent)){
					let c = Entity.getPosition(ent);
					if(Math.abs(this.x + 0.5 - c.x) <= 3 && Math.abs(this.y + 0.5 - c.y) <= 3 && Math.abs(this.z + 0.5 - c.z) <= 3){
						RadiationAPI.addEffect(ent, parseInt(4 * this.data.hem));
					}
				}
			}
		}
		if (power >= 0.5 && Math.random() <= this.data.hem) {
			let coord = this.getRandCoord(2);
			let block = World.getBlockID(coord.x, coord.y, coord.z);
			if(block == 8 || block == 9){
				World.setBlock(coord.x, coord.y, coord.z, 0);
			}
		}
		if (power >= 0.4 && Math.random() <= this.data.hem) {
			let coord = this.getRandCoord(2);
			let block = World.getBlockID(coord.x, coord.y, coord.z);
			let material = ToolAPI.getBlockMaterialName(block);
			if(block != 49 && (material == "wood" || material == "wool" || material == "fibre" || material == "plant")){
				for (let i = 0; i < 6; i++) {
					let c = StorageInterface.getRelativeCoords(coord, i);
					if(World.getBlockID(c.x, c.y, c.z) == 0){
						World.setBlock(c.x, c.y, c.z, 51);
						break;
					}
				}
			}
		}
	},

	getRandCoord: function(r) {
		return {x: this.x + random(-r, r), y: this.y + random(-r, r), z: this.z + random(-r, r)};
	}
});

MachineRegistry.registerGenerator(BlockID.reactorChamber, {
	defaultValues: {
		x: -1,
		y: -1,
		z: -1
	},
	
	core: null,
	removed: false,
	
	getGuiScreen: function(){
		if(this.core){
			return guiNuclearReactor;
		}
		return null;
	},
	
	init: function(){
		if(this.data.y >= 0 && World.getBlockID(this.data.x, this.data.y, this.data.z) == BlockID.nuclearReactor){
			let tileEnt = World.getTileEntity(this.data.x, this.data.y, this.data.z);
			if(tileEnt){
				tileEnt.addChamber(this);
			}
		}
		else for (let i = 0; i < 6; i++) {
			let c = StorageInterface.getRelativeCoords(this, i);
			if(World.getBlockID(c.x, c.y, c.z) == BlockID.nuclearReactor){
				let tileEnt = World.getTileEntity(c.x, c.y, c.z);
				if(tileEnt){
					tileEnt.addChamber(this);
					break;
				}
			}
		}
	},
	
	destroy: function(){
		this.removed = true;
		this.container = new UI.Container();
		if(this.core){
			this.core.removeChamber(this);
		}
	}
});

Block.registerPlaceFunction(BlockID.nuclearReactor, function(coords, item, block){
	for (let i = 0; i < 6; i++) {
		let c = StorageInterface.getRelativeCoords(coords.relative, i);
		if(World.getBlockID(c.x, c.y, c.z) == BlockID.reactorChamber){
			let tileEnt = World.getTileEntity(c.x, c.y, c.z);
			if(tileEnt.core){
				item.count++;
				return;
			}
		}
	}
	World.setBlock(x, y, z, item.id, 0);
	World.addTileEntity(x, y, z);
});

Block.registerPlaceFunction(BlockID.reactorChamber, function(coords, item, block){
	Game.prevent();
	let reactorConnect = 0;
	for (let i = 0; i < 6; i++) {
		let c = StorageInterface.getRelativeCoords(coords.relative, i);
		if(World.getBlockID(c.x, c.y, c.z) == BlockID.nuclearReactor){
			reactorConnect++;
			if(reactorConnect > 1) break;
		}
	}
	if(reactorConnect == 1){
		World.setBlock(x, y, z, item.id, 0);
		World.addTileEntity(x, y, z);
	} else {
		item.count++;
	}
});