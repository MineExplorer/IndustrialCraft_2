/*
BUILD INFO:
  dir: dev
  target: main.js
  files: 75
*/



// file: header.js

/*
  ___               _                 _                    _      ____                         
 |_ _|  _ __     __| |  _   _   ___  | |_   _ __    __ _  | |    / ___|   ___    _ __    ___   
  | |  | '_ \   / _` | | | | | / __| | __| | '__|  / _` | | |   | |      / _ \  | '__|  / _ \  
  | |  | | | | | (_| | | |_| | \__ \ | |_  | |    | (_| | | |   | |___  | (_) | | |    |  __/  
 |___| |_| |_|  \__,_|  \__,_| |___/  \__| |_|     \__,_| |_|    \____|  \___/  |_|     \___|  
 
 by zheka_smirnov (vk.com/zheka_smirnov) and MineExplorer (vk.com/vlad.gr2027)

 This code is a copyright, do not distribute.
*/

// constants
var GUI_BAR_STANDART_SCALE = 3.2;
var debugMode = __config__.access("debug_mode");

// import values, that work faster
var MobEffect = Native.PotionEffect;
var Enchantment = Native.Enchantment;
var BlockSide = Native.BlockSide;
var EntityType = Native.EntityType;

// square lava texture for geothermal generator ui.
LiquidRegistry.getLiquidData("lava").uiTextures.push("gui_lava_texture_16x16");

importLib("ToolType", "*");
importLib("energylib", "*");

var player;
Callback.addCallback("LevelLoaded", function(){
	player = Player.get();
});

function random(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// energy (Eu)
var EU = EnergyTypeRegistry.assureEnergyType("Eu", 1);

// API
function addShapelessRecipe(result, source){
	var ingredients = [];
	for(var i in source){
		var item = source[i];
		for(var n = 0; n < item.count; n++){
			ingredients.push(item);
		}
	}
	Recipes.addShapeless(result, ingredients);
}


var RARE_ITEM_NAME = function(item, name){
	return "§b" + name;
}

var ENERGY_ITEM_NAME = function(item, name){
	var energyStorage = Item.getMaxDamage(item.id) - 1;
	var energyStored = Math.min(energyStorage - item.data + 1, energyStorage);
	if(energyStored==0){return name;}
	return name + "\n§7" + energyStored + "/" + energyStorage + " Eu";
}

var RARE_ENERGY_ITEM_NAME = function(item, name){
	var energyStorage = Item.getMaxDamage(item.id) - 1;
	var energyStored = Math.min(energyStorage - item.data + 1, energyStorage);
	if(energyStored==0){return "§b" + name;}
	return "§b" + name + "\n§7" + energyStored + "/" + energyStorage + " Eu";
}

Block.setDestroyLevel = function(id, lvl){
	Block.registerDropFunction(id, function(coords, blockID, blockData, level, enchant){
		if(level >= lvl){
			return [[blockID, 1, 0]];
		}
		return [];
	}, lvl);
}

Recipes.addFurnaceFuel(325, 10, 2000);

if(debugMode == true){
	var lasttime = -1
	var frame = 0

	Callback.addCallback("tick", function(){
	var t = java.lang.System.currentTimeMillis()
	if (frame++ % 20 == 0){
	if (lasttime != -1){
	tps = 1000 / (t - lasttime) * 20
	Game.tipMessage(Math.round(tps * 10) / 10 + "tps")
	}
	lasttime = t
	}
	});
}




// file: translation.js

﻿// BLOCKS
Translation.addTranslation("Machine Block", {ru: "Машинный блок", es: "Máquina", zh: "基础机械外壳"});
Translation.addTranslation("Advanced Machine Block", {ru: "Улучшенный машинный блок", es: "Máquina Avanzada", zh: "基础机械外壳"});
Translation.addTranslation("Copper Ore", {ru: "Медная руда", es: "Mineral de Cobre", zh: "铜矿石"});
Translation.addTranslation("Tin Ore", {ru: "Оловянная руда", es: "Mineral de Estaño", zh: "锡矿石"});
Translation.addTranslation("Lead Ore", {ru: "Свинцовая руда", es: "Mineral de Plomo", zh: "铅矿石"});
Translation.addTranslation("Uranium Ore", {ru: "Урановая руда", es: "Mineral de Uranium", zh: "铀矿石"});
Translation.addTranslation("Iridium Ore", {ru: "Иридиевая руда",  es: "Mineral de Iridio", zh:"铱矿石"});
Translation.addTranslation("Copper Block", {ru: "Медный блок", es: "Bloque de Cobre", zh: "铜块"});
Translation.addTranslation("Tin Block", {ru: "Оловянный блок", es: "Bloque de Estaño", zh: "锡矿石"});
Translation.addTranslation("Bronze Block", {ru: "Бронзовый блок", es: "Bloque de Bronce", zh: "青铜块"});
Translation.addTranslation("Lead Block", {ru: "Свинцовый блок", es: "Bloque de Plomo", zh: "铅块"});
Translation.addTranslation("Steel Block", {ru: "Стальной блок", es: "Bloque de Hierro Refinado", zh: "钢块"});
Translation.addTranslation("Silver Block", {ru: "Серебряный блок", es: "Bloque de Plata", zh: "银块"});
Translation.addTranslation("Mining Pipe", {ru: "Буровая труба", es: "Tubo Minero", zh: "采矿管道"});
Translation.addTranslation("Reinforced Stone", {ru: "Укреплённый камень", es: "Piedra Reforzada", zh: "防爆石"});
Translation.addTranslation("Reinforced Glass", {ru: "Укреплённое стекло", es: "Cristal Reforzado", zh: "防爆玻璃"});
Translation.addTranslation("Rubber Tree Log", {ru: "Древесина гевеи", es: "Madera de Árbol de Caucho", zh: "橡胶树原木"});
Translation.addTranslation("Rubber Tree Leaves", {ru: "Листва гевеи", es: "Hojas de Arbol de Cáucho", zh: "橡胶树树叶"});
Translation.addTranslation("Rubber Tree Sapling", {ru: "Саженец гевеи", es: "Pimpollo de Árbol de Caucho", zh: "橡胶树树苗"});

// Generators
Translation.addTranslation("Generator", {ru: "Генератор", es: "Generador", zh: "火力发电机"});
Translation.addTranslation("Geothermal Generator", {ru: "Геотермальный генератор", es: "Generador Geotérmico", zh: "地热发电机"});
Translation.addTranslation("Solar Panel", {ru: "Солнечная панель", es: "Panel Solar", zh: "太阳能发电机"});
Translation.addTranslation("Water Mill", {ru: "Гидрогенератор", es: "Molino de Agua", zh: "水力发电机"});
Translation.addTranslation("Wind Mill", {ru: "Ветрогенератор", es: "Molino de Viento", zh: "风力发电机"});

// Machines
Translation.addTranslation("Iron Furnace", {ru: "Железная печь", es: "Horno de Hierro", zh: "铁炉"});
Translation.addTranslation("Electric Furnace", {ru: "Электрическая печь", es: "Horno Eléctrico", zh: "感应炉"});
Translation.addTranslation("Induction Furnace", {ru: "Индукционная печь", es: "Horno de Induccion", zh: "感应炉"});
Translation.addTranslation("Macerator", {ru: "Дробитель", es: "Trituradora", zh: "打粉机"});
Translation.addTranslation("Compressor", {ru: "Компрессор", es: "Compresor", zh: "压缩机"});
Translation.addTranslation("Extractor", {ru: "Экстрактор", es: "Extractor", zh: "提取机"});
Translation.addTranslation("Recycler", {ru: "Утилизатор", es: "Reciclador", zh: "回收机"});
Translation.addTranslation("Metal Former", {ru: "Металлоформовщик", es: "Arqueador de Metal", zh: "金属成型机"});
Translation.addTranslation("Ore Washing Plant", {ru: "Рудопромывочная машина", es: "Planta de Lavado de Minerales", zh: "洗矿机"});
Translation.addTranslation("Thermal Centrifuge", {ru: "Термальная центрифуга", es: "Centrífuga Térmica", zh: "热能离心机"});
Translation.addTranslation("Pump", {ru: "Помпа", es: "Bomba Extractora", zh: "泵"});
Translation.addTranslation("Miner", {ru: "Буровая установка", es: "Perforadora", zh: "采矿机"});
Translation.addTranslation("Advanced Miner", {ru: "Продвинутая буровая установка", es: "Minero Avanzado", zh: "高级采矿机"});
Translation.addTranslation("Teleporter", {ru: "Телепортер", es: "Teletransportador", zh: "传送机"});
Translation.addTranslation("Mass Fabricator", {ru: "Производитель материи", es: "Materializador", zh: "物质生成机"});

// Energy storage
Translation.addTranslation("BatBox", {ru: "Энергохранилище", es: "Caja de Baterías", zh: "储电盒"});
Translation.addTranslation("CESU", {ru: "МЭХ", es: "Unidad CESU", zh: "CESU充电座"});
Translation.addTranslation("MFE", {ru: "МФЭ", es: "Unidad MFE", zh: "MFE充电座"});
Translation.addTranslation("MFSU", {ru: "МФСУ", es: "Unidad MFSU", zh: "MFSU充电座"});


// ITEMS
Translation.addTranslation("Uranium", {ru: "Уран", es: "Bloque de Uranio", zh: "铀"});
Translation.addTranslation("Iridium", {ru: "Иридий", es: "Mineral de Iridio", zh: "铱碎片"});
Translation.addTranslation("Latex", {ru: "Латекс", es: "Caucho", zh: "胶乳"});
Translation.addTranslation("Rubber", {ru: "Резина", es: "Rubber", zh: "橡胶"});
Translation.addTranslation("Scrap", {ru: "Утильсырьё", es: "Chatarra", zh: "废料"});
Translation.addTranslation("Scrap Box", {ru: "Коробка утильсырья", es: "Caja de Chatarra", zh: "废料盒"});
Translation.addTranslation("UU-Matter", {ru: "Материя", es: "Materia", zh: "物质"});
Translation.addTranslation("Coal Ball", {ru: "Угольный шарик", es: "Bola de Carbón", zh: "煤球"});
Translation.addTranslation("Coal Block", {ru: "Сжатый угольный шарик", es: "Bola de Carbón Compactada", zh: "压缩煤球"});
Translation.addTranslation("Coal Chunk", {ru: "Угольная глыба", es: "Carbono Bruto", zh: "煤块"});
Translation.addTranslation("Carbon Fibre", {ru: "Углеволокно", es: "Fibra de Carbono Básica", zh: "粗制碳网"});
Translation.addTranslation("Carbon Mesh", {ru: "Углеткань", es: "Malla de Carbono Básica", zh: "粗制碳板"});
Translation.addTranslation("Carbon Plate", {ru: "Углепластик", es: "Placa de Carbono", zh: "碳板"});
Translation.addTranslation("Alloy Plate", {ru: "Композит", es: "Compuesto Avanzado", zh: "高级合金"});
Translation.addTranslation("Iridium Reinforced Plate", {ru: "Иридиевый композит", es: "Placa de Iridio", zh: "强化铱板"});
Translation.addTranslation("Tool Box", {ru: "Ящик для инструментов", es: "Caja de Herramientas", zh: "工具盒"});

// Electric
Translation.addTranslation("Circuit", {ru: "Электросхема", es: "Circuito Electrónico", zh: "电路板"});
Translation.addTranslation("Advanced Circuit", {ru: "Улучшенная электросхема", es: "Circuito Avanzado", zh: "高级电路板"});
Translation.addTranslation("Coil", {ru: "Катушка", es: "Bobina", zh: "线圈"});
Translation.addTranslation("Electric Motor", {ru: "Электромотор", es: "Motor Eléctrico", zh: "电动马达"});
Translation.addTranslation("Power Unit", {ru: "Силовой агрегат", es: "Unidad de Potencia", zh: "驱动把手"});
Translation.addTranslation("Small Power Unit", {ru: "Малый силовой агрегат", es: "Pequeña Unidad de Potencia", zh: "小型驱动把手"});
Translation.addTranslation("Battery", {ru: "Аккумулятор", es: "Batería Recargable", zh: "充电电池"});
Translation.addTranslation("Advanced Battery", {ru: "Продвинутый аккумулятор", es: "Bateria Recargable Avanzada", zh: "强化充电电池"});
Translation.addTranslation("Energy Crystal", {ru: "Энергетический кристалл", es: "Cristal de Energía", zh: "能量水晶"});
Translation.addTranslation("Lapotron Crystal", {ru: "Лазуротроновый кристалл", es: "Cristal Lapotron", zh: "兰波顿水晶"});

// Upgrades
Translation.addTranslation("MFSU Upgrade Kit", {ru: "Набор улучшения МФСУ", es: "Kit de Actualización MFSU", zh: "MFSU升级组件"});
Translation.addTranslation("Overclocker Upgrade", {ru: "Улучшение «Ускоритель»", es: "Mejora de Sobreproducción", zh: "超频升级"});
Translation.addTranslation("Energy Storage Upgrade", {ru: "Улучшение «Энергохранитель»", es: "Mejora de Almacenador de Energía", zh: "储能升级"});
Translation.addTranslation("Redstone Signal Inverter Upgrade", {ru: "Улучшение «Инвертор сигнала красного камня»", es: "Majora de Invesor de señal Redstone", zh: "红石信号反转升级"});
Translation.addTranslation("Ejector Upgrade", {ru: "Улучшение «Выталкиватель»", es: "Mejora Expulsora", zh: "弹出升级"});
Translation.addTranslation("Fluid Ejector Upgrade", {ru: "Улучшение «Выталкиватель жидкости»", es: "Mejora Expulsora de Líquidos", zh: "流体弹出升级"});
Translation.addTranslation("Pulling Upgrade", {ru: "Улучшение «Загрузчик»", es: "Mejora de traccion", zh: "抽入升级"});

// Crushed Ore
Translation.addTranslation("Crushed Copper Ore", {ru: "Измельченная медная руда", es: "Mineral de Cobre Triturado", zh: "粉碎铜矿石"});
Translation.addTranslation("Crushed Tin Ore", {ru: "Измельчённая оловянная руда", es: "Mineral de Estaño Triturado", zh: "粉碎锡矿石"});
Translation.addTranslation("Crushed Iron Ore", {ru: "Измельчённая железная руда", es: "Mineral de Hierro Triturado", zh: "粉碎铁矿石"});
Translation.addTranslation("Crushed Lead Ore", {ru: "Измельчённая свинцовая руда", es: "Mineral de Plomo Triturado", zh: "粉碎铅矿石"});
Translation.addTranslation("Crushed Gold Ore", {ru: "Измельчённая золотая руда", es: "Mineral de Oro Triturado", zh: "粉碎金矿石"});
Translation.addTranslation("Crushed Silver Ore", {ru: "Измельчённая серебряная руда", es: "Mineral de Plata Triturado", zh: "粉碎银矿石"});
Translation.addTranslation("Crushed Uranium Ore", {ru: "Измельчённая урановая руда", es: "Mineral de Uranio Triturado", zh: "粉碎铀矿石"});

// Purified Ore
Translation.addTranslation("Purified Crushed Copper Ore", {ru: "Очищенная измельчённая медная руда", es: "Mineral de Cobre Triturado y Purificado", zh: "纯净的粉碎铜矿石"});
Translation.addTranslation("Purified Crushed Tin Ore", {ru: "Очищенная измельчённая оловянная руда", es: "Mineral de Estaño Triturado y Purificado", zh: "纯净的粉碎锡矿石"});
Translation.addTranslation("Purified Crushed Iron Ore", {ru: "Очищенная измельчённая железная руда", es: "Mineral de Hierro Triturado y Purificado", zh: "纯净的粉碎铁矿石"});
Translation.addTranslation("Purified Crushed Lead Ore", {ru: "Очищенная измельчённая свинцовая руда", es: "Mineral de Plomo Triturado y Purificado", zh: "纯净的粉碎铅矿石"});
Translation.addTranslation("Purified Crushed Gold Ore", {ru: "Очищенная измельчённая золотая руда", es: "Mineral de Oro Triturado y Purificado", zh: "纯净的粉碎金矿石"});
Translation.addTranslation("Purified Crushed Silver Ore", {ru: "Очищенная измельчённая серебряная руда", es: "Mineral de Plata Triturado y Purificado", zh: "纯净的粉碎银矿石"});
Translation.addTranslation("Purified Crushed Uranium Ore", {ru: "Очищенная измельчённая урановая руда", es: "Mineral de Uranio Triturado y Purificado", zh: "纯净的粉碎铀矿石"});

// Dusts
Translation.addTranslation("Copper Dust", {ru: "Медная пыль", es: "Polvo de Cobre", zh: "铜粉"});
Translation.addTranslation("Tin Dust", {ru: "Оловянная пыль", es: "Polvo de Estaño", zh: "锡粉"});
Translation.addTranslation("Bronze Dust", {ru: "Бронзовая пыль", es: "Polvo de Bronce", zh: "青铜粉"});
Translation.addTranslation("Iron Dust", {ru: "Железная пыль", es: "Polvo de Hierro", zh: "铁粉"});
Translation.addTranslation("Lead Dust", {ru: "Свинцовая пыль", es: "Polvo de Plomo", zh: "铅粉"});
Translation.addTranslation("Gold Dust", {ru: "Золотая пыль", es: "Polvo de Oro", zh: "金粉"});
Translation.addTranslation("Silver Dust", {ru: "Серебряная пыль", es: "Polvo de Plata", zh: "银粉"});
Translation.addTranslation("Stone Dust", {ru: "Каменная пыль", es: "Polvo de Piedra", zh: "石粉"});
Translation.addTranslation("Coal Dust", {ru: "Угольная пыль", es: "Polvo de Carbón", zh: "煤粉"});
Translation.addTranslation("Sulfur Dust", {ru: "Серная пыль", es: "Polvo de Sulfuro", zh: "硫粉"});
Translation.addTranslation("Lapis Dust", {ru: "Лазуритовая пыль", es: "Polvo de Lapislázuli", zh: "青金石粉"});
Translation.addTranslation("Diamond Dust", {ru: "Алмазная пыль", es: "Polvo de Diamante", zh: "钻石粉"});
Translation.addTranslation("Energium Dust", {ru: "Энергетическая пыль", es: "Polvo de Energium", zh: "能量水晶粉"});

// Small Dusts
Translation.addTranslation("Tiny Pile of Copper Dust", {ru: "Небольшая кучка медной пыли", es: "Diminuta Pila de Polvo de Cobre", zh: "小撮铜粉"});
Translation.addTranslation("Tiny Pile of Tin Dust", {ru: "Небольшая кучка оловянной пыли", es: "Diminuta Pila de Polvo de Estaño", zh: "小撮锡粉"});
//Translation.addTranslation("Tiny Pile of Bronze Dust", {ru: "Небольшая кучка бронзовой пыли", es: "Diminuta Pila de Polvo de Bronce", zh: "小撮青铜粉"});
Translation.addTranslation("Tiny Pile of Iron Dust", {ru: "Небольшая кучка железной пыли", es: "Diminuta Pila de Polvo de Hierro", zh: "小撮铁粉"});
Translation.addTranslation("Tiny Pile of Gold Dust", {ru: "Небольшая кучка золотой пыли", es: "Diminuta Pila de Polvo de Oro", zh: "小撮金粉"});
Translation.addTranslation("Tiny Pile of Lead Dust", {ru: "Небольшая кучка свинцовой пыли", es: "Diminuta Pila de Polvo de Plomo", zh: "小撮铅粉"});
Translation.addTranslation("Tiny Pile of Silver Dust", {ru: "Небольшая кучка серебряной пыли", es: "Diminuta Pila de Polvo de Plata", zh: "小撮银粉"});
Translation.addTranslation("Tiny Pile of Sulfur Dust", {ru: "Небольшая кучка серной пыли", es: "Diminuta Pila de Polvo de Sulfuro", zh: "小撮硫粉"});

// Ingots
Translation.addTranslation("Copper Ingot", {ru: "Медный слиток", es: "Lingote de Cobre", zh: "铜锭"});
Translation.addTranslation("Tin Ingot", {ru: "Оловянный слиток", es: "Lingote de Estaño", zh: "锡锭"});
Translation.addTranslation("Bronze Ingot", {ru: "Бронзовый слиток", es: "Lingote de Bronce", zh: "青铜锭"});
Translation.addTranslation("Steel Ingot", {ru: "Стальной слиток", es: "Lingote de Hierro Refinado", zh: "钢锭"});
Translation.addTranslation("Lead Ingot", {ru: "Свинцовый слиток", es: "Lingote de Plomo", zh: "铅锭"});
Translation.addTranslation("Silver Ingot", {ru: "Серебрянный слиток", es: "Lingote de Plata", zh: "银锭"});
Translation.addTranslation("Alloy Ingot", {ru: "Композитный слиток", es: "Lingote de Metal Compuesto", zh: "合金锭"})

// Plates
Translation.addTranslation("Copper Plate", {ru: "Медная пластина", es: "Placa de Cobre", zh: "铜板"});
Translation.addTranslation("Tin Plate", {ru: "Оловянная пластина", es: "Placa de Estaño", zh: "锡板"});
Translation.addTranslation("Iron Plate", {ru: "Железная пластина", es: "Placa de Hierro", zh: "铁板"});
Translation.addTranslation("Bronze Plate", {ru: "Бронзовая пластина", es: "Placa de Bronce", zh: "青铜板"});
Translation.addTranslation("Steel Plate", {ru: "Стальная пластина", es: "Placa de Hierro Refinado", zh: "钢板"});
Translation.addTranslation("Gold Plate", {ru: "Золотая пластина", es: "Placa de Oro", zh: "金板"});
Translation.addTranslation("Lapis Plate", {ru: "Лазуритовая пластина", es: "Placa de Lapislázuli", zh: "青金石板"});
Translation.addTranslation("Lead Plate", {ru: "Свинцовая пластина", es: "Placa de Plomo", zh: "铅板"});

// Casings
Translation.addTranslation("Copper Casing", {ru: "Медная оболочка", es: "Carcasa para Objetos de Cobre", zh: "铜质外壳"});
Translation.addTranslation("Tin Casing", {ru: "Оловянная оболочка", es: "Carcasa para Objetos de Estaño", zh: "锡质外壳"});
Translation.addTranslation("Iron Casing", {ru: "Железная оболочка", es: "Carcasa para Objetos de Hierro", zh: "铁质外壳"});
Translation.addTranslation("Bronze Casing", {ru: "Бронзовая оболочка", es: "Carcasa para Objetos de Bronce", zh: "青铜外壳"});
Translation.addTranslation("Steel Casing", {ru: "Стальная оболочка", es: "Carcasa para Objetos de Hierro", zh: "钢质外壳а"});
Translation.addTranslation("Gold Casing", {ru: "Золотая оболочка", es: "Carcasa para Objetos de Oro", zh: "黄金外壳"});
Translation.addTranslation("Lead Casing", {ru: "Свинцовая оболочка", es: "Carcasa para Objetos de Plomo", zh: "铅质外壳"});

// Cells
Translation.addTranslation("Cell", {ru: "Капсула", es: "Celda Vacía", zh: "空单元"});
Translation.addTranslation("Water Cell", {ru: "Капсула с водой", es: "Celda de Agua", zh: "水单元"});
Translation.addTranslation("Lava Cell", {ru: "Капсула с лавой", es: "Celda de Lava", zh: "岩浆单元"});

// Wires
Translation.addTranslation("Tin Cable", {ru: "Оловянный провод", es: "Cable de Ultra-Baja Tensión", zh: "锡质导线"});
Translation.addTranslation("Tin Cable (insulated)", {ru: "Изолированный оловянный провод", es: "Cable de Estaño Aislado", zh: "绝缘锡质导线"});
Translation.addTranslation("Copper Cable", {ru: "Медный провод", es: "Cable de Cobre", zh: "铜质导线"});
Translation.addTranslation("Copper Cable (insulated)", {ru: "Изолированный медный провод", es: "Cable de Cobre Aislado", zh: "绝缘质铜导线"});
Translation.addTranslation("Gold Cable", {ru: "Золотой провод", es: "Cable de Oro", zh: "金质导线"});
Translation.addTranslation("Gold Cable (insulated x2)", {ru: "Золотой провод с двойной изоляцией", es: "Cable de Oro Aislado x2", zh: "2x绝缘金质导线"});
Translation.addTranslation("HV Cable", {ru: "Высоковольтный провод", es: "Cable de Alta Tensión", zh: "高压导线"});
Translation.addTranslation("HV Cable (insulated x3)", {ru: "Высоковольтный провод с тройной изоляцией", es: "Cable de Alta Tensión Aislado x3", zh: "3x绝缘高压导线"});
Translation.addTranslation("Glass Fibre Cable", {ru: "Стекловолоконный провод", es: "Cable de Alta Tensión", zh: "玻璃纤维导线"});

// Armor
Translation.addTranslation("Bronze Helmet", {ru: "Бронзовый шлем", es: "Casco de Bronce", zh: "青铜头盔"});
Translation.addTranslation("Bronze Chestplate", {ru: "Бронзовый нагрудник", es: "Chaleco de Bronce", zh: "青铜胸甲"});
Translation.addTranslation("Bronze Leggings", {ru: "Бронзовые поножи", es: "Pantalones de Bronce", zh: "青铜护腿"});
Translation.addTranslation("Bronze Boots", {ru: "Бронзовые ботинки", es: "Botas de Bronce", zh: "青铜靴子"});
Translation.addTranslation("Composite Helmet", {ru: "Композитный шлем", es: "Casco de Compuesto", zh: "复合头盔"});
Translation.addTranslation("Composite Chestplate", {ru: "Композитный нагрудник", es: "Chaleco de Compuesto", zh: "复合胸甲"});
Translation.addTranslation("Composite Leggings", {ru: "Композитные поножи", es: "Pantalones de Compuesto", zh: "复合护腿"});
Translation.addTranslation("Composite Boots", {ru: "Композитные ботинки", es: "Botas de Compuesto", zh: "复合靴子"});
Translation.addTranslation("Nightvision Goggles", {ru: "Прибор ночного зрения", es: "Gafas de Vision Nocturna", zh: "夜视镜"});
Translation.addTranslation("Nano Helmet", {ru: "Нано-шлем", es: "Casco de Nanotraje", zh: "纳米头盔"});
Translation.addTranslation("Nano Chestplate", {ru: "Нано-нагрудник", es: "Chaleco de Nanotraje", zh: "纳米胸甲"});
Translation.addTranslation("Nano Leggings", {ru: "Нано-штаны", es: "Pantalones de Nanotraje", zh: "纳米护腿"});
Translation.addTranslation("Nano Boots", {ru: "Нано-ботинки", es: "Botas de Nanotraje", zh: "纳米靴子"});
Translation.addTranslation("Quantum Helmet", {ru: "Квантовый шлем", es: "Casco de Traje Cuántico", zh: "量子头盔"});
Translation.addTranslation("Quantum Chestplate", {ru: "Квантовый нагрудник", es: "Chaleco de Traje Cuántico", zh: "量子护甲"});
Translation.addTranslation("Quantum Leggings", {ru: "Квантовые штаны", es: "Pantalones de Traje Cuántico", zh: "量子护腿"});
Translation.addTranslation("Quantum Boots", {ru: "Квантовые ботинки", es: "Botas de Traje Cuántico", zh: "量子靴子"});
Translation.addTranslation("Jetpack", {ru: "Реактивный ранец", es: "Jetpack Eléctrico", zh: "电力喷气背包"});
Translation.addTranslation("Batpack", {ru: "Аккумуляторный ранец", es: "Mochila de Baterías", zh: "电池背包"});
Translation.addTranslation("Advanced Batpack", {ru: "Продвинутый аккумуляторный ранец", es: "Mochila de Baterías Avanzada", zh: "高级电池背包"});
Translation.addTranslation("Energy Pack", {ru: "Энергетический ранец", es: "Pack de Energía", zh: "能量水晶储电背包"});
Translation.addTranslation("Lappack", {ru: "Лазуротроновый ранец", es: "Mochila de Baterías Avanzada", zh: "兰波顿储电背包"});

// Tools
Translation.addTranslation("Frequency Transmitter", {ru: "Частотный связыватель", es: "Transmisor de Frecuencias", zh: "传送频率遥控器"});
Translation.addTranslation("OD Scanner", {ru: "Сканер КР", es: "Escaner de Densidad", zh: "OD扫描器"});
Translation.addTranslation("OV Scanner", {ru: "Сканер ЦР", es: "Escaner de Riqueza", zh: "OV扫描器"});
Translation.addTranslation("Treetap", {ru: "Краник", es: "Grifo para Resina", zh: "木龙头"});
Translation.addTranslation("Forge Hammer", {ru: "Кузнечный молот", es: "Martillo para Forja", zh: "锻造锤"});
Translation.addTranslation("Cutter", {ru: "Кусачки", es: "Pelacables Universal", zh: "板材切割剪刀"});
Translation.addTranslation("Bronze Sword", {ru: "Бронзовый меч", es: "Espada de Bronce", zh: "青铜剑"});
Translation.addTranslation("Bronze Shovel", {ru: "Бронзовая лопата", es: "Pala de Bronce", zh: "青铜铲"});
Translation.addTranslation("Bronze Pickaxe", {ru: "Бронзовая кирка", es: "Pico de Bronce", zh: "青铜镐"});
Translation.addTranslation("Bronze Axe", {ru: "Бронзовый топор", es: "Hacha de Bronce", zh: "青铜斧"});
Translation.addTranslation("Bronze Hoe", {ru: "Бронзовая мотыга", es: "Azada de Bronce", zh: "青铜锄"});
Translation.addTranslation("Wrench", {ru: "Гаечный ключ", es: "Llave Inglesa", zh: "扳手"});
Translation.addTranslation("Electric Wrench", {ru: "Электроключ", es: "Llave Inglesa Eléctrica", zh: "电动扳手"});
Translation.addTranslation("Electric Hoe", {ru: "Электромотыга", es: "Azada Eléctrica", zh: "电动锄"});
Translation.addTranslation("Electric Treetap", {ru: "Электрокраник", es: "Grifo para Resina Eléctrico", zh: "电动树脂提取器"});
Translation.addTranslation("Chainsaw", {ru: "Электропила", es: "Motosierra", zh: "链锯"});
Translation.addTranslation("Mining Drill", {ru: "Шахтёрский бур", es: "Taladro", zh: "采矿钻头"});
Translation.addTranslation("Diamond Drill", {ru: "Алмазный бур", es: "Taladro de Diamante", zh: "钻石钻头"});
Translation.addTranslation("Iridium Drill", {ru: "Иридиевый бур", es: "Taladro de Iridio", zh: "铱钻头"});
Translation.addTranslation("Nano Saber", {ru: "Нано-сабля", es: "Nano-Sable", zh: "纳米剑"});
Translation.addTranslation("Mining Laser", {ru: "Шахтёрский лазер", es: "Láser Minero", zh: "采矿镭射枪"});




// file: core/machine/define.js

var MachineRegistry = {
	machineIDs: {},

	isMachine: function(id){
		return this.machineIDs[id];
	},

	registerPrototype: function(id, Prototype){
		// register render
		ICRender.getGroup("ic-wire").add(id, -1);
		// register ID
		this.machineIDs[id] = true;
		// setup energy value
		if (Prototype.defaultValues){
			Prototype.defaultValues.energy = 0;
		}
		else{
			Prototype.defaultValues = {
				energy: 0
			};
		}
		// copy functions
		if(!Prototype.getEnergyStorage){
			Prototype.getEnergyStorage = function(){
				return 0;
			};
		}
		/*
		Prototype.click = function(id, count, data, coords){
			if(id==ItemID.wrench || id==ItemID.electricWrench){
				return true;
			}
		}
		*/
		
		ToolAPI.registerBlockMaterial(id, "stone", 1);
		Block.setDestroyTime(id, 3);
		TileEntity.registerPrototype(id, Prototype);
		EnergyTileRegistry.addEnergyTypeForId(id, EU);
	},

	// standart functions
	getMachineDrop: function(coords, blockID, level, standartDrop){
		BlockRenderer.unmapAtCoords(coords.x, coords.y, coords.z);
		var item = Player.getCarriedItem();
		if(item.id==ItemID.wrench){
			ToolAPI.breakCarriedTool(10);
			World.setBlock(coords.x, coords.y, coords.z, 0);
			if(Math.random() < 0.8){return [[blockID, 1, 0]];}
			return [[standartDrop || blockID, 1, 0]];
		}
		if(item.id==ItemID.electricWrench && item.data + 500 <= Item.getMaxDamage(item.id)){
			Player.setCarriedItem(item.id, 1, item.data + 500);
			World.setBlock(coords.x, coords.y, coords.z, 0);
			return [[blockID, 1, 0]];
		}
		if(level >= ToolAPI.getBlockDestroyLevel(blockID)){
			return [[standartDrop || blockID, 1, 0]];
		}
		return [];
	},
	
	initModel: function(){
		if(this.data.isActive){
			var block = World.getBlock(this.x, this.y, this.z);
			MachineRenderer.mapAtCoords(this.x, this.y, this.z, block.id, block.data);
		}
	},
	
	activateMachine: function(){
		if(!this.data.isActive){
			this.data.isActive = true;
			var block = World.getBlock(this.x, this.y, this.z);
			MachineRenderer.mapAtCoords(this.x, this.y, this.z, block.id, block.data);
		}
	},
	
	deactivateMachine: function(){
		if(this.data.isActive){
			this.data.isActive = false;
			BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
		}
	},
	
	basicEnergyReceiveFunc: function(type, src){
		var energyNeed = this.getEnergyStorage() - this.data.energy;
		this.data.energy += src.getAll(energyNeed);
	}
}




// file: core/machine/render.js

var MachineRenderer = {
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
	
	registerRenderModel: function(id, texture, rotation){
		if(rotation){
			this.data[id] = [];
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
				this.data[id].push(render);
			}
		}else{
			var render = new ICRender.Model();
			var model = BlockRenderer.createTexturedBlock(texture);
			render.addEntry(model);
			this.data[id] = [render];
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
	}
}




// file: core/machine/recipe.js

var MachineRecipeRegistry = {
	recipeData: {},
	
	registerRecipesFor: function(name, data, validateKeys){
		if(validateKeys){
			var newData = {};
			for(var key in data){
				var newKey = key;
				if(key.split(":").length < 2){
					newKey = eval(key);
				}
				newData[newKey] = data[key];
			}
			data = newData;
		}
		this.recipeData[name] = data;
	},
	
	addRecipeFor: function(name, source, result){
		this.requireRecipesFor(name, true)[source] = result;
	},
	
	requireRecipesFor: function(name, createIfNotFound){
		if(!this.recipeData[name] && createIfNotFound){
			this.recipeData[name] = {};
		}
		return this.recipeData[name];
	},
	
	getRecipeResult: function(name, key1, key2){
		var data = this.requireRecipesFor(name);
		if(data){
			return data[key1] || data[key1+":"+key2];
		}
	}
}




// file: core/machine/upgrade.js

var UpgradeAPI = {
	_elements: {},

	registerUpgrade: function(id, upgrade){
		UpgradeAPI._elements[id] = upgrade;
	},

	executeUpgrade: function(item, machine, container, data, coords){
		if(UpgradeAPI._elements[item.id]){
			UpgradeAPI._elements[item.id](item.count, machine, container, data, coords);
		}
	},

	executeAll: function(machine){
		var container = machine.container;
		var data = machine.data;
		var coords = {x: machine.x, y: machine.y, z: machine.z};
		
		var upgrades = {};
		for(var slotName in container.slots){
			if(slotName.match(/Upgrade/)){
				var slot = container.getSlot(slotName);
				if(!upgrades[slot.id]){upgrades[slot.id] = slot.count;}
				else{upgrades[slot.id] += slot.count;}
			}
		}
		for(var upgrade in upgrades){
			UpgradeAPI.executeUpgrade({id: upgrade, count: upgrades[upgrade]}, machine, container, data, coords);
		}
		return upgrades;
	},
	
	findNearestContainers: function(coords, direction){
		var directions = {
			up: {x: 0, y: 1, z: 0},
			down: {x: 0, y: -1, z: 0},
			east: {x: 1, y: 0, z: 0},
			west: {x: -1, y: 0, z: 0},
			south: {x: 0, y: 0, z: 1},
			north: {x: 0, y: 0, z: -1},
		}
		var containers = [];
		if(direction){
			dir = directions[direction]
			var container = World.getContainer(coords.x + dir.x, coords.y + dir.y, coords.z + dir.z);
			if(container){containers.push(container);}
		}
		else{
			for(var i in directions){
				var dir = directions[i];
				var container = World.getContainer(coords.x + dir.x, coords.y + dir.y, coords.z + dir.z);
				if(container){containers.push(container);}
			}
		}
		return containers;
	},
	
	findNearestLiquidStorages: function(coords, direction){
		var directions = {
			up: {x: 0, y: 1, z: 0},
			down: {x: 0, y: -1, z: 0},
			east: {x: 1, y: 0, z: 0},
			west: {x: -1, y: 0, z: 0},
			south: {x: 0, y: 0, z: 1},
			north: {x: 0, y: 0, z: -1},
		}
		var storages = [];
		if(direction){
			dir = directions[direction]
			var tileEntity = World.getTileEntity(coords.x + dir.x, coords.y + dir.y, coords.z + dir.z);
			if(tileEntity && tileEntity.liquidStorage){
				storages.push(tileEntity.liquidStorage);
			}
		}
		else{
			for(var i in directions){
				var dir = directions[i];
				var tileEntity = World.getTileEntity(coords.x + dir.x, coords.y + dir.y, coords.z + dir.z);
				if(tileEntity && tileEntity.liquidStorage){
					storages.push(tileEntity.liquidStorage);
				}
			}
		}
		return storages;
	},
}


function addItemsToContainers(items, containers, tile){
	for(var i in items){
		var item = items[i];
		for(var c in containers){
			if(item.count==0){
				item.id = 0;
				item.data = 0;
				break;
			}
			
			var container = containers[c];
			var tileEntity = container.tileEntity;
			var slots = [];
			var slotsInitialized = false;
			
			if(tileEntity){
				if(tileEntity.addTransportedItem){
					tileEntity.addTransportedItem({}, item, {x: tile.x, y: tile.y, z: tile.z});
					continue;
				}
				if(tileEntity.getTransportSlots){
					slots = tileEntity.getTransportSlots().input || [];
					slotsInitialized = true;
				}
			}
			if(!slotsInitialized){
				if(container.slots){
					for(var name in container.slots){
						slots.push(name);
					}
				}else{
					for(var s = 0; s < container.getSize(); s++){
						slots.push(s);
					}
				}
			}
			for(var s in slots){
				var slot = container.getSlot(slots[s]);
				if(item.count <= 0){
					break;
				}
				if(slot.id == 0 || slot.id == item.id && slot.data == item.data){
					var maxstack = slot.id > 0 ? Item.getMaxStack(slot.id) : 64;
					var add = Math.min(maxstack - slot.count, item.count);
					item.count -= add;
					slot.count += add;
					slot.id = item.id;
					slot.data = item.data;
					if(!container.slots){
						container.setSlot(s, slot.id, slot.count, slot.data);
					}
				}
			}
		}
	}
}

function getItemsFrom(items, containers, tile){
	for(var i in items){
		var item = items[i];
		var maxStack = 64;
		var stop = false;
		for(var c in containers){
			var container = containers[c];
			var tileEntity = container.tileEntity;
			var slots = [];
			var slotsInitialized = false;
			
			if(tileEntity && tileEntity.getTransportSlots){
				slots = tileEntity.getTransportSlots().output || [];
				slotsInitialized = true;
			}
			if(!slotsInitialized){
				if(container.slots){
					for(var name in container.slots){
						slots.push(name);
					}
				}else{
					for(var s = 0; s < container.getSize(); s++){
						slots.push(s);
					}
				}
			}
			for(var s in slots){
				var slot = container.getSlot(slots[s]);
				if(slot.id > 0){
					if(tile.addTransportedItem){
						stop = tile.addTransportedItem({}, slot, {});
						if(!container.slots){
							container.setSlot(s, slot.id, slot.count, slot.data);
						}
						if(stop) break;
					}
					else if(item.id == slot.id && item.data == slot.data || item.id == 0){
						maxStack = Item.getMaxStack(slot.id);
						var add = Math.min(maxStack - item.count, slot.count);
						slot.count -= add;
						item.count += add;
						item.id = slot.id;
						item.data = slot.data;
						if(slot.count==0) slot.id = slot.data = 0;
						if(!container.slots){
							container.setSlot(s, slot.id, slot.count, slot.data);
						}
						if(item.count == maxStack){break;}
					}
				}
			}
			if(stop || !tile.addTransportedItem &&  item.count == maxStack){break;}
		}
		if(tile.addTransportedItem){return;}
	}
}


function addLiquidToStorages(liquid, output, input){
	var amount = output.getLiquid(liquid, 1);
	if(amount){
		for(var i in input){
			var storage = input[i];
			amount = storage.addLiquid(liquid, amount);
		}
	}
	output.addLiquid(liquid, amount);
}




// file: block/ore.js

IDRegistry.genBlockID("oreCopper");
Block.createBlock("oreCopper", [
	{name: "Copper Ore", texture: [["ore_copper", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.oreCopper, "stone", 2, true);
Block.setDestroyTime(BlockID.oreCopper, 3);
Block.setDestroyLevel("oreCopper", 2);


IDRegistry.genBlockID("oreTin");
Block.createBlock("oreTin", [
	{name: "Tin Ore", texture: [["ore_tin", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.oreTin, "stone", 2, true);
Block.setDestroyTime(BlockID.oreTin, 3);
Block.setDestroyLevel("oreTin", 2);


IDRegistry.genBlockID("oreLead");
Block.createBlock("oreLead", [
	{name: "Lead Ore", texture: [["ore_lead", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.oreLead, "stone", 2, true);
Block.setDestroyTime(BlockID.oreLead, 3);
Block.setDestroyLevel("oreLead", 2);


IDRegistry.genBlockID("oreUranium");
Block.createBlock("oreUranium", [
	{name: "Uranium Ore", texture: [["ore_uranium", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.oreUranium, "stone", 3, true);
Block.setDestroyTime(BlockID.oreIridium, 3);
Block.setDestroyLevel("oreUranium", 3);


IDRegistry.genBlockID("oreIridium");
Block.createBlock("oreIridium", [
	{name: "Iridium Ore", texture: [["ore_iridium", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.oreIridium, "stone", 4, true);
Block.setDestroyTime(BlockID.oreIridium, 3);
Block.registerDropFunction("oreIridium", function(coords, blockID, blockData, level, enchant){
	if(level > 3){
		if(enchant.silk){
			return [[blockID, 1, 0]];
		}
		var drop = [[ItemID.iridiumChunk, 1, 0]];
		if(Math.random() < enchant.fortune/3 - 1/3){drop.push(drop[0]);}
		ToolAPI.dropOreExp(coords, 12, 28, enchant.experience);
		return drop;
	}
	return [];
}, 4);


var OreGenerator = {
	"copper_ore": __config__.access("ore_gen.copper_ore"),
	"tin_ore": __config__.access("ore_gen.tin_ore"),
	"lead_ore": __config__.access("ore_gen.lead_ore"),
	"uranium_ore": __config__.access("ore_gen.uranium_ore"),
	"iridium_ore": __config__.access("ore_gen.iridium_ore"),
	
	setOre: function(x, y, z, id, data){
		if(World.getBlockID(x, y, z) == 1){
		World.setBlock(x, y, z, id, data);}
	}
}

Callback.addCallback("PostLoaded", function(){
	if(OreGenerator.copper_ore){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < 10; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 10, 70);
				GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreCopper, 0, random(6, 15));
			}
		});
	}
	if(OreGenerator.tin_ore){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < 10; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 1, 52);
				GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreTin, 0, random(4, 10));
			}
		});
	}
	if(OreGenerator.lead_ore){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < 8; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 1, 48);
				GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreLead, 0, random(1, 4));
			}
		});
	}
	if(OreGenerator.uranium_ore){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < 3; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 1, 48);
				GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreUranium, 0, random(1, 4));
			}
		});
	}
	if(OreGenerator.iridium_ore){
		Callback.addCallback("GenerateChunk", function(chunkX, chunkZ){
			if(Math.random() < 0.2){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 1, 100);
				OreGenerator.setOre(coords.x, coords.y, coords.z, BlockID.oreIridium);
			}
		});
	}
});




// file: block/metal.js

IDRegistry.genBlockID("blockCopper");
Block.createBlock("blockCopper", [
	{name: "Copper Block", texture: [["block_copper", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.blockCopper, "stone", 2, true);
Block.setDestroyTime(BlockID.blockCopper, 5);
Block.setDestroyLevel("blockCopper", 2);


IDRegistry.genBlockID("blockTin");
Block.createBlock("blockTin", [
	{name: "Tin Block", texture: [["block_tin", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.blockTin, "stone", 2, true);
Block.setDestroyTime(BlockID.blockTin, 5);
Block.setDestroyLevel("blockTin", 2);


IDRegistry.genBlockID("blockBronze");
Block.createBlock("blockBronze", [
	{name: "Bronze Block", texture: [["block_bronze", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.blockBronze, "stone", 2, true);
Block.setDestroyTime(BlockID.blockBronze, 5);
Block.setDestroyLevel("blockBronze", 2);


IDRegistry.genBlockID("blockLead");
Block.createBlock("blockLead", [
	{name: "Lead Block", texture: [["block_lead", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.blockLead, "stone", 2, true);
Block.setDestroyTime(BlockID.blockLead, 5);
Block.setDestroyLevel("blockLead", 2);


IDRegistry.genBlockID("blockSteel");
Block.createBlock("blockSteel", [
	{name: "Steel Block", texture: [["block_steel", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.blockSteel, "stone", 2, true);
Block.setDestroyTime(BlockID.blockSteel, 5);
Block.setDestroyLevel("blockSteel", 2);


IDRegistry.genBlockID("blockSilver");
Block.createBlock("blockSilver", [
	{name: "Silver Block", texture: [["block_silver", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.blockSilver, "stone", 3, true);
Block.setDestroyTime(BlockID.blockSilver, 5);
Block.setDestroyLevel("blockSilver", 3);


Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.blockCopper, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotCopper, 0]);
	
	Recipes.addShaped({id: BlockID.blockTin, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotTin, 0]);
	
	Recipes.addShaped({id: BlockID.blockBronze, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotBronze, 0]);
	
	Recipes.addShaped({id: BlockID.blockLead, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotLead, 0]);
	
	Recipes.addShaped({id: BlockID.blockSteel, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotSteel, 0]);
	
	Recipes.addShaped({id: BlockID.blockSilver, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotSilver, 0]);
	
	Recipes.addShapeless({id: ItemID.ingotCopper, count: 9, data: 0}, [{id: BlockID.blockCopper, data: 0}]);
	Recipes.addShapeless({id: ItemID.ingotTin, count: 9, data: 0}, [{id: BlockID.blockTin, data: 0}]);
	Recipes.addShapeless({id: ItemID.ingotBronze, count: 9, data: 0}, [{id: BlockID.blockBronze, data: 0}]);
	Recipes.addShapeless({id: ItemID.ingotLead, count: 9, data: 0}, [{id: BlockID.blockLead, data: 0}]);
	Recipes.addShapeless({id: ItemID.ingotSteel, count: 9, data: 0}, [{id: BlockID.blockSteel, data: 0}]);
	Recipes.addShapeless({id: ItemID.ingotSilver, count: 9, data: 0}, [{id: BlockID.blockSilver, data: 0}]);
});




// file: block/basic.js

IDRegistry.genBlockID("machineBlockBasic");
Block.createBlock("machineBlockBasic", [
	{name: "Machine Block", texture: [["machine_top", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.machineBlockBasic, "stone", 1, true);
Block.setDestroyLevel("machineBlockBasic", 1);
Block.setDestroyTime(BlockID.machineBlockBasic, 3);

IDRegistry.genBlockID("machineBlockAdvanced");
Block.createBlock("machineBlockAdvanced", [
	{name: "Advanced Machine Block", texture: [["machine_advanced", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.machineBlockAdvanced, "stone", 1, true);
Block.setDestroyLevel("machineBlockAdvanced", 1);
Block.setDestroyTime(BlockID.machineBlockAdvanced, 3);


Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.machineBlockBasic, count: 1, data: 0}, [
		"xxx",
		"x x",
		"xxx"
	], ['x', ItemID.plateIron, 0]);
	
	Recipes.addShaped({id: BlockID.machineBlockAdvanced, count: 1, data: 0}, [
		" x ",
		"a#a",
		" x "
	], ['x', ItemID.carbonPlate, 0, 'a', ItemID.plateAlloy, 0, '#', BlockID.machineBlockBasic, 0]);
	
	Recipes.addShapeless({id: ItemID.plateIron, count: 8, data: 0}, [{id: BlockID.machineBlockBasic, data: 0}]);
});




// file: block/reinforced.js

var BLOCK_TYPE_REINFORCED_BLOCK = Block.createSpecialType({
	base: 1,
	solid: true,
	destroytime: 5,
	explosionres: 30,
	opaque: false,
	lightopacity: 0
}, "reinforced_block");

IDRegistry.genBlockID("reinforcedStone");
Block.createBlock("reinforcedStone", [
	{name: "Reinforced Stone", texture: [["reinforced_block", 0]], inCreative: true}
], BLOCK_TYPE_REINFORCED_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.reinforcedStone, "stone", 2, true);
Block.setDestroyLevel("reinforcedStone", 2);

IDRegistry.genBlockID("reinforcedGlass");
Block.createBlock("reinforcedGlass", [
	{name: "Reinforced Glass", texture: [["reinforced_glass", 0]], inCreative: true}
], BLOCK_TYPE_REINFORCED_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.reinforcedGlass, "stone", 2, true);
Block.setDestroyLevel("reinforcedGlass", 2);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.reinforcedStone, count: 8, data: 0}, [
		"aaa",
		"axa",
		"aaa"
	], ['x', ItemID.plateAlloy, 0, 'a', 1, 0]);
	
	Recipes.addShaped({id: BlockID.reinforcedGlass, count: 7, data: 0}, [
		"axa",
		"aaa",
		"axa"
	], ['x', ItemID.plateAlloy, 0, 'a', 20, 0]);
	Recipes.addShaped({id: BlockID.reinforcedGlass, count: 7, data: 0}, [
		"aaa",
		"xax",
		"aaa"
	], ['x', ItemID.plateAlloy, 0, 'a', 20, 0]);
});




// file: block/cable.js

IDRegistry.genBlockID("cableTin");
Block.createBlock("cableTin", [
	{name: "tile.cableTin.name", texture: [["cable_block_tin", 0]], inCreative: false}
]);

IDRegistry.genBlockID("cableCopper");
Block.createBlock("cableCopper", [
	{name: "tile.cableCopper.name", texture: [["cable_block_copper", 0]], inCreative: false}
]);

IDRegistry.genBlockID("cableGold");
Block.createBlock("cableGold", [
	{name: "tile.cableGold.name", texture: [["cable_block_gold", 0]], inCreative: false}
]);

IDRegistry.genBlockID("cableIron");
Block.createBlock("cableIron", [
	{name: "tile.cableIron.name", texture: [["cable_block_iron", 0]], inCreative: false}
]);

IDRegistry.genBlockID("cableOptic");
Block.createBlock("cableOptic", [
	{name: "tile.cableOptic.name", texture: [["cable_block_optic", 0]], inCreative: false}
]);

function setupWireRender(id, width, groupName, preventSelfAdd) {
    var render = new ICRender.Model();
    BlockRenderer.setStaticICRender(id, 0, render);
   
    var boxes = [
        {side: [1, 0, 0], box: [0.5 + width / 2, 0.5 - width / 2, 0.5 - width / 2, 1, 0.5 + width / 2, 0.5 + width / 2]},
        {side: [-1, 0, 0], box: [0, 0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2]},
        {side: [0, 1, 0], box: [0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2, 1, 0.5 + width / 2]},
        {side: [0, -1, 0], box: [0.5 - width / 2, 0, 0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2]},
        {side: [0, 0, 1], box: [0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2, 1]},
        {side: [0, 0, -1], box: [0.5 - width / 2, 0.5 - width / 2, 0, 0.5 + width / 2, 0.5 + width / 2, 0.5 - width / 2]},
    ]
   
    var group = ICRender.getGroup(groupName);
    if (!preventSelfAdd) {
        group.add(id, -1);
    }
   
    for (var i in boxes) {
        var box = boxes[i];
       
        var model = BlockRenderer.createModel();
        model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], id, 0);
       
        render.addEntry(model).asCondition(box.side[0], box.side[1], box.side[2], group, 0);
    }
   
    var model = BlockRenderer.createModel();
    model.addBox(0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2, id, 0);
    render.addEntry(model);
    
    width = Math.max(width, 0.5);
    Block.setBlockShape(id, {x: 0.5 - width/2, y: 0.5 - width/2, z: 0.5 - width/2}, {x: 0.5 + width/2, y: 0.5 + width/2, z: 0.5 + width/2});
}

function setupBlockAsWire(id) {
	EU.registerWire(id);
}

setupBlockAsWire(BlockID.cableTin);
setupBlockAsWire(BlockID.cableCopper);
setupBlockAsWire(BlockID.cableGold);
setupBlockAsWire(BlockID.cableIron);
setupBlockAsWire(BlockID.cableOptic);

setupWireRender(BlockID.cableTin, 3/8, "ic-wire");
setupWireRender(BlockID.cableCopper, 3/8, "ic-wire");
setupWireRender(BlockID.cableGold, 1/2, "ic-wire");
setupWireRender(BlockID.cableIron, 5/8, "ic-wire");
setupWireRender(BlockID.cableOptic, 1/4, "ic-wire");

// drop 
Block.registerDropFunction("cableTin", function(){
	return [[ItemID.cableTin1, 1, 0]];
});

Block.registerDropFunction("cableCopper", function(){
	return [[ItemID.cableCopper1, 1, 0]];
});

Block.registerDropFunction("cableGold", function(){
	return [[ItemID.cableGold2, 1, 0]];
});

Block.registerDropFunction("cableIron", function(){
	return [[ItemID.cableIron3, 1, 0]];
});

Block.registerDropFunction("cableOptic", function(){
	return [[ItemID.cableOptic, 1, 0]];;
});




// file: block/mining_pipe.js

IDRegistry.genBlockID("miningPipe");
Block.createBlock("miningPipe", [
	{name: "Mining Pipe", texture: [["mining_pipe", 0]], inCreative: true},
	{name: "tile.mining_pipe.name", texture: [["mining_pipe", 1]], inCreative: false}
]);
ToolAPI.registerBlockMaterial(BlockID.miningPipe, "stone", 1);
Block.setDestroyTime(BlockID.miningPipe, 2);
Block.setBlockShape(BlockID.miningPipe, {x: 5/16, y: 0, z: 5/16}, {x: 11/16, y: 1, z: 11/16}, 0);
Block.setDestroyLevel("miningPipe", 1);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.miningPipe, count: 8, data: 0}, [
		"p p",
		"p p",
		"pxp",
	], ['x', 54, 0, 'p', ItemID.plateIron, 0]);
});




// file: block/rubber_tree.js

function destroyLeaves(x, y, z){
	var max = 0;
	while(World.getBlockID(x, y+max+1, z)==BlockID.rubberTreeLeaves){max++;}
	for(var yy = y; yy <= y+max; yy++){
		for(var xx = x-2; xx <= x+2; xx++){
			for(var zz = z-2; zz <= z+2; zz++){
				if(World.getBlockID(xx, yy, zz)==BlockID.rubberTreeLeaves){
					if(Math.random() < .075){
						World.drop(xx, yy, zz, ItemID.rubberSapling, 1, 0);
					}
					World.setBlock(xx, yy, zz, 0);
				}
			}
		}
	}
}

IDRegistry.genBlockID("rubberTreeLog");
Block.createBlock("rubberTreeLog", [
	{name: "Rubber Tree Log", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 0]], inCreative: false}
], "opaque");
Block.registerDropFunction("rubberTreeLog", function(coords, blockID){
	destroyLeaves(coords.x, coords.y, coords.z);
	return [[blockID, 1, 0]];
});
Block.setDestroyTime(BlockID.rubberTreeLog, 2);
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLog, "wood");

IDRegistry.genBlockID("rubberTreeLogLatex");
Block.createBlock("rubberTreeLogLatex", [
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 2], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 0]], inCreative: false},
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 0], ["rubber_tree_log", 2], ["rubber_tree_log", 0], ["rubber_tree_log", 0]], inCreative: false},
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 2], ["rubber_tree_log", 0]], inCreative: false},
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 2]], inCreative: false}
], "opaque");
Block.registerDropFunction("rubberTreeLogLatex", function(coords, blockID){
	destroyLeaves(coords.x, coords.y, coords.z);
	return [[BlockID.rubberTreeLog, 1, 0], [ItemID.latex, 1, 0]];
});
Block.setDestroyTime(BlockID.rubberTreeLogLatex, 2);
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLogLatex, "wood");

IDRegistry.genBlockID("rubberTreeLeaves");
Block.createBlock("rubberTreeLeaves", [
	{name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: false}
]);
Block.registerDropFunction("rubberTreeLeaves", function(){
	if(Math.random() < .075){
		return [[ItemID.rubberSapling, 1, 0]]
	}
	else {
		return [];
	}
});
Block.setDestroyTime(BlockID.rubberTreeLog, 0.2);
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLeaves, "plant");

Recipes.addShaped({id: 5, count: 3, data: 3}, ["x"], ['x', BlockID.rubberTreeLog, -1]);



var RubberTreeGenerationHelper = {
	/*
	 params: {
		 leaves: {
			 id: 
			 data: 
		 },
		 log: {
			 id: 
			 data:
			 resin: 
		 },
		 height: {
			 min:
			 max:
			 start: 
		 },
		 pike:
		 radius: 
	 }
	*/
	generateCustomTree: function(x, y, z, params){
		var leaves = params.leaves;
		var log = params.log;
		
		var height = parseInt(Math.random() * (0.5 + params.height.max - params.height.min) + params.height.min);
		var resinHeight = -1;
		if(log.resin){
			resinHeight = parseInt(Math.random() * (height - 2)) + 1;
		}
		for(var ys = 0; ys < height; ys++){
			if(ys == resinHeight){
				World.setBlock(x, y + ys, z, log.resin, parseInt(Math.random()*4));
			}
			else{
				World.setFullBlock(x, y + ys, z, log);
			}
		}
		if(params.pike){
			for(var ys = 0; ys < params.pike; ys++){
				World.setFullBlock(x, y + ys + height, z, leaves);
			}
		}
		
		var leavesStart = params.height.start;
		var leavesEnd = height;
		var leavesMiddle = (leavesEnd + leavesStart) / 2;
		var leavesLen = leavesEnd - leavesStart;
		for(var ys = leavesStart; ys < leavesEnd; ys++){
			for(var xs = -params.radius; xs <= params.radius; xs++){
				for(var zs = -params.radius; zs <= params.radius; zs++){
					var d = Math.sqrt(xs*xs + zs*zs) + (Math.random()*0.5 + 0.5) * Math.pow(Math.abs(leavesMiddle - ys) / leavesLen, 1.5) * 1.2;
					var blockID = World.getBlockID(x + xs, y + ys, z + zs);
					if(d <= params.radius + 0.5 && (blockID==0 || blockID==106)){
						World.setFullBlock(x + xs, y + ys, z + zs, leaves);
					}
				}
			}
		}
	},

	generateRubberTree: function(x, y, z, activateTileEntity){
		RubberTreeGenerationHelper.generateCustomTree(x, y, z, {
			log: {
				id: BlockID.rubberTreeLog,
				data: 0,
				resin: BlockID.rubberTreeLogLatex
			},
			leaves: {
				id: BlockID.rubberTreeLeaves,
				data: 0
			},
			height: {
				min: 5,
				max: 7,
				start: 2 + parseInt(Math.random() * 2)
			},
			pike: 2 + parseInt(Math.random() * 1.5),
			radius: 2
		});
		if(activateTileEntity){
			return World.addTileEntity(x, y, z);
		}
	}
}


var ForestBiomeIDs = [4, 18, 27, 28];
var JungleBiomeIDs = [21, 22, 23, 149, 151];
var SwampBiomeIDs = [6, 134];

var RUBBER_TREE_BIOME_DATA = { };
if(__config__.access("rubber_tree_gen.forest_and_plains")){
	RUBBER_TREE_BIOME_DATA[1] = 0.005;
	for(var id in ForestBiomeIDs){
	RUBBER_TREE_BIOME_DATA[ForestBiomeIDs[id]] = 0.025;}
}
if(__config__.access("rubber_tree_gen.jungle")){
	for(var id in JungleBiomeIDs){
	RUBBER_TREE_BIOME_DATA[JungleBiomeIDs[id]] = 0.06;}
}
if(__config__.access("rubber_tree_gen.swamp")){
	for(var id in SwampBiomeIDs){
	RUBBER_TREE_BIOME_DATA[SwampBiomeIDs[id]] = 0.05;}
}

Callback.addCallback("GenerateChunk", function(chunkX, chunkZ){
	if(Math.random() < RUBBER_TREE_BIOME_DATA[World.getBiome((chunkX + 0.5) * 16, (chunkZ + 0.5) * 16)]){
		for(var i = 0; i < 1 + Math.random() * 6; i++){
			var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 64, 128);
			coords = GenerationUtils.findSurface(coords.x, coords.y, coords.z);
			if(World.getBlockID(coords.x, coords.y, coords.z) == 2){
				coords.y++;
				RubberTreeGenerationHelper.generateRubberTree(coords.x, coords.y, coords.z, false);
			}
		}
	}
});




// file: machine/generator/generator.js

IDRegistry.genBlockID("primalGenerator");
Block.createBlockWithRotation("primalGenerator", [
	{name: "Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.primalGenerator, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 0], ["machine_side", 0], ["machine_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.primalGenerator, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 1], ["machine_side", 0], ["machine_side", 0]], true);
//ICRenderLib.addConnectionBlock("bc-container", BlockID.primalGenerator);

Block.registerDropFunction("primalGenerator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.primalGenerator, count: 1, data: 0}, [
		" x ",
		" # ",
		" a "
	], ['#', BlockID.machineBlockBasic, 0, 'a', 61, 0, 'x', ItemID.storageBattery, -1]);
	
	Recipes.addShaped({id: BlockID.primalGenerator, count: 1, data: 0}, [
		" x ",
		"###",
		" a "
	], ['#', ItemID.plateIron, 0, 'a', BlockID.ironFurnace, -1, 'x', ItemID.storageBattery, -1]);
});



var guiGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Generator"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "fire_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_BAR_STANDART_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"burningScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotEnergy": {type: "slot", x: 441, y: 75},
		"slotFuel": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 300, height: 30, text: "10000"}
	}
});


MachineRegistry.registerPrototype(BlockID.primalGenerator, {
    defaultValues: {
		burn: 0,
		burnMax: 0,
		isActive: false
	},
    
	getGuiScreen: function(){
		return guiGenerator;
	},
	
	getTransportSlots: function(){
		return {input: ["slotFuel"]};
	},
	
	getFuel: function(slotName){
		var fuelSlot = this.container.getSlot(slotName);
		if (fuelSlot.id > 0){
			var burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
			if (burn && !LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)){
				fuelSlot.count--;
				this.container.validateSlot(slotName);
				this.activate();
				return burn;
			}
		}
		this.deactivate();
		return 0;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		
		if(this.data.burn <= 0){
			this.data.burn = this.data.burnMax = this.getFuel("slotFuel") / 4;
		}
		if(this.data.burn > 0 && this.data.energy < energyStorage){
			this.data.energy = Math.min(this.data.energy + 10, energyStorage);
			this.data.burn--;
		}
		
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotEnergy"), this.data.energy, 32, 0);
		
		this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", this.data.energy + "/");
		this.container.setText("textInfo2", energyStorage + "");
	},
	
	isGenerator: function() {
		return true;
	},
	
	getEnergyStorage: function(){
		return 10000;
	},
	
	energyTick: function(type, src){
		var output = Math.min(32, this.data.energy);
		this.data.energy += src.add(output) - output;
	},
	
	init: MachineRegistry.initModel,
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy: this.deactivate,
});




// file: machine/generator/geothermal.js

IDRegistry.genBlockID("geothermalGenerator");
Block.createBlockWithRotation("geothermalGenerator", [
	{name: "Geothermal Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.geothermalGenerator, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.geothermalGenerator, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 1], ["machine_side", 0], ["machine_side", 0]], true);
//ICRenderLib.addConnectionBlock("bc-container", BlockID.geothermalGenerator);
//ICRenderLib.addConnectionBlock("bc-fluid", BlockID.geothermalGenerator);

Block.registerDropFunction("geothermalGenerator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.primalGenerator);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.geothermalGenerator, count: 1, data: 0}, [
		"xax",
		"xax",
		"b#b"
	], ['#', BlockID.primalGenerator, -1, 'a', ItemID.cellEmpty, -1, 'b', ItemID.casingIron, -1, 'x', 20, -1]);
});

var guiGeothermalGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Geothermal Generator"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 675, y: 106, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "geothermal_liquid_slot", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"energyScale": {type: "scale", x: 675 + GUI_BAR_STANDART_SCALE * 4, y: 106, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"liquidScale": {type: "scale", x: 450 + GUI_BAR_STANDART_SCALE, y: 150 + GUI_BAR_STANDART_SCALE, direction: 1, value: 0.5, bitmap: "geothermal_empty_liquid_slot", overlay: "geothermal_liquid_slot_overlay", overlayOffset: {x: -GUI_BAR_STANDART_SCALE, y: -GUI_BAR_STANDART_SCALE}, scale: GUI_BAR_STANDART_SCALE},
		"slot1": {type: "slot", x: 441, y: 75},
		"slot2": {type: "slot", x: 441, y: 212},
		"slotEnergy": {type: "slot", x: 695, y: 181},
		"textInfo1": {type: "text", x: 542, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 542, y: 172, width: 300, height: 30, text: "8000 mB"}
	}
});




MachineRegistry.registerPrototype(BlockID.geothermalGenerator, {
	defaultValues: {
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiGeothermalGenerator;
	},
	
	getTransportSlots: function(){
		return {input: ["slot1"], output: ["slot2"]};
	},
	
	init: function(){
		this.liquidStorage.setLimit("lava", 8);
		if(this.data.isActive){
			var block = World.getBlock(this.x, this.y, this.z);
			MachineRenderer.mapAtCoords(this.x, this.y, this.z, block.id, block.data);
		}
	},
	
	destroy: this.deactivate,
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		var slot1 = this.container.getSlot("slot1");
		var slot2 = this.container.getSlot("slot2");
		var empty = LiquidRegistry.getEmptyItem(slot1.id, slot1.data);
		if(empty && empty.liquid == "lava"){
			if(this.liquidStorage.getAmount("lava") <= 7 && (slot2.id == empty.id && slot2.data == empty.data && slot2.count < Item.getMaxStack(empty.id) || slot2.id == 0)){
				this.liquidStorage.addLiquid("lava", 1);
				slot1.count--;
				slot2.id = empty.id;
				slot2.data = empty.data;
				slot2.count++;
				this.container.validateAll();
			}
		}
		if(this.liquidStorage.getAmount("lava") >= 0.001){
			if(this.data.energy <= energyStorage - 20){
				this.data.energy += 20;
				this.liquidStorage.getLiquid("lava", 0.001);
				this.activate();
			}else{
				this.deactivate();
			}
		}
		else{
			this.deactivate();
		}
		
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotEnergy"), this.data.energy, 32, 0);
		
		this.container.setText("textInfo1", parseInt(this.liquidStorage.getAmount("lava") * 1000) + "/");
		this.liquidStorage.updateUiScale("liquidScale", "lava");
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	isGenerator: function() {
		return true;
	},
	
	getEnergyStorage: function(){
		return 10000;
	},
	
	energyTick: function(type, src){
		var output = Math.min(32, this.data.energy);
		this.data.energy += src.add(output) - output;
	},
	
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
});




// file: machine/generator/solar.js

IDRegistry.genBlockID("solarPanel");
Block.createBlock("solarPanel", [
	{name: "Solar Panel", texture: [["machine_bottom", 0], ["solar_panel", 0], ["machine", 0], ["machine", 0], ["machine", 0], ["machine", 0]], inCreative: true}
], "opaque");

Block.registerDropFunction("solarPanel", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.solarPanel, count: 1, data: 0}, [
		"aaa",
		"xxx",
		"b#b"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.dustCoal, 0, 'b', ItemID.circuitBasic, 0, 'a', 20, 0]);
});


var guiSolar = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Solar Panel"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	params: {       
		slot: "default_slot",
		invSlot: "default_slot"              
	},
	
	drawing: [
		{type: "background", color: android.graphics.Color.rgb(179, 179, 179)},
	],
	
	elements: {
		"slotEnergy": {type: "slot", x: 600, y: 130},
		"sun": {type: "image", x: 608, y: 194, bitmap: "sun_off", scale: GUI_BAR_STANDART_SCALE}
	}
});

MachineRegistry.registerPrototype(BlockID.solarPanel, {
	isGenerator: function() {
		return true;
	},
	
	getGuiScreen: function(){
		return guiSolar;
	},
	
	tick: function(){
		var content = this.container.getGuiContent();
		if(World.getLightLevel(this.x, this.y + 1, this.z) == 15){
			this.data.energy = 1;
			this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotEnergy"), 1, 32, 0);
			if(content){ 
				content.elements["sun"].bitmap = "sun_on";
			}
		}
		else if(content){ 
			content.elements["sun"].bitmap = "sun_off";
		}
	},
	
	getEnergyStorage: function(){
		return 1;
	},
	
	energyTick: function(type, src){
		if(this.data.energy){
			src.add(1);
			this.data.energy = 0;
		}
	}
});




// file: machine/generator/windmill.js

IDRegistry.genBlockID("genWindmill");
Block.createBlockWithRotation("genWindmill", [
	{name: "Wind Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["windmill", 0], ["windmill", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "opaque");

Block.registerDropFunction("genWindmill", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.primalGenerator);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.genWindmill, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x"
	], ['#', BlockID.primalGenerator, -1, 'x', ItemID.plateSteel, 0]);
});

MachineRegistry.registerPrototype(BlockID.genWindmill, {
	defaultValues: {
		output: 0
	},
	
	isGenerator: function() {
		return true;
	},

	energyTick: function(type, src){
		if(World.getThreadTime()%20 == 0){
			var height = Math.max(0, Math.min(this.y-64, 96)) / 64;
			var output = height * 140;
			var wether = World.getWeather();
			if(wether.thunder){output *= 5;}
			else if(wether.rain){output *= 1.5;}
			var radius = 4;
			if(World.getBlockID(
					this.x - random(-radius, radius),
					this.y - random(-radius, radius),
					this.z - random(-radius, radius)
				) == 0){
				this.data.output = Math.round(output)/20;
			}else{this.data.output = 0;}
		}
		src.add(this.data.output);
	}
});





// file: machine/generator/watermill.js

IDRegistry.genBlockID("genWatermill");
Block.createBlockWithRotation("genWatermill", [
	{name: "Water Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["watermill", 2], ["watermill", 0], ["watermill", 1], ["watermill", 1]], inCreative: true}
], "opaque");

Block.registerDropFunction("genWatermill", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.primalGenerator);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.genWatermill, count: 1, data: 0}, [
		"axa",
		"x#x",
		"axa"
	], ['#', BlockID.primalGenerator, -1, 'x', 5, -1, 'a', 280, 0]);
});


MachineRegistry.registerPrototype(BlockID.genWatermill, {
	defaultValues: {
		output: 0
	},
	
	isGenerator: function() {
		return true;
	},

	biomeCheck: function(x, z){
		var coords = [[x, z], [x-7, z], [x+7, z], [x, z-7], [x, z+7]];
		for(var c in coords){
			var biome = World.getBiome(c[0], c[1]);
			if(biome==0 || biome==24){return "ocean";}
			if(biome==7){return "river";}
		}
		return 0;
	},

	energyTick: function(type, src){
		if(World.getThreadTime()%20 == 0){
			this.data.output = 0;
			var biome = this.biomeCheck(this.x, this.z);
			if(biome && this.y >= 32 && this.y < 64){
				var output = 50;
				var radius = 1;
				var wether = World.getWeather();
				if(wether.thunder && wether.rain){
					if(wether.thunder){output *= 2;}
					else{output *= 1.5;}
				}
				else if(biome=="ocean"){
					output *= 1.5*Math.sin(World.getWorldTime()%6000/(6000/Math.PI));
				}
				var tile = World.getBlockID(
					this.x - random(-radius, radius),
					this.y - random(-radius, radius),
					this.z - random(-radius, radius)
				);
				if(tile == 8 || tile == 9){
					this.data.output = Math.round(output)/20;
				}
			}
		}
		src.add(this.data.output);
	}
});




// file: machine/storage/charge_registry.js

var ChargeItemRegistry = {
	chargeData: {},
	
	registerItem: function(item, energy, level, preventUncharge, isTool){
		Item.setMaxDamage(item, energy + 1);
		this.chargeData[item] = {
			type: "normal",
			id: item,
			level: level || 0,
			maxDamage: energy + 1,
			maxCharge: energy,
			preventUncharge: preventUncharge,
			isTool: isTool
		};
	},
	
	registerFlashItem: function(item, energy, level){
		this.chargeData[item] = {
			type: "flash",
			id: item,
			level: level || 0,
			energy: energy,
		};
	},
	
	getItemData: function(id){
		return this.chargeData[id];
	},
	
	isFlashStorage: function(id){
		var data = this.getItemData(id);
		return data && data.type == "flash";
	},
	
	getEnergyFrom: function(item, amount, level, getFromAll){
		if(item.id==ItemID.debugItem){
			return amount;
		}
		
		level = level || 0;
		var data = this.getItemData(item.id);
		if(!data || data.level > level || !getFromAll && data.preventUncharge){
			return 0;
		}
		if(data.type == "flash"){
			if(amount < 1){
				return 0;
			}
			item.count--;
			if(item.count < 1){
				item.id = item.data = 0;
			}
			return data.energy;
		}
		if(item.data < 1){
			item.data = 1;
		}
		
		var energyGot = Math.min(amount, data.maxDamage - item.data);
		item.data += energyGot;
		return energyGot;
	},
	
	addEnergyTo: function(item, energy, transf, level){
		level = level || 0;
		var data = this.getItemData(item.id);
		if(!data || data.type == "flash" || data.level > level){
			return 0;
		}
		
		var energyAdd = Math.min(energy, Math.min(item.data - 1, transf));
		item.data -= energyAdd;
		return energyAdd;
	},
	
	getEnergyStored: function(item){
		var data = this.getItemData(item.id);
		if(!data){
			return 0;
		}
		return data.maxDamage - item.data;
	}
}

ChargeItemRegistry.registerFlashItem(331, 500, 0); // redstone

Callback.addCallback("tick", function(){
	var item = Player.getCarriedItem();
	var data = ChargeItemRegistry.getItemData(item.id);
	if(item.data==0 && data && data.type != "flash"){
		Player.setCarriedItem(item.id, 1, 1);
	}
});




// file: machine/storage/bat_box.js

IDRegistry.genBlockID("storageBatBox");
Block.createBlockWithRotation("storageBatBox", [
	{name: "BatBox", texture: [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_side", 1], ["batbox_front", 0], ["batbox_side", 0], ["batbox_side", 0]], inCreative: true}
], "opaque");

Block.registerDropFunction("storageBatBox", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.storageBatBox, count: 1, data: 0}, [
		"xax",
		"bbb",
		"xxx"
	], ['a', ItemID.cableTin1, 0, 'x', 5, -1, 'b', ItemID.storageBattery, -1]);
});


var guiBatBox = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Bat-Box"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_BAR_STANDART_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"slot1": {type: "slot", x: 441, y: 75},
		"slot2": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 350, height: 30, text: "10000"}
	}
});




MachineRegistry.registerPrototype(BlockID.storageBatBox, {
	isStorage: true,
	
	getGuiScreen: function(){
		return guiBatBox;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage);
		
		var TRANSFER = 32;
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), Math.min(TRANSFER, energyStorage - this.data.energy), 0);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), this.data.energy, TRANSFER, 0);
	},
	
	getEnergyStorage: function(){
		return 40000;
	},
	
	energyTick: function(type, src){
		var TRANSFER = 32;
		this.data.energy += src.storage(Math.min(TRANSFER*4, this.getEnergyStorage() - this.data.energy), Math.min(TRANSFER, this.data.energy));
	}
});

ToolAPI.registerBlockMaterial(BlockID.storageBatBox, "wood");




// file: machine/storage/CESU.js

IDRegistry.genBlockID("storageCESU");
Block.createBlockWithRotation("storageCESU", [
	{name: "CESU", texture: [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]], inCreative: true}
], "opaque");

Block.registerDropFunction("storageCESU", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.storageCESU, count: 1, data: 0}, [
		"bxb",
		"aaa",
		"bbb"
	], ['x', ItemID.cableCopper1, 0, 'a', ItemID.storageAdvBattery, -1, 'b', ItemID.plateBronze, 0]);
});


var guiCESU = new UI.StandartWindow({
	standart: {
		header: {text: {text: "CESU"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_BAR_STANDART_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"slot1": {type: "slot", x: 441, y: 75},
		"slot2": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 300, height: 30, text: "10000"}
	}
});






MachineRegistry.registerPrototype(BlockID.storageCESU, {
	isStorage: true,
	
	getGuiScreen: function(){
		return guiCESU;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage + "");
		
		var TRANSFER = 256;
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), Math.min(TRANSFER, energyStorage - this.data.energy), 1);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), this.data.energy, TRANSFER, 1);
	},
	
	getEnergyStorage: function(){
		return 300000;
	},
	
	energyTick: function(type, src){
		var TRANSFER = 128;
		this.data.energy += src.storage(Math.min(TRANSFER*4, this.getEnergyStorage() - this.data.energy), Math.min(TRANSFER, this.data.energy));
	}
});




// file: machine/storage/MFE.js

IDRegistry.genBlockID("storageMFE");
Block.createBlockWithRotation("storageMFE", [
	{name: "MFE", texture: [["machine_top", 0], ["machine_top", 0], ["mfe", 2], ["mfe", 0], ["mfe", 1], ["mfe", 1]], inCreative: true}
], "opaque");

Block.registerDropFunction("storageMFE", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.storageMFE, count: 1, data: 0}, [
		"bab",
		"axa",
		"bab"
	], ['x', BlockID.machineBlockBasic, 0, 'a', ItemID.storageCrystal, -1, 'b', ItemID.cableGold2, 0]);
});


var guiMFE = new UI.StandartWindow({
	standart: {
		header: {text: {text: "MFE"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_BAR_STANDART_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"slot1": {type: "slot", x: 441, y: 75},
		"slot2": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 300, height: 30, text: "10000"}
	}
});






MachineRegistry.registerPrototype(BlockID.storageMFE, {
	isStorage: true,
	
	getGuiScreen: function(){
		return guiMFE;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage + "");
		
		var TRANSFER = 2048;
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), Math.min(TRANSFER, energyStorage - this.data.energy), 2);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), this.data.energy, TRANSFER, 2);
	},
	
	getEnergyStorage: function(){
		return 4000000;
	},
	
	energyTick: function(type, src){
		var TRANSFER = 512;
		this.data.energy += src.storage(Math.min(TRANSFER*4, this.getEnergyStorage() - this.data.energy), Math.min(TRANSFER, this.data.energy));
	}
});




// file: machine/storage/MFSU.js

IDRegistry.genBlockID("storageMFSU");
Block.createBlockWithRotation("storageMFSU", [
	{name: "MFSU", texture: [["mfsu", 0], ["mfsu", 1], ["mfsu", 1], ["mfsu", 2], ["mfsu", 1], ["mfsu", 1]], inCreative: true}
], "opaque");

Block.registerDropFunction("storageMFSU", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockAdvanced);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.storageMFSU, count: 1, data: 0}, [
		"aca",
		"axa",
		"aba"
	], ['b', BlockID.storageMFE, -1, 'a', ItemID.storageLapotronCrystal, -1, 'x', BlockID.machineBlockAdvanced, 0, 'c', ItemID.circuitAdvanced, 0]);
});


var guiMFSU = new UI.StandartWindow({
	standart: {
		header: {text: {text: "MFSU"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_BAR_STANDART_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"slot1": {type: "slot", x: 441, y: 75},
		"slot2": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 642, y: 142, width: 350, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 350, height: 30, text: "10000"}
	}
});




MachineRegistry.registerPrototype(BlockID.storageMFSU, {
	isStorage: true,
	
	getGuiScreen: function(){
		return guiMFSU;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage + "");
		
		var TRANSFER = 8192;
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), Math.min(TRANSFER, energyStorage - this.data.energy), 3);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), this.data.energy, TRANSFER, 3);
	},
	
	getEnergyStorage: function(){
		return 40000000;
	},
	
	energyTick: function(type, src){
		var TRANSFER = 2048;
		this.data.energy += src.storage(Math.min(TRANSFER*4, this.getEnergyStorage() - this.data.energy), Math.min(TRANSFER, this.data.energy));
	}
});




// file: machine/processing/iron_furnace.js

IDRegistry.genBlockID("ironFurnace");
Block.createBlockWithRotation("ironFurnace", [
	{name: "Iron Furnace", texture: [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 0], ["iron_furnace_side", 0], ["iron_furnace_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.ironFurnace, [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 0], ["iron_furnace_side", 0], ["iron_furnace_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.ironFurnace, [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 1], ["iron_furnace_side", 0], ["iron_furnace_side", 0]], true);
//ICRenderLib.addConnectionBlock("bc-container", BlockID.ironFurnace);

Block.registerDropFunction("ironFurnace", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.ironFurnace, count: 1, data: 0}, [
		" x ",
		"x x",
		"x#x"
	], ['#', 61, -1, 'x', ItemID.plateIron, 0]);
});


var guiIronFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Iron Furnace"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "furnace_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "fire_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "furnace_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"burningScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotFuel": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 625, y: 142},
	}
});


MachineRegistry.registerPrototype(BlockID.ironFurnace, {
	defaultValues: {
		progress: 0,
		burn: 0,
		burnMax: 0,
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiIronFurnace;
	},
	
	addTransportedItem: function(self, item, direction){
		var fuelSlot = this.container.getSlot("slotFuel");
		if(Recipes.getFuelBurnDuration(item.id, item.data) && (fuelSlot.id==0 || fuelSlot.id==item.id && fuelSlot.data==item.data && fuelSlot.count < 64)){
			var add = Math.min(item.count, 64 - slotFuel.count);
			item.count -= add;
			fuelSlot.id = item.id;
			fuelSlot.data = item.data;
			fuelSlot.count += add;
			if(!item.count){return;}
		}
		
		var sourceSlot = this.container.getSlot("slotSource");
		if(sourceSlot.id==0 || sourceSlot.id==item.id && sourceSlot.data==item.data && sourceSlot.count < 64){
			var add = Math.min(item.count, 64 - sourceSlot.count);
			item.count -= add;
			sourceSlot.id = item.id;
			sourceSlot.data = item.data;
			sourceSlot.count += add;
			if(!item.count){return;}
		}
	},
	
	getTransportSlots: function(){
		return {input: ["slotSource", "slotFuel"], output: ["slotResult"]};
	},
	
	tick: function(){
		var sourceSlot = this.container.getSlot("slotSource");
		var result = Recipes.getFurnaceRecipeResult(sourceSlot.id, "iron");
		
		if(this.data.burn > 0){
			this.data.burn--;
		}
		if(this.data.burn==0 && result){
			this.data.burn = this.data.burnMax = this.getFuel("slotFuel");
		}
		
		if(result && this.data.burn > 0){
			var resultSlot = this.container.getSlot("slotResult");
			if((resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0) && this.data.progress++ >= 160){
				sourceSlot.count--;
				resultSlot.id = result.id;
				resultSlot.data = result.data;
				resultSlot.count++;
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else{
			this.data.progress = 0;
		}
		
		if(this.data.burn > 0){
			this.activate();
		}else{
			this.deactivate();
		}
		
		this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
		this.container.setScale("progressScale", this.data.progress / 160);
	},
	
	getFuel: function(slotName){
		var fuelSlot = this.container.getSlot(slotName);
		if(fuelSlot.id > 0){
			var burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
			if(burn){
				if(LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)){
					var empty = LiquidRegistry.getEmptyItem(fuelSlot.id, fuelSlot.data);
					fuelSlot.id = empty.id;
					fuelSlot.data = empty.data;
					return burn;
				}
				fuelSlot.count--;
				this.container.validateSlot(slotName);
				return burn;
			}
		}
		return 0;
	},
	
	init: MachineRegistry.initModel,
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy: this.deactivate,
});




// file: machine/processing/electric_furnace.js

IDRegistry.genBlockID("electricFurnace");
Block.createBlockWithRotation("electricFurnace", [
	{name: "Electric Furnace", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 1], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.electricFurnace, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 0], ["machine_side", 0], ["machine_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.electricFurnace, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 1], ["machine_side", 0], ["machine_side", 0]], true);
//ICRenderLib.addConnectionBlock("bc-container", BlockID.electricFurnace);

Block.registerDropFunction("electricFurnace", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.ironFurnace);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.electricFurnace, count: 1, data: 0}, [
		" a ",
		"x#x"
	], ['#', BlockID.ironFurnace, -1, 'x', 331, 0, 'a', ItemID.circuitBasic, 0]);
});

var guiElectricFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Electric Furnace"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "furnace_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "furnace_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotEnergy": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 625, y: 142},
		"slotUpgrade1": {type: "slot", x: 820, y: 48},
		"slotUpgrade2": {type: "slot", x: 820, y: 112},
		"slotUpgrade3": {type: "slot", x: 820, y: 176},
		"slotUpgrade4": {type: "slot", x: 820, y: 240}
	}
});


MachineRegistry.registerPrototype(BlockID.electricFurnace, {
	defaultValues: {
		energy_storage: 2000,
		energy_consumption: 3,
		work_time: 130,
		progress: 0,
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiElectricFurnace;
	},
	
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeAll(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var resultSlot = this.container.getSlot("slotResult");
		var result = Recipes.getFurnaceRecipeResult(sourceSlot.id, "iron");
		if(result && (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0)){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				this.activate();
			}
			else{
				this.deactivate();
			}
			if(this.data.progress >= 1){
				sourceSlot.count--;
				resultSlot.id = result.id;
				resultSlot.data = result.data;
				resultSlot.count++;
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else {
			this.data.progress = 0;
			this.deactivate();
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	init: MachineRegistry.initModel,
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy: this.deactivate,
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});




// file: machine/processing/induction_furnace.js

IDRegistry.genBlockID("inductionFurnace");
Block.createBlockWithRotation("inductionFurnace", [
	{name: "Induction Furnace", texture: [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.inductionFurnace, [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.inductionFurnace, [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]], true);
//ICRenderLib.addConnectionBlock("bc-container", BlockID.inductionFurnace);

Block.registerDropFunction("inductionFurnace", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockAdvanced);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.inductionFurnace, count: 1, data: 0}, [
		"xxx",
		"x#x",
		"xax"
	], ['#', BlockID.electricFurnace, -1, 'x', ItemID.ingotCopper, 0, 'a', BlockID.machineBlockAdvanced, 0]);
});


var guiInductionFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Induction Furnace"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 630, y: 146, bitmap: "furnace_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 550, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 630, y: 146, direction: 0, value: 0.5, bitmap: "furnace_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 550, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource1": {type: "slot", x: 511, y: 75},
		"slotSource2": {type: "slot", x: 571, y: 75},
		"slotEnergy": {type: "slot", x: 541, y: 212},
		"slotResult1": {type: "slot", x: 725, y: 142},
		"slotResult2": {type: "slot", x: 785, y: 142},
		"slotUpgrade1": {type: "slot", x: 900, y: 80},
		"slotUpgrade2": {type: "slot", x: 900, y: 144},
		"slotUpgrade3": {type: "slot", x: 900, y: 208},
		"textInfo1": {type: "text", x: 402, y: 143, width: 100, height: 30, text: "Heat:"},
		"textInfo2": {type: "text", x: 402, y: 173, width: 100, height: 30, text: "0%"},
	}
});


MachineRegistry.registerPrototype(BlockID.inductionFurnace, {
	defaultValues: {
		energy_storage: 10000,
		progress: 0,
		isActive: false,
		isHeating: false,
		heat: 0,
		upgrades: {}
	},
	
	getGuiScreen: function(){
		return guiInductionFurnace;
	},
		
	getTransportSlots: function(){
		return {input: ["slotSource1", "slotSource2"], output: ["slotResult1", "slotResult2"]};
	},
	
	getResult: function(){
		var sourceSlot1 = this.container.getSlot("slotSource1");
		var sourceSlot2 = this.container.getSlot("slotSource2");
		var result1 = Recipes.getFurnaceRecipeResult(sourceSlot1.id, "iron");
		var result2 = Recipes.getFurnaceRecipeResult(sourceSlot2.id, "iron");
		if(result1 || result2){
			return {
				result1: result1,
				result2: result2
			};
		}
	},
	
	putResult: function(result, sourceSlot, resultSlot){
		if(result){
			if(resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0){
				sourceSlot.count--;
				resultSlot.id = result.id;
				resultSlot.data = result.data;
				resultSlot.count++;
				return true;
			}
		}
	},
	
	tick: function(){
		this.data.energy_storage = 10000;
		this.data.upgrades = UpgradeAPI.executeAll(this);
		
		var result = this.getResult();
		if(result){
			if(this.data.energy > 15 && this.data.progress < 1){
				this.data.energy -= 16;
				if(this.data.heat < 5000){this.data.heat++;}
				this.data.progress += this.data.heat/60000;
				this.activate();
			}
			else{
				this.deactivate();
			}
			if(this.data.progress >= 1){
				var put1 = this.putResult(result.result1, this.container.getSlot("slotSource1"), this.container.getSlot("slotResult1"));
				var put2 = this.putResult(result.result2, this.container.getSlot("slotSource2"), this.container.getSlot("slotResult2"));
				if(put1 || put2){
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
			this.deactivate();
			if(this.data.isHeating && this.data.energy > 0){
				if(this.data.heat < 5000){this.data.heat++;}
				this.data.energy--;
			}
			else if(this.data.heat > 0){
				this.data.heat--;
			}
		}
		
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 1);
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo2", parseInt(this.data.heat / 50) + "%");
	},
	
	redstone: function(signal){
		this.data.isHeating = signal.power > 0;
		if(this.data.upgrades[ItemID.upgradeRedstone]){
			this.data.isHeating = !this.data.isHeating;
		}
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	init: MachineRegistry.initModel,
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy: this.deactivate,
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});




// file: machine/processing/macerator.js

﻿IDRegistry.genBlockID("macerator");
Block.createBlockWithRotation("macerator", [
    {name: "Macerator", texture: [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["macerator_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.macerator, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["macerator_front", 0], ["machine_side", 0], ["machine_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.macerator, [["machine_bottom", 0], ["macerator_top", 1], ["machine_side", 0], ["macerator_front", 1], ["machine_side", 0], ["machine_side", 0]], true);
//ICRenderLib.addConnectionBlock("bc-container", BlockID.macerator);

Block.registerDropFunction("macerator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
    Recipes.addShaped({id: BlockID.macerator, count: 1, data: 0}, [
        "xxx",
        "b#b",
        " a "
    ], ['#', BlockID.machineBlockBasic, 0, 'x', 318, 0, 'b', 4, -1, 'a', ItemID.circuitBasic, 0]);
});

var guiMacerator = new UI.StandartWindow({
    standart: {
        header: {text: {text: "Macerator"}},
        inventory: {standart: true},
        background: {standart: true}
    },
    
    drawing: [
        {type: "bitmap", x: 530, y: 146, bitmap: "macerator_bar_background", scale: GUI_BAR_STANDART_SCALE},
        {type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
    ],
    
    elements: {
        "progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "macerator_bar_scale", scale: GUI_BAR_STANDART_SCALE},
        "energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
        "slotSource": {type: "slot", x: 441, y: 75},
        "slotEnergy": {type: "slot", x: 441, y: 212},
        "slotResult": {type: "slot", x: 625, y: 142},
		"slotUpgrade1": {type: "slot", x: 820, y: 48},
		"slotUpgrade2": {type: "slot", x: 820, y: 112},
		"slotUpgrade3": {type: "slot", x: 820, y: 176},
		"slotUpgrade4": {type: "slot", x: 820, y: 240}
    }
});

Callback.addCallback("PreLoaded", function(){
	MachineRecipeRegistry.registerRecipesFor("macerator", {
		// ores
		14: {id: ItemID.crushedGold, count: 2, data: 0},
		15: {id: ItemID.crushedIron, count: 2, data: 0},
		"BlockID.oreCopper": {id: ItemID.crushedCopper, count: 2, data: 0},
		"BlockID.oreTin": {id: ItemID.crushedTin, count: 2, data: 0},
		"BlockID.oreLead": {id: ItemID.crushedLead, count: 2, data: 0},
		"BlockID.oreSilver": {id: ItemID.crushedSilver, count: 2, data: 0},
		"BlockID.oreUranium": {id: ItemID.crushedUranium, count: 2, data: 0},
		// ingots
		265: {id: ItemID.dustIron, count: 1, data: 0},
		266: {id: ItemID.dustGold, count: 1, data: 0},
		"ItemID.ingotCopper": {id: ItemID.dustCopper, count: 1, data: 0},
		"ItemID.ingotTin": {id: ItemID.dustTin, count: 1, data: 0},
		"ItemID.ingotBronze": {id: ItemID.dustBronze, count: 1, data: 0},
		"ItemID.ingotSteel": {id: ItemID.dustIron, count: 1, data: 0},
		"ItemID.ingotLead": {id: ItemID.dustLead, count: 1, data: 0},
		"ItemID.ingotSilver": {id: ItemID.dustSilver, count: 1, data: 0},
		// plates
		"ItemID.plateIron": {id: ItemID.dustIron, count: 1, data: 0},
		"ItemID.plateGold": {id: ItemID.dustGold, count: 1, data: 0},
		"ItemID.plateCopper": {id: ItemID.dustCopper, count: 1, data: 0},
		"ItemID.plateTin": {id: ItemID.dustTin, count: 1, data: 0},
		"ItemID.plateBronze": {id: ItemID.dustBronze, count: 1, data: 0},
		"ItemID.plateSteel": {id: ItemID.dustIron, count: 1, data: 0},
		"ItemID.plateLead": {id: ItemID.dustLead, count: 1, data: 0},
		"ItemID.plateLapis": {id: ItemID.dustLapis, count: 1, data: 0},
		// other resources
		22: {id: ItemID.dustLapis, count: 9, data: 0},
		173: {id: ItemID.dustCoal, count: 9, data: 0},
		"263:0": {id: ItemID.dustCoal, count: 1, data: 0},
		264: {id: ItemID.dustDiamond, count: 1, data: 0},
		"351:4": {id: ItemID.dustLapis, count: 1, data: 0},
		// other materials
		1: {id: 4, count: 1, data: 0},
		4: {id: 12, count: 1, data: 0},
		13: {id: 318, count: 1, data: 0},
		35: {id: 287, count: 2, data: 0},
		79: {id: 332, count: 4, data: 0},
		89: {id: 348, count: 4, data: 0},
		152: {id: 331, count: 9, data: 0},
		155: {id: 406, count: 4, data: 0},
		156: {id: 406, count: 6, data: 0},
		352: {id: 351, count: 5, data: 15}, 
		369: {id: 377, count: 5, data: 0}
	}, true);
});

MachineRegistry.registerPrototype(BlockID.macerator, {
    defaultValues: {
		energy_storage: 2000,
		energy_consumption: 2,
		work_time: 300,
		progress: 0,
		isActive: false
    },
    
    getGuiScreen: function(){
        return guiMacerator;
    },
    
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
    tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeAll(this);
		
        var sourceSlot = this.container.getSlot("slotSource");
        var resultSlot = this.container.getSlot("slotResult");
        var result = MachineRecipeRegistry.getRecipeResult("macerator", sourceSlot.id, sourceSlot.data);
        if(result && (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= 64 - result.count || resultSlot.id == 0)){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				this.activate();
			}
			else{
				this.deactivate();
			}
			if(this.data.progress >= 1){
				sourceSlot.count--;
				resultSlot.id = result.id;
				resultSlot.data = result.data;
				resultSlot.count += result.count;
				this.container.validateAll();
				this.data.progress = 0;
			}
        }
        else {
            this.data.progress = 0;
            this.deactivate();
        }
        
        var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
        
        this.container.setScale("progressScale", this.data.progress);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    
    getEnergyStorage: function(){
        return this.data.energy_storage;
    },
    
    init: MachineRegistry.initModel,
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy: this.deactivate,
    energyTick: MachineRegistry.basicEnergyReceiveFunc
});




// file: machine/processing/recycler.js

IDRegistry.genBlockID("recycler");
Block.createBlockWithRotation("recycler", [
	{name: "Recycler", texture: [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["recycler_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.recycler, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["recycler_front", 0], ["machine_side", 0], ["machine_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.recycler, [["machine_bottom", 0], ["macerator_top", 1], ["machine_side", 0], ["recycler_front", 1], ["machine_side", 0], ["machine_side", 0]], true);
//ICRenderLib.addConnectionBlock("bc-container", BlockID.recycler);

Block.registerDropFunction("recycler", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.recycler, count: 1, data: 0}, [
		" a ",
		"x#x",
		"bxb"
	], ['#', BlockID.compressor, -1, 'x', 3, -1, 'a', 348, 0, 'b', ItemID.ingotSteel, 0]);
});

var guiRecycler = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Recycler"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "recycler_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "recycler_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotEnergy": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 625, y: 142},
		"slotUpgrade1": {type: "slot", x: 820, y: 48},
		"slotUpgrade2": {type: "slot", x: 820, y: 112},
		"slotUpgrade3": {type: "slot", x: 820, y: 176},
		"slotUpgrade4": {type: "slot", x: 820, y: 240}
	}
});


MachineRegistry.registerPrototype(BlockID.recycler, {
	defaultValues: {
		energy_storage: 500,
		energy_consumption: 1,
		work_time: 45,
		progress: 0,
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiRecycler;
	},
	
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeAll(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var resultSlot = this.container.getSlot("slotResult");
		if(sourceSlot.id > 0 && (resultSlot.id == ItemID.scrap && resultSlot.count < 64 || resultSlot.id == 0)){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				this.activate();
			}
			else{
				this.deactivate();
			}
			if(this.data.progress >= 1){
				sourceSlot.count--;
				if(Math.random() < 0.125){
					resultSlot.id = ItemID.scrap;
					resultSlot.count++;
				}
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else {
			this.data.progress = 0;
			this.deactivate();
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	init: MachineRegistry.initModel,
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy: this.deactivate,
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});




// file: machine/processing/compressor.js

IDRegistry.genBlockID("compressor");
Block.createBlockWithRotation("compressor", [
	{name: "Compressor", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.compressor, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.compressor, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 1], ["machine_side", 0], ["machine_side", 0]], true);
//ICRenderLib.addConnectionBlock("bc-container", BlockID.compressor);

Block.registerDropFunction("compressor", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.compressor, count: 1, data: 0}, [
		"x x",
		"x#x",
		"xax"
	], ['#', BlockID.machineBlockBasic, 0, 'x', 1, 0, 'a', ItemID.circuitBasic, -1]);
});


var guiCompressor = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Compressor"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "compressor_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "compressor_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotEnergy": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 625, y: 142},
		"slotUpgrade1": {type: "slot", x: 820, y: 48},
		"slotUpgrade2": {type: "slot", x: 820, y: 112},
		"slotUpgrade3": {type: "slot", x: 820, y: 176},
		"slotUpgrade4": {type: "slot", x: 820, y: 240}
	}
});


Callback.addCallback("PreLoaded", function(){
	MachineRecipeRegistry.registerRecipesFor("compressor", {
		// Items
		"ItemID.dustEnergium": {id: ItemID.storageCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageCrystal), ingredientCount: 9},
		"ItemID.dustLapis": {id: ItemID.plateLapis, count: 1, data: 0},
		"ItemID.ingotAlloy": {id: ItemID.plateAlloy, count: 1, data: 0},
		"ItemID.carbonMesh": {id: ItemID.carbonPlate, count: 1, data: 0},
		"ItemID.coalBall": {id: ItemID.coalBlock, count: 1, data: 0},
		"ItemID.coalChunk": {id: 264, count: 1, data: 0},
		
		// Blocks
		265: {id: 42, count: 1, data: 0, ingredientCount: 9},
		266: {id: 41, count: 1, data: 0, ingredientCount: 9},
		"ItemID.ingotCopper": {id: BlockID.blockCopper, count: 1, data: 0, ingredientCount: 9},
		"ItemID.ingotTin": {id: BlockID.blockTin, count: 1, data: 0, ingredientCount: 9},
		"ItemID.ingotLead": {id: BlockID.blockLead, count: 1, data: 0, ingredientCount: 9},
		"ItemID.ingotSteel": {id: BlockID.blockSteel, count: 1, data: 0, ingredientCount: 9},
		"ItemID.ingotBronze": {id: BlockID.blockBronze, count: 1, data: 0, ingredientCount: 9},
		80: {id: 79, count: 1, data: 0},
		12: {id: 24, count: 1, data: 0, ingredientCount: 4},
		336: {id: 45, count: 1, data: 0, ingredientCount: 4},
		405: {id: 112, count: 1, data: 0, ingredientCount: 4},
		348: {id: 89, count: 1, data: 0, ingredientCount: 4},
		406: {id: 155, count: 1, data: 0, ingredientCount: 4},
		331: {id: 152, count: 1, data: 0, ingredientCount: 9},
		"351:4": {id: 22, count: 1, data: 0, ingredientCount: 9},
		//264: {id: 57, count: 1, data: 0, ingredientCount: 9},
		//388: {id: 133, count: 1, data: 0, ingredientCount: 9},
	}, true);
});

MachineRegistry.registerPrototype(BlockID.compressor, {
	defaultValues: {
		energy_storage: 2000,
		energy_consumption: 2,
		work_time: 400,
		progress: 0,
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiCompressor;
	},
		
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeAll(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var result = MachineRecipeRegistry.getRecipeResult("compressor", sourceSlot.id, sourceSlot.data);
		if(result && (sourceSlot.count >= result.ingredientCount || !result.ingredientCount)){
			var resultSlot = this.container.getSlot("slotResult");
			if(resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= Item.getMaxStack(result.id) - result.count || resultSlot.id == 0){
				if(this.data.energy >= this.data.energy_consumption){
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
					this.activate();
				}
				else{
					this.deactivate();
				}
				if(this.data.progress >= 1){
					sourceSlot.count -= result.ingredientCount || 1;
					resultSlot.id = result.id;
					resultSlot.data = result.data;
					resultSlot.count += result.count;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}else{
				this.deactivate();
			}
		}
		else {
			this.data.progress = 0;
			this.deactivate();
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	init: MachineRegistry.initModel,
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy: this.deactivate,
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});




// file: machine/processing/extractor.js

IDRegistry.genBlockID("extractor");
Block.createBlockWithRotation("extractor", [
	{name: "Extractor", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 0], ["extractor_side", 0], ["extractor_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.extractor, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 0], ["extractor_side", 0], ["extractor_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.extractor, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 1], ["extractor_side", 1], ["extractor_side", 1]], true);
//ICRenderLib.addConnectionBlock("bc-container", BlockID.extractor);

Block.registerDropFunction("extractor", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.extractor, count: 1, data: 0}, [
		"x#x",
		"xax"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.treetap, 0, 'a', ItemID.circuitBasic, 0]);
});

var guiExtractor = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Extractor"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "extractor_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "extractor_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotEnergy": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 625, y: 142},
		"slotUpgrade1": {type: "slot", x: 820, y: 48},
		"slotUpgrade2": {type: "slot", x: 820, y: 112},
		"slotUpgrade3": {type: "slot", x: 820, y: 176},
		"slotUpgrade4": {type: "slot", x: 820, y: 240}
	}
});

Callback.addCallback("PreLoaded", function(){
	MachineRecipeRegistry.registerRecipesFor("extractor", {
		"ItemID.latex": {id: ItemID.rubber, count: 3, data: 0},
		"ItemID.rubberSapling": {id: ItemID.rubber, count: 1, data: 0},
		"BlockID.rubberTreeLog": {id: ItemID.rubber, count: 1, data: 0},
		35: {id: 35, count: 1, data: 0},
		289: {id: ItemID.dustSulfur, count: 1, data: 0},
	}, true);
});

MachineRegistry.registerPrototype(BlockID.extractor, {
	defaultValues: {
		energy_storage: 2000,
		energy_consumption: 2,
		work_time: 400,
		progress: 0,
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiExtractor;
	},
		
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeAll(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var resultSlot = this.container.getSlot("slotResult");
		var result = MachineRecipeRegistry.getRecipeResult("extractor", sourceSlot.id);
		if(result && (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= 64 - result.count || resultSlot.id == 0)){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				this.activate();
			}
			else{
				this.deactivate();
			}
			if(this.data.progress >= 1){
				sourceSlot.count--;
				resultSlot.id = result.id;
				resultSlot.data = result.data;
				resultSlot.count += result.count;
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else {
			this.data.progress = 0;
			this.deactivate();
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	init: MachineRegistry.initModel,
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy: this.deactivate,
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});




// file: machine/processing/metal_former.js

IDRegistry.genBlockID("metalFormer");
Block.createBlockWithRotation("metalFormer", [
	{name: "Metal Former", texture: [["machine_bottom", 0], ["metal_former_top", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.metalFormer, [["machine_bottom", 0], ["metal_former_top", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.metalFormer, [["machine_bottom", 0], ["metal_former_top", 1], ["machine_side", 0], ["metal_former_front", 1], ["machine_side", 0], ["machine_side", 0]], true);
//ICRenderLib.addConnectionBlock("bc-container", BlockID.metalFormer);

Block.registerDropFunction("metalFormer", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.metalFormer, count: 1, data: 0}, [
		" x ",
		"b#b",
		"ccc"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'b', ItemID.toolbox, 0, 'c', ItemID.coil, 0]);
});


var guiMetalFormer = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Metal Former"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "metalformer_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "metalformer_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotEnergy": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 715, y: 142},
		"slotUpgrade1": {type: "slot", x: 820, y: 48},
		"slotUpgrade2": {type: "slot", x: 820, y: 112},
		"slotUpgrade3": {type: "slot", x: 820, y: 176},
		"slotUpgrade4": {type: "slot", x: 820, y: 240},
		"button": {type: "button", x: 575, y: 210, bitmap: "button_slot", scale: GUI_BAR_STANDART_SCALE, clicker: {
			onClick: function(container, tileEntity){
				tileEntity.data.mode = (tileEntity.data.mode + 1) % 3;
			}
		}}
	}
});


Callback.addCallback("PreLoaded", function(){
	// rolling
	MachineRecipeRegistry.registerRecipesFor("metalFormer0", {
		// ingots
		265: {id: ItemID.plateIron, count: 1},
		266: {id: ItemID.plateGold, count: 1},
		"ItemID.ingotCopper": {id: ItemID.plateCopper, count: 1},
		"ItemID.ingotTin": {id: ItemID.plateTin, count: 1},
		"ItemID.ingotBronze": {id: ItemID.plateBronze, count: 1},
		"ItemID.ingotSteel": {id: ItemID.plateSteel, count: 1},
		"ItemID.ingotLead": {id: ItemID.plateLead, count: 1},
		// plates
		"ItemID.plateIron": {id: ItemID.casingIron, count: 2},
		"ItemID.plateGold": {id: ItemID.casingGold, count: 2},
		"ItemID.plateTin": {id: ItemID.casingTin, count: 2},
		"ItemID.plateCopper": {id: ItemID.casingCopper, count: 2},
		"ItemID.plateBronze": {id: ItemID.casingBronze, count: 2},
		"ItemID.plateSteel": {id: ItemID.casingSteel, count: 2},
		"ItemID.plateLead": {id: ItemID.casingLead, count: 2}
	}, true);
	// cutting
	MachineRecipeRegistry.registerRecipesFor("metalFormer1", {
		"ItemID.plateTin": {id: ItemID.cableTin0, count: 4},
		"ItemID.plateCopper": {id: ItemID.cableCopper0, count: 4},
		"ItemID.plateGold": {id: ItemID.cableGold0, count: 4},
		"ItemID.plateIron": {id: ItemID.cableIron0, count: 4},
	}, true);
	// extruding
	MachineRecipeRegistry.registerRecipesFor("metalFormer2", {
		"ItemID.ingotTin": {id: ItemID.cableTin0, count: 3},
		"ItemID.ingotCopper": {id: ItemID.cableCopper0, count: 3},
		"ItemID.ingotGold": {id: ItemID.cableGold0, count: 4},
		265: {id: ItemID.cableIron0, count: 4},
	}, true);
});

MachineRegistry.registerPrototype(BlockID.metalFormer, {
	defaultValues: {
		energy_storage: 4000,
		energy_consumption: 10,
		work_time: 200,
		progress: 0,
		mode: 0,
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiMetalFormer;
	},
	
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		var content = this.container.getGuiContent();
		if(content){
			content.elements.button.bitmap = "metal_former_button_" + this.data.mode;
		}
		this.setDefaultValues();
		UpgradeAPI.executeAll(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var resultSlot = this.container.getSlot("slotResult");
		var result = MachineRecipeRegistry.getRecipeResult("metalFormer" + this.data.mode, sourceSlot.id)
		if(result && (resultSlot.id == result.id && resultSlot.count <= 64 - result.count || resultSlot.id == 0)){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				this.activate();
			}else{
				this.deactivate();
			}
			if(this.data.progress >= 1){
				sourceSlot.count -= 1;
				resultSlot.id = result.id;
				resultSlot.count += result.count;
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else {
			this.data.progress = 0;
			this.deactivate();
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	init: MachineRegistry.initModel,
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy: this.deactivate,
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});




// file: machine/processing/ore_washer.js

IDRegistry.genBlockID("oreWasher");
Block.createBlockWithRotation("oreWasher", [
    {name: "Ore Washing Plant", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.oreWasher, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.oreWasher, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 1], ["ore_washer_side", 1], ["ore_washer_side", 1]], true);

Block.registerDropFunction("oreWasher", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.oreWasher, count: 1, data: 0}, [
		"aaa",
		"b#b",
		"xcx"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.electricMotor, 0, 'a', ItemID.plateIron, 0, 'b', 325, 0, 'c', ItemID.circuitBasic, 0]);
});

Callback.addCallback("PreLoaded", function(){
	MachineRecipeRegistry.registerRecipesFor("oreWasher", {
		"ItemID.crushedCopper": [ItemID.crushedPurifiedCopper, 1, ItemID.dustSmallCopper, 2, ItemID.dustStone, 1],
		"ItemID.crushedTin": [ItemID.crushedPurifiedTin, 1, ItemID.dustSmallTin, 2, ItemID.dustStone, 1],
		"ItemID.crushedIron": [ItemID.crushedPurifiedIron, 1, ItemID.dustSmallIron, 2, ItemID.dustStone, 1],
		"ItemID.crushedGold": [ItemID.crushedPurifiedGold, 1, ItemID.dustSmallGold, 2, ItemID.dustStone, 1],
		"ItemID.crushedSilver": [ItemID.crushedPurifiedSilver, 1, ItemID.dustSmallSilver, 2, ItemID.dustStone, 1],
		"ItemID.crushedLead": [ItemID.crushedPurifiedLead, 1, ItemID.dustSmallSulfur, 3, ItemID.dustStone, 1],
		"ItemID.crushedUranium": [ItemID.crushedPurifiedUranium, 1, ItemID.dustSmallLead, 2, ItemID.dustStone, 1],
		//13: [ItemID.dustStone, 1]
	}, true);
});

var guiOreWasher = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Ore Washing Plant"}},
		inventory: {standart: true},
		background: {standart: true},
	},
	
	params: {       
		slot: "default_slot",
		invSlot: "default_slot"              
	},
	
	drawing: [
		{type: "background", color: android.graphics.Color.rgb(179, 179, 179)},
		{type: "bitmap", x: 400, y: 50, bitmap: "ore_washer_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 416, y: 178, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 400 + 98*GUI_BAR_STANDART_SCALE, y: 50 + 35*GUI_BAR_STANDART_SCALE, direction: 0, value: 0.5, bitmap: "ore_washer_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 416, y: 178, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"liquidScale": {type: "scale", x: 400 + 60*GUI_BAR_STANDART_SCALE, y: 50 + 21*GUI_BAR_STANDART_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_BAR_STANDART_SCALE},
		"slotEnergy": {type: "slot", x: 400 + 3*GUI_BAR_STANDART_SCALE, y: 50 + 58*GUI_BAR_STANDART_SCALE},
		"slotLiquid1": {type: "slot", x: 400 + 33*GUI_BAR_STANDART_SCALE, y: 50 + 13*GUI_BAR_STANDART_SCALE},
		"slotLiquid2": {type: "slot", x: 400 + 33*GUI_BAR_STANDART_SCALE, y: 50 + 58*GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 400 + 99*GUI_BAR_STANDART_SCALE, y: 50 + 13*GUI_BAR_STANDART_SCALE},
		"slotResult1": {type: "slot", x: 400 + 81*GUI_BAR_STANDART_SCALE, y: 50 + 58*GUI_BAR_STANDART_SCALE},
		"slotResult2": {type: "slot", x: 400 + 99*GUI_BAR_STANDART_SCALE, y: 50 + 58*GUI_BAR_STANDART_SCALE},
		"slotResult3": {type: "slot", x: 400 + 117*GUI_BAR_STANDART_SCALE, y: 50 + 58*GUI_BAR_STANDART_SCALE},
		"slotUpgrade1": {type: "slot", x: 400 + 147*GUI_BAR_STANDART_SCALE, y: 50 + 4*GUI_BAR_STANDART_SCALE},
		"slotUpgrade2": {type: "slot", x: 400 + 147*GUI_BAR_STANDART_SCALE, y: 50 + 22*GUI_BAR_STANDART_SCALE},
		"slotUpgrade3": {type: "slot", x: 400 + 147*GUI_BAR_STANDART_SCALE, y: 50 + 40*GUI_BAR_STANDART_SCALE},
		"slotUpgrade4": {type: "slot", x: 400 + 147*GUI_BAR_STANDART_SCALE, y: 50 + 58*GUI_BAR_STANDART_SCALE},
	}
});


MachineRegistry.registerPrototype(BlockID.oreWasher, {
	defaultValues: {
		energy_storage: 10000,
		energy_consumption: 8,
		work_time: 500,
		progress: 0,
		isActive: false
    },
	
	getGuiScreen: function(){
		return guiOreWasher;
	},
		
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotLiquid2", "slotResult1", "slotResult2", "slotResult3"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	init: function(){
		this.liquidStorage.setLimit("water", 8);
		if(this.data.isActive){
			var block = World.getBlock(this.x, this.y, this.z);
			MachineRenderer.mapAtCoords(this.x, this.y, this.z, block.id, block.data);
		}
	},
	
	checkResult: function(result){
		for(var i = 1; i < 4; i++){
			var id = result[(i-1)*2];
			var count = result[(i-1)*2+1];
			var resultSlot = this.container.getSlot("slotResult"+i);
			if((resultSlot.id != id || resultSlot.count + count > 64) && resultSlot.id != 0){
				return false;
			}
		}
		return true;
	},
	
	putResult: function(result, sourceSlot){
		sourceSlot.count--;
		this.liquidStorage.getLiquid("water", 1);
		for(var i = 1; i < 4; i++){
			var id = result[(i-1)*2];
			var count = result[(i-1)*2+1];
			var resultSlot = this.container.getSlot("slotResult"+i);
			if(id){
				resultSlot.id = id;
				resultSlot.count += count;
			}
		}
	},
	
	tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeAll(this);
		
		var slot1 = this.container.getSlot("slotLiquid1");
		var slot2 = this.container.getSlot("slotLiquid2");
		var empty = LiquidRegistry.getEmptyItem(slot1.id, slot1.data);
		if(empty && empty.liquid == "water"){
			if(this.liquidStorage.getAmount("water") <= 7 && (slot2.id == empty.id && slot2.data == empty.data && slot2.count < Item.getMaxStack(empty.id) || slot2.id == 0)){
				this.liquidStorage.addLiquid("water", 1);
				slot1.count--;
				slot2.id = empty.id;
				slot2.data = empty.data;
				slot2.count++;
				this.container.validateAll();
			}
		}
		
        var sourceSlot = this.container.getSlot("slotSource");
        var result = MachineRecipeRegistry.getRecipeResult("oreWasher", sourceSlot.id, sourceSlot.data);
        if(result && this.checkResult(result) && this.liquidStorage.getAmount("water") >= 1){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				this.activate();
			}
			else{
				this.deactivate();
			}
			if(this.data.progress >= 1){
				this.putResult(result, sourceSlot);
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
        else {
            this.data.progress = 0;
            this.deactivate();
        }
        
        var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
        
        this.container.setScale("progressScale", this.data.progress);
		this.liquidStorage.updateUiScale("liquidScale", "water");
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    
    getEnergyStorage: function(){
        return this.data.energy_storage;
    },
    
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy: this.deactivate,
    energyTick: MachineRegistry.basicEnergyReceiveFunc
});




// file: machine/processing/thermal_centrifuge.js

IDRegistry.genBlockID("thermalCentrifuge");
Block.createBlockWithRotation("thermalCentrifuge", [
	{name: "Thermal Centrifuge", texture: [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_side", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.thermalCentrifuge, [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_side", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.thermalCentrifuge, [["machine_advanced", 0], ["thermal_centrifuge_top", 1], ["machine_side", 0], ["thermal_centrifuge_front", 1], ["thermal_centrifuge_side", 1], ["thermal_centrifuge_side", 1]], true);

Block.registerDropFunction("thermalCentrifuge", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockAdvanced);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.thermalCentrifuge, count: 1, data: 0}, [
		"cmc",
		"a#a",
		"axa"
	], ['#', BlockID.machineBlockAdvanced, 0, 'x', ItemID.electricMotor, 0, 'a', 265, 0, 'm', ItemID.miningLaser, 0, 'c', ItemID.coil, 0]);
});

Callback.addCallback("PreLoaded", function(){
	MachineRecipeRegistry.registerRecipesFor("thermalCentrifuge", {
		//4: {result: [ItemID.dustStone, 1], heat: 100},
		"ItemID.crushedCopper": {result: [ItemID.dustSmallTin, 1, ItemID.dustCopper, 1, ItemID.dustStone, 1], heat: 500},
		"ItemID.crushedTin": {result: [ItemID.dustSmallIron, 1, ItemID.dustTin, 1, ItemID.dustStone, 1], heat: 1000},
		"ItemID.crushedIron": {result: [ItemID.dustSmallGold, 1, ItemID.dustIron, 1, ItemID.dustStone, 1], heat: 1500},
		"ItemID.crushedGold": {result: [ItemID.dustSmallSilver, 1, ItemID.dustGold, 1, ItemID.dustStone, 1], heat: 2000},
		"ItemID.crushedSilver": {result: [ItemID.dustSmallLead, 1, ItemID.dustSilver, 1, ItemID.dustStone, 1], heat: 2000},
		"ItemID.crushedLead": {result: [ItemID.dustSmallCopper, 1, ItemID.dustLead, 1, ItemID.dustStone, 1], heat: 2000},
		"ItemID.crushedPurifiedCopper": {result: [ItemID.dustSmallTin, 1, ItemID.dustCopper, 1], heat: 500},
		"ItemID.crushedPurifiedTin": {result: [ItemID.dustSmallIron, 1, ItemID.dustTin, 1], heat: 1000},
		"ItemID.crushedPurifiedIron": {result: [ItemID.dustSmallGold, 1, ItemID.dustIron, 1], heat: 1500},
		"ItemID.crushedPurifiedGold": {result: [ItemID.dustSmallSilver, 1, ItemID.dustGold, 1], heat: 2000},
		"ItemID.crushedPurifiedSilver": {result: [ItemID.dustSmallLead, 1, ItemID.dustSilver, 1], heat: 2000},
		"ItemID.crushedPurifiedLead": {result: [ItemID.dustSmallCopper, 1, ItemID.dustLead, 1], heat: 2000}
	}, true);
});


var guiCentrifuge = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Thermal Centrifuge"}},
		inventory: {standart: true},
		background: {standart: true},
	},

	params: {       
		slot: "default_slot",
		invSlot: "default_slot"              
	},

	drawing: [
		{type: "background", color: android.graphics.Color.rgb(179, 179, 179)},
		{type: "bitmap", x: 400, y: 50, bitmap: "thermal_centrifuge_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 400 + 8*GUI_BAR_STANDART_SCALE, y: 50 + 38*GUI_BAR_STANDART_SCALE, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 400 + 80*GUI_BAR_STANDART_SCALE, y: 50 + 21*GUI_BAR_STANDART_SCALE, direction: 1, value: 0.5, bitmap: "thermal_centrifuge_scale", scale: GUI_BAR_STANDART_SCALE},
		"heatScale": {type: "scale", x: 400 + 64*GUI_BAR_STANDART_SCALE, y: 50 + 62*GUI_BAR_STANDART_SCALE, direction: 0, value: 0.5, bitmap: "heat_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 400 + 8*GUI_BAR_STANDART_SCALE, y: 50 + 38*GUI_BAR_STANDART_SCALE, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotEnergy": {type: "slot", x: 400 + 6*GUI_BAR_STANDART_SCALE, y: 50 + 55*GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 400 + 6*GUI_BAR_STANDART_SCALE, y: 50 + 16*GUI_BAR_STANDART_SCALE},
		"slotResult1": {type: "slot", x: 400 + 119*GUI_BAR_STANDART_SCALE, y: 50 + 13*GUI_BAR_STANDART_SCALE},
		"slotResult2": {type: "slot", x: 400 + 119*GUI_BAR_STANDART_SCALE, y: 50 + 31*GUI_BAR_STANDART_SCALE},
		"slotResult3": {type: "slot", x: 400 + 119*GUI_BAR_STANDART_SCALE, y: 50 + 49*GUI_BAR_STANDART_SCALE},
		"slotUpgrade1": {type: "slot", x: 400 + 147*GUI_BAR_STANDART_SCALE, y: 50 + 4*GUI_BAR_STANDART_SCALE},
		"slotUpgrade2": {type: "slot", x: 400 + 147*GUI_BAR_STANDART_SCALE, y: 50 + 22*GUI_BAR_STANDART_SCALE},
		"slotUpgrade3": {type: "slot", x: 400 + 147*GUI_BAR_STANDART_SCALE, y: 50 + 40*GUI_BAR_STANDART_SCALE},
		"slotUpgrade4": {type: "slot", x: 400 + 147*GUI_BAR_STANDART_SCALE, y: 50 + 58*GUI_BAR_STANDART_SCALE},
		"indicator": {type: "image", x: 400 + 88*GUI_BAR_STANDART_SCALE, y: 50 + 58*GUI_BAR_STANDART_SCALE, bitmap: "indicator_red", scale: GUI_BAR_STANDART_SCALE}
	}
});


MachineRegistry.registerPrototype(BlockID.thermalCentrifuge, {
	defaultValues: {
		energy_storage: 20000,
		energy_consumption: 32,
		work_time: 500,
		progress: 0,
		isActive: false,
		isHeating: false,
		heat: 0,
		maxHeat: 5000,
		upgrades: {}
	},

	getGuiScreen: function(){
		return guiCentrifuge;
	},
		
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult1", "slotResult2", "slotResult3"]};
	},

	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},

	checkResult: function(result){
		for(var i = 1; i < 4; i++){
			var id = result[(i-1)*2];
			var count = result[(i-1)*2+1];
			var resultSlot = this.container.getSlot("slotResult"+i);
			if(resultSlot.id == id && resultSlot.count + count <= 64 || resultSlot.id == 0 || !id){
				return true;
			}
		}
	},

	putResult: function(result, sourceSlot){
		sourceSlot.count--;
		for(var i = 1; i < 4; i++){
			var id = result[(i-1)*2];
			var count = result[(i-1)*2+1];
			var resultSlot = this.container.getSlot("slotResult"+i);
			if(id){
				resultSlot.id = id;
				resultSlot.count += count;
			}
		}
	},

	tick: function(){
		this.setDefaultValues();
		this.data.upgrades = UpgradeAPI.executeAll(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var result = MachineRecipeRegistry.getRecipeResult("thermalCentrifuge", sourceSlot.id, sourceSlot.data);
		if(result && this.checkResult(result.result) && this.data.energy > 0){
			this.data.maxHeat = result.heat;
			if(this.data.heat < result.heat){
				this.data.energy--;
				this.data.heat++;
			}
			else if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				this.activate();
			}
			else{
				this.deactivate();
			}
			if(this.data.progress >= 1){
				this.putResult(result.result, sourceSlot);
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else {
			this.data.maxHeat = 5000;
			this.data.progress = 0;
			this.deactivate();
			if(this.data.isHeating && this.data.energy > 1){
				if(this.data.heat < 5000){this.data.heat++;}
				this.data.energy -= 2;
			}
			else if(this.data.heat > 0){
				this.data.heat--;
			}
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(128, energyStorage - this.data.energy), 1);
		
		var content = this.container.getGuiContent();
		if(content){
			if(this.data.heat >= this.data.maxHeat){
			content.elements["indicator"].bitmap = "indicator_green";}
			else{
			content.elements["indicator"].bitmap = "indicator_red";}
		}
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("heatScale", this.data.heat / this.data.maxHeat);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},

	redstone: function(signal){
		this.data.isHeating = signal.power > 0;
		if(this.data.upgrades[ItemID.upgradeRedstone]){
			this.data.isHeating = !this.data.isHeating;
		}
		if(this.data.isHeating){
			this.data.maxHeat = 5000;
		}
	},

	getEnergyStorage: function(){
		return this.data.energy_storage;
	},

	init: MachineRegistry.initModel,
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy: this.deactivate,
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});




// file: machine/processing/mass_fabricator.js

IDRegistry.genBlockID("massFabricator");
Block.createBlockWithRotation("massFabricator", [
	{name: "Mass Fabricator", texture: [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.massFabricator, [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.massFabricator, [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 1], ["machine_advanced_side", 0], ["machine_advanced_side", 0]], true);
//ICRenderLib.addConnectionBlock("bc-container", BlockID.massFabricator);

Block.registerDropFunction("massFabricator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockAdvanced);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.massFabricator, count: 1, data: 0}, [
		"xax",
		"b#b",
		"xax"
	], ['b', BlockID.machineBlockAdvanced, 0, 'x', 348, 0, 'a', ItemID.circuitAdvanced, 0, '#', ItemID.storageLapotronCrystal, -1]);
});


var ENERGY_PER_MATTER = 1000000;

var guiMassFabricator = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Mass Fabricator"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 850, y: 190, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"energyScale": {type: "scale", x: 850, y: 190, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"matterSlot": {type: "slot", x: 821, y: 75, size: 100},
		"catalyserSlot": {type: "slot", x: 841, y: 252},
		"textInfo1": {type: "text", x: 542, y: 142, width: 200, height: 30, text: "Progress:"},
		"textInfo2": {type: "text", x: 542, y: 177, width: 200, height: 30, text: "0%"},
		"textInfo3": {type: "text", x: 542, y: 212, width: 200, height: 30, text: " "},
		"textInfo4": {type: "text", x: 542, y: 239, width: 200, height: 30, text: " "},
	}
});


MachineRegistry.registerPrototype(BlockID.massFabricator, {
	defaultValues: {
		progress: 0,
		catalyser: 0,
		catalyserRatio: 0,
		isEnabled: true,
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiMassFabricator;
	},
		
	getTransportSlots: function(){
		return {input: ["catalyserSlot"], output: ["matterSlot"]};
	},
	
	tick: function(){
		this.container.setScale("energyScale", this.data.energy / this.getEnergyStorage());
		this.container.setText("textInfo2", parseInt(100 * this.data.progress / ENERGY_PER_MATTER) + "%");
		
		if(this.data.isEnabled && this.data.energy > 0){
			this.activate();
			if(this.data.catalyser <= 1000){
				var catalyserSlot = this.container.getSlot("catalyserSlot");
				var catalyserData = MachineRecipeRegistry.getRecipeResult("catalyser", catalyserSlot.id);
				if(catalyserData){
					this.data.catalyser = catalyserData.input;
					this.data.catalyserRatio = catalyserData.output / catalyserData.input;
					catalyserSlot.count--;
					this.container.validateAll();
				}
			}
			if(this.data.catalyser > 0){
				this.container.setText("textInfo3", "Catalyser:");
				this.container.setText("textInfo4", parseInt(this.data.catalyser));
				var transfer = Math.min((ENERGY_PER_MATTER - this.data.progress) / this.data.catalyserRatio, this.data.energy);
				transfer = Math.min(this.data.catalyser, transfer);
				this.data.progress += transfer * this.data.catalyserRatio;
				this.data.energy -= transfer;
				this.data.catalyser -= transfer;
			}
			else{
				this.container.setText("textInfo3", "");
				this.container.setText("textInfo4", "");
				var transfer =Math.min(ENERGY_PER_MATTER - this.data.progress, this.data.energy);
				this.data.progress += transfer;
				this.data.energy -= transfer;
			}
			
			if(this.data.progress >= ENERGY_PER_MATTER){
				var matterSlot = this.container.getSlot("matterSlot");
				if(matterSlot.id == ItemID.matter && matterSlot.count < 64 || matterSlot.id == 0){
					matterSlot.id = ItemID.matter;
					matterSlot.count++;
					this.data.progress = 0;
				}
			}
		}
		else{
			this.deactivate();
		}
	},
	
	redstone: function(signal){
		this.data.isEnabled = (signal.power == 0);
		/*if(this.data.upgrades[ItemID.upgradeRedstone]){
			this.data.isEnabled = !this.data.isEnabled;
		}*/
	},
	
	getEnergyStorage: function(){
		return 8192;
	},
	
	init: MachineRegistry.initModel,
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy: this.deactivate,
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});




// file: machine/resource/pump.js

IDRegistry.genBlockID("pump");
Block.createBlockWithRotation("pump", [
	{name: "Pump", texture: [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.pump, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.pump, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 1], ["pump_side", 1], ["pump_side", 1]], true);

Block.registerDropFunction("pump", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.pump, count: 1, data: 0}, [
		"cxc",
		"c#c",
		"bab"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'a', ItemID.treetap, 0, 'b', BlockID.miningPipe, 0, 'c', ItemID.cellEmpty, 0]);
});


var guiPump = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Pump"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 502, y: 149, bitmap: "extractor_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 416, y: 127, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 611, y: 88, bitmap: "liquid_bar", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 684, y: 152, bitmap: "pump_arrow", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"progressScale": {type: "scale", x: 502, y: 149, direction: 0, value: 0.5, bitmap: "extractor_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 416, y: 127, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"liquidScale": {type: "scale", x: 400 + 70*GUI_BAR_STANDART_SCALE, y: 50 + 16*GUI_BAR_STANDART_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_BAR_STANDART_SCALE},
		"slotEnergy": {type: "slot", x: 400 + 3*GUI_BAR_STANDART_SCALE, y: 50 + 39*GUI_BAR_STANDART_SCALE},
		"slotLiquid1": {type: "slot", x: 400 + 94*GUI_BAR_STANDART_SCALE, y: 50 + 12*GUI_BAR_STANDART_SCALE},
		"slotLiquid2": {type: "slot", x: 400 + 128*GUI_BAR_STANDART_SCALE, y: 50 + 29*GUI_BAR_STANDART_SCALE},
		"slotUpgrade1": {type: "slot", x: 880, y: 50 + 4*GUI_BAR_STANDART_SCALE},
		"slotUpgrade2": {type: "slot", x: 880, y: 50 + 22*GUI_BAR_STANDART_SCALE},
		"slotUpgrade3": {type: "slot", x: 880, y: 50 + 40*GUI_BAR_STANDART_SCALE},
		"slotUpgrade4": {type: "slot", x: 880, y: 50 + 58*GUI_BAR_STANDART_SCALE},
	}
});


MachineRegistry.registerPrototype(BlockID.pump, {
	defaultValues: {
		energy_storage: 200,
		energy_consumption: 1,
		work_time: 20,
		progress: 0,
		isActive: false
    },
	/*
	addTransportedItem: function(self, item, direction){
		var slot = this.container.getSlot("slotLiquid1");
		var full = LiquidRegistry.getFullItem(item.id, item.data, "water");
		if(full && (slot.id == item.id && slot.data == item.data || slot.id == 0)){
			var maxStack = Item.getMaxStack(slot.id);
			var add = Math.min(maxStack - item.count, slot.count);
			slot.count -= add;
			item.count += add;
			item.id = slot.id;
			item.data = slot.data;
			if(slot.count==0) slot.id = slot.data = 0;
			if(item.count == maxStack) return true;
		}
	},
	*/
	getGuiScreen: function(){
		return guiPump;
	},
		
	getTransportSlots: function(){
		return {input: ["slotLiquid1"], output: ["slotLiquid2"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	init: function(){
		this.liquidStorage.setLimit("water", 8);
		if(this.data.isActive){
			var block = World.getBlock(this.x, this.y, this.z);
			MachineRenderer.mapAtCoords(this.x, this.y, this.z, block.id, block.data);
		}
	},
	
	tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeAll(this);
		
		var slot1 = this.container.getSlot("slotLiquid1");
		var slot2 = this.container.getSlot("slotLiquid2");
		var full = LiquidRegistry.getFullItem(slot1.id, slot1.data, "water");
		if(full && this.liquidStorage.getAmount("water") >= 1 && (slot2.id == full.id && slot2.data == full.data && slot2.count < Item.getMaxStack(full.id, full.data) || slot2.id == 0)){
			this.liquidStorage.getLiquid("water", 1);
			slot1.count--;
			slot2.id = full.id;
			slot2.data = full.data;
			slot2.count++;
			this.container.validateAll();
		}
		
		var block = World.getBlock(this.x, this.y-1, this.z);
		if((block.id == 8 || block.id == 9) && block.data == 0 && this.liquidStorage.getAmount("water") <= 7){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				this.activate();
			}
			else{
				this.deactivate();
			}
			if(this.data.progress >= 1){
				World.setBlock(this.x, this.y-1, this.z, 0);
				this.liquidStorage.addLiquid("water", 1);
				this.data.progress = 0;
			}
		}
        else {
            this.data.progress = 0;
            this.deactivate();
        }
        
        var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
        
        this.container.setScale("progressScale", this.data.progress);
		this.liquidStorage.updateUiScale("liquidScale", "water");
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    
    getEnergyStorage: function(){
        return this.data.energy_storage;
    },
    
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy: this.deactivate,
    energyTick: MachineRegistry.basicEnergyReceiveFunc
});




// file: machine/resource/miner.js

IDRegistry.genBlockID("miner");
Block.createBlockWithRotation("miner", [
    {name: "Miner", texture: [["miner_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true}
], "opaque");

Block.registerDropFunction("miner", function(coords, blockID, blockData, level){
    return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

var guiMiner = new UI.StandartWindow({
    standart: {
        header: {text: {text: "Miner"}},
        inventory: {standart: true},
        background: {standart: true},
    },
    
    params: {       
        slot: "default_slot",
        invSlot: "default_slot"              
    },
    
    drawing: [
		{type: "background", color: android.graphics.Color.rgb(179, 179, 179)},
        {type: "bitmap", x: 550, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
    ],
    
    elements: {
        "energyScale": {type: "scale", x: 550, y: 150, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
        "slotDrill": {type: "slot", x: 441, y: 75, bitmap: "slot_drill"},
        "slotPipe": {type: "slot", x: 541, y: 75},
        "slotScanner": {type: "slot", x: 641, y: 75, bitmap: "slot_scanner"},
        "slotEnergy": {type: "slot", x: 541, y: 212}
    }
});

function getBlockDrop(coords, id, data, level){
    var dropFunc = Block.dropFunctions[id];
    if(dropFunc){
        return dropFunc(coords, id, data, level, {});
    }
    if(dirtBlocksDrop[id]){
        return [[dirtBlocksDrop[id], 1, 0]];
    }
    return [[id, 1, data]];
}

MachineRegistry.registerPrototype(BlockID.miner, {
    defaultValues: {
        y: -1,
        progress: 0
    },
    
    getGuiScreen: function(){
        return guiMiner;
    },
    
    drop: function(items){
        var container = World.getContainer(this.x, this.y+1, this.z);
        if(container){
            addItemsToContainers(items, [container]);}
            for(var i in items){
                var item = items[i]
                if(item.count > 0){
                World.drop(this.x+0.5, this.y+1, this.z+0.5, item.id, item.count, item.data);
            }
        }
    },
    
    tick: function(){
        if(World.getThreadTime()%20==0){
            this.data.y = this.y - 1;
            while(World.getBlockID(this.x, this.data.y, this.z) == BlockID.miningPipe){
                this.data.y--;
            }
            var drillSlot = this.container.getSlot("slotDrill");
            if(drillSlot.id == ItemID.drill || drillSlot.id == ItemID.diamondDrill){
                var block = World.getBlock(this.x, this.data.y, this.z);
                if(block.id==0 || (drillSlot.id == ItemID.drill && World.getThreadTime()%80==0 || drillSlot.id == ItemID.diamondDrill && World.getThreadTime()%40==0) && this.data.energy >= 250 && block.id != 7 && block.id != 8 && block.id != 10 && block.id != 120){
                    if(block.id > 0){
                        World.setBlock(this.x, this.data.y, this.z, 0);
                        var coords = {x: this.x, y: this.data.y, z: this.z};
                        var drop = getBlockDrop(coords, block.id, block.data, ToolAPI.getToolLevel(drillSlot.id));
                        var items = [];
                        for(var i in drop){
                            items.push({id: drop[i][0], count: drop[i][1], data: drop[i][2]});
                        }
                        this.drop(items);
                        this.data.energy -= 250;
                    }
                    var pipeSlot = this.container.getSlot("slotPipe");
                    if(pipeSlot.id == BlockID.miningPipe && this.data.energy >= 60){
                        if(this.data.y+1 < this.y){
                        World.setBlock(this.x, this.data.y+1, this.z, BlockID.miningPipe, 0);}
                        World.setBlock(this.x, this.data.y, this.z, BlockID.miningPipe, 1);
                        pipeSlot.count--;
                        if(!pipeSlot.count) pipeSlot.id = 0;
                        this.data.energy -= 60;
                        this.data.y--;
                    }
                }
            }
            else if(this.data.y < this.y - 1){
                if(World.getBlockID(this.x, this.data.y+1, this.z) == BlockID.miningPipe){
                    this.drop([{id: BlockID.miningPipe, count: 1, data: 0}]);
                    var pipeSlot = this.container.getSlot("slotPipe");
                    if(pipeSlot.id < 256 && pipeSlot.id > 0 || pipeSlot.id >= 8192 && pipeSlot.id != BlockID.miningPipe){
                        World.setBlock(this.x, this.data.y+1, this.z, pipeSlot.id, pipeSlot.data);
                        pipeSlot.count--;
                        if(!pipeSlot.count) pipeSlot.id = 0;
                    }
                    else{World.setBlock(this.x, this.data.y+1, this.z, 0);}
                }
            }
        }
        
        var energyStorage = this.getEnergyStorage();
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    
    getEnergyStorage: function(){
        return 10000;
    },
    
    energyTick: MachineRegistry.basicEnergyReceiveFunc
});

Callback.addCallback("PostLoaded", function(){
    Recipes.addShaped({id: BlockID.miner, count: 1, data: 0}, [
        "x#x",
        " b ",
        " b "
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'b', BlockID.miningPipe, 0]);
});




// file: machine/resource/advanced_miner.js

/*IDRegistry.genBlockID("advancedMiner");
Block.createBlock("advancedMiner", [
	{name: "Advanced Miner", texture: [["advanced_miner_bottom", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true}
], "opaque");

Block.registerDropFunction("advancedMiner", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockAdvanced);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.advancedMiner, count: 1, data: 0}, [
		"pmp",
		"e#a",
		"pmp"
	], ['#', BlockID.machineBlockAdvanced, 0, 'a', BlockID.teleporter, 0, 'e', BlockID.storageMFE, -1, 'm', BlockID.miner, -1, 'p', ItemID.plateAlloy, 0]);
});
*/




// file: machine/misc/teleporter.js

IDRegistry.genBlockID("teleporter");
Block.createBlock("teleporter", [
	{name: "Teleporter", texture: [["machine_advanced_bottom", 0], ["teleporter_top", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0]], inCreative: true},
], "opaque");
MachineRenderer.setStandartModel(BlockID.teleporter, [["machine_advanced_bottom", 0], ["teleporter_top", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0]]);
MachineRenderer.registerRenderModel(BlockID.teleporter, [["machine_advanced_bottom", 0], ["teleporter_top", 1], ["teleporter_side", 1], ["teleporter_side", 1], ["teleporter_side", 1], ["teleporter_side", 1]]);

Block.registerDropFunction("teleporter", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockAdvanced);
});

var friendlyMobs = [EntityType.BAT, EntityType.CHICKEN, EntityType.COW, EntityType.MUSHROOM_COW, EntityType.OCELOT, EntityType.PIG, EntityType.RABBIT, EntityType.SHEEP, EntityType.SNOW_GOLEM, EntityType.SQUID, EntityType.VILLAGER, EntityType.WOLF, 23, 24, 25, 26, 27];
var evilMobs = [EntityType.BLAZE, EntityType.CAVE_SPIDER, EntityType.CREEPER, EntityType.ENDERMAN, EntityType.GHAST, EntityType.IRON_GOLEM, EntityType.LAVA_SLIME, EntityType.PIG_ZOMBIE, EntityType.SILVERFISH, EntityType.SKELETON, EntityType.SLIME, EntityType.SPIDER, EntityType.ZOMBIE, EntityType.ZOMBIE_VILLAGER, 45, 46, 47, 48, 49, 55];

function getNearestStorages(x, y, z){
	var directions = [
		{x: 0, y: 1, z: 0},
		{x: 0, y: -1, z: 0},
		{x: 1, y: 0, z: 0},
		{x: -1, y: 0, z: 0},
		{x: 0, y: 0, z: 1},
		{x: 0, y: 0, z: -1},
	];
	var storages = [];
	for(var i in directions){
		dir = directions[i]
		var machine = EnergyTileRegistry.accessMachineAtCoords(x + dir.x, y + dir.y, z + dir.z);
		if(machine && machine.isStorage){
			storages.push(machine);
		}
	}
	return storages;
}

MachineRegistry.registerPrototype(BlockID.teleporter, {
	defaultValues: {
		isActive: false,
	},
	
	getWeight: function(ent){
		var type = Entity.getType(ent);
		if(ent==player || type==EntityType.MINECART) return 1000;
		if(type==EntityType.ITEM) return 100;
		if(friendlyMobs.indexOf(type) !== -1) return 200;
		if(evilMobs.indexOf(type) !== -1) return 500;
		return 0;
	},
	
	tick: function(){
		if(World.getThreadTime()%11==0 && this.data.isActive && this.data.frequency){
			var entities = Entity.getAll();
			var storages = getNearestStorages(this.x, this.y, this.z);
			var energyAvailable = 0;
			for(var i in storages){
				energyAvailable += storages[i].data.energy;
			}
			receive = this.data.frequency;
			if(energyAvailable > receive.energy * 100){
				for(var i in entities){
					var ent = entities[i];
					var c = Entity.getPosition(ent);
					var dx = Math.abs(this.x + 0.5 - c.x);
					var y = c.y - this.y;
					var dz = Math.abs(this.z + 0.5 - c.z);
					if(dx < 1.5 && dz < 1.5 && y >= 0 && y < 3){
						var weight = this.getWeight(ent);
						if(weight){
							var energyNeed = weight * receive.energy;
							if(debugMode){Debug.m(energyNeed);}
							if(energyNeed < energyAvailable){
								for(var i in storages){
									var data = storages[i].data;
									var energyChange = Math.min(energyNeed, data.energy);
									data.energy -= energyChange;
									energyNeed -= energyChange;
									if(energyNeed <= 0){break;}
								}
								Entity.setPosition(ent, receive.x+0.5, receive.y+3, receive.z+0.5);
							}
						}
					}
				}
			}
		}
	},
	
	redstone: function(signal){
		this.data.isActive = signal.power > 0;
		if(this.data.isActive){
			MachineRenderer.mapAtCoords(this.x, this.y, this.z, BlockID.teleporter, 0);
		}
		else{
			BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
		}
	},
	
	init: MachineRegistry.initModel,
	destroy: this.deactivate
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.teleporter, count: 1, data: 0}, [
		"xax",
		"c#c",
		"xdx"
	], ['#', BlockID.machineBlockAdvanced, 0, 'x', ItemID.circuitAdvanced, 0, 'a', ItemID.freqTransmitter, 0, 'c', ItemID.cableOptic, 0, 'd', 264, 0]);
});




// file: machine/misc/tree/root.js

TileEntity.registerPrototype(BlockID.rubberTreeLog, {	
	addLatex: function(){
		var possibleYs = [];
		var checkY = this.y + 1;
		while (true){
			var block = World.getBlock(this.x, checkY, this.z);
			if (block.id == BlockID.rubberTreeLog){
				possibleYs.push(checkY);
			}
			else if (block.id != BlockID.rubberTreeLogLatex){
				break;
			}
			checkY++;
		}
		
		var randomY = possibleYs[parseInt(Math.random() * possibleYs.length)];
		World.setBlock(this.x, randomY, this.z, BlockID.rubberTreeLogLatex, parseInt(Math.random() * 4));
	},
	
	checkLog: function(){
		var block = World.getBlock(this.x, this.y - 1, this.z);
		if (block.id == BlockID.rubberTreeLog || block.id == BlockID.rubberTreeLogLatex){
			this.selfDestroy();
		}
	},
	
	tick: function(){
		if (World.getThreadTime() % 100 == 0){
			if (Math.random() < .125){
				this.addLatex();
			}
			this.checkLog();
		}
	}
});




// file: machine/misc/tree/sapling.js

var RUBBER_SAPLING_GROUND_TILES = {
	2: true,
	3: true,
	60: true
};

IDRegistry.genItemID("rubberSapling");
Item.createItem("rubberSapling", "Rubber Tree Sapling", {name: "rubber_sapling", data: 0});

Item.registerUseFunction("rubberSapling", function(coords, item, tile){
	var place = coords.relative;
	var tile1 = World.getBlock(place.x, place.y, place.z);
	var tile2 = World.getBlock(place.x, place.y - 1, place.z);
	
	if (GenerationUtils.isTransparentBlock(tile1.id) && RUBBER_SAPLING_GROUND_TILES[tile2.id]){
		World.setBlock(place.x, place.y, place.z, BlockID.rubberTreeSapling);
		World.addTileEntity(place.x, place.y, place.z);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
	}
});

IDRegistry.genBlockID("rubberTreeSapling");
Block.createBlock("rubberTreeSapling", [
	{name: "Rubber Tree Sapling", texture: [["empty", 0], ["empty", 0], ["empty", 0], ["empty", 0], ["empty", 0], ["empty", 0]], inCreative: false}
]);

Block.setBlockShape(BlockID.rubberTreeSapling, {x: 0.001, y: 0.001, z: 0.001}, {x: 0.999, y: 0.1, z: 0.999});
Block.registerDropFunction("rubberTreeSapling", function(){
	return [[ItemID.rubberSapling, 1, 0]];
});

TileEntity.registerPrototype(BlockID.rubberTreeSapling, {
	defaultValues: {
		size: 0,
		growth: 0,
		lastGrowth: 0
	},
	
	created: function(){
		this.data.size = .85 + Math.random() * .25;
	},
	
	initAnimation: function(){
		this.animation1 = new Animation.Item(this.x + .5, this.y + this.data.size / 2 - .02, this.z + .5);
		this.animation2 = new Animation.Item(this.x + .5, this.y + this.data.size / 2 - .02, this.z + .5);
		this.animation1.describeItem({
			id: ItemID.rubberSapling,
			count: 1,
			data: 0,
			rotation: "x",
			size: this.data.size
		});
		this.animation1.load();
		
		this.animation2.describeItem({
			id: ItemID.rubberSapling,
			count: 1,
			data: 0,
			rotation: "z",
			size: this.data.size
		});
		this.animation2.load();
	},
	
	destroyAnimation: function(){
		if (this.animation1){
			this.animation1.destroy();
		}
		if (this.animation2){
			this.animation2.destroy();
		}
	},
	
	updateAnimation: function(){
		this.destroyAnimation();
		this.initAnimation();
	},
	
	init: function(){
		this.initAnimation();
	},
	
	destroy: function(){
		this.destroyAnimation();
	},
	
	tick: function(){
		if (World.getThreadTime() % 20 == 0){
			this.data.growth += Math.random() * 2;
			this.checkGrowth();
			if (!RUBBER_SAPLING_GROUND_TILES[World.getBlockID(this.x, this.y - 1, this.z)]){
				World.destroyBlock(this.x, this.y, this.z, true);
				this.selfDestroy();
			}
		}
	},
	
	click: function(id, count, data){
		if (id == 351 && data == 15){
			this.data.growth += 256 + Math.random() * 128;
			this.checkGrowth();
			Player.setCarriedItem(id, count - 1, data);
		}
	},
	
	checkGrowth: function(){
		if (this.data.growth - 56 > this.data.lastGrowth){
			this.data.size += (this.data.growth - this.data.lastGrowth) / 480;
			this.data.lastGrowth = this.data.growth;
			this.updateAnimation();
		}
		if (this.data.growth > 512){
			this.selfDestroy();
			RubberTreeGenerationHelper.generateRubberTree(this.x, this.y, this.z, true);
		}
	}
});




// file: items/resource/ore_drop.js

IDRegistry.genItemID("uraniumChunk");
Item.createItem("uraniumChunk", "Uranium", {name: "uranium"});

IDRegistry.genItemID("iridiumChunk");
Item.createItem("iridiumChunk", "Iridium", {name: "iridium"});
Item.registerNameOverrideFunction(ItemID.iridiumChunk, RARE_ITEM_NAME);




// file: items/resource/crushed.js

// Crushed Ore
IDRegistry.genItemID("crushedCopper");
Item.createItem("crushedCopper", "Crushed Copper Ore", {name: "crushed_copper_ore"});

IDRegistry.genItemID("crushedTin");
Item.createItem("crushedTin", "Crushed Tin Ore", {name: "crushed_tin_ore"});

IDRegistry.genItemID("crushedIron");
Item.createItem("crushedIron", "Crushed Iron Ore", {name: "crushed_iron_ore"});

IDRegistry.genItemID("crushedLead");
Item.createItem("crushedLead", "Crushed Lead Ore", {name: "crushed_lead_ore"});

IDRegistry.genItemID("crushedGold");
Item.createItem("crushedGold", "Crushed Gold Ore", {name: "crushed_gold_ore"});

IDRegistry.genItemID("crushedSilver");
Item.createItem("crushedSilver", "Crushed Silver Ore", {name: "crushed_silver_ore"});

IDRegistry.genItemID("crushedUranium");
Item.createItem("crushedUranium", "Crushed Uranium Ore", {name: "crushed_uranium_ore"});

// Purified Crushed Ore
IDRegistry.genItemID("crushedPurifiedCopper");
Item.createItem("crushedPurifiedCopper", "Purified Crushed Copper Ore", {name: "purified_copper_ore"});

IDRegistry.genItemID("crushedPurifiedTin");
Item.createItem("crushedPurifiedTin", "Purified Crushed Tin Ore", {name: "purified_tin_ore"});

IDRegistry.genItemID("crushedPurifiedIron");
Item.createItem("crushedPurifiedIron", "Purified Crushed Iron Ore", {name: "purified_iron_ore"});

IDRegistry.genItemID("crushedPurifiedLead");
Item.createItem("crushedPurifiedLead", "Purified Crushed Lead Ore", {name: "purified_lead_ore"});

IDRegistry.genItemID("crushedPurifiedGold");
Item.createItem("crushedPurifiedGold", "Purified Crushed Gold Ore", {name: "purified_gold_ore"});

IDRegistry.genItemID("crushedPurifiedSilver");
Item.createItem("crushedPurifiedSilver", "Purified Crushed Silver Ore", {name: "purified_silver_ore"});

IDRegistry.genItemID("crushedPurifiedUranium");
Item.createItem("crushedPurifiedUranium", "Purified Crushed Uranium Ore", {name: "purified_uranium_ore"});




// file: items/resource/dust.js

//Dust
IDRegistry.genItemID("dustCopper");
Item.createItem("dustCopper", "Copper Dust", {name: "dust_copper"});

IDRegistry.genItemID("dustTin");
Item.createItem("dustTin", "Tin Dust", {name: "dust_tin"});

IDRegistry.genItemID("dustBronze");
Item.createItem("dustBronze", "Bronze Dust", {name: "dust_bronze"});

IDRegistry.genItemID("dustIron");
Item.createItem("dustIron", "Iron Dust", {name: "dust_iron"});

IDRegistry.genItemID("dustLead");
Item.createItem("dustLead", "Lead Dust", {name: "dust_lead"});

IDRegistry.genItemID("dustGold");
Item.createItem("dustGold", "Gold Dust", {name: "dust_gold"});

IDRegistry.genItemID("dustSilver");
Item.createItem("dustSilver", "Silver Dust", {name: "dust_silver"});

IDRegistry.genItemID("dustStone");
Item.createItem("dustStone", "Stone Dust", {name: "dust_stone"});

IDRegistry.genItemID("dustCoal");
Item.createItem("dustCoal", "Coal Dust", {name: "dust_coal"});

IDRegistry.genItemID("dustSulfur");
Item.createItem("dustSulfur", "Sulfur Dust", {name: "dust_sulfur"});

IDRegistry.genItemID("dustLapis");
Item.createItem("dustLapis", "Lapis Dust", {name: "dust_lapis"});

IDRegistry.genItemID("dustDiamond");
Item.createItem("dustDiamond", "Diamond Dust", {name: "dust_diamond"});

IDRegistry.genItemID("dustEnergium");
Item.createItem("dustEnergium", "Energium Dust", {name: "dust_energium"});

// Small Dust
IDRegistry.genItemID("dustSmallCopper");
Item.createItem("dustSmallCopper", "Tiny Pile of Copper Dust", {name: "dust_copper_small"});

IDRegistry.genItemID("dustSmallTin");
Item.createItem("dustSmallTin", "Tiny Pile of Tin Dust", {name: "dust_tin_small"});

IDRegistry.genItemID("dustSmallIron");
Item.createItem("dustSmallIron", "Tiny Pile of Iron Dust", {name: "dust_iron_small"});

IDRegistry.genItemID("dustSmallLead");
Item.createItem("dustSmallLead", "Tiny Pile of Lead Dust", {name: "dust_lead_small"});

IDRegistry.genItemID("dustSmallGold");
Item.createItem("dustSmallGold", "Tiny Pile of Gold Dust", {name: "dust_gold_small"});

IDRegistry.genItemID("dustSmallSilver");
Item.createItem("dustSmallSilver", "Tiny Pile of Silver Dust", {name: "dust_silver_small"});

IDRegistry.genItemID("dustSmallSulfur");
Item.createItem("dustSmallSulfur", "Tiny Pile of Sulfur Dust", {name: "dust_sulfur_small"});

// Recipe
Recipes.addShaped({id: ItemID.dustEnergium, count: 9, data: 0}, [
	"xax",
	"axa",
	"xax",
], ['x', 331, 0, 'a', ItemID.dustDiamond, 0]);

addShapelessRecipe({id: ItemID.dustBronze, count: 4, data: 0}, [{id: ItemID.crushedCopper, count: 3, data: 0}, {id: ItemID.crushedTin, count: 1, data: 0}]);
addShapelessRecipe({id: ItemID.dustBronze, count: 4, data: 0}, [{id: ItemID.crushedPurifiedCopper, count: 3, data: 0}, {id: ItemID.crushedPurifiedTin, count: 1, data: 0}]);
addShapelessRecipe({id: ItemID.dustBronze, count: 4, data: 0}, [{id: ItemID.dustCopper, count: 3, data: 0}, {id: ItemID.dustTin, count: 1, data: 0}]);

Recipes.addShaped({id: ItemID.dustCopper, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx",
], ['x', ItemID.dustSmallCopper, 0]);

Recipes.addShaped({id: ItemID.dustTin, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx",
], ['x', ItemID.dustSmallTin, 0]);

Recipes.addShaped({id: ItemID.dustIron, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx",
], ['x', ItemID.dustSmallIron, 0]);

Recipes.addShaped({id: ItemID.dustLead, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx",
], ['x', ItemID.dustSmallLead, 0]);

Recipes.addShaped({id: ItemID.dustGold, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx",
], ['x', ItemID.dustSmallGold, 0]);

Recipes.addShaped({id: ItemID.dustSilver, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx",
], ['x', ItemID.dustSmallSilver, 0]);

Recipes.addShaped({id: ItemID.dustSulfur, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx",
], ['x', ItemID.dustSmallSulfur, 0]);




// file: items/resource/ingot.js

IDRegistry.genItemID("ingotCopper");
Item.createItem("ingotCopper", "Copper Ingot", {name: "ingot_copper"});

IDRegistry.genItemID("ingotTin");
Item.createItem("ingotTin", "Tin Ingot", {name: "ingot_tin"});

IDRegistry.genItemID("ingotBronze");
Item.createItem("ingotBronze", "Bronze Ingot", {name: "ingot_bronze"});

IDRegistry.genItemID("ingotSteel");
Item.createItem("ingotSteel", "Steel Ingot", {name: "ingot_steel"});

IDRegistry.genItemID("ingotLead");
Item.createItem("ingotLead", "Lead Ingot", {name: "ingot_lead"});

IDRegistry.genItemID("ingotSilver");
Item.createItem("ingotSilver", "Silver Ingot", {name: "ingot_silver"});

Callback.addCallback("PreLoaded", function(){
	// steel
	Recipes.addFurnace(265, ItemID.ingotSteel, 0);
	// from ore
	Recipes.addFurnace(BlockID.oreCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(BlockID.oreTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(BlockID.oreLead, ItemID.ingotLead, 0);
	// from crushed ore
	Recipes.addFurnace(ItemID.crushedIron, 265, 0);
	Recipes.addFurnace(ItemID.crushedGold, 266, 0);
	Recipes.addFurnace(ItemID.crushedCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(ItemID.crushedTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(ItemID.crushedLead, ItemID.ingotLead, 0);
	Recipes.addFurnace(ItemID.crushedSilver, ItemID.ingotSilver, 0);
	// from purified ore
	Recipes.addFurnace(ItemID.crushedPurifiedIron, 265, 0);
	Recipes.addFurnace(ItemID.crushedPurifiedGold, 266, 0);
	Recipes.addFurnace(ItemID.crushedPurifiedCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(ItemID.crushedPurifiedTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(ItemID.crushedPurifiedLead, ItemID.ingotLead, 0);
	Recipes.addFurnace(ItemID.crushedPurifiedSilver, ItemID.ingotSilver, 0);
	// from dust
	Recipes.addFurnace(ItemID.dustCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(ItemID.dustTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(ItemID.dustLead, ItemID.ingotLead, 0);
	Recipes.addFurnace(ItemID.dustBronze, ItemID.ingotBronze, 0);
	Recipes.addFurnace(ItemID.dustIron, 265, 0);
	Recipes.addFurnace(ItemID.dustGold, 266, 0);
	Recipes.addFurnace(ItemID.dustSilver, ItemID.ingotSilver, 0);
	// from plates
	Recipes.addFurnace(ItemID.plateCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(ItemID.plateTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(ItemID.plateBronze, ItemID.ingotBronze, 0);
	Recipes.addFurnace(ItemID.plateIron, 265, 0);
	Recipes.addFurnace(ItemID.plateGold, 266, 0);
	Recipes.addFurnace(ItemID.plateLead, ItemID.ingotLead, 0);
});




// file: items/resource/plates.js

IDRegistry.genItemID("plateCopper");
Item.createItem("plateCopper", "Copper Plate", {name: "plate_copper"});

IDRegistry.genItemID("plateTin");
Item.createItem("plateTin", "Tin Plate", {name: "plate_tin"});

IDRegistry.genItemID("plateBronze");
Item.createItem("plateBronze", "Bronze Plate", {name: "plate_bronze"});

IDRegistry.genItemID("plateIron");
Item.createItem("plateIron", "Iron Plate", {name: "plate_iron"});

IDRegistry.genItemID("plateSteel");
Item.createItem("plateSteel", "Steel Plate", {name: "plate_steel"});

IDRegistry.genItemID("plateGold");
Item.createItem("plateGold", "Gold Plate", {name: "plate_gold"});

IDRegistry.genItemID("plateLead");
Item.createItem("plateLead", "Lead Plate", {name: "plate_lead"});

IDRegistry.genItemID("plateLapis");
Item.createItem("plateLapis", "Lapis Plate", {name: "plate_lapis"});

// recipes
Callback.addCallback("PostLoaded", function(){
	addRecipeWithCraftingTool({id: ItemID.plateCopper, count: 1, data: 0}, [{id: ItemID.ingotCopper, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.plateTin, count: 1, data: 0}, [{id: ItemID.ingotTin, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.plateBronze, count: 1, data: 0}, [{id: ItemID.ingotBronze, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.plateIron, count: 1, data: 0}, [{id: 265, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.plateSteel, count: 1, data: 0}, [{id: ItemID.ingotSteel, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.plateGold, count: 1, data: 0}, [{id: 266, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.plateLead, count: 1, data: 0}, [{id: ItemID.ingotLead, data: 0}], ItemID.craftingHammer);
});





// file: items/resource/casing.js

IDRegistry.genItemID("casingCopper");
Item.createItem("casingCopper", "Copper Casing", {name: "casing_copper"});

IDRegistry.genItemID("casingTin");
Item.createItem("casingTin", "Tin Casing", {name: "casing_tin"});

IDRegistry.genItemID("casingBronze");
Item.createItem("casingBronze", "Bronze Casing", {name: "casing_bronze"});

IDRegistry.genItemID("casingIron");
Item.createItem("casingIron", "Iron Casing", {name: "casing_iron"});

IDRegistry.genItemID("casingSteel");
Item.createItem("casingSteel", "Steel Casing", {name: "casing_steel"});

IDRegistry.genItemID("casingGold");
Item.createItem("casingGold", "Gold Casing", {name: "casing_gold"});

IDRegistry.genItemID("casingLead");
Item.createItem("casingLead", "Lead Casing", {name: "casing_lead"});

// recipes
Callback.addCallback("PostLoaded", function(){
	addRecipeWithCraftingTool({id: ItemID.casingCopper, count: 2, data: 0}, [{id: ItemID.plateCopper, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.casingTin, count: 2, data: 0}, [{id: ItemID.plateTin, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.casingBronze, count: 2, data: 0}, [{id: ItemID.plateBronze, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.casingIron, count: 2, data: 0}, [{id: ItemID.plateIron, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.casingSteel, count: 2, data: 0}, [{id: ItemID.plateSteel, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.casingGold, count: 2, data: 0}, [{id: ItemID.plateGold, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.casingLead, count: 2, data: 0}, [{id: ItemID.plateLead, data: 0}], ItemID.craftingHammer);
});




// file: items/resource/scrap.js

IDRegistry.genItemID("scrap");
Item.createItem("scrap", "Scrap", {name: "scrap"});
Recipes.addFurnaceFuel(ItemID.scrap, 0, 348);

IDRegistry.genItemID("scrapBox");
Item.createItem("scrapBox", "Scrap Box", {name: "scrap_box"});
Recipes.addFurnaceFuel(ItemID.scrapBox, 0, 3148);

Recipes.addShaped({id: ItemID.scrapBox, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.scrap, -1]);
	
MachineRecipeRegistry.addRecipeFor("catalyser", ItemID.scrap, {input: 5000, output: 30000});
MachineRecipeRegistry.addRecipeFor("catalyser", ItemID.scrapBox, {input: 45000, output: 270000});

Item.registerUseFunction("scrapBox", function(coords, item, block){
	var drop = getScrapDropItem();
	World.drop(coords.relative.x + 0.5, coords.relative.y + 0.1, coords.relative.z + 0.5, drop.id, 1, drop.data);
	item.count--;
	if(!item.count){item.id = 0;}
	Player.setCarriedItem(item.id, item.count, 0);
});











	
var SCRAP_BOX_RANDOM_DROP = [
	{chance: .1, id: 264, data: 0},
	{chance: 1.8, id: 15, data: 0},
	{chance: 1.0, id: 14, data: 0},
	{chance: 3, id: 331, data: 0},
	{chance: 0.5, id: 348, data: 0},
	{chance: 5, id: 351, data: 15},
	{chance: 2, id: 17, data: 0},
	{chance: 2, id: 6, data: 0},
	{chance: 2, id: 263, data: 0},
	{chance: 3, id: 260, data: 0},
	{chance: 2.1, id: 262, data: 0},
	{chance: 1, id: 354, data: 0},
	{chance: 3, id: 296, data: 0},
	{chance: 5, id: 280, data: 0},
	{chance: 3.5, id: 287, data: 0},
	{chance: 10, id: 3, data: 0},
	{chance: 3, id: 12, data: 0},
	{chance: 3, id: 13, data: 0},
	{chance: 4, id: 2, data: 0},
	{chance: 1.0, id: ItemID.dustIron, data: 0},
	{chance: 0.8, id: ItemID.dustGold, data: 0},
	{chance: 1.2, id: ItemID.dustCopper, data: 0},
	{chance: 1.2, id: ItemID.dustLead, data: 0},
	{chance: 1.2, id: ItemID.dustTin, data: 0},
	{chance: 1.2, id: ItemID.dustCoal, data: 0},
	{chance: 0.4, id: ItemID.dustDiamond, data: 0},
	{chance: 1.0, id: ItemID.casingIron, data: 0},
	{chance: 0.8, id: ItemID.casingGold, data: 0},
	{chance: 1.2, id: ItemID.casingCopper, data: 0},
	{chance: 1.2, id: ItemID.casingLead, data: 0},
	{chance: 1.2, id: ItemID.casingTin, data: 0},
	{chance: 1.2, id: ItemID.casingCoal, data: 0},
	{chance: 0.4, id: ItemID.casingDiamond, data: 0},
	{chance: 2, id: ItemID.rubber, data: 0},
	{chance: 2, id: ItemID.latex, data: 0},
	{chance: 0.4, id: ItemID.uraniumChunk, data: 0},
	{chance: 2.5, id: ItemID.oreCrushedCopper, data: 0},
	{chance: 1.5, id: ItemID.oreCrushedTin, data: 0},
	{chance: 1.5, id: ItemID.oreCrushedLead, data: 0},
];

function getScrapDropItem(){
	var total = 0;
	for (var i in SCRAP_BOX_RANDOM_DROP){
		total += SCRAP_BOX_RANDOM_DROP[i].chance;
	}
	var random = Math.random() * total * 1.4;
	var current = 0;
	for (var i in SCRAP_BOX_RANDOM_DROP){
		var drop = SCRAP_BOX_RANDOM_DROP[i];
		if (current < random && current + drop.chance > random){
			return drop;
		}
		current += drop.chance;
	}
	
	return {id: ItemID.scrap, data: 0};
}




// file: items/resource/produced.js

IDRegistry.genItemID("matter");
Item.createItem("matter", "UU-Matter", {name: "uu_matter"});
Item.registerNameOverrideFunction(ItemID.matter, RARE_ITEM_NAME);

IDRegistry.genItemID("plateReinforcedIridium");
Item.createItem("plateReinforcedIridium", "Iridium Reinforced Plate", {name: "plate_reinforced_iridium"});
Item.registerNameOverrideFunction(ItemID.plateReinforcedIridium, RARE_ITEM_NAME);

IDRegistry.genItemID("ingotAlloy");
Item.createItem("ingotAlloy", "Alloy Ingot", {name: "ingot_alloy"});

IDRegistry.genItemID("plateAlloy");
Item.createItem("plateAlloy", "Alloy Plate", {name: "plate_alloy"});

IDRegistry.genItemID("carbonFibre");
Item.createItem("carbonFibre", "Carbon Fibre", {name: "carbon_fibre"});

IDRegistry.genItemID("carbonMesh");
Item.createItem("carbonMesh", "Carbon Mesh", {name: "carbon_mesh"});

IDRegistry.genItemID("carbonPlate");
Item.createItem("carbonPlate", "Carbon Plate", {name: "carbon_plate"});

IDRegistry.genItemID("coalBall");
Item.createItem("coalBall", "Coal Ball", {name: "coal_ball"});

IDRegistry.genItemID("coalBlock");
Item.createItem("coalBlock", "Coal Block", {name: "coal_block"});

IDRegistry.genItemID("coalChunk");
Item.createItem("coalChunk", "Coal Chunk", {name: "coal_chunk"});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.ingotAlloy, count: 2, data: 0}, [
		"aaa",
		"bbb",
		"ccc"
	], ['a', ItemID.plateSteel, 0, 'b', ItemID.plateBronze, 0, 'c', ItemID.plateTin, 0]);
	
	Recipes.addShaped({id: ItemID.carbonFibre, count: 1, data: 0}, [
		"xx",
		"xx"
	], ['x', ItemID.dustCoal, 0]);
	
	Recipes.addShaped({id: ItemID.carbonMesh, count: 1, data: 0}, [
		"x",
		"x"
	], ['x', ItemID.carbonFibre, 0]);
	
	Recipes.addShaped({id: ItemID.coalBall, count: 1, data: 0}, [
		"xxx",
		"x#x",
		"xxx"
	], ['x', ItemID.dustCoal, 0, '#', 318, 0]);
	
	Recipes.addShaped({id: ItemID.coalChunk, count: 1, data: 0}, [
		"xxx",
		"x#x",
		"xxx"
	], ['x', ItemID.coalBlock, -1, '#', 49, -1]);
	
	Recipes.addShaped({id: ItemID.plateReinforcedIridium, count: 1, data: 0}, [
		"xax",
		"a#a",
		"xax"
	], ['x', ItemID.iridiumChunk, 0, '#', 264, 0, 'a', ItemID.plateAlloy, 0]);
	
	
	// uu-matter
	Recipes.addShaped({id: ItemID.iridiumChunk, count: 1, data: 0}, [
		"xxx",
		" x ",
		"xxx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 17, count: 8, data: 0}, [
		" x ",
		"   ",
		"   "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 1, count: 16, data: 0}, [
		"   ",
		" x ",
		"   "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 80, count: 16, data: 0}, [
		"x x",
		"   ",
		"   "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 2, count: 16, data: 0}, [
		"   ",
		"x  ",
		"x  "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 49, count: 12, data: 0}, [
		"x x",
		"x x",
		"   "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 20, count: 32, data: 0}, [
		" x ",
		"x x",
		" x "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 351, count: 32, data: 3}, [
		"xx ",
		"  x",
		"xx "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 348, count: 32, data: 0}, [
		" x ",
		"x x",
		"xxx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 81, count: 48, data: 0}, [
		" x ",
		"xxx",
		"x x"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 338, count: 48, data: 0}, [
		"x x",
		"x x",
		"x x"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 106, count: 24, data: 0}, [
		"x  ",
		"x  ",
		"x  "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 332, count: 48, data: 0}, [
		"   ",
		"   ",
		"xxx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 337, count: 48, data: 0}, [
		"xx ",
		"x  ",
		"xx "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 111, count: 64, data: 0}, [
		"x x",
		" x ",
		" x "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 289, count: 16, data: 0}, [
		"xxx",
		"x  ",
		"xxx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 288, count: 32, data: 0}, [
		" x ",
		" x ",
		"x x"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 351, count: 48, data: 0}, [
		" xx",
		" xx",
		" x "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 263, count: 5, data: 0}, [
		"x  ",
		"  x",
		"x  "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 15, count: 2, data: 0}, [
		"x x",
		" x ",
		"x x"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 14, count: 2, data: 0}, [
		" x ",
		"xxx",
		" x "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 331, count: 24, data: 0}, [
		"   ",
		" x ",
		"xxx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 351, count: 9, data: 4}, [
		" x ",
		" x ",
		" xx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 1, count: 16, data: 0}, [
		"   ",
		" x ",
		"   "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 388, count: 2, data: 0}, [
		"xxx",
		"xxx",
		" x "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 264, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: ItemID.latex, count: 21, data: 0}, [
		"x x",
		"   ",
		"x x"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: ItemID.dustCopper, count: 10, data: 0}, [
		"  x",
		"x x",
		"   "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: ItemID.dustTin, count: 10, data: 0}, [
		"   ",
		"x x",
		"  x"
	], ['x', ItemID.matter, -1]);
});




// file: items/resource/rubber.js

IDRegistry.genItemID("latex");
Item.createItem("latex", "Latex", {name: "latex", data: 0});

IDRegistry.genItemID("rubber");
Item.createItem("rubber", "Rubber", {name: "rubber", data: 0});

Recipes.addFurnace(ItemID.latex, ItemID.rubber, 0);




// file: items/energy/cable.js

IDRegistry.genItemID("cableTin0");
IDRegistry.genItemID("cableTin1");
Item.createItem("cableTin0", "Tin Cable", {name: "cable_tin", meta: 0});
Item.createItem("cableTin1", "Tin Cable (insulated)", {name: "cable_tin", meta: 1});

IDRegistry.genItemID("cableCopper0");
IDRegistry.genItemID("cableCopper1");
Item.createItem("cableCopper0", "Copper Cable", {name: "cable_copper", meta: 0});
Item.createItem("cableCopper1", "Copper Cable (insulated)", {name: "cable_copper", meta: 1});

IDRegistry.genItemID("cableGold0");
IDRegistry.genItemID("cableGold2");
Item.createItem("cableGold0", "Gold Cable", {name: "cable_gold", meta: 0});
Item.createItem("cableGold2", "Gold Cable (insulated x2)", {name: "cable_gold", meta: 2});

IDRegistry.genItemID("cableIron0");
IDRegistry.genItemID("cableIron3");
Item.createItem("cableIron0", "HV Cable", {name: "cable_iron", meta: 0});
Item.createItem("cableIron3", "HV Cable (insulated x3)", {name: "cable_iron", meta: 3});

IDRegistry.genItemID("cableOptic");
Item.createItem("cableOptic", "Glass Fibre Cable", {name: "cable_optic", meta: 0});

Recipes.addShaped({id: ItemID.cableOptic, count: 4, data: 0}, [
	"aaa",
	"x#x",
	"aaa"
], ['#', ItemID.dustSilver, 0, 'x', ItemID.dustEnergium, 0, 'a', 20, 0]);

Callback.addCallback("PostLoaded", function(){
	// cutting recipes
	addRecipeWithCraftingTool({id: ItemID.cableTin0, count: 3, data: 0}, [{id: ItemID.plateTin, data: 0}], ItemID.craftingCutter);
	addRecipeWithCraftingTool({id: ItemID.cableCopper0, count: 3, data: 0}, [{id: ItemID.plateCopper, data: 0}], ItemID.craftingCutter);
	addRecipeWithCraftingTool({id: ItemID.cableGold0, count: 4, data: 0}, [{id: ItemID.plateGold, data: 0}], ItemID.craftingCutter);

	// isolation recipes
	addShapelessRecipe({id: ItemID.cableTin1, count: 1, data: 0}, [{id: ItemID.cableTin0, count: 1, data: 0}, {id: ItemID.rubber, count: 1, data: 0}]);
	addShapelessRecipe({id: ItemID.cableCopper1, count: 1, data: 0}, [{id: ItemID.cableCopper0, count: 1, data: 0}, {id: ItemID.rubber, count: 1, data: 0}]);
	addShapelessRecipe({id: ItemID.cableGold2, count: 1, data: 0}, [{id: ItemID.cableGold0, count: 1, data: 0}, {id: ItemID.rubber, count: 2, data: 0}]);
	addShapelessRecipe({id: ItemID.cableIron3, count: 1, data: 0}, [{id: ItemID.cableIron0, count: 1, data: 0}, {id: ItemID.rubber, count: 3, data: 0}]);
});


// place funcs 
Item.registerUseFunction("cableTin1", function(coords, item, block){
	var place = coords.relative;
	if(GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableTin);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyTypeRegistry.onWirePlaced();
	}
});

Item.registerUseFunction("cableCopper1", function(coords, item, block){
	var place = coords.relative;
	if(GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableCopper);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyTypeRegistry.onWirePlaced();
	}
});

Item.registerUseFunction("cableGold2", function(coords, item, block){
	var place = coords.relative;
	if(GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableGold);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyTypeRegistry.onWirePlaced();
	}
});

Item.registerUseFunction("cableIron3", function(coords, item, block){
	var place = coords.relative;
	if(GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableIron);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyTypeRegistry.onWirePlaced();
	}
});

Item.registerUseFunction("cableOptic", function(coords, item, block){
	var place = coords.relative;
	if(GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableOptic);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyTypeRegistry.onWirePlaced();
	}
});




// file: items/energy/components.js

IDRegistry.genItemID("circuitBasic");
IDRegistry.genItemID("circuitAdvanced");
Item.createItem("circuitBasic", "Circuit", {name: "circuit", meta: 0});
Item.createItem("circuitAdvanced", "Advanced Circuit", {name: "circuit", meta: 1});

IDRegistry.genItemID("coil");
IDRegistry.genItemID("electricMotor");
IDRegistry.genItemID("powerUnit");
IDRegistry.genItemID("powerUnitSmall");
Item.createItem("coil", "Coil", {name: "coil", meta: 0});
Item.createItem("electricMotor", "Electric Motor", {name: "motor", meta: 0});
Item.createItem("powerUnit", "Power Unit", {name: "power_unit", meta: 0});
Item.createItem("powerUnitSmall", "Small Power Unit", {name: "power_unit_small", meta: 0});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.circuitBasic, count: 1, data: 0}, [
		"xxx",
		"a#a",
		"xxx"
	], ['x', ItemID.cableCopper1, 0, 'a', 331, 0, '#', ItemID.plateIron, 0]);
	Recipes.addShaped({id: ItemID.circuitBasic, count: 1, data: 0}, [
		"xax",
		"x#x",
		"xax"
	], ['x', ItemID.cableCopper1, 0, 'a', 331, 0, '#', ItemID.plateIron, 0]);

	Recipes.addShaped({id: ItemID.circuitAdvanced, count: 1, data: 0}, [
		"xbx",
		"a#a",
		"xbx"
	], ['x', 331, 0, 'a', 348, 0, 'b', ItemID.dustLapis, 0, '#', ItemID.circuitBasic, 0]);
	Recipes.addShaped({id: ItemID.circuitAdvanced, count: 1, data: 0}, [
		"xax",
		"b#b",
		"xax"
	], ['x', 331, 0, 'a', 348, 0, 'b', ItemID.dustLapis, 0, '#', ItemID.circuitBasic, 0]);


	Recipes.addShaped({id: ItemID.coil, count: 1, data: 0}, [
		"aaa",
		"axa",
		"aaa"
	], ['x', 265, 0, 'a', ItemID.cableCopper0, 0]);

	Recipes.addShaped({id: ItemID.electricMotor, count: 1, data: 0}, [
		" b ",
		"axa",
		" b "
	], ['x', 265, 0, 'a', ItemID.coil, 0, 'b', ItemID.casingTin, 0]);

	Recipes.addShaped({id: ItemID.powerUnit, count: 1, data: 0}, [
		"acs",
		"axe",
		"acs"
	], ["x", ItemID.circuitBasic, 0, 'e', ItemID.electricMotor, 0,  "a", ItemID.storageBattery, -1, "s", ItemID.casingIron, 0, "c", ItemID.cableCopper0, 0]);
	Recipes.addShaped({id: ItemID.powerUnitSmall, count: 1, data: 0}, [
		" cs",
		"axe",
		" cs"
	], ["x", ItemID.circuitBasic, 0, 'e', ItemID.electricMotor, 0,  "a", ItemID.storageBattery, -1, "s", ItemID.casingIron, 0, "c", ItemID.cableCopper0, 0]);
});




// file: items/energy/storage.js

IDRegistry.genItemID("storageBattery");
Item.createItem("storageBattery", "Battery", {name: "re_battery", meta: 4}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageBattery, 10000, 0);

IDRegistry.genItemID("storageAdvBattery");
Item.createItem("storageAdvBattery", "Advanced Battery", {name: "adv_re_battery", meta: 4}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageAdvBattery, 100000, 1);

IDRegistry.genItemID("storageCrystal");
Item.createItem("storageCrystal", "Energy Crystal", {name: "energy_crystal", meta: 2}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageCrystal, 1000000, 2);

IDRegistry.genItemID("storageLapotronCrystal");
Item.createItem("storageLapotronCrystal", "Lapotron Crystal", {name: "lapotron_crystal", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageLapotronCrystal, 10000000, 3);

IDRegistry.genItemID("debugItem");
Item.createItem("debugItem", "debug.item", {name: "debug_item", meta: 0}, {isTech: !debugMode});

Item.registerNameOverrideFunction(ItemID.storageBattery, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.storageAdvBattery, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.storageCrystal, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.storageLapotronCrystal, ENERGY_ITEM_NAME);


var RECIPE_FUNC_TRANSPORT_ENERGY = function(api, field, result){
	var energy = 0;
	for(var i in field){
		if(!ChargeItemRegistry.isFlashStorage(field[i].id)){
			energy += ChargeItemRegistry.getEnergyFrom(field[i], 10000000, 3, true);
		}
		api.decreaseFieldSlot(i);
	}
	ChargeItemRegistry.addEnergyTo(result, energy, energy, 3);
}

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.storageBattery, count: 1, data: Item.getMaxDamage(ItemID.storageBattery)}, [
		" x ",
		"a#a",
		"a#a"
	], ['x', ItemID.cableTin1, 0, 'a', ItemID.casingTin, 0, '#', 331, 0]);
	
	Recipes.addShaped({id: ItemID.storageAdvBattery, count: 1, data: Item.getMaxDamage(ItemID.storageAdvBattery)}, [
		"xbx",
		"bab",
		"bcb"
	], ['x', ItemID.cableCopper1, 0, 'a', ItemID.dustSulfur, 0, 'b', ItemID.casingBronze, 0, 'c', ItemID.dustLead, 0]);

	Recipes.addShaped({id: ItemID.storageLapotronCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageLapotronCrystal)}, [
		"x#x",
		"xax",
		"x#x"
	], ['a', ItemID.storageCrystal, -1, 'x', ItemID.dustLapis, 0, '#', ItemID.circuitAdvanced, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
});

Item.registerUseFunction("debugItem", function(coords, item, block){
	Game.message(block.id+":"+block.data);
	var machine = EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z);
	if(machine){
		for(var i in machine.data){
			if(i != "energy_storage"){
				if(i == "energy"){
				Game.message("energy: " + machine.data[i] + "/" + machine.getEnergyStorage());}
				else{
				Game.message(i + ": " + machine.data[i]);}
			}
		}
	}
});




// file: items/other/cells.js

IDRegistry.genItemID("cellEmpty");
IDRegistry.genItemID("cellWater");
IDRegistry.genItemID("cellLava");
Item.createItem("cellEmpty", "Cell", {name: "cell_empty"});
Item.createItem("cellWater", "Water Cell", {name: "cell_water"});
Item.createItem("cellLava", "Lava Cell", {name: "cell_lava"});
Item.setLiquidClip(ItemID.cellEmpty, true);
LiquidRegistry.registerItem("water", {id: ItemID.cellEmpty, data: 0}, {id: ItemID.cellWater, data: 0});
LiquidRegistry.registerItem("lava", {id: ItemID.cellEmpty, data: 0}, {id: ItemID.cellLava, data: 0});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.cellEmpty, count: 2, data: 0}, [
		" x ",
		"x x",
		" x "
	], ['x', ItemID.casingTin, 0]);
});

Item.registerUseFunction("cellEmpty", function(coords, item, block){
	if(block.id >= 8 && block.id <= 11 && block.data == 0){
		World.setBlock(coords.x, coords.y, coords.z, 0);
		var item = Player.getCarriedItem();
		item.count--;
		if(!item.count){item.id = 0;}
		Player.setCarriedItem(item.id, item.count, 1);
		if(block.id==8 || block.id==9){Player.addItemToInventory(ItemID.cellWater, 1);}
		else{Player.addItemToInventory(ItemID.cellLava, 1);}
	}
});

Callback.addCallback("ItemUse", function(coords, item, block){
	if(item.id==ItemID.cellWater || item.id==ItemID.cellLava){
		var x = coords.relative.x
		var y = coords.relative.y
		var z = coords.relative.z
		var block = World.getBlockID(x,y,z)
		if(block==0){
			if(item.id==ItemID.cellWater){World.setBlock(x, y, z, 8);}
			else{World.setBlock(x, y, z, 10);}
			var item = Player.getCarriedItem();
			item.count--;
			if(!item.count) item.id = 0;
			Player.setCarriedItem(item.id, item.count, item.data);
			Player.addItemToInventory(ItemID.cellEmpty, 1);
		}
	}
});




// file: items/other/upgrades.js

IDRegistry.genItemID("upgradeMFSU");
Item.createItem("upgradeMFSU", "MFSU Upgrade Kit", {name: "mfsu_upgrade", meta: 0});

IDRegistry.genItemID("upgradeOverclocker");
Item.createItem("upgradeOverclocker", "Overclocker Upgrade", {name: "upgrade_overclocker", meta: 0}, {stack: 16});

IDRegistry.genItemID("upgradeEnergyStorage");
Item.createItem("upgradeEnergyStorage", "Energy Storage Upgrade", {name: "upgrade_energy_storage", meta: 0});

//IDRegistry.genItemID("upgradeTransformer");
//Item.createItem("upgradeTransformer", "Transformer Upgrade", {name: "upgrade_transformer", meta: 0});

IDRegistry.genItemID("upgradeRedstone");
Item.createItem("upgradeRedstone", "Redstone Signal Inverter Upgrade", {name: "upgrade_redstone_inv", meta: 0});

IDRegistry.genItemID("upgradePulling");
IDRegistry.genItemID("upgradePulling1");
IDRegistry.genItemID("upgradePulling2");
IDRegistry.genItemID("upgradePulling3");
IDRegistry.genItemID("upgradePulling4");
IDRegistry.genItemID("upgradePulling5");
IDRegistry.genItemID("upgradePulling6");
Item.createItem("upgradePulling", "Pulling Upgrade", {name: "upgrade_pulling", meta: 0});
Item.createItem("upgradePulling1", "Pulling Upgrade", {name: "upgrade_pulling", meta: 1}, {isTech: true});
Item.createItem("upgradePulling2", "Pulling Upgrade", {name: "upgrade_pulling", meta: 2}, {isTech: true});
Item.createItem("upgradePulling3", "Pulling Upgrade", {name: "upgrade_pulling", meta: 3}, {isTech: true});
Item.createItem("upgradePulling4", "Pulling Upgrade", {name: "upgrade_pulling", meta: 4}, {isTech: true});
Item.createItem("upgradePulling5", "Pulling Upgrade", {name: "upgrade_pulling", meta: 5}, {isTech: true});
Item.createItem("upgradePulling6", "Pulling Upgrade", {name: "upgrade_pulling", meta: 6}, {isTech: true});

IDRegistry.genItemID("upgradeEjector");
IDRegistry.genItemID("upgradeEjector1");
IDRegistry.genItemID("upgradeEjector2");
IDRegistry.genItemID("upgradeEjector3");
IDRegistry.genItemID("upgradeEjector4");
IDRegistry.genItemID("upgradeEjector5");
IDRegistry.genItemID("upgradeEjector6");
Item.createItem("upgradeEjector", "Ejector Upgrade", {name: "upgrade_ejector", meta: 0});
Item.createItem("upgradeEjector1", "Ejector Upgrade", {name: "upgrade_ejector", meta: 1}, {isTech: true});
Item.createItem("upgradeEjector2", "Ejector Upgrade", {name: "upgrade_ejector", meta: 2}, {isTech: true});
Item.createItem("upgradeEjector3", "Ejector Upgrade", {name: "upgrade_ejector", meta: 3}, {isTech: true});
Item.createItem("upgradeEjector4", "Ejector Upgrade", {name: "upgrade_ejector", meta: 4}, {isTech: true});
Item.createItem("upgradeEjector5", "Ejector Upgrade", {name: "upgrade_ejector", meta: 5}, {isTech: true});
Item.createItem("upgradeEjector6", "Ejector Upgrade", {name: "upgrade_ejector", meta: 6}, {isTech: true});

IDRegistry.genItemID("upgradeFluidEjector");
IDRegistry.genItemID("upgradeFluidEjector1");
IDRegistry.genItemID("upgradeFluidEjector2");
IDRegistry.genItemID("upgradeFluidEjector3");
IDRegistry.genItemID("upgradeFluidEjector4");
IDRegistry.genItemID("upgradeFluidEjector5");
IDRegistry.genItemID("upgradeFluidEjector6");
Item.createItem("upgradeFluidEjector", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 0});
Item.createItem("upgradeFluidEjector1", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 1}, {isTech: true});
Item.createItem("upgradeFluidEjector2", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 2}, {isTech: true});
Item.createItem("upgradeFluidEjector3", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 3}, {isTech: true});
Item.createItem("upgradeFluidEjector4", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 4}, {isTech: true});
Item.createItem("upgradeFluidEjector5", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 5}, {isTech: true});
Item.createItem("upgradeFluidEjector6", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 6}, {isTech: true});


Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.upgradeMFSU, count: 1, data: 0}, [
		"aca",
		"axa",
		"aba"
	], ['b', ItemID.wrench, 0, 'a', ItemID.storageLapotronCrystal, -1, 'x', BlockID.machineBlockAdvanced, 0, 'c', ItemID.circuitAdvanced, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeOverclocker, count: 1, data: 0}, [
		"aaa",
		"x#x",
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'a', ItemID.cellWater, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeEnergyStorage, count: 1, data: 0}, [
		"aaa",
		"x#x",
		"aca"
	], ['#', ItemID.storageBattery, -1, 'x', ItemID.cableCopper1, 0, 'a', 5, -1, 'c', ItemID.circuitBasic, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeRedstone, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x",
	], ['x', ItemID.plateTin, 0, '#', 69, -1]);
	
	Recipes.addShaped({id: ItemID.upgradePulling, count: 1, data: 0}, [
		"aba",
		"x#x",
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'a', 29, -1, 'b', 410, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeEjector, count: 1, data: 0}, [
		"aba",
		"x#x",
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'a', 33, -1, 'b', 410, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeFluidEjector, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x",
	], ['x', ItemID.plateTin, 0, '#', ItemID.electricMotor, 0]);
});


Item.registerUseFunction("upgradeMFSU", function(coords, item, block){
	if(block.id==BlockID.storageMFE){
		var tile = World.getTileEntity(coords.x ,coords.y, coords.z);
		var data = tile.data;
		tile.selfDestroy();
		World.setBlock(coords.x ,coords.y, coords.z, BlockID.storageMFSU, block.data);
		block = World.addTileEntity(coords.x ,coords.y, coords.z);
		block.data = data;
		item.count--;
		if(!item.count){item.id = 0;}
		Player.setCarriedItem(item.id, item.count, 1);
	}
});

function PULLING_UPGRADE_FUNC(machine, container, coords, direction){
	if(World.getThreadTime()%20 == 0){
		var items = [];
		var slots = machine.getTransportSlots().input;
		for(var i in slots){
			var item = container.getSlot(slots[i]);
			if(item.count < Item.getMaxStack(item.id)){
				items.push(item);
			}
		}
		if(items.length){
			var containers = UpgradeAPI.findNearestContainers(coords, direction);
			getItemsFrom(items, containers, machine);
		}
	}
}

function EJECTOR_UPGRADE_FUNC(machine, container, coords, direction){
	var items = [];
	var slots = machine.getTransportSlots().output;
	for(var i in slots){
		var item = container.getSlot(slots[i]);
		if(item.id){items.push(item);}
	}
	if(items.length){
		var containers = UpgradeAPI.findNearestContainers(coords, direction);
		addItemsToContainers(items, containers, machine);
	}
}

function FLUID_EJECTOR_UPGRADE_FUNC(machine, container, coords, direction){
	var liquidStor = machine.liquidStorage
	if(liquidStor){
		var storages = UpgradeAPI.findNearestLiquidStorages(coords, direction);
		addLiquidToStorages("water", liquidStor, storages);
		addLiquidToStorages("lava", liquidStor, storages);
		addLiquidToStorages("milk", liquidStor, storages);
	}
}

UpgradeAPI.registerUpgrade(ItemID.upgradeOverclocker, function(count, machine, container, data, coords){
	if(data.work_time){
		data.energy_consumption = Math.round(data.energy_consumption * Math.pow(1.6, count));
		data.work_time = Math.round(data.work_time * Math.pow(0.7, count));
	}
});

UpgradeAPI.registerUpgrade(ItemID.upgradeEnergyStorage, function(count, machine, container, data, coords){
	data.energy_storage += 10000 * count;
});

UpgradeAPI.registerUpgrade(ItemID.upgradePulling, function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, coords);
});
UpgradeAPI.registerUpgrade(ItemID.upgradePulling1, function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, coords, "down");
});
UpgradeAPI.registerUpgrade(ItemID.upgradePulling2, function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, coords, "up");
});
UpgradeAPI.registerUpgrade(ItemID.upgradePulling3, function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, coords, "north");
});
UpgradeAPI.registerUpgrade(ItemID.upgradePulling4, function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, coords, "south");
});
UpgradeAPI.registerUpgrade(ItemID.upgradePulling5, function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, coords, "west");
});
UpgradeAPI.registerUpgrade(ItemID.upgradePulling6, function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, coords, "east");
});

UpgradeAPI.registerUpgrade(ItemID.upgradeEjector, function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, coords);
});
UpgradeAPI.registerUpgrade(ItemID.upgradeEjector1, function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, coords, "down");
});
UpgradeAPI.registerUpgrade(ItemID.upgradeEjector2, function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, coords, "up");
});
UpgradeAPI.registerUpgrade(ItemID.upgradeEjector3, function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, coords, "north");
});
UpgradeAPI.registerUpgrade(ItemID.upgradeEjector4, function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, coords, "south");
});
UpgradeAPI.registerUpgrade(ItemID.upgradeEjector5, function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, coords, "west");
});
UpgradeAPI.registerUpgrade(ItemID.upgradeEjector6, function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, coords, "east");
});

UpgradeAPI.registerUpgrade(ItemID.upgradeFluidEjector, function(count, machine, container, data, coords){
	FLUID_EJECTOR_UPGRADE_FUNC(machine, container, coords);
});
UpgradeAPI.registerUpgrade(ItemID.upgradeFluidEjector1, function(count, machine, container, data, coords){
	FLUID_EJECTOR_UPGRADE_FUNC(machine, container, coords, "down");
});
UpgradeAPI.registerUpgrade(ItemID.upgradeFluidEjector2, function(count, machine, container, data, coords){
	FLUID_EJECTOR_UPGRADE_FUNC(machine, container, coords, "up");
});
UpgradeAPI.registerUpgrade(ItemID.upgradeFluidEjector3, function(count, machine, container, data, coords){
	FLUID_EJECTOR_UPGRADE_FUNC(machine, container, coords, "north");
});
UpgradeAPI.registerUpgrade(ItemID.upgradeFluidEjector4, function(count, machine, container, data, coords){
	FLUID_EJECTOR_UPGRADE_FUNC(machine, container, coords, "south");
});
UpgradeAPI.registerUpgrade(ItemID.upgradeFluidEjector5, function(count, machine, container, data, coords){
	FLUID_EJECTOR_UPGRADE_FUNC(machine, container, coords, "west");
});
UpgradeAPI.registerUpgrade(ItemID.upgradeFluidEjector6, function(count, machine, container, data, coords){
	FLUID_EJECTOR_UPGRADE_FUNC(machine, container, coords, "east");
});


Item.registerUseFunction("upgradePulling", function(coords, item, block){
	Player.setCarriedItem(ItemID["upgradePulling" + (coords.side+1)], item.count);
});
for(var i = 1; i <= 6; i++){
Item.registerUseFunction("upgradePulling"+i, function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradePulling, item.count);
});
}

Item.registerUseFunction("upgradeEjector", function(coords, item, block){
	Player.setCarriedItem(ItemID["upgradeEjector" + (coords.side+1)], item.count);
});
for(var i = 1; i <= 6; i++){
Item.registerUseFunction("upgradeEjector"+i, function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradeEjector, item.count);
});
}

Item.registerUseFunction("upgradeFluidEjector", function(coords, item, block){
	Player.setCarriedItem(ItemID["upgradeFluidEjector" + (coords.side+1)], item.count);
});
for(var i = 1; i <= 6; i++){
Item.registerUseFunction("upgradeFluidEjector"+i, function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradeFluidEjector, item.count);
});
}




// file: items/armor/bronze.js

IDRegistry.genItemID("bronzeHelmet");
IDRegistry.genItemID("bronzeChestplate");
IDRegistry.genItemID("bronzeLeggings");
IDRegistry.genItemID("bronzeBoots");

Item.createArmorItem("bronzeHelmet", "Bronze Helmet", {name: "bronze_helmet"}, {type: "helmet", armor: 2, durability: 149, texture: "armor/bronze_1.png"});
Item.createArmorItem("bronzeChestplate", "Bronze Chestplate", {name: "bronze_chestplate"}, {type: "chestplate", armor: 6, durability: 216, texture: "armor/bronze_1.png"});
Item.createArmorItem("bronzeLeggings", "Bronze Leggings", {name: "bronze_leggings"}, {type: "leggings", armor: 5, durability: 203, texture: "armor/bronze_2.png"});
Item.createArmorItem("bronzeBoots", "Bronze Boots", {name: "bronze_boots"}, {type: "boots", armor: 2, durability: 176, texture: "armor/bronze_1.png"});

Recipes.addShaped({id: ItemID.bronzeHelmet, count: 1, data: 0}, [
	"xxx",
	"x x"
], ['x', ItemID.ingotBronze, 0]);

Recipes.addShaped({id: ItemID.bronzeChestplate, count: 1, data: 0}, [
	"x x",
	"xxx",
	"xxx"
], ['x', ItemID.ingotBronze, 0]);

Recipes.addShaped({id: ItemID.bronzeLeggings, count: 1, data: 0}, [
	"xxx",
	"x x",
	"x x"
], ['x', ItemID.ingotBronze, 0]);

Recipes.addShaped({id: ItemID.bronzeBoots, count: 1, data: 0}, [
	"x x",
	"x x"
], ['x', ItemID.ingotBronze, 0]);




// file: items/armor/composite.js

IDRegistry.genItemID("compositeHelmet");
IDRegistry.genItemID("compositeChestplate");
IDRegistry.genItemID("compositeLeggings");
IDRegistry.genItemID("compositeBoots");

Item.createArmorItem("compositeHelmet", "Composite Helmet", {name: "composite_helmet"}, {type: "helmet", armor: 3, durability: 330, texture: "armor/composite_1.png"});
Item.createArmorItem("compositeChestplate", "Composite Chestplate", {name: "composite_chestplate"}, {type: "chestplate", armor: 8, durability: 480, texture: "armor/composite_1.png"});
Item.createArmorItem("compositeLeggings", "Composite Leggings", {name: "composite_leggings"}, {type: "leggings", armor: 6, durability: 450, texture: "armor/composite_2.png"});
Item.createArmorItem("compositeBoots", "Composite Boots", {name: "composite_boots"}, {type: "boots", armor: 3, durability: 390, texture: "armor/composite_1.png"});

Recipes.addShaped({id: ItemID.compositeHelmet, count: 1, data: 0}, [
	"xxx",
	"x x"
], ['x', ItemID.plateAlloy, 0]);

Recipes.addShaped({id: ItemID.compositeChestplate, count: 1, data: 0}, [
	"x x",
	"xxx",
	"xxx"
], ['x', ItemID.plateAlloy, 0]);

Recipes.addShaped({id: ItemID.compositeLeggings, count: 1, data: 0}, [
	"xxx",
	"x x",
	"x x"
], ['x', ItemID.plateAlloy, 0]);

Recipes.addShaped({id: ItemID.compositeBoots, count: 1, data: 0}, [
	"x x",
	"x x"
], ['x', ItemID.plateAlloy, 0]);




// file: items/armor/armor_buttons.js

var currentUIscreen;
Callback.addCallback("NativeGuiChanged", function(screenName){
	currentUIscreen = screenName;
	if(screenName != "hud_screen" && screenName != "in_game_play_screen"){
		if(UIbuttons.container){
			UIbuttons.container.close();
			UIbuttons.container = null;
		}
	}
});

var UIbuttons = {
	isEnabled: false,
	nightvision: false,
	container: null,
	Window: new UI.Window({
		location: {
			x: 925,
			y: UI.getScreenHeight()/2-75,
			width: 75,
			height: 300
		},
		drawing: [{type: "background", color: 0}],
		elements: {}
	}),
	
	setButton: function(id, name){
		armorData[id] = name;
	},
	registerButton: function(name, properties){
		buttonContent[name] = properties;
	}
}

var armorData = {};

var buttonMap = {
	button_nightvision: false,
	button_fly: false,
	button_jump: false,
}

var buttonContent = {
	button_nightvision: {
		y: 0,
		type: "button",
		bitmap: "button_nightvision_on",
		bitmap2: "button_nightvision_off",
		scale: 50,
		clicker: {
			onClick: function(){
				if(UIbuttons.nightvision){
					UIbuttons.nightvision = false;
					Game.message("§4Nightvision mode disabled");
				}
				else{
					UIbuttons.nightvision = true;
					Game.message("§2Nightvision mode enabled");
				}
			}
		}
	},
	button_fly: {
		y: 1000,
		type: "button",
		bitmap: "button_fly_on",
		bitmap2: "button_fly_off",
		scale: 50
	},
	button_jump: {
		y: 2000,
		type: "button",
		bitmap: "button_jump_on",
		bitmap2: "button_jump_off",
		scale: 50,
		clicker: {
			onClick: function(){
				var armor = Player.getArmorSlot(3);
				if(Item.getMaxDamage(armor.id) - armor.data >= 1000 && Math.abs(Player.getVelocity().y + 0.078) < 0.01){
					Player.addVelocity(0, 1.4, 0);
					Player.setArmorSlot(3, armor.id, 1, armor.data+1000);
				}
			}
		}
	}
}

UIbuttons.Window.setAsGameOverlay(true);

function updateUIbuttons(){
	var elements = UIbuttons.Window.content.elements;
	for(var name in buttonMap){
		if(buttonMap[name]){
			if(!elements[name]){
				elements[name] = buttonContent[name];
			}
			elements[name].x = 0;
			buttonMap[name] = false;
		}
		else{
			elements[name] = null;
		}
	}
}


Callback.addCallback("tick", function(){
	var armor = [Player.getArmorSlot(0), Player.getArmorSlot(1), Player.getArmorSlot(2), Player.getArmorSlot(3)];
	activeButtons = [];
	for(var i in armor){
		var button = armorData[armor[i].id];
		if(button){
			buttonMap[button] = true;
			UIbuttons.isEnabled = true;
		}
	}
	if(UIbuttons.isEnabled && (currentUIscreen == "hud_screen" || currentUIscreen == "in_game_play_screen")){
		updateUIbuttons();
		if(!UIbuttons.container){
			UIbuttons.container = new UI.Container();
			UIbuttons.container.openAs(UIbuttons.Window);
		}
		if(UIbuttons.container.isElementTouched("button_fly")){
			var armor = armor[1];
			var y = Player.getPosition().y
			var maxDmg = Item.getMaxDamage(armor.id)
			if(armor.data < maxDmg && y < 256){ 
				if(World.getThreadTime() % 10 == 0){
					Player.setArmorSlot(1, armor.id, 1, Math.min(armor.data+50, maxDmg));
				}
				var vel = Player.getVelocity();
				var vy = Math.min(32, 264-y) / 160;
				if(vel.y < 0.67){
					Player.addVelocity(0, Math.min(vy, 0.67-vel.y), 0);
				}
			}
		}
	}
	else{
		if(UIbuttons.container){
			UIbuttons.container.close();
			UIbuttons.container = null;
		}
	}
	UIbuttons.isEnabled = false;
});




// file: items/armor/nightvision.js

IDRegistry.genItemID("nightvisionGoggles");
Item.createArmorItem("nightvisionGoggles", "Nightvision Goggles", {name: "nightvision"}, {type: "helmet", armor: 1, durability: 100000, texture: "armor/nightvision_1.png", isTech: false});
ChargeItemRegistry.registerItem(ItemID.nightvisionGoggles, 100000, 0, true);
Item.registerNameOverrideFunction(ItemID.nightvisionGoggles, ENERGY_ITEM_NAME);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.nightvisionGoggles, count: 1, data: Item.getMaxDamage(ItemID.nightvisionGoggles)}, [
		"ibi",
		"aca",
		"r r"
	], ['a', 102, 0, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitAdvanced, 0, "i", ItemID.casingIron, 0, "r", ItemID.rubber, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
});

UIbuttons.setButton(ItemID.nightvisionGoggles, "button_nightvision");

Armor.registerFuncs("nightvisionGoggles", {
	hurt: function(){
		return false;
	},
	tick: function(slot, index, maxDamage){
		if(UIbuttons.nightvision && slot.data < maxDamage){
			var coords = Player.getPosition();
			if(World.getLightLevel(coords.x, coords.y, coords.z)==15){
				Entity.addEffect(player, MobEffect.blindness, 1, 25);
			}
			Entity.addEffect(player, MobEffect.nightVision, 1, 225);
			if(World.getThreadTime()%20==0){
				slot.data = Math.min(slot.data+20, maxDamage);
				return true;
			}
		}
		return false;
	}
});




// file: items/armor/nano.js

IDRegistry.genItemID("nanoHelmet");
IDRegistry.genItemID("nanoChestplate");
IDRegistry.genItemID("nanoLeggings");
IDRegistry.genItemID("nanoBoots");

Item.createArmorItem("nanoHelmet", "Nano Helmet", {name: "nano_helmet"}, {type: "helmet", armor: 4, durability: 625, texture: "armor/nano_1.png", isTech: false});
Item.createArmorItem("nanoChestplate", "Nano Chestplate", {name: "nano_chestplate"}, {type: "chestplate", armor: 8, durability: 625, texture: "armor/nano_1.png", isTech: false});
Item.createArmorItem("nanoLeggings", "Nano Leggings", {name: "nano_leggings"}, {type: "leggings", armor: 6, durability: 625, texture: "armor/nano_2.png", isTech: false});
Item.createArmorItem("nanoBoots", "Nano Boots", {name: "nano_boots"}, {type: "boots", armor: 4, durability: 625, texture: "armor/nano_1.png", isTech: false});

ChargeItemRegistry.registerItem(ItemID.nanoHelmet, 1000000, 1, true);
ChargeItemRegistry.registerItem(ItemID.nanoChestplate, 1000000, 1, true);
ChargeItemRegistry.registerItem(ItemID.nanoLeggings, 1000000, 1, true);
ChargeItemRegistry.registerItem(ItemID.nanoBoots, 1000000, 1, true);

Item.registerNameOverrideFunction(ItemID.nanoHelmet, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.nanoChestplate, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.nanoLeggings, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.nanoBoots, ENERGY_ITEM_NAME);

IDRegistry.genItemID("nanoHelmetUncharged");
IDRegistry.genItemID("nanoChestplateUncharged");
IDRegistry.genItemID("nanoLeggingsUncharged");
IDRegistry.genItemID("nanoBootsUncharged");

Item.createArmorItem("nanoHelmetUncharged", "Nano Helmet", {name: "nano_helmet"}, {type: "helmet", armor: 2, durability: 625, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoChestplateUncharged", "Nano Chestplate", {name: "nano_chestplate"}, {type: "chestplate", armor: 6, durability: 625, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoLeggingsUncharged", "Nano Leggings", {name: "nano_leggings"}, {type: "leggings", armor: 3, durability: 625, texture: "armor/nano_2.png", isTech: true});
Item.createArmorItem("nanoBootsUncharged", "Nano Boots", {name: "nano_boots"}, {type: "boots", armor: 2, durability: 625, texture: "armor/nano_1.png", isTech: true});

ChargeItemRegistry.registerItem(ItemID.nanoHelmetUncharged, 1000000, 2, true);
ChargeItemRegistry.registerItem(ItemID.nanoChestplateUncharged, 1000000, 2, true);
ChargeItemRegistry.registerItem(ItemID.nanoLeggingsUncharged, 1000000, 2, true);
ChargeItemRegistry.registerItem(ItemID.nanoBootsUncharged, 1000000, 2, true);

Item.registerNameOverrideFunction(ItemID.nanoHelmetUncharged, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.nanoChestplateUncharged, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.nanoLeggingsUncharged, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.nanoBootsUncharged, ENERGY_ITEM_NAME);


MachineRecipeRegistry.registerRecipesFor("nano-armor-charge", {
	"ItemID.nanoHelmet": {charged: ItemID.nanoHelmet, uncharged: ItemID.nanoHelmetUncharged},
	"ItemID.nanoHelmetUncharged": {charged: ItemID.nanoHelmet, uncharged: ItemID.nanoHelmetUncharged},
	"ItemID.nanoChestplate": {charged: ItemID.nanoChestplate, uncharged: ItemID.nanoChestplateUncharged},
	"ItemID.nanoChestplateUncharged": {charged: ItemID.nanoChestplate, uncharged: ItemID.nanoChestplateUncharged},
	"ItemID.nanoLeggings": {charged: ItemID.nanoLeggings, uncharged: ItemID.nanoLeggingsUncharged},
	"ItemID.nanoLeggingsUncharged": {charged: ItemID.nanoLeggings, uncharged: ItemID.nanoLeggingsUncharged},
	"ItemID.nanoBoots": {charged: ItemID.nanoBoots, uncharged: ItemID.nanoBootsUncharged},
	"ItemID.nanoBootsUncharged": {charged: ItemID.nanoBoots, uncharged: ItemID.nanoBootsUncharged},
}, true);

UIbuttons.setButton(ItemID.nanoHelmet, "button_nightvision");

var NANO_ARMOR_FUNCS_CHARGED = {
	maxDamage: Item.getMaxDamage(ItemID.nanoHelmet),
	
	hurt: function(params, item, index, maxDamage){
		var type = params.type;
		if(type==2 || type==3 || type==11){
			var energy = params.damage * 800;
			item.data = Math.min(item.data + energy, maxDamage);
		}
		if(type==5 && index==3 && item.data +800 <= maxDamage){
			var damage = Math.min(9, Math.floor((maxDamage - item.data)/800));
			if(params.damage > damage){
				Entity.setHealth(player, Entity.getHealth(player) + damage);
			}
			else{
				Game.prevent();
			}
			item.data = Math.min(item.data + damage * 800, maxDamage);
		}
		return true;
	},
	
	tick: function(slot, index, maxDamage){
		var armor = MachineRecipeRegistry.getRecipeResult("nano-armor-charge", slot.id);
		if(slot.data >= maxDamage){
			slot.id = armor.uncharged;
			return true;
		}
		else{
			if(index==0 && UIbuttons.nightvision){
				var coords = Player.getPosition();
				if(World.getLightLevel(coords.x, coords.y, coords.z)==15){
					Entity.addEffect(player, MobEffect.blindness, 1, 25);
				}
				Entity.addEffect(player, MobEffect.nightVision, 1, 225);
				if(World.getThreadTime()%20==0){
					slot.data = Math.min(slot.data+20, maxDamage);
					return true;
				}
			}
			if(slot.id != armor.charged){
				slot.id = armor.charged;
				return true;
			}
		}
		return false;
	}
};

Armor.registerFuncs("nanoHelmet", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoHelmetUncharged", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoChestplate", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoChestplateUncharged", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoLeggings", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoLeggingsUncharged", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoBoots", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoBootsUncharged", NANO_ARMOR_FUNCS_CHARGED);


Recipes.addShaped({id: ItemID.nanoHelmet, count: 1, data: Item.getMaxDamage(ItemID.nanoHelmet)}, [
	"x#x",
	"xax"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0, 'a', ItemID.nightvisionGoggles, -1], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.nanoChestplate, count: 1, data: Item.getMaxDamage(ItemID.nanoChestplate)}, [
	"x x",
	"x#x",
	"xxx"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.nanoLeggings, count: 1, data: Item.getMaxDamage(ItemID.nanoLeggings)}, [
	"x#x",
	"x x",
	"x x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.nanoBoots, count: 1, data: Item.getMaxDamage(ItemID.nanoBoots)}, [
	"x x",
	"x#x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], RECIPE_FUNC_TRANSPORT_ENERGY);




// file: items/armor/quantum.js

IDRegistry.genItemID("quantumHelmet");
IDRegistry.genItemID("quantumChestplate");
IDRegistry.genItemID("quantumLeggings");
IDRegistry.genItemID("quantumBoots");

Item.createArmorItem("quantumHelmet", "Quantum Helmet", {name: "quantum_helmet"}, {type: "helmet", armor: 5, durability: 8333, texture: "armor/quantum_1.png", isTech: false});
Item.createArmorItem("quantumChestplate", "Quantum Chestplate", {name: "quantum_chestplate"}, {type: "chestplate", armor: 9, durability: 8333, texture: "armor/quantum_1.png", isTech: false});
Item.createArmorItem("quantumLeggings", "Quantum Leggings", {name: "quantum_leggings"}, {type: "leggings", armor: 7, durability: 8333, texture: "armor/quantum_2.png", isTech: false});
Item.createArmorItem("quantumBoots", "Quantum Boots", {name: "quantum_boots"}, {type: "boots", armor: 4, durability: 8333, texture: "armor/quantum_1.png", isTech: false});

ChargeItemRegistry.registerItem(ItemID.quantumHelmet, 10000000, 3, true);
ChargeItemRegistry.registerItem(ItemID.quantumChestplate, 10000000, 3, true);
ChargeItemRegistry.registerItem(ItemID.quantumLeggings, 10000000, 3, true);
ChargeItemRegistry.registerItem(ItemID.quantumBoots, 10000000, 3, true);

Item.registerNameOverrideFunction(ItemID.quantumHelmet, RARE_ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.quantumChestplate, RARE_ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.quantumLeggings, RARE_ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.quantumBoots, RARE_ENERGY_ITEM_NAME);

IDRegistry.genItemID("quantumHelmetUncharged");
IDRegistry.genItemID("quantumChestplateUncharged");
IDRegistry.genItemID("quantumLeggingsUncharged");
IDRegistry.genItemID("quantumBootsUncharged");

Item.createArmorItem("quantumHelmetUncharged", "Quantum Helmet", {name: "quantum_helmet"}, {type: "helmet", armor: 2, durability: 8333, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumChestplateUncharged", "Quantum Chestplate", {name: "quantum_chestplate"}, {type: "chestplate", armor: 6, durability: 8333, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumLeggingsUncharged", "Quantum Leggings", {name: "quantum_leggings"}, {type: "leggings", armor: 3, durability: 8333, texture: "armor/quantum_2.png", isTech: true});
Item.createArmorItem("quantumBootsUncharged", "Quantum Boots", {name: "quantum_boots"}, {type: "boots", armor: 2, durability: 8333, texture: "armor/quantum_1.png", isTech: true});

ChargeItemRegistry.registerItem(ItemID.quantumHelmetUncharged, 10000000, 3, true);
ChargeItemRegistry.registerItem(ItemID.quantumChestplateUncharged, 10000000, 3, true);
ChargeItemRegistry.registerItem(ItemID.quantumLeggingsUncharged, 10000000, 3, true);
ChargeItemRegistry.registerItem(ItemID.quantumBootsUncharged, 10000000, 3, true);

Item.registerNameOverrideFunction(ItemID.quantumHelmetUncharged, RARE_ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.quantumChestplateUncharged, RARE_ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.quantumLeggingsUncharged, RARE_ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.quantumBootsUncharged, RARE_ENERGY_ITEM_NAME);


MachineRecipeRegistry.registerRecipesFor("quantum-armor-charge", {
    "ItemID.quantumHelmet": {charged: ItemID.quantumHelmet, uncharged: ItemID.quantumHelmetUncharged},
    "ItemID.quantumHelmetUncharged": {charged: ItemID.quantumHelmet, uncharged: ItemID.quantumHelmetUncharged},
    "ItemID.quantumChestplate": {charged: ItemID.quantumChestplate, uncharged: ItemID.quantumChestplateUncharged},
    "ItemID.quantumChestplateUncharged": {charged: ItemID.quantumChestplate, uncharged: ItemID.quantumChestplateUncharged},
    "ItemID.quantumLeggings": {charged: ItemID.quantumLeggings, uncharged: ItemID.quantumLeggingsUncharged},
    "ItemID.quantumLeggingsUncharged": {charged: ItemID.quantumLeggings, uncharged: ItemID.quantumLeggingsUncharged},
    "ItemID.quantumBoots": {charged: ItemID.quantumBoots, uncharged: ItemID.quantumBootsUncharged},
    "ItemID.quantumBootsUncharged": {charged: ItemID.quantumBoots, uncharged: ItemID.quantumBootsUncharged},
}, true);

UIbuttons.setButton(ItemID.quantumHelmet, "button_nightvision");
UIbuttons.setButton(ItemID.quantumChestplate, "button_fly");
UIbuttons.setButton(ItemID.quantumBoots, "button_jump");

var runTime = 0;

var QUANTUM_ARMOR_FUNCS_CHARGED = {
	hurt: function(params, item, index, maxDamage){
		var type = params.type;
		if(type==2 || type==3 || type==11){
			var energy = params.damage * 900;
			item.data = Math.min(item.data + energy, maxDamage);
		}
		if(type==5 && index==3 && item.data + 900 <= maxDamage){
			var damage = Math.min(params.damage, Math.floor((maxDamage - item.data)/900));
			if(params.damage > damage){
				Entity.setHealth(player, Entity.getHealth(player) + damage);
			}
			else{
				Game.prevent();
			}
			item.data = Math.min(item.data + damage*900, maxDamage);
		}
		return true;
	},
	
	tick: function(slot, index, maxDamage){
		var armor = MachineRecipeRegistry.getRecipeResult("quantum-armor-charge", slot.id);
		if(slot.data >= maxDamage){
			slot.id = armor.uncharged;
			return true;
		}
		else{
			switch (index){
			case 0:
				Entity.clearEffect(player, MobEffect.poison);
				Entity.clearEffect(player, MobEffect.wither);
				if(UIbuttons.nightvision){
					var coords = Player.getPosition();
					if(World.getLightLevel(coords.x, coords.y, coords.z)==15){
						Entity.addEffect(player, MobEffect.blindness, 1, 25);
					}
					Entity.addEffect(player, MobEffect.nightVision, 1, 225);
					if(World.getThreadTime()%20==0){
						slot.data = Math.min(slot.data+20, maxDamage);
						return true;
					}
				}
			break;
			case 1:
				Entity.addEffect(player, MobEffect.fireResistance, 1, 2);
			break;
			case 2:
				var vel = Player.getVelocity();
				var horizontalVel = Math.sqrt(vel.x*vel.x + vel.z*vel.z)
				if(horizontalVel > 0.15){
					if(Math.abs(vel.y+0.078) < 0.001){runTime++;}
				}
				else{runTime = 0;}
				if(runTime > 2 && !Player.getFlying()){
					if(World.getThreadTime()%10==0){
						slot.data = Math.min(slot.data + Math.floor(horizontalVel*1200), maxDamage);
						return true;
					}
					Entity.addEffect(player, MobEffect.movementSpeed, 5, 3);
				}
			break;
			}
			if(slot.id != armor.charged){
				slot.id = armor.charged;
				return true;
			}
		}
		return false;
	}
};

Armor.registerFuncs("quantumHelmet", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumHelmetUncharged", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumChestplate", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumChestplateUncharged", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumLeggings", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumLeggingsUncharged", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumBoots", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumBootsUncharged", QUANTUM_ARMOR_FUNCS_CHARGED);


Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.quantumHelmet, count: 1, data: Item.getMaxDamage(ItemID.quantumHelmet)}, [
		"a#a",
		"bxb"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoHelmet, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', BlockID.reinforcedGlass, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
	
	Recipes.addShaped({id: ItemID.quantumChestplate, count: 1, data: Item.getMaxDamage(ItemID.quantumChestplate)}, [
		"bxb",
		"a#a",
		"aca"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoChestplate, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.plateAlloy, 0, 'c', ItemID.jetpack, -1], RECIPE_FUNC_TRANSPORT_ENERGY);
	
	Recipes.addShaped({id: ItemID.quantumLeggings, count: 1, data: Item.getMaxDamage(ItemID.quantumLeggings)}, [
		"m#m",
		"axa",
		"c c"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoLeggings, -1, 'a', ItemID.plateReinforcedIridium, 0, 'm', BlockID.machineBlockBasic, 0, 'c', 348, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
	
	Recipes.addShaped({id: ItemID.quantumBoots, count: 1, data: Item.getMaxDamage(ItemID.quantumBoots)}, [
		"axa",
		"b#b"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoBoots, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.plateAlloy, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
});




// file: items/armor/jetpack.js

IDRegistry.genItemID("jetpack");
Item.createArmorItem("jetpack", "Jetpack", {name: "jetpack"}, {type: "chestplate", armor: 3, durability: 30000, texture: "armor/jetpack_1.png", isTech: false});
ChargeItemRegistry.registerItem(ItemID.jetpack, 30000, 0, true);
Item.registerNameOverrideFunction(ItemID.jetpack, ENERGY_ITEM_NAME);

Recipes.addShaped({id: ItemID.jetpack, count: 1, data: Item.getMaxDamage(ItemID.jetpack)}, [
	"bcb",
	"bab",
	"d d"
], ['a', BlockID.storageBatBox, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0, "d", 348, 0]);

UIbuttons.setButton(ItemID.jetpack, "button_fly");

Armor.registerFuncs("jetpack", {
	hurt: function(params, item, index, maxDamage){
		if(params.type==5){
			var vel = Player.getVelocity();
			if(vel.y < -0.226 && vel.y > -0.9){
				Game.prevent();
			}
		}
		return false;
	},
	tick: function(){
		return false;
	},
});




// file: items/armor/energy_packs.js

IDRegistry.genItemID("batpack");
IDRegistry.genItemID("advBatpack");
IDRegistry.genItemID("energypack");
IDRegistry.genItemID("lappack");

Item.createArmorItem("batpack", "Batpack", {name: "batpack"}, {type: "chestplate", armor: 3, durability: 60000, texture: "armor/batpack_1.png", isTech: false});
Item.createArmorItem("advBatpack", "Advanced Batpack", {name: "advanced_batpack"}, {type: "chestplate", armor: 3, durability: 600000, texture: "armor/advbatpack_1.png", isTech: false});
Item.createArmorItem("energypack", "Energy Pack", {name: "energy_pack"}, {type: "chestplate", armor: 3, durability: 2000000, texture: "armor/energypack_1.png", isTech: false});
Item.createArmorItem("lappack", "Lappack", {name: "lappack"}, {type: "chestplate", armor: 3, durability: 1000000, texture: "armor/lappack_1.png", isTech: false});

ChargeItemRegistry.registerItem(ItemID.batpack, 60000, 0);
ChargeItemRegistry.registerItem(ItemID.advBatpack, 600000, 1);
ChargeItemRegistry.registerItem(ItemID.energypack, 2000000, 2);
ChargeItemRegistry.registerItem(ItemID.lappack, 10000000, 3);

Item.registerNameOverrideFunction(ItemID.batpack, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.advBatpack, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.energypack, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.lappack, ENERGY_ITEM_NAME);

Recipes.addShaped({id: ItemID.batpack, count: 1, data: Item.getMaxDamage(ItemID.batpack)}, [
    "bcb",
    "bab",
    "b b"
], ['a', 5, -1, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitBasic, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.advBatpack, count: 1, data: Item.getMaxDamage(ItemID.advBatpack)}, [
    "bcb",
    "bab",
    "b b"
], ['a', ItemID.plateBronze, 0, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitBasic, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.energypack, count: 1, data: Item.getMaxDamage(ItemID.energypack)}, [
    "cbc",
    "aba",
    "b b"
], ['a', ItemID.storageCrystal, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.lappack, count: 1, data: Item.getMaxDamage(ItemID.lappack)}, [
    "bcb",
    "bab",
    "b b"
], ['a', ItemID.energypack, -1, 'b', 22, 0, 'c', ItemID.circuitAdvanced, 0], RECIPE_FUNC_TRANSPORT_ENERGY);


function registerStoragePack(id, level, tranfer){
	Armor.registerFuncs(id, {
		hurt: function(){
			return false;
		},
		tick: function(slot, index, maxDamage){
			return ENERGY_PACK_TICK(slot, maxDamage, level, tranfer);
		}
	});
}

var ENERGY_PACK_TICK = function(slot, maxDamage, level, transfer){
	if(World.getThreadTime()%20==0){
	    var item = Player.getCarriedItem();
	    var data = ChargeItemRegistry.getItemData(item.id);
	    if(!data || !data.isTool || data.level > level || item.data <= 1){
	        return false;
	    }
	    var energyAdd = Math.min(item.data - 1, Math.min(transfer*20, maxDamage - slot.data));
	    if(energyAdd > 0){
	        slot.data += energyAdd;
	        Player.setCarriedItem(item.id, 1, item.data - energyAdd);
	        return true;
		}
    }
    return false;
}

registerStoragePack("batpack", 0, 32);
registerStoragePack("advBatpack", 1, 256);
registerStoragePack("energypack", 2, 2048);
registerStoragePack("lappack", 3, 8192);




// file: items/tool/transmitter.js

IDRegistry.genItemID("freqTransmitter");
Item.createItem("freqTransmitter", "Frequency Transmitter", {name: "frequency_transmitter"});

Recipes.addShaped({id: ItemID.freqTransmitter, count: 1, data: 0}, [
	"x",
	"#",
	"b"
], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'b', ItemID.casingIron, 0]);

var teleporterFrequency;
Item.registerUseFunction("freqTransmitter", function(coords, item, block){
	if(block.id==BlockID.teleporter){
		if(!teleporterFrequency){
			teleporterFrequency = coords;
			Game.message("Frequency Transmitter linked to Teleporter");
		}
		else{
			if(teleporterFrequency == coords){
				Game.message("Can`t link Teleporter to itself");
			}
			else{
				var receiver = teleporterFrequency;
				var data = EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z).data;
				var distance = Entity.getDistanceBetweenCoords(coords, receiver);
				var basicTeleportationCost = Math.floor(5 * Math.pow((distance+10), 0.7));
				data.frequency = receiver;
				data.frequency.energy = basicTeleportationCost;
				data = EnergyTileRegistry.accessMachineAtCoords(receiver.x, receiver.y, receiver.z).data;
				data.frequency = coords;
				data.frequency.energy = basicTeleportationCost;
				Game.message("Teleportation link established");
			}
		}
	}
	else if(teleporterFrequency){
		teleporterFrequency = null;
		Game.message("Frequency Transmitter unlinked");
	}
});




// file: items/tool/scanner.js

IDRegistry.genItemID("scanner");
IDRegistry.genItemID("scannerAdvanced");
Item.createItem("scanner", "OD Scanner", {name: "scanner", meta: 0}, {stack: 1});
Item.createItem("scannerAdvanced", "OV Scanner", {name: "scanner_advanced", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.scanner, 10000, 0, true, true);
ChargeItemRegistry.registerItem(ItemID.scannerAdvanced, 10000, 0, true, true);

Item.registerNameOverrideFunction(ItemID.scanner, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.scannerAdvanced, ENERGY_ITEM_NAME);

Recipes.addShaped({id: ItemID.scanner, count: 1, data: 250}, [
	" a ",
	"cbc",
	"xxx"
], ['x', ItemID.cableCopper1, 0, 'a', 348, 0, "b", ItemID.storageBattery, -1, "c", ItemID.circuitBasic, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.scannerAdvanced, count: 1, data: 40}, [
	" a ",
	"asa",
	"xxx"
], ['x', ItemID.cableGold2, 0, 'a', 348, 0, "s", ItemID.scanner, -1], RECIPE_FUNC_TRANSPORT_ENERGY);
/*
Item.registerUseFunction("scanner", function(coords, item, block){
	if(item.data < Item.getMaxDamage(item.id)){
		Player.setCarriedItem(item.id, 1, item.data-1);
	}
});
*/




// file: items/tool/treetap.js

IDRegistry.genItemID("treetap");
Item.createItem("treetap", "Treetap", {name: "treetap", data: 0}, {stack: 1});
Item.setMaxDamage(ItemID.treetap, 17);

Item.registerUseFunction("treetap", function(coords, item, block){
	if(block.id == BlockID.rubberTreeLogLatex && block.data == coords.side - 2){
		World.setBlock(coords.x, coords.y, coords.z, BlockID.rubberTreeLog);
		Player.setCarriedItem(item.id, ++item.data < 17 ? item.count : 0, item.data);
		Entity.setVelocity(
			World.drop(
				coords.relative.x + 0.5,
				coords.relative.y + 0.5,
				coords.relative.z + 0.5,
				ItemID.latex, 1 + parseInt(Math.random() * 3), 0
			),
			(coords.relative.x - coords.x) * 0.25,
			(coords.relative.y - coords.y) * 0.25,
			(coords.relative.z - coords.z) * 0.25
		);
	}
});

Recipes.addShaped({id: ItemID.treetap, count: 1, data: 0}, [
	" x ",
	"xxx",
	"x  "
], ['x', 5, -1]);




// file: items/tool/crafting_tools.js

var CRAFTING_TOOL_MAX_DAMAGE = 96;

IDRegistry.genItemID("craftingHammer");
Item.createItem("craftingHammer", "Forge Hammer", {name: "crafting_hammer"}, {stack: 1});
Item.setMaxDamage(ItemID.craftingHammer, CRAFTING_TOOL_MAX_DAMAGE);

IDRegistry.genItemID("craftingCutter");
Item.createItem("craftingCutter", "Cutter", {name: "crafting_cutter"}, {stack: 1});
Item.setMaxDamage(ItemID.craftingCutter, CRAFTING_TOOL_MAX_DAMAGE);

function addRecipeWithCraftingTool(result, data, tool){
	data.push({id: tool, data: -1});
	Recipes.addShapeless(result, data, function(api, field, result){
		for (var i in field){
			if (field[i].id == tool){
				field[i].data++;
				if (field[i].data >= CRAFTING_TOOL_MAX_DAMAGE){
					field[i].id = field[i].count = field[i].data = 0;
				}
			}
			else {
				api.decreaseFieldSlot(i);
			}
		}
	});
}

Recipes.addShaped({id: ItemID.craftingHammer, count: 1, data: 0}, [
	"xxx",
	"x#x",
	" # "
], ['x', 265, 0, '#', 280, 0]);

Recipes.addShaped({id: ItemID.craftingCutter, count: 1, data: 0}, [
	"x x",
	" x ",
	"a a"
], ['a', 265, 0, 'x', ItemID.plateIron, 0]);




// file: items/tool/tool_box.js

IDRegistry.genItemID("toolbox");
Item.createItem("toolbox", "Tool Box", {name: "tool_box", meta: 0});

Recipes.addShaped({id: ItemID.toolbox, count: 1, data: 0}, [
	"axa",
	"aaa",
], ['x', 54, 0, 'a', ItemID.casingBronze, 0]);




// file: items/tool/bronze.js

IDRegistry.genItemID("bronzeSword");
IDRegistry.genItemID("bronzeShovel");
IDRegistry.genItemID("bronzePickaxe");
IDRegistry.genItemID("bronzeAxe");
IDRegistry.genItemID("bronzeHoe");
Item.createItem("bronzeSword", "Bronze Sword", {name: "bronze_sword", meta: 0}, {stack: 1});
Item.createItem("bronzeShovel", "Bronze Shovel", {name: "bronze_shovel", meta: 0}, {stack: 1});
Item.createItem("bronzePickaxe", "Bronze Pickaxe", {name: "bronze_pickaxe", meta: 0}, {stack: 1});
Item.createItem("bronzeAxe", "Bronze Axe", {name: "bronze_axe", meta: 0}, {stack: 1});
Item.createItem("bronzeHoe", "Bronze Hoe", {name: "bronze_hoe", meta: 0}, {stack: 1});

ToolAPI.addToolMaterial("bronze", {durability: 225, level: 3, efficiency: 6, damage: 2, enchantability: 14});
ToolAPI.setTool(ItemID.bronzeSword, "bronze", ToolType.sword);
ToolAPI.setTool(ItemID.bronzeShovel, "bronze", ToolType.shovel);
ToolAPI.setTool(ItemID.bronzePickaxe, "bronze", ToolType.pickaxe);
ToolAPI.setTool(ItemID.bronzeAxe, "bronze", ToolType.axe);
ToolAPI.setTool(ItemID.bronzeHoe, "bronze", ToolType.hoe);


Recipes.addShaped({id: ItemID.bronzeSword, count: 1, data: 0}, [
	"a",
	"a",
	"b"
], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);

Recipes.addShaped({id: ItemID.bronzeShovel, count: 1, data: 0}, [
	"a",
	"b",
	"b"
], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);

Recipes.addShaped({id: ItemID.bronzePickaxe, count: 1, data: 0}, [
	"aaa",
	" b ",
	" b "
], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);

Recipes.addShaped({id: ItemID.bronzeAxe, count: 1, data: 0}, [
	"aa",
	"ab",
	" b"
], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);

Recipes.addShaped({id: ItemID.bronzeHoe, count: 1, data: 0}, [
	"aa",
	" b",
	" b"
], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);




// file: items/tool/wrench.js

IDRegistry.genItemID("wrench");
Item.createItem("wrench", "Wrench", {name: "wrench", meta: 0}, {stack: 1});
Item.setMaxDamage(ItemID.wrench, 161);

IDRegistry.genItemID("electricWrench");
Item.createItem("electricWrench", "Electric Wrench", {name: "electric_wrench", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.electricWrench, 10000, 0, true, true);

Item.registerNameOverrideFunction(ItemID.electricWrench, ENERGY_ITEM_NAME);

Recipes.addShaped({id: ItemID.wrench, count: 1, data: 0}, [
	"a a",
	"aaa",
	" a "
], ['a', ItemID.ingotBronze, 0]);

Recipes.addShapeless({id: ItemID.electricWrench, count: 1, data: Item.getMaxDamage(ItemID.electricWrench)}, [{id: ItemID.wrench, data: 0}, {id: ItemID.powerUnitSmall, data: 0}]);


Callback.addCallback("DestroyBlockStart", function(coords, block){
	if(MachineRegistry.machineIDs[block.id]){
		var item = Player.getCarriedItem();
		if(item.id==ItemID.wrench || item.id==ItemID.electricWrench && item.data + 500 <= Item.getMaxDamage(item.id)){
			Block.setTempDestroyTime(block.id, 0);
		}
	}
});




// file: items/tool/electric.js

IDRegistry.genItemID("electricHoe");
IDRegistry.genItemID("electricTreetap");
Item.createItem("electricHoe", "Electric Hoe", {name: "electric_hoe", meta: 0}, {stack: 1});
Item.createItem("electricTreetap", "Electric Treetap", {name: "electric_treetap", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.electricHoe, 10000, 0, true, true);
ChargeItemRegistry.registerItem(ItemID.electricTreetap, 10000, 0, true, true);
Item.setToolRender(ItemID.electricHoe, true);

Item.registerNameOverrideFunction(ItemID.electricHoe, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.electricTreetap, ENERGY_ITEM_NAME);

Recipes.addShaped({id: ItemID.electricHoe, count: 1, data: Item.getMaxDamage(ItemID.electricHoe)}, [
	"pp",
	" p",
	" x"
], ['x', ItemID.powerUnitSmall, 0, 'p', ItemID.plateIron, 0]);

Recipes.addShapeless({id: ItemID.electricTreetap, count: 1, data: Item.getMaxDamage(ItemID.electricTreetap)}, [{id: ItemID.powerUnitSmall, data: 0}, {id: ItemID.treetap, data: 0}]);


Item.registerUseFunction("electricHoe", function(coords, item, block){
	if(item.data + 50 <= Item.getMaxDamage(ItemID.electricHoe) && (block.id==2 || block.id==3 || block.id==110 || block.id==243) && coords.side==1){ 
		World.setBlock(coords.x, coords.y, coords.z, 60);
		World.playSoundAtEntity(Player.get(), "step.grass", 0.5, 0.75);
		Player.setCarriedItem(item.id, 1, item.data + 50);
	}
});
Item.registerUseFunction("electricTreetap", function(coords, item, block){
	if(item.data + 50 <= Item.getMaxDamage(ItemID.electricTreetap) && block.id == BlockID.rubberTreeLogLatex && block.data == coords.side - 2){
		World.setBlock(coords.x, coords.y, coords.z, BlockID.rubberTreeLog);
		Player.setCarriedItem(item.id, 1, item.data + 50);
		Entity.setVelocity(
			World.drop(
				coords.relative.x + 0.5,
				coords.relative.y + 0.5,
				coords.relative.z + 0.5,
				ItemID.latex, 1 + parseInt(Math.random() * 3), 0
			),
			(coords.relative.x - coords.x) * 0.25,
			(coords.relative.y - coords.y) * 0.25,
			(coords.relative.z - coords.z) * 0.25
		);
	}
});




// file: items/tool/drills.js

IDRegistry.genItemID("drill");
IDRegistry.genItemID("diamondDrill");
IDRegistry.genItemID("iridiumDrill");
Item.createItem("drill", "Mining Drill", {name: "drill", meta: 0}, {stack: 1});
Item.createItem("diamondDrill", "Diamond Drill", {name: "drill", meta: 1}, {stack: 1});
Item.createItem("iridiumDrill", "Iridium Drill", {name: "drill", meta: 2}, {stack: 1});
//Item.setGlint(ItemID.iridiumDrill, true);
ChargeItemRegistry.registerItem(ItemID.drill, 30000, 0, true, true);
ChargeItemRegistry.registerItem(ItemID.diamondDrill, 30000, 0, true, true);
ChargeItemRegistry.registerItem(ItemID.iridiumDrill, 1000000, 2, true, true);

Item.registerNameOverrideFunction(ItemID.drill, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.diamondDrill, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.iridiumDrill, function(item, name){
	var energyStorage = Item.getMaxDamage(item.id) - 1;
	var energyStored = Math.min(energyStorage - item.data + 1, energyStorage);
	if(energyStored==0){return "§b" + name;}
	name = "§b" + name + "\n§7" + energyStored + "/" + energyStorage + " Eu";
	switch(IDrillMode){
		case 0:
			name += "\nFortune III mode";
		break;
		case 1:
			name += "\nSilk Touch mode";
		break;
		case 2:
			name += "\nc3x3 Fortune III mode";
		break;
		case 3:
			name += "\n3x3 Silk Touch mode";
		break;
	}
	return name;
});

ToolType.drill = {
    damage: 0,
    blockTypes: ["stone", "dirt"],
    onDestroy: function(item){
        item.data = Math.min(item.data + this.toolMaterial.energyConsumption - 1, Item.getMaxDamage(item.id));
    },
    onBroke: function(item){return true;},
    onAttack: function(item, mob){
        item.data = Math.min(item.data + this.toolMaterial.energyConsumption - 2, Item.getMaxDamage(item.id));
    },
    calcDestroyTime: function(item, coords, block, params, destroyTime, enchant){
        if(item.data + this.toolMaterial.energyConsumption <= Item.getMaxDamage(item.id)){
            return destroyTime;
        }
        else{
            return params.base;
        }
    },
    useItem: function(coords, item, block){
    	var side = coords.side;
    	coords = coords.relative;
    	block = World.getBlockID(coords.x, coords.y, coords.z);
    	if(block==0){
	    	for(var i = 0; i < 36; i++){
				var slot = Player.getInventorySlot(i);
				if(slot.id==50){
					slot.count--;
					if(!slot.count) slot.id = 0;
					Player.setInventorySlot(i, slot.id, slot.count, 0);
					World.setBlock(coords.x, coords.y, coords.z, 50, (6 - side)%6);
					break;
				}
			}
	    }
   }
}

var IDrillMode = 0;
var dirtBlocksDrop = {13:318, 60:3, 110:3, 198:3, 243:3};
ToolAPI.setTool(ItemID.drill, {energyConsumption: 50, level: 3, efficiency: 8, damage: 3},  ToolType.drill);
ToolAPI.setTool(ItemID.diamondDrill, {energyConsumption: 80, level: 4, efficiency: 16, damage: 4}, ToolType.drill);
ToolAPI.setTool(ItemID.iridiumDrill, {energyConsumption: 800, level: 5, efficiency: 24, damage: 5}, {
    damage: 0,
    blockTypes: ["stone", "dirt"],
    
	modifyEnchant: function(enchant){
		if(IDrillMode%2){enchant.silk = 1;}
		else{enchant.fortune = 3;}
	},
	onDestroy: function(item){
        item.data = Math.min(item.data + this.toolMaterial.energyConsumption - 1, Item.getMaxDamage(item.id));
    },
    onBroke: function(item){return true;},
    onAttack: function(item, mob){
        item.data = Math.min(item.data + this.toolMaterial.energyConsumption - 2, Item.getMaxDamage(item.id));
    },
    calcDestroyTime: function(item, coords, block, params, destroyTime, enchant){
        if(item.data + 800 <= Item.getMaxDamage(item.id)){
			var material = ToolAPI.getBlockMaterial(block.id) || {};
			material = material.name;
			if(IDrillMode > 1 && (material == "dirt" || material == "stone")){
				destroyTime = 0;
				var side = coords.side;
				var X = 1;
				var Y = 1;
				var Z = 1;
				if(side==BlockSide.EAST || side==BlockSide.WEST){
				X = 0;}
				if(side==BlockSide.UP || side==BlockSide.DOWN){
				Y = 0;}
				if(side==BlockSide.NORTH || side==BlockSide.SOUTH){
				Z = 0;}
				for(var xx = coords.x - X; xx <= coords.x + X; xx++){
					for(var yy = coords.y - Y; yy <= coords.y + Y; yy++){
						for(var zz = coords.z - Z; zz <= coords.z + Z; zz++){
							var blockID = World.getBlockID(xx, yy, zz);
							var material = ToolAPI.getBlockMaterial(blockID) || {};
							if(material.name == "dirt" || material.name == "stone"){
								destroyTime += Block.getDestroyTime(blockID) / material.multiplier * 1.5;
							}
						}
					}
				}
				destroyTime /= 24;
			}
            return destroyTime;
        }
        else{
            return params.base;
        }
    },
    destroyBlock: function(coords, side, item, block){
        if(IDrillMode > 1 && item.data + 800 <= Item.getMaxDamage(item.id)){
            var X = 1;
            var Y = 1;
            var Z = 1;
            if(side==BlockSide.EAST || side==BlockSide.WEST){
            X = 0;}
            if(side==BlockSide.UP || side==BlockSide.DOWN){
            Y = 0;}
            if(side==BlockSide.NORTH || side==BlockSide.SOUTH){
            Z = 0;}
            for(var xx = coords.x - X; xx <= coords.x + X; xx++){
                for(var yy = coords.y - Y; yy <= coords.y + Y; yy++){
                    for(var zz = coords.z - Z; zz <= coords.z + Z; zz++){
                        blockID = World.getBlockID(xx, yy, zz);
                        var material = ToolAPI.getBlockMaterial(blockID) || {};
                        if(material.name == "dirt" || material.name == "stone"){
                            item.data += 800;
                            if(IDrillMode==3 || material == "stone"){
                                World.destroyBlock(xx, yy, zz, true);
                            }else{
                                drop = dirtBlocksDrop[blockID];
                                if(drop){
                                    World.destroyBlock(xx, yy, zz, false);
                                    World.drop(xx+0.5, yy+0.5, zz+0.5, drop, 1);
                                }
                                else{World.destroyBlock(xx, yy, zz, true);}
                            }
                        }
                        if(item.data + 800 >= Item.getMaxDamage(item.id)){
                            Player.setCarriedItem(item.id, 1, item.data, item.enchant);
                            return;
                        }
                    }
                }
            }
            Player.setCarriedItem(item.id, 1, item.data, item.enchant);
        }
    },
    useItem: function(coords, item, block){
        if(Entity.getSneaking(player)){
            IDrillMode = (IDrillMode+1)%4;
            switch(IDrillMode){
            case 0:
                //var enchant = {type: Enchantment.FORTUNE, level: 3};
                Game.message("§eFortune III mode");
            break;
            case 1:
                //var enchant = {type: Enchantment.SILK_TOUCH, level: 1};
                Game.message("§9Silk Touch mode");
            break;
            case 2:
                //var enchant = {type: Enchantment.FORTUNE, level: 3};
                Game.message("§c3x3 Fortune III mode");
            break;
            case 3:
                //var enchant = {type: Enchantment.SILK_TOUCH, level: 1};
                Game.message("§23x3 Silk Touch mode");
            break;
            }
            //Player.setCarriedItem(item.id, 1, item.data, enchant);
            Player.setCarriedItem(item.id, 1, item.data);
        }
        else{
        	var side  = coords.side;
    		coords = coords.relative;
    		block = World.getBlockID(coords.x, coords.y, coords.z);
    		if(block==0){
	    		for(var i = 0; i < 36; i++){
					var slot = Player.getInventorySlot(i);
					if(slot.id==50){
						slot.count--;
						if(!slot.count) slot.id = 0;
						Player.setInventorySlot(i, slot.id, slot.count, 0);
						World.setBlock(coords.x, coords.y, coords.z, 50, (6 - side)%6);
						break;
					}
				}
	    	}
		}
    }
});


Recipes.addShaped({id: ItemID.drill, count: 1, data: Item.getMaxDamage(ItemID.drill)}, [
    " p ",
    "ppp",
    "pxp"
], ['x', ItemID.powerUnit, 0, 'p', ItemID.plateIron, 0]);

Recipes.addShaped({id: ItemID.diamondDrill, count: 1, data: Item.getMaxDamage(ItemID.diamondDrill)}, [
    " a ",
    "ada"
], ['d', ItemID.drill, -1, 'a', 264, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.iridiumDrill, count: 1, data: Item.getMaxDamage(ItemID.iridiumDrill)}, [
    " a ",
    "ada",
    " e "
], ['d', ItemID.diamondDrill, -1, 'e', ItemID.storageCrystal, -1, 'a', ItemID.plateReinforcedIridium, 0], RECIPE_FUNC_TRANSPORT_ENERGY);




// file: items/tool/chainsaw.js

IDRegistry.genItemID("chainsaw");
Item.createItem("chainsaw", "Chainsaw", {name: "chainsaw", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.chainsaw, 30000, 0, true, true);

Item.registerNameOverrideFunction(ItemID.chainsaw, ENERGY_ITEM_NAME);

Recipes.addShaped({id: ItemID.chainsaw, count: 1, data: Item.getMaxDamage(ItemID.chainsaw)}, [
	" pp",
	"ppp",
	"xp "
], ['x', ItemID.powerUnit, 0, 'p', ItemID.plateIron, 0]);

ToolAPI.addBlockMaterial("wool", 1.5);
ToolAPI.registerBlockMaterial(35, "wool");

ToolType.chainsaw = {
	isWeapon: true,
	damage: 3,
	baseDamage: 0,
	blockTypes: ["wood", "wool", "fibre", "plant"],
	onDestroy: function(item){
        item.data = Math.min(item.data + this.toolMaterial.energyConsumption - 1, Item.getMaxDamage(item.id));
    },
    onBroke: function(item){return true;},
	onAttack: function(item, mob){
		var material = this.toolMaterial;
		if(!this.baseDamage) this.baseDamage = material.damage;
		if(item.data + material.energyConsumption <= Item.getMaxDamage(item.id)){
			item.data += material.energyConsumption - 1;
			material.damage = this.baseDamage;
		}
		else{
			material.damage = 0;
		}
	},
	calcDestroyTime: function(item, coords, block, params, destroyTime, enchant){
        if(item.data + this.toolMaterial.energyConsumption <= Item.getMaxDamage(item.id)){
            return destroyTime;
        }
        else{
            return params.base;
        }
    }
}

ToolAPI.setTool(ItemID.chainsaw, {energyConsumption: 50, level: 3, efficiency: 16, damage: 6},  ToolType.chainsaw);




// file: items/tool/nano_saber.js

IDRegistry.genItemID("nanoSaber");
Item.createItem("nanoSaber", "Nano Saber", {name: "nano_saber", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.nanoSaber, 1000000, 2, true, true);
Item.setToolRender(ItemID.nanoSaber, true);

Item.registerNameOverrideFunction(ItemID.nanoSaber, ENERGY_ITEM_NAME);

var NANO_SABER_DURABILITY = 1000001;

Recipes.addShaped({id: ItemID.nanoSaber, count: 1, data: NANO_SABER_DURABILITY}, [
	"ca ",
	"ca ",
	"bxb"
], ['x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, 'b', ItemID.carbonPlate, 0, "c", 348, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

ToolAPI.registerSword(ItemID.nanoSaber, {level: 0, durability: NANO_SABER_DURABILITY, damage: 4}, {
	damage: 0,
	onBroke: function(item){
		item.data = Math.min(item.data, NANO_SABER_DURABILITY);
		return true;
	},
	onAttack: function(item, mob){
		this.damage = item.data < NANO_SABER_DURABILITY ? 16 : 0;
		return false;
	}
});

Callback.addCallback("tick", function(){
	if(World.getThreadTime() % 20 == 0){
		var item = Player.getCarriedItem()
		if(item.id == ItemID.nanoSaber){
			item.data = Math.min(item.data+1280, NANO_SABER_DURABILITY);
			Player.setCarriedItem(item.id, 1, item.data);
		}
	}
});




// file: items/tool/mining_laser.js

IDRegistry.genItemID("miningLaser");
Item.createItem("miningLaser", "Mining Laser", {name: "mining_laser", meta: 0});
ChargeItemRegistry.registerItem(ItemID.miningLaser, 1000000, 2, true, true);
Item.setToolRender(ItemID.miningLaser, true);

Item.registerNameOverrideFunction(ItemID.miningLaser, ENERGY_ITEM_NAME);

Recipes.addShaped({id: ItemID.miningLaser, count: 1, data: Item.getMaxDamage(ItemID.miningLaser)}, [
	"ccx",
	"aa#",
	" aa"
], ['#', ItemID.circuitAdvanced, 0, 'x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, "c", 331, 0], RECIPE_FUNC_TRANSPORT_ENERGY);




// file: core/api/shared.js

ModAPI.registerAPI("ICore", {
	Machine: MachineRegistry,
	Render: MachineRenderer,
	Recipe: MachineRecipeRegistry,
	ChargeRegistry: ChargeItemRegistry,
	Upgrade: UpgradeAPI,
	UI: UIbuttons,
	Ore: OreGenerator,
	
	requireGlobal: function(command){
		return eval(command);
	}
});

Logger.Log("Industrial Core API shared with name ICore.", "API");




