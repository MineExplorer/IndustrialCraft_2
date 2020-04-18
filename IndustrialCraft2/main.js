/*
BUILD INFO:
  dir: dev
  target: main.js
  files: 143
*/



// file: header.js

/*
  ___               _                 _            _           _      ____                    __   _   
 |_ _║  _ __     __| ║  _   _   ___  | ║_   _ __  |_║   __ _  | ║    / ___║  _ __    __ _   _/ _║ | ║_ 
  | ║  | '_ \   / _` ║ | ║ | ║ / __║ | __║ | '__║ ,─╗  / _` ║ | ║   | ║     | '__║  / _` ║ [  _]  | __║
  | ║  | ║ | ║ | (_| ║ | ║_| ║ \__ \ | ║_  | ║    | ║ | (_║ ║ | ║   | ║___  | ║    | (_| ║  | ║   | ║_ 
 |___║ |_║ |_║  \__,_║  \__,_║ |___/  \__║ |_║    |_║  \__,_║ |_║    \____║ |_║     \__,_║  |_║    \__║
 
 by MineExplorer (vk.com/vlad.gr2027) and NikolaySavenko (vk.com/savenkons)
 based on Industrial Core by zheka_smirnov (vk.com/zheka_smirnov)

 This code is a copyright, do not distribute.
*/

// libraries
IMPORT("flags");
IMPORT("Vector");
IMPORT("ToolLib");
IMPORT("EnergyNet");
IMPORT("ChargeItem");
IMPORT("TileRender");
IMPORT("StorageInterface");
IMPORT("LiquidLib");
IMPORT("BackpackAPI");

// constants
const GUI_SCALE = 3.2;
const fallVelocity = -0.0784;

// import functions
var nativeDropItem = ModAPI.requireGlobal("Level.dropItem");
var Color = android.graphics.Color;

// energy (Eu)
var EU = EnergyTypeRegistry.assureEnergyType("Eu", 1);

// API
function random(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

// vanilla items
Recipes.addFurnaceFuel(325, 10, 2000); // lava bucket
ChargeItemRegistry.registerFlashItem(331, "Eu", 800, 0); // redstone

// debug
var lasttime = -1
var frame = 0

Callback.addCallback("tick", function(){
	if(Config.debugMode){
		var t = Debug.sysTime();
		if(frame++ % 20 == 0){
			if(lasttime != -1){
				tps = 1000 / (t - lasttime) * 20
				Game.tipMessage(Math.round(tps * 10) / 10 + "tps")
			}
			lasttime = t
		}
	}
});




// file: translation.js

// BLOCKS
Translation.addTranslation("Rubber Tree Log", {ru: "Древесина гевеи", es: "Madera de Árbol de Caucho", pt: "Madeira de Seringueira", zh: "橡胶树原木"});
Translation.addTranslation("Rubber Tree Leaves", {ru: "Листва гевеи", es: "Hojas de Arbol de Cáucho", pt: "Folhas de Seringueira", zh: "橡胶树树叶"});
Translation.addTranslation("Rubber Tree Sapling", {ru: "Саженец гевеи", es: "Pimpollo de Árbol de Caucho", pt: "Muda de Seringueira", zh: "橡胶树树苗"});
Translation.addTranslation("Copper Ore", {ru: "Медная руда", es: "Mineral de Cobre", pt: "Minério de Cobre", zh: "铜矿石"});
Translation.addTranslation("Tin Ore", {ru: "Оловянная руда", es: "Mineral de Estaño", pt: "Minério de Estanho", zh: "锡矿石"});
Translation.addTranslation("Lead Ore", {ru: "Свинцовая руда", es: "Mineral de Plomo", pt: "Minério de Chumbo", zh: "铅矿石"});
Translation.addTranslation("Uranium Ore", {ru: "Урановая руда", es: "Mineral de Uranium", pt: "Minério de Urânio", zh: "铀矿石"});
Translation.addTranslation("Iridium Ore", {ru: "Иридиевая руда",  es: "Mineral de Iridio", pt: "Minério de Irídio", zh: "铱矿石"});
Translation.addTranslation("Copper Block", {ru: "Медный блок", es: "Bloque de Cobre", pt: "Bloco de Cobre", zh: "铜块"});
Translation.addTranslation("Tin Block", {ru: "Оловянный блок", es: "Bloque de Estaño", pt: "Bloco de Estanho", zh: "锡块"});
Translation.addTranslation("Bronze Block", {ru: "Бронзовый блок", es: "Bloque de Bronce", pt: "Bloco de Bronze", zh: "青铜块"});
Translation.addTranslation("Lead Block", {ru: "Свинцовый блок", es: "Bloque de Plomo", pt: "Bloco de Chumbo", zh: "铅块"});
Translation.addTranslation("Steel Block", {ru: "Стальной блок", es: "Bloque de Hierro Refinado", pt: "Bloco de Aço", zh: "钢块"});
Translation.addTranslation("Silver Block", {ru: "Серебряный блок", es: "Bloque de Plata", pt: "Bloco de Prata", zh: "银块"});
Translation.addTranslation("Uranium Block", {ru: "Урановый блок", es: "Bloque de Uranio", pt: "Bloco de Urânio", zh: "铀块"});

Translation.addTranslation("Mining Pipe", {ru: "Буровая труба", es: "Tubo Minero", pt: "Tubo de Mineração", zh: "采矿管道"});
Translation.addTranslation("Reinforced Stone", {ru: "Укреплённый камень", es: "Piedra Reforzada", pt: "Pedra Reforçada", zh: "防爆石"});
Translation.addTranslation("Reinforced Glass", {ru: "Укреплённое стекло", es: "Cristal Reforzado", pt: "Vidro Reforçado", zh: "防爆玻璃"});
Translation.addTranslation("Machine Block", {ru: "Машинный блок", es: "Máquina", pt: "Estrutura de Máquina Básica", zh: "基础机械外壳"});
Translation.addTranslation("Advanced Machine Block", {ru: "Улучшенный машинный блок", es: "Máquina Avanzada", pt: "Estrutura de Máquina Avançada", zh: "高级机械外壳"});

// Generators
Translation.addTranslation("Generator", {ru: "Генератор", es: "Generador", pt: "Gerador", zh: "火力发电机"});
Translation.addTranslation("Geothermal Generator", {ru: "Геотермальный генератор", es: "Generador Geotérmico", pt: "Gerador Geotérmico", zh: "地热发电机"});
Translation.addTranslation("Solar Panel", {ru: "Солнечная панель", es: "Panel Solar", pt: "Painel Solar", zh: "太阳能发电机"});
Translation.addTranslation("Water Mill", {ru: "Гидрогенератор", es: "Molino de Agua", pt: "Gerador Aquático", zh: "水力发电机"});
Translation.addTranslation("Wind Mill", {ru: "Ветрогенератор", es: "Molino de Viento", pt: "Cata-vento", zh: "风力发电机"});
Translation.addTranslation("Radioisotope Thermoelectric Generator", {ru: "Радиоизотопный термоэлектрический генератор", es: "Generador Radioisotopos Termoeléctrico", pt: "Gerador Termoelétrico de Radioisótopos", zh: "放射性同位素温差发电机"});
Translation.addTranslation("Semifluid Generator", {ru: "Полужидкостный генератор", es: "Generador a Semifluidos", pt: "Gerador à Semi-Fluidos", zh: "半流质发电机"});
Translation.addTranslation("Stirling Generator", {ru: "Генератор Стирлинга", es: "Generador Stirling", pt: "Gerador à Calor", zh: "斯特林发电机"});

Translation.addTranslation("Nuclear Reactor", {ru: "Ядерный реактор", es: "Reactor Nuclear", pt: "Reator Nuclear", zh: "核反应堆"});
Translation.addTranslation("Reactor Chamber", {ru: "Реакторная камера", es: "Cámara del Reactor", pt: "Câmara de Reator", zh: "核反应仓"});

// Heat Generators
Translation.addTranslation("Liquid Fuel Firebox", {ru: "Жидкостный теплогенератор", es: "Generador de Calor Líquido", pt: "Aquecedor à Combustível Líquido", zh: "流体加热机"});
Translation.addTranslation("Solid Fuel Firebox", {ru: "Твердотопливный теплогенератор", es: "Generador de calor sólido", pt: "Aquecedor à Combustível Sólido", zh: "固体加热机"});
Translation.addTranslation("Electric Heater", {ru: "Электрический теплогенератор", es: "Generador Eléctrico De Calor", pt: "Aquecedor Elétrico", zh: "电力加热机"});

// Energy storage
Translation.addTranslation("BatBox", {ru: "Энергохранилище", es: "Caja de Baterías", pt: "Caixa de Baterias (CB)", zh: "储电箱"});
Translation.addTranslation("CESU", {ru: "МЭСН", es: "Unidad CESU", pt: "Unidade de Armazenamento de Energia (UAE)", zh: "CESU储电箱"});
Translation.addTranslation("MFE", {ru: "МФЭ", es: "Unidad MFE", pt: "Transmissor de Energia Multi-funcional (TEMF)", zh: "MFE储电箱"});
Translation.addTranslation("MFSU", {ru: "МФСУ", es: "Unidad MFSU", pt: "Unidade de Armazenamento Multi-funcional (UAMF)", zh: "MFSU储电箱"});

// Transformer
Translation.addTranslation("LV Transformer", {ru: "Трансформатор НН", pt: "Transformador de Baixa Voltagem", zh: "低压变压器"});
Translation.addTranslation("MV Transformer", {ru: "Трансформатор СН", pt: "Transformador de Média Voltagem", zh: "中压变压器"});
Translation.addTranslation("HV Transformer", {ru: "Трансформатор ВН", pt: "Transformador de Alta Voltagem", zh: "高压变压器"});
Translation.addTranslation("EV Transformer", {ru: "Трансформатор СВН", pt: "Transformador de Voltagem Extrema", zh: "超高压变压器"});

// Machines
Translation.addTranslation("Luminator", {ru: "Электролампа", es: "Lámpara", pt: "Iluminador", zh: "日光灯"});
Translation.addTranslation("Iron Furnace", {ru: "Железная печь", es: "Horno de Hierro", pt: "Fornalha de Ferro", zh: "铁炉"});
Translation.addTranslation("Electric Furnace", {ru: "Электрическая печь", es: "Horno Eléctrico", pt: "Fornalha Elétrica", zh: "电炉"});
Translation.addTranslation("Induction Furnace", {ru: "Индукционная печь", es: "Horno de Induccion", pt: "Fornalha de Indução", zh: "感应炉"});
Translation.addTranslation("Macerator", {ru: "Дробитель", es: "Trituradora", pt: "Macerador", zh: "打粉机"});
Translation.addTranslation("Compressor", {ru: "Компрессор", es: "Compresor", pt: "Compactador", zh: "压缩机"});
Translation.addTranslation("Extractor", {ru: "Экстрактор", es: "Extractor", pt: "Extrator", zh: "提取机"});
Translation.addTranslation("Recycler", {ru: "Утилизатор", es: "Reciclador", pt: "Recicladora", zh: "回收机"});
Translation.addTranslation("Metal Former", {ru: "Металлоформовщик", es: "Arqueador de Metal", pt: "Moldelador de Metais", zh: "金属成型机"});
Translation.addTranslation("Ore Washing Plant", {ru: "Рудопромывочная машина", es: "Planta de Lavado de Minerales", pt: "Estação de Lavagem de Minérios", zh: "洗矿机"});
Translation.addTranslation("Thermal Centrifuge", {ru: "Термальная центрифуга", es: "Centrífuga Térmica", pt: "Centrífuga Térmica", zh: "热能离心机"});
Translation.addTranslation("Blast Furnace", {ru: "Доменная печь", es: "Alto Horno", pt: "Fornalha de Aquecimento", zh: "高炉"});
Translation.addTranslation("Miner", {ru: "Буровая установка", es: "Perforadora", pt: "Minerador", zh: "采矿机"});
Translation.addTranslation("Advanced Miner", {ru: "Продвинутая буровая установка", es: "Minero Avanzado", pt: "Minerador Avançado", zh: "高级采矿机"});
Translation.addTranslation("Tesla Coil", {ru: "Катушка теслы", es: "Bobina de Tesla", pt: "Bobina Tesla", zh: "特斯拉线圈"});
Translation.addTranslation("Teleporter", {ru: "Телепортер", es: "Teletransportador", pt: "Teletransportador", zh: "传送机"});
Translation.addTranslation("Mass Fabricator", {ru: "Производитель материи", es: "Materializador", pt: "Fabricador de Massa", zh: "物质生成机"});
Translation.addTranslation("Fermenter", {ru: "Ферментер", es: "Fermentadora", pt: "Fermentador", zh: "发酵机"});
Translation.addTranslation("Solid Canning Machine", {ru: "Консервирующий механизм", es: "Máquina de Enlatado", pt: "Enlatadora de Sólidos", zh: "固体装罐机"});
Translation.addTranslation("Fluid/Solid Canning Machine", {ru: "Универсальный наполняющий механизм", es: "Enlatadora de Líquidos/Sólidos", pt: "Enlatadora de Fluidos/Sólidos", zh: "流体/固体装罐机"});
Translation.addTranslation("Crop Matron", {ru: "Автосадовник", es: "Máquina Cosechadora", pt: "Fazendeiro", zh: "作物监管机"});
Translation.addTranslation("Crop Harvester", {ru: "Сборщик урожая", es: "Cocechador de Cultivo", pt: "Colheitadeira", zh: "作物收割机"});

// Explosive
Translation.addTranslation("Nuke", {ru: "Ядерная бомба", pt: "Bomba Nuke", zh: "核弹"});

// Fluid
Translation.addTranslation("Pump", {ru: "Помпа", es: "Bomba Extractora", pt: "Bomba", zh: "泵"});
Translation.addTranslation("Fluid Distributor", {ru: "Жидкостный распределитель", es: "Distribuidor de Líquido", pt: "Distribuidor de Fluidos", zh: "流体分配机"});
Translation.addTranslation("Tank", {ru: "Бак", es: "Tanque", pt: "Tanque", zh: "流体储存器"});

// ITEMS
Translation.addTranslation("Iridium", {ru: "Иридий", es: "Mineral de Iridio", pt: "Minério de Irídio", zh: "铱碎片"});
Translation.addTranslation("Latex", {ru: "Латекс", es: "Caucho", pt: "Resina Pegajosa", zh: "粘性树脂"});
Translation.addTranslation("Rubber", {ru: "Резина", es: "Rubber", pt: "Borracha", zh: "橡胶"});
Translation.addTranslation("Ashes", {ru: "Пепел", es: "Ceniza", pt: "Cinzas", zh: "灰烬"});
Translation.addTranslation("Slag", {ru: "Шлак", es: "Escoria", pt: "Sucata", zh: "渣渣"});
Translation.addTranslation("Bio Chaff", {ru: "Отходы", pt: "Bio-Produto", zh: "糠"});
Translation.addTranslation("Scrap", {ru: "Утильсырьё", es: "Chatarra", pt: "Sucata", zh: "废料"});
Translation.addTranslation("Scrap Box", {ru: "Коробка утильсырья", es: "Caja de Chatarra", pt: "Caixa de Sucata", zh: "废料盒"});
Translation.addTranslation("UU-Matter", {ru: "Материя", es: "Materia", pt: "Metéria UU", zh: "UU物质"});
Translation.addTranslation("Heat Conductor", {ru: "Теплопроводник ", es: "Conductor de calor", pt: "Condutor de Calor", zh: "热传导器"});
Translation.addTranslation("Coal Ball", {ru: "Угольный шарик", es: "Bola de Carbón", pt: "Bola de Carvão", zh: "煤球"});
Translation.addTranslation("Coal Block", {ru: "Сжатый угольный шарик", es: "Bola de Carbón Compactada", pt: "Bola de Carvão Comprimido", zh: "压缩煤球"});
Translation.addTranslation("Coal Chunk", {ru: "Угольная глыба", es: "Carbono Bruto", zh: "煤块", pt: "Pedaço de Carvão"});
Translation.addTranslation("Carbon Fibre", {ru: "Углеволокно", es: "Fibra de Carbono Básica", pt: "Fibra de Carbono Bruto", zh: "粗制碳网"});
Translation.addTranslation("Carbon Mesh", {ru: "Углеткань", es: "Malla de Carbono Básica", pt: "Malha de Carbono", zh: "粗制碳板"});
Translation.addTranslation("Carbon Plate", {ru: "Углепластик", es: "Placa de Carbono", pt: "Placa de Carbono", zh: "碳板"});
Translation.addTranslation("Alloy Plate", {ru: "Композит", es: "Compuesto Avanzado", pt: "Liga Avançada", zh: "高级合金"});
Translation.addTranslation("Iridium Reinforced Plate", {ru: "Иридиевый композит", es: "Placa de Iridio", pt: "Placa Reforçada com Irídio", zh: "强化铱板"});

// Nuclear
Translation.addTranslation("Enriched Uranium", {ru: "Обогащённый уран", es: "Uranio Enriquecido", pt: "Urânio Enriquecido", zh: "浓缩铀核燃料"});
Translation.addTranslation("Uranium 235", {ru: "Уран-235", es: "Uranio 235", pt: "Urânio 235", zh: "铀-235"});
Translation.addTranslation("Piece of Uranium 235", {ru: "Кусочек урана-235", es: "Diminuta Pila de Uranio 235", pt: "Pequena Pilha de Urânio 235", zh: "小撮铀-235"});
Translation.addTranslation("Uranium 238", {ru: "Уран-238", es: "Uranio 238", pt: "Urânio 238", zh: "铀-238"});
Translation.addTranslation("Piece of Uranium 238", {ru: "Кусочек урана-238", es: "Diminuta Pila de Uranio 238", pt: "Pequena Pilha de Urânio 238", zh: "小撮铀-238"});
Translation.addTranslation("Plutonium", {ru: "Плутоний", es: "Plutonio", pt: "Plutônio", zh: "钚"});
Translation.addTranslation("Piece of Plutonium", {ru: "Кусочек плутония", es: "Diminuta Pila de Plutonio", pt: "Pequena Pilha de Plutônio", zh: "小撮钚"});
Translation.addTranslation("MOX Nuclear Fuel", {ru: "Ядерное топливо MOX", es: "MOX Combustible Nuclear", pt: "Combustível Nuclear de MOX", zh: "钚铀混合氧化物核燃料(MOX)"});
Translation.addTranslation("Pellets of RTG Fuel", {ru: "Пеллета РИТЭГ-топлива", es: "Perdigones de Combustible RTG", pt: "Pastilhas de Combustível de GTR", zh: "放射性同位素燃料靶丸"});

// Reactor Stuff - Radioactive Items
Translation.addTranslation("Fuel Rod (Empty)", {ru: "Топливный стержень (Пустой)", es: "Vara Combustible (Vacía)", pt: "Haste de Combustível (Vazia)", zh: "燃料棒(空)"});
Translation.addTranslation("Fuel Rod (Uranium)", {ru: "Топливный стержень (Уран)", es: "Vara Combustible (Uranio)", pt: "Haste de Combustível (Urânio)", zh: "燃料棒(铀)"});
Translation.addTranslation("Dual Fuel Rod (Uranium)", {ru: "Спаренный топливный стержень (Уран)", es: "Vara Combustible Doble (Uranio)", pt: "Haste de Combustível Dupla (Urânio)", zh: "双联燃料棒(铀)"});
Translation.addTranslation("Quad Fuel Rod (Uranium)", {ru: "Счетверённый топливный стержень (Уран)", es: "Vara Combustible Cuádruple (Uranio)", pt: "Haste de Combustível Quádrupla (Urânio)", zh: "四联燃料棒(铀)"});
Translation.addTranslation("Fuel Rod (MOX)", {ru: "Топливный стержень (MOX)", es: "Vara Combustible (MOX)", pt: "Haste de Combustível (MOX)", zh: "燃料棒(MOX)"});
Translation.addTranslation("Dual Fuel Rod (MOX)", {ru: "Спаренный топливный стержень (MOX)", es: "Vara Combustible Doble (MOX)", pt: "Haste de Combustível Dupla (MOX)", zh: "双联燃料棒(MOX)"});
Translation.addTranslation("Quad Fuel Rod (MOX)", {ru: "Счетверённый топливный стержень (MOX)", es: "Vara Combustible Cuádruple (MOX)", pt: "Haste de Combustível Quádrupla (MOX)", zh: "四联燃料棒(MOX)"});
Translation.addTranslation("Fuel Rod (Depleted Uranium)", {ru: "Топливный стержень (Обеднённый Уран)", es: "Vara Combustible (Uranio Empobrecido)", pt: "Haste de Combustível (Urânio Esgotado)", zh: "燃料棒(枯竭铀)"});
Translation.addTranslation("Dual Fuel Rod (Depleted Uranium)", {ru: "Спаренный топливный стержень (Обеднённый Уран)", es: "Vara Combustible Doble (Uranio Empobrecido)", pt: "Haste de Combustível Dupla (Urânio Esgotado)", zh: "双联燃料棒(枯竭铀)"});
Translation.addTranslation("Quad Fuel Rod (Depleted Uranium)", {ru: "Счетверённый топливный стержень (Обеднённый Уран)", es: "Vara Combustible Cuádruple (Uranio Empobrecido)", pt: "Haste de Combustível Quádrupla (Urânio Esgotado)", zh: "四联燃料棒(枯竭铀)"});
Translation.addTranslation("Fuel Rod (Depleted MOX)", {ru: "Топливный стержень (Обеднённый MOX)", es: "Vara Combustible (MOX Empobrecido)", pt: "Haste de Combustível (MOX Esgotado)", zh: "燃料棒(枯竭MOX)"});
Translation.addTranslation("Dual Fuel Rod (Depleted MOX)", {ru: "Спаренный топливный стержень (Обеднённый MOX)", es: "Vara Combustible Doble (MOX Empobrecido)", pt: "Haste de Combustível Dupla (MOX Esgotado)", zh: "双联燃料棒(枯竭MOX)"});
Translation.addTranslation("Quad Fuel Rod (Depleted MOX)", {ru: "Счетверённый топливный стержень (Обеднённый MOX)", es: "Vara Combustible Cuádruple (MOX Empobrecido)", pt: "Haste de Combustível Quádrupla (MOX Esgotado)", zh: "四联燃料棒(枯竭MOX)"});

// Reactor Stuff - Cooling/Heat Management
Translation.addTranslation("Reactor Plating", {ru: "Обшивка реактора", es: "Revestimiento para Reactor", pt: "Placa de Reator", zh: "反应堆隔板"});
Translation.addTranslation("Containment Reactor Plating", {ru: "Сдерживающая реакторная обшивка", es: "Revestimiento de Reactor con Capacidad de Calor", pt: "Placa de Contenção de Reator", zh: "高热容反应堆隔板"});
Translation.addTranslation("Heat-Capacity Reactor Plating", {ru: "Теплоёмкая реакторная обшивка", es: "Revestimiento de Contención para Reactor", pt: "Placa de Reator com Capacidade de Calor", zh: "密封反应堆隔热板"});
Translation.addTranslation("Neutron Reflector", {ru: "Отражатель нейтронов", es: "Reflector de Neutrones", pt: "Refletor de Neutrons", zh: "中子反射板"});
Translation.addTranslation("Thick Neutron Reflector", {ru: "Утолщённый отражатель нейтронов", es: "Reflector de Neutrones Grueso", pt: "Refletor de Neutrons Grosso", zh: "加厚中子反射板"});
Translation.addTranslation("Iridium Neutron Reflector", {ru: "Иридиевый отражатель нейтронов", es: "Reflector de Neutrones de Iridio", pt: "Refletor de Neutrons de Irídio", zh: "铱中子反射板"});
Translation.addTranslation("10k Coolant Cell", {ru: "Охлаждающая капсула 10к", es: "Celda Refrigerante 10k", pt: "Célula Refrigerante de 10k", zh: "10k冷却单元"});
Translation.addTranslation("30k Coolant Cell", {ru: "Охлаждающая капсула 30к", es: "Celda Refrigerante 30k", pt: "Célula Refrigerante de 30k", zh: "30k冷却单元"});
Translation.addTranslation("60k Coolant Cell", {ru: "Охлаждающая капсула 60к", es: "Celda Refrigerante 60k", pt: "Célula Refrigerante de 60k", zh: "60k冷却单元"});
Translation.addTranslation("Heat Exchanger", {ru: "Теплообменник", es: "Intercambiador de Calor", pt: "Trocador de Calor", zh: "热交换器"});
Translation.addTranslation("Advanced Heat Exchanger", {ru: "Улучшенный теплообменник", es: "Intercambiador de Calor para Reactor", pt: "Trocador de Calor Avançado", zh: "高级热交换器"});
Translation.addTranslation("Component Heat Exchanger", {ru: "Компонентный теплообменник", es: "Intercambiador de Calor para Componentes", pt: "Trocador de Calor Componente", zh: "元件热交换器"});
Translation.addTranslation("Reactor Heat Exchanger", {ru: "Реакторный теплообменник", es: "Intercambiador de Calor para Reactor", pt: "Trocador de Calor do Reator", zh: "反应堆热交换器"});
Translation.addTranslation("Heat Vent", {ru: "Теплоотвод", es: "Ventilación de Calor", pt: "Ventilação de Calor", zh: "散热片"});
Translation.addTranslation("Advanced Heat Vent", {ru: "Улучшенный теплоотвод", es: "Ventilación de Calor Avanzada", pt: "Ventilação de Calor Avançada", zh: "高级散热片"});
Translation.addTranslation("Component Heat Vent", {ru: "Компонентный теплоотвод", es: "Componente para Ventilación de Calor", pt: "Ventilação de Calor Componente", zh: "元件散热片"});
Translation.addTranslation("Reactor Heat Vent", {ru: "Реакторный теплоотвод", es: "Ventilación de Calor para Reactor", pt: "Ventilação de Calor para Reator", zh: "反应堆散热片"});
Translation.addTranslation("Overclocked Heat Vent", {ru: "Разогнанный теплоотвод", es: "Ventilación de Calor con Sobreproducción", pt: "Ventilação de Calor com Overclock", zh: "超频散热片"});
Translation.addTranslation("RSH-Condensator", {ru: "Красный конденсатор", es: "RSH-Condensador", pt: "Condensador de Calor de Redstone (CCR)", zh: "红石冷凝模块"});
Translation.addTranslation("LZH-Condensator", {ru: "Лазуритовый конденсатор", es: "LZH-Condensador", pt: "Condensador de Calor de Lápis-Lazúli (CCL)", zh: "青金石冷凝模块"});

// Electric Components
Translation.addTranslation("Electronic Circuit", {ru: "Электросхема", es: "Circuito Electrónico", pt: "Circuito Eletrônico", zh: "电路板"});
Translation.addTranslation("Advanced Circuit", {ru: "Улучшенная электросхема", es: "Circuito Avanzado", pt: "Circuito Avançado", zh: "高级电路板"});
Translation.addTranslation("Coil", {ru: "Катушка", es: "Bobina", pt: "Bobina", zh: "线圈"});
Translation.addTranslation("Electric Motor", {ru: "Электромотор", es: "Motor Eléctrico", pt: "Motor Elétrico", zh: "电动马达"});
Translation.addTranslation("Power Unit", {ru: "Силовой агрегат", es: "Unidad de Potencia", pt: "Motor", zh: "驱动把手"});
Translation.addTranslation("Small Power Unit", {ru: "Малый силовой агрегат", es: "Pequeña Unidad de Potencia", pt: "Motor Pequeno", zh: "小型驱动把手"});

// Energy Storage
Translation.addTranslation("RE-Battery", {ru: "Аккумулятор", es: "Batería Recargable", pt: "Bateria Reutilizável", zh: "充电电池"});
Translation.addTranslation("Advanced RE-Battery", {ru: "Продвинутый аккумулятор", es: "Bateria-RE Avanzada", pt: "Bateria Reutilizável Avançada", zh: "高级充电电池"});
Translation.addTranslation("Energy Crystal", {ru: "Энергетический кристалл", es: "Cristal de Energía", pt: "Cristal de Energia", zh: "能量水晶"});
Translation.addTranslation("Lapotron Crystal", {ru: "Лазуротроновый кристалл", es: "Cristal Lapotron", pt: "Cristal Lapotrônico", zh: "兰波顿水晶"});
Translation.addTranslation("Charging RE-Battery", {ru: "Заряжающий аккумулятор", es: "Batería Cargadora", pt: "Bateria Reutilizável Carregadora", zh: "RE充电电池"});
Translation.addTranslation("Advanced Charging Battery", {ru: "Продвинутый заряжающий аккумулятор", es: "Bateria Cargadora Avanzada", pt: "Bateria Carregadora Avançada", zh: "高级充电电池"});
Translation.addTranslation("Charging Energy Crystal", {ru: "Заряжающий энергетический кристалл", es: "Cargador de Cristales de Energía", pt: "Carregador de Cristais de Energia", zh: "能量水晶充电电池"});
Translation.addTranslation("Charging Lapotron Crystal", {ru: "Заряжающий лазуротроновый кристалл", es: "Cargador de Cristales Lapotron", pt: "Carregador de Cristais Lapotrônicos", zh: "兰波顿充电电池"});

// Upgrades
Translation.addTranslation("MFSU Upgrade Kit", {ru: "Набор улучшения МФСУ", es: "Kit de Actualización MFSU", pt: "Kit de Melhoria UAMF", zh: "MFSU升级组件"});
Translation.addTranslation("Overclocker Upgrade", {ru: "Улучшение «Ускоритель»", es: "Mejora de Sobreproducción", pt: "Melhoria: Overclock", zh: "超频升级"});
Translation.addTranslation("Transformer Upgrade", {ru: "Улучшение «Трансформатор»", es: "Mejora de Transformador", pt: " Melhoria: Transformador Interno", zh: "高压升级"});
Translation.addTranslation("Energy Storage Upgrade", {ru: "Улучшение «Энергохранитель»", es: "Mejora de Almacenador de Energía", pt: "Melhoria: Armazenamento de Energia", zh: "储能升级"});
Translation.addTranslation("Redstone Signal Inverter Upgrade", {ru: "Улучшение «Инвертор сигнала редстоуна»", es: "Majora de Invesor de señal Redstone", pt: "Melhoria: Inversor de Sinal de Redstone", zh: "红石信号反转升级"});
Translation.addTranslation("Ejector Upgrade", {ru: "Улучшение «Выталкиватель»", es: "Mejora Expulsora", pt: "Melhoria: Ejetor", zh: "弹出升级"});
Translation.addTranslation("Pulling Upgrade", {ru: "Улучшение «Загрузчик»", es: "Mejora de Traccion", pt: "Melhoria: Sucção", zh: "抽入升级"});
Translation.addTranslation("Fluid Ejector Upgrade", {ru: "Улучшение «Выталкиватель жидкости»", es: "Mejora Expulsora de Líquidos", pt: "Melhoria: Ejetor de Fluidos", zh: "流体弹出升级"});
Translation.addTranslation("Fluid Pulling Upgrade", {ru: "Улучшение «Загрузчик жидкости»", es: "Mejora Traccion de Líquidos", pt: "Melhoria: Injeção de Fluidos Avançada", zh: "流体抽入升级"});

// Crushed Ore
Translation.addTranslation("Crushed Copper Ore", {ru: "Измельчённая медная руда", es: "Mineral de Cobre Triturado", pt: "Minério de Cobre Triturado", zh: "粉碎铜矿石"});
Translation.addTranslation("Crushed Tin Ore", {ru: "Измельчённая оловянная руда", es: "Mineral de Estaño Triturado", pt: "Minério de Estanho Triturado", zh: "粉碎锡矿石"});
Translation.addTranslation("Crushed Iron Ore", {ru: "Измельчённая железная руда", es: "Mineral de Hierro Triturado", pt: "Minério de Ferro Triturado", zh: "粉碎铁矿石"});
Translation.addTranslation("Crushed Lead Ore", {ru: "Измельчённая свинцовая руда", es: "Mineral de Plomo Triturado", pt: "Minério de Chumbo Triturado", zh: "粉碎铅矿石"});
Translation.addTranslation("Crushed Gold Ore", {ru: "Измельчённая золотая руда", es: "Mineral de Oro Triturado", pt: "Minério de Ouro Triturado", zh: "粉碎金矿石"});
Translation.addTranslation("Crushed Silver Ore", {ru: "Измельчённая серебряная руда", es: "Mineral de Plata Triturado", pt: "Minério de Prata Triturado", zh: "粉碎银矿石"});
Translation.addTranslation("Crushed Uranium Ore", {ru: "Измельчённая урановая руда", es: "Mineral de Uranio Triturado", pt: "Minério de Urânio Triturado", zh: "粉碎铀矿石"});

// Purified Ore
Translation.addTranslation("Purified Crushed Copper Ore", {ru: "Очищенная измельчённая медная руда", es: "Mineral de Cobre Triturado y Purificado", pt: "Minério Purificado de Cobre Triturado", zh: "纯净的粉碎铜矿石"});
Translation.addTranslation("Purified Crushed Tin Ore", {ru: "Очищенная измельчённая оловянная руда", es: "Mineral de Estaño Triturado y Purificado", pt: "Minério Purificado de Estanho Triturado", zh: "纯净的粉碎锡矿石"});
Translation.addTranslation("Purified Crushed Iron Ore", {ru: "Очищенная измельчённая железная руда", es: "Mineral de Hierro Triturado y Purificado", pt: "Minério Purificado de Ferro Triturado", zh: "纯净的粉碎铁矿石"});
Translation.addTranslation("Purified Crushed Lead Ore", {ru: "Очищенная измельчённая свинцовая руда", es: "Mineral de Plomo Triturado y Purificado", pt: "Minério Purificado de Chumbo Triturado", zh: "纯净的粉碎铅矿石"});
Translation.addTranslation("Purified Crushed Gold Ore", {ru: "Очищенная измельчённая золотая руда", es: "Mineral de Oro Triturado y Purificado", pt: "Minério Purificado de Ouro Triturado", zh: "纯净的粉碎金矿石"});
Translation.addTranslation("Purified Crushed Silver Ore", {ru: "Очищенная измельчённая серебряная руда", es: "Mineral de Plata Triturado y Purificado", pt: "Minério Purificado de Prata Triturada", zh: "纯净的粉碎银矿石"});
Translation.addTranslation("Purified Crushed Uranium Ore", {ru: "Очищенная измельчённая урановая руда", es: "Mineral de Uranio Triturado y Purificado", pt: "Minério Purificado de Urânio Triturado", zh: "纯净的粉碎铀矿石"});

// Dusts
Translation.addTranslation("Copper Dust", {ru: "Медная пыль", es: "Polvo de Cobre", pt: "Pó de Cobre", zh: "铜粉"});
Translation.addTranslation("Tin Dust", {ru: "Оловянная пыль", es: "Polvo de Estaño", pt: "Pó de Estanho", zh: "锡粉"});
Translation.addTranslation("Bronze Dust", {ru: "Бронзовая пыль", es: "Polvo de Bronce", pt: "Pó de Bronze", zh: "青铜粉"});
Translation.addTranslation("Iron Dust", {ru: "Железная пыль", es: "Polvo de Hierro", pt: "Pó de Ferro", zh: "铁粉"});
Translation.addTranslation("Steel Dust", {ru: "Стальная пыль", es: "Polvo de Acero", pt: "Pó de Aço", zh: "钢粉"});
Translation.addTranslation("Lead Dust", {ru: "Свинцовая пыль", es: "Polvo de Plomo", pt: "Pó de Chumbo", zh: "铅粉"});
Translation.addTranslation("Gold Dust", {ru: "Золотая пыль", es: "Polvo de Oro", pt: "Pó de Ouro", zh: "金粉"});
Translation.addTranslation("Silver Dust", {ru: "Серебряная пыль", es: "Polvo de Plata", pt: "Pó de Prata", zh: "银粉"});
Translation.addTranslation("Stone Dust", {ru: "Каменная пыль", es: "Polvo de Piedra", pt: "Pó de Pedra", zh: "石粉"});
Translation.addTranslation("Coal Dust", {ru: "Угольная пыль", es: "Polvo de Carbón", pt: "Pó de Carvão", zh: "煤粉"});
Translation.addTranslation("Sulfur Dust", {ru: "Серная пыль", es: "Polvo de Sulfuro", pt: "Pó de Enxofre", zh: "硫粉"});
Translation.addTranslation("Lapis Dust", {ru: "Лазуритовая пыль", es: "Polvo de Lapislázuli", pt: "Pó de Lápis-Lazúli", zh: "青金石粉"});
Translation.addTranslation("Diamond Dust", {ru: "Алмазная пыль", es: "Polvo de Diamante", pt: "Pó de Diamante", zh: "钻石粉"});
Translation.addTranslation("Energium Dust", {ru: "Энергетическая пыль", es: "Polvo de Energium", pt: "Pó de Enérgio", zh: "能量水晶粉"});

// Small Dusts
Translation.addTranslation("Tiny Pile of Copper Dust", {ru: "Небольшая кучка медной пыли", es: "Diminuta Pila de Polvo de Cobre", pt: "Pequena Pilha de Pó de Cobre", zh: "小撮铜粉"});
Translation.addTranslation("Tiny Pile of Tin Dust", {ru: "Небольшая кучка оловянной пыли", es: "Diminuta Pila de Polvo de Estaño", pt: "Pequena Pilha de Pó de Estanho", zh: "小撮锡粉"});
Translation.addTranslation("Tiny Pile of Iron Dust", {ru: "Небольшая кучка железной пыли", es: "Diminuta Pila de Polvo de Hierro", pt: "Pequena Pilha de Pó de Ferro", zh: "小撮铁粉"});
Translation.addTranslation("Tiny Pile of Gold Dust", {ru: "Небольшая кучка золотой пыли", es: "Diminuta Pila de Polvo de Oro", pt: "Pequena Pilha de Pó de Ouro", zh: "小撮金粉"});
Translation.addTranslation("Tiny Pile of Lead Dust", {ru: "Небольшая кучка свинцовой пыли", es: "Diminuta Pila de Polvo de Plomo", pt: "Pequena Pilha de Pó de Chumbo", zh: "小撮铅粉"});
Translation.addTranslation("Tiny Pile of Silver Dust", {ru: "Небольшая кучка серебряной пыли", es: "Diminuta Pila de Polvo de Plata", pt: "Pequena Pilha de Pó de Prata", zh: "小撮银粉"});
Translation.addTranslation("Tiny Pile of Sulfur Dust", {ru: "Небольшая кучка серной пыли", es: "Diminuta Pila de Polvo de Sulfuro", pt: "Pequena Pilha de Pó de Enxofre", zh: "小撮硫粉"});

// Ingots
Translation.addTranslation("Copper Ingot", {ru: "Медный слиток", es: "Lingote de Cobre", pt: "Lingote de Cobre", zh: "铜锭"});
Translation.addTranslation("Tin Ingot", {ru: "Оловянный слиток", es: "Lingote de Estaño", pt: "Lingote de Estanho", zh: "锡锭"});
Translation.addTranslation("Bronze Ingot", {ru: "Бронзовый слиток", es: "Lingote de Bronce", pt: "Lingote de Bronze", zh: "青铜锭"});
Translation.addTranslation("Steel Ingot", {ru: "Стальной слиток", es: "Lingote de Acero", pt: "Lingote de Aço", zh: "钢锭"});
Translation.addTranslation("Lead Ingot", {ru: "Свинцовый слиток", es: "Lingote de Plomo", pt: "Lingote de Chumbo", zh: "铅锭"});
Translation.addTranslation("Silver Ingot", {ru: "Серебрянный слиток", es: "Lingote de Plata", pt: "Lingote de Prata", zh: "银锭"});
Translation.addTranslation("Alloy Ingot", {ru: "Композитный слиток", es: "Lingote de Metal Compuesto", pt: "Lingote de Liga Metálica", zh: "合金锭"});

// Plates
Translation.addTranslation("Copper Plate", {ru: "Медная пластина", es: "Placa de Cobre", pt: "Placa de Cobre", zh: "铜板"});
Translation.addTranslation("Tin Plate", {ru: "Оловянная пластина", es: "Placa de Estaño", pt: "Placa de Estanho", zh: "锡板"});
Translation.addTranslation("Iron Plate", {ru: "Железная пластина", es: "Placa de Hierro", pt: "Placa de Ferro", zh: "铁板"});
Translation.addTranslation("Bronze Plate", {ru: "Бронзовая пластина", es: "Placa de Bronce", pt: "Placa de Bronze", zh: "青铜板"});
Translation.addTranslation("Steel Plate", {ru: "Стальная пластина", es: "Placa de Hierro Refinado", pt: "Placa de Aço", zh: "钢板"});
Translation.addTranslation("Gold Plate", {ru: "Золотая пластина", es: "Placa de Oro", pt: "Placa de Ouro", zh: "金板"});
Translation.addTranslation("Lapis Plate", {ru: "Лазуритовая пластина", es: "Placa de Lapislázuli", pt: "Placa de Lápis-Lazúli", zh: "青金石板"});
Translation.addTranslation("Lead Plate", {ru: "Свинцовая пластина", es: "Placa de Plomo", pt: "Placa de Chumbo", zh: "铅板"});

// Dense Plates
Translation.addTranslation("Dense Copper Plate", {ru: "Плотная медная пластина", es: "Placa de Cobre Denso", pt: "Placa Densa de Cobre", zh: "致密铜板"});
Translation.addTranslation("Dense Tin Plate", {ru: "Плотная оловянная пластина", es: "Placa Densa de Estaño", pt: "Placa Densa de Estanho", zh: "致密锡板"});
Translation.addTranslation("Dense Iron Plate", {ru: "Плотная железная пластина", es: "Placa Densa de Hierro", pt: "Placa Densa de Ferro", zh: "致密铁板"});
Translation.addTranslation("Dense Bronze Plate", {ru: "Плотная бронзовая пластина", es: "Placa de Bronce Densa", pt: "Placa Densa de Bronze", zh: "致密青铜板"});
Translation.addTranslation("Dense Steel Plate", {ru: "Плотная стальная пластина", es: "Placa de Hierro Refinado Denso", pt: "Placa Densa de Aço", zh: "致密钢板"});
Translation.addTranslation("Dense Gold Plate", {ru: "Плотная золотая пластина", es: "Placa Densa de Oro", pt: "Placa Densa de Ouro", zh: "致密金板"});
Translation.addTranslation("Dense Lead Plate", {ru: "Плотная свинцовая пластина", es: "Placa Densa de Plomo", pt: "Placa Densa de Chumbo", zh: "致密铅板"});

// Casings
Translation.addTranslation("Copper Casing", {ru: "Медная оболочка", es: "Carcasa para Objetos de Cobre", pt: "Invólucro de Cobre", zh: "铜质外壳"});
Translation.addTranslation("Tin Casing", {ru: "Оловянная оболочка", es: "Carcasa para Objetos de Estaño", pt: "Invólucro de Estanho", zh: "锡质外壳"});
Translation.addTranslation("Iron Casing", {ru: "Железная оболочка", es: "Carcasa para Objetos de Hierro", pt: "Invólucro de Ferro", zh: "铁质外壳"});
Translation.addTranslation("Bronze Casing", {ru: "Бронзовая оболочка", es: "Carcasa para Objetos de Bronce", pt: "Invólucro de Bronze", zh: "青铜外壳"});
Translation.addTranslation("Steel Casing", {ru: "Стальная оболочка", es: "Carcasa para Objetos de Hierro", pt: "Invólucro de Aço", zh: "钢质外壳"});
Translation.addTranslation("Gold Casing", {ru: "Золотая оболочка", es: "Carcasa para Objetos de Oro", pt: "Invólucro de Ouro", zh: "黄金外壳"});
Translation.addTranslation("Lead Casing", {ru: "Свинцовая оболочка", es: "Carcasa para Objetos de Plomo", pt: "Invólucro de Chumbo", zh: "铅质外壳"});

// Cans
Translation.addTranslation("Tin Can", {ru: "Консервная банка", es: "Lata de Estaño", pt: "Lata de Estanho", zh: "锡罐(空)"});
Translation.addTranslation("Filled Tin Can", {ru: "Заполненная консервная банка", es: "Lata de Estaño (llena)", pt: "Lata de Estanho (Cheia)", zh: "锡罐(满)"});
Translation.addTranslation("This looks bad...", {ru: "Это выглядит несъедобно…", pt: "Isso parece ruim ...", zh: "这看起来很糟糕..."});

// Cells
Translation.addTranslation("Cell", {ru: "Капсула", es: "Celda Vacía", pt: "Célula Universal de Fluidos", zh: "空单元"});
Translation.addTranslation("Water Cell", {ru: "Капсула с водой", es: "Celda de Agua", pt: "Célula com Água", zh: "水单元"});
Translation.addTranslation("Lava Cell", {ru: "Капсула с лавой", es: "Celda de Lava", pt: "Célula com Lava", zh: "岩浆单元"});
Translation.addTranslation("Biomass Cell", {ru: "Капсула биомассы", es: "Celda de Biomasa", pt: "Célula com Biomassa", zh: "生物质单元"});
Translation.addTranslation("Biogas Cell", {ru: "Капсула биогаза", pt: "Célula com Biogás", zh: "沼气单元"});
Translation.addTranslation("Coolant Cell", {ru: "Капсула хладагента", es: "Celda de Refrigerante", pt: "Célula com Líquido Refrigerante", zh: "冷却液单元"});
Translation.addTranslation("UU-Matter Cell", {ru: "Капсула жидкой материи", es: "Celda de Materia UU", pt: "Célula com Matéria UU", zh: "UU物质单元"});
Translation.addTranslation("Compressed Air Cell", {ru: "Капсула со сжатым воздухом", es: "Celda de Aire Comprimida", pt: "Célula com Ar Comprimido", zh: "压缩空气单元"});

// Cables
Translation.addTranslation("Tin Cable", {ru: "Оловянный провод", es: "Cable de Ultra-Baja Tensión", pt: "Cabo de Estanho", zh: "锡质导线"});
Translation.addTranslation("Insulated Tin Cable", {ru: "Оловянный провод с изоляцией", es: "Cable de Estaño Aislado", pt: "Cabo de Estanho Isolado", zh: "绝缘锡质导线"});
Translation.addTranslation("Copper Cable", {ru: "Медный провод", es: "Cable de Cobre", pt: "Cabo de Cobre", zh: "铜质导线"});
Translation.addTranslation("Insulated Copper Cable", {ru: "Медный провод с изоляцией", es: "Cable de Cobre Aislado", pt: "Cabo de Cobre Isolado", zh: "绝缘质铜导线"});
Translation.addTranslation("Gold Cable", {ru: "Золотой провод", es: "Cable de Oro", pt: "Cabo de Ouro", zh: "金质导线"});
Translation.addTranslation("Insulated Gold Cable", {ru: "Золотой провод с изоляцией", es: "Cable de Oro Aislado", pt: "Cabo de Ouro Isolado", zh: "绝缘金质导线"});
Translation.addTranslation("2x Ins. Gold Cable", {ru: "Золотой провод с 2x изоляцией", es: "Cable de Oro Aislado x2", pt: "Cabo de Ouro Isolado x2", zh: "2x绝缘金质导线"});
Translation.addTranslation("HV Cable", {ru: "Высоковольтный провод", es: "Cable de Alta Tensión", pt: "Cabo de Alta Tensão", zh: "高压导线"});
Translation.addTranslation("Insulated HV Cable", {ru: "Высоковольтный провод с изоляцией", es: "Cable de Alta Tensión Aislado", pt: "Cabo de Alta Tensão Isolado", zh: "绝缘高压导线"});
Translation.addTranslation("2x Ins. HV Cable", {ru: "Высоковольтный провод с 2x изоляцией", es: "Cable de Alta Tensión Aislado x2", pt: "Cabo de Alta Tensão Isolado x2", zh: "2x绝缘高压导线"});
Translation.addTranslation("3x Ins. HV Cable", {ru: "Высоковольтный провод с 3x изоляцией", es: "Cable de Alta Tensión Aislado x3", pt: "Cabo de Alta Tensão Isolado x3", zh: "3x绝缘高压导线"});
Translation.addTranslation("Glass Fibre Cable", {ru: "Стекловолоконный провод", es: "Cable de Alta Tensión", pt: "Cabo de Fibra de Vidro", zh: "玻璃纤维导线"});

// Armor
Translation.addTranslation("Bronze Helmet", {ru: "Бронзовый шлем", es: "Casco de Bronce", pt: "Elmo de Bronze", zh: "青铜头盔"});
Translation.addTranslation("Bronze Chestplate", {ru: "Бронзовый нагрудник", es: "Chaleco de Bronce", pt: "Peitoral de Bronze", zh: "青铜胸甲"});
Translation.addTranslation("Bronze Leggings", {ru: "Бронзовые поножи", es: "Pantalones de Bronce", pt: "Calças de Bronze", zh: "青铜护腿"});
Translation.addTranslation("Bronze Boots", {ru: "Бронзовые ботинки", es: "Botas de Bronce", pt: "Botas de Bronze", zh: "青铜靴子"});
Translation.addTranslation("Composite Helmet", {ru: "Композитный шлем", es: "Casco de Compuesto", pt: "Capacete Composto", zh: "复合头盔"});
Translation.addTranslation("Composite Chestplate", {ru: "Композитный нагрудник", es: "Chaleco de Compuesto", pt: "Colete Composto", zh: "复合胸甲"});
Translation.addTranslation("Composite Leggings", {ru: "Композитные поножи", es: "Pantalones de Compuesto", pt: "Calças compostas", zh: "复合护腿"});
Translation.addTranslation("Composite Boots", {ru: "Композитные ботинки", es: "Botas de Compuesto", pt: "Botas compostas", zh: "复合靴子"});
Translation.addTranslation("Nightvision Goggles", {ru: "Прибор ночного зрения", es: "Gafas de Vision Nocturna", pt: "Óculos de Visão Noturna", zh: "夜视镜"});
Translation.addTranslation("Nano Helmet", {ru: "Нано-шлем", es: "Casco de Nanotraje", pt: "Elmo de Nanotecnologia", zh: "纳米头盔"});
Translation.addTranslation("Nano Bodyarmor", {ru: "Нано-жилет", es: "Chaleco de Nanotraje", pt: "Peitoral de Nanotecnologia", zh: "纳米胸甲"});
Translation.addTranslation("Nano Leggings", {ru: "Нано-штаны", es: "Pantalones de Nanotraje", pt: "Calças de Nanotecnologia", zh: "纳米护腿"});
Translation.addTranslation("Nano Boots", {ru: "Нано-ботинки", es: "Botas de Nanotraje", pt: "Botas de Nanotecnologia", zh: "纳米靴子"});
Translation.addTranslation("Quantum Helmet", {ru: "Квантовый шлем", es: "Casco de Traje Cuántico", pt: "Elmo Quântico", zh: "量子头盔"});
Translation.addTranslation("Quantum Bodyarmor", {ru: "Квантовый жилет", es: "Chaleco de Traje Cuántico", pt: "Peitoral Quântico", zh: "量子护甲"});
Translation.addTranslation("Quantum Leggings", {ru: "Квантовые штаны", es: "Pantalones de Traje Cuántico", pt: "Calças Quânticas", zh: "量子护腿"});
Translation.addTranslation("Quantum Boots", {ru: "Квантовые ботинки", es: "Botas de Traje Cuántico", pt: "Botas Quânticas", zh: "量子靴子"});
Translation.addTranslation("Scuba Helmet", {ru: "Шлем-акваланг", es: "Casco de Buceo", pt: "Máscara de Mergulho", zh: "防化头盔"});
Translation.addTranslation("Hazmat Suit", {ru: "Защитная куртка", es: "Traje para Materiales Peligrosos", pt: "Roupa Anti-Radiação", zh: "防化服"});
Translation.addTranslation("Hazmat Suit Leggings", {ru: "Защитные штаны", es: "Pantalones para Materiales Peligrosos", pt: "Calças Anti-Radiação", zh: "防化裤"});
Translation.addTranslation("Rubber Boots", {ru: "Резиновые ботинки", es: "Botas de Goma", pt: "Botas de Borracha", zh: "橡胶靴"});
Translation.addTranslation("Jetpack", {ru: "Реактивный ранец", es: "Jetpack Eléctrico", pt: "Mochila à Jato Elétrica", zh: "电力喷气背包"});
Translation.addTranslation("Batpack", {ru: "Аккумуляторный ранец", es: "Mochila de Baterías", pt: "Mochila de Baterias", zh: "电池背包"});
Translation.addTranslation("Advanced Batpack", {ru: "Продвинутый аккумуляторный ранец", es: "Mochila de Baterías Avanzada", pt: "Mochila de Baterias Avançada", zh: "高级电池背包"});
Translation.addTranslation("Energy Pack", {ru: "Энергетический ранец", es: "Pack de Energía", pt: "Mochila de Energia", zh: "能量水晶储电背包"});
Translation.addTranslation("Lappack", {ru: "Лазуротроновый ранец", es: "Mochila de Baterías Avanzada", pt: "Mochila Lapotrônica", zh: "兰波顿储电背包"});

// Tools
Translation.addTranslation("Tool Box", {ru: "Ящик для инструментов", es: "Caja de Herramientas", pt: "Caixa de Ferramentas", zh: "工具盒"});
Translation.addTranslation("Containment Box", {ru: "Защитный контейнер", es: "Caja de Contención", pt: "Caixa de Contenção", zh: "防辐射容纳盒"});
Translation.addTranslation("Frequency Transmitter", {ru: "Частотный связыватель", es: "Transmisor de Frecuencias", pt: "Transmissor de Frequência", zh: "遥控器"});
Translation.addTranslation("OD Scanner", {ru: "Сканер КР", es: "Escaner de Densidad", zh: "OD扫描器"});
Translation.addTranslation("OV Scanner", {ru: "Сканер ЦР", es: "Escaner de Riqueza", zh: "OV扫描器"});
Translation.addTranslation("Treetap", {ru: "Краник", es: "Grifo para Resina", pt: "Drenador", zh: "木龙头"});
Translation.addTranslation("Forge Hammer", {ru: "Кузнечный молот", es: "Martillo para Forja", pt: "Martelo de Forja", zh: "锻造锤"});
Translation.addTranslation("Cutter", {ru: "Кусачки", es: "Pelacables Universal", pt: "Alicate", zh: "板材切割剪刀"});
Translation.addTranslation("Bronze Sword", {ru: "Бронзовый меч", es: "Espada de Bronce", pt: "Espada de Bronze", zh: "青铜剑"});
Translation.addTranslation("Bronze Shovel", {ru: "Бронзовая лопата", es: "Pala de Bronce", pt: "Pá de Bronze", zh: "青铜铲"});
Translation.addTranslation("Bronze Pickaxe", {ru: "Бронзовая кирка", es: "Pico de Bronce", pt: "Picareta de Bronze", zh: "青铜镐"});
Translation.addTranslation("Bronze Axe", {ru: "Бронзовый топор", es: "Hacha de Bronce", pt: "Machado de Bronze", zh: "青铜斧"});
Translation.addTranslation("Bronze Hoe", {ru: "Бронзовая мотыга", es: "Azada de Bronce", pt: "Enxada de Bronze", zh: "青铜锄"});
Translation.addTranslation("Wrench", {ru: "Гаечный ключ", es: "Llave Inglesa", pt: "Chave de Grifo", zh: "扳手"});
Translation.addTranslation("Electric Wrench", {ru: "Электроключ", es: "Llave Inglesa Eléctrica", pt: "Chave de Grifo Elétrica", zh: "电动扳手"});
Translation.addTranslation("Electric Hoe", {ru: "Электромотыга", es: "Azada Eléctrica", pt: "Enxada Elétrica", zh: "电动锄"});
Translation.addTranslation("Electric Treetap", {ru: "Электрокраник", es: "Grifo para Resina Eléctrico", pt: "Drenador Elétrico", zh: "电动树脂提取器"});
Translation.addTranslation("Chainsaw", {ru: "Электропила", es: "Motosierra", pt: "Serra Elétrica", zh: "链锯"});
Translation.addTranslation("Mining Drill", {ru: "Шахтёрский бур", es: "Taladro", pt: "Broca de Mineração", zh: "采矿钻头"});
Translation.addTranslation("Diamond Drill", {ru: "Алмазный бур", es: "Taladro de Diamante", pt: "Broca de Diamante", zh: "钻石钻头"});
Translation.addTranslation("Iridium Drill", {ru: "Иридиевый бур", es: "Taladro de Iridio", pt: "Broca de Irídio", zh: "铱钻头"});
Translation.addTranslation("Nano Saber", {ru: "Нано-сабля", es: "Nano-Sable", pt: "Sabre Nano", zh: "纳米剑"});
Translation.addTranslation("Mining Laser", {ru: "Шахтёрский лазер", es: "Láser Minero", pt: "Laser de Mineração", zh: "采矿镭射枪"});
Translation.addTranslation("EU Meter", {ru: "Мультиметр", pt: "Leitor de EU", zh: "EU电表"});
Translation.addTranslation("Debug Item", {ru: "Предмет отладки", pt: "Item de Depuração", zh:"测试工具"});
Translation.addTranslation("Crop Analyzer", {ru: "Агроанализатор", es: "Semillalizador", pt: "Plantanalizador", zh: "作物分析器"});
Translation.addTranslation("Weeding Trowel", {ru: "Пропалыватель", pt: "Espátula Transplantadora", zh: "除草铲"});

// Coffee
Translation.addTranslation("Coffee Powder", {ru: "Молотый кофе", es: "Polvo de Café", pt: "Pó de Café", zh: "咖啡粉"});
Translation.addTranslation("Stone Mug", {ru: "Каменная кружка", es: "Jarra de Piedra", pt: "Caneca de Pedra", zh: "石杯"});
Translation.addTranslation("Cold Coffee", {ru: "Холодный кофе", es: "Café Frío", pt: "Café Frio", zh: "冷咖啡"});
Translation.addTranslation("Dark Coffee", {ru: "Тёмный кофе", es: "Café Oscuro", pt: "Café Forte", zh: "黑咖啡"});
Translation.addTranslation("Coffee", {ru: "Кофе", es: "Café", pt: "Café", zh: "咖啡"});

// Crop Items
Translation.addTranslation("Seed Bag (%s)", {ru: "Мешок с семенами (%s)", es: "Semillas Desconocidas (%s)", pt: "Saco de sementes (%s)", zh: "种子袋 (%s)"});
Translation.addTranslation("Crop", {ru: "Жёрдочки", pt: "Muda", zh: "作物架"});
Translation.addTranslation("Grin Powder", {ru: "Токсичная пыль", es: "Polvo Horrible", zh: "蛤蛤粉", pt: "Pó do Riso"});
Translation.addTranslation("Weed EX", {ru: "Средство от сорняков", es: "Veneno para Hierbas", pt: "Erbicida", zh: "除草剂"});
Translation.addTranslation("Fertilizer", {ru: "Удобрение", es: "Fertilizante", pt: "Fertilizante", zh: "肥料"});
Translation.addTranslation("Hydration Cell", {ru: "Увлажняющая капсула", pt: "Líquido de Refrigeração", zh: "水化单元"});
Translation.addTranslation("Terra Wart", {ru: "Земляной нарост", es: "Verruga de Tierra", pt: "Fungo da Terra", zh: "大地疣"});
Translation.addTranslation("Coffee Beans", {ru: "Кофейные зёрна", es: "Granos de Café", pt: "Grãos de Café", zh: "咖啡豆"});
Translation.addTranslation("Weed", {ru: "Сорняк", pt: "Erva Daninha", zh: "杂草"});
Translation.addTranslation("Hops", {ru: "Хмель", es: "Lúpulo", pt: "Lúpulo", zh: "啤酒花"});

// Crops
Translation.addTranslation("wheat", {ru: "Пшеница", en: "Wheat", pt: "Trigo", zh: "小麦"});
Translation.addTranslation("weed", {ru: "Сорняк", en: "Weed", pt: "Erva Daninha", zh: "杂草"});
Translation.addTranslation("pumpkin", {ru: "Тыква", en: "Pumpkin", pt: "Abóbora", zh: "南瓜"});
Translation.addTranslation("melon", {ru: "Арбуз", en: "Melon", pt: "Melancia", zh: "西瓜"});
Translation.addTranslation("dandelion", {ru: "Одуванчик", en: "Dandelion", pt: "Dente-de-Leão", zh: "蒲公英"});
Translation.addTranslation("rose", {ru: "Роза", en: "Rose", pt: "Rosa", zh: "玫瑰"});
Translation.addTranslation("blackthorn", {ru: "Терновник", en: "Blackthorn", pt: "Espinheiro-negro", zh: "黑刺李"});
Translation.addTranslation("tulip", {ru: "Тюльпан", en: "Tulip", pt: "Tulipa", zh: "郁金香"});
Translation.addTranslation("cyazint", {ru: "Гиацинт", en: "Cyazint", pt: "Cyazint", zh: "缤纷花"});
Translation.addTranslation("venomilia", {ru: "Веномилия", en: "Venomilia", pt: "Venomilia", zh: "奇妙花"});
Translation.addTranslation("reed", {ru: "Сахарный тростник", en: "Reed", pt: "Cana-de-açúcar", zh: "甘蔗"});
Translation.addTranslation("stickreed", {ru: "Резиновый тростник", en: "Stickreed", zh: "粘性甘蔗", pt: "Cana-de-borracha"});
Translation.addTranslation("cocoa", {ru: "Какао", en: "Cocoa", pt: "Cacau", zh: "可可"});
Translation.addTranslation("red_mushroom", {ru: "Красный гриб", en: "Red Mushroom", pt: "Cogumelo Vermelho", zh: "红色蘑菇"});
Translation.addTranslation("brown_mushroom", {ru: "Коричневый гриб", en: "Brown Mushroom", pt: "Cogumelo marrom", zh: "棕色蘑菇"});
Translation.addTranslation("nether_wart", {ru: "Адский нарост", en: "Nether Wart", pt: "Fungo do Nether", zh: "地狱疣"});
Translation.addTranslation("terra_wart", {ru: "Земляной нарост", en: "Terra Wart", pt: "Fungo da Terra", zh: "大地疣"});
Translation.addTranslation("ferru", {ru: "Феррий", en: "Ferru", pt: "Ferru", zh: "铁叶草"});
Translation.addTranslation("cyprium", {ru: "Куприй", en: "Cyprium", pt: "Chipre", zh: "铜叶草"});
Translation.addTranslation("stagnium", {ru: "Стагний", en: "Stagnium", pt: "Stagnium", zh: "银矿草"});
Translation.addTranslation("plumbiscus", {ru: "Плюмбий", en: "Plumbiscus", pt: "Biscoito de canela", zh: "铅叶草"});
Translation.addTranslation("aurelia", {ru: "Аурелия", en: "Aurelia", pt: "Aurélia", zh: "金叶草"});
Translation.addTranslation("shining", {ru: "Аргентий", en: "Shining", pt: "Brilhante", zh: "闪光"});
Translation.addTranslation("redwheat", {ru: "Красная пшеница", en: "Red Wheat", pt: "Trigo Vermelho", zh: "红麦"});
Translation.addTranslation("coffee", {ru: "Кофе", en: "Coffee", pt: "Café", zh: "咖啡"});
Translation.addTranslation("hops", {ru: "Хмель", en: "Hops", pt: "Lúpulo", zh: "啤酒花"});
Translation.addTranslation("carrots", {ru: "Морковь", en: "Carrots", pt: "Cenouras", zh: "胡萝卜"});
Translation.addTranslation("potato", {ru: "Картофель", en: "Potato", pt: "Batata", zh: "马铃薯"});
Translation.addTranslation("eatingplant", {ru: "Плотоядное растение", en: "Eating Plant", pt: "Planta Carnívora", zh: "食人花"});
Translation.addTranslation("beetroots", {ru: "Свёкла", en: "Beetroots", pt: "Beterrabas", zh: "甜菜根"});

// TEXT
Translation.addTranslation("Mode: ", {ru: "Режим: ", es: "Modo: ", pt: "Modo: ", zh: "模式: "});
// Induction Furnace
Translation.addTranslation("Heat:", {ru: "Нагрев:", es: "Calor:", pt: "Calor:", zh:"热量:"});
// Charging Batteries
Translation.addTranslation("Mode: Disabled", {ru: "Режим: Выключен", pt: "Modo: Desabilitado", zh:"模式: 禁用"});
Translation.addTranslation("Mode: Charge items not in hand", {ru: "Режим: Заряжать предметы, которые не в руке", pt: "Modo: Carregar itens que não estão nas mãos", zh:"模式: 手里没有要充电的东西"});
Translation.addTranslation("Mode: Enabled", {ru: "Режим: Включён", pt: "Modo: Habilitado", zh:"模式: 启用"});
// Fluid Distributor
Translation.addTranslation("Mode:", {ru: "Режим:", es: "Modo:", pt: "Modo:", zh: "模式:"});
Translation.addTranslation("Distribute", {ru: "распростр.", es: "distribuir", pt: "Distribuir", zh: "分配模式"});
Translation.addTranslation("Concentrate", {ru: "концентрац.", es: "concentrado", pt: "Concentrar", zh: "混合模式"});
// Advanced Miner
Translation.addTranslation("Mode: Blacklist", {ru: "Чёрный список", es: "Modo: lista negra", pt: "Modo: Lst Negra", zh: "模式:黑名单"});
Translation.addTranslation("Mode: Whitelist", {ru: "Белый список", es: "Modo: lista blanca", pt: "Modo: Lst Branca", zh: "模式:白名单"});
// EU Meter
Translation.addTranslation("EnergyIn", {ru: "Вход энергии", pt: "EnergiaEntr", zh: "能量流入"});
Translation.addTranslation("EnergyOut", {ru: "Выход энергии", pt: "EnergiaSaid", zh: "能量流出"});
Translation.addTranslation("EnergyGain", {ru: "Энергии получено", es: "EnergíaGana", pt: "GanhoEnerg", zh: "获得能量"});
Translation.addTranslation("Voltage", {ru: "Напряжение", es: "Voltaje", pt: "Voltagem", zh: "电压"});
Translation.addTranslation("Avg:", {ru: "Средн.:", es: "Promedio:", pt: "Méd:", zh: "平均:"});
Translation.addTranslation("Max/Min", {ru: "Макс./Мин.", pt: "Máx/Min", zh: "最大/最小"});
Translation.addTranslation("Cycle: ", {ru: "Цикл: ", es: "Ciclo: ", pt: "Cíclo: ", zh: "周期: "});
Translation.addTranslation("Reset", {ru: "Сброс", pt: "Resetar", zh: "重置"});
// Mining Laser
Translation.addTranslation("Mining", {ru: "Добыча", es: "Taladrando", pt: "Mineração", zh: "挖矿模式"});
Translation.addTranslation("Low-Focus", {ru: "Короткого фокуса", es: "Baja Potencia", pt: "Baixo-Foco", zh: "低聚焦模式"});
Translation.addTranslation("Long-Range", {ru: "Дальнего действия", es: "Largo Alcance", pt: "Longo Alcance", zh: "远距模式"});
Translation.addTranslation("Horizontal", {ru: "Горизонтальный", zh: "水平模式"});
Translation.addTranslation("Super-Heat", {ru: "Перегревающий", es: "Super-Calor", pt: "Super Quente", zh: "超级热线模式"});
Translation.addTranslation("Scatter", {ru: "Разброс", es: "Esparcido", pt: "Dispersão", zh: "散射模式"});
// Iridium Drill
Translation.addTranslation("Fortune III", {ru: "Удача III", pt: "Fortuna III", zh: "时运 III"});
Translation.addTranslation("Silk Touch", {ru: "Шёлковое касание", pt: "Toque suave", zh: "精准采集"});

// Messages
Translation.addTranslation("Nightvision mode enabled", {ru: "Режим ночного зрения включен", zh: "已启用夜视模式"});
Translation.addTranslation("Nightvision mode disabled", {ru: "Режим ночного зрения выключен", zh: "已禁用夜视模式"});
Translation.addTranslation("Hover mode disabled", {ru: "Режим парения выключен", zh: "已禁用悬浮模式"});
Translation.addTranslation("Hover mode enabled", {ru: "Режим парения включен", zh: "已启用悬浮模式"});

// Tooltips
Translation.addTranslation("Power Tier: ", {ru: "Энергоуровень: ", zh: "能量等级: "});
Translation.addTranslation("Max voltage: ", {ru: "Макс. напряжение: ", zh: "最大电压: "});
Translation.addTranslation("Decrease process time to ", {ru: "Уменьшает время работы до ", pt: "Diminui o tempo de processo para ", zh: "加工用时缩短为"});
Translation.addTranslation("Increase power to ", {ru: "Увеличивает энергопотребление до ", pt: "Aumenta o Uso de Energia em ", zh: "能量增加到"});
Translation.addTranslation("Increase energy tier by 1", {ru: "Увеличивает энергоуровень на 1 ", pt: "Aumenta o nível da máquina em 1", zh: "增加一级输出电压"});
Translation.addTranslation("Increase energy storage by 10k EU", {ru: "Увеличивает энергоёмкость на 10k EU", pt: "Aumenta o armazenamento de energia em 10k EU", zh: "增加10k EU储能"});
Translation.addTranslation("Automatically output to\nthe %s side", {ru: "Автоматическое извлечение с %s стороны", zh: "自动输出到%s方向"});
Translation.addTranslation("Automatically input from\nthe %s side", {ru: "Автоматический ввод с %s стороны", zh: "自动从%s抽入物品"});
// side names are translated in core/item_name.js

// Recipe Viewer
Translation.addTranslation("Heat: ", {ru: "Нагрев: ", es: "Calor: ", pt: "Calor: ", zh:"热量: "});

//Creative Groups
Translation.addTranslation("Ores", {ru: "Руды"});
Translation.addTranslation("Metal Blocks", {ru: "Блоки металлов"});
Translation.addTranslation("Transformers", {ru: "Трансформаторы"});
Translation.addTranslation("Cables", {ru: "Провода"});
Translation.addTranslation("Battery Packs", {ru: "Аккумуляторные ранцы"});
Translation.addTranslation("Charging Batteries", {ru: "Заряжающие аккумуляторы"});
Translation.addTranslation("Crafting Components", {ru: "Компоненты крафта"});
Translation.addTranslation("Materials", {ru: "Материалы"});
Translation.addTranslation("Batteries", {ru: "Аккумуляторы"});
Translation.addTranslation("Machine Upgrades", {ru: "Улучшения"});
Translation.addTranslation("Coffee", {ru: "Кофе"});
Translation.addTranslation("Crushed Ores", {ru: "Измельчённые руды"});
Translation.addTranslation("Purified Crushed Ores", {ru: "Очищенные измельчённые руды"});
Translation.addTranslation("Dusts", {ru: "Пыль"});
Translation.addTranslation("Small Dusts", {ru: "Небольшие кучки пыли"});
Translation.addTranslation("Ingots", {ru: "Слитки"});
Translation.addTranslation("Plates", {ru: "Пластины"});
Translation.addTranslation("Desne Plates", {ru: "Плотные пластины"});
Translation.addTranslation("Metal Casings", {ru: "Металлические оболочки"});
Translation.addTranslation("Nuclear", {ru: "Радиоактивные"});
Translation.addTranslation("Mining Drills", {ru: "Шахтёрские буры"});
Translation.addTranslation("Cells", {ru: "Капсулы"});
Translation.addTranslation("Nuclear Fuel Rods", {ru: "Топливные стержни"});
Translation.addTranslation("Neutron Reflectors", {ru: "Отражатели нейтронов"});
Translation.addTranslation("Reactor Platings", {ru: "Обшивки реактора"});
Translation.addTranslation("Reactor Heat Vents", {ru: "Теплоотводы"});
Translation.addTranslation("Reactor Heat Exchangers", {ru: "Теплообменники"});
Translation.addTranslation("Reactor Coolants", {ru: "Охлаждающие капсулы"});
Translation.addTranslation("Seed Bags", {ru: "Мешки с семенами"});




// file: core/machine/define.js

var MachineRegistry = {
	machineIDs: {},

	isMachine: function(id){
		return this.machineIDs[id];
	},
	
	// Machine Base
	registerPrototype: function(id, Prototype){
		// register ID
		this.machineIDs[id] = true;
		
		// click fix
		Prototype.onItemClick = function(id, count, data, coords){
			if (id == ItemID.debugItem || id == ItemID.EUMeter) return false;
			if (this.click(id, count, data, coords)) return true;
			if (Entity.getSneaking(player)) return false;
			var gui = this.getGuiScreen();
			if (gui){
				this.container.openAs(gui);
				return true;
			}
		};
		
		if(Prototype.wrenchClick){
			Prototype.click = function(id, count, data, coords){
				var item = Player.getCarriedItem();
				if(ICTool.isValidWrench(item, 10)){
					if(this.wrenchClick(id, count, data, coords))
						ICTool.useWrench(item, 10);
					return true;
				}
				return false;
			};
		}
		
		// audio
		if(Prototype.getStartSoundFile){
			if(!Prototype.getStartingSoundFile){
				Prototype.getStartingSoundFile = function(){return null;}
			}
			if(!Prototype.getInterruptSoundFile){
				Prototype.getInterruptSoundFile = function(){return null;}
			}
			Prototype.startPlaySound = Prototype.startPlaySound || function(){
				if(!Config.machineSoundEnabled){return;}
				let audio = this.audioSource;
				if(audio && audio.isFinishing){
					audio.stop();
					audio.media = audio.startingSound || audio.startSound;
					audio.start();
					audio.isFinishing = false;
				}
				else if(!this.remove && (!audio || !audio.isPlaying()) && this.dimension == Player.getDimension()){
					this.audioSource = SoundAPI.createSource([this.getStartingSoundFile(), this.getStartSoundFile(), this.getInterruptSoundFile()], this, 16);
				}
			}
			Prototype.stopPlaySound = Prototype.stopPlaySound || function(playInterruptSound){
				let audio = this.audioSource;
				if(audio){
					if(!audio.isPlaying()){
						this.audioSource = null;
					}
					else if(!audio.isFinishing){
						audio.stop();
						if(playInterruptSound){
							audio.playFinishingSound();
						}
					}
				}
			}
		} 
		else {
			Prototype.startPlaySound = Prototype.startPlaySound || function(name){
				if(!Config.machineSoundEnabled){return;}
				let audio = this.audioSource;
				if(!this.remove && (!audio || !audio.isPlaying()) && this.dimension == Player.getDimension()){
					let sound = SoundAPI.playSoundAt(this, name, true, 16);
					this.audioSource = sound;
				}
			}
			Prototype.stopPlaySound = Prototype.stopPlaySound || function(){
				if(this.audioSource && this.audioSource.isPlaying()){
					this.audioSource.stop();
					this.audioSource = null;
				}
			}
		}
		
		
		// machine activation
		if(Prototype.defaultValues && Prototype.defaultValues.isActive !== undefined){
			if(!Prototype.renderModel){
				Prototype.renderModel = this.renderModelWithRotation;
			}
			
			Prototype.setActive = Prototype.setActive || this.setActive;
			
			Prototype.activate = Prototype.activate || function(){
				this.setActive(true);
			}
			Prototype.deactivate = Prototype.deactivate || function(){
				this.setActive(false);
			}
			Prototype.destroy = Prototype.destroy || function(){
				BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
				this.stopPlaySound();
			}
		}
		
		if(!Prototype.init && Prototype.renderModel){
			Prototype.init = Prototype.renderModel;
		}
		
		ToolAPI.registerBlockMaterial(id, "stone", 1, true);
		Block.setDestroyTime(id, 3);
		TileEntity.registerPrototype(id, Prototype);
	},
	
	// EU machines
	registerElectricMachine: function(id, Prototype){
		// wire connection
		ICRender.getGroup("ic-wire").add(id, -1);
		// setup energy values
		if (Prototype.defaultValues){
			Prototype.defaultValues.energy = 0;
			Prototype.defaultValues.energy_receive = 0;
			Prototype.defaultValues.last_energy_receive = 0;
			Prototype.defaultValues.voltage = 0;
			Prototype.defaultValues.last_voltage = 0;
		}
		else{
			Prototype.defaultValues = {
				energy: 0,
				energy_receive: 0,
				last_energy_receive: 0,
				voltage: 0,
				last_voltage: 0
			};
		}
		
		Prototype.getTier = Prototype.getTier || function(){
			return 1;
		}
		
		if(!Prototype.getEnergyStorage){
			Prototype.getEnergyStorage = function(){
				return 0;
			};
		}
		
		if(!Prototype.energyTick){
			Prototype.energyTick = function(){
				this.data.last_energy_receive = this.data.energy_receive;
				this.data.energy_receive = 0;
				this.data.last_voltage = this.data.voltage;
				this.data.voltage = 0;
			};
		}
		
		if (!Prototype.getMaxPacketSize) {
			Prototype.getMaxPacketSize = function(tier){
				return 8 << this.getTier()*2;
			}
		}
		
		Prototype.energyReceive = Prototype.energyReceive || this.basicEnergyReceiveFunc;
		
		this.registerPrototype(id, Prototype);
		// register for energy net
		EnergyTileRegistry.addEnergyTypeForId(id, EU);
	},
	
	registerGenerator(id, Prototype){
		Prototype.canReceiveEnergy = function(){
			return false;
		},
	
		Prototype.isEnergySource = function(){
			return true;
		},
		
		Prototype.energyTick = Prototype.energyTick || this.basicEnergyOutFunc;
		
		this.registerElectricMachine(id, Prototype);
	},
	
	registerEUStorage(id, Prototype){
		Prototype.isEnergySource = function(){
			return true;
		},
		
		Prototype.energyReceive = Prototype.energyReceive || this.basicEnergyReceiveFunc;
		
		Prototype.energyTick = Prototype.energyTick || this.basicEnergyOutFunc;
		
		Prototype.isTeleporterCompatible = true;
		
		this.registerElectricMachine(id, Prototype);
	},
	
	// standard functions
	setStoragePlaceFunction: function(id, fullRotation){
		Block.registerPlaceFunction(BlockID[id], function(coords, item, block){
			var place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
			World.setBlock(place.x, place.y, place.z, item.id, 0);
			var rotation = TileRenderer.getBlockRotation(fullRotation);
			var tile = World.addTileEntity(place.x, place.y, place.z);
			tile.data.meta = rotation;
			TileRenderer.mapAtCoords(place.x, place.y, place.z, item.id, rotation);
			if(item.extra){
				tile.data.energy = item.extra.getInt("energy");
			}
		});
	},
	
	getMachineDrop: function(coords, blockID, level, basicDrop, saveEnergyAmount){
		BlockRenderer.unmapAtCoords(coords.x, coords.y, coords.z);
		var item = Player.getCarriedItem();
		var dropID = 0;
		if(ICTool.isValidWrench(item, 10)){
			ICTool.useWrench(item, 10);
			World.setBlock(coords.x, coords.y, coords.z, 0);
			var chance = ICTool.getWrenchData(item.id).chance;
			if(Math.random() < chance){
				dropID = blockID;
			} else {
				dropID = basicDrop || blockID;
			}
		}
		else if(level >= ToolAPI.getBlockDestroyLevel(blockID)){
			dropID = basicDrop || blockID;
		}
		if(dropID == blockID && saveEnergyAmount){
			var extra = new ItemExtraData();
			extra.putInt("energy", saveEnergyAmount);
			World.drop(coords.x, coords.y, coords.z, dropID, 1, 0, extra);
			return [];
		}
		if(dropID) return [[dropID, 1, 0]];
		return [];
	},
	
	setMachineDrop: function(nameID, basicDrop){
		Block.registerDropFunction(nameID, function(coords, blockID, blockData, level){
			return MachineRegistry.getMachineDrop(coords, blockID, level, basicDrop);
		});
		Block.registerPopResourcesFunction(nameID, function(coords, block){ // drop on explosion
			if(Math.random() < 0.25){
				World.drop(coords.x + .5, coords.y + .5, coords.z + .5, basicDrop || block.id, 1);
			}
		});
	},
	
	setFacing: function(coords){
		if(Entity.getSneaking(player)){
			var facing = coords.side + Math.pow(-1, coords.side);
		} else {
			var facing = coords.side;
		}
		if(facing != this.data.meta){
			this.data.meta = facing;
			this.renderModel();
			return true;
		}
		return false;
	},
	
	renderModel: function(){
		if(this.data.isActive){
			TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, 0);
		} else {
			BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
		}
	},
	
	renderModelWithRotation: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta + (this.data.isActive? 4 : 0));
	},
	
	renderModelWith6Sides: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta + (this.data.isActive? 6 : 0));
	},
	
	setActive: function(isActive){
		if(this.data.isActive != isActive){
			this.data.isActive = isActive;
			this.renderModel();
		}
	},
	
	basicEnergyOutFunc: function(type, src){
		this.data.last_energy_receive = this.data.energy_receive;
		this.data.energy_receive = 0;
		this.data.last_voltage = this.data.voltage;
		this.data.voltage = 0;
		var output = this.getMaxPacketSize();
		if(this.data.energy >= output){
			this.data.energy += src.add(output) - output;
		}
	},
	
	basicEnergyReceiveFunc: function(type, amount, voltage) {
		var maxVoltage = this.getMaxPacketSize();
		if(voltage > maxVoltage){
			if(Config.voltageEnabled){
				World.setBlock(this.x, this.y, this.z, 0);
				World.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, 1.2, true);
				var sound = SoundAPI.playSound("Machines/MachineOverload.ogg", false, true);
				if(sound && !sound.source){
					sound.setSource(this, 32);
				}
				this.selfDestroy();
				return 1;
			}
			var add = Math.min(maxVoltage, this.getEnergyStorage() - this.data.energy);
		} else {
			var add = Math.min(amount, this.getEnergyStorage() - this.data.energy);
		}
		this.data.energy += add;
		this.data.energy_receive += add;
		this.data.voltage = Math.max(this.data.voltage, voltage);
		return add;
	},
	
	getLiquidFromItem: function(liquid, inputItem, outputItem, hand){
		if(hand) outputItem = {id: 0, count: 0, data: 0};
		var empty = LiquidLib.getEmptyItem(inputItem.id, inputItem.data);
		if(empty && (!liquid && this.interface.canReceiveLiquid(empty.liquid) || empty.liquid == liquid) && !this.liquidStorage.isFull(empty.liquid)){
			if(outputItem.id == empty.id && outputItem.data == empty.data && outputItem.count < Item.getMaxStack(empty.id) || outputItem.id == 0){
				var liquidLimit = this.liquidStorage.getLimit(empty.liquid);
				var storedAmount = this.liquidStorage.getAmount(liquid).toFixed(3);
				var count = Math.min(hand? inputItem.count : 1, parseInt((liquidLimit - storedAmount) / empty.amount));
				if(count > 0){
					this.liquidStorage.addLiquid(empty.liquid, empty.amount * count);
					inputItem.count -= count;
					outputItem.id = empty.id;
					outputItem.data = empty.data;
					outputItem.count += count;
					if(!hand) this.container.validateAll();
				}
				else if(inputItem.count == 1 && empty.storage){
					var amount = Math.min(liquidLimit - storedAmount, empty.amount);
					this.liquidStorage.addLiquid(empty.liquid, amount);
					inputItem.data += amount * 1000;
				}
				if(hand){
					if(outputItem.id){
						Player.addItemToInventory(outputItem.id, outputItem.count, outputItem.data);
					}
					if(inputItem.count == 0) inputItem.id = inputItem.data = 0;
					Player.setCarriedItem(inputItem.id, inputItem.count, inputItem.data);
					return true;
				}
			}
		}
	},
	
	addLiquidToItem: function(liquid, inputItem, outputItem){
		var amount = this.liquidStorage.getAmount(liquid).toFixed(3);
		if(amount > 0){
			var full = LiquidLib.getFullItem(inputItem.id, inputItem.data, liquid);
			if(full && (outputItem.id == full.id && outputItem.data == full.data && outputItem.count < Item.getMaxStack(full.id) || outputItem.id == 0)){
				if(amount >= full.amount){
					this.liquidStorage.getLiquid(liquid, full.amount);
					inputItem.count--;
					outputItem.id = full.id;
					outputItem.data = full.data;
					outputItem.count++;
					this.container.validateAll();
				}
				else if(inputItem.count == 1 && full.storage){
					if(inputItem.id == full.id){
						amount = this.liquidStorage.getLiquid(liquid, full.amount);
						inputItem.data -= amount * 1000;
					} else {
						amount = this.liquidStorage.getLiquid(liquid, full.storage);
						inputItem.id = full.id;
						inputItem.data = (full.storage - amount)*1000;
					}
				}
			}
		}
	},
	
	isValidEUItem: function(id, count, data, container){
		var level = container.tileEntity.getTier();
		return ChargeItemRegistry.isValidItem(id, "Eu", level);
	},
	
	isValidEUStorage: function(id, count, data, container){
		var level = container.tileEntity.getTier();
		return ChargeItemRegistry.isValidStorage(id, "Eu", level);
	},
	
	updateGuiHeader: function(gui, text){
		var header = gui.getWindow("header");
		header.contentProvider.drawing[1].text = Translation.translate(text);
	}
}

var transferByTier = {
	1: 32,
	2: 256,
	3: 2048,
	4: 8192
}




// file: core/machine/recipe.js

var MachineRecipeRegistry = {
	recipeData: {},
	
	registerRecipesFor: function(name, data, validateKeys){
		if(validateKeys){
			var newData = {};
			for(var key in data){
				if(key.indexOf(":") != -1){
					var keyArray = key.split(":");
					var newKey = eval(keyArray[0]) + ":" + keyArray[1];
				} else {
					var newKey = eval(key);
				}
				newData[newKey] = data[key];
			}
			data = newData;
		}
		this.recipeData[name] = data;
	},
	
	addRecipeFor: function(name, input, result){
		var recipes = this.requireRecipesFor(name, true);
		if(Array.isArray(recipes)){
			recipes.push({input: input, result: result});
		}
		else {
			recipes[input] = result;
		}
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
	},
	
	hasRecipeFor: function(name, key1, key2){
		return this.getRecipeResult(name, key1, key2)? true : false;
	}
}




// file: core/machine/upgrade.js

var UpgradeAPI = {
	data: {},
	
	getUpgradeData: function(id){
		return this.data[id];
	},
	
	isUpgrade: function(id){
		return UpgradeAPI.data[id]? true : false;
	},
	
	isValidUpgrade: function(id, count, data, container){
		var upgrades = container.tileEntity.upgrades;
		var upgradeData = UpgradeAPI.getUpgradeData(id);
		if(upgradeData && (!upgrades || upgrades.indexOf(upgradeData.type) != -1)){
			return true;
		}
		return false;
	},

	registerUpgrade: function(id, type, func){
		this.data[id] = {type: type, func: func};
	},

	callUpgrade: function(item, machine, container, data){
		var upgrades = machine.upgrades;
		var upgrade = this.getUpgradeData(item.id);
		if(upgrade && (!upgrades || upgrades.indexOf(upgrade.type) != -1)){
			upgrade.func(item, machine, container, data);
		}
	},
	
	getUpgrades: function(machine, container){
		var upgrades = [];
		for(var slotName in container.slots){
			if(slotName.match(/Upgrade/)){
				var slot = container.getSlot(slotName);
				if(slot.id > 0){
					var find = false;
					for(var i in upgrades){
						var item = upgrades[i];
						if(item.id == slot.id && item.data == slot.data){
							item.count += slot.count;
							find = true;
							break;
						}
					}
					if(!find){
						item = {id: slot.id, count: slot.count, data: slot.data};
						upgrades.push(item);
					}
				}
			}
		}
		return upgrades;
	},

	executeUpgrades: function(machine){
		var container = machine.container;
		var data = machine.data;
		var upgrades = this.getUpgrades(machine, container);
		for(var i in upgrades){
			this.callUpgrade(upgrades[i], machine, container, data);
		}
		StorageInterface.checkHoppers(machine);
	},
}




// file: core/wiring/cableAPI.js

let CableRegistry = {
	insulation_data: {},
	paint_data: [],
	
	createBlock: function(nameID, properties, blockType){
		var variations = [];
		for(let i = 0; i < 16; i++){
			variations.push({name: properties.name, texture: [[properties.texture, i]]});
		}
		Block.createBlock(nameID, variations, blockType);
		this.paint_data.push(BlockID[nameID]);
	},
	
	registerCable: function(nameID, maxVoltage, maxInsulationLevel){
		if(maxInsulationLevel){
			for(let i = 0; i <= maxInsulationLevel; i++){
				let id = BlockID[nameID+i];
				this.insulation_data[id] = {name: nameID, insulation: i, maxInsulation: maxInsulationLevel};
				EU.registerWire(id, maxVoltage, this.cableBurnoutFunc);

				Block.registerDropFunction(nameID + i, function(coords, id, data){
					return [[ItemID[nameID+i], 1, 0]];
				});

				Block.registerPopResourcesFunction(nameID + i, function(coords, block){
					if(Math.random() < 0.25){
						World.drop(coords.x + .5, coords.y + .5, coords.z + .5, ItemID[nameID+i], 1, 0);
					}
					EnergyTypeRegistry.onWireDestroyed(coords.x, coords.y, coords.z, block.id);
				});
			}
		} else {
			EU.registerWire(BlockID[nameID], maxVoltage, this.cableBurnoutFunc);
			Block.registerDropFunction(nameID, function(coords, id, data){
				return [[ItemID[nameID], 1, 0]];
			});
			Block.registerPopResourcesFunction(nameID, function(coords, block){
				if(Math.random() < 0.25){
					World.drop(coords.x + .5, coords.y + .5, coords.z + .5, ItemID[nameID], 1, 0);
				}
				EnergyTypeRegistry.onWireDestroyed(coords.x, coords.y, coords.z, block.id);
			});
		}
	},

	getCableData: function(id){
		return this.insulation_data[id];
	},

	canBePainted: function(id){
		return this.paint_data.indexOf(id) != -1;
	},

	cableBurnoutFunc: function(voltage){
		if(Config.voltageEnabled){
			for(var key in this.wireMap){
				var coords = key.split(':');
				var x = Math.floor(coords[0]), y = Math.floor(coords[1]), z = Math.floor(coords[2]);
				World.setBlock(x, y, z, 0);
				CableRegistry.addBurnParticles(x, y, z);
			}
			EnergyNetBuilder.removeNet(this);
		}
	},
	
	addBurnParticles: function(x, y, z){
		for(var i = 0; i < 32; i++){
			var px = x + Math.random();
			var pz = z + Math.random();
			var py = y + Math.random();
			Particles.addFarParticle(ParticleType.smoke, px, py, pz, 0, 0.01, 0);
		}
	}
}




// file: core/wiring/electric_damage.js

function isFriendlyMob(type){
	if(type >= 10 && type <= 31) return true;
	if(type == 74 || type == 75) return true;
	if(type == 108 || type == 109 || type >= 111 && type <= 113 || type == 115 || type == 118){
		return true;
	}
	return false;
}

function isHostileMob(type){
	if(type >= 32 && type <= 59) return true;
	if(type == 104 || type == 105 || type == 110 || type == 114 || type == 116){
		return true;
	}
	return false;
}

function canTakeDamage(entity, damageSource){
	var type = Entity.getType(entity);
	if(entity == player){
		if(Game.getGameMode() == 1) return false;
		switch(damageSource){
		case "electricity":
			if(Player.getArmorSlot(0).id == ItemID.hazmatHelmet && Player.getArmorSlot(1).id == ItemID.hazmatChestplate &&
			Player.getArmorSlot(2).id == ItemID.hazmatLeggings && Player.getArmorSlot(3).id == ItemID.rubberBoots){
				return false;
			}
		break;
		case "radiation":
			return RadiationAPI.checkPlayerArmor();
		}
		return true;
	}
	return isFriendlyMob(type) || isHostileMob(type);
}

function damageEntityInR(entity, x, y, z){
	for(var yy = y-2; yy <= y+1; yy++)
	for(var xx = x-1; xx <= x+1; xx++)
	for(var zz = z-1; zz <= z+1; zz++){
		var blockID = World.getBlockID(xx, yy, zz);
		var cableData = CableRegistry.getCableData(blockID);
		if(cableData && cableData.insulation < cableData.maxInsulation){
			var net = EnergyNetBuilder.getNetOnCoords(xx, yy, zz);
			if(net && net.energyName == "Eu" && net.lastVoltage > insulationMaxVolt[cableData.insulation]){
				var damage = Math.ceil(net.lastVoltage / 32);
				Entity.damageEntity(entity, damage);
				return;
			}
		}
	}
}

var insulationMaxVolt = {
	0: 5,
	1: 128,
	2: 512
}

Callback.addCallback("tick", function(){
	if(World.getThreadTime()%20 == 0){
		if(Config.wireDamageEnabled){
			var entities = Entity.getAll();
		} else {
			var entities = [player];
		}
		for(var i in entities){
			var ent = entities[i];
			if(canTakeDamage(ent, "electricity") && Entity.getHealth(ent) > 0){
				var coords = Entity.getPosition(ent);
				damageEntityInR(ent, Math.floor(coords.x), Math.floor(coords.y), Math.floor(coords.z));
			}
		}
	}
});




// file: core/config.js

let Config = {
	reload: function(){
		this.debugMode = __config__.getBool("debug_mode");
		this.soundEnabled = __config__.getBool("sound_enabled");
		this.machineSoundEnabled = __config__.getBool("machine_sounds");
		this.voltageEnabled = __config__.getBool("voltage_enabled");
		this.wireDamageEnabled = __config__.getBool("wire_damage_enabled");
		
		var lang = FileTools.ReadKeyValueFile("games/com.mojang/minecraftpe/options.txt").game_language;
		this.language = (lang || "en_US").substring(0, 2);
	}
}

Config.reload();

var player;
Callback.addCallback("LevelLoaded", function(){
	Config.reload();
	player = Player.get();
});

isLevelDisplayed = false;
Callback.addCallback("LevelDisplayed", function(){
	isLevelDisplayed = true;
});
Callback.addCallback("LevelLeft", function(){
	isLevelDisplayed = false;
});




// file: core/tool.js

let ICTool = {
	wrenchData: {},
	
	registerWrench: function(id, chance, energyOnUse){
		this.wrenchData[id] = {chance: chance, energy: energyOnUse}
	},
	
	getWrenchData: function(id){
		return this.wrenchData[id];
	},
	
	isValidWrench: function(item, damage){
		let wrench = this.getWrenchData(item.id);
		if(wrench){
			let energyStored = ChargeItemRegistry.getEnergyStored(item);
			if(!wrench.energy || energyStored >= wrench.energy * damage){
				return true;
			}
		}
		return false;
	},
	
	useWrench: function(item, damage){
		let wrench = this.getWrenchData(item.id);
		if(!wrench.energy){
			ToolAPI.breakCarriedTool(damage);
		} else {
			this.useElectricItem(item, wrench.energy * damage);
		}
		SoundAPI.playSound("Tools/Wrench.ogg");
	},
	
	addRecipe: function(result, data, tool){
		data.push({id: tool, data: -1});
		Recipes.addShapeless(result, data, function(api, field, result){
			for (let i in field){
				if (field[i].id == tool){
					field[i].data++;
					if (field[i].data >= Item.getMaxDamage(tool)){
						field[i].id = field[i].count = field[i].data = 0;
					}
				}
				else {
					api.decreaseFieldSlot(i);
				}
			}
		});
	},
	
	dischargeItem: function(item, consume){
		let energy = 0;
		let armor = Player.getArmorSlot(1);
		let armorChargeData = ChargeItemRegistry.getItemData(armor.id);
		if(armorChargeData){
			let itemChargeLevel = ChargeItemRegistry.getItemData(item.id).level;
			energy = ChargeItemRegistry.getEnergyFrom(armor, "Eu", consume, consume, itemChargeLevel);
			consume -= energy;
		}
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		if(energyStored >= consume){
			if(energy > 0){
				Player.setArmorSlot(1, armor.id, 1, armor.data, armor.extra);
			}
			ChargeItemRegistry.setEnergyStored(item, energyStored - consume);
			return true;
		}
		return false;
	},
	
	useElectricItem: function(item, consume){
		if(this.dischargeItem(item, consume)){
			Player.setCarriedItem(item.id, 1, item.data, item.extra);
			return true;
		}
		return false;
	},
	
	registerElectricHoe: function(nameID){
		Item.registerUseFunction(nameID, function(coords, item, block){
			if((block.id==2 || block.id==3 || block.id==110 || block.id==243) && coords.side==1 && ICTool.useElectricItem(item, 50)){ 
				World.setBlock(coords.x, coords.y, coords.z, 60);
				World.playSoundAtEntity(Player.get(), "step.gravel", 1, 0.8);
			}
		});
	},
	
	registerElectricTreerap: function(nameID){
		Item.registerUseFunction(nameID, function(coords, item, block){
			if(block.id == BlockID.rubberTreeLogLatex && block.data - 2 == coords.side && ICTool.useElectricItem(item, 50)){
				SoundAPI.playSound("Tools/Treetap.ogg");
				World.setBlock(coords.x, coords.y, coords.z, BlockID.rubberTreeLogLatex, block.data - 4);
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
	}
}

Callback.addCallback("DestroyBlockStart", function(coords, block){
	if(MachineRegistry.machineIDs[block.id]){
		let item = Player.getCarriedItem();
		if(ICTool.isValidWrench(item.id, item.data, 10)){
			Block.setTempDestroyTime(block.id, 0);
		}
	}
});




// file: core/radiation.js

let RadiationAPI = {
	items: {},
	playerRad: 0,
	sources: {},
	hazmatArmor: [],
	
	regRadioactiveItem: function(id, duration, stack){
		this.items[id] = [duration, stack || false];
	},
	
	getItemRadiation: function(id){
		return this.items[id];
	},
	
	isRadioactiveItem: function(id){
		return this.items[id] ? true : false;
	},
	
	emitItemRadiation: function(id){
		let radiation = this.getItemRadiation(id);
		if(radiation){
			if(radiation[1]){
				this.addRadiation(radiation[0]);
			} else {
				this.setRadiation(radiation[0]);
			}
			return true;
		}
		return false;
	},
	
	setRadiation: function(duration){
		this.playerRad = Math.max(this.playerRad, duration);
	},
	
	addRadiation: function(duration){
		this.playerRad = Math.max(this.playerRad + duration, 0);
	},
	
	registerHazmatArmor: function(id){
		this.hazmatArmor.push(id);
	},
	
	checkPlayerArmor: function(){
		for(let i = 0; i < 4; i++){
			let armorID = Player.getArmorSlot(i).id;
			if(this.hazmatArmor.indexOf(armorID) == -1) return true;
		}
		return false;
	},
	
	addEffect: function(ent, duration){
		if(ent == player){
			if(this.checkPlayerArmor()){
				Entity.addEffect(player, MobEffect.poison, 1, duration * 20);
				this.setRadiation(duration);
			}
		} else {
			Entity.addEffect(ent, MobEffect.poison, 1, duration * 20);
			if(Entity.getHealth(ent) == 1){
				Entity.damageEntity(ent, 1);
			}
		}
	},
	
	addEffectInRange: function(x, y, z, radius, duration){
		let entities = Entity.getAll();
		for(let i in entities){
			let ent = entities[i];
			if(canTakeDamage(ent, "radiation") && Entity.getHealth(ent) > 0){
				let c = Entity.getPosition(ent);
				let xx = Math.abs(x - c.x), yy = Math.abs(y - c.y), zz = Math.abs(z - c.z);
				if(Math.sqrt(xx*xx + yy*yy + zz*zz) <= radius){
					this.addEffect(ent, duration);
				}
			}
		}
	},
	
	addRadiationSource: function(x, y, z, radius, duration){
		this.sources[x+':'+y+':'+z] = {
			x: x,
			y: y,
			z: z,
			radius: radius,
			timer: duration
		}
	},
	
	tick: function(){
		if(World.getThreadTime()%20 == 0){
			let radiation = false;
			if(this.checkPlayerArmor()){
				for(let i = 9; i < 45; i++){
					let slot = Player.getInventorySlot(i);
					if(this.emitItemRadiation(slot.id)){
						radiation = true;
					}
				}
			}
			if(!radiation){
				this.addRadiation(-1);
			}
			let armor = Player.getArmorSlot(0);
			if(this.playerRad > 0 && !(armor.id == ItemID.quantumHelmet && ChargeItemRegistry.getEnergyStored(armor) >= 100000)){
				Entity.addEffect(player, MobEffect.poison, 1, this.playerRad * 20);
				if(Entity.getHealth(player) == 1){
					Entity.damageEntity(player, 1);
				}
			}
			for(let i in this.sources){
				let source = this.sources[i];
				this.addEffectInRange(source.x, source.y, source.z, source.radius, 10);
				source.timer--;
				if(source.timer <= 0){
					delete this.sources[i];
				}
			}
		}
	}
}

Saver.addSavesScope("radiation",
    function read(scope){
        RadiationAPI.playerRad = scope.duration || 0;
		RadiationAPI.sources = scope.sources || {};
    },
    function save(){
        return {
            duration: RadiationAPI.playerRad,
			sources: RadiationAPI.sources
        }
    }
);

Callback.addCallback("tick", function(){
	RadiationAPI.tick();
});

Callback.addCallback("EntityDeath", function(entity){
	if(entity == player){
		RadiationAPI.playerRad = 0;
	}
});




// file: core/sound_engine.js

let SoundAPI = {
	soundPlayers: [],
	soundsToRelease: [],
	maxPlayersCount: 28,
	
	getFilePath: function(name){
		return __dir__ + "res/sounds/" + name;
	},
	
	isSoundEnabled: function(){
		return Config.soundEnabled && isLevelDisplayed;
	},
	
	addSoundPlayer: function(name, loop, priorized){
		if(this.soundPlayers.length >= this.maxPlayersCount){
			Logger.Log(__name__ + " sound stack is full", "WARNING");
			return null;
		}
		let sound = new Sound(name, priorized);
		sound.setDataSource(this.getFilePath(name));
		sound.setLooping(loop || false);
		sound.prepare();
		this.soundPlayers.push(sound);
		return sound;
	},
	
	addMultiSoundPlayer: function(startingSound, startSound, finishingSound){
		if(this.soundPlayers.length >= this.maxPlayersCount){
			Logger.Log(__name__ + " sound stack is full", "WARNING");
			return;
		}
		let sound = new MultiSound(startingSound, startSound, finishingSound);
		this.soundPlayers.push(sound);
		return sound;
	},
	
	playSound: function(name, loop, disableMultiPlaying){
		if(!this.isSoundEnabled()) {return null;}
		let curSound = null;
		try{
		for(let i in this.soundPlayers){
			let sound = this.soundPlayers[i];
			if(sound.isPlaying()){
				if(sound.name == name && disableMultiPlaying){
					return sound;
				}
			}
			else if(sound.name == name) {
				sound.start();
				return sound;
			}
			else if(!sound.isPreparing && !sound.priorized){
				curSound = new Sound(name, false);
				curSound.setDataSource(this.getFilePath(name));
				curSound.setLooping(loop || false);
				curSound.prepare();
				sound = this.soundPlayers[i];
				if(!sound.isPreparing && !sound.isPlaying()){ // second check after preparing because of multi-threading
					this.soundPlayers[i] = curSound;
					this.soundsToRelease.push(sound);
				} else {
					this.soundPlayers.push(curSound);
				}
				break;
			}
		}
		if(!curSound){
			curSound = this.addSoundPlayer(name, loop, false);
		}
		curSound.start();
		//Game.message("sound "+ name +" started");
		}
		catch(err) {
			Logger.Log("sound "+ name +" start failed", "ERROR");
			Logger.Log(err, "ERROR");
		}
		return curSound;
	},
	
	playSoundAt: function(coord, name, loop, radius){
		if(loop && Entity.getDistanceBetweenCoords(coord, Player.getPosition()) > radius){
			return null;
		}
		let sound = this.playSound(name, loop);
		if(sound){
			sound.setSource(coord, radius);
		}
		return sound;
	},
	
	updateVolume: function(){
		for(let i in this.soundPlayers){
			let sound = this.soundPlayers[i];
			sound.setVolume(sound.volume);
		}
	},
	
	createSource: function(fileName, coord, radius){
		if(!this.isSoundEnabled()) {return null;}
		let curSound = null;
		try{
		for(let i in this.soundPlayers){
			let sound = this.soundPlayers[i];
			if(!sound.isPlaying() && !sound.isPreparing && !sound.priorized){
				curSound = new MultiSound(fileName[0], fileName[1], fileName[2]);
				sound = this.soundPlayers[i];
				if(!sound.isPreparing && !sound.isPlaying()){ // second check after preparing because of multi-threading
					this.soundPlayers[i] = curSound;
					this.soundsToRelease.push(sound);
				} else {
					this.soundPlayers.push(curSound);
				}
				break;
			}
		}
		if(!curSound){
			curSound = this.addMultiSoundPlayer(fileName[0], fileName[1], fileName[2]);
		}
		curSound.setSource(coord, radius);
		curSound.start();
		}
		catch(err) {
			Logger.Log("multi-sound ["+ fileName +"] start failed", "ERROR");
			Logger.Log(err, "ERROR");
		}
		return curSound;
	},
	
	updateSourceVolume: function(sound){
		let s = sound.source;
		let p = Player.getPosition();
		let volume = Math.max(0, 1 - Math.sqrt(Math.pow(p.x - s.x, 2) + Math.pow(p.y - s.y, 2) + Math.pow(p.z - s.z, 2))/s.radius);
		sound.setVolume(volume);
	},
	
	clearSounds: function(){
		for(let i = 0; i < this.soundPlayers.length; i++){
			let sound = this.soundPlayers[i];
			if(sound.isPlaying()){
				sound.stop();
			}
			if(!sound.priorized){
				sound.release();
				this.soundPlayers.splice(i--, 1);
			}
		}
	}
}

function Sound(name, priorized){
	this.name = name;
	this.media = new android.media.MediaPlayer();
	this.priorized = priorized || false;
	this.isPreparing = true;
	
	this.setDataSource = function(path){
		this.media.setDataSource(path);
	}
	
	this.setLooping = function(loop){
		this.media.setLooping(loop);
	}
	
	this.prepare = function(){
		this.media.prepare();
	}
	
	this.isPlaying = function(){
		return this.media.isPlaying();
	}
	
	this.isLooping = function(){
		return this.media.isLooping();
	}
	
	this.start = function(){
		this.media.start();
		this.isPreparing = false;
	}
	
	this.pause = function(){
		this.media.pause();
	}
	
	this.seekTo = function(ms){
		this.media.seekTo(ms);
	}
	
	this.stop = function(){
		this.media.pause();
		this.media.seekTo(0);
	}
	
	this.release = function(){
		this.media.release();
	}
	
	this.setVolume = function(volume){
		this.volume = volume;
		volume *= gameVolume;
		this.media.setVolume(volume, volume);
	}
	
	this.setVolume(1);
	
	this.setSource = function(coord, radius){
		this.source = {x: coord.x + 0.5, y: coord.y + 0.5, z: coord.z + 0.5, radius: radius, dimension: Player.getDimension()};
		SoundAPI.updateSourceVolume(this);
	}
}

function MultiSound(startingSound, startSound, finishingSound){
	this.parent = Sound;
	this.parent(startingSound || startSound, 0, true);
	
	this.startingSound = null;
	this.startSound = null;
	this.finishingSound = null;
	
	this.setDataSource(SoundAPI.getFilePath(startingSound || startSound));
	if(startingSound){
		this.startingSound = this.media;
		this.startSound = new android.media.MediaPlayer();
		this.startSound.setDataSource(SoundAPI.getFilePath(startSound));
		this.startSound.setLooping(true);
		let self = this;
		this.media.setOnCompletionListener(new android.media.MediaPlayer.OnCompletionListener({
			onCompletion: function(mp){
				self.playStartSound();
			}
		}));
		this.startSound.prepareAsync();
	} else {
		this.startSound = this.media;
		this.setLooping(true);
	}
	this.prepare();
	
	if(finishingSound){
		let media = new android.media.MediaPlayer();
		media.setDataSource(SoundAPI.getFilePath(finishingSound));
		media.prepareAsync();
		this.finishingSound = media;
	}
	
	this.playStartSound = function(){
		this.media = this.startSound;
		this.media.start();
	}
	
	this.playFinishingSound = function(){
		if(!this.isFinishing){
			this.media = this.finishingSound;
			this.media.start();
			this.isFinishing = true;
		}
	}
	
	this.release = function(){
		this.startSound.release();
		if(this.startingSound){
			this.startingSound.release();
		}
		if(this.finishingSound){
			this.finishingSound.release();
		}
	}
}

Callback.addCallback("tick", function(){
	for(let i in SoundAPI.soundsToRelease){
		SoundAPI.soundsToRelease[i].release();
	}
	SoundAPI.soundsToRelease = [];
	for(let i in SoundAPI.soundPlayers){
		let sound = SoundAPI.soundPlayers[i];
		if(sound.isPlaying() && sound.source){
			if(sound.source.dimension == Player.getDimension()){
				SoundAPI.updateSourceVolume(sound);
			} else {
				sound.stop();
			}
		}
	}
});

Callback.addCallback("LevelLeft", function(){
	SoundAPI.clearSounds();
});

Callback.addCallback("MinecraftActivityStopped", function() {
	SoundAPI.clearSounds();
});

/*Volume in the settings*/
/*From SoundAPI lib by WolfTeam*/
var settings_path = "/storage/emulated/0/games/com.mojang/minecraftpe/options.txt";
var gameVolume = FileTools.ReadKeyValueFile(settings_path)["audio_sound"];
var prevScreen = false;
Callback.addCallback("NativeGuiChanged", function (screen) {
    var currentScreen = screen.startsWith("screen_world_controls_and_settings") || screen.startsWith("screen_controls_and_settings");
    if(prevScreen && !currentScreen){
        gameVolume = FileTools.ReadKeyValueFile(settings_path)["audio_sound"];
		SoundAPI.updateVolume();
    }
    prevScreen = currentScreen;
});




// file: core/item_name.js

ItemName = {
	itemRarity: {},
	
	setRarity: function(id, lvl, regFunc){
		this.itemRarity[id] = lvl;
		if(regFunc){
			Item.registerNameOverrideFunction(id, function(item, name){
				return ItemName.getRarityCode(lvl) + name;
			});
		}
	},
	
	getRarity: function(id){
		return this.itemRarity[id] || 0;
	},
	
	getRarityCode: function(lvl){
		if(lvl == 1) return "§e";
		if(lvl == 2) return "§b";
		if(lvl == 3) return "§d";
		return "";
	},
	
	addTierTooltip: function(id, tier){
		Item.registerNameOverrideFunction(BlockID[id], function(item, name){
			return name + "\n§7" + Translation.translate("Power Tier: ") + tier;
		});
	},
	
	addStorageBlockTooltip: function(id, tier, capacity){
		Item.registerNameOverrideFunction(BlockID[id], function(item, name){
			return ItemName.showBlockStorage(item, name, tier, capacity);
		});
	},
	
	addStoredLiquidTooltip: function(id){
		Item.registerNameOverrideFunction(id, function(item, name){
			return name += "\n§7Stored: " + (1000 - item.data) + " mB";
		});
	},
	
	showBlockStorage: function(item, name, tier, capacity){
		var tierText = "§7" + Translation.translate("Power Tier: ") + tier;
		
		var energy = 0;
		if(item.extra){
			energy = item.extra.getInt("energy");
		}
		var energyText = this.displayEnergy(energy) + "/" + capacity + " EU";
		
		return name + "\n" + tierText + "\n" +energyText;
	},
	
	getTooltip: function(name, tooltip){
		return "\n" + tooltip;
	},
	
	getItemStorageText: function(item){
		var capacity = ChargeItemRegistry.getMaxCharge(item.id);
		var energy = ChargeItemRegistry.getEnergyStored(item);
		return "§7" + this.displayEnergy(energy) + "/" + this.displayEnergy(capacity) + " EU";
	},
	
	showItemStorage: function(item, name){
		var rarity = ItemName.getRarity(item.id);
		if(rarity > 0){
			name = ItemName.getRarityCode(rarity) + name;
		}
		return name + '\n' + ItemName.getItemStorageText(item);
	},
	
	displayEnergy: function(energy){
		if(!Config.debugMode){
			if(energy >= 1e6){
				return Math.floor(energy / 1e5) / 10 + "M";
			}
			if(energy >= 1000){
				return Math.floor(energy / 100) / 10 + "K";
			}
		}
		return energy;
	},
	
	getSideName: function(side){
		var sideNames = {
			en: [
				"first valid",
				"bottom",
				"top",
				"north",
				"south",
				"east",
				"west"
			],
			ru: [
				"первой подходящей",
				"нижней",
				"верхней",
				"северной",
				"южной",
				"восточной",
				"западной"
			],
			zh: [
				"初次生效",
				"底部",
				"顶部",
				"北边",
				"南边",
				"东边",
				"西边"
			],
			es: [
				"Primera vez efectivo",
				"abajo",
				"arriba",
				"norte",
				"sur",
				"este",
				"oeste"
			],
			pt: [
				"Primeira vez eficaz",
				"o lado de baixo",
				"o lado de cima",
				"o norte",
				"o sul",
				"o leste",
				"o oeste"
			]
		}
		if(sideNames[Config.language]){
			return sideNames[Config.language][side+1];
		} else {
			return sideNames["en"][side+1];
		}
	}
}




// file: core/ui_buttons.js

var currentUIscreen;
Callback.addCallback("NativeGuiChanged", function(screenName){
	currentUIscreen = screenName;
	if(screenName != "in_game_play_screen"){
		if(UIbuttons.container){
			UIbuttons.container.close();
			UIbuttons.container = null;
		}
	}
});

var button_scale = __config__.access("button_scale");
var UIbuttons = {
	data: {},
	onSwitch: {},
	onUpdate: {},
	isEnabled: false,
	container: null,
	Window: new UI.Window({
		location: {
			x: 1000 - button_scale,
			y: UI.getScreenHeight()/2 - button_scale*2,
			width: button_scale,
			height: button_scale*5
		},
		drawing: [{type: "background", color: 0}],
		elements: {}
	}),
	
	setArmorButton: function(id, name){
		var data = {type: 0, name: name};
		if(!this.data[id]){
			this.data[id] = [data]
		} else {
			this.data[id].push(data);
		}
	},
	
	setToolButton: function(id, name, notHidden){
		var data = {type: 1, name: name, hidden: !notHidden};
		if(!this.data[id]){
			this.data[id] = [data]
		} else {
			this.data[id].push(data);
		}
	},
	
	getButtons: function(id){
		return this.data[id];
	},
	
	registerButton: function(name, properties){
		buttonContent[name] = properties;
		buttonMap[name] = false;
	},
	
	registerSwitchFunction: function(id, func){
		this.onSwitch[id] = func;
	},
	
	onButtonUpdate: function(name, func){
		this.onUpdate[name] = func;
	}
}

var buttonMap = {
	button_nightvision: false,
	button_fly: false,
	button_hover: false,
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
				var armor = Player.getArmorSlot(0);
				var extra = armor.extra;
				if(extra){
					var nightvision = extra.getBoolean("nv");
				}
				else{
					var nightvision = false;
					extra = new ItemExtraData();
				}
				if(nightvision){
					extra.putBoolean("nv", false);
					Game.message("§4" + Translation.translate("Nightvision mode disabled"));
				}
				else{
					extra.putBoolean("nv", true);
					Game.message("§2" + Translation.translate("Nightvision mode enabled"));
				}
				Player.setArmorSlot(0, armor.id, 1, armor.data, extra);
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
	button_hover: {
		y: 2000,
		type: "button",
		bitmap: "button_hover_off",
		scale: 50,
		clicker: {
			onClick: function(){
				var vel = Player.getVelocity();
				var armor = Player.getArmorSlot(1);
				if(vel.y.toFixed(4) != fallVelocity && ChargeItemRegistry.getEnergyStored(armor) >= 8){
					var extra = armor.extra || new ItemExtraData();
					var hover = extra.getBoolean("hover");
					if(hover){
						extra.putBoolean("hover", false);
						Game.message("§4" + Translation.translate("Hover mode disabled"));
					}
					else{
						extra.putBoolean("hover", true);
						Game.message("§2" + Translation.translate("Hover mode enabled"));
					}
					Player.setArmorSlot(1, armor.id, 1, armor.data, extra);
				}
			}
		}
	},
	button_jump: {
		y: 3000,
		type: "button",
		bitmap: "button_jump_on",
		bitmap2: "button_jump_off",
		scale: 50,
		clicker: {
			onClick: function(){
				var armor = Player.getArmorSlot(3);
				var energyStored = ChargeItemRegistry.getEnergyStored(armor);
				if(energyStored >= 1000 && Player.getVelocity().y.toFixed(4) == fallVelocity){
					Player.addVelocity(0, 1.4, 0);
					ChargeItemRegistry.setEnergyStored(armor, energyStored - 1000);
					Player.setArmorSlot(3, armor.id, 1, armor.data, armor.extra);
				}
			}
		}
	},
	button_switch: {
		y: 4000,
		type: "button",
		bitmap: "button_switch",
		bitmap2: "button_switch_touched",
		scale: 25,
		clicker: {
			onClick: function(){
				var item = Player.getCarriedItem();
				if(UIbuttons.onSwitch[item.id]){
					UIbuttons.onSwitch[item.id](item);
				}
			}
		}
	}
}

UIbuttons.Window.setAsGameOverlay(true);

UIbuttons.onButtonUpdate("button_hover", function(element){
	var armor = Player.getArmorSlot(1);
	var extra = armor.extra;
	if(extra && extra.getBoolean("hover")){
		element.bitmap = "button_hover_on";
	} else {
		element.bitmap = "button_hover_off";
	}
});

function updateUIbuttons(){
	var elements = UIbuttons.Window.content.elements;
	for(var name in buttonMap){
		if(buttonMap[name]){
			if(!elements[name]){
				elements[name] = buttonContent[name];
			}
			var element = elements[name];
			var func = UIbuttons.onUpdate[name];
			if(func) func(element);
			element.x = 0;
			buttonMap[name] = false;
		}
		else{
			elements[name] = null;
		}
	}
}

let jetpackLoop = SoundAPI.addSoundPlayer("Tools/JetpackLoop.ogg", true, 1);
Callback.addCallback("tick", function(){
	var armor = [Player.getArmorSlot(0), Player.getArmorSlot(1), Player.getArmorSlot(2), Player.getArmorSlot(3)];
	for(var i in armor){
		var buttons = UIbuttons.getButtons(armor[i].id);
		for(var i in buttons){
			var button = buttons[i];
			if(button.type == 0){
				buttonMap[button.name] = true;
				UIbuttons.isEnabled = true;
			}
		}
	}
	var item = Player.getCarriedItem();
	var buttons = UIbuttons.getButtons(item.id);
	for(var i in buttons){
		var button = buttons[i];
		if(button.type == 1 && (!button.hidden || Entity.getSneaking(Player.get()))){
			buttonMap[button.name] = true;
			UIbuttons.isEnabled = true;
		}
	}
	if(UIbuttons.isEnabled && (currentUIscreen == "hud_screen" || currentUIscreen == "in_game_play_screen")){
		updateUIbuttons();
		if(!UIbuttons.container){
			UIbuttons.container = new UI.Container();
			UIbuttons.container.openAs(UIbuttons.Window);
		}
		var playSound = false;
		var armor = armor[1];
		var hover = armor.extra? armor.extra.getBoolean("hover") : false;
		var energyStored = ChargeItemRegistry.getEnergyStored(armor);
		if(energyStored >= 8 && UIbuttons.container.isElementTouched("button_fly")){
			var y = Player.getPosition().y;
			if(y < 256){
				var vel = Player.getVelocity();
				var vy = Math.min(32, 264-y) / 160;
				if(hover){
					ChargeItemRegistry.setEnergyStored(armor, energyStored - 2);
					Player.setArmorSlot(1, armor.id, 1, armor.data, armor.extra);
					if(vel.y < 0.2){
						Player.addVelocity(0, Math.min(vy, 0.2-vel.y), 0);
					}
				}
				else {
					ChargeItemRegistry.setEnergyStored(armor, energyStored - 8);
					Player.setArmorSlot(1, armor.id, 1, armor.data, armor.extra);
					if(vel.y < 0.67){
						Player.addVelocity(0, Math.min(vy, 0.67-vel.y), 0);
					}
				}
			}
			playSound = true;
		} else if(hover){
			playSound = true;
		}
		if(playSound && SoundAPI.isSoundEnabled() && !jetpackLoop.isPlaying()){
			if(hover){
				jetpackLoop.setVolume(0.8);
			} else {
				jetpackLoop.setVolume(1);
			}
			jetpackLoop.start();
		}
		if(!playSound && jetpackLoop.isPlaying()){
			jetpackLoop.stop();
		}
	}
	else if(UIbuttons.container){
		UIbuttons.container.close();
		UIbuttons.container = null;
	}
	UIbuttons.isEnabled = false;
});




// file: core/integration.js

var IntegrationAPI = {
	addToRecyclerBlacklist: function(id){
		recyclerBlacklist.push(id);
	},
	addToolBooxValidItem: function(id){
		toolbox_items.push(id);
	}
}




// file: core/harvestAPI.js

var AgricultureAPI = {
    cropCards:[],
    abstractFunctions:{/* file: baseCropClasses.js */},
    nutrientBiomeBonusValue:{/* file: biome_bonuses.js */},
    registerCropCard: function(card){
        if(!card.texture) card.texture = card.id;
        if(card.base){
            var funcs = AgricultureAPI.abstractFunctions[card.base];
            if(funcs) this.addMissingFuncsToCard(card, funcs);
        }

        this.addMissingFuncsToCard(card, AgricultureAPI.abstractFunctions["IC2CropCard"]);
        this.cropCards.push(card);

        if(card.baseSeed.addToCreative != false){
            let extra = this.getDefaultExtra(this.cropCards.length - 1);
            Item.addToCreative(ItemID.cropSeedBag, 1, this.cropCards.length - 1, extra);
		}
    },
    addMissingFuncsToCard: function(card, functions){
        for(var funcName in functions){
            if(!card[funcName]){
                card[funcName] = functions[funcName];
            }
        }
    },
    getCropCard: function(id){
        for(var i in this.cropCards){
            if(this.cropCards[i].id == id)
				return this.cropCards[i];
        }
		return null;
    },
    getCardIndexFromID: function(id){
        for(var i in this.cropCards){
            if(this.cropCards[i].id == id) return i;
        }
		return null;
    },
    getHumidityBiomeBonus: function(x, z){
        return 0;
    },
    getNutrientBiomeBonus: function(x, z){
        var biomeID = World.getBiome(x, z);
        var bonus = AgricultureAPI.nutrientBiomeBonusValue[biomeID];
        return bonus || 0;
    },
    getCardFromSeed: function(item){
        for(var i in this.cropCards){
            var seed = this.cropCards[i].baseSeed;
            if(seed && eval(seed.id) == item.id && (!seed.data || seed.data == item.data)){
				return this.cropCards[i];
            }
        }
        return null;
    },
    generateExtraFromValues: function(data){
        var extra = new ItemExtraData();
        extra.putInt("growth", data.statGrowth);
        extra.putInt("gain", data.statGain);
        extra.putInt("resistance", data.statResistance);
        extra.putInt("scan", data.scanLevel);
        return extra;
    },
    getDefaultExtra: function(cardIndex){
        var extra = new ItemExtraData();
        var card = AgricultureAPI.cropCards[cardIndex];
        extra.putInt("growth", card.baseSeed.growth);
        extra.putInt("gain", card.baseSeed.gain);
        extra.putInt("resistance", card.baseSeed.resistance);
        extra.putInt("scan", 4);
        return extra;
    }
};




// file: block/rubber_tree/sapling.js

var DIRT_TILES = {
	2: true,
	3: true,
	60: true
};

IDRegistry.genItemID("rubberSapling");
Item.createItem("rubberSapling", "Rubber Tree Sapling", {name: "rubber_tree_sapling", data: 0});

Item.registerUseFunction("rubberSapling", function(coords, item, block){
	var place = coords.relative;
	var tile1 = World.getBlock(place.x, place.y, place.z);
	var tile2 = World.getBlock(place.x, place.y - 1, place.z);
	
	if (World.canTileBeReplaced(tile1.id, tile1.data) && DIRT_TILES[tile2.id]) {
		World.setBlock(place.x, place.y, place.z, BlockID.rubberTreeSapling);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
	}
});

IDRegistry.genBlockID("rubberTreeSapling");
Block.createBlock("rubberTreeSapling", [
	{name: "Rubber Tree Sapling", texture: [["rubber_tree_sapling", 0]], inCreative: false}
], {rendertype: 1});
Block.setDestroyTime(BlockID.rubberTreeSapling, 0);
ToolAPI.registerBlockMaterial(BlockID.rubberTreeSapling, "plant");
Block.setShape(BlockID.rubberTreeSapling, 1/8, 0, 1/8, 7/8, 1, 7/8);
TileRenderer.setEmptyCollisionShape(BlockID.rubberTreeSapling);
Block.registerDropFunction("rubberTreeSapling", function(){
	return [[ItemID.rubberSapling, 1, 0]];
});

Block.setRandomTickCallback(BlockID.rubberTreeSapling, function(x, y, z){
	if(!DIRT_TILES[World.getBlockID(x, y-1, z)]){
		World.destroyBlock(x, y, z, true);
	}
	else if(Math.random() < 0.05 && World.getLightLevel(x, y, z) >= 9){
		RubberTreeGenerationHelper.generateRubberTree(x, y, z);
	}
});

// bone use
Callback.addCallback("ItemUse", function(coords, item, block){
	if(item.id == 351 && item.data == 15 && block.id == BlockID.rubberTreeSapling){
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		for(var i = 0; i < 16; i++){
			var px = coords.x + Math.random();
			var pz = coords.z + Math.random();
			var py = coords.y + Math.random();
			Particles.addFarParticle(ParticleType.happyVillager, px, py, pz, 0, 0, 0);
		}
		if(Math.random() < 0.25){
			RubberTreeGenerationHelper.generateRubberTree(coords.x, coords.y, coords.z);
		}
	}
});

Callback.addCallback("DestroyBlock", function(coords, block, player){
	if(World.getBlockID(coords.x, coords.y+1, coords.z) == BlockID.rubberTreeSapling){
		World.destroyBlock(coords.x, coords.y+1, coords.z, true);
	}
});




// file: block/rubber_tree/log.js

Block.createSpecialType({
	base: 17,
	solid: true,
	destroytime: 2,
	explosionres: 10,
	lightopacity: 15,
	renderlayer: 2,
	translucency: 0
}, "log");

IDRegistry.genBlockID("rubberTreeLog");
Block.createBlock("rubberTreeLog", [
	{name: "Rubber Tree Log", texture: [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]], inCreative: true}
], "log");
Block.registerDropFunction("rubberTreeLog", function(coords, blockID){
	return [[blockID, 1, 0]];
});
ToolLib.addBlockDropOnExplosion("rubberTreeLog");
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLog, "wood");

IDRegistry.genBlockID("rubberTreeLogLatex");
Block.createBlockWithRotation("rubberTreeLogLatex", [
	{name: "tile.rubberTreeLog.name", texture: [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood_with_latex", 0], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]], inCreative: false},
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood_with_latex", 1], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]], inCreative: false},
], "log");
Block.registerDropFunction("rubberTreeLogLatex", function(coords, blockID){
	return [[BlockID.rubberTreeLog, 1, 0], [ItemID.latex, 1, 0]];
});
ToolLib.addBlockDropOnExplosion("rubberTreeLogLatex");
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLogLatex, "wood");
Block.setRandomTickCallback(BlockID.rubberTreeLogLatex, function(x, y, z, id, data){
	if(data < 4 && Math.random() < 1/7){
		World.setBlock(x, y, z, id, data + 4);
	}
});

Recipes.addFurnace(BlockID.rubberTreeLog, 17, 3);
Recipes.addShapeless({id: 5, count: 3, data: 3}, [{id: BlockID.rubberTreeLog, data: -1}]);




// file: block/rubber_tree/leaves.js

IDRegistry.genBlockID("rubberTreeLeaves");
Block.createBlock("rubberTreeLeaves", [
	{name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: false},
	{name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: false},
	{name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: true}
], {
	destroytime: 0.2,
	explosionres: 1,
	renderallfaces: true, 
	renderlayer: 1,
	lightopacity: 1,
	translucency: 0.5
});

Block.registerDropFunction("rubberTreeLeaves", function(coords, blockID, blockData, level, enchant){
	if(level > 0 || Player.getCarriedItem().id == 359){
		return [[blockID, 1, 2]];
	}
	if(Math.random() < .04){
		return [[ItemID.rubberSapling, 1, 0]]
	}
	return [];
});

ToolAPI.registerBlockMaterial(BlockID.rubberTreeLeaves, "plant");

function checkLeaves(x, y, z, explored){
	let blockID = World.getBlockID(x, y, z);
	if(blockID == BlockID.rubberTreeLog || blockID == BlockID.rubberTreeLogLatex){
		return true;
	}
	if(blockID == BlockID.rubberTreeLeaves){
		explored[x+':'+y+':'+z] = true;
	}
	return false;
}

function checkLeavesFor6Sides(x, y, z, explored){
	return checkLeaves(x-1, y, z, explored) ||
	checkLeaves(x+1, y, z, explored) ||
	checkLeaves(x, y, z-1, explored) ||
	checkLeaves(x, y, z+1, explored) ||
	checkLeaves(x, y-1, z, explored) ||
	checkLeaves(x, y+1, z, explored);
}

function updateLeaves(x, y, z){
	for(let xx = x - 1; xx <= x + 1; xx++){
		for(let yy = y - 1; yy <= y + 1; yy++){
			for(let zz = z - 1; zz <= z + 1; zz++){
				let block = World.getBlock(xx, yy, zz);
				if(block.id == BlockID.rubberTreeLeaves && block.data == 0){
					World.setBlock(xx, yy, zz, BlockID.rubberTreeLeaves, 1);
				}
			}
		}
	}
}

Block.setRandomTickCallback(BlockID.rubberTreeLeaves, function(x, y, z, id, data){
	if(data == 1){
		let explored = {};
		explored[x+':'+y+':'+z] = true;
		for(let i = 0; i < 4; i++){
			let checkingLeaves = explored;
			explored = {};
			for(let coords in checkingLeaves){
				let c = coords.split(':');
				if(checkLeavesFor6Sides(parseInt(c[0]), parseInt(c[1]), parseInt(c[2]), explored)){
					World.setBlock(x, y, z, BlockID.rubberTreeLeaves, 0);
					return;
				}
			}
		}
		World.setBlock(x, y, z, 0);
		updateLeaves(x, y, z);
		let dropFunc = Block.dropFunctions[id];
		let drop = dropFunc(null, id, data, 0, {});
		for(let i in drop){
			World.drop(x, y, z, drop[i][0], drop[i][1], drop[i][2]);
		}
	}
});

Callback.addCallback("DestroyBlock", function(coords, block, player){
	updateLeaves(coords.x, coords.y, coords.z);
});




// file: block/rubber_tree/generation.js

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
		
		var height = this.getHeight(x, y, z, random(params.height.min, params.height.max) + 2);
		if(height >= 5){
			height -= 2;
			var k = 0.25;
			for(var ys = 0; ys < height; ys++){
				if(log.resin && Math.random() < k){
					World.setBlock(x, y + ys, z, log.resin, parseInt(Math.random()*4) + 4);
					k -= 0.1;
				}
				else{
					World.setFullBlock(x, y + ys, z, log);
				}
			}
			
			var leavesStart = parseInt(height / 2);
			var leavesEnd = height;
			var leavesHeight = height - leavesStart;
			for(var ys = leavesStart; ys <= leavesEnd; ys++){
				for(var xs = -params.radius; xs <= params.radius; xs++){
					for(var zs = -params.radius; zs <= params.radius; zs++){
						var d = Math.sqrt(xs*xs + zs*zs);
						var radius = params.radius + 0.5 + Math.random() * Math.abs(leavesEnd - ys + 1) / leavesHeight;
						if(ys == leavesEnd) radius /= 2;
						if(d <= radius){
							this.setLeaves(x + xs, y + ys, z + zs, leaves);
						}
					}
				}
			}
			
			if(params.pike){
				for(var ys = 1; ys <= params.pike; ys++){
					this.setLeaves(x, y + ys + height, z, leaves);
				}
			}
		}
	},
	
	getHeight: function(x, y, z, max){
		var height = 0;
		while(height < max){
			var blockID = World.getBlockID(x, y + height, z);
			if(blockID != 0 && ToolAPI.getBlockMaterialName(blockID) != "plant"){
				break;
			}
			height++;
		}
		return height;
	},
	
	setLeaves: function(x, y, z, leaves){
		var blockID = World.getBlockID(x, y, z);
		if(blockID==0 || blockID==106){
			World.setFullBlock(x, y, z, leaves);
		}
	},

	generateRubberTree: function(x, y, z){
		this.generateCustomTree(x, y, z, {
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
				min: 3,
				max: 8,
			},
			pike: 2 + parseInt(Math.random() * 1.5),
			radius: 2
		});
	}
}


var ForestBiomeIDs = [4, 18, 27, 28];
var JungleBiomeIDs = [21, 22, 23, 149, 151];
var SwampBiomeIDs = [6, 134];

var RUBBER_TREE_BIOME_DATA = {
	1: __config__.getNumber("rubber_tree_gen.plains")/100
}
var chance = __config__.getNumber("rubber_tree_gen.forest")/100;
if(chance){
	for(var id in ForestBiomeIDs){
	RUBBER_TREE_BIOME_DATA[ForestBiomeIDs[id]] = chance;}
}
chance = __config__.getNumber("rubber_tree_gen.jungle")/100;
if(chance){
	for(var id in JungleBiomeIDs){
	RUBBER_TREE_BIOME_DATA[JungleBiomeIDs[id]] = chance;}
}
chance = __config__.getNumber("rubber_tree_gen.swamp")/100;
if(chance){
	for(var id in SwampBiomeIDs){
	RUBBER_TREE_BIOME_DATA[SwampBiomeIDs[id]] = chance;}
}

Callback.addCallback("GenerateChunk", function(chunkX, chunkZ){
	if(Math.random() < RUBBER_TREE_BIOME_DATA[World.getBiome((chunkX + 0.5) * 16, (chunkZ + 0.5) * 16)]){
		for(var i = 0; i < 1 + Math.random() * 5; i++){
			var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 64, 128);
			coords = GenerationUtils.findSurface(coords.x, coords.y, coords.z);
			if(World.getBlockID(coords.x, coords.y, coords.z) == 2){
				coords.y++;
				RubberTreeGenerationHelper.generateRubberTree(coords.x, coords.y, coords.z);
			}
		}
	}
});




// file: block/ore.js

Block.createSpecialType({
	base: 1,
	solid: true,
	destroytime: 3,
	explosionres: 15,
	lightopacity: 15,
	renderlayer: 2,
	translucency: 0
}, "ore");

IDRegistry.genBlockID("oreCopper");
Block.createBlock("oreCopper", [
	{name: "Copper Ore", texture: [["ore_copper", 0]], inCreative: true}
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreCopper, "stone", 2, true);
Block.setDestroyLevel("oreCopper", 2);
ToolLib.addBlockDropOnExplosion("oreCopper");

IDRegistry.genBlockID("oreTin");
Block.createBlock("oreTin", [
	{name: "Tin Ore", texture: [["ore_tin", 0]], inCreative: true}
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreTin, "stone", 2, true);
Block.setDestroyLevel("oreTin", 2);
ToolLib.addBlockDropOnExplosion("oreTin");

IDRegistry.genBlockID("oreLead");
Block.createBlock("oreLead", [
	{name: "Lead Ore", texture: [["ore_lead", 0]], inCreative: true}
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreLead, "stone", 2, true);
Block.setDestroyLevel("oreLead", 2);
ToolLib.addBlockDropOnExplosion("oreLead");

IDRegistry.genBlockID("oreUranium");
Block.createBlock("oreUranium", [
	{name: "Uranium Ore", texture: [["ore_uranium", 0]], inCreative: true}
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreUranium, "stone", 3, true);
Block.setDestroyLevel("oreUranium", 3);
ToolLib.addBlockDropOnExplosion("oreUranium");

IDRegistry.genBlockID("oreIridium");
Block.createBlock("oreIridium", [
	{name: "Iridium Ore", texture: [["ore_iridium", 0]], inCreative: true}
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreIridium, "stone", 4, true);
Block.registerDropFunction("oreIridium", function(coords, blockID, blockData, level, enchant){
	if(level > 3){
		if(enchant.silk){
			return [[blockID, 1, 0]];
		}
		var drop = [[ItemID.iridiumChunk, 1, 0]];
		if(Math.random() < enchant.fortune/6) drop.push(drop[0]);
		ToolAPI.dropOreExp(coords, 12, 28, enchant.experience);
		return drop;
	}
	return [];
}, 4);
ToolLib.addBlockDropOnExplosion("oreIridium");

Item.addCreativeGroup("ores", Translation.translate("Ores"), [
	BlockID.oreCopper,
	BlockID.oreTin,
	BlockID.oreLead,
	BlockID.oreUranium,
	BlockID.oreIridium
]);

var OreGenerator = {
	copper: {
		enabled: __config__.getBool("copper_ore.enabled"),
		count: __config__.getNumber("copper_ore.count"),
		size: __config__.getNumber("copper_ore.size"),
		minHeight: __config__.getNumber("copper_ore.minHeight"),
		maxHeight: __config__.getNumber("copper_ore.maxHeight")
	},
	tin: {
		enabled: __config__.getBool("tin_ore.enabled"),
		count: __config__.getNumber("tin_ore.count"),
		size: __config__.getNumber("tin_ore.size"),
		minHeight: __config__.getNumber("tin_ore.minHeight"),
		maxHeight: __config__.getNumber("tin_ore.maxHeight")
	},
	lead: {
		enabled: __config__.getBool("lead_ore.enabled"),
		count: __config__.getNumber("lead_ore.count"),
		size: __config__.getNumber("lead_ore.size"),
		minHeight: __config__.getNumber("lead_ore.minHeight"),
		maxHeight: __config__.getNumber("lead_ore.maxHeight")
	},
	uranium: {
		enabled: __config__.getBool("uranium_ore.enabled"),
		count: __config__.getNumber("uranium_ore.count"),
		size: __config__.getNumber("uranium_ore.size"),
		minHeight: __config__.getNumber("uranium_ore.minHeight"),
		maxHeight: __config__.getNumber("uranium_ore.maxHeight")
	},
	iridium: {
		chance: __config__.getNumber("iridium_ore.chance"),
		minHeight: __config__.getNumber("iridium_ore.minHeight"),
		maxHeight: __config__.getNumber("iridium_ore.maxHeight")
	},
	
	addFlag: function(name, flag, disableOre){
		if(this[name].enabled){
			var flag = !Flags.addFlag(flag)
			if(disableOre) this[name].enabled = flag;
		}
	}
}

OreGenerator.addFlag("copper", "oreGenCopper");
OreGenerator.addFlag("tin", "oreGenTin");
OreGenerator.addFlag("lead", "oreGenLead", true);
OreGenerator.addFlag("uranium", "oreGenUranium", true);

Callback.addCallback("PostLoaded", function(){
	if(OreGenerator.copper.enabled){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < OreGenerator.copper.count; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, OreGenerator.copper.minHeight, OreGenerator.copper.maxHeight);
				GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreCopper, 0, OreGenerator.copper.size);
			}
		});
	}
	if(OreGenerator.tin.enabled){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < OreGenerator.tin.count; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, OreGenerator.tin.minHeight, OreGenerator.tin.maxHeight);
				GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreTin, 0, OreGenerator.tin.size);
			}
		});
	}
	if(OreGenerator.lead.enabled){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < OreGenerator.lead.count; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, OreGenerator.lead.minHeight, OreGenerator.lead.maxHeight);
				GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreLead, 0, OreGenerator.lead.size);
			}
		});
	}
	if(OreGenerator.uranium.enabled){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < OreGenerator.uranium.count; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, OreGenerator.uranium.minHeight, OreGenerator.uranium.maxHeight);
				GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreUranium, 0, OreGenerator.uranium.size);
			}
		});
	}
	if(OreGenerator.iridium.chance > 0){
		Callback.addCallback("GenerateChunk", function(chunkX, chunkZ){
			if(Math.random() < OreGenerator.iridium.chance){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, OreGenerator.iridium.minHeight, OreGenerator.iridium.maxHeight);
				if(World.getBlockID(coords.x, coords.y, coords.z) == 1){
				World.setBlock(coords.x, coords.y, coords.z, BlockID.oreIridium);}
			}
		});
	}
});




// file: block/metal.js

Block.createSpecialType({
	base: 1,
	solid: true,
	destroytime: 5,
	explosionres: 30,
	lightopacity: 15,
	renderlayer: 2
}, "stone");

IDRegistry.genBlockID("blockCopper");
Block.createBlock("blockCopper", [
	{name: "Copper Block", texture: [["block_copper", 0]], inCreative: true}
], "stone");
ToolAPI.registerBlockMaterial(BlockID.blockCopper, "stone", 2, true);
Block.setDestroyLevel("blockCopper", 2);
ToolLib.addBlockDropOnExplosion("blockCopper");

IDRegistry.genBlockID("blockTin");
Block.createBlock("blockTin", [
	{name: "Tin Block", texture: [["block_tin", 0]], inCreative: true}
], "stone");
ToolAPI.registerBlockMaterial(BlockID.blockTin, "stone", 2, true);
Block.setDestroyLevel("blockTin", 2);
ToolLib.addBlockDropOnExplosion("blockTin");

IDRegistry.genBlockID("blockBronze");
Block.createBlock("blockBronze", [
	{name: "Bronze Block", texture: [["block_bronze", 0]], inCreative: true}
], "stone");
ToolAPI.registerBlockMaterial(BlockID.blockBronze, "stone", 2, true);
Block.setDestroyLevel("blockBronze", 2);
ToolLib.addBlockDropOnExplosion("blockBronze");

IDRegistry.genBlockID("blockLead");
Block.createBlock("blockLead", [
	{name: "Lead Block", texture: [["block_lead", 0]], inCreative: true}
], "stone");
ToolAPI.registerBlockMaterial(BlockID.blockLead, "stone", 2, true);
Block.setDestroyLevel("blockLead", 2);
ToolLib.addBlockDropOnExplosion("blockLead");

IDRegistry.genBlockID("blockSteel");
Block.createBlock("blockSteel", [
	{name: "Steel Block", texture: [["block_steel", 0]], inCreative: true}
], "stone");
ToolAPI.registerBlockMaterial(BlockID.blockSteel, "stone", 2, true);
Block.setDestroyLevel("blockSteel", 2);
ToolLib.addBlockDropOnExplosion("blockSteel");

IDRegistry.genBlockID("blockSilver");
Block.createBlock("blockSilver", [
	{name: "Silver Block", texture: [["block_silver", 0]], inCreative: true}
], "stone");
ToolAPI.registerBlockMaterial(BlockID.blockSilver, "stone", 3, true);
Block.setDestroyLevel("blockSilver", 3);
ToolLib.addBlockDropOnExplosion("blockSilver");

IDRegistry.genBlockID("blockUranium");
Block.createBlock("blockUranium", [
	{name: "Uranium Block", texture: [["block_uranium", 0], ["block_uranium", 0], ["block_uranium", 1]], inCreative: true}
], "stone");
ToolAPI.registerBlockMaterial(BlockID.blockUranium, "stone", 3, true);
Block.setDestroyLevel("blockUranium", 3);
ToolLib.addBlockDropOnExplosion("blockUranium");

Item.addCreativeGroup("blockMetal", Translation.translate("Metal Blocks"), [
	BlockID.blockCopper,
	BlockID.blockTin,
	BlockID.blockBronze,
	BlockID.blockLead,
	BlockID.blockSteel,
	BlockID.blockSilver,
	BlockID.blockUranium
]);

Callback.addCallback("PreLoaded", function(){
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
	
	Recipes.addShaped({id: BlockID.blockUranium, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.uranium238, 0]);
	
	Recipes.addShapeless({id: ItemID.ingotCopper, count: 9, data: 0}, [{id: BlockID.blockCopper, data: 0}]);
	Recipes.addShapeless({id: ItemID.ingotTin, count: 9, data: 0}, [{id: BlockID.blockTin, data: 0}]);
	Recipes.addShapeless({id: ItemID.ingotBronze, count: 9, data: 0}, [{id: BlockID.blockBronze, data: 0}]);
	Recipes.addShapeless({id: ItemID.ingotLead, count: 9, data: 0}, [{id: BlockID.blockLead, data: 0}]);
	Recipes.addShapeless({id: ItemID.ingotSteel, count: 9, data: 0}, [{id: BlockID.blockSteel, data: 0}]);
	Recipes.addShapeless({id: ItemID.ingotSilver, count: 9, data: 0}, [{id: BlockID.blockSilver, data: 0}]);
	Recipes.addShapeless({id: ItemID.uranium238, count: 9, data: 0}, [{id: BlockID.blockUranium, data: 0}]);
});




// file: block/basic.js

Block.createSpecialType({
	base: 1,
	solid: true,
	destroytime: 5,
	explosionres: 30,
	lightopacity: 15,
	renderlayer: 2
}, "machine");

IDRegistry.genBlockID("machineBlockBasic");
Block.createBlock("machineBlockBasic", [
	{name: "Machine Block", texture: [["machine_top", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.machineBlockBasic, "stone", 1, true);
Block.setDestroyLevel("machineBlockBasic", 1);
ToolLib.addBlockDropOnExplosion("machineBlockBasic");

IDRegistry.genBlockID("machineBlockAdvanced");
Block.createBlock("machineBlockAdvanced", [
	{name: "Advanced Machine Block", texture: [["machine_advanced", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.machineBlockAdvanced, "stone", 1, true);
Block.setDestroyLevel("machineBlockAdvanced", 1);
ToolLib.addBlockDropOnExplosion("machineBlockAdvanced");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.machineBlockBasic, count: 1, data: 0}, [
		"xxx",
		"x x",
		"xxx"
	], ['x', ItemID.plateIron, -1]);
	
	Recipes.addShaped({id: BlockID.machineBlockAdvanced, count: 1, data: 0}, [
		" x ",
		"a#a",
		" x "
	], ['x', ItemID.carbonPlate, -1, 'a', ItemID.plateAlloy, -1, '#', BlockID.machineBlockBasic, 0]);
	
	Recipes.addShaped({id: BlockID.machineBlockAdvanced, count: 1, data: 0}, [
		" a ",
		"x#x",
		" a "
	], ['x', ItemID.carbonPlate, -1, 'a', ItemID.plateAlloy, -1, '#', BlockID.machineBlockBasic, 0]);
	
	Recipes.addShapeless({id: ItemID.plateIron, count: 8, data: 0}, [{id: BlockID.machineBlockBasic, data: 0}]);
});




// file: block/reinforced.js

IDRegistry.genBlockID("reinforcedStone");
Block.createBlock("reinforcedStone", [
	{name: "Reinforced Stone", texture: [["reinforced_block", 0]], inCreative: true}
], {
	base: 1,
	solid: true,
	destroytime: 25,
	explosionres: 150,
	lightopacity: 15,
	renderlayer: 2,
	translucency: 0
});
ToolAPI.registerBlockMaterial(BlockID.reinforcedStone, "stone", 2, true);
Block.setDestroyLevel("reinforcedStone", 2);
ToolLib.addBlockDropOnExplosion("reinforcedStone");

IDRegistry.genBlockID("reinforcedGlass");
Block.createBlock("reinforcedGlass", [
	{name: "Reinforced Glass", texture: [["reinforced_glass", 0]], inCreative: true}
], {
	base: 1,
	destroytime: 25,
	explosionres: 150,
	renderlayer: 1
});
ToolAPI.registerBlockMaterial(BlockID.reinforcedGlass, "stone", 2, true);
Block.setDestroyLevel("reinforcedGlass", 2);
ToolLib.addBlockDropOnExplosion("reinforcedGlass");

Callback.addCallback("PreLoaded", function(){
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

Block.createSpecialType({
	destroytime: 0.05,
	explosionres: 0.5,
	renderlayer: 1,
}, "cable");

IDRegistry.genBlockID("cableTin0");
IDRegistry.genBlockID("cableTin1");
Block.createBlock("cableTin0", [
	{name: "tile.cableTin.name", texture: [["cable_tin", 0]], inCreative: false}
], "cable");
CableRegistry.createBlock("cableTin1", {name: "tile.cableTin.name", texture: "cable_tin1"}, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableTin0, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableTin1, "stone");


IDRegistry.genBlockID("cableCopper0");
IDRegistry.genBlockID("cableCopper1");
Block.createBlock("cableCopper0", [
	{name: "tile.cableCopper.name", texture: [["cable_copper", 0]], inCreative: false},
], "cable");
CableRegistry.createBlock("cableCopper1", {name: "tile.cableCopper.name", texture: "cable_copper1"}, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableCopper0, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableCopper1, "stone");


IDRegistry.genBlockID("cableGold0");
IDRegistry.genBlockID("cableGold1");
IDRegistry.genBlockID("cableGold2");
Block.createBlock("cableGold0", [
	{name: "tile.cableGold.name", texture: [["cable_gold", 0]], inCreative: false},
], "cable");
CableRegistry.createBlock("cableGold1", {name: "tile.cableGold.name", texture: "cable_gold1"}, "cable");
CableRegistry.createBlock("cableGold2", {name: "tile.cableGold.name", texture: "cable_gold2"}, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableGold0, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableGold1, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableGold2, "stone");


IDRegistry.genBlockID("cableIron0");
IDRegistry.genBlockID("cableIron1");
IDRegistry.genBlockID("cableIron2");
IDRegistry.genBlockID("cableIron3");
Block.createBlock("cableIron0", [
	{name: "tile.cableIron.name", texture: [["cable_iron", 0]], inCreative: false},
], "cable");
CableRegistry.createBlock("cableIron1", {name: "tile.cableIron.name", texture: "cable_iron1"}, "cable");
CableRegistry.createBlock("cableIron2", {name: "tile.cableIron.name", texture: "cable_iron2"}, "cable");
CableRegistry.createBlock("cableIron3", {name: "tile.cableIron.name", texture: "cable_iron3"}, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableIron0, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableIron1, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableIron2, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableIron3, "stone");


IDRegistry.genBlockID("cableOptic");
CableRegistry.createBlock("cableOptic", {name: "tile.cableOptic.name", texture: "cable_glass"}, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableOptic, "stone");

// energy net
CableRegistry.registerCable("cableTin", 32, 1);
CableRegistry.registerCable("cableCopper", 128, 1);
CableRegistry.registerCable("cableGold", 512, 2);
CableRegistry.registerCable("cableIron", 2048, 3);
CableRegistry.registerCable("cableOptic", 8192);

// block model
TileRenderer.setupWireModel(BlockID.cableTin0, -1, 4/16, "ic-wire");
for(let i = 0; i < 16; i++){
	TileRenderer.setupWireModel(BlockID.cableTin1, i, 6/16, "ic-wire");
}

TileRenderer.setupWireModel(BlockID.cableCopper0, -1, 4/16, "ic-wire");
for(let i = 0; i < 16; i++){
	TileRenderer.setupWireModel(BlockID.cableCopper1, i, 6/16, "ic-wire");
}

TileRenderer.setupWireModel(BlockID.cableGold0, -1, 3/16, "ic-wire");
for(let i = 0; i < 16; i++){
	TileRenderer.setupWireModel(BlockID.cableGold1, i, 5/16, "ic-wire");
	TileRenderer.setupWireModel(BlockID.cableGold2, i, 7/16, "ic-wire");
}

TileRenderer.setupWireModel(BlockID.cableIron0, -1, 6/16, "ic-wire");
for(let i = 0; i < 16; i++){
	TileRenderer.setupWireModel(BlockID.cableIron1, i, 8/16, "ic-wire");
	TileRenderer.setupWireModel(BlockID.cableIron2, i, 10/16, "ic-wire");
	TileRenderer.setupWireModel(BlockID.cableIron3, i, 12/16, "ic-wire");
}

TileRenderer.setupWireModel(BlockID.cableOptic, -1, 1/4, "ic-wire");




// file: block/mining_pipe.js

IDRegistry.genBlockID("miningPipe");
Block.createBlock("miningPipe", [
	{name: "Mining Pipe", texture: [["mining_pipe", 0]], inCreative: true},
	{name: "tile.mining_pipe.name", texture: [["mining_pipe", 1]], inCreative: false}
], {base: 1, destroytime: 2, renderlayer: 7});
Block.setBlockShape(BlockID.miningPipe, {x: 5/16, y: 0, z: 5/16}, {x: 11/16, y: 1, z: 11/16}, 0);
ToolAPI.registerBlockMaterial(BlockID.miningPipe, "stone", 1, true);
Block.setDestroyLevel("miningPipe", 1);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.miningPipe, count: 8, data: 0}, [
		"p p",
		"p p",
		"pxp",
	], ['x', 54, 0, 'p', ItemID.plateIron, 0]);
});




// file: block/crop/biome_bonuses.js

AgricultureAPI.nutrientBiomeBonusValue = {
    21:10,
    22:10,
    23:10,
    149:10,
    151:10,
    6:10,
    134:10,
    14:5,
    15:5,
    4:5,
    132:5,
    18:5,
    27:5,
    155:5,
    157:5,
    29:5,
    28:5,
    7:2,
    11:2,
    1:0,
    128:0,
    129:0,
    12:0,
    35:-2,
    163:-2,
    36:-2,
    3:-5,
    13:-5,
    162:-5,
    165:-5,
    166:-5,
    34:-5,
    158:-5,
    131:-5,
    37:-5,
    38:-5,
    39:-5,
    17:-5,
    18:-5,
    19:-5,
    20:-5,
    23:-5,
    161:-5,
    156:-5,
    33:-5,
    31:-5
};




// file: block/crop/base_crop_classes.js

AgricultureAPI.abstractFunctions["IC2CropCard"] = {
    baseSeed: {
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 1,
    getOptimalHarvestSize(te) {
        return te.crop.maxSize;
    },
    getDiscoveredBy: function() {
        return "IC2 Team";
    },
    isWeed: function(te){return false},
    tick: function(te){},
    dropGainChance: function(te){
        return Math.pow(0.95, te.crop.properties.tier);
    },
    canGrow: function(te){
        return te.data.currentSize < te.crop.maxSize;
    },
    canBeHarvested: function(te){
        return te.data.currentSize == te.crop.maxSize;
    },
    getGrowthDuration: function(te){
        return te.crop.properties.tier * 200;
    },
    getSeeds: function(te){
        return te.generateSeeds(te.data);
    },
    getSeedDropChance: function(te){
        if (te.data.currentSize == 1) return 0;
        var base = .5;
        if (te.data.currentSize ==  2) base /= 2;
        base *= Math.pow(0.8, te.crop.properties.tier);
        return base;
    },
    onLeftClick: function(te){return te.pick()},
    onRightClick: function(te){return te.performManualHarvest()},
    onEntityCollision: function(te){return true},
    getSizeAfterHarvest: function(te){return 1},
    getRootsLength: function(te){return 1}
};

AgricultureAPI.abstractFunctions["CropVanilla"] = {
    getDiscoveredBy: function() {
        return "Notch";
    },
    getProduct: function(){return {id: 0, count: 1, data: 0}},
    canGrow: function(tileentity){
        var light = World.getLightLevel(tileentity.x, tileentity.y, tileentity.z);
        return tileentity.data.currentSize < tileentity.crop.maxSize && light >= 9;
    },
    getGain: function(te){
        return te.crop.getProduct();
    },
    getSeeds: function(te){
        if (te.data.statGain <= 1 && te.data.statGrowth <= 1 && te.data.statResistance <= 1) {
            return AgricultureAPI.abstractFunctions["CropVanilla"].getSeed();
        }
        return AgricultureAPI.abstractFunctions["IC2CropCard"].getSeeds(te);
    },
    getSeed: function(){return {id: 0, count: 0, data: 0}}
};

AgricultureAPI.abstractFunctions["CropColorFlower"] = {
    getDiscoveredBy: function() {
        if (this.name == "dandelion" || this.name == "rose") {
            return "Notch";
        }
        return "Alblaka";
    },
    properties: {
        tier: 2,
        chemistry: 1,
        consumable: 1 ,
        defensive: 0,
        colorful: 5,
        weed: 1
    },
    maxSize: 4,
    color: 0,
    getOptimalHarvestSize: function(crop){return 4},
    canGrow(tileentity) {
        var light = World.getLightLevel(tileentity.x, tileentity.y, tileentity.z);
        return tileentity.data.currentSize < tileentity.crop.maxSize &&  light >= 12;
    },
    getGain: function(te){return {id: 351, count: 1, data: this.color}},
    getSizeAfterHarvest: function(te){return 3},
    getGrowthDuration(crop) {
        if (crop.data.currentSize  ==  3) {
            return 600;
        }
        return 400;
    }
};

AgricultureAPI.abstractFunctions["CropBaseMushroom"] = {
    properties: {
        tier: 2,
        chemistry: 0,
        consumable: 4 ,
        defensive: 0,
        colorful: 0,
        weed: 4
    },
    maxSize: 3,
    canGrow: function(crop) {
        return crop.data.currentSize < this.maxSize && crop.data.storageWater > 0;
    },
    getGrowthDuration: function(crop){return 200;}
};

AgricultureAPI.abstractFunctions["CropBaseMetalCommon"] = {
    properties: {
        tier: 6,
        chemistry: 2,
        consumable: 0 ,
        defensive: 0,
        colorful: 1,
        weed: 0
    },
    maxSize: 4,
    cropRootsRequirement: [],
    getOptimalHarvestSize: function(crop){return 4},
    getRootsLength: function(crop) {return 5},
    canGrow: function(crop) {
        if (crop.data.currentSize < 3) return true;
        if (crop.data.currentSize  ==  3) {
            if (!this.cropRootsRequirement || !this.cropRootsRequirement.length ) return true;
            for(var ind in this.cropRootsRequirement){
                var id = this.cropRootsRequirement[ind];
                if(crop.isBlockBelow(eval(id))) return true;
            }
        }
        return false;
    },
    canBeHarvested(crop) {
        return crop.data.currentSize == 4;
    },
    dropGainChance: function() {
        return  AgricultureAPI.abstractFunctions["IC2CropCard"] / 2;
    },
    getGrowthDuration: function(crop) {
        if (crop.data.currentSize == 3) {
            return 2000;
        }
        return 800;
    },
    getSizeAfterHarvest: function(crop) {
        return 2;
    }
};

AgricultureAPI.abstractFunctions["CropBaseMetalUncommon"] = {
    properties: {
        tier: 6,
        chemistry: 2,
        consumable: 0 ,
        defensive: 0,
        colorful: 2,
        weed: 0
    },
    maxSize: 5,
    cropRootsRequirement: [],
    getOptimalHarvestSize: function(crop){return 5},
    getRootsLength: function(crop) {return 5},
    canGrow: function(crop) {
        if (crop.data.currentSize < 4) return true;
        if (crop.data.currentSize == 4) {
            if (!this.cropRootsRequirement || !this.cropRootsRequirement.length) return true;
            for(var ind in this.cropRootsRequirement){
                var id = this.cropRootsRequirement[ind];
                if(crop.isBlockBelow(eval(id))) return true;
            }
        }
        return false;
    },
    canBeHarvested(crop) {
        return crop.data.currentSize == 5;
    },
    dropGainChance: function() {
        return Math.pow(0.95, this.properties.tier);
    },
    getGrowthDuration: function(crop) {
        if (crop.data.currentSize == 4) {
            return 2200;
        }
        return 750;
    },
    getSizeAfterHarvest: function(crop) {
        return 2;
    }
};




// file: block/crop/crop.js

IDRegistry.genBlockID("crop");
Block.createBlock("crop", [
	{name: "crop", texture: [["stick", 0]], inCreative: false}
], {base: 59, rendertype: 6, explosionres: 0});
ToolAPI.registerBlockMaterial(BlockID.crop, "wood");
TileRenderer.setEmptyCollisionShape(BlockID.crop);
BlockRenderer.enableCoordMapping(BlockID.crop, 0, TileRenderer.getCropModel(["stick", 0]));

Block.registerDropFunctionForID(BlockID.crop, function(coords, id, data, diggingLevel, toolLevel){ 
	return [];
});

TileEntity.registerPrototype(BlockID.crop, {
	defaultValues: {
		crop: null,
		dirty: true,
		statGrowth: 0,
		statGain: 0,
		statResistance: 0,
		storageNutrients: 0,
		storageWater: 0,
		storageWeedEX: 0,
		terrainAirQuality: -1,
		terrainHumidity: -1,
		terrainNutrients: -1,
		currentSize: 1,
		growthPoints: 0,
		scanLevel: 0,
		crossingBase: false
	},

	init: function(){
		if(this.data.crop) this.crop = AgricultureAPI.cropCards[this.data.crop];
		this.updateRender();
	},

	tick: function () {
		this.checkGround();
		this.checkPlayerRunning();
		if(World.getThreadTime() % 192 == 0) this.performTick();
	},

	click: function(id, count, data, coords){
		if(id){
			var card = AgricultureAPI.getCardFromSeed({id: id, data: data});
			if(id == ItemID.agriculturalAnalyzer) return;
			if(id == ItemID.debugItem && this.crop){
				this.data.currentSize = this.crop.maxSize;
				this.updateRender();
				return;
			}
			if(Config.debugMode && id == 351 && this.data.crossingBase){
				this.attemptCrossing();
				return;
			}

			if (!this.crop && !this.data.crossingBase && id == ItemID.cropStick){
				this.data.crossingBase = true;
				this.data.dirty = true;
				Player.decreaseCarriedItem(1);
				this.updateRender();
				return;
			}
			if (this.crop && id == ItemID.fertilizer) {
				if (this.applyFertilizer(true)) this.data.dirty = true;
				Player.decreaseCarriedItem(1);
				return;
			}
			if (id == ItemID.cellWater && count == 1) {
				var amount = this.applyHydration(1000 - data);
				if(amount > 0) {
					if(data + amount >= 1000) {
						Player.setCarriedItem(ItemID.cellEmpty, 1, 0);
					} else {
						Player.setCarriedItem(id, 1, data + amount);
					}
				}
				return;
			}
			if (this.applyWeedEx(id, true)) {
				this.data.dirty = true;
				return;
			}
			if (!this.crop && !this.data.crossingBase && card) {
				this.reset();

				this.data.crop = AgricultureAPI.getCardIndexFromID(card.id);
				this.crop = AgricultureAPI.cropCards[this.data.crop];
				this.data.currentSize = card.baseSeed.size;

				this.data.statGain = card.baseSeed.gain;
				this.data.statGrowth = card.baseSeed.growth;
				this.data.statResistance = card.baseSeed.resistance;

				Player.decreaseCarriedItem(1);
				this.updateRender();
				return;
			}
		}
		if(this.crop && this.crop.canBeHarvested(this)) this.crop.onRightClick(this);
	},

	onLongClick: function(){
		if(this.data.crossingBase){
			World.drop(this.x, this.y, this.z, ItemID.cropStick, 1, 0);
			this.data.crossingBase = false;
			this.data.dirty = true;
			this.updateRender();
			return true;
		}
		else if(this.crop){
			return this.crop.onLeftClick(this);;
		}
		return false;
	},

	destroyBlock: function(coords, player){
		World.drop(this.x, this.y, this.z, ItemID.cropStick, 1, 0);
		if(this.data.crossingBase) World.drop(this.x, this.y, this.z, ItemID.cropStick, 1, 0);
		if(this.crop) this.crop.onLeftClick(this);
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	},

	updateRender: function(){
		var texture = ["stick", 0];
		if(this.crop){
			texture[0] = this.crop.texture;
			texture[1] = this.data.currentSize;
		}
		else if(this.data.crossingBase) texture[1] = 1;

		var render = TileRenderer.getCropModel(texture);
		BlockRenderer.mapAtCoords(this.x, this.y, this.z, render);
	},

	checkPlayerRunning: function(){
		if(!this.crop) return;

		var coords = Entity.getPosition(Player.get());
		var playerX = Math.floor(coords.x);
		var playerY = Math.floor(coords.y);
		var playerZ = Math.floor(coords.z);

		if(playerX == this.x && playerY - 1 == this.y && playerZ == this.z){
			var vel = Player.getVelocity();
			var horizontalVel = Math.sqrt(vel.x * vel.x + vel.z * vel.z)
			if(horizontalVel > 0.15 && this.crop.onEntityCollision(this)){
				World.destroyBlock(this.x, this.y, this.z);
			}
		}
	},

	checkGround: function(){
		if(World.getBlockID(this.x, this.y - 1, this.z) != 60){
			World.destroyBlock(this.x, this.y, this.z);
		}
	},

	performTick: function(){
		if(World.getThreadTime() % 768 == 0){
			this.updateTerrainHumidity();
			this.updateTerrainNutrients();
			this.updateTerrainAirQuality();
		}

		if (!this.crop  && (!this.data.crossingBase || !this.attemptCrossing())) {
			if (random(0, 100) != 0 || this.data.storageWeedEX > 0) {
				if (this.data.storageWeedEX  > 0 && random(0, 10)  == 0) {
					this.data.storageWeedEX--;
				}
				return;
			}
			this.reset();

			this.data.crop = AgricultureAPI.getCardIndexFromID("weed");
			this.crop = AgricultureAPI.cropCards[this.data.crop];
			this.data.currentSize = 1;

			this.updateRender();
		}
		if(this.crop){
			this.crop.tick(this);
			if(this.crop.canGrow(this)){
				this.performGrowthTick();
				var growDuration = this.crop.getGrowthDuration(this);
				if (this.data.growthPoints >= growDuration) {
					this.data.growthPoints = 0;
					this.data.currentSize = this.data.currentSize + 1;
					this.data.dirty = true;

					this.updateRender();
				}
			}
		}

		if (this.data.storageNutrients > 0) this.data.storageNutrients--;
		if (this.data.storageWater > 0) this.data.storageWater--;

		if (this.crop.isWeed(this) && random(0, 50) - this.data.statGrowth <= 2){
			this.performWeedWork();
		}
	},

	updateTerrainHumidity: function(){
		var humidity = AgricultureAPI.getHumidityBiomeBonus(this.x, this.z);

		if(World.getBlockData(this.x, this.y-1, this.z) == 7) humidity += 2
		if(this.data.storageWater >= 5) humidity += 2;

		humidity += (this.data.storageWater + 24) / 25;
		this.data.terrainHumidity = humidity;
	},

	updateTerrainNutrients: function(){
		var nutrients = AgricultureAPI.getNutrientBiomeBonus(this.x, this.z);
		nutrients += (this.data.terrainNutrients + 19) / 20;

		for (var i = 2; i < 5; ++i){
			if(World.getBlockID(this.x, this.y - i, this.z) == 3) nutrients++;
		}
		this.data.terrainNutrients = nutrients;
	},

	updateTerrainAirQuality: function(){
		var value = 0;
		var height = Math.floor((this.y - 64) / 15);
		if (height > 4) height = 4;
		if (height < 0) height = 0;

		var fresh = 9;
		for (var x = this.x - 1; x < this.x + 2; x++) {
			for (var z = this.z - 1; z < this.z + 2; z++) {
				if (World.getBlockID(x, this.y, z)) fresh--;
			}
		}
		if(GenerationUtils.canSeeSky(this.x, this.y + 1, this.z)) value += 2;
		value += Math.floor(fresh / 2);
		value += height;

		this.data.terrainAirQuality = value;
	},

	performGrowthTick: function(){
		if (!this.crop) return;

		var totalGrowth = 0;
		var baseGrowth = 3 + random(0, 7) + this.data.statGrowth;
		var properties = this.crop.properties;
		var sumOfStats = this.data.statGrowth + this.data.statGain + this.data.statResistance;
		var minimumQuality = (properties.tier - 1) * 4 + sumOfStats;
		minimumQuality = Math.max(minimumQuality, 0);
		var providedQuality = 75;

		if (providedQuality >= minimumQuality){
			totalGrowth = baseGrowth * (100 + (providedQuality - minimumQuality)) / 100;
		}
		else{
			var aux = (minimumQuality - providedQuality) * 4;
			if (aux > 100 && random(0, 32) > this.data.statResistance) {
				totalGrowth = 0;

				this.reset();
				this.updateRender();
			}
			else {
				totalGrowth = baseGrowth * (100 - aux) / 100;
				totalGrowth = Math.max(totalGrowth, 0);
			}
		}
		this.data.growthPoints += Math.round(totalGrowth);
	},

	performWeedWork: function(){
		var coords = this.relativeCropCoords[random(0, 3)];
		var preCoords = [this.x + coords[0], this.y + coords[0], this.z + coords[0]];
		if(World.getBlockID(preCoords[0], preCoords[1], preCoords[2]) == BlockID.crop){
			var TE = World.getTileEntity(preCoords[0], preCoords[1], preCoords[2]);
			if(!TE.crop || (!TE.crop.isWeed(this) && !TE.hasWeedEX() && random(0, 32) >= TE.data.statResistance)){
				var newGrowth = Math.max(this.data.statGrowth, TE.data.statGrowth);
				if (newGrowth < 31 && random(0, 1)) newGrowth++;

				TE.reset();
				TE.data.crop = AgricultureAPI.getCardIndexFromID("weed");
				TE.crop = AgricultureAPI.cropCards[TE.data.crop];
				TE.data.currentSize = 1;
				TE.data.statGrowth = newGrowth;
				TE.updateRender();
			}
		}
		else if(World.getBlockID(preCoords[0], preCoords[1] - 1, preCoords[2]) == 60){
			World.setBlock(preCoords[0], preCoords[1] - 1, preCoords[2] ,2 ,0);
		}
	},

	reset: function(){
		this.data.crop = null;
		this.crop = undefined;
		this.data.statGain = 0;
		this.data.statResistance = 0;
		this.data.statGrowth = 0;
		this.data.terrainAirQuality = -1;
		this.data.terrainHumidity = -1;
		this.data.terrainNutrients = -1;
		this.data.growthPoints = 0;
		this.data.scanLevel = 0;
		this.data.currentSize = 1;
		this.data.dirty = true;
	},

	hasWeedEX: function(){
		if (this.data.storageWeedEX > 0) {
			this.data.storageWeedEX -= 5;
			return true;
		}
		return false;
	},

	attemptCrossing: function(){ // modified from the original
		if (random(0, 3) != 0) return false;

		var cropCoords = this.askCropJoinCross(this.relativeCropCoords);
		if (cropCoords.length < 2) return false;

		var cropCards = AgricultureAPI.cropCards;
		var ratios = [];
		var total = 0;
		for(var j in cropCards){
			var crop = cropCards[j];
			for(var crd in cropCoords){
				var coords = cropCoords[crd];
				var tileEnt = World.getTileEntity(coords.x, coords.y, coords.z);
				total += this.calculateRatioFor(crop, tileEnt.crop);
			}
			ratios[j] = total;
		}
		var search = random(0, total);
		var min = 0;
		var max = ratios.length - 1;
		while (min < max) {
			var cur = Math.floor((min + max) / 2);
			var value = ratios[cur];
			if (search < value){
				max = cur;
			} else {
				min = cur + 1;
			}
		}

		this.data.crossingBase = false;
		this.crop = cropCards[min]
		this.data.crop = min;
		this.data.dirty = true;
		this.data.currentSize = 1;

		this.data.statGrowth = 0;
		this.data.statResistance = 0;
		this.data.statGain = 0;

		for(var i in cropCoords){
			var te2 = World.getTileEntity(cropCoords[i].x, cropCoords[i].y, cropCoords[i].z);
			this.data.statGrowth += te2.data.statGrowth;
			this.data.statResistance += te2.data.statResistance;
			this.data.statGain += te2.data.statGain;
		}
		var count = cropCoords.length;

		this.data.statGrowth = Math.floor(this.data.statGrowth / count);
		this.data.statResistance = Math.floor(this.data.statResistance / count);
		this.data.statGain = Math.floor(this.data.statGain / count);

		this.data.statGrowth += Math.round(random(0, 1 + 2 * count) - count);
		this.data.statGain += Math.round(random(0, 1 + 2 * count) - count);
		this.data.statResistance += Math.round(random(0, 1 + 2 * count) - count);

		this.data.statGrowth = this.lim(this.data.statGrowth, 0, 31);
		this.data.statGain = this.lim(this.data.statGain, 0, 31);
		this.data.statResistance = this.lim(this.data.statResistance, 0, 31);

		this.updateRender();
		return true;
	},

	lim: function(value, min, max){
		if (value <= min) return min;
		if (value >= max) return max;
		return value;
	},

	relativeCropCoords: [ [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1] ],

	askCropJoinCross: function(coordsArray){ // modified from the original
		var cropsCoords = [];
		for(var r in coordsArray){
			var pos = coordsArray[r];
			var coords = { x: this.x + pos[0], y: this.y + pos[1], z: this.z + pos[2] };
			var sideTileEntity = World.getTileEntity(coords.x, coords.y, coords.z);
			var blockId = World.getBlockID(coords.x, coords.y, coords.z)

			if(!sideTileEntity || !sideTileEntity.crop || blockId != BlockID.crop) continue;
			if(sideTileEntity.data.currentSize <= 3) continue;

			var base = 4;
			if (sideTileEntity.data.statGrowth >= 16) base++;
			if (sideTileEntity.data.statGrowth >= 30) base++;
			if (sideTileEntity.data.statResistance >= 28){
				base += 27 - sideTileEntity.data.statResistance;
			}
			if (base >= random(0, 20)) cropsCoords.push(coords);
		}
		return cropsCoords;
	},

	calculateRatioFor: function(newCrop, oldCrop){
		if (newCrop.id == oldCrop.id) return 500;

		var value = 0;
		var propOld = oldCrop.properties;
		var propNew = newCrop.properties;
		for (var i in propOld) {
			var delta = Math.abs(propOld[i] - propNew[i]);
			value += 2 - delta;
		}

		var attributesOld = oldCrop.attributes;
		var attributesNew = newCrop.attributes;
		for(var iO in attributesOld){
			for(var iN in attributesNew){
				var attO = attributesOld[iO];
				var attN = attributesNew[iN];
				if(attO == attN) value += 5;
			}
		}

		var diff = newCrop.properties.tier - oldCrop.properties.tier;
		if (diff > 1) value -= 2 * diff;
		if (diff < -3) value += diff;

		return Math.max(value, 0);
	},

	applyFertilizer: function(manual){
		if (this.data.storageNutrients >= 100) return false;

		this.data.storageNutrients += manual ? 100 : 90;
		return true;
	},

	applyWeedEx: function(id, manual){
		if(id == ItemID.weedEx){
			var limit = manual ? 100 : 150;
			if (this.data.storageWeedEX >= limit) return false;

			var amount = manual ? 50 : 100;
			this.data.storageWeedEX += amount;

			if(manual) ToolAPI.breakCarriedTool(1);
			return true;
		}
		return false;
	},

	applyHydration: function(amount){
		var limit = 200;
		if (this.data.storageWater >= limit) return 0;
		
		var relativeAmount = limit - this.data.storageWater;
		amount = Math.min(relativeAmount, amount);
		this.data.storageWater += amount;
		
		return amount;
	},

	tryPlantIn: function(cropCardID, size, statGr, statGa, statRe, scan){
		var cropCard = AgricultureAPI.cropCards[cropCardID];
		if (!cropCard || cropCard.id == "weed" || this.data.crossingBase) return false;

		this.reset();
		this.data.crop = cropCardID;
		this.crop = cropCard;
		this.data.currentSize = size;
		this.data.statGain = statGa;
		this.data.statGrowth = statGr;
		this.data.statResistance = statRe;
		this.data.scanLevel = scan;
		this.updateRender();

		return true;
	},

	performHarvest: function(){
		if (!this.crop || !this.crop.canBeHarvested(this)) return null;

		var chance = this.crop.dropGainChance(this);
		chance *= Math.pow(1.03, this.data.statGain);
		var dropCount2 = Math.max(0, Math.round(this.nextGaussian() * chance * 0.6827 + chance));
		var ret = [];
		for (var i = 0; i < dropCount2; i++) {
			ret[i] = this.crop.getGain(this);
			if (ret[i] && random(0, 100) <= this.data.statGain) {
				ret[i] = ret[i].count++;
			}
		}

		this.data.currentSize = this.crop.getSizeAfterHarvest(this);
		this.data.dirty = true;

		this.updateRender();
		return ret;
	},

	performManualHarvest: function(){
		var dropItems = this.performHarvest();
		if(!dropItems || !dropItems.length) return;

		for(var ind in dropItems){
			var item = dropItems[ind];
			nativeDropItem(this.x, this.y, this.z, 0, item.id, item.count, item.data, null);
		}
	},

	nextGaussian: function(){
		var v1, v2, s;
		do{
			v1 = 2 * Math.random() - 1; // Between -1.0 and 1.0.
			v2 = 2 * Math.random() - 1; // Between -1.0 and 1.0.
			s = v1 * v1 + v2 * v2;
		}while (s >= 1);

		var norm = Math.sqrt(-2 * Math.log(s) / s);
		return v1 * norm;
	},

	pick: function(){
		if(!this.crop) return false;

		var bonus = this.crop.canBeHarvested(this);
		var firstchance = this.crop.getSeedDropChance(this);
		firstchance *= Math.pow(1.1, this.data.statResistance);
		var dropCount = 0;

		if (bonus) {
			if (Math.random() <= (firstchance + 1) * .8) dropCount++;
			var chance = this.crop.getSeedDropChance(this) + this.data.statGrowth / 100;
			chance *= Math.pow(.95, this.statGain - 23);
			if (Math.random() <= chance) dropCount++;
		}
		else if (Math.random() <= firstchance * 1.5) dropCount++;

		var item = this.crop.getSeeds(this);
		nativeDropItem(this.x, this.y, this.z, 0, item.id, dropCount, item.data, item.extra);

		this.reset();
		this.updateRender();
		return true;
	},

	generateSeeds: function(data){
		var extra = AgricultureAPI.generateExtraFromValues(data);
		return {id: ItemID.cropSeedBag, data: this.data.crop, extra: extra};
	},

	isBlockBelow: function(reqBlockID){
		if (!this.crop) return false;

		var rootsLength = this.crop.getRootsLength(this);
		for (var i = 1; i < rootsLength; i++) {
			var blockID = World.getBlockID(this.x, this.y - i, this.z);
			if(!blockID) return false;
			if(reqBlockID == blockID) return true;
		}
		return false;
	}
});

Callback.addCallback("DestroyBlockStart", function(coords, block){
	if(block.id == BlockID.crop){
		var tileEntity = World.getTileEntity(coords.x, coords.y, coords.z);
		if(tileEntity && tileEntity.onLongClick()){
			Game.prevent();
		}
	}
});




// file: machine/generator/generator.js

IDRegistry.genBlockID("primalGenerator");
Block.createBlock("primalGenerator", [
	{name: "Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.primalGenerator, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.primalGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.primalGenerator, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 1], ["machine_side", 0], ["machine_side", 0]]);

MachineRegistry.setMachineDrop("primalGenerator");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.primalGenerator, count: 1, data: 0}, [
		"x",
		"#",
		"a"
	], ['#', BlockID.machineBlockBasic, 0, 'a', 61, 0, 'x', ItemID.storageBattery, -1]);
	
	Recipes.addShaped({id: BlockID.primalGenerator, count: 1, data: 0}, [
		" x ",
		"###",
		" a "
	], ['#', ItemID.plateIron, 0, 'a', BlockID.ironFurnace, -1, 'x', ItemID.storageBattery, -1]);
});


var guiGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Generator")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "fire_background", scale: GUI_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"burningScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_SCALE},
		"slotEnergy": {type: "slot", x: 441, y: 75, isValid: function(id){return ChargeItemRegistry.isValidItem(id, "Eu", 1);}},
		"slotFuel": {type: "slot", x: 441, y: 212,
			isValid: function(id, count, data){
				return Recipes.getFuelBurnDuration(id, data) > 0;
			}
		},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 300, height: 30, text: "10000"}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiGenerator, "Generator");
});

MachineRegistry.registerGenerator(BlockID.primalGenerator, {
	defaultValues: {
		meta: 0,
		burn: 0,
		burnMax: 0,
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiGenerator;
	},
	
	getFuel: function(slotName){
		var fuelSlot = this.container.getSlot(slotName);
		if (fuelSlot.id > 0){
			var burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
			if (burn && !LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)){
				fuelSlot.count--;
				this.container.validateSlot(slotName);
				
				return burn;
			}
		}
		return 0;
	},
	
	tick: function(){
		StorageInterface.checkHoppers(this);
		var energyStorage = this.getEnergyStorage();
		
		if(this.data.burn <= 0 && this.data.energy + 10 < energyStorage){
			this.data.burn = this.data.burnMax = this.getFuel("slotFuel") / 4;
		}
		if(this.data.burn > 0 && 
		  (!this.data.isActive && this.data.energy + 100 <= energyStorage ||
		  this.data.isActive && this.data.energy + 10 <= energyStorage)){
			this.data.energy += 10;
			this.data.burn--;
			this.activate();
			this.startPlaySound("Generators/GeneratorLoop.ogg");
		} else {
			this.deactivate();
			this.stopPlaySound();
		}
		
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotEnergy"), "Eu", this.data.energy, 1);
		
		this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", this.data.energy + "/");
	},
	
	getEnergyStorage: function(){
		return 10000;
	},
	
	energyTick: function(type, src){
		var output = Math.min(32, this.data.energy);
		this.data.energy += src.add(output) - output;
	},
	
	renderModel: MachineRegistry.renderModelWithRotation,
});

TileRenderer.setRotationPlaceFunction(BlockID.primalGenerator);

StorageInterface.createInterface(BlockID.primalGenerator, {
	slots: {
		"slotFuel": {input: true}
	},
	isValidInput: function(item){
		return Recipes.getFuelBurnDuration(item.id, item.data) > 0;
	}
});




// file: machine/generator/geothermal.js

IDRegistry.genBlockID("geothermalGenerator");
Block.createBlock("geothermalGenerator", [
	{name: "Geothermal Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.geothermalGenerator, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.geothermalGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.geothermalGenerator, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 1], ["machine_side", 0], ["machine_side", 0]]);

MachineRegistry.setMachineDrop("geothermalGenerator", BlockID.primalGenerator);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.geothermalGenerator, count: 1, data: 0}, [
		"xax",
		"xax",
		"b#b"
	], ['#', BlockID.primalGenerator, -1, 'a', ItemID.cellEmpty, 0, 'b', ItemID.casingIron, 0, 'x', 20, -1]);
});


var guiGeothermalGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Geothermal Generator")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 702, y: 91, bitmap: "energy_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 581, y: 75, bitmap: "liquid_bar", scale: GUI_SCALE},
		{type: "bitmap", x: 459, y: 139, bitmap: "liquid_bar_arrow", scale: GUI_SCALE}
	],
	
	elements: {
		"energyScale": {type: "scale", x: 702 + 4*GUI_SCALE, y: 91, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"liquidScale": {type: "scale", x: 581 + 4*GUI_SCALE, y: 75 + 4*GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 440, y: 75,
			isValid: function(id, count, data){
				return LiquidLib.getItemLiquid(id, data) == "lava";
			}
		},
		"slot2": {type: "slot", x: 440, y: 183, isValid: function(){return false;}},
		"slotEnergy": {type: "slot", x: 725, y: 165, isValid: function(id){return ChargeItemRegistry.isValidItem(id, "Eu", 1);}}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiGeothermalGenerator, "Geothermal Generator");
});

MachineRegistry.registerGenerator(BlockID.geothermalGenerator, {
	defaultValues: {
		meta: 0,
		isActive: false,
	},
	
	getGuiScreen: function(){
		return guiGeothermalGenerator;
	},
	
	init: function(){
		this.liquidStorage.setLimit("lava", 8);
		this.renderModel();
	},
	
	getLiquidFromItem: MachineRegistry.getLiquidFromItem,
	
	click: function(id, count, data, coords){
		if(Entity.getSneaking(player)){
			return this.getLiquidFromItem("lava", {id: id, count: count, data: data}, null, true);
		}
	},
	
	tick: function(){
		StorageInterface.checkHoppers(this);
		
		var slot1 = this.container.getSlot("slot1");
		var slot2 = this.container.getSlot("slot2");
		this.getLiquidFromItem("lava", slot1, slot2);
		
		var energyStorage = this.getEnergyStorage();
		if(this.liquidStorage.getAmount("lava").toFixed(3) >= 0.001 && this.data.energy + 20 <= energyStorage){
			this.data.energy += 20;
			this.liquidStorage.getLiquid("lava", 0.001);
			this.activate();
			this.startPlaySound("Generators/GeothermalLoop.ogg");
		}
		else {
			this.stopPlaySound();
			this.deactivate();
		}
		
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotEnergy"), "Eu", this.data.energy, 1);
		
		this.liquidStorage.updateUiScale("liquidScale", "lava");
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return 10000;
	},
	
	energyTick: function(type, src){
		var output = Math.min(32, this.data.energy);
		this.data.energy += src.add(output) - output;
	},
	
	renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.geothermalGenerator);

StorageInterface.createInterface(BlockID.geothermalGenerator, {
	slots: {
		"slot1": {input: true},
		"slot2": {output: true}
	},
	isValidInput: function(item){
		return LiquidLib.getItemLiquid(item.id, item.data) == "lava";
	},
	canReceiveLiquid: function(liquid, side){ return liquid == "lava"; },
	canTransportLiquid: function(liquid, side){ return false; }
});




// file: machine/generator/fluid_generator.js

IDRegistry.genBlockID("semifluidGenerator");
Block.createBlock("semifluidGenerator", [
	{name: "Semifluid Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 0], ["semifluid_generator_side", 0], ["semifluid_generator_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.semifluidGenerator, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 0], ["semifluid_generator_side", 0], ["semifluid_generator_side", 0]]);
TileRenderer.registerRotationModel(BlockID.semifluidGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 0], ["semifluid_generator_side", 0], ["semifluid_generator_side", 0]]);
TileRenderer.registerRotationModel(BlockID.semifluidGenerator, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 1], ["semifluid_generator_side", 1], ["semifluid_generator_side", 1]]);

MachineRegistry.setMachineDrop("semifluidGenerator", BlockID.primalGenerator);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.fluidHeatGenerator, count: 1, data: 0}, [
		"pcp",
		"cxc",
		"pcp"
	], ['x', BlockID.machineBlockBasic, 0, 'c', ItemID.cellEmpty, 0, 'p', ItemID.casingIron, 0]);
});

MachineRecipeRegistry.registerRecipesFor("fluidFuel", {
	"biomass": {power: 8, amount: 20},
	"oil": {power: 8, amount: 10},
	"biogas": {power: 16, amount: 10},
	"ethanol": {power: 16, amount: 10},
});

var guiSemifluidGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Semifluid Generator")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 702, y: 91, bitmap: "energy_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 581, y: 75, bitmap: "liquid_bar", scale: GUI_SCALE},
		{type: "bitmap", x: 459, y: 139, bitmap: "liquid_bar_arrow", scale: GUI_SCALE}
	],
	
	elements: {
		"energyScale": {type: "scale", x: 702 + 4*GUI_SCALE, y: 91, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"liquidScale": {type: "scale", x: 581 + 4*GUI_SCALE, y: 75 + 4*GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 440, y: 75,
			isValid: function(id, count, data){
				var empty = LiquidLib.getEmptyItem(id, data);
				if(!empty) return false;
				return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
			}
		},
		"slot2": {type: "slot", x: 440, y: 183, isValid: function(){return false;}},
		"slotEnergy": {type: "slot", x: 725, y: 165, isValid: function(id){return ChargeItemRegistry.isValidItem(id, "Eu", 1);}}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiSemifluidGenerator, "Semifluid Generator");
});

MachineRegistry.registerGenerator(BlockID.semifluidGenerator, {
	defaultValues: {
		meta: 0,
		fuel: 0,
		liquid: null,
		isActive: false,
	},
	
	getGuiScreen: function(){
		return guiSemifluidGenerator;
	},
	
	init: function(){
		this.liquidStorage.setLimit(null, 10);
		this.renderModel();
	},
	
	getLiquidFromItem: MachineRegistry.getLiquidFromItem,
	
	click: function(id, count, data, coords){
		if(Entity.getSneaking(player)){
			var liquid = this.liquidStorage.getLiquidStored();
			return this.getLiquidFromItem(liquid, {id: id, count: count, data: data}, null, true);
		}
	},
	
	tick: function(){
		StorageInterface.checkHoppers(this);
		var energyStorage = this.getEnergyStorage();
		var liquid = this.liquidStorage.getLiquidStored();
		var slot1 = this.container.getSlot("slot1");
		var slot2 = this.container.getSlot("slot2");
		this.getLiquidFromItem(liquid, slot1, slot2);
		
		if(this.data.fuel <= 0){
			var fuel = MachineRecipeRegistry.getRecipeResult("fluidFuel", liquid);
			if(fuel && this.liquidStorage.getAmount(liquid).toFixed(3) >= fuel.amount/1000 && this.data.energy + fuel.power * fuel.amount <= energyStorage){
				this.liquidStorage.getLiquid(liquid, fuel.amount/1000);
				this.data.fuel = fuel.amount;
				this.data.liquid = liquid;
			}
		}
		if(this.data.fuel > 0){
			var fuel = MachineRecipeRegistry.getRecipeResult("fluidFuel", this.data.liquid);
			this.data.energy += fuel.power;
			this.data.fuel -= fuel.amount/20;
			this.activate();
			this.startPlaySound("Generators/GeothermalLoop.ogg");
		}
		else {
			this.data.liquid = null;
			this.stopPlaySound();
			this.deactivate();
		}
    
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotEnergy"), "Eu", this.data.energy, 1);
		
		this.liquidStorage.updateUiScale("liquidScale", liquid);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return 10000;
	},
	
	energyTick: function(type, src){
		var output = Math.min(32, this.data.energy);
		this.data.energy += src.add(output) - output;
	},
	
	renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.semifluidGenerator);

StorageInterface.createInterface(BlockID.semifluidGenerator, {
	slots: {
		"slot1": {input: true},
		"slot2": {output: true}
	},
	isValidInput: function(item){
		var empty = LiquidLib.getEmptyItem(item.id, item.data);
		if(!empty) return false;
		return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
	},
	canReceiveLiquid: function(liquid, side){
		return MachineRecipeRegistry.hasRecipeFor("fluidFuel", liquid)
	},
	canTransportLiquid: function(liquid, side){ return false; }
});




// file: machine/generator/solar.js

IDRegistry.genBlockID("solarPanel");
Block.createBlock("solarPanel", [
	{name: "Solar Panel", texture: [["machine_bottom", 0], ["solar_panel", 0], ["machine", 0], ["machine", 0], ["machine", 0], ["machine", 0]], inCreative: true}
], "stone");

MachineRegistry.setMachineDrop("solarPanel", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.solarPanel, count: 1, data: 0}, [
		"aaa",
		"xxx",
		"b#b"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.dustCoal, 0, 'b', ItemID.circuitBasic, 0, 'a', 20, -1]);
});


var guiSolarPanel = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Solar Panel")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},
	
	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
	],
	
	elements: {
		"slotEnergy": {type: "slot", x: 600, y: 130, isValid: function(id){return ChargeItemRegistry.isValidItem(id, "Eu", 1);}},
		"sun": {type: "image", x: 608, y: 194, bitmap: "sun_off", scale: GUI_SCALE}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiSolarPanel, "Solar Panel");
});


MachineRegistry.registerGenerator(BlockID.solarPanel, {
	defaultValues: {
		canSeeSky: false
	},
	
	getGuiScreen: function(){
		return guiSolarPanel;
	},
	
	init: function(){
		this.data.canSeeSky = GenerationUtils.canSeeSky(this.x, this.y + 1, this.z);
	},
	
	tick: function(){
		var content = this.container.getGuiContent();
		if(World.getThreadTime()%100 == 0){
			this.data.canSeeSky = GenerationUtils.canSeeSky(this.x, this.y + 1, this.z);
		}
		if(this.data.canSeeSky && World.getLightLevel(this.x, this.y + 1, this.z) == 15){
			this.data.energy = 1;
			this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotEnergy"), "Eu", 1, 1);
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
			src.addAll(1);
			this.data.energy = 0;
		}
	}
});




// file: machine/generator/windmill.js

IDRegistry.genBlockID("genWindmill");
Block.createBlock("genWindmill", [
	{name: "Wind Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["windmill", 0], ["windmill", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.genWindmill, [["machine_bottom", 0], ["machine_top", 0], ["windmill", 0], ["windmill", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.genWindmill, 0, [["machine_bottom", 0], ["machine_top", 0], ["windmill", 0], ["windmill", 0], ["machine_side", 0], ["machine_side", 0]]);

MachineRegistry.setMachineDrop("genWindmill", BlockID.primalGenerator);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.genWindmill, count: 1, data: 0}, [
		"x x",
		" # ",
		"xcx"
	], ['#', BlockID.primalGenerator, -1, 'x', ItemID.plateSteel, 0, 'c', ItemID.coil, 0]);
});

MachineRegistry.registerGenerator(BlockID.genWindmill, {
	defaultValues: {
		meta: 0,
		output: 0,
		ticker: -1,
		blockCount: 0
	},
		
	updateBlockCount: function(){
		var blockCount = -1;
		for(var x = -4; x <= 4; x++){
			for(var y = -2; y <= 2; y++){
				for(var z = -4; z <= 4; z++){
					if(World.getBlockID(this.x + x, this.y + y, this.z + z) != 0)
					blockCount++;
				}
			}
		}
		this.data.blockCount = blockCount;
	},
	
	init: function(){
		if(this.data.ticker == undefined) this.data.ticker = -1;
		this.renderModel();
		if(this.dimension != 0) this.selfDestroy();
	},

	energyTick: function(type, src){
		if(++this.data.ticker % 128 == 0){
			if(this.data.ticker % 1024 == 0){
				this.updateBlockCount();
			}
			var height = (this.y < 160) ? Math.max(this.y - 64, 0) : 256 - this.y;
			var wind = windStrength;
			var wether = World.getWeather();
			if(wether.thunder) wind *= 1.25;
			else if(wether.rain) wind *= 1.5;
			var output = wind * height * (1 - this.data.blockCount/405) / 288;
			this.data.output = Math.round(output*10)/10;
		}
		src.addAll(this.data.output);
	},
	
	renderModel: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta);
	},
	destroy: function(){
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	},
});

TileRenderer.setRotationPlaceFunction(BlockID.genWindmill);

var windStrength = 0;
Callback.addCallback("tick", function (){
	if (World.getThreadTime()%128 != 0) {
		return;
	}
	var upChance = 10;
	var downChance = 10;
	if (windStrength > 20) {
		upChance -= windStrength - 20;
	} else if (windStrength < 10) {
		downChance -= 10 - windStrength;
	}
	if (Math.random()*100 < upChance) {
		windStrength++;
	} else if (Math.random()*100 < downChance) {
		windStrength--;
	}
});

Saver.addSavesScope("windSim",
    function read(scope){
        windStrength = scope.strength || random(5, 25);
    },
    function save(){
        return {strength: windStrength};
    }
);




// file: machine/generator/watermill.js

IDRegistry.genBlockID("genWatermill");
Block.createBlock("genWatermill", [
	{name: "Water Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["watermill_back", 0], ["watermill_front", 0], ["watermill_left", 0], ["watermill_right", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.genWatermill, [["machine_bottom", 0], ["machine_top", 0], ["watermill_back", 0], ["watermill_front", 0], ["watermill_left", 0], ["watermill_right", 0]]);
TileRenderer.registerRotationModel(BlockID.genWatermill, 0, [["machine_bottom", 0], ["machine_top", 0], ["watermill_back", 0], ["watermill_front", 0], ["watermill_left", 0], ["watermill_right", 0]]);

MachineRegistry.setMachineDrop("genWatermill", BlockID.primalGenerator);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.genWatermill, count: 1, data: 0}, [
		"x x",
		"a#a",
		"xcx"
	], ['#', BlockID.primalGenerator, -1, 'x', ItemID.plateSteel, 0, 'a', ItemID.casingSteel, 0, 'c', ItemID.coil, 0]);
});


MachineRegistry.registerGenerator(BlockID.genWatermill, {
	defaultValues: {
		meta: 0,
		output: 0
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
				else{
					this.data.output = 0;
				}
			}
		}
		src.addAll(this.data.output);
	},
	
	renderModel: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta);
	},
	destroy: function(){
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	},
});

TileRenderer.setRotationPlaceFunction(BlockID.genWatermill);




// file: machine/generator/rt_generator.js

IDRegistry.genBlockID("rtGenerator");
Block.createBlock("rtGenerator", [
	{name: "Radioisotope Thermoelectric Generator", texture: [["machine_bottom", 0], ["rt_generator_top", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]], inCreative: true},
], "stone");
TileRenderer.setStandartModel(BlockID.rtGenerator, [["machine_bottom", 0], ["rt_generator_top", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.rtGenerator, 0, [["machine_bottom", 0], ["rt_generator_top", 1], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);

MachineRegistry.setMachineDrop("rtGenerator", BlockID.primalGenerator);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.rtGenerator, count: 1, data: 0}, [
		"ccc",
		"c#c",
		"cxc"
	], ['#', BlockID.reactorChamber, 0, 'x', BlockID.primalGenerator, 0, 'c', ItemID.casingIron, 0]);
});

var guiRTGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Radioisotope Thermoelectric Generator")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 630, y: 150, bitmap: "energy_bar_background", scale: GUI_SCALE},
	],
	
	elements: {
		"slot0": {type: "slot", x: 420, y: 120, isValid: function(id){return id == ItemID.rtgPellet}},
		"slot1": {type: "slot", x: 480, y: 120, isValid: function(id){return id == ItemID.rtgPellet}},
		"slot2": {type: "slot", x: 540, y: 120, isValid: function(id){return id == ItemID.rtgPellet}},
		"slot3": {type: "slot", x: 420, y: 180, isValid: function(id){return id == ItemID.rtgPellet}},
		"slot4": {type: "slot", x: 480, y: 180, isValid: function(id){return id == ItemID.rtgPellet}},
		"slot5": {type: "slot", x: 540, y: 180, isValid: function(id){return id == ItemID.rtgPellet}},
		
		"energyScale": {type: "scale", x: 630 + GUI_SCALE * 4, y: 150, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"textInfo1": {type: "text", x: 742, y: 148, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 742, y: 178, width: 300, height: 30, text: "10000"}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiRTGenerator, "Radioisotope Thermoelectric Generator");
});

MachineRegistry.registerGenerator(BlockID.rtGenerator, {
    defaultValues: {
		meta: 0,
		isActive: false
	},
    
	getGuiScreen: function(){
		return guiRTGenerator;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		var output = 0.5;
		for(var i = 0; i < 6; i++){
			var slot = this.container.getSlot("slot"+i);
			if(slot.id == ItemID.rtgPellet){
				output *= 2;
			}
		}
		output = parseInt(output);
		this.setActive(output > 0);
		this.data.energy = Math.min(this.data.energy + output, energyStorage);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", this.data.energy + "/");
	},
	
	getEnergyStorage: function(){
		return 10000;
	},
	
	energyTick: function(type, src){
		var output = Math.min(32, this.data.energy);
		this.data.energy += src.add(output) - output;
	},
	
	renderModel: MachineRegistry.renderModel
});




// file: machine/generator/stirling_generator.js

IDRegistry.genBlockID("stirlingGenerator");
Block.createBlock("stirlingGenerator", [
	{name: "Stirling Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["stirling_generator", 0], ["heat_pipe", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.stirlingGenerator, [["machine_bottom", 0], ["machine_top", 0], ["stirling_generator", 0], ["heat_pipe", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.stirlingGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["stirling_generator", 0], ["heat_pipe", 0], ["machine_side", 0], ["machine_side", 0]]);

MachineRegistry.setMachineDrop("stirlingGenerator", BlockID.primalGenerator);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.stirlingGenerator, count: 1, data: 0}, [
		"cxc",
		"c#c",
		"ccc"
	], ['#', BlockID.primalGenerator, 0, 'c', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
});

MachineRegistry.registerGenerator(BlockID.stirlingGenerator, {
	defaultValues: {
		meta: 0,
		heat: 0
	},
	
	wrenchClick: function(id, count, data, coords){
		this.setFacing(coords);
	},
	
	setFacing: MachineRegistry.setFacing,
	
	canReceiveHeat: function(side){
		return this.data.meta == side + Math.pow(-1, side);
	},
	
	heatReceive: function(amount){
		if(this.data.energy == 0){
			this.data.energy = Math.round(amount / 2);
			return amount;
		}
		return 0;
	},
	
	energyTick: function(type, src){
		if(src.add(this.data.energy) < this.data.energy){
			this.data.energy = 0;
		}
	},
	
	renderModel: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta);
	}
});

TileRenderer.setRotationPlaceFunction(BlockID.stirlingGenerator, true);




// file: machine/generator/heat_solid.js

IDRegistry.genBlockID("solidHeatGenerator");
Block.createBlock("solidHeatGenerator", [
	{name: "Solid Fuel Firebox", texture: [["machine_bottom", 0], ["machine_top", 0], ["generator", 0], ["heat_pipe", 0], ["heat_generator_side", 0], ["heat_generator_side", 0]], inCreative: true},
], "stone");
TileRenderer.setStandartModel(BlockID.solidHeatGenerator, [["machine_bottom", 0], ["machine_top", 0], ["generator", 0], ["heat_pipe", 0], ["heat_generator_side", 0], ["heat_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.solidHeatGenerator, 0, [["heat_pipe", 0], ["generator", 0], ["machine_bottom", 0], ["machine_top", 0], ["heat_generator_side", 2], ["heat_generator_side", 2]]);
TileRenderer.registerRenderModel(BlockID.solidHeatGenerator, 1, [["generator", 0], ["heat_pipe", 0], ["machine_top", 0], ["machine_bottom", 0], ["heat_generator_side", 2], ["heat_generator_side", 2]]);
TileRenderer.registerRotationModel(BlockID.solidHeatGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["generator", 0], ["heat_pipe", 0], ["heat_generator_side", 0], ["heat_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.solidHeatGenerator, 6, [["heat_pipe", 1], ["generator", 0], ["machine_bottom", 0], ["machine_top", 0], ["heat_generator_side", 3], ["heat_generator_side", 3]]);
TileRenderer.registerRenderModel(BlockID.solidHeatGenerator, 7, [["generator", 0], ["heat_pipe", 1], ["machine_top", 0], ["machine_bottom", 0], ["heat_generator_side", 3], ["heat_generator_side", 3]]);
TileRenderer.registerRotationModel(BlockID.solidHeatGenerator, 8, [["machine_bottom", 0], ["machine_top", 0], ["generator", 1], ["heat_pipe", 1], ["heat_generator_side", 1], ["heat_generator_side", 1]]);

MachineRegistry.setMachineDrop("solidHeatGenerator");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.solidHeatGenerator, count: 1, data: 0}, [
		"a",
		"x",
		"f"
	], ['a', ItemID.heatConductor, 0, 'x', BlockID.machineBlockBasic, 0, 'f', 61, -1]);
	
	Recipes.addShaped({id: BlockID.solidHeatGenerator, count: 1, data: 0}, [
		" a ",
		"ppp",
		" f "
	], ['a', ItemID.heatConductor, 0, 'p', ItemID.plateIron, 0, 'f', BlockID.ironFurnace, 0]);
});


var guiSolidHeatGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Solid Fuel Firebox")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 450, y: 160, bitmap: "fire_background", scale: GUI_SCALE},
		{type: "bitmap", x: 521, y: 212, bitmap: "shovel_image", scale: GUI_SCALE+1},
		{type: "bitmap", x: 441, y: 330, bitmap: "heat_generator_info", scale: GUI_SCALE}
	],
	
	elements: {
		"slotFuel": {type: "slot", x: 441, y: 212, isValid: function(id, count, data){
			return Recipes.getFuelBurnDuration(id, data) > 0;
		}},
		"slotAshes": {type: "slot", x: 591, y: 212, isValid: function(){return false;}},
		"burningScale": {type: "scale", x: 450, y: 160, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_SCALE},
		"textInfo1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 500, y: 344, width: 300, height: 30, text: "0    /"},
		"textInfo2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 600, y: 344, width: 300, height: 30, text: "20"}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiSolidHeatGenerator, "Solid Fuel Firebox");
});

MachineRegistry.registerPrototype(BlockID.solidHeatGenerator, {
	defaultValues:{
		meta: 0,
		burn: 0,
		burnMax: 0,
		maxOutput:20,
		isActive: false
	},
	
	getGuiScreen: function(){
       return guiSolidHeatGenerator;
    },
	
	wrenchClick: function(id, count, data, coords){
		this.setFacing(coords);
	},
	
	setFacing: MachineRegistry.setFacing,
	
	getFuel: function(fuelSlot){
		if(fuelSlot.id > 0){
			var burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
			if(burn && !LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)){
				return burn;
			}
		}
		return 0;
	},
	
	spreadHeat: function(){
		var coords = StorageInterface.getRelativeCoords(this, this.data.meta);
		var TE = World.getTileEntity(coords.x, coords.y, coords.z);
		if(TE && TE.canReceiveHeat && TE.canReceiveHeat(this.data.meta)){
			return this.data.output = TE.heatReceive(20);
		}
		return false;
	},
	
    tick: function(){
		StorageInterface.checkHoppers(this);
		
		this.data.output = 0;
		var slot = this.container.getSlot("slotAshes");
		if(this.data.burn <= 0){
			var fuelSlot = this.container.getSlot("slotFuel");
			var burn = this.getFuel(fuelSlot) / 4;
			if(burn && ((slot.id == ItemID.ashes && slot.count < 64) || slot.id==0) && this.spreadHeat()){
				this.activate();
				this.data.burnMax = burn;
				this.data.burn = burn - 1;
				fuelSlot.count--;
				if(fuelSlot.count <= 0) fuelSlot.id = 0;
			} else {
				this.deactivate();
			}
		}
		else{
			this.data.burn--;
			if(this.data.burn==0 && Math.random() < 0.5){
				slot.id = ItemID.ashes;
				slot.count++;
			}
			this.spreadHeat();
		}
		
		this.container.setText("textInfo1", this.data.output + "    /");
		this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
    },
	
	renderModel: MachineRegistry.renderModelWith6Sides,
});

TileRenderer.setRotationPlaceFunction(BlockID.solidHeatGenerator, true);

StorageInterface.createInterface(BlockID.solidHeatGenerator, {
	slots: {
		"slotFuel": {input: true},
		"slotAshes": {output: true}
	},
	isValidInput: function(item){
		return Recipes.getFuelBurnDuration(item.id, item.data) > 0;
	}
});




// file: machine/generator/heat_fluid.js

IDRegistry.genBlockID("fluidHeatGenerator");
Block.createBlock("fluidHeatGenerator", [
	{name: "Liquid Fuel Firebox", texture: [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]], inCreative: true},
], "stone");
TileRenderer.setStandartModel(BlockID.fluidHeatGenerator, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 0, [["heat_pipe", 0], ["fluid_heat_generator_back", 0], ["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_side", 2], ["fluid_heat_generator_side", 2]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 1, [["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["machine_top", 0], ["machine_bottom", 0], ["fluid_heat_generator_side", 2], ["fluid_heat_generator_side", 2]]);
TileRenderer.registerRotationModel(BlockID.fluidHeatGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 6, [["heat_pipe", 1], ["fluid_heat_generator_back", 0], ["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_side", 3], ["fluid_heat_generator_side", 3]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 7, [["fluid_heat_generator_back", 0], ["heat_pipe", 1], ["machine_top", 0], ["machine_bottom", 0], ["fluid_heat_generator_side", 3], ["fluid_heat_generator_side", 3]]);
TileRenderer.registerRotationModel(BlockID.fluidHeatGenerator, 8, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 1], ["heat_pipe", 1], ["fluid_heat_generator_side", 1], ["fluid_heat_generator_side", 1]]);

MachineRegistry.setMachineDrop("fluidHeatGenerator");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.fluidHeatGenerator, count: 1, data: 0}, [
		"pcp",
		"cxc",
		"pcp"
	], ['x', ItemID.heatConductor, 0, 'c', ItemID.cellEmpty, 0, 'p', ItemID.casingIron, 0]);
});


var guiFluidHeatGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Liquid Fuel Firebox")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 581, y: 75, bitmap: "liquid_bar", scale: GUI_SCALE},
		{type: "bitmap", x: 459, y: 139, bitmap: "liquid_bar_arrow", scale: GUI_SCALE},
		{type: "bitmap", x: 660, y: 102, bitmap: "fluid_heat_generator_info", scale: GUI_SCALE},
		{type: "bitmap", x: 660, y: 176, bitmap: "fluid_heat_generator_info", scale: GUI_SCALE}
	],
	
	elements: {
		"liquidScale": {type: "scale", x: 581 + 4*GUI_SCALE, y: 75 + 4*GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 440, y: 75,
			isValid: function(id, count, data){
				var empty = LiquidLib.getEmptyItem(id, data);
				if(!empty) return false;
				return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
			}
		},
		"slot2": {type: "slot", x: 440, y: 183, isValid: function(){return false;}},
		"textInfo1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 670, y: 112, width: 300, height: 30, text: "Emit: 0"},
		"textInfo2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 670, y: 186, width: 300, height: 30, text: "Max Emit: 0"}
	}
});


Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiFluidHeatGenerator, "Liquid Fuel Firebox");
});

MachineRegistry.registerPrototype(BlockID.fluidHeatGenerator, {
	defaultValues: {
		meta: 0,
		output: 0,
		fuel: 0,
		liquid: null,
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiFluidHeatGenerator;
	},
	
	setFacing: MachineRegistry.setFacing,
	
	init: function(){
		this.liquidStorage.setLimit(null, 10);
		this.renderModel();
	},
	
	getLiquidFromItem: MachineRegistry.getLiquidFromItem,
	
	click: function(id, count, data, coords){
		var liquid = this.liquidStorage.getLiquidStored();
		if(Entity.getSneaking(player) && this.getLiquidFromItem(liquid, {id: id, count: count, data: data}, null, true)){
			return true;
		}
		if(ICTool.isValidWrench(id, data, 10)){
			if(this.setFacing(coords))
				ICTool.useWrench(id, data, 10);
			return true;
		}
		return false;
	},
	
	tick: function(){
		StorageInterface.checkHoppers(this);
		var liquid = this.liquidStorage.getLiquidStored();
		var slot1 = this.container.getSlot("slot1");
		var slot2 = this.container.getSlot("slot2");
		this.getLiquidFromItem(liquid, slot1, slot2);
		
		var fuel = MachineRecipeRegistry.getRecipeResult("fluidFuel", this.data.liquid || liquid);
		if(fuel && this.data.fuel <= 0 && this.liquidStorage.getAmount(liquid).toFixed(3) >= fuel.amount/1000 && this.spreadHeat(fuel.power*2)){
			this.liquidStorage.getLiquid(liquid, fuel.amount/1000);
			this.data.fuel = fuel.amount;
			this.data.liquid = liquid;
		}
		if(fuel && this.data.fuel > 0){
			if(this.data.fuel < fuel.amount){
				this.spreadHeat(fuel.power*2);
			}
			this.data.fuel -= fuel.amount/20;
			this.activate();
			this.container.setText("textInfo2", "Max Emit: " + fuel.power * 2);
			this.startPlaySound("Generators/GeothermalLoop.ogg");
		}
		else {
			this.data.liquid = null;
			this.stopPlaySound();
			this.deactivate();
			this.container.setText("textInfo1", "Emit: 0");
			this.container.setText("textInfo2", "Max Emit: 0");
		}
		
		this.liquidStorage.updateUiScale("liquidScale", liquid);
	},
	
	getEnergyStorage: function(){
		return 10000;
	},
	
	spreadHeat: function(heat){
		var coords = StorageInterface.getRelativeCoords(this, this.data.meta);
		var TE = World.getTileEntity(coords.x, coords.y, coords.z);
		if(TE && TE.canReceiveHeat && TE.canReceiveHeat(this.data.meta)){
			var output = TE.heatReceive(heat);
			this.container.setText("textInfo1", "Emit: " + output);
			return output;
		}
		return false;
	},
	
	renderModel: MachineRegistry.renderModelWith6Sides
});

TileRenderer.setRotationPlaceFunction(BlockID.fluidHeatGenerator, true);

StorageInterface.createInterface(BlockID.fluidHeatGenerator, {
	slots: {
		"slot1": {input: true},
		"slot2": {output: true}
	},
	isValidInput: function(item){
		var empty = LiquidLib.getEmptyItem(item.id, item.data);
		if(!empty) return false;
		return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
	},
	canReceiveLiquid: function(liquid, side){
		return MachineRecipeRegistry.hasRecipeFor("fluidFuel", liquid)
	},
	canTransportLiquid: function(liquid, side){ return false; }
});




// file: machine/generator/heat_electric.js

IDRegistry.genBlockID("electricHeatGenerator");
Block.createBlock("electricHeatGenerator", [
	{name: "Electric Heater", texture: [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true},
], "stone");
TileRenderer.setStandartModel(BlockID.electricHeatGenerator, [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.electricHeatGenerator, 0, [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.electricHeatGenerator, 6, [["machine_bottom", 0], ["ind_furnace_side", 1], ["heat_generator_side", 1], ["heat_pipe", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]]);

ItemName.addTierTooltip("electricHeatGenerator", 4);

MachineRegistry.setMachineDrop("electricHeatGenerator");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.electricHeatGenerator, count: 1, data: 0}, [
		"xbx",
		"x#x",
		"xax"
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.casingIron, 0, 'a', ItemID.heatConductor, 0, 'b', ItemID.storageBattery, -1]);
});


var guiElectricHeatGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Electric Heater")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 342, y: 110, bitmap: "energy_small_background", scale: GUI_SCALE},
		{type: "bitmap", x: 461, y: 250, bitmap: "heat_generator_info", scale: GUI_SCALE}
	],
	
	elements: {
		"slot0": {type: "slot", x: 440, y: 120, maxStackSize: 1, isValid: function(id){return id == ItemID.coil}},
		"slot1": {type: "slot", x: 500, y: 120, maxStackSize: 1, isValid: function(id){return id == ItemID.coil}},
		"slot2": {type: "slot", x: 560, y: 120, maxStackSize: 1, isValid: function(id){return id == ItemID.coil}},
		"slot3": {type: "slot", x: 620, y: 120, maxStackSize: 1, isValid: function(id){return id == ItemID.coil}},
		"slot4": {type: "slot", x: 680, y: 120, maxStackSize: 1, isValid: function(id){return id == ItemID.coil}},
		"slot5": {type: "slot", x: 440, y: 180, maxStackSize: 1, isValid: function(id){return id == ItemID.coil}},
		"slot6": {type: "slot", x: 500, y: 180, maxStackSize: 1, isValid: function(id){return id == ItemID.coil}},
		"slot7": {type: "slot", x: 560, y: 180, maxStackSize: 1, isValid: function(id){return id == ItemID.coil}},
		"slot8": {type: "slot", x: 620, y: 180, maxStackSize: 1, isValid: function(id){return id == ItemID.coil}},
		"slot9": {type: "slot", x: 680, y: 180, maxStackSize: 1, isValid: function(id){return id == ItemID.coil}},
		"slotEnergy": {type: "slot", x: 340, y: 180, isValid: MachineRegistry.isValidEUStorage},
		"energyScale": {type: "scale", x: 342, y: 110, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"textInfo1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 530, y: 264, width: 300, height: 30, text: "0    /"},
		"textInfo2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 630, y: 264, width: 300, height: 30, text: "0"}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiElectricHeatGenerator, "Electric Heater");
});

MachineRegistry.registerElectricMachine(BlockID.electricHeatGenerator, {
    defaultValues: {
		meta: 0,
		energy_storage: 2000,
		isActive: false
	},
    
	getGuiScreen: function(){
		return guiElectricHeatGenerator;
	},
	
	getTier: function(){
		return 4;
	},
	
	wrenchClick: function(id, count, data, coords){
		this.setFacing(coords);
	},
	
	setFacing: MachineRegistry.setFacing,
	
	calcOutput: function(){
		var maxOutput = 0;
		for(var i = 0; i < 10; i++){
			var slot = this.container.getSlot("slot"+i);
			if(slot.id == ItemID.coil){
				maxOutput += 10;
			}
		}
		return maxOutput;
	},
	
	tick: function(){
		var maxOutput = this.calcOutput();
		var output = 0;
		
		if(this.data.energy >= 1){
			var coords = StorageInterface.getRelativeCoords(this, this.data.meta);
			var TE = World.getTileEntity(coords.x, coords.y, coords.z);
			if(TE && TE.canReceiveHeat && TE.canReceiveHeat(this.data.meta)){
				output = TE.heatReceive(Math.min(maxOutput, this.data.energy));
				if(output > 0){
					this.activate();
					this.data.energy -= output;
					this.container.setText("textInfo1", output + "    /");
				}
			}
		}
		if(output == 0){
			this.deactivate();
			this.container.setText("textInfo1", "0    /");
		}
		
		var energyStorage = this.getEnergyStorage()
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, 4);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo2", maxOutput);
	},
	
	getEnergyStorage: function(){
		return 2000;
	},
	
	renderModel: MachineRegistry.renderModelWith6Sides
});

TileRenderer.setRotationPlaceFunction(BlockID.electricHeatGenerator, true);




// file: machine/reactor/reactorAPI.js

let ReactorAPI = {
	reactor_components: {},
	
	registerComponent: function(id, component) {
		if (component.maxDamage) {
			Item.setMaxDamage(id, 27);
		}
		if (component.getMaxHeat() > 0) {
			Item.addToCreative(id, 1, 1);
		}
		this.reactor_components[id] = component;
	},
	
	getComponent: function(id) {
		return this.reactor_components[id];
	},
	
	isReactorItem: function(id) {
		return this.getComponent(id)? true : false;
	},
	
	reactorComponent: function() {
		this.processChamber = function(item, reactor, x, y, heatRun) { },
		
		this.acceptUraniumPulse = function(item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
			return false;
		},

		this.canStoreHeat = function(item) {
			return false;
		},

		this.getMaxHeat = function(item) {
			return 0;
		},

		this.getCurrentHeat = function(item) {
			return 0;
		},

		this.alterHeat = function(item, reactor, x, y, heat) {
			return heat;
		},

		this.influenceExplosion = function(item, reactor) {
			return 0;
		}
	},
	
	damageableReactorComponent: function(durability){
		this.parent = ReactorAPI.reactorComponent;
		this.parent();
		
		this.maxDamage = durability;
		
		this.getCustomDamage = function(item){
			return item.extra ? item.extra.getInt("damage") : 0;
		}
		
		this.setCustomDamage = function(item, damage){
			if(!item.extra) item.extra = new ItemExtraData();
			item.data = 1 + Math.ceil(damage / this.maxDamage * 26);
		}
		
		this.applyCustomDamage = function(item, damage){
			this.setCustomDamage(item, this.getCustomDamage(item) + damage);
		}
	},
	
	fuelRod: function(cells, durability, depleted) {
		this.parent = ReactorAPI.damageableReactorComponent;
		this.parent(durability);
		
		this.numberOfCells = cells;
		this.depletedItem = depleted;
		this.processChamber = function(item, reactor, x, y, heatRun) {
			let basePulses = parseInt(1 + this.numberOfCells / 2);
			for (let i = 0; i < this.numberOfCells; i++) {
				let dheat = 0;
				let pulses = basePulses;
				if (!heatRun) {
					for (let i = 0; i < pulses; i++) {
						this.acceptUraniumPulse(item, reactor, item, x, y, x, y, heatRun);
					}
					pulses += this.checkPulseable(reactor, x - 1, y, item, x, y, heatRun) + this.checkPulseable(reactor, x + 1, y, item, x, y, heatRun) + this.checkPulseable(reactor, x, y - 1, item, x, y, heatRun) + this.checkPulseable(reactor, x, y + 1, item, x, y, heatRun);
					continue;
				}
				pulses += this.checkPulseable(reactor, x - 1, y, item, x, y, heatRun) + this.checkPulseable(reactor, x + 1, y, item, x, y, heatRun) + this.checkPulseable(reactor, x, y - 1, item, x, y, heatRun) + this.checkPulseable(reactor, x, y + 1, item, x, y, heatRun);
				let heat = this.triangularNumber(pulses) * 4;
				let heatAcceptors = [];
				this.checkHeatAcceptor(reactor, x - 1, y, heatAcceptors);
				this.checkHeatAcceptor(reactor, x + 1, y, heatAcceptors);
				this.checkHeatAcceptor(reactor, x, y - 1, heatAcceptors);
				this.checkHeatAcceptor(reactor, x, y + 1, heatAcceptors);
				heat = this.getFinalHeat(item, reactor, x, y, heat);
				for(let j = 0; j < heatAcceptors.length; j++){
					heat += dheat;
					if(heat <= 0) break;
					dheat = heat / (heatAcceptors.length - j);
					heat -= dheat;
					let acceptor = heatAcceptors[j];
					dheat = acceptor.comp.alterHeat(acceptor.item, reactor, acceptor.x, acceptor.y, dheat);
				}
				if (heat <= 0) continue;
				reactor.addHeat(heat);
			}
			if (!heatRun && this.getCustomDamage(item) + 1 >= this.maxDamage) {
				reactor.setItemAt(x, y, this.depletedItem, 1);
			} else if (!heatRun) {
				this.applyCustomDamage(item, 1);
			}
		}
		
		this.checkPulseable = function(reactor, x, y, slot, mex, mey, heatrun) {
			let item = reactor.getItemAt(x, y);
			if(item){
				let component = ReactorAPI.getComponent(item.id);
				if(component && component.acceptUraniumPulse(item, reactor, slot, x, y, mex, mey, heatrun)){
					return 1;
				}
			}
			return 0;
		}

		this.triangularNumber = function(x) {
			return (x * x + x) / 2;
		}

		this.checkHeatAcceptor = function(reactor, x, y, heatAcceptors) {
			let item = reactor.getItemAt(x, y);
			if (item){
				let component = ReactorAPI.getComponent(item.id);
				if(component && component.canStoreHeat(item)){
					let acceptor = {comp: component, item: item, x: x, y: y}
					heatAcceptors.push(acceptor);
				}
			}
		}
		
		this.acceptUraniumPulse = function(item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
			if (!heatrun) {
				reactor.addOutput(1);
			}
			return true;
		}
		
		this.getFinalHeat = function(item, reactor, x, y, heat) {
			return heat;
		}
		
		this.influenceExplosion = function(item, reactor) {
			return 2 * this.numberOfCells;
		}
	},
	
	fuelRodMOX: function(cells, durability, depleted) {
		this.parent = ReactorAPI.fuelRod;
		this.parent(cells, durability, depleted);
		
		this.acceptUraniumPulse = function(item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
			if (!heatrun) {
				let breedereffectiveness = reactor.getHeat() / reactor.getMaxHeat();
				let output = 4 * breedereffectiveness + 1;
				reactor.addOutput(output);
			}
			return true;
		}
		/*
		this.getFinalHeat = function(item, reactor, x, y, heat) {
			let breedereffectiveness;
			if (reactor.isFluidCooled() && (breedereffectiveness = reactor.getHeat() / reactor.getMaxHeat()) > 0.5) {
				heat *= 2;
			}
			return heat;
		}
		*/
	},
	
	plating: function(maxHeatAdd, effectModifier) {
		this.parent = ReactorAPI.reactorComponent;
		this.parent();
		
		this.maxHeatAdd = maxHeatAdd;
		this.effectModifier = effectModifier;
		
		this.processChamber = function(item, reactor, x, y, heatrun) {
			if (heatrun) {
				reactor.setMaxHeat(reactor.getMaxHeat() + this.maxHeatAdd);
				reactor.setHeatEffectModifier(reactor.getHeatEffectModifier() * this.effectModifier);
			}
		}
		
		this.influenceExplosion = function(item, reactor) {
			if (this.effectModifier >= 1) {
				return 0;
			}
			return this.effectModifier;
		}
	},
	
	reflector: function(maxDamage) {
		this.parent = ReactorAPI.damageableReactorComponent;
		this.parent(maxDamage);
		
		this.acceptUraniumPulse = function(item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
			if (!heatrun) {
				let source = ReactorAPI.getComponent(pulsingItem.id);
				source.acceptUraniumPulse(pulsingItem, reactor, item, pulseX, pulseY, youX, youY, heatrun);
			}
			else if (this.getCustomDamage + 1 >= this.maxDamage) {
				reactor.setItemAt(youX, youY, 0);
			} else {
				this.applyCustomDamage(item, 1);
			}
			return true;
		}
		
		this.influenceExplosion = function(item, reactor) {
			return -1;
		}
	},
	
	reflectorIridium: function() {
		this.parent = ReactorAPI.reactorComponent;
		this.parent();
		
		this.acceptUraniumPulse = function(item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
			if (!heatrun) {
				let source = ReactorAPI.getComponent(pulsingItem.id);
				source.acceptUraniumPulse(pulsingItem, reactor, item, pulseX, pulseY, youX, youY, heatrun);
			}
			return true;
		}
		
		this.influenceExplosion = function(item, reactor) {
			return -1;
		}
	},
	
	heatStorage: function(heatStorage) {
		this.parent = ReactorAPI.damageableReactorComponent;
		this.parent(heatStorage);
				
		this.canStoreHeat = function(item) {
			return true;
		}

		this.getMaxHeat = function(item) {
			return this.maxDamage;
		}
		
		this.getCurrentHeat = function(item){
			return this.getCustomDamage(item);
		}

		this.alterHeat = function(item, reactor, x, y, heat) {
			let myHeat = this.getCurrentHeat(item);
			let max = this.getMaxHeat(item);
			if ((myHeat += heat) > max) {
				reactor.setItemAt(x, y, 0);
				heat = max - myHeat + 1;
			} else {
				if (myHeat < 0) {
					heat = myHeat;
					myHeat = 0;
				} else {
					heat = 0;
				}
				this.setCustomDamage(item, myHeat);
			}
			return heat;
		}
	},
	
	heatExchanger: function(heatStorage, switchSide, switchReactor) {
		this.parent = ReactorAPI.heatStorage;
		this.parent(heatStorage);
		
		this.switchSide = switchSide;
		this.switchReactor = switchReactor;
		
		this.processChamber = function(item, reactor, x, y, heatrun) {
			if (!heatrun) {
				return;
			}
			let myHeat = 0;
			let heatAcceptors = [];
			if (this.switchSide > 0) {
				this.checkHeatAcceptor(reactor, x - 1, y, heatAcceptors);
				this.checkHeatAcceptor(reactor, x + 1, y, heatAcceptors);
				this.checkHeatAcceptor(reactor, x, y - 1, heatAcceptors);
				this.checkHeatAcceptor(reactor, x, y + 1, heatAcceptors);
				
				for (let i in heatAcceptors) {
					let acceptor = heatAcceptors[i];
					let heatable = acceptor.comp;
					let mymed = this.getCurrentHeat(item) * 100 / this.getMaxHeat(item);
					let heatablemed = heatable.getCurrentHeat(acceptor.item) * 100 / heatable.getMaxHeat(acceptor.item);
					let add = parseInt(heatable.getMaxHeat(acceptor.item) / 100 * (heatablemed + mymed / 2));
					if (add > this.switchSide) {
						add = this.switchSide;
					}
					if (heatablemed + mymed / 2 < 1) {
						add = this.switchSide / 2;
					}
					if (heatablemed + mymed / 2 < 0.75) {
						add = this.switchSide / 4;
					}
					if (heatablemed + mymed / 2 < 0.5) {
						add = this.switchSide / 8;
					}
					if (heatablemed + mymed / 2 < 0.25) {
						add = 1;
					}
					if (Math.round(heatablemed * 10) / 10 > Math.round(mymed * 10) / 10) {
						add -= 2 * add;
					} else if (Math.round(heatablemed * 10) / 10 == Math.round(mymed * 10) / 10) {
						add = 0;
					}
					myHeat -= add;
					add = heatable.alterHeat(acceptor.item, reactor, acceptor.x, acceptor.y, add);
					myHeat += add;
				}
			}
			if (this.switchReactor > 0) {
				let mymed = this.getCurrentHeat(item, reactor, x, y) * 100 / this.getMaxHeat(item);
				let Reactormed = reactor.getHeat() * 100 / reactor.getMaxHeat();
				let add = Math.round(reactor.getMaxHeat() / 100 * (Reactormed + mymed / 2));
				if (add > this.switchReactor) {
					add = this.switchReactor;
				}
				if (Reactormed + mymed / 2 < 1) {
					add = this.switchSide / 2;
				}
				if (Reactormed + mymed / 2 < 0.75) {
					add = this.switchSide / 4;
				}
				if (Reactormed + mymed / 2 < 0.5) {
					add = this.switchSide / 8;
				}
				if (Reactormed + mymed / 2 < 0.25) {
					add = 1;
				}
				if (Math.round(Reactormed * 10) / 10 > Math.round(mymed * 10) / 10) {
					add -= 2 * add;
				} else if (Math.round(Reactormed * 10) / 10 == Math.round(mymed * 10) / 10) {
					add = 0;
				}
				myHeat -= add;
				reactor.setHeat(reactor.getHeat() + add);
			}
			this.alterHeat(item, reactor, x, y, myHeat);
		}

		this.checkHeatAcceptor = function(reactor, x, y, heatAcceptors) {
			let item = reactor.getItemAt(x, y);
			if (item){
				let component = ReactorAPI.getComponent(item.id);
				if(component && component.canStoreHeat(item)){
					let acceptor = {comp: component, item: item, x: x, y: y}
					heatAcceptors.push(acceptor);
				}
			}
		}
	},
	
	heatVent: function(heatStorage, selfVent, reactorVent) {
		this.parent = ReactorAPI.heatStorage;
		this.parent(heatStorage);
		
		this.selfVent = selfVent;
        this.reactorVent = reactorVent;
		this.processChamber = function(item, reactor, x, y, heatrun) {
			if (heatrun) {
				if (this.reactorVent > 0) {
					let rheat = reactor.getHeat();
					let reactorDrain = rheat;
					if (reactorDrain > this.reactorVent) {
						reactorDrain = this.reactorVent;
					}
					rheat -= reactorDrain;
					if ((reactorDrain = this.alterHeat(item, reactor, x, y, reactorDrain)) > 0) {
						return;
					}
					reactor.setHeat(rheat);
				}
				let self = this.alterHeat(item, reactor, x, y, -this.selfVent);
				/* if (self <= 0) {
					reactor.addEmitHeat(self + this.selfVent);
				} */
			}
		}
	},
	
	heatVentSpread: function(sideVent) {
		this.parent = ReactorAPI.reactorComponent;
		this.parent();
		
		this.sideVent = sideVent;
		this.processChamber = function(item, reactor, x, y, heatrun) {
			if (heatrun) {
				this.cool(reactor, x - 1, y);
				this.cool(reactor, x + 1, y);
				this.cool(reactor, x, y - 1);
				this.cool(reactor, x, y + 1);
			}
		}

		this.cool = function(reactor, x, y) {
			let item = reactor.getItemAt(x, y);
			if (item) {
				let comp = ReactorAPI.getComponent(item.id);
				if(comp && comp.canStoreHeat(item)){
					comp.alterHeat(item, reactor, x, y, -this.sideVent);
					//reactor.addEmitHeat(self + this.sideVent);
				}
			}
		}
	},
	
	condensator: function(maxDmg) {
		this.parent = ReactorAPI.damageableReactorComponent;
		this.parent(maxDmg);
				
		this.canStoreHeat = function(item) {
			return this.getCurrentHeat(item) < this.maxDamage;
		}
		
		this.getMaxHeat = function(item) {
			return this.maxDamage;
		}

		this.getCurrentHeat = function(item) {
			return this.getCustomDamage(item);
		}
		
		this.alterHeat = function(item, reactor, x, y, heat) {
			if (heat < 0) {
				return heat;
			}
			let currentHeat = this.getCurrentHeat(item);
			let amount = Math.min(heat, this.getMaxHeat(item) - currentHeat);
			this.setCustomDamage(item, currentHeat + amount);
			return heat - amount;
		}
	},
}




// file: machine/reactor/nuclear_reactor.js

IDRegistry.genBlockID("nuclearReactor");
Block.createBlock("nuclearReactor", [
	{name: "Nuclear Reactor", texture: [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]], inCreative: true},
], "stone");
ItemName.setRarity(BlockID.nuclearReactor, 1, true);
TileRenderer.setStandartModel(BlockID.nuclearReactor, [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]]);
TileRenderer.registerRenderModel(BlockID.nuclearReactor, 0, [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1]]);

IDRegistry.genBlockID("reactorChamber");
Block.createBlock("reactorChamber", [
	{name: "Reactor Chamber", texture: [["machine_bottom", 0], ["machine_top", 0], ["reactor_chamber", 0], ["reactor_chamber", 0], ["reactor_chamber", 0], ["reactor_chamber", 0]], inCreative: true},
], "stone");
ItemName.setRarity(BlockID.reactorChamber, 1, true);

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

let reactorElements = {
	"heatScale": {type: "scale", x: 346, y: 376, direction: 0, value: 0.5, bitmap: "reactor_heat_scale", scale: 3},
	"textInfo": {type: "text", font: {size: 24, color: Color.GREEN}, x: 655, y: 382, width: 256, height: 42, text: Translation.translate("Generating: ")},
}

for(let y = 0; y < 6; y++){
	for(let x = 0; x < 9; x++){
		let i = y*9+x;
		reactorElements["slot"+i] = {type: "slot", x: 400 + 54 * x, y: 40 + 54 * y, size: 54, maxStackSize: 1, isValid: function(id, count, data){
			return ReactorAPI.isReactorItem(id);
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
		{type: "bitmap", x: 340, y: 370, bitmap: "reactor_info", scale: GUI_SCALE},
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
		
	getGuiScreen: function(){
		return guiNuclearReactor;
	},
	
	init: function(){
		this.chambers = [];
		this.renderModel();
		this.__initialized = true;
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
		if(!this.__initialized || chamber.removed || (chamber.core && chamber.core != this)){
			return;
		}
		if(this.chambers.indexOf(chamber) == -1){
			this.chambers.push(chamber);
			chamber.core = this;
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
					let newX = (x < reactorSize) ? 400 + 54 * x : 1400;
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
			RadiationAPI.addRadiationSource(this.x + 0.5, this.y + 0.5, this.z + 0.5, this.data.boomPower, 600);
			World.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, this.data.boomPower);
			this.selfDestroy();
		}
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
				if(canTakeDamage(ent, "radiation")){
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
					let c = World.getRelativeCoords(coord.x, coord.y, coord.z, i);
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
	
	onItemClick: function(id, count, data, coords){
		if (id == ItemID.debugItem || id == ItemID.EUMeter) return false;
		if (this.click(id, count, data, coords)) return true;
		if (Entity.getSneaking(player)) return false;
		var gui = this.getGuiScreen();
		if (gui){
			this.core.container.openAs(gui);
			return true;
		}
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
	}
});

Block.registerPlaceFunction(BlockID.nuclearReactor, function(coords, item, block){
	let x = coords.relative.x;
	let y = coords.relative.y;
	let z = coords.relative.z;
	for (let i = 0; i < 6; i++) {
		let c = World.getRelativeCoords(x, y, z, i);
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
	let x = coords.relative.x;
	let y = coords.relative.y;
	let z = coords.relative.z;
	let reactorConnect = 0;
	for (let i = 0; i < 6; i++) {
		let c = World.getRelativeCoords(x, y, z, i);
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




// file: machine/storage/bat_box.js

IDRegistry.genBlockID("storageBatBox");
Block.createBlock("storageBatBox", [
	{name: "BatBox", texture: [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_back", 0], ["batbox_front", 0], ["batbox_side", 0], ["batbox_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.storageBatBox, [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_back", 0], ["batbox_front", 0], ["batbox_side", 0], ["batbox_side", 0]]);
TileRenderer.registerRenderModel(BlockID.storageBatBox, 0, [["batbox_front", 0], ["batbox_back", 0], ["batbox_top", 0], ["batbox_bottom", 0], ["batbox_side", 1], ["batbox_side", 2]]);
TileRenderer.registerRenderModel(BlockID.storageBatBox, 1, [["batbox_back", 0], ["batbox_front", 0], ["batbox_top", 0], ["batbox_bottom", 0], ["batbox_side", 1], ["batbox_side", 2]]);
TileRenderer.registerRenderModel(BlockID.storageBatBox, 2, [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_front", 0], ["batbox_back", 0], ["batbox_side", 0], ["batbox_side", 0]]);
TileRenderer.registerRenderModel(BlockID.storageBatBox, 3, [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_back", 0], ["batbox_front", 0], ["batbox_side", 0], ["batbox_side", 0]]);
TileRenderer.registerRenderModel(BlockID.storageBatBox, 4, [["batbox_bottom", 0], ["batbox_top", 1], ["batbox_side", 0], ["batbox_side", 0], ["batbox_front", 0], ["batbox_back", 0]]);
TileRenderer.registerRenderModel(BlockID.storageBatBox, 5, [["batbox_bottom", 0], ["batbox_top", 1], ["batbox_side", 0], ["batbox_side", 0], ["batbox_back", 0], ["batbox_front", 0]]);

Block.registerDropFunction("storageBatBox", function(coords, blockID, blockData, level){
	MachineRegistry.getMachineDrop(coords, blockID, level);
	return [];
});

ItemName.addStorageBlockTooltip("storageBatBox", 1, "40K");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.storageBatBox, count: 1, data: 0}, [
		"xax",
		"bbb",
		"xxx"
	], ['a', ItemID.cableTin1, 0, 'x', 5, -1, 'b', ItemID.storageBattery, -1]);
});


var guiBatBox = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("BatBox")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 441, y: 75, isValid: MachineRegistry.isValidEUItem},
		"slot2": {type: "slot", x: 441, y: 212, isValid: MachineRegistry.isValidEUStorage},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 350, height: 30, text: "40000"}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiBatBox, "BatBox");
});

MachineRegistry.registerEUStorage(BlockID.storageBatBox, {
	defaultValues: {
		meta: 0
	},
	
	getGuiScreen: function(){
		return guiBatBox;
	},
	
	getTier: function(){
		return 1;
	},
	
	wrenchClick: function(id, count, data, coords){
		if(this.setFacing(coords)){
			EnergyNetBuilder.rebuildTileNet(this);
			return true;
		}
		return false;
	},
		
	setFacing: MachineRegistry.setFacing,
	
	tick: function(){
		StorageInterface.checkHoppers(this);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), "Eu", energyStorage - this.data.energy, 1);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), "Eu", this.data.energy, 1);
		
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage);
	},
	
	getEnergyStorage: function(){
		return 40000;
	},
	
	canReceiveEnergy: function(side, type){
		return side != this.data.meta;
	},
	
	canExtractEnergy: function(side, type){
		return side == this.data.meta;
	},
	
	destroyBlock: function(coords, player){
		var extra;
		if(this.data.energy > 0){
			extra = new ItemExtraData();
			extra.putInt("energy", this.data.energy);
		}
		World.drop(coords.x + .5, coords.y + .5, coords.z + .5, BlockID.storageBatBox, 1, 0, extra);
	},
	
	renderModel: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta);
	},
	destroy: function(){
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	}
});

MachineRegistry.setStoragePlaceFunction("storageBatBox", true);
ToolAPI.registerBlockMaterial(BlockID.storageBatBox, "wood");

StorageInterface.createInterface(BlockID.storageBatBox, {
	slots: {
		"slot1": {input: true, output: true, 
			isValid: function(item, side, tileEntity){
				return side == 1 && ChargeItemRegistry.isValidItem(item.id, "Eu", 1);
			},
			canOutput: function(item, side, tileEntity){
				return item.data <= 1;
			}
		},
		"slot2": {input: true, output: true,
			isValid: function(item, side, tileEntity){
				return side > 1 && ChargeItemRegistry.isValidStorage(item.id, "Eu", 1);
			},
			canOutput: function(item, side, tileEntity){
				return item.data == Item.getMaxDamage(item.id);
			}
		}
	}
});




// file: machine/storage/CESU.js

IDRegistry.genBlockID("storageCESU");
Block.createBlock("storageCESU", [
	{name: "CESU", texture: [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.storageCESU, [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]]);
TileRenderer.registerRenderModel(BlockID.storageCESU, 0, [["cesu_front", 0], ["cesu_back", 0], ["cesu_top", 0], ["cesu_top", 0], ["cesu_side", 1], ["cesu_side", 1]]);
TileRenderer.registerRenderModel(BlockID.storageCESU, 1, [["cesu_back", 0], ["cesu_front", 0], ["cesu_top", 0], ["cesu_top", 0], ["cesu_side", 1], ["cesu_side", 1]]);
TileRenderer.registerRotationModel(BlockID.storageCESU, 2, [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]]);

Block.registerDropFunction("storageCESU", function(coords, blockID, blockData, level){
	return [];
});

ItemName.addStorageBlockTooltip("storageCESU", 2, "300K");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.storageCESU, count: 1, data: 0}, [
		"bxb",
		"aaa",
		"bbb"
	], ['x', ItemID.cableCopper1, 0, 'a', ItemID.storageAdvBattery, -1, 'b', ItemID.plateBronze, 0]);
});


var guiCESU = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("CESU")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 441, y: 75, isValid: MachineRegistry.isValidEUItem},
		"slot2": {type: "slot", x: 441, y: 212, isValid: MachineRegistry.isValidEUStorage},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 300, height: 30, text: "300000"}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiCESU, "CESU");
});

MachineRegistry.registerEUStorage(BlockID.storageCESU, {
	defaultValues: {
		meta: 0
	},
	
	getGuiScreen: function(){
		return guiCESU;
	},
	
	getTier: function(){
		return 2;
	},
	
	wrenchClick: function(id, count, data, coords){
		if(this.setFacing(coords)){
			EnergyNetBuilder.rebuildTileNet(this);
			return true;
		}
		return false;
	},
		
	setFacing: MachineRegistry.setFacing,
	
	tick: function(){
		StorageInterface.checkHoppers(this);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), "Eu", energyStorage - this.data.energy, 2);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), "Eu", this.data.energy, 2);
		
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage);
	},
	
	getEnergyStorage: function(){
		return 300000;
	},
	
	canReceiveEnergy: function(side){
		return side != this.data.meta;
	},
	
	canExtractEnergy: function(side){
		return side == this.data.meta;
	},
	
	destroyBlock: function(coords, player){
		var itemID = Player.getCarriedItem().id;
		var level = ToolAPI.getToolLevelViaBlock(itemID, this.blockID)
		var drop = MachineRegistry.getMachineDrop(coords, this.blockID, level, this.blockID, this.data.energy);
		if(drop.length > 0){
			World.drop(coords.x + .5, coords.y + .5, coords.z + .5, drop[0][0], drop[0][1], drop[0][2]);
		}
	},
	
	renderModel: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta);
	},
	destroy: function(){
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	}
});

MachineRegistry.setStoragePlaceFunction("storageCESU", true);

StorageInterface.createInterface(BlockID.storageCESU, {
	slots: {
		"slot1": {input: true, output: true, 
			isValid: function(item, side, tileEntity){
				return side == 1 && ChargeItemRegistry.isValidItem(item.id, "Eu", 2);
			},
			canOutput: function(item, side, tileEntity){
				return item.data <= 1;
			}
		},
		"slot2": {input: true, output: true,
			isValid: function(item, side, tileEntity){
				return side > 1 && ChargeItemRegistry.isValidStorage(item.id, "Eu", 2);
			},
			canOutput: function(item, side, tileEntity){
				return item.data == Item.getMaxDamage(item.id);
			}
		}
	}
});




// file: machine/storage/MFE.js

IDRegistry.genBlockID("storageMFE");
Block.createBlock("storageMFE", [
	{name: "MFE", texture: [["machine_top", 0], ["machine_top", 0], ["mfe_back", 0], ["mfe_front", 0], ["mfe_side", 0], ["mfe_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.storageMFE, [["machine_top", 0], ["machine_top", 0], ["mfe_back", 0], ["mfe_front", 0], ["mfe_side", 0], ["mfe_side", 0]]);
TileRenderer.registerRenderModel(BlockID.storageMFE, 0, [["mfe_front", 0], ["mfe_back", 0], ["machine_top", 0], ["machine_top", 0], ["mfe_side", 1], ["mfe_side", 1]]);
TileRenderer.registerRenderModel(BlockID.storageMFE, 1, [["mfe_back", 0], ["mfe_front", 0], ["machine_top", 0], ["machine_top", 0], ["mfe_side", 1], ["mfe_side", 1]]);
TileRenderer.registerRotationModel(BlockID.storageMFE, 2, [["machine_top", 0], ["machine_top", 0], ["mfe_back", 0], ["mfe_front", 0], ["mfe_side", 0], ["mfe_side", 0]]);

Block.registerDropFunction("storageMFE", function(coords, blockID, blockData, level){
	return [];
});

ItemName.addStorageBlockTooltip("storageMFE", 3, "4M");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.storageMFE, count: 1, data: 0}, [
		"bab",
		"axa",
		"bab"
	], ['x', BlockID.machineBlockBasic, 0, 'a', ItemID.storageCrystal, -1, 'b', ItemID.cableGold2, -1]);
});


var guiMFE = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("MFE")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 441, y: 75, isValid: MachineRegistry.isValidEUItem},
		"slot2": {type: "slot", x: 441, y: 212, isValid: MachineRegistry.isValidEUStorage},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 300, height: 30, text: "4000000"}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiMFE, "MFE");
});

MachineRegistry.registerEUStorage(BlockID.storageMFE, {
	defaultValues: {
		meta: 0
	},
	
	getGuiScreen: function(){
		return guiMFE;
	},
	
	getTier: function(){
		return 3;
	},
	
	wrenchClick: function(id, count, data, coords){
		if(this.setFacing(coords)){
			EnergyNetBuilder.rebuildTileNet(this);
			return true;
		}
		return false;
	},
		
	setFacing: MachineRegistry.setFacing,
	
	tick: function(){
		StorageInterface.checkHoppers(this);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), "Eu", energyStorage - this.data.energy, 3);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), "Eu", this.data.energy, 3);
		
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage);
	},
	
	getEnergyStorage: function(){
		return 4000000;
	},
	
	canReceiveEnergy: function(side){
		return side != this.data.meta;
	},
	
	canExtractEnergy: function(side){
		return side == this.data.meta;
	},
	
	destroyBlock: function(coords, player){
		var itemID = Player.getCarriedItem().id;
		var level = ToolAPI.getToolLevelViaBlock(itemID, this.blockID)
		var drop = MachineRegistry.getMachineDrop(coords, this.blockID, level, BlockID.machineBlockBasic, this.data.energy);
		if(drop.length > 0){
			World.drop(coords.x + .5, coords.y + .5, coords.z + .5, drop[0][0], drop[0][1], drop[0][2]);
		}
	},
	
	renderModel: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta);
	},
	destroy: function(){
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	}
});

MachineRegistry.setStoragePlaceFunction("storageMFE", true);

StorageInterface.createInterface(BlockID.storageMFE, {
	slots: {
		"slot1": {input: true, output: true, 
			isValid: function(item, side, tileEntity){
				return side == 1 && ChargeItemRegistry.isValidItem(item.id, "Eu", 3);
			},
			canOutput: function(item, side, tileEntity){
				return item.data <= 1;
			}
		},
		"slot2": {input: true, output: true,
			isValid: function(item, side, tileEntity){
				return side > 1 && ChargeItemRegistry.isValidStorage(item.id, "Eu", 3);
			},
			canOutput: function(item, side, tileEntity){
				return item.data == Item.getMaxDamage(item.id);
			}
		}
	}
});




// file: machine/storage/MFSU.js

IDRegistry.genBlockID("storageMFSU");
Block.createBlock("storageMFSU", [
	{name: "MFSU", texture: [["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 0], ["mfsu_front", 0], ["mfsu_side", 0], ["mfsu_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.storageMFSU, [["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 0], ["mfsu_front", 0], ["mfsu_side", 0], ["mfsu_side", 0]]);
TileRenderer.registerRenderModel(BlockID.storageMFSU, 0, [["mfsu_front", 0], ["mfsu_side", 0], ["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 1], ["mfsu_side", 1]]);
TileRenderer.registerRenderModel(BlockID.storageMFSU, 1, [["mfsu_side", 0], ["mfsu_front", 0], ["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 1], ["mfsu_side", 1]]);
TileRenderer.registerRotationModel(BlockID.storageMFSU, 2, [["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 0], ["mfsu_front", 0], ["mfsu_side", 0], ["mfsu_side", 0]]);

Block.registerDropFunction("storageMFSU", function(coords, blockID, blockData, level){
	return [];
});

ItemName.setRarity(BlockID.storageMFSU, 1, true);
ItemName.addStorageBlockTooltip("storageMFSU", 4, "60M");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.storageMFSU, count: 1, data: 0}, [
		"aca",
		"axa",
		"aba"
	], ['b', BlockID.storageMFE, -1, 'a', ItemID.storageLapotronCrystal, -1, 'x', BlockID.machineBlockAdvanced, 0, 'c', ItemID.circuitAdvanced, 0]);
});


var guiMFSU = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("MFSU")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 441, y: 75, isValid: MachineRegistry.isValidEUItem},
		"slot2": {type: "slot", x: 441, y: 212, isValid: MachineRegistry.isValidEUStorage},
		"textInfo1": {type: "text", x: 642, y: 142, width: 350, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 350, height: 30, text: "60000000"}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiMFSU, "MFSU");
});

MachineRegistry.registerEUStorage(BlockID.storageMFSU, {
	getGuiScreen: function(){
		return guiMFSU;
	},
	
	getTier: function(){
		return 4;
	},
	
	wrenchClick: function(id, count, data, coords){
		if(this.setFacing(coords)){
			EnergyNetBuilder.rebuildTileNet(this);
			return true;
		}
		return false;
	},
		
	setFacing: MachineRegistry.setFacing,
	
	tick: function(){
		StorageInterface.checkHoppers(this);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), "Eu", energyStorage - this.data.energy, 4);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), "Eu", this.data.energy, 4);
		
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage);
	},
	
	getEnergyStorage: function(){
		return 60000000;
	},
	
	canReceiveEnergy: function(side){
		return side != this.data.meta;
	},
	
	canExtractEnergy: function(side){
		return side == this.data.meta;
	},
	
	destroyBlock: function(coords, player){
		var itemID = Player.getCarriedItem().id;
		var level = ToolAPI.getToolLevelViaBlock(itemID, this.blockID)
		var drop = MachineRegistry.getMachineDrop(coords, this.blockID, level, BlockID.machineBlockAdvanced, this.data.energy);
		if(drop.length > 0){
			World.drop(coords.x + .5, coords.y + .5, coords.z + .5, drop[0][0], drop[0][1], drop[0][2]);
		}
	},
	
	renderModel: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta);
	},
	destroy: function(){
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	}
});

MachineRegistry.setStoragePlaceFunction("storageMFSU", true);

StorageInterface.createInterface(BlockID.storageMFSU, {
	slots: {
		"slot1": {input: true, output: true, 
			isValid: function(item, side, tileEntity){
				return side == 1 && ChargeItemRegistry.isValidItem(item.id, "Eu", 4);
			},
			canOutput: function(item, side, tileEntity){
				return item.data <= 1;
			}
		},
		"slot2": {input: true, output: true,
			isValid: function(item, side, tileEntity){
				return side > 1 && ChargeItemRegistry.isValidStorage(item.id, "Eu", 4);
			},
			canOutput: function(item, side, tileEntity){
				return item.data == Item.getMaxDamage(item.id);
			}
		}
	}
});




// file: machine/transformer/transformer_base.js

MachineRegistry.registerTransformer = function(id, tier){
	var Prototype = {
		defaultValues: {
			increaseMode: false,
			meta: 0
		},
		
		getEnergyStorage: function(){
			return this.getMaxPacketSize();
		},
		
		getTier: function(){
			return tier;
		},
		
		energyReceive: MachineRegistry.basicEnergyReceiveFunc,
		
		energyTick: function(type, src){
			this.data.last_energy_receive = this.data.energy_receive;
			this.data.energy_receive = 0;
			this.data.last_voltage = this.data.voltage;
			this.data.voltage = 0;
		
			var maxVoltage = this.getMaxPacketSize();
			if(this.data.increaseMode){
				if(this.data.energy >= maxVoltage){
					this.data.energy += src.add(maxVoltage, maxVoltage) - maxVoltage;
				}
			}
			else {
				if(this.data.energy >= maxVoltage/4){
					var output = this.data.energy;
					this.data.energy += src.add(output, maxVoltage/4) - output;
				}
			}
		},
		
		redstone: function(signal){
			var newMode = signal.power > 0;
			if(newMode != this.data.increaseMode){
				this.data.increaseMode = newMode;
				EnergyNetBuilder.rebuildTileNet(this);
			}
		},
		
		isEnergySource: function(){
			return true;
		},
		
		canReceiveEnergy: function(side){
			if(side == this.data.meta){
				return !this.data.increaseMode;
			}
			return this.data.increaseMode;
		},
		
		canExtractEnergy: function(side){
			if(side == this.data.meta){
				return this.data.increaseMode;
			}
			return !this.data.increaseMode;
		},
		
		wrenchClick: function(id, count, data, coords){
			if(this.setFacing(coords)){
				EnergyNetBuilder.rebuildTileNet(this);
				return true;
			}
			return false;
		},
		
		setFacing: MachineRegistry.setFacing,
		
		renderModel: function(){
			TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta);
		},
		
		destroy: function(){
			BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
		}
	};
	
	this.registerElectricMachine(id, Prototype);
	TileRenderer.setRotationPlaceFunction(id, true);
}




// file: machine/transformer/LV.js

IDRegistry.genBlockID("transformerLV");
Block.createBlock("transformerLV", [
	{name: "LV Transformer", texture: [["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_front", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.transformerLV, [["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_front", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.transformerLV, 0, [["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_front", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0]]);

MachineRegistry.setMachineDrop("transformerLV");

Item.registerNameOverrideFunction(BlockID.transformerLV, function(item, name){
	return name + "\n§7Low: 32 EU/t High: 128 EU/t";
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.transformerLV, count: 1, data: 0}, [
		"aba",
		"aoa",
		"aba"
	], ['o', ItemID.coil, 0, 'a', 5, -1, 'b', ItemID.cableTin1, 0]);
});

MachineRegistry.registerTransformer(BlockID.transformerLV, 2);




// file: machine/transformer/MV.js

IDRegistry.genBlockID("transformerMV");
Block.createBlock("transformerMV", [
	{name: "MV Transformer", texture: [["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_front", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.transformerMV, [["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_front", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.transformerMV, 0, [["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_front", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0]]);

MachineRegistry.setMachineDrop("transformerMV", BlockID.machineBlockBasic);

Item.registerNameOverrideFunction(BlockID.transformerMV, function(item, name){
	return name + "\n§7Low: 128 EU/t High: 512 EU/t";
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.transformerMV, count: 1, data: 0}, [
		"b",
		"x",
		"b"
	], ['x', BlockID.machineBlockBasic, 0, 'b', ItemID.cableCopper1, 0]);
});

MachineRegistry.registerTransformer(BlockID.transformerMV, 3);




// file: machine/transformer/HV.js

IDRegistry.genBlockID("transformerHV");
Block.createBlock("transformerHV", [
	{name: "HV Transformer", texture: [["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0]], inCreative: true}
], "stone");
ItemName.setRarity(BlockID.transformerHV, 1, true);
TileRenderer.setStandartModel(BlockID.transformerHV, [["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0]]);
TileRenderer.registerRenderModel(BlockID.transformerHV, 0, [["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 1], ["hv_transformer_side", 1]]);
TileRenderer.registerRenderModel(BlockID.transformerHV, 1, [["hv_transformer_side", 0], ["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 1], ["hv_transformer_side", 1]]);
TileRenderer.registerRotationModel(BlockID.transformerHV, 2, [["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0]]);

MachineRegistry.setMachineDrop("transformerHV", BlockID.machineBlockBasic);

Item.registerNameOverrideFunction(BlockID.transformerHV, function(item, name){
	return name + "\n§7Low: 512 EU/t High: 2048 EU/t";
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.transformerHV, count: 1, data: 0}, [
		" b ",
		"cxa",
		" b "
	], ['x', BlockID.transformerMV, 0, 'a', ItemID.storageAdvBattery, -1, 'b', ItemID.cableGold2, -1, 'c', ItemID.circuitBasic, -1]);
});

MachineRegistry.registerTransformer(BlockID.transformerHV, 4);




// file: machine/transformer/EV.js

IDRegistry.genBlockID("transformerEV");
Block.createBlock("transformerEV", [
	{name: "EV Transformer", texture: [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]], inCreative: true}
], "stone");
ItemName.setRarity(BlockID.transformerEV, 1, true);
TileRenderer.setStandartModel(BlockID.transformerEV, [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]]);
TileRenderer.registerRenderModel(BlockID.transformerEV, 0, [["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 1], ["ev_transformer_side", 1]]);
TileRenderer.registerRenderModel(BlockID.transformerEV, 1, [["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 1], ["ev_transformer_side", 1]]);
TileRenderer.registerRotationModel(BlockID.transformerEV, 2, [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]]);

MachineRegistry.setMachineDrop("transformerEV", BlockID.machineBlockBasic);

Item.registerNameOverrideFunction(BlockID.transformerEV, function(item, name){
	return name + "\n§7Low: 2048 EU/t High: 8192 EU/t";
});

Item.addCreativeGroup("EUTransformers", Translation.translate("Transformers"), [
	BlockID.transformerLV,
	BlockID.transformerMV,
	BlockID.transformerHV,
	BlockID.transformerEV
]);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.transformerEV, count: 1, data: 0}, [
		" b ",
		"cxa",
		" b "
	], ['x', BlockID.transformerHV, 0, 'a', ItemID.storageLapotronCrystal, -1, 'b', ItemID.cableIron3, 0, 'c', ItemID.circuitAdvanced, 0]);
});

MachineRegistry.registerTransformer(BlockID.transformerEV, 5);




// file: machine/processing/iron_furnace.js

IDRegistry.genBlockID("ironFurnace");
Block.createBlock("ironFurnace", [
	{name: "Iron Furnace", texture: [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 0], ["iron_furnace_side", 0], ["iron_furnace_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.ironFurnace, [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 0], ["iron_furnace_side", 0], ["iron_furnace_side", 0]]);
TileRenderer.registerRotationModel(BlockID.ironFurnace, 0, [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 0], ["iron_furnace_side", 0], ["iron_furnace_side", 0]]);
TileRenderer.registerRotationModel(BlockID.ironFurnace, 4, [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 1], ["iron_furnace_side", 0], ["iron_furnace_side", 0]]);

MachineRegistry.setMachineDrop("ironFurnace");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.ironFurnace, count: 1, data: 0}, [
		" x ",
		"x x",
		"x#x"
	], ['#', 61, -1, 'x', ItemID.plateIron, 0]);
});


var guiIronFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Iron Furnace")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "arrow_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "fire_background", scale: GUI_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "arrow_bar_scale", scale: GUI_SCALE},
		"burningScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 441, y: 79, isValid: function(id, count, data){
			return Recipes.getFurnaceRecipeResult(id, "iron")? true : false;
		}},
		"slotFuel": {type: "slot", x: 441, y: 218, isValid: function(id, count, data){
			return Recipes.getFuelBurnDuration(id, data) > 0;
		}},
		"slotResult": {type: "slot", x: 625, y: 148, isValid: function(){return false;}},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiIronFurnace, "Iron Furnace");
});

MachineRegistry.registerPrototype(BlockID.ironFurnace, {
	defaultValues: {
		meta: 0,
		progress: 0,
		burn: 0,
		burnMax: 0,
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiIronFurnace;
	},
	
	tick: function(){
		StorageInterface.checkHoppers(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var result = Recipes.getFurnaceRecipeResult(sourceSlot.id, "iron");
		
		if(this.data.burn == 0 && result){
			this.data.burn = this.data.burnMax = this.getFuel("slotFuel");
		}
		
		if(this.data.burn > 0 && result){
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
			this.data.burn--;
			this.activate();
			this.startPlaySound("Machines/IronFurnaceOp.ogg");
		} else {
			this.stopPlaySound();
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
	
	renderModel: MachineRegistry.renderModelWithRotation,
});

TileRenderer.setRotationPlaceFunction(BlockID.ironFurnace);

StorageInterface.createInterface(BlockID.ironFurnace, {
	slots: {
		"slotSource": {input: true,
			isValid: function(item, side){
				return side == 1 && Recipes.getFurnaceRecipeResult(item.id, "iron");
			}
		},
		"slotFuel": {input: true, 
			isValid: function(item, side){
				return side != 1 && Recipes.getFuelBurnDuration(item.id, item.data) > 0;
			}
		},
		"slotResult": {output: true}
	}
});




// file: machine/processing/electric_furnace.js

IDRegistry.genBlockID("electricFurnace");
Block.createBlock("electricFurnace", [
	{name: "Electric Furnace", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.electricFurnace, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.electricFurnace, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.electricFurnace, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 1], ["machine_side", 0], ["machine_side", 0]]);

ItemName.addTierTooltip("electricFurnace", 1);

Block.registerDropFunction("electricFurnace", BlockID.ironFurnace);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.electricFurnace, count: 1, data: 0}, [
		" a ",
		"x#x"
	], ['#', BlockID.ironFurnace, -1, 'x', 331, 0, 'a', ItemID.circuitBasic, 0]);
});


var guiElectricFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Electric Furnace")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "arrow_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "arrow_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 441, y: 79, isValid: function(id, count, data){
			return Recipes.getFurnaceRecipeResult(id, "iron")? true : false;
		}},
		"slotEnergy": {type: "slot", x: 441, y: 218, isValid: MachineRegistry.isValidEUStorage},
		"slotResult": {type: "slot", x: 625, y: 148, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 820, y: 60, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 820, y: 119, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 820, y: 178, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 820, y: 237, isValid: UpgradeAPI.isValidUpgrade},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiElectricFurnace, "Electric Furnace");
});

MachineRegistry.registerElectricMachine(BlockID.electricFurnace, {
	defaultValues: {
		power_tier: 1,
		energy_storage: 1200,
		energy_consumption: 3,
		work_time: 130,
		meta: 0,
		progress: 0,
		isActive: false
	},
	
	upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"],
	
	getGuiScreen: function(){
		return guiElectricFurnace;
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	resetValues: function(){
		this.data.power_tier = this.defaultValues.power_tier;
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		
		var newActive = false;
		var sourceSlot = this.container.getSlot("slotSource");
		var resultSlot = this.container.getSlot("slotResult");
		var result = Recipes.getFurnaceRecipeResult(sourceSlot.id, "iron");
		if(result && (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0)){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				newActive = true;
				this.startPlaySound();
			}
			if(this.data.progress.toFixed(3) >= 1){
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
		}
		if(!newActive)
			this.stopPlaySound(true);
		this.setActive(newActive);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	getStartingSoundFile: function(){
		return "Machines/Electro Furnace/ElectroFurnaceStart.ogg";
    },
	getStartSoundFile: function(){
		return "Machines/Electro Furnace/ElectroFurnaceLoop.ogg";
    },
	getInterruptSoundFile: function(){
		return "Machines/Electro Furnace/ElectroFurnaceStop.ogg";
    },
	
	renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.electricFurnace);


StorageInterface.createInterface(BlockID.electricFurnace, {
	slots: {
		"slotSource": {input: true},
		"slotResult": {output: true}
	},
	isValidInput: function(item){
		return Recipes.getFurnaceRecipeResult(item.id, "iron")? true : false;
	}
});




// file: machine/processing/induction_furnace.js

IDRegistry.genBlockID("inductionFurnace");
Block.createBlock("inductionFurnace", [
	{name: "Induction Furnace", texture: [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.inductionFurnace, [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerRotationModel(BlockID.inductionFurnace, 0, [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerRotationModel(BlockID.inductionFurnace, 4, [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]]);

ItemName.setRarity(BlockID.inductionFurnace, 1, true);
ItemName.addTierTooltip("inductionFurnace", 2);

MachineRegistry.setMachineDrop("inductionFurnace", BlockID.machineBlockAdvanced);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.inductionFurnace, count: 1, data: 0}, [
		"xxx",
		"x#x",
		"xax"
	], ['#', BlockID.electricFurnace, -1, 'x', ItemID.ingotCopper, 0, 'a', BlockID.machineBlockAdvanced, 0]);
});


var guiInductionFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Induction Furnace")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 630, y: 146, bitmap: "arrow_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 550, y: 150, bitmap: "energy_small_background", scale: GUI_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 630, y: 146, direction: 0, value: 0.5, bitmap: "arrow_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 550, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotSource1": {type: "slot", x: 511, y: 75, isValid: function(id, count, data){
			return Recipes.getFurnaceRecipeResult(id, "iron")? true : false;
		}},
		"slotSource2": {type: "slot", x: 571, y: 75, isValid: function(id, count, data){
			return Recipes.getFurnaceRecipeResult(id, "iron")? true : false;
		}},
		"slotEnergy": {type: "slot", x: 541, y: 212, isValid: MachineRegistry.isValidEUStorage},
		"slotResult1": {type: "slot", x: 725, y: 142, isValid: function(){return false;}},
		"slotResult2": {type: "slot", x: 785, y: 142, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 900, y: 80, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 900, y: 144, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 900, y: 208, isValid: UpgradeAPI.isValidUpgrade},
		"textInfo1": {type: "text", x: 402, y: 143, width: 100, height: 30, text: Translation.translate("Heat:")},
		"textInfo2": {type: "text", x: 402, y: 173, width: 100, height: 30, text: "0%"},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiInductionFurnace, "Induction Furnace");
});

MachineRegistry.registerElectricMachine(BlockID.inductionFurnace, {
	defaultValues: {
		power_tier: 2,
		energy_storage: 10000,
		meta: 0,
		progress: 0,
		isActive: false,
		isHeating: false,
		heat: 0,
		signal: 0
	},
	
	upgrades: ["transformer", "energyStorage", "redstone", "itemEjector", "itemPulling"],
	
	getGuiScreen: function(){
		return guiInductionFurnace;
	},
	
	getResult: function(){
		var sourceSlot1 = this.container.getSlot("slotSource1");
		var sourceSlot2 = this.container.getSlot("slotSource2");
		var result1 = Recipes.getFurnaceRecipeResult(sourceSlot1.id, "iron");
		var result2 = Recipes.getFurnaceRecipeResult(sourceSlot2.id, "iron");
		if(result1 || result2){
			return [result1, result2];
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
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	resetValues: function(){
		this.data.power_tier = this.defaultValues.power_tier;
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.isHeating = this.data.signal > 0;
	},
	
	tick: function(){
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		
		var newActive = false;
		var result = this.getResult();
		if(result){
			if(this.data.energy > 15 && this.data.progress < 100){
				this.data.energy -= 16;
				if(this.data.heat < 10000){this.data.heat++;}
				this.data.progress += this.data.heat / 1200;
				newActive = true;
				this.startPlaySound();
			}
			if(this.data.progress >= 100){
				var put1 = this.putResult(result[0], this.container.getSlot("slotSource1"), this.container.getSlot("slotResult1"));
				var put2 = this.putResult(result[1], this.container.getSlot("slotSource2"), this.container.getSlot("slotResult2"));
				if(put1 || put2){
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
			if(this.data.isHeating && this.data.energy > 0){
				if(this.data.heat < 10000){this.data.heat++;}
				this.data.energy--;
			}
			else if(this.data.heat > 0){
				this.data.heat -= 4;
			}
		}
		if(!newActive)
			this.stopPlaySound(true);
		this.setActive(newActive);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
		this.container.setScale("progressScale", this.data.progress / 100);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo2", parseInt(this.data.heat / 100) + "%");
	},
	
	redstone: function(signal){
		this.data.signal = signal.power;
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	getStartingSoundFile: function(){
		return "Machines/Induction Furnace/InductionStart.ogg";
    },
	getStartSoundFile: function(){
		return "Machines/Induction Furnace/InductionLoop.ogg";
    },
	getInterruptSoundFile: function(){
		return "Machines/Induction Furnace/InductionStop.ogg";
    },
	
	renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.inductionFurnace);

StorageInterface.createInterface(BlockID.inductionFurnace, {
	slots: {
		"slotSource1": {input: true},
		"slotSource2": {input: true},
		"slotResult1": {output: true},
		"slotResult2": {output: true}
	},
	isValidInput: function(item){
		return Recipes.getFurnaceRecipeResult(item.id, "iron")? true : false;
	}
});




// file: machine/processing/macerator.js

﻿IDRegistry.genBlockID("macerator");
Block.createBlock("macerator", [
{name: "Macerator", texture: [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["macerator_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.macerator, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["macerator_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.macerator, 0, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["macerator_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.macerator, 4, [["machine_bottom", 0], ["macerator_top", 1], ["machine_side", 0], ["macerator_front", 1], ["machine_side", 0], ["machine_side", 0]]);

ItemName.addTierTooltip("macerator", 1);

MachineRegistry.setMachineDrop("macerator", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.macerator, count: 1, data: 0}, [
		"xxx",
		"b#b",
		" a "
	], ['#', BlockID.machineBlockBasic, 0, 'x', 318, 0, 'b', 4, -1, 'a', ItemID.circuitBasic, 0]);
	
	
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
		"ItemID.ingotSteel": {id: ItemID.dustSteel, count: 1, data: 0},
		"ItemID.ingotLead": {id: ItemID.dustLead, count: 1, data: 0},
		"ItemID.ingotSilver": {id: ItemID.dustSilver, count: 1, data: 0},
		// plates
		"ItemID.plateIron": {id: ItemID.dustIron, count: 1, data: 0},
		"ItemID.plateGold": {id: ItemID.dustGold, count: 1, data: 0},
		"ItemID.plateCopper": {id: ItemID.dustCopper, count: 1, data: 0},
		"ItemID.plateTin": {id: ItemID.dustTin, count: 1, data: 0},
		"ItemID.plateBronze": {id: ItemID.dustBronze, count: 1, data: 0},
		"ItemID.plateSteel": {id: ItemID.dustSteel, count: 1, data: 0},
		"ItemID.plateLead": {id: ItemID.dustLead, count: 1, data: 0},
		"ItemID.plateLapis": {id: ItemID.dustLapis, count: 1, data: 0},
		// dense plates
		"ItemID.densePlateIron": {id: ItemID.dustIron, count: 9, data: 0},
		"ItemID.densePlateGold": {id: ItemID.dustGold, count: 9, data: 0},
		"ItemID.densePlateCopper": {id: ItemID.dustCopper, count: 9, data: 0},
		"ItemID.densePlateTin": {id: ItemID.dustTin, count: 9, data: 0},
		"ItemID.densePlateBronze": {id: ItemID.dustBronze, count: 9, data: 0},
		"ItemID.densePlateSteel": {id: ItemID.dustSteel, count: 9, data: 0},
		"ItemID.densePlateLead": {id: ItemID.dustLead, count: 9, data: 0},
		// other resources
		22: {id: ItemID.dustLapis, count: 9, data: 0},
		173: {id: ItemID.dustCoal, count: 9, data: 0},
		"263:0": {id: ItemID.dustCoal, count: 1, data: 0},
		264: {id: ItemID.dustDiamond, count: 1, data: 0},
		"351:4": {id: ItemID.dustLapis, count: 1, data: 0},
		375: {id: ItemID.grinPowder, count: 2, data: 0},
		394: {id: ItemID.grinPowder, count: 1, data: 0},
		// other materials
		1: {id: 4, count: 1, data: 0},
		4: {id: 12, count: 1, data: 0},
		13: {id: 318, count: 1, data: 0},
		24: {id: 12, count: 2, data: 0},
		35: {id: 287, count: 2, data: 0},
		79: {id: 332, count: 4, data: 0},
		89: {id: 348, count: 4, data: 0},
		128: {id: 12, count: 3, data: 0},
		152: {id: 331, count: 9, data: 0},
		155: {id: 406, count: 4, data: 0},
		156: {id: 406, count: 6, data: 0},
		179: {id: 12, count: 2, data: 1},
		180: {id: 12, count: 3, data: 1},
		352: {id: 351, count: 5, data: 15}, 
		369: {id: 377, count: 5, data: 0},
		// plants
		5: {id: ItemID.bioChaff, count: 1, sourceCount: 4},
		"ItemID.rubberSapling": {id: ItemID.bioChaff, count: 1, sourceCount: 4},
		"ItemID.rubberTreeLeaves": {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		18: {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		161: {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		32: {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		81: {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		86: {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		296: {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		338: {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		360: {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		391: {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		392: {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		361: {id: ItemID.bioChaff, count: 1, sourceCount: 16},
		362: {id: ItemID.bioChaff, count: 1, sourceCount: 16},
		"ItemID.weed": {id: ItemID.bioChaff, count: 1, sourceCount: 32},
		"ItemID.bioChaff": {id: 3, count: 1, data: 0},
		"ItemID.coffeeBeans": {id: ItemID.coffeePowder, count: 3, data: 0},
	}, true);
});


var guiMacerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Macerator")}},
		inventory: {standart: true},
		background: {standart: true}
	},

	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "macerator_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "macerator_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 441, y: 79, isValid: function(id, count, data){
			return MachineRecipeRegistry.hasRecipeFor("macerator", id, data);
		}},
		"slotEnergy": {type: "slot", x: 441, y: 218, isValid: MachineRegistry.isValidEUStorage},
		"slotResult": {type: "slot", x: 625, y: 148, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 820, y: 60, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 820, y: 119, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 820, y: 178, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 820, y: 237, isValid: UpgradeAPI.isValidUpgrade},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiMacerator, "Macerator");
});

MachineRegistry.registerElectricMachine(BlockID.macerator, {
	defaultValues: {
		power_tier: 1,
		energy_storage: 1200,
		energy_consumption: 2,
		work_time: 300,
		meta: 0,
		progress: 0,
		isActive: false
	},
	
	upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"],

	getGuiScreen: function(){
		return guiMacerator;
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	resetValues: function(){
		this.data.power_tier = this.defaultValues.power_tier;
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},

	tick: function(){
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		
		var newActive = false;
		var sourceSlot = this.container.getSlot("slotSource");
		var resultSlot = this.container.getSlot("slotResult");
		var result = MachineRecipeRegistry.getRecipeResult("macerator", sourceSlot.id, sourceSlot.data);
		if(result && (sourceSlot.count >= result.sourceCount || !result.sourceCount)){
			var resultSlot = this.container.getSlot("slotResult");
			if(resultSlot.id == result.id && (!result.data || resultSlot.data == result.data) && resultSlot.count <= 64 - result.count || resultSlot.id == 0){
				if(this.data.energy >= this.data.energy_consumption){
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
					newActive = true;
					this.startPlaySound();
				}
				if(this.data.progress.toFixed(3) >= 1){
					sourceSlot.count -= result.sourceCount || 1;
					resultSlot.id = result.id;
					resultSlot.data = result.data || 0;
					resultSlot.count += result.count;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		if(!newActive)
			this.stopPlaySound(true);
		this.setActive(newActive);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},

	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	getStartSoundFile: function(){
		return "Machines/MaceratorOp.ogg";
    },
	getInterruptSoundFile: function(){
		return "Machines/InterruptOne.ogg";
    },
	
	renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.macerator);

StorageInterface.createInterface(BlockID.macerator, {
	slots: {
		"slotSource": {input: true},
		"slotResult": {output: true}
	},
	isValidInput: function(item){
		return MachineRecipeRegistry.hasRecipeFor("macerator", item.id, item.data);
	}
});




// file: machine/processing/compressor.js

IDRegistry.genBlockID("compressor");
Block.createBlock("compressor", [
	{name: "Compressor", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.compressor, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.compressor, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.compressor, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 1], ["machine_side", 0], ["machine_side", 0]]);

ItemName.addTierTooltip("compressor", 1);

MachineRegistry.setMachineDrop("compressor", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.compressor, count: 1, data: 0}, [
		"x x",
		"x#x",
		"xax"
	], ['#', BlockID.machineBlockBasic, 0, 'x', 1, -1, 'a', ItemID.circuitBasic, 0]);
	
	
	MachineRecipeRegistry.registerRecipesFor("compressor", {
		// Blocks
		80: {id: 79, count: 1, data: 0},
		12: {id: 24, count: 1, data: 0, sourceCount: 4},
		336: {id: 45, count: 1, data: 0, sourceCount: 4},
		405: {id: 112, count: 1, data: 0, sourceCount: 4},
		348: {id: 89, count: 1, data: 0, sourceCount: 4},
		406: {id: 155, count: 1, data: 0, sourceCount: 4},
		// Items
		"ItemID.dustEnergium": {id: ItemID.storageCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageCrystal), sourceCount: 9},
		"ItemID.ingotAlloy": {id: ItemID.plateAlloy, count: 1, data: 0},
		"ItemID.carbonMesh": {id: ItemID.carbonPlate, count: 1, data: 0},
		"ItemID.coalBall": {id: ItemID.coalBlock, count: 1, data: 0},
		"ItemID.coalChunk": {id: 264, count: 1, data: 0},
		"ItemID.cellEmpty": {id: ItemID.cellAir, count: 1, data: 0},
		"ItemID.dustLapis": {id: ItemID.plateLapis, count: 1, data: 0},
		// Dense Plates
		"ItemID.plateIron": {id: ItemID.densePlateIron, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateGold": {id: ItemID.densePlateGold, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateTin": {id: ItemID.densePlateTin, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateCopper": {id: ItemID.densePlateCopper, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateBronze": {id: ItemID.densePlateBronze, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateSteel": {id: ItemID.densePlateSteel, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateLead": {id: ItemID.densePlateLead, count: 1, data: 0, sourceCount: 9},
		// Compact
		331: {id: 152, count: 1, data: 0, sourceCount: 9},
		"351:4": {id: 22, count: 1, data: 0, sourceCount: 9},
		264: {id: 57, count: 1, data: 0, sourceCount: 9},
		388: {id: 133, count: 1, data: 0, sourceCount: 9},
		265: {id: 42, count: 1, data: 0, sourceCount: 9},
		266: {id: 41, count: 1, data: 0, sourceCount: 9},
		"ItemID.ingotCopper": {id: BlockID.blockCopper, count: 1, data: 0, sourceCount: 9},
		"ItemID.ingotTin": {id: BlockID.blockTin, count: 1, data: 0, sourceCount: 9},
		"ItemID.ingotLead": {id: BlockID.blockLead, count: 1, data: 0, sourceCount: 9},
		"ItemID.ingotSteel": {id: BlockID.blockSteel, count: 1, data: 0, sourceCount: 9},
		"ItemID.ingotBronze": {id: BlockID.blockBronze, count: 1, data: 0, sourceCount: 9},
		"ItemID.dustSmallIron": {id: ItemID.dustIron, count: 1, data: 0, sourceCount: 9},
		"ItemID.dustSmallGold": {id: ItemID.dustGold, count: 1, data: 0, sourceCount: 9},
		"ItemID.dustSmallCopper": {id: ItemID.dustCopper, count: 1, data: 0, sourceCount: 9},
		"ItemID.dustSmallTin": {id: ItemID.dustTin, count: 1, data: 0, sourceCount: 9},
		"ItemID.dustSmallLead": {id: ItemID.dustLead, count: 1, data: 0, sourceCount: 9},
		"ItemID.smallUranium235": {id: ItemID.uranium235, count: 1, data: 0, sourceCount: 9},
		"ItemID.smallPlutonium": {id: ItemID.plutonium, count: 1, data: 0, sourceCount: 9}
	}, true);
});


var guiCompressor = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Compressor")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "compressor_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE},
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "compressor_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 441, y: 79, isValid: function(id, count, data){
			return MachineRecipeRegistry.hasRecipeFor("compressor", id, data);
		}},
		"slotEnergy": {type: "slot", x: 441, y: 218, isValid: MachineRegistry.isValidEUStorage},
		"slotResult": {type: "slot", x: 625, y: 148, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 820, y: 60, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 820, y: 119, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 820, y: 178, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 820, y: 237, isValid: UpgradeAPI.isValidUpgrade},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiCompressor, "Compressor");
});

MachineRegistry.registerElectricMachine(BlockID.compressor, {
	defaultValues: {
		power_tier: 1,
		energy_storage: 1200,
		energy_consumption: 2,
		work_time: 400,
		meta: 0,
		progress: 0,
		isActive: false
	},
	
	upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"],
	
	getGuiScreen: function(){
		return guiCompressor;
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	resetValues: function(){
		this.data.power_tier = this.defaultValues.power_tier;
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		
		var newActive = false;
		var sourceSlot = this.container.getSlot("slotSource");
		var result = MachineRecipeRegistry.getRecipeResult("compressor", sourceSlot.id, sourceSlot.data);
		if(result && (sourceSlot.count >= result.sourceCount || !result.sourceCount)){
			var resultSlot = this.container.getSlot("slotResult");
			if(resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= 64 - result.count || resultSlot.id == 0){
				if(this.data.energy >= this.data.energy_consumption){
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
					newActive = true;
					this.startPlaySound();
				}
				if(this.data.progress.toFixed(3) >= 1){
					sourceSlot.count -= result.sourceCount || 1;
					resultSlot.id = result.id;
					resultSlot.data = result.data;
					resultSlot.count += result.count;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		if(!newActive)
			this.stopPlaySound(true);
		this.setActive(newActive);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	getStartSoundFile: function(){
		return "Machines/CompressorOp.ogg";
    },
	getInterruptSoundFile: function(){
		return "Machines/InterruptOne.ogg";
    },
	
	renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.compressor);

StorageInterface.createInterface(BlockID.compressor, {
	slots: {
		"slotSource": {input: true},
		"slotResult": {output: true}
	},
	isValidInput: function(item){
		return MachineRecipeRegistry.hasRecipeFor("compressor", item.id, item.data);
	}
});




// file: machine/processing/extractor.js

IDRegistry.genBlockID("extractor");
Block.createBlock("extractor", [
	{name: "Extractor", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 0], ["extractor_side", 0], ["extractor_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.extractor, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 0], ["extractor_side", 0], ["extractor_side", 0]], true);
TileRenderer.registerRotationModel(BlockID.extractor, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 0], ["extractor_side", 0], ["extractor_side", 0]]);
TileRenderer.registerRotationModel(BlockID.extractor, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 1], ["extractor_side", 1], ["extractor_side", 1]]);

ItemName.addTierTooltip("extractor", 1);

MachineRegistry.setMachineDrop("extractor", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.extractor, count: 1, data: 0}, [
		"x#x",
		"xax"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.treetap, 0, 'a', ItemID.circuitBasic, 0]);
	
	MachineRecipeRegistry.registerRecipesFor("extractor", {
		"ItemID.latex": {id: ItemID.rubber, count: 3},
		"ItemID.rubberSapling": {id: ItemID.rubber, count: 1},
		"BlockID.rubberTreeLog": {id: ItemID.rubber, count: 1},
		35: {id: 35, count: 1},
		289: {id: ItemID.dustSulfur, count: 1},
		"ItemID.tinCanFull": {id: ItemID.tinCanEmpty, count: 1},
	}, true);
});


var guiExtractor = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Extractor")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "extractor_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "extractor_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 441, y: 79, isValid: function(id, count, data){
			return MachineRecipeRegistry.hasRecipeFor("extractor", id);
		}},
		"slotEnergy": {type: "slot", x: 441, y: 218, isValid: MachineRegistry.isValidEUStorage},
		"slotResult": {type: "slot", x: 625, y: 148, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 820, y: 60, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 820, y: 119, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 820, y: 178, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 820, y: 237, isValid: UpgradeAPI.isValidUpgrade},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiExtractor, "Extractor");
});

MachineRegistry.registerElectricMachine(BlockID.extractor, {
	defaultValues: {
		power_tier: 1,
		energy_storage: 1200,
		energy_consumption: 2,
		work_time: 400,
		meta: 0,
		progress: 0,
		isActive: false
	},
	
	upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"],
	
	getGuiScreen: function(){
		return guiExtractor;
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	resetValues: function(){
		this.data.power_tier = this.defaultValues.power_tier;
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		
		var newActive = false;
		var sourceSlot = this.container.getSlot("slotSource");
		var resultSlot = this.container.getSlot("slotResult");
		var result = MachineRecipeRegistry.getRecipeResult("extractor", sourceSlot.id);
		if(result && (resultSlot.id == result.id && resultSlot.count <= 64 - result.count || resultSlot.id == 0)){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				newActive = true;
				this.startPlaySound();
			}
			if(this.data.progress.toFixed(3) >= 1){
				sourceSlot.count--;
				resultSlot.id = result.id;
				resultSlot.count += result.count;
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else {
			this.data.progress = 0;
		}
		if(!newActive)
			this.stopPlaySound(true);
		this.setActive(newActive);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	getStartSoundFile: function(){
		return "Machines/ExtractorOp.ogg";
    },
	getInterruptSoundFile: function(){
		return "Machines/InterruptOne.ogg";
    },
	
	renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.extractor);

StorageInterface.createInterface(BlockID.extractor, {
	slots: {
		"slotSource": {input: true},
		"slotResult": {output: true}
	},
	isValidInput: function(item){
		return MachineRecipeRegistry.hasRecipeFor("extractor", item.id);
	}
});




// file: machine/processing/solid_canner.js

IDRegistry.genBlockID("solidCanner");
Block.createBlock("solidCanner", [
	{name: "Solid Canning Machine", texture: [["machine_bottom", 0], ["machine_bottom", 0], ["machine_side", 0], ["solid_canner", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.solidCanner, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["solid_canner", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.solidCanner, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["solid_canner", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.solidCanner, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["solid_canner", 1], ["machine_side", 0], ["machine_side", 0]]);

ItemName.addTierTooltip("solidCanner", 1);

MachineRegistry.setMachineDrop("solidCanner", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.solidCanner, count: 1, data: 0}, [
		"c#c",
		"cxc",
		"ccc"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.casingTin, 0]);
	
	MachineRecipeRegistry.registerRecipesFor("solidCanner", {
		"ItemID.uranium": {storage: [ItemID.fuelRod, 1], result: [ItemID.fuelRodUranium, 1, 0]},
		"ItemID.mox": {storage: [ItemID.fuelRod, 1], result: [ItemID.fuelRodMOX, 1, 0]},
		354: {storage: [ItemID.tinCanEmpty, 14], result: [ItemID.tinCanFull, 14, 0]},
		413: {storage: [ItemID.tinCanEmpty, 10], result: [ItemID.tinCanFull, 10, 0]},
		320: {storage: [ItemID.tinCanEmpty, 8], result: [ItemID.tinCanFull, 8, 0]},
		364: {storage: [ItemID.tinCanEmpty, 8], result: [ItemID.tinCanFull, 8, 0]},
		400: {storage: [ItemID.tinCanEmpty, 8], result: [ItemID.tinCanFull, 8, 0]},
		282: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
		366: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
		396: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
		424: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
		459: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
		463: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
		297: {storage: [ItemID.tinCanEmpty, 5], result: [ItemID.tinCanFull, 5, 0]},
		350: {storage: [ItemID.tinCanEmpty, 5], result: [ItemID.tinCanFull, 5, 0]},
		393: {storage: [ItemID.tinCanEmpty, 5], result: [ItemID.tinCanFull, 5, 0]},
		412: {storage: [ItemID.tinCanEmpty, 5], result: [ItemID.tinCanFull, 5, 0]},
		367: {storage: [ItemID.tinCanEmpty, 4], result: [ItemID.tinCanFull, 4, 1]},
		260: {storage: [ItemID.tinCanEmpty, 4], result: [ItemID.tinCanFull, 4, 0]},
		319: {storage: [ItemID.tinCanEmpty, 3], result: [ItemID.tinCanFull, 3, 0]},
		363: {storage: [ItemID.tinCanEmpty, 3], result: [ItemID.tinCanFull, 3, 0]},
		391: {storage: [ItemID.tinCanEmpty, 3], result: [ItemID.tinCanFull, 3, 0]},
		411: {storage: [ItemID.tinCanEmpty, 3], result: [ItemID.tinCanFull, 3, 0]},
		357: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0]},
		360: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0]},
		365: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 1]},
		375: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 2]},
		349: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0]},
		394: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 2]},
		423: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0]},
		460: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0]},
		392: {storage: [ItemID.tinCanEmpty, 1], result: [ItemID.tinCanFull, 1, 0]},
		457: {storage: [ItemID.tinCanEmpty, 1], result: [ItemID.tinCanFull, 1, 0]},
		461: {storage: [ItemID.tinCanEmpty, 1], result: [ItemID.tinCanFull, 1, 0]},
	}, true);
});


var guiSolidCanner = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Solid Canning Machine")}},
		inventory: {standart: true},
		background: {standart: true}
	},

	drawing: [
		{type: "bitmap", x: 400 + 52*GUI_SCALE, y: 50 + 33*GUI_SCALE, bitmap: "solid_canner_arrow", scale: GUI_SCALE},
		{type: "bitmap", x: 400 + 86*GUI_SCALE, y: 50 + 34*GUI_SCALE, bitmap: "arrow_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 416, y: 178, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 400 + 86*GUI_SCALE, y: 50 + 34*GUI_SCALE, direction: 0, value: 0.5, bitmap: "arrow_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 416, y: 178, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotEnergy": {type: "slot", x: 400 + 3*GUI_SCALE, y: 50 + 58*GUI_SCALE, isValid: MachineRegistry.isValidEUStorage},
		"slotSource": {type: "slot", x: 400 + 32*GUI_SCALE, y: 50 + 32*GUI_SCALE,
			isValid: function(id){
				return MachineRecipeRegistry.hasRecipeFor("solidCanner", id);
			}
		},
		"slotCan": {type: "slot", x: 400 + 63*GUI_SCALE, y: 50 + 32*GUI_SCALE, 
			isValid: function(id){
				var recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
				for(var i in recipes){
					if(recipes[i].storage[0] == id) return true;
				}
				return false;
			}
		},
		"slotResult": {type: "slot", x: 400 + 111*GUI_SCALE, y: 50 + 32*GUI_SCALE, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 870, y: 50 + 4*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 870, y: 50 + 22*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 870, y: 50 + 40*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 870, y: 50 + 58*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiSolidCanner, "Solid Canning Machine");
});

MachineRegistry.registerElectricMachine(BlockID.solidCanner, {
	defaultValues: {
		power_tier: 1,
		energy_storage: 800,
		energy_consumption: 1,
		work_time: 200,
		meta: 0,
		progress: 0,
		isActive: false
	},

	upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"],

	getGuiScreen: function(){
		return guiSolidCanner;
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	resetValues: function(){
		this.data.power_tier = this.defaultValues.power_tier;
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},

	tick: function(){
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var resultSlot = this.container.getSlot("slotResult");
		var canSlot = this.container.getSlot("slotCan");
		
		var newActive = false;
		var recipe = MachineRecipeRegistry.getRecipeResult("solidCanner", sourceSlot.id);
		if(recipe && canSlot.id == recipe.storage[0] && canSlot.count >= recipe.storage[1] && (resultSlot.id == recipe.result[0] && resultSlot.data == recipe.result[2] && resultSlot.count <= 64 - recipe.result[1] || resultSlot.id == 0)){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				newActive = true;
			}
			if(this.data.progress.toFixed(3) >= 1){
				sourceSlot.count--;
				canSlot.count -= recipe.storage[1];
				resultSlot.id = recipe.result[0];
				resultSlot.data = recipe.result[2];
				resultSlot.count += recipe.result[1];
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else {
			this.data.progress = 0;
		}
		this.setActive(newActive);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},

	getEnergyStorage: function(){
		return this.data.energy_storage;
	},

	renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.solidCanner);

StorageInterface.createInterface(BlockID.solidCanner, {
	slots: {
		"slotSource": {input: true,
			isValid: function(item){
				return MachineRecipeRegistry.hasRecipeFor("solidCanner", item.id);
			}
		},
		"slotCan": {input: true,
			isValid: function(item){
				var recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
				for(var i in recipes){
					if(recipes[i].storage[0] == item.id) return true;
				}
				return false;
			}
		},
		"slotResult": {output: true}
	}
});




// file: machine/processing/canner.js

IDRegistry.genBlockID("canner");
Block.createBlock("canner", [
	{name: "Fluid/Solid Canning Machine", texture: [["machine_bottom", 0], ["machine_bottom", 0], ["machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.canner, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.canner, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.canner, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canner_front", 1], ["canner_side", 1], ["canner_side", 0]]);

ItemName.addTierTooltip("canner", 1);

MachineRegistry.setMachineDrop("canner", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.canner, count: 1, data: 0}, [
		"c#c",
		"cxc",
	], ['#', BlockID.conserver, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.cellEmpty, 0]);
	
	MachineRecipeRegistry.registerRecipesFor("fluidCanner", [
		{input: ["water", {id: ItemID.bioChaff, count: 1}], output: "biomass"},
		{input: ["water", {id: ItemID.dustLapis, count: 1}], output: "coolant"}
	]);
});


var guiCanner = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Fluid/Solid Canning Machine")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},
	
	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
		{type: "bitmap", x: 406, y: 60 + 58*GUI_SCALE, bitmap: "energy_small_background", scale: GUI_SCALE},
		{type: "bitmap", x: 400 + 67*GUI_SCALE, y: 60 + 18*GUI_SCALE, bitmap: "extractor_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 496, y: 60 + 38*GUI_SCALE, bitmap: "liquid_bar", scale: GUI_SCALE},
		{type: "bitmap", x: 730, y: 60 + 38*GUI_SCALE, bitmap: "liquid_bar", scale: GUI_SCALE}
	],

	elements: {
		"background": {type: "image", x: 400 + 51*GUI_SCALE, y: 60 + 12*GUI_SCALE, bitmap: "canner_background_0", scale: GUI_SCALE},
		"liquidInputScale": {type: "scale", x: 496 + 4*GUI_SCALE, y: 60 + 42*GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"liquidOutputScale": {type: "scale", x: 730 + 4*GUI_SCALE, y: 60 + 42*GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"progressScale": {type: "scale", x: 400 + 67*GUI_SCALE, y: 60 + 18*GUI_SCALE, direction: 0, value: 0.5, bitmap: "extractor_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 406, y: 60 + 58*GUI_SCALE, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotEnergy": {type: "slot", x: 400, y: 60 + 75*GUI_SCALE, size: 54, isValid: MachineRegistry.isValidEUStorage},
		"slotSource": {type: "slot", x: 400 + 72*GUI_SCALE, y: 60 + 39*GUI_SCALE, size: 54, visual: false, bitmap: "canner_slot_source_0",
			isValid: function(id, count, data, container){
				return isValidCannerSource(id, data, container.tileEntity);
			}
		},
		"slotCan": {type: "slot", x: 400 + 33*GUI_SCALE, y: 60 + 12*GUI_SCALE, size: 54, 
			isValid: function(id, count, data, container){
				return isValidCannerCan(id, data, container.tileEntity);
			}
		},
		"slotResult": {type: "slot", x: 400 + 111*GUI_SCALE, y: 60 + 12*GUI_SCALE, size: 54, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 850, y: 60 + 21*GUI_SCALE, size: 54, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 850, y: 60 + 39*GUI_SCALE, size: 54, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 850, y: 60 + 57*GUI_SCALE, size: 54, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 850, y: 60 + 75*GUI_SCALE, size: 54, isValid: UpgradeAPI.isValidUpgrade},
		"buttonSwitch": {type: "button", x: 400 + 70*GUI_SCALE, y: 60 + 60*GUI_SCALE, bitmap: "canner_switch_button", scale: GUI_SCALE, clicker: {
			onClick: function(container, tile){
				if(tile.data.progress == 0){
					var liquidData = tile.inputTank.data;
					tile.inputTank.data = tile.outputTank.data;
					tile.outputTank.data = liquidData;
				}
			}
		}},
		"buttonMode": {type: "button", x: 400 + 54*GUI_SCALE, y: 60 + 75*GUI_SCALE, bitmap: "canner_mode_0", scale: GUI_SCALE, clicker: {
			onClick: function(container, tile){
				if(tile.data.progress == 0){
					tile.data.mode = (tile.data.mode + 1) % 4;
					tile.updateUI();
				}
			}
		}}
	}
});

function isValidCannerSource(id, data, tile){
	if(tile.data.mode == 0 && MachineRecipeRegistry.hasRecipeFor("solidCanner", id)){
		return true;
	}
	if(tile.data.mode == 3){
		var recipes = MachineRecipeRegistry.requireRecipesFor("fluidCanner");
		for(var i in recipes){
			if(recipes[i].input[1].id == id) return true;
		}
	}
	return false;
}

function isValidCannerCan(id, data, tile){
	if(tile.data.mode == 0){
		var recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
		for(var i in recipes){
			if(recipes[i].storage[0] == id) return true;
		}
	}
	if(tile.data.mode == 1 || tile.data.mode == 3){
		return LiquidLib.getEmptyItem(id, data) ? true : false;
	}
	if(tile.data.mode == 2){
		return LiquidRegistry.getFullItem(id, data, "water") ? true : false;
	}
	return false;
}

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiCanner, "Fluid/Solid Canning Machine");
});


MachineRegistry.registerElectricMachine(BlockID.canner, {
	defaultValues: {
		power_tier: 1,
		energy_storage: 1600,
		energy_consumption: 1,
		work_time: 200,
		meta: 0,
		progress: 0,
		mode: 0,
		isActive: false
	},

	upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidEjector", "fluidPulling"],

	getGuiScreen: function(){
		return guiCanner;
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	resetValues: function(){
		this.data.power_tier = this.defaultValues.power_tier;
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
		if(this.data.mode%3 > 0) this.data.work_time /= 5;
	},
	
	updateUI: function(){
		var content = this.container.getGuiContent();
		if(content){
			this.updateElement(content.elements.buttonMode, "canner_mode_" + this.data.mode);
			this.updateElement(content.elements.background, "canner_background_" + this.data.mode);
			var element = content.elements.slotSource;
			var texture = "canner_slot_source_" + this.data.mode;
			if(element.bitmap != texture){
				element.bitmap = texture;
				element.visual = this.data.mode%3 > 0;
			}
		}
	},
	
	updateElement: function(element, bitmap){
		if(element.bitmap != bitmap){
			element.bitmap = bitmap;
		}
	},
	
	init: function(){
		this.inputTank = new LiquidTank(this, "input", 8);
		this.outputTank = new LiquidTank(this, "output", 8);
		this.renderModel();
	},
	
	tick: function(){
		this.updateUI();
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var resultSlot = this.container.getSlot("slotResult");
		var canSlot = this.container.getSlot("slotCan");
		
		var newActive = false;
		switch(this.data.mode){
		case 0:
			var recipe = MachineRecipeRegistry.getRecipeResult("solidCanner", sourceSlot.id);
			if(recipe && canSlot.id == recipe.storage[0] && canSlot.count >= recipe.storage[1] && (resultSlot.id == recipe.result[0] && resultSlot.data == recipe.result[2] && resultSlot.count <= 64 - recipe.result[1] || resultSlot.id == 0)){
				if(this.data.energy >= this.data.energy_consumption){
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
					newActive = true;
				}
				if(this.data.progress.toFixed(3) >= 1){
					canSlot.count -= recipe.storage[1];
					sourceSlot.count--;
					resultSlot.id = recipe.result[0];
					resultSlot.data = recipe.result[2];
					resultSlot.count += recipe.result[1];
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
			else {
				this.data.progress = 0;
			}
		break;
		case 1:
			var liquid = this.outputTank.getLiquidStored();
			var empty = LiquidLib.getEmptyItem(canSlot.id, canSlot.data);
			if(empty && (!liquid || empty.liquid == liquid) && this.outputTank.getAmount() <= 8 - empty.amount){
				if(this.data.energy >= this.data.energy_consumption && (resultSlot.id == empty.id && resultSlot.data == empty.data && resultSlot.count < Item.getMaxStack(empty.id) || resultSlot.id == 0)){
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
					newActive = true;
				}
				if(this.data.progress.toFixed(3) >= 1){
					this.outputTank.addLiquid(empty.liquid, empty.amount);
					canSlot.count--;
					resultSlot.id = empty.id;
					resultSlot.data = empty.data;
					resultSlot.count++;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
			else {
				this.data.progress = 0;
			}
		break;
		case 2:
			var resetProgress = true;
			var liquid = this.inputTank.getLiquidStored();
			if(liquid){
				var full = LiquidLib.getFullItem(canSlot.id, canSlot.data, liquid);
				if(full && this.inputTank.getAmount() >= full.storage){
					resetProgress = false;
					if(this.data.energy >= this.data.energy_consumption && (resultSlot.id == full.id && resultSlot.data == full.data && resultSlot.count < Item.getMaxStack(full.id) || resultSlot.id == 0)){
						this.data.energy -= this.data.energy_consumption;
						this.data.progress += 1/this.data.work_time;
						newActive = true;
					}
					if(this.data.progress.toFixed(3) >= 1){
						this.inputTank.getLiquid(liquid, full.storage);
						canSlot.count--;
						resultSlot.id = full.id;
						resultSlot.data = full.data;
						resultSlot.count++;
						this.container.validateAll();
						this.data.progress = 0;
					}
				}
			}
			if(resetProgress){
				this.data.progress = 0;
			}
		break;
		case 3:
			var recipes = MachineRecipeRegistry.requireRecipesFor("fluidCanner");
			var resetProgress = true;
			for(var i in recipes){
				var recipe = recipes[i];
				var liquid = recipe.input[0];
				var source = recipe.input[1];
				if(this.inputTank.getAmount(liquid) >= 1 && source.id == sourceSlot.id && source.count <= sourceSlot.count){
					resetProgress = false;
					var outputLiquid = this.outputTank.getLiquidStored()
					if((!outputLiquid || recipe.output == outputLiquid && this.outputTank.getAmount() <= 7) && this.data.energy >= this.data.energy_consumption){
						this.data.energy -= this.data.energy_consumption;
						this.data.progress += 1/this.data.work_time;
						newActive = true;
					}
					if(this.data.progress.toFixed(3) >= 1){
						this.inputTank.getLiquid(1);
						sourceSlot.count -= source.count;
						this.outputTank.addLiquid(recipe.output, 1);
						this.container.validateAll();
						this.data.progress = 0;
					}
					break;
				}
			}
			if(resetProgress){
				this.data.progress = 0;
			}
		break;
		}
		this.setActive(newActive);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
		this.inputTank.updateUiScale("liquidInputScale");
		this.outputTank.updateUiScale("liquidOutputScale");
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},

	renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.canner);

StorageInterface.createInterface(BlockID.canner, {
	slots: {
		"slotSource": {input: true,
			isValid: function(item, side, tileEntity){
				return isValidCannerSource(item.id, item.data, tileEntity);
			}
		},
		"slotCan": {input: true,
			isValid: function(item, side, tileEntity){
				return isValidCannerCan(item.id, item.data, tileEntity);
			}
		},
		"slotResult": {output: true}
	},
	canReceiveLiquid: function(liquid, side){ return true; },
	canTransportLiquid: function(liquid, side){ return true; },
	addLiquid: function(liquid, amount){
		return this.tileEntity.inputTank.addLiquid(liquid, amount);
	},
	getLiquid: function(liquid, amount){
		return this.tileEntity.outputTank.getLiquid(liquid, amount);
	},
	getLiquidStored: function(mode){
		if(mode == "input") return this.tileEntity.inputTank.getLiquidStored();
		return this.tileEntity.outputTank.getLiquidStored();
	}
});




// file: machine/processing/recycler.js

IDRegistry.genBlockID("recycler");
Block.createBlock("recycler", [
	{name: "Recycler", texture: [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["recycler_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.recycler, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["recycler_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.recycler, 0, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["recycler_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.recycler, 4, [["machine_bottom", 0], ["macerator_top", 1], ["machine_side", 0], ["recycler_front", 1], ["machine_side", 0], ["machine_side", 0]]);

ItemName.addTierTooltip("recycler", 1);

MachineRegistry.setMachineDrop("recycler", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.recycler, count: 1, data: 0}, [
		" a ",
		"x#x",
		"bxb"
	], ['#', BlockID.compressor, -1, 'x', 3, -1, 'a', 348, 0, 'b', ItemID.ingotSteel, 0]);
});


var recyclerBlacklist = [102, 280, 78, 80, 332];

var guiRecycler = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Recycler")}},
		inventory: {standart: true},
		background: {standart: true}
	},

	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "recycler_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "recycler_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 441, y: 79},
		"slotEnergy": {type: "slot", x: 441, y: 218, isValid: MachineRegistry.isValidEUStorage},
		"slotResult": {type: "slot", x: 625, y: 148, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 820, y: 60, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 820, y: 119, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 820, y: 178, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 820, y: 237, isValid: UpgradeAPI.isValidUpgrade},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiRecycler, "Recycler");
});

MachineRegistry.registerElectricMachine(BlockID.recycler, {
	defaultValues: {
		power_tier: 1,
		energy_storage: 800,
		energy_consumption: 1,
		work_time: 45,
		meta: 0,
		progress: 0,
		isActive: false
	},
	
	upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"],
	
	getGuiScreen: function(){
		return guiRecycler;
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	resetValues: function(){
		this.data.power_tier = this.defaultValues.power_tier;
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		
		var newActive = false;
		var sourceSlot = this.container.getSlot("slotSource");
		var resultSlot = this.container.getSlot("slotResult");
		if(sourceSlot.id > 0 && (resultSlot.id == ItemID.scrap && resultSlot.count < 64 || resultSlot.id == 0)){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				newActive = true;
				this.startPlaySound();
			}
			if(this.data.progress.toFixed(3) >= 1){
				sourceSlot.count--;
				if(Math.random() < 0.125 && recyclerBlacklist.indexOf(sourceSlot.id) == -1){
					resultSlot.id = ItemID.scrap;
					resultSlot.count++;
				}
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else {
			this.data.progress = 0;
		}
		if(!newActive)
			this.stopPlaySound(true);
		this.setActive(newActive);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	getStartSoundFile: function(){
		return "Machines/RecyclerOp.ogg";
    },
	getInterruptSoundFile: function(){
		return "Machines/InterruptOne.ogg";
    },
	
	renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.recycler);

StorageInterface.createInterface(BlockID.recycler, {
	slots: {
		"slotSource": {input: true},
		"slotResult": {output: true}
	}
});




// file: machine/processing/metal_former.js

IDRegistry.genBlockID("metalFormer");
Block.createBlock("metalFormer", [
	{name: "Metal Former", texture: [["machine_bottom", 0], ["metal_former_top", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.metalFormer, [["machine_bottom", 0], ["metal_former_top", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.metalFormer, 0, [["machine_bottom", 0], ["metal_former_top", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.metalFormer, 4, [["machine_bottom", 0], ["metal_former_top", 1], ["machine_side", 0], ["metal_former_front", 1], ["machine_side", 0], ["machine_side", 0]]);

ItemName.addTierTooltip("metalFormer", 1);

MachineRegistry.setMachineDrop("metalFormer", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.metalFormer, count: 1, data: 0}, [
		" x ",
		"b#b",
		"ccc"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'b', ItemID.toolbox, 0, 'c', ItemID.coil, 0]);
	
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
		"ItemID.plateTin": {id: ItemID.cableTin0, count: 3},
		"ItemID.plateCopper": {id: ItemID.cableCopper0, count: 3},
		"ItemID.plateGold": {id: ItemID.cableGold0, count: 4},
		"ItemID.plateIron": {id: ItemID.cableIron0, count: 4},
	}, true);
	// extruding
	MachineRecipeRegistry.registerRecipesFor("metalFormer2", {
		"ItemID.ingotTin": {id: ItemID.cableTin0, count: 3},
		"ItemID.ingotCopper": {id: ItemID.cableCopper0, count: 3},
		"ItemID.ingotGold": {id: ItemID.cableGold0, count: 4},
		265: {id: ItemID.cableIron0, count: 4},
		266: {id: ItemID.cableGold0, count: 4},
		"ItemID.casingTin": {id: ItemID.tinCanEmpty, count: 1},
		"ItemID.plateIron": {id: ItemID.fuelRod, count: 1},
	}, true);
});


var guiMetalFormer = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Metal Former")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 164, bitmap: "metalformer_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE},
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 164, direction: 0, value: 0.5, bitmap: "metalformer_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 441, y: 79, 
			isValid: function(id, count, data){
				return MachineRecipeRegistry.hasRecipeFor("metalFormer0", id) ||
				MachineRecipeRegistry.hasRecipeFor("metalFormer1", id) ||
				MachineRecipeRegistry.hasRecipeFor("metalFormer2", id);
			}
		},
		"slotEnergy": {type: "slot", x: 441, y: 218, isValid: MachineRegistry.isValidEUStorage},
		"slotResult": {type: "slot", x: 717, y: 148, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 870, y: 60, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 870, y: 119, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 870, y: 178, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 870, y: 237, isValid: UpgradeAPI.isValidUpgrade},
		"button": {type: "button", x: 572, y: 210, bitmap: "metal_former_button_0", scale: GUI_SCALE, clicker: {
			onClick: function(container, tile){
				tile.data.mode = (tile.data.mode + 1) % 3;
			}
		}}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiMetalFormer, "Metal Former");
});

MachineRegistry.registerElectricMachine(BlockID.metalFormer, {
	defaultValues: {
		power_tier: 1,
		energy_storage: 4000,
		energy_consumption: 10,
		work_time: 200,
		meta: 0,
		progress: 0,
		mode: 0,
		isActive: false
	},
	
	upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"],
	
	getGuiScreen: function(){
		return guiMetalFormer;
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	resetValues: function(){
		this.data.power_tier = this.defaultValues.power_tier;
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		var content = this.container.getGuiContent();
		if(content){
			content.elements.button.bitmap = "metal_former_button_" + this.data.mode;
		}
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		
		var newActive = false;
		var sourceSlot = this.container.getSlot("slotSource");
		var resultSlot = this.container.getSlot("slotResult");
		var result = MachineRecipeRegistry.getRecipeResult("metalFormer" + this.data.mode, sourceSlot.id)
		if(result && (resultSlot.id == result.id && resultSlot.count <= 64 - result.count || resultSlot.id == 0)){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				newActive = true;
			}
			if(this.data.progress.toFixed(3) >= 1){
				sourceSlot.count -= 1;
				resultSlot.id = result.id;
				resultSlot.count += result.count;
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else {
			this.data.progress = 0;
		}
		this.setActive(newActive);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.metalFormer);

StorageInterface.createInterface(BlockID.metalFormer, {
	slots: {
		"slotSource": {input: true},
		"slotResult": {output: true}
	},
	isValidInput: function(item){
		return MachineRecipeRegistry.hasRecipeFor("metalFormer0", item.id) ||
		MachineRecipeRegistry.hasRecipeFor("metalFormer1", item.id) ||
		MachineRecipeRegistry.hasRecipeFor("metalFormer2", item.id);
	}
});




// file: machine/processing/ore_washer.js

IDRegistry.genBlockID("oreWasher");
Block.createBlock("oreWasher", [
	{name: "Ore Washing Plant", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.oreWasher, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]]);
TileRenderer.registerRotationModel(BlockID.oreWasher, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]]);
TileRenderer.registerRotationModel(BlockID.oreWasher, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 1], ["ore_washer_side", 1], ["ore_washer_side", 1]]);

ItemName.addTierTooltip("oreWasher", 1);

MachineRegistry.setMachineDrop("oreWasher", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.oreWasher, count: 1, data: 0}, [
		"aaa",
		"b#b",
		"xcx"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.electricMotor, 0, 'a', ItemID.plateIron, 0, 'b', 325, 0, 'c', ItemID.circuitBasic, 0]);
	
	
	MachineRecipeRegistry.registerRecipesFor("oreWasher", {
		"ItemID.crushedCopper": [ItemID.crushedPurifiedCopper, 1, ItemID.dustSmallCopper, 2, ItemID.dustStone, 1],
		"ItemID.crushedTin": [ItemID.crushedPurifiedTin, 1, ItemID.dustSmallTin, 2, ItemID.dustStone, 1],
		"ItemID.crushedIron": [ItemID.crushedPurifiedIron, 1, ItemID.dustSmallIron, 2, ItemID.dustStone, 1],
		"ItemID.crushedGold": [ItemID.crushedPurifiedGold, 1, ItemID.dustSmallGold, 2, ItemID.dustStone, 1],
		"ItemID.crushedSilver": [ItemID.crushedPurifiedSilver, 1, ItemID.dustSmallSilver, 2, ItemID.dustStone, 1],
		"ItemID.crushedLead": [ItemID.crushedPurifiedLead, 1, ItemID.dustSmallSulfur, 3, ItemID.dustStone, 1],
		"ItemID.crushedUranium": [ItemID.crushedPurifiedUranium, 1, ItemID.dustSmallLead, 2, ItemID.dustStone, 1],
		//13: [318, 1, ItemID.dustStone, 1]
	}, true);
});


var guiOreWasher = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Ore Washing Plant")}},
		inventory: {standart: true},
		background: {standart: true},
	},
	
	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},
	
	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
		{type: "bitmap", x: 400, y: 50, bitmap: "ore_washer_background", scale: GUI_SCALE},
		{type: "bitmap", x: 416, y: 178, bitmap: "energy_small_background", scale: GUI_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 400 + 98*GUI_SCALE, y: 50 + 35*GUI_SCALE, direction: 0, value: 0.5, bitmap: "ore_washer_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 416, y: 178, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"liquidScale": {type: "scale", x: 592, y: 50 + 21*GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slotEnergy": {type: "slot", x: 400 + 3*GUI_SCALE, y: 50 + 58*GUI_SCALE, isValid: MachineRegistry.isValidEUStorage},
		"slotLiquid1": {type: "slot", x: 400 + 33*GUI_SCALE, y: 50 + 12*GUI_SCALE,
			isValid: function(id, count, data){
				return LiquidLib.getItemLiquid(id, data) == "water";
			}
		},
		"slotLiquid2": {type: "slot", x: 400 + 33*GUI_SCALE, y: 50 + 58*GUI_SCALE, isValid: function(){return false;}},
		"slotSource": {type: "slot", x: 400 + 99*GUI_SCALE, y: 50 + 12*GUI_SCALE,
			isValid: function(id, count, data){
				return MachineRecipeRegistry.hasRecipeFor("oreWasher", id, data);
			}
		},
		"slotResult1": {type: "slot", x: 400 + 80*GUI_SCALE, y: 50 + 58*GUI_SCALE, isValid: function(){return false;}},
		"slotResult2": {type: "slot", x: 400 + 99*GUI_SCALE, y: 50 + 58*GUI_SCALE, isValid: function(){return false;}},
		"slotResult3": {type: "slot", x: 400 + 118*GUI_SCALE, y: 50 + 58*GUI_SCALE, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 870, y: 50 + GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 870, y: 50 + 20*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 870, y: 50 + 39*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 870, y: 50 + 58*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiOreWasher, "Ore Washing Plant");
});

MachineRegistry.registerElectricMachine(BlockID.oreWasher, {
	defaultValues: {
		power_tier: 1,
		energy_storage: 10000,
		energy_consumption: 16,
		work_time: 500,
		meta: 0,
		progress: 0,
		isActive: false
	},
	
	upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidPulling"],
	
	getGuiScreen: function(){
		return guiOreWasher;
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	resetValues: function(){
		this.data.power_tier = this.defaultValues.power_tier;
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	init: function(){
		this.liquidStorage.setLimit("water", 8);
		this.renderModel();
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

	putResult: function(result){
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
	
	getLiquidFromItem: MachineRegistry.getLiquidFromItem,
	
	click: function(id, count, data, coords){
		if(Entity.getSneaking(player)){
			return this.getLiquidFromItem("water", {id: id, count: count, data: data}, null, true);
		}
	},
	
	tick: function(){
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		
		var slot1 = this.container.getSlot("slotLiquid1");
		var slot2 = this.container.getSlot("slotLiquid2");
		this.getLiquidFromItem("water", slot1, slot2);
		
		var newActive = false;
		var sourceSlot = this.container.getSlot("slotSource");
		var result = MachineRecipeRegistry.getRecipeResult("oreWasher", sourceSlot.id);
		if(result && this.checkResult(result) && this.liquidStorage.getAmount("water") >= 1){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				newActive = true;
			}
			if(this.data.progress.toFixed(3) >= 1){
				sourceSlot.count--;
				this.putResult(result);
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else {
			this.data.progress = 0;
		}
		this.setActive(newActive);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
		this.container.setScale("progressScale", this.data.progress);
		this.liquidStorage.updateUiScale("liquidScale", "water");
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},

	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.oreWasher);

StorageInterface.createInterface(BlockID.oreWasher, {
	slots: {
		"slotSource": {input: true,
			isValid: function(item){
				return MachineRecipeRegistry.hasRecipeFor("oreWasher", item.id, item.data);
			}
		},
		"slotLiquid1": {input: true, 
			isValid: function(item){
				return LiquidLib.getItemLiquid(item.id, item.data) == "water";
			}
		},
		"slotLiquid2": {output: true},
		"slotResult1": {output: true},
		"slotResult2": {output: true},
		"slotResult3": {output: true}
	},
	canReceiveLiquid: function(liquid, side){ return liquid == "water"; },
	canTransportLiquid: function(liquid, side){ return false; }
});




// file: machine/processing/thermal_centrifuge.js

IDRegistry.genBlockID("thermalCentrifuge");
Block.createBlock("thermalCentrifuge", [
	{name: "Thermal Centrifuge", texture: [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_back", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.thermalCentrifuge, [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_side", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]]);
TileRenderer.registerRotationModel(BlockID.thermalCentrifuge, 0, [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_side", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]]);
TileRenderer.registerRotationModel(BlockID.thermalCentrifuge, 4, [["machine_advanced", 0], ["thermal_centrifuge_top", 1], ["machine_side", 0], ["thermal_centrifuge_front", 1], ["thermal_centrifuge_side", 1], ["thermal_centrifuge_side", 1]]);

ItemName.addTierTooltip("thermalCentrifuge", 2);

MachineRegistry.setMachineDrop("thermalCentrifuge", BlockID.machineBlockAdvanced);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.thermalCentrifuge, count: 1, data: 0}, [
		"cmc",
		"a#a",
		"axa"
	], ['#', BlockID.machineBlockAdvanced, 0, 'x', ItemID.electricMotor, 0, 'a', 265, 0, 'm', ItemID.miningLaser, -1, 'c', ItemID.coil, 0]);
	
	
	MachineRecipeRegistry.registerRecipesFor("thermalCentrifuge", {
		//4: {result: [ItemID.dustStone, 1], heat: 100},
		"ItemID.crushedCopper": {result: [ItemID.dustSmallTin, 1, ItemID.dustCopper, 1, ItemID.dustStone, 1], heat: 500},
		"ItemID.crushedTin": {result: [ItemID.dustSmallIron, 1, ItemID.dustTin, 1, ItemID.dustStone, 1], heat: 1000},
		"ItemID.crushedIron": {result: [ItemID.dustSmallGold, 1, ItemID.dustIron, 1, ItemID.dustStone, 1], heat: 1500},
		"ItemID.crushedSilver": {result: [ItemID.dustSmallLead, 1, ItemID.dustSilver, 1, ItemID.dustStone, 1], heat: 2000},
		"ItemID.crushedGold": {result: [ItemID.dustSmallSilver, 1, ItemID.dustGold, 1, ItemID.dustStone, 1], heat: 2000},
		"ItemID.crushedLead": {result: [ItemID.dustSmallSilver, 1, ItemID.dustLead, 1, ItemID.dustStone, 1], heat: 2000},
		"ItemID.crushedUranium": {result: [ItemID.smallUranium235, 1, ItemID.uranium238, 4, ItemID.dustStone, 1], heat: 3000},
		"ItemID.crushedPurifiedCopper": {result: [ItemID.dustSmallTin, 1, ItemID.dustCopper, 1], heat: 500},
		"ItemID.crushedPurifiedTin": {result: [ItemID.dustSmallIron, 1, ItemID.dustTin, 1], heat: 1000},
		"ItemID.crushedPurifiedIron": {result: [ItemID.dustSmallGold, 1, ItemID.dustIron, 1], heat: 1500},
		"ItemID.crushedPurifiedSilver": {result: [ItemID.dustSmallLead, 1, ItemID.dustSilver, 1], heat: 2000},
		"ItemID.crushedPurifiedGold": {result: [ItemID.dustSmallSilver, 1, ItemID.dustGold, 1], heat: 2000},
		"ItemID.crushedPurifiedLead": {result: [ItemID.dustSmallSilver, 1, ItemID.dustLead, 1], heat: 2000},
		"ItemID.crushedPurifiedUranium": {result: [ItemID.smallUranium235, 2, ItemID.uranium238, 5], heat: 3000},
		"ItemID.slag": {result: [ItemID.dustSmallGold, 1, ItemID.dustCoal, 1], heat: 1500},
		"ItemID.fuelRodDepletedUranium": {result: [ItemID.smallPlutonium, 1, ItemID.uranium238, 4, ItemID.dustIron, 1], heat: 4000},
		"ItemID.fuelRodDepletedUranium2": {result: [ItemID.smallPlutonium, 2, ItemID.uranium238, 8, ItemID.dustIron, 3], heat: 4000},
		"ItemID.fuelRodDepletedUranium4": {result: [ItemID.smallPlutonium, 4, ItemID.uranium238, 16, ItemID.dustIron, 6], heat: 4000},
		"ItemID.fuelRodDepletedMOX": {result: [ItemID.smallPlutonium, 1, ItemID.plutonium, 3, ItemID.dustIron, 1], heat: 5000},
		"ItemID.fuelRodDepletedMOX2": {result: [ItemID.smallPlutonium, 2, ItemID.plutonium, 6, ItemID.dustIron, 3], heat: 5000},
		"ItemID.fuelRodDepletedMOX4": {result: [ItemID.smallPlutonium, 4, ItemID.plutonium, 12, ItemID.dustIron, 6], heat: 5000},
		"ItemID.rtgPellet": {result: [ItemID.plutonium, 3, ItemID.dustIron, 54], heat: 5000},
	}, true);
});


var guiCentrifuge = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Thermal Centrifuge")}},
		inventory: {standart: true},
		background: {standart: true},
	},

	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},

	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
		{type: "bitmap", x: 400, y: 50, bitmap: "thermal_centrifuge_background", scale: GUI_SCALE},
		{type: "bitmap", x: 400 + 8*GUI_SCALE, y: 50 + 38*GUI_SCALE, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 656, y: 50 + 22*GUI_SCALE, direction: 1, value: 0.5, bitmap: "thermal_centrifuge_scale", scale: GUI_SCALE},
		"heatScale": {type: "scale", x: 400 + 64*GUI_SCALE, y: 50 + 63*GUI_SCALE, direction: 0, value: 0.5, bitmap: "heat_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 400 + 8*GUI_SCALE, y: 50 + 38*GUI_SCALE, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotEnergy": {type: "slot", x: 400 + 6*GUI_SCALE, y: 50 + 56*GUI_SCALE, isValid: MachineRegistry.isValidEUStorage},
		"slotSource": {type: "slot", x: 400 + 6*GUI_SCALE, y: 50 + 16*GUI_SCALE, isValid: function(id, count, data){
			return MachineRecipeRegistry.hasRecipeFor("thermalCentrifuge", id);
		}},
		"slotResult1": {type: "slot", x: 400 + 119*GUI_SCALE, y: 50 + 13*GUI_SCALE, isValid: function(){return false;}},
		"slotResult2": {type: "slot", x: 400 + 119*GUI_SCALE, y: 50 + 32*GUI_SCALE, isValid: function(){return false;}},
		"slotResult3": {type: "slot", x: 400 + 119*GUI_SCALE, y: 50 + 51*GUI_SCALE, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 874, y: 50 + 2*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 874, y: 50 + 21*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 874, y: 50 + 40*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 874, y: 50 + 59*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"indicator": {type: "image", x: 400 + 88*GUI_SCALE, y: 50 + 59*GUI_SCALE, bitmap: "indicator_red", scale: GUI_SCALE}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiCentrifuge, "Thermal Centrifuge");
});

MachineRegistry.registerElectricMachine(BlockID.thermalCentrifuge, {
	defaultValues: {
		power_tier: 2,
		energy_storage: 30000,
		energy_consumption: 48,
		work_time: 500,
		meta: 0,
		progress: 0,
		isActive: false,
		isHeating: false,
		heat: 0,
		maxHeat: 5000,
		signal: 0
	},
	
	upgrades: ["overclocker", "transformer", "energyStorage", "redstone", "itemEjector", "itemPulling"],
	
	getGuiScreen: function(){
		return guiCentrifuge;
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	resetValues: function(){
		this.data.power_tier = this.defaultValues.power_tier;
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
		this.data.isHeating = this.data.signal > 0;
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

	putResult: function(result){
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
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		if(this.data.isHeating){
			this.data.maxHeat = 5000;
		}
		
		var newActive = false;
		var sourceSlot = this.container.getSlot("slotSource");
		var result = MachineRecipeRegistry.getRecipeResult("thermalCentrifuge", sourceSlot.id);
		if(result && this.checkResult(result.result) && this.data.energy > 0){
			this.data.maxHeat = result.heat;
			if(this.data.heat < result.heat){
				this.data.energy--;
				this.data.heat++;
			}
			else if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				newActive = true;
			}
			if(this.data.progress.toFixed(3) >= 1){
				sourceSlot.count--;
				this.putResult(result.result);
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else {
			this.data.maxHeat = 5000;
			this.data.progress = 0;
			if(this.data.isHeating && this.data.energy > 1){
				if(this.data.heat < 5000){this.data.heat++;}
				this.data.energy -= 2;
			}
			else if(this.data.heat > 0){
				this.data.heat--;
			}
		}
		this.setActive(newActive);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
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
		this.data.signal = signal.power > 0;
	},

	getEnergyStorage: function(){
		return this.data.energy_storage;
	},

	renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.thermalCentrifuge);

StorageInterface.createInterface(BlockID.thermalCentrifuge, {
	slots: {
		"slotSource": {input: true},
		"slotResult1": {output: true},
		"slotResult2": {output: true},
		"slotResult3": {output: true}
	},
	isValidInput: function(item){
		return MachineRecipeRegistry.hasRecipeFor("thermalCentrifuge", item.id);
	}
});




// file: machine/processing/blast_furnace.js

IDRegistry.genBlockID("blastFurnace");
Block.createBlock("blastFurnace", [
	{name: "Blast Furnace", texture: [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true},
], "stone");
TileRenderer.setStandartModel(BlockID.blastFurnace, [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.blastFurnace, 0, [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.blastFurnace, 6, [["machine_advanced", 0], ["ind_furnace_side", 1], ["machine_back", 0], ["heat_pipe", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]]);

MachineRegistry.setMachineDrop("blastFurnace", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.blastFurnace, count: 1, data: 0}, [
		"aaa",
		"asa",
		"axa"
	], ['s', BlockID.machineBlockBasic, 0, 'a', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
	
	MachineRecipeRegistry.registerRecipesFor("blastFurnace", {
		15: {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000},
		265: {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000},
		"ItemID.dustIron": {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000},
		"ItemID.crushedPurifiedIron": {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000},
		"ItemID.crushedIron": {result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000}
	}, true);
});


var guiBlastFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Blast Furnace")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	params: {       
		slot: "default_slot",
		invSlot: "default_slot"              
	},
	
	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
		{type: "bitmap", x: 400, y: 50, bitmap: "blast_furnace_background", scale: GUI_SCALE},
		{type: "bitmap", x: 540 + 6*GUI_SCALE, y: 110 + 8*GUI_SCALE, bitmap: "progress_scale_background", scale: GUI_SCALE*1.01}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 540 + 6*GUI_SCALE, y: 110 + 8*GUI_SCALE, direction: 1, value: 0.5, bitmap: "progress_scale", scale: GUI_SCALE*1.01},
		"heatScale": {type: "scale", x: 336 + 66*GUI_SCALE, y: 47 + 64*GUI_SCALE, direction: 0, value: 0.5, bitmap: "heat_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 400 + 6*GUI_SCALE, y: 70 + 16*GUI_SCALE, isValid: function(id){
			return MachineRecipeRegistry.hasRecipeFor("blastFurnace", id);
		}},
		"slotResult1": {type: "slot", x: 340 + 124*GUI_SCALE, y: 140 + 20*GUI_SCALE, isValid: function(){return false;}},
		"slotResult2": {type: "slot", x: 400 + 124*GUI_SCALE, y: 140 + 20*GUI_SCALE, isValid: function(){return false;}},
		"slotAir1": {type: "slot", x: 20 + 118*GUI_SCALE, y: 170 + 10*GUI_SCALE, isValid: function(id){return id == ItemID.cellAir;}},
		"slotAir2": {type: "slot", x: 80 + 118*GUI_SCALE, y: 170 + 10*GUI_SCALE, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 330 + 145*GUI_SCALE, y: 50 + 4*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 330 + 145*GUI_SCALE, y: 50 + 22*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"indicator": {type: "image", x: 344 + 88*GUI_SCALE, y: 53 + 58*GUI_SCALE, bitmap: "indicator_red", scale: GUI_SCALE}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiBlastFurnace, "Blast Furnace");
});

MachineRegistry.registerPrototype(BlockID.blastFurnace, {
	defaultValues:{
		meta: 0,
		progress: 0,
		air: 0,
		sourceID: 0,
		isActive: false,
		isHeating: false,
		heat: 0,
		signal: 0
	},
	
	upgrades: ["redstone", "itemEjector", "itemPulling"],
	
	getGuiScreen: function(){
       return guiBlastFurnace;
    },
	
	wrenchClick: function(id, count, data, coords){
		this.setFacing(coords);
	},
	
	setFacing: MachineRegistry.setFacing,
	
	checkResult: function(result){
		for(var i = 1; i < 3; i++){
			var id = result[(i-1)*2];
			var count = result[(i-1)*2+1];
			var resultSlot = this.container.getSlot("slotResult"+i);
			if((resultSlot.id != id || resultSlot.count + count > 64) && resultSlot.id != 0){
				return false;
			}
		}
		return true;
	},
	
	putResult: function(result){
		for(var i = 1; i < 3; i++){
			var id = result[(i-1)*2];
			var count = result[(i-1)*2+1];
			var resultSlot = this.container.getSlot("slotResult"+i);
			if(id){
				resultSlot.id = id;
				resultSlot.count += count;
			}
		}
	},
	
	controlAir: function(){
		var slot1 = this.container.getSlot("slotAir1");
		var slot2 = this.container.getSlot("slotAir2");
		if(this.data.air == 0){
			if(slot1.id==ItemID.cellAir && (slot2.id==0 || slot2.id==ItemID.cellEmpty && slot2.count < 64)){
				slot1.count--;
				slot2.id = ItemID.cellEmpty;
				slot2.count++;
				this.data.air = 1000;
			}
		}
		if(this.data.air > 0){
			this.data.air--;
			return true;
		}
		return false;
	},
	
	controlAirImage: function(content, set){
		if(content){
			if(set)		
			content.elements["indicatorAir"] = null;
			else
			content.elements["indicatorAir"] = {type: "image", x: 344 + 110*GUI_SCALE, y: 53 + 20*GUI_SCALE, bitmap: "no_air_image", scale: GUI_SCALE};
		}
	},
	
	setIndicator: function(content,set){
		if(content){
			if(set)
			content.elements["indicator"].bitmap = "indicator_green";
			else
			content.elements["indicator"].bitmap = "indicator_red";
		}
	},
	
    tick: function(){
		this.data.isHeating = this.data.signal > 0;
		UpgradeAPI.executeUpgrades(this);
		
		var maxHeat = this.getMaxHeat();
		this.container.setScale("heatScale", this.data.heat / maxHeat);
		var content = this.container.getGuiContent();
		
		if(this.data.heat >= maxHeat){
			this.setIndicator(content, true);
			var sourceSlot = this.container.getSlot("slotSource");
			var source = this.data.sourceID || sourceSlot.id;
			var result = MachineRecipeRegistry.getRecipeResult("blastFurnace", source);
			if(result && this.checkResult(result.result)){
				if(this.controlAir()){
					this.controlAirImage(content, true);
					this.data.progress++;
					this.container.setScale("progressScale", this.data.progress / result.duration);
					this.activate();
					
					if(!this.data.sourceID){
						this.data.sourceID = source;
						sourceSlot.count--;
					}
					
					if(this.data.progress >= result.duration){
						this.putResult(result.result);
						this.data.progress = 0;
						this.data.sourceID = 0;
					}
					this.container.validateAll();
				}
				else this.controlAirImage(content, false);
			}
		} else {
			this.setIndicator(content, false);
			this.deactivate();
		}
		
		this.data.heat = Math.max(this.data.heat - 1, 0);
		if(this.data.sourceID == 0){
			this.container.setScale("progressScale", 0);
		}
    },
	
	getMaxHeat: function(){
		return 47500;
	},
	
	redstone: function(signal){
		this.data.signal = signal.power > 0;
	},
	
	canReceiveHeat: function(side){
		return this.data.meta == side + Math.pow(-1, side);
	},
	
	heatReceive: function(amount){
		var slot = this.container.getSlot("slotSource");
		if(this.data.isHeating || this.data.sourceID > 0 || MachineRecipeRegistry.getRecipeResult("blastFurnace", slot.id)){
			amount = Math.min(this.getMaxHeat() - this.data.heat, Math.min(amount, 20));
			this.data.heat += amount;
			return amount;
		}
		return 0;
	},
	
	renderModel: MachineRegistry.renderModelWith6Sides,
});

TileRenderer.setRotationPlaceFunction(BlockID.blastFurnace, true);

StorageInterface.createInterface(BlockID.blastFurnace, {
	slots: {
		"slotSource": {input: true,
			isValid: function(item){
				return MachineRecipeRegistry.hasRecipeFor("blastFurnace", item.id);
			}
		},
		"slotAir1": {input: true, 
			isValid: function(item){
				return item.id == ItemID.cellAir;
			}
		},
		"slotAir2": {output: true},
		"slotResult1": {output: true},
		"slotResult2": {output: true}
	}
});




// file: machine/processing/fermenter.js

IDRegistry.genBlockID("icFermenter");
Block.createBlock("icFermenter", [
	{name: "Fermenter", texture: [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]], inCreative: true},
], "stone");
TileRenderer.setStandartModel(BlockID.icFermenter, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.icFermenter, 0, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.icFermenter, 6, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 1], ["heat_pipe", 1], ["ic_fermenter_side", 1], ["ic_fermenter_side", 1]]);

MachineRegistry.setMachineDrop("icFermenter");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.icFermenter, count: 1, data: 0}, [
		"aaa",
		"ccc",
		"axa"
	], ['c', ItemID.cellEmpty, 0, 'a', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
});


var guiFermenter = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Fermenter")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},
	
	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
		{type: "bitmap", x: 390, y: 80, bitmap: "fermenter_background", scale: GUI_SCALE},
		{type: "bitmap", x: 758, y: 95, bitmap: "liquid_bar", scale: GUI_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 492, y: 150, direction: 0, value: .5, bitmap: "fermenter_progress_scale", scale: GUI_SCALE},
		"fertilizerScale": {type: "scale", x: 480, y: 301, direction: 0, value: .5, bitmap: "fertilizer_progress_scale", scale: GUI_SCALE},
		"biogasScale": {type: "scale", x: 771, y: 108, direction: 1, value: .5, bitmap: "liquid_biogas", scale: GUI_SCALE},
		"biomassScale": {type: "scale", x: 483, y: 179, direction: 1, value: .5, bitmap: "biomass_scale", scale: GUI_SCALE},
		"slotBiomass0": {type: "slot", x: 400, y: 162, isValid: function(id, count, data){
            return LiquidLib.getItemLiquid(id, data) == "biomass";
        }},
		"slotBiomass1": {type: "slot", x: 400, y: 222, isValid: function(){return false;}},
		"slotFertilizer": {type: "slot", x: 634, y: 282, bitmap: "black_border_slot", isValid: function(){return false;}},
		"slotBiogas0": {type: "slot", x: 832, y: 155, isValid: function(id, count, data){
            return LiquidLib.getFullItem(id, data, "biogas") ? true : false;
        }},
		"slotBiogas1": {type: "slot", x: 832, y: 215, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 765, y: 290, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 825, y: 290, isValid: UpgradeAPI.isValidUpgrade}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiFermenter, "Fermenter");
});

MachineRegistry.registerPrototype(BlockID.icFermenter, {
	defaultValues:{
		meta: 0,
		heat: 0,
		progress: 0,
		fertilizer: 0,
		isActive: false,
	},
	
	upgrades: ["itemEjector", "itemPulling", "fluidEjector", "fluidPulling"],
	
	getGuiScreen: function(){
       return guiFermenter;
    },
	
	wrenchClick: function(id, count, data, coords){
		this.setFacing(coords);
	},
	
	setFacing: MachineRegistry.setFacing,
	
	init: function(){
		this.liquidStorage.setLimit("biomass", 10);
		this.liquidStorage.setLimit("biogas", 2);
		this.renderModel();
	},
	
	getLiquidFromItem: MachineRegistry.getLiquidFromItem,
	addLiquidToItem: MachineRegistry.addLiquidToItem,
	
	click: function(id, count, data, coords){
		var liquid = this.liquidStorage.getLiquidStored();
		if(Entity.getSneaking(player) && this.getLiquidFromItem("biogas", {id: id, count: count, data: data}, null, true)){
			return true;
		}
		if(ICTool.isValidWrench(id, data, 10)){
			if(this.setFacing(coords))
				ICTool.useWrench(id, data, 10);
			return true;
		}
		return false;
	},
	
    tick: function(){
		StorageInterface.checkHoppers(this);
		UpgradeAPI.executeUpgrades(this);
		this.setActive(this.data.heat > 0);
		
		if(this.data.heat > 0){
			this.data.progress += this.data.heat;
			this.data.heat = 0;
			
			if(this.data.progress >= 4000){
				this.liquidStorage.getLiquid("biomass", 0.02);
				this.liquidStorage.addLiquid("biogas", 0.4);
				this.data.fertilizer++;
				this.data.progress = 0;
			}
			
			var outputSlot = this.container.getSlot("slotFertilizer");
			if(this.data.fertilizer >= 25){
				this.data.fertilizer = 0;
				outputSlot.id = ItemID.fertilizer;
				outputSlot.count++;
			}
		}
		
		var slot1 = this.container.getSlot("slotBiomass0");
		var slot2 = this.container.getSlot("slotBiomass1");
		this.getLiquidFromItem("biomass", slot1, slot2);
		
		var slot1 = this.container.getSlot("slotBiogas0");
		var slot2 = this.container.getSlot("slotBiogas1");
		this.addLiquidToItem("biogas", slot1, slot2);
		
		this.container.setScale("progressScale", this.data.progress / 4000);
		this.container.setScale("fertilizerScale", this.data.fertilizer / 25);
		this.liquidStorage.updateUiScale("biomassScale", "biomass");
		this.liquidStorage.updateUiScale("biogasScale", "biogas");
    },
	
	canReceiveHeat: function(side){
		return this.data.meta == side + Math.pow(-1, side);
	},
	
	heatReceive: function(amount){
		var outputSlot = this.container.getSlot("slotFertilizer");
		if(this.liquidStorage.getAmount("biomass").toFixed(3) >= 0.02 && this.liquidStorage.getAmount("biogas") <= 1.6 && outputSlot.count < 64){
			this.data.heat = amount;
			return amount;
		}
		return 0;
	},
	
	renderModel: MachineRegistry.renderModelWith6Sides
});

TileRenderer.setRotationPlaceFunction(BlockID.icFermenter, true);

StorageInterface.createInterface(BlockID.icFermenter, {
	slots: {
		"slotBiomass0": {input: true},
		"slotBiomass1": {output: true},
		"slotBiogas0": {input: true},
		"slotBiogas1": {output: true},
		"slotFertilizer": {output: true}
	},
	canReceiveLiquid: function(liquid, side){
		return liquid == "biomass";
	},
	canTransportLiquid: function(liquid, side){ return true; },
	getLiquidStored: function(storage){
		return storage == "input" ? "biomass" : "biogas";
	}
});




// file: machine/uu/mass_fabricator.js

IDRegistry.genBlockID("massFabricator");
Block.createBlock("massFabricator", [
	{name: "Mass Fabricator", texture: [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.massFabricator, [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0]]);
TileRenderer.registerRotationModel(BlockID.massFabricator, 0, [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0]]);
TileRenderer.registerRotationModel(BlockID.massFabricator, 4, [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 1], ["machine_advanced_side", 0], ["machine_advanced_side", 0]]);

ItemName.setRarity(BlockID.massFabricator, 2, true);
ItemName.addTierTooltip("massFabricator", 4);

MachineRegistry.setMachineDrop("massFabricator", BlockID.machineBlockAdvanced);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.massFabricator, count: 1, data: 0}, [
		"xax",
		"b#b",
		"xax"
	], ['b', BlockID.machineBlockAdvanced, 0, 'x', 348, 0, 'a', ItemID.circuitAdvanced, 0, '#', ItemID.storageLapotronCrystal, -1]);
});


var ENERGY_PER_MATTER = 1000000;

var guiMassFabricator = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Mass Fabricator")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 850, y: 190, bitmap: "energy_small_background", scale: GUI_SCALE}
	],
	
	elements: {
		"energyScale": {type: "scale", x: 850, y: 190, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"matterSlot": {type: "slot", x: 821, y: 75, size: 100, isValid: function(){return false;}},
		"catalyserSlot": {type: "slot", x: 841, y: 252, isValid: function(id){
			return MachineRecipeRegistry.hasRecipeFor("catalyser", id);
		}},
		"textInfo1": {type: "text", x: 542, y: 142, width: 200, height: 30, text: "Progress:"},
		"textInfo2": {type: "text", x: 542, y: 177, width: 200, height: 30, text: "0%"},
		"textInfo3": {type: "text", x: 542, y: 212, width: 200, height: 30, text: " "},
		"textInfo4": {type: "text", x: 542, y: 239, width: 200, height: 30, text: " "},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiMassFabricator, "Mass Fabricator");
});

MachineRegistry.registerElectricMachine(BlockID.massFabricator, {
	defaultValues: {
		meta: 0,
		progress: 0,
		catalyser: 0,
		isEnabled: true,
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiMassFabricator;
	},
	
	getTier: function(){
		return 4;
	},
	
	tick: function(){
		StorageInterface.checkHoppers(this);
		
		this.container.setScale("energyScale", this.data.progress / ENERGY_PER_MATTER);
		this.container.setText("textInfo2", parseInt(100 * this.data.progress / ENERGY_PER_MATTER) + "%");
		
		if(this.data.isEnabled && this.data.energy > 0){
			this.activate();
			this.startPlaySound("Generators/MassFabricator/MassFabLoop.ogg");
			if(this.data.catalyser < Math.max(1000, this.data.energy)){
				var catalyserSlot = this.container.getSlot("catalyserSlot");
				var catalyserData = MachineRecipeRegistry.getRecipeResult("catalyser", catalyserSlot.id);
				if(catalyserData){
					this.data.catalyser += catalyserData.input;
					catalyserSlot.count--;
					this.container.validateAll();
				}
			}
			if(this.data.catalyser > 0){
				this.container.setText("textInfo3", "Catalyser:");
				this.container.setText("textInfo4", parseInt(this.data.catalyser));
				var transfer = Math.min((ENERGY_PER_MATTER - this.data.progress) / 6, Math.min(this.data.catalyser, this.data.energy));
				this.data.progress += transfer * 6;
				this.data.energy -= transfer;
				this.data.catalyser -= transfer;
				if(World.getThreadTime()%40 == 0 && transfer > 0){
					SoundAPI.playSoundAt(this, "Generators/MassFabricator/MassFabScrapSolo.ogg", false, 16);
				}
			}
			else{
				this.container.setText("textInfo3", "");
				this.container.setText("textInfo4", "");
			}
			var transfer = Math.min(ENERGY_PER_MATTER - this.data.progress, this.data.energy);
			this.data.progress += transfer;
			this.data.energy -= transfer;
		}
		else{
			this.stopPlaySound();
			this.deactivate();
		}
		if(this.data.progress >= ENERGY_PER_MATTER){
			var matterSlot = this.container.getSlot("matterSlot");
			if(matterSlot.id == ItemID.matter && matterSlot.count < 64 || matterSlot.id == 0){
				matterSlot.id = ItemID.matter;
				matterSlot.count++;
				this.data.progress = 0;
			}
		}
	},
	
	redstone: function(signal){
		this.data.isEnabled = (signal.power == 0);
	},
	
	getEnergyStorage: function(){
		return ENERGY_PER_MATTER - this.data.progress;
	},
	
	renderModel: MachineRegistry.renderModelWithRotation,
	energyReceive: function(type, amount, voltage) {
		if(this.data.isEnabled){
			if(Config.voltageEnabled && voltage > this.getMaxPacketSize()){
				World.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, 15, true);
				SoundAPI.playSoundAt(this, "Machines/MachineOverload.ogg", false, 32);
				this.selfDestroy();
				return 1;
			}
			var add = Math.min(amount, this.getEnergyStorage() - this.data.energy);
			this.data.energy += add;
			this.data.energy_receive += add;
			this.data.voltage = Math.max(this.data.voltage, voltage);
			return add;
		}
		return 0;
	}
});

TileRenderer.setRotationPlaceFunction(BlockID.massFabricator);

StorageInterface.createInterface(BlockID.massFabricator, {
	slots: {
		"catalyserSlot": {input: true},
		"matterSlot": {output: true}
	},
	isValidInput: function(item){
		return MachineRecipeRegistry.hasRecipeFor("catalyser", item.id);
	}
});




// file: machine/uu/scanner.js

// rarity - 1




// file: machine/uu/pattern_storage.js





// file: machine/uu/replicator.js

// rarity - 1




// file: machine/fluid/pump.js

IDRegistry.genBlockID("pump");
Block.createBlock("pump", [
	{name: "Pump", texture: [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.pump, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]]);
TileRenderer.registerRotationModel(BlockID.pump, 0, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]]);
TileRenderer.registerRotationModel(BlockID.pump, 4, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 1], ["pump_side", 1], ["pump_side", 1]]);

ItemName.addTierTooltip("pump", 1);

MachineRegistry.setMachineDrop("pump", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.pump, count: 1, data: 0}, [
		"cxc",
		"c#c",
		"bab"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'a', ItemID.treetap, 0, 'b', BlockID.miningPipe, 0, 'c', ItemID.cellEmpty, 0]);
});


var guiPump = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Pump")}},
		inventory: {standart: true},
		background: {standart: true}
	},

	drawing: [
		{type: "bitmap", x: 493, y: 149, bitmap: "extractor_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 407, y: 127, bitmap: "energy_small_background", scale: GUI_SCALE},
		{type: "bitmap", x: 602, y: 88, bitmap: "liquid_bar", scale: GUI_SCALE},
		{type: "bitmap", x: 675, y: 152, bitmap: "pump_arrow", scale: GUI_SCALE},
	],

	elements: {
		"progressScale": {type: "scale", x: 493, y: 149, direction: 0, value: 0.5, bitmap: "extractor_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 407, y: 127, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"liquidScale": {type: "scale", x: 400 + 67*GUI_SCALE, y: 50 + 16*GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slotEnergy": {type: "slot", x: 400, y: 50 + 39*GUI_SCALE, isValid: MachineRegistry.isValidEUStorage},
		"slotLiquid1": {type: "slot", x: 400 + 91*GUI_SCALE, y: 50 + 12*GUI_SCALE,
			isValid: function(id, count, data){
				return LiquidLib.getFullItem(id, data, "water")? true : false;
			}
		},
		"slotLiquid2": {type: "slot", x: 400 + 125*GUI_SCALE, y: 50 + 29*GUI_SCALE, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 880, y: 50 + 2*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 880, y: 50 + 21*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 880, y: 50 + 40*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 880, y: 50 + 59*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiPump, "Pump");
});

MachineRegistry.registerElectricMachine(BlockID.pump, {
	defaultValues: {
		power_tier: 1,
		energy_storage: 800,
		energy_consumption: 1,
		work_time: 20,
		progress: 0,
		isActive: false,
		coords: null
	},
	
	upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidEjector"],
	
	getGuiScreen: function(){
		return guiPump;
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	resetValues: function(){
		this.data.power_tier = this.defaultValues.power_tier;
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	renderModel: MachineRegistry.renderModelWithRotation,
	addLiquidToItem: MachineRegistry.addLiquidToItem,
	
	init: function(){
		this.liquidStorage.setLimit("water", 8);
		this.liquidStorage.setLimit("lava", 8);
		this.renderModel();
	},
	
	getLiquidType: function(liquid, block){
		if((!liquid || liquid=="water") && (block.id == 8 || block.id == 9)){
			return "water";
		}
		if((!liquid || liquid=="lava") && (block.id == 10 || block.id == 11)){
			return "lava";
		}
		return null;
	},
	
	recursiveSearch: function(liquid, x, y, z, map){
		var block = World.getBlock(x, y, z);
		var scoords = x+':'+y+':'+z;
		if(!map[scoords] && Math.abs(this.x - x) <= 64 && Math.abs(this.z - z) <= 64 && this.getLiquidType(liquid, block)){
			if(block.data == 0) return {x: x, y: y, z: z};
			map[scoords] = true;
			return this.recursiveSearch(liquid, x, y+1, z, map) ||
			this.recursiveSearch(liquid, x+1, y, z, map) ||
			this.recursiveSearch(liquid, x-1, y, z, map) ||
			this.recursiveSearch(liquid, x, y, z+1, map) ||
			this.recursiveSearch(liquid, x, y, z-1, map);
		}
		return null;
	},
	
	tick: function(){
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		
		var newActive = false;
		var liquid = this.liquidStorage.getLiquidStored();
		if(this.y > 0 && this.liquidStorage.getAmount(liquid) <= 7 && this.data.energy >= this.data.energy_consumption){
			if(this.data.progress == 0){
				this.data.coords = this.recursiveSearch(liquid, this.x, this.y-1, this.z, {});
			}
			if(this.data.coords){
				newActive = true;
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				this.startPlaySound("Machines/PumpOp.ogg");
				if(this.data.progress.toFixed(3) >= 1){
					var coords = this.data.coords;
					var block = World.getBlock(coords.x, coords.y, coords.z);
					liquid = this.getLiquidType(liquid, block);
					if(liquid && block.data == 0){
						World.setBlock(coords.x, coords.y, coords.z, 0);
						this.liquidStorage.addLiquid(liquid, 1);
					}
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		if(!newActive)
			this.stopPlaySound();
		this.setActive(newActive);
		
		var slot1 = this.container.getSlot("slotLiquid1");
		var slot2 = this.container.getSlot("slotLiquid2");
		this.addLiquidToItem(liquid, slot1, slot2);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
		this.container.setScale("progressScale", this.data.progress);
		this.liquidStorage.updateUiScale("liquidScale", liquid);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},

	getEnergyStorage: function(){
		return this.data.energy_storage;
	}
});

TileRenderer.setRotationPlaceFunction(BlockID.pump);

StorageInterface.createInterface(BlockID.pump, {
	slots: {
		"slotLiquid1": {input: true},
		"slotLiquid2": {output: true}
	},
	isValidInput: function(item){
		return LiquidLib.getFullItem(item.id, item.data, "water")? true : false;
	},
	canReceiveLiquid: function(liquid, side){ return false; },
	canTransportLiquid: function(liquid, side){ return true; }
});




// file: machine/fluid/fluid_distributor.js

IDRegistry.genBlockID("fluidDistributor");
Block.createBlock("fluidDistributor", [
	{name: "Fluid Distributor", texture: [["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 0], ["fluid_distributor", 1], ["fluid_distributor", 1]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.fluidDistributor, [["fluid_distributor", 0], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1]]);
TileRenderer.registerFullRotationModel(BlockID.fluidDistributor, 0, [["fluid_distributor", 1], ["fluid_distributor", 0]]);
TileRenderer.registerFullRotationModel(BlockID.fluidDistributor, 6, [["fluid_distributor", 0], ["fluid_distributor", 1]]);

MachineRegistry.setMachineDrop("fluidDistributor", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.fluidDistributor, count: 1, data: 0}, [
		" a ",
		" # ",
		" c "
	], ['#', BlockID.machineBlockBasic, 0, 'a', ItemID.upgradeFluidPulling, 0, 'c', ItemID.cellEmpty, 0]);
});

var guiFluidDistributor = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Fluid Distributor")}},
		inventory: {standart: true},
		background: {standart: true},
	},
	
	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},
	
	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
		{type: "bitmap", x: 400 + 3*GUI_SCALE, y: 146, bitmap: "fluid_distributor_background", scale: GUI_SCALE},
	],
	
	elements: {
		"liquidScale": {type: "scale", x: 480, y: 50 + 34*GUI_SCALE, direction: 1, value: 0, bitmap: "fluid_dustributor_bar", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 400 + 3*GUI_SCALE, y: 50 + 47*GUI_SCALE, isValid: function(id, count, data){
			return LiquidLib.getFullItem(id, data, "water")? true : false;
		}},
		"slot2": {type: "slot", x: 400 + 3*GUI_SCALE, y: 50 + 66*GUI_SCALE, isValid: function(){return false;}},
		"button_switch": {type: "button", x: 400 + 112*GUI_SCALE, y: 50 + 53*GUI_SCALE, bitmap: "fluid_distributor_button", scale: GUI_SCALE, clicker: {
			onClick: function(container, tile){
				tile.data.inverted = !tile.data.inverted;
				TileRenderer.mapAtCoords(tile.x, tile.y, tile.z, BlockID.fluidDistributor, tile.data.meta + 6*tile.data.inverted);
			}
		}},
		"text1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 400 + 107*GUI_SCALE, y: 50+42*GUI_SCALE, width: 128, height: 48, text: Translation.translate("Mode:")},
		"text2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 400 + 92*GUI_SCALE, y: 50+66*GUI_SCALE, width: 256, height: 48, text: Translation.translate("Distribute")},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiFluidDistributor, "Fluid Distributor");
});

MachineRegistry.registerPrototype(BlockID.fluidDistributor, {
	defaultValues: {
		meta: 0,
		inverted: false
	},
	
	getGuiScreen: function(){
		return guiFluidDistributor;
	},

	init: function(){
		this.liquidStorage.setLimit(null, 1);
		this.renderModel();
	},
	
	addLiquidToItem: MachineRegistry.addLiquidToItem,
	
	tick: function(){
		if(this.data.inverted){
			this.container.setText("text2", Translation.translate("Concentrate"));
		} else {
			this.container.setText("text2", Translation.translate("Distribute"));
		}
		
		var storage = this.liquidStorage;
		var liquid = storage.getLiquidStored();
		var slot1 = this.container.getSlot("slot1");
		var slot2 = this.container.getSlot("slot2");
		this.addLiquidToItem(liquid, slot1, slot2);
		
		liquid = storage.getLiquidStored();
		if(liquid){
			var input = StorageInterface.getNearestLiquidStorages(this, this.data.meta, !this.data.inverted);
			for(var side in input){
				StorageInterface.transportLiquid(liquid, 0.25, this, input[side], parseInt(side));
			}
		}
		
		storage.updateUiScale("liquidScale", liquid);
	},
	
	wrenchClick: function(id, count, data, coords){
		this.setFacing(coords);
	},
	
	setFacing: MachineRegistry.setFacing,
	
	renderModel: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta + 6*this.data.inverted);
	},
	destroy: function(){
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	},
});

TileRenderer.setRotationPlaceFunction("fluidDistributor", true);

StorageInterface.createInterface(BlockID.fluidDistributor, {
	slots: {
		"slot1": {input: true},
		"slot2": {output: true}
	},
	isValidInput: function(item){
		return LiquidLib.getFullItem(item.id, item.data, "water")? true : false;
	},
	canReceiveLiquid: function(liquid, side){
		let data = this.tileEntity.data;
		return (side == data.meta) ^ data.inverted;
	},
	canTransportLiquid: function(liquid, side){
		return true;
	}
});




// file: machine/fluid/tank.js

IDRegistry.genBlockID("tank");
Block.createBlock("tank", [
	{name: "Tank", texture: [["machine_bottom", 0], ["machine_top", 0], ["tank_side", 0], ["tank_side", 0], ["tank_side", 0], ["tank_side", 0]], inCreative: true}
], "stone");

MachineRegistry.setMachineDrop("tank");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.tank, count: 1, data: 0}, [
		" c ",
		"c#c",
		" c "
	], ['#', BlockID.machineBlockBasic, 0, 'c', ItemID.cellEmpty, 0]);
});


var guiTank = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Tank")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 611, y: 88, bitmap: "liquid_bar", scale: GUI_SCALE},
	],
	
	elements: {
		"liquidScale": {type: "scale", x: 400 + 70*GUI_SCALE, y: 50 + 16*GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slotLiquid1": {type: "slot", x: 400 + 94*GUI_SCALE, y: 50 + 16*GUI_SCALE, isValid: function(id, count, data){
			return (LiquidRegistry.getFullItem(id, data, "water") || LiquidLib.getEmptyItem(id, data))? true : false;
		}},
		"slotLiquid2": {type: "slot", x: 400 + 94*GUI_SCALE, y: 50 + 40*GUI_SCALE, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 870, y: 50 + 4*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 870, y: 50 + 22*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 870, y: 50 + 40*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 870, y: 50 + 58*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiTank, "Tank");
});

MachineRegistry.registerPrototype(BlockID.tank, {
	upgrades: ["fluidEjector", "fluidPulling"],
	
	getGuiScreen: function(){
		return guiTank;
	},
	
	init: function(){
		this.liquidStorage.setLimit(null, 16);
	},
	
	getLiquidFromItem: MachineRegistry.getLiquidFromItem,
	
	click: function(id, count, data, coords){
		if(Entity.getSneaking(player)){
			var liquid = this.liquidStorage.getLiquidStored();
			return this.getLiquidFromItem(liquid, {id: id, count: count, data: data}, null, true);
		}
	},
	
	tick: function(){
		UpgradeAPI.executeUpgrades(this);
		
		var storage = this.liquidStorage;
		var liquid = storage.getLiquidStored();
		var slot1 = this.container.getSlot("slotLiquid1");
		var slot2 = this.container.getSlot("slotLiquid2");
		this.getLiquidFromItem(liquid, slot1, slot2);
		if(liquid){
			var full = LiquidLib.getFullItem(slot1.id, slot1.data, liquid);
			if(full && storage.getAmount(liquid) >= full.storage && (slot2.id == full.id && slot2.data == full.data && slot2.count < Item.getMaxStack(full.id) || slot2.id == 0)){
				storage.getLiquid(liquid, full.storage);
				slot1.count--;
				slot2.id = full.id;
				slot2.data = full.data;
				slot2.count++;
				this.container.validateAll();
			}
		}
		storage.updateUiScale("liquidScale", storage.getLiquidStored());
	}
});

StorageInterface.createInterface(BlockID.tank, {
	slots: {
		"slotLiquid1": {input: true},
		"slotLiquid2": {output: true}
	},
	isValidInput: function(item){
		return LiquidRegistry.getFullItem(item.id, item.data, "water") || LiquidLib.getEmptyItem(item.id, item.data);
	},
	canReceiveLiquid: function(liquid, side){ return true; },
	canTransportLiquid: function(liquid, side){ return true; }
});




// file: machine/resource/miner.js

IDRegistry.genBlockID("miner");
Block.createBlock("miner", [
	{name: "Miner", texture: [["miner_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.miner, [["miner_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.miner, 0, [["miner_bottom", 1], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.miner, 4, [["miner_bottom", 1], ["machine_top", 0], ["machine_side", 0], ["miner_front", 1], ["miner_side", 1], ["miner_side", 1]]);

ItemName.addTierTooltip("miner", 2);

MachineRegistry.setMachineDrop("miner", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.miner, count: 1, data: 0}, [
		"x#x",
		" b ",
		" b "
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'b', BlockID.miningPipe, 0]);
});


var guiMiner = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Miner")}},
		inventory: {standart: true},
		background: {standart: true},
	},

	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},

	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
		{type: "bitmap", x: 550, y: 150, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"energyScale": {type: "scale", x: 550, y: 150, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotDrill": {type: "slot", x: 441, y: 75, bitmap: "slot_drill", 
			isValid: function(id){
				if(id == ItemID.drill || id == ItemID.diamondDrill) return true;
				return false;
			}
		},
		"slotPipe": {type: "slot", x: 541, y: 75,
			isValid: function(id){
				if(ToolLib.isBlock(id) && !TileEntity.isTileEntityBlock(id)) return true;
				return false;
			}
		},
		"slotScanner": {type: "slot", x: 641, y: 75, bitmap: "slot_scanner", 
			isValid: function(id){
				if(id == ItemID.scanner || id == ItemID.scannerAdvanced) return true;
				return false;
			}
		},
		"slotEnergy": {type: "slot", x: 541, y: 212, isValid: MachineRegistry.isValidEUStorage},
	}
});
Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiMiner, "Miner");
});


var dropData0 = [3, 25, 39, 40, 46, 50, 53, 54, 58, 65, 72, 96, 107, 134, 135, 136, 143, 146, 163, 164, 165, 170, 183, 184, 185, 186, 187];
// noDrop = [6, 18, 30, 31, 32, 59, 81, 83, 86, 92, 99, 100, 103, 104, 105, 106, 111, 115, 127, 131, 132, 140, 141, 142, 161, 175, 244];

function getBlockDrop(coords, id, data, level, enchant, smelt){
	if(smelt){
		if(id == 78) return [];
		if(id == 80){
			World.setBlock(coords.x, coords.y, coords.z, 8);
			return [];
		}
	}
	var dropFunc = Block.dropFunctions[id];
	if(dropFunc){
		return dropFunc(coords, id, data, level, enchant || {});
	}
	if(id==5 || id == 19 || id==35 || id==85 || id==144 || id==171) return [[id, 1, data]];
	if(id == 17 || id == 162) return [[id, 1, data%4]];
	if(id == 26) return [[355, 1, 0]];
	if(id == 47){
		if(enchant.silk) return [[47, 1, 0]];
		return [[340, 3, 0]];
	}
	if(id == 55) return [[331, 1, 0]];
	if(id == 60) return [[3, 1, 0]];
	if(id == 63 || id == 68) return [[338, 1, 0]];
	if(id == 64) return [[324, 1, 0]];
	if(id == 75 || id == 76) return [[76, 1, 0]];
	if(id == 79 || id == 174){
		World.setBlock(coords.x, coords.y, coords.z, 8);
		return [];
	}
	if(id == 93 || id == 94) return [[356, 1, 0]];
	if(id == 149 || id == 150) return [[404, 1, 0]];
	if(id == 151 || id == 178) return [[151, 1, 0]];
	if(id == 158) return [[158, 1, data%8]];
	if(id == 193) return [[427, 1, 0]];
	if(id == 194) return [[428, 1, 0]];
	if(id == 195) return [[429, 1, 0]];
	if(id == 196) return [[430, 1, 0]];
	if(id == 197) return [[431, 1, 0]];
	if(dropData0.indexOf(id) != -1) return [[id, 1, 0]];
	return [];
}

MachineRegistry.registerElectricMachine(BlockID.miner, {
	defaultValues: {
		meta: 0,
		x: 0,
		y: 0,
		z: 0,
		scanY: 0,
		scanR: 0,
		progress: 0,
		isActive: false
	},

	getGuiScreen: function(){
		return guiMiner;
	},
	
	getTier: function(){
		return 2;
	},
	
	getMiningValues: function(slot){
		if(slot.id == ItemID.drill) return {energy: 6, time: 100}
		return {energy: 20, time: 50}
	},
	
	findOre: function(level){
		var r = this.data.scanR;
		while (r){
			if(this.data.x > this.x+r){
				this.data.x = this.x-r;
				this.data.z++;
			}
			if(this.data.z > this.z+r) break;
			var blockID = World.getBlockID(this.data.x, this.data.scanY, this.data.z);
			if(ore_blocks.indexOf(blockID) != -1 && level >= ToolAPI.getBlockDestroyLevel(blockID)){
				return true;
			}
			this.data.x++;
		}
		return false;
	},
	
	isValid: function(block){
		if(block.id == 0 || block.id > 7 && block.id < 12 && block.data > 0) return true;
		return false;
	},

	canBeDestroyed: function(blockID, level){
		var material = ToolAPI.getBlockMaterial(blockID);
		if(!material || material.name != "unbreaking" && level >= ToolAPI.getBlockDestroyLevel(blockID)){
			return true;
		}
		return false;
	},
	
	findPath: function(x, y, z, sprc, level){
		var block = World.getBlock(x, y, z);
		if(block.id==BlockID.miningPipe || this.isValid(block)){
			var dx = this.data.x - x;
			var dz = this.data.z - z;
			if(Math.abs(dx) == Math.abs(dz)){
				var prc = sprc;
			}else if(Math.abs(dx) > Math.abs(dz)){
				var prc = 0;
			} else {
				var prc = 1;
			}
			if(prc == 0){
				if(dx > 0) x++;
				else x--;
			} else {
				if(dz > 0) z++;
				else z--;
			}
			return this.findPath(x, y, z, sprc, level);
		} else if(this.canBeDestroyed(block.id, level)){
			return {x: x, y: y, z: z};
		}
		this.data.x++;
		return;
	},
	
	mineBlock: function(x, y, z, block, level){
		var drop = getBlockDrop({x: x,  y: y, z: z}, block.id, block.data, level);
		var items = [];
		for(var i in drop){
			items.push({id: drop[i][0], count: drop[i][1], data: drop[i][2]});
		}
		var container = World.getContainer(x, y, z);
		if(container){
			slots = StorageInterface.getContainerSlots(container);
			for(var i in slots){
				var slot = container.getSlot(slots[i]);
				if(slot.id > 0){
					items.push({id: slot.id, count: slot.count, data: slot.data, extra: slot.extra});
					if(container.slots){
						slot.id = slot.count = slot.data = 0;
					} else {
						container.setSlot(i, 0, 0, 0);
					}
				}
			}
		}
		World.setBlock(x, y, z, 0);
		this.drop(items);
		this.data.progress = 0;
	},
	
	setPipe: function(y, slot){
		if(y < this.y)
			World.setBlock(this.x, y, this.z, BlockID.miningPipe, 0);
		World.setBlock(this.x, y-1, this.z, BlockID.miningPipe, 1);
		slot.count--;
		if(!slot.count) slot.id = 0;
		this.data.progress = 0;
	},
	
	drop: function(items){
		var containers = StorageInterface.getNearestContainers(this, 0, true);
		if(containers){
			StorageInterface.putItems(items, containers, this);
		}
		for(var i in items){
			var item = items[i]
			if(item.count > 0){
				nativeDropItem(this.x+0.5, this.y+1, this.z+0.5, 2, item.id, item.count, item.data, item.extra);
			}
		}
	},
	
	tick: function(){
		if(this.data.progress == 0){
			var y = this.y;
			while(World.getBlockID(this.x, y-1, this.z) == BlockID.miningPipe){
				y--;
			}
			this.data.y = y;
		}
		
		var newActive = false;
		var drillSlot = this.container.getSlot("slotDrill");
		var pipeSlot = this.container.getSlot("slotPipe");
		if(drillSlot.id == ItemID.drill || drillSlot.id == ItemID.diamondDrill){
			if(this.data.y < this.y && this.data.scanY != this.data.y){
				var r = 0;
				var scanner = this.container.getSlot("slotScanner");
				if(scanner.id == ItemID.scanner && scanner.data + 50 <= Item.getMaxDamage(scanner.id)){
					scanner.data += 50;
					r = scan_radius;
				}else if(scanner.id == ItemID.scannerAdvanced && scanner.data + 250 <= Item.getMaxDamage(scanner.id)){
					scanner.data += 250;
					r = adv_scan_radius;
				}
				this.data.x = this.x - r;
				this.data.z = this.z - r;
				this.data.scanY = this.data.y;
				this.data.scanR = r;
			}
			var level = ToolAPI.getToolLevel(drillSlot.id);
			if(this.data.y < this.y && this.findOre(level)){
				var dx = this.data.x - this.x;
				var dz = this.data.z - this.z;
				var prc = 0;
				if(Math.abs(dx) > Math.abs(dz)){
					prc = 1;
				}
				var coords  = this.findPath(this.x, this.data.y, this.z, prc, level);
				if(coords){
					var block = World.getBlock(coords.x, coords.y, coords.z);
					var params = this.getMiningValues(drillSlot);
					if(this.data.energy >= params.energy){
						this.data.energy -= params.energy;
						this.data.progress++;
						newActive = true;
					}
					if(this.data.progress >= params.time){
						this.mineBlock(coords.x, coords.y, coords.z, block, level);
					}
				}
			}
			else if(this.data.y > 0 && pipeSlot.id == BlockID.miningPipe){
				var block = World.getBlock(this.x, this.data.y-1, this.z);
				if(this.isValid(block)){
					if(this.data.energy >= 3){
						this.data.energy -= 3;
						this.data.progress++;
						newActive = true;
					}
					if(this.data.progress >= 20){
						this.setPipe(this.data.y, pipeSlot);
					}
				}
				else if(this.canBeDestroyed(block.id, level)){
					var block = World.getBlock(this.x, this.data.y-1, this.z);
					var params = this.getMiningValues(drillSlot);
					if(this.data.energy >= params.energy){
						this.data.energy -= params.energy;
						this.data.progress++;
						newActive = true;
					}
					if(this.data.progress >= params.time){
						this.mineBlock(this.x, this.data.y-1, this.z, block, level);
						this.setPipe(this.data.y, pipeSlot);
					}
				}
			}
		}
		else {
			if(World.getBlockID(this.x, this.data.y, this.z) == BlockID.miningPipe){
				if(this.data.energy >= 3){
					this.data.energy -= 3;
					this.data.progress++;
					newActive = true;
				}
				if(this.data.progress >= 20){
					this.drop([{id: BlockID.miningPipe, count: 1, data: 0}]);
					var pipeSlot = this.container.getSlot("slotPipe");
					if(pipeSlot.id != 0 && ToolLib.isBlock(pipeSlot.id) && !TileEntity.isTileEntityBlock(id) && pipeSlot.id != BlockID.miningPipe){
						var blockId = Block.covertItemToBlockId(pipeSlot.id);
						World.setBlock(this.x, this.data.y, this.z, blockId, pipeSlot.data);
						pipeSlot.count--;
						if(!pipeSlot.count) pipeSlot.id = 0;
					}
					else{World.setBlock(this.x, this.data.y, this.z, 0);}
					this.data.progress = 0;
				}
			}
		}
		if(newActive){
			this.startPlaySound("Machines/MinerOp.ogg");
		} else {
			this.stopPlaySound();
		}
		this.setActive(newActive);

		var energyStorage = this.getEnergyStorage();
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotDrill"), "Eu", this.data.energy, 2);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotScanner"), "Eu", this.data.energy, 2);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, 2);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},

	getEnergyStorage: function(){
		return 10000;
	},
	
	renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.miner);




// file: machine/resource/advanced_miner.js

IDRegistry.genBlockID("advancedMiner");
Block.createBlock("advancedMiner", [
	{name: "Advanced Miner", texture: [["teleporter_top", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.advancedMiner, [["teleporter_top", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]], true);
TileRenderer.registerRotationModel(BlockID.advancedMiner, 0, [["teleporter_top", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.advancedMiner, 4, [["teleporter_top", 1], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 1], ["miner_side", 1]]);

ItemName.setRarity(BlockID.advancedMiner, 2, true);
ItemName.addStorageBlockTooltip("advancedMiner", 3, "4M");

Block.registerDropFunction("advancedMiner", function(coords, blockID, blockData, level){
	return [];
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.advancedMiner, count: 1, data: 0}, [
		"pmp",
		"e#a",
		"pmp"
	], ['#', BlockID.machineBlockAdvanced, 0, 'a', BlockID.teleporter, 0, 'e', BlockID.storageMFE, -1, 'm', BlockID.miner, -1, 'p', ItemID.plateAlloy, 0]);
});


var guiAdvancedMiner = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Advanced Miner")}},
		inventory: {standart: true},
		background: {standart: true},
	},

	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},

	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
		{type: "bitmap", x: 400 + 2*GUI_SCALE, y: 50 + 49*GUI_SCALE, bitmap: "energy_small_background", scale: GUI_SCALE},
		{type: "bitmap", x: 400 + 28*GUI_SCALE, y: 50 + 21*GUI_SCALE, bitmap: "miner_mode", scale: GUI_SCALE},
		{type: "bitmap", x: 400, y: 50 + 98*GUI_SCALE, bitmap: "miner_info", scale: GUI_SCALE},
	],

	elements: {
		"energyScale": {type: "scale", x: 400 + 2*GUI_SCALE, y: 50 + 49*GUI_SCALE, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotScanner": {type: "slot", x: 400, y: 50 + 19*GUI_SCALE, bitmap: "slot_scanner", 
			isValid: function(id){
				if(id == ItemID.scanner || id == ItemID.scannerAdvanced) return true;
				return false;
			}
		},
		"slotEnergy": {type: "slot", x: 400, y: 290, isValid: MachineRegistry.isValidEUStorage},
		"slot1": {type: "slot", x: 400 + 28*GUI_SCALE, y: 50 + 37*GUI_SCALE},
		"slot2": {type: "slot", x: 400 + 47*GUI_SCALE, y: 50 + 37*GUI_SCALE},
		"slot3": {type: "slot", x: 400 + 66*GUI_SCALE, y: 50 + 37*GUI_SCALE},
		"slot4": {type: "slot", x: 400 + 85*GUI_SCALE, y: 50 + 37*GUI_SCALE},
		"slot5": {type: "slot", x: 400 + 104*GUI_SCALE, y: 50 + 37*GUI_SCALE},
		"slot6": {type: "slot", x: 400 + 28*GUI_SCALE, y: 50 + 56*GUI_SCALE},
		"slot7": {type: "slot", x: 400 + 47*GUI_SCALE, y: 50 + 56*GUI_SCALE},
		"slot8": {type: "slot", x: 400 + 66*GUI_SCALE, y: 50 + 56*GUI_SCALE},
		"slot9": {type: "slot", x: 400 + 85*GUI_SCALE, y: 50 + 56*GUI_SCALE},
		"slot10": {type: "slot", x: 400 + 104*GUI_SCALE, y: 50 + 56*GUI_SCALE},
		"slot11": {type: "slot", x: 400 + 28*GUI_SCALE, y: 290},
		"slot12": {type: "slot", x: 400 + 47*GUI_SCALE, y: 290},
		"slot13": {type: "slot", x: 400 + 66*GUI_SCALE, y: 290},
		"slot14": {type: "slot", x: 400 + 85*GUI_SCALE, y: 290},
		"slot15": {type: "slot", x: 400 + 104*GUI_SCALE, y: 290},
		"slotUpgrade1": {type: "slot", x: 871, y: 50 + 37*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 871, y: 50 + 56*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"button_switch": {type: "button", x: 400 + 116*GUI_SCALE, y: 50 + 21*GUI_SCALE, bitmap: "miner_button_switch", scale: GUI_SCALE, clicker: {
			onClick: function(container, tile){
				tile.data.whitelist = !tile.data.whitelist;
			}
		}},
		"button_restart": {type: "button", x: 400 + 125*GUI_SCALE, y: 50 + 98*GUI_SCALE, bitmap: "miner_button_restart", scale: GUI_SCALE, clicker: {
			onClick: function(container, tile){
				tile.data.x = tile.data.y = tile.data.z =  0;
			}
		}},
		"button_silk": {type: "button", x: 400 + 126*GUI_SCALE, y: 50 + 41*GUI_SCALE, bitmap: "miner_button_silk_0", scale: GUI_SCALE, clicker: {
			onClick: function(container, tile){
				tile.data.silk_touch = (tile.data.silk_touch+1)%2;
			}
		}},
		"textInfoMode": {type: "text", font: {size: 24, color: Color.GREEN}, x: 400 + 32*GUI_SCALE, y: 50+24*GUI_SCALE, width: 256, height: 42, text: Translation.translate("Mode: Blacklist")},
		"textInfoXYZ": {type: "text", font: {size: 24, color: Color.GREEN}, x: 400 + 4*GUI_SCALE, y: 50 + 101*GUI_SCALE, width: 100, height: 42, text: ""},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiAdvancedMiner, "Advanced Miner");
});

MachineRegistry.registerElectricMachine(BlockID.advancedMiner, {
	defaultValues: {
		power_tier: 3,
		meta: 0,
		x: 0,
		y: 0,
		z: 0,
		whitelist: false,
		silk_touch: 0,
		isEnabled: true,
		isActive: false
	},
	
	upgrades: ["overclocker", "transformer"],
	
	getTransportSlots: function(){
		return {input: []};
	},
	
	getGuiScreen: function(){
		return guiAdvancedMiner;
	},
	
	isValidBlock: function(id, data){
		var material = ToolAPI.getBlockMaterial(id);
		if(id > 0 && (!material || material.name != "unbreaking")){
			return true;
		}
		return false;
	},
	
	checkDrop: function(drop){
		if(drop.length == 0) return true;
		for(var i in drop){
			for(var j = 0; j < 16; j++){
				var slot = this.container.getSlot("slot"+j);
				if(slot.id == drop[i][0] && slot.data == drop[i][2]){return !this.data.whitelist;}
			}
		}
		return this.data.whitelist;
	},
	
	harvestBlock: function(x, y, z, block){
		var drop = getBlockDrop({x: x,  y: y, z: z}, block.id, block.data, 100, {silk: this.data.silk_touch});
		if(this.checkDrop(drop)) return false;
		World.setBlock(x, y, z, 0);
		var items = [];
		for(var i in drop){
			items.push({id: drop[i][0], count: drop[i][1], data: drop[i][2]});
		}
		this.drop(items);
		this.data.energy -= 512;
		return true;
	},

	drop: function(items){
		var containers = StorageInterface.getNearestContainers(this, 0, true);
		if(containers){
			StorageInterface.putItems(items, containers, this);
		}
		for(var i in items){
			var item = items[i]
			if(item.count > 0){
				nativeDropItem(this.x+0.5, this.y+1, this.z+0.5, 1, item.id, item.count, item.data);
			}
		}
	},

	tick: function(){
		var content = this.container.getGuiContent();
		if(content){
			content.elements.button_silk.bitmap = "miner_button_silk_" + this.data.silk_touch;
		}
		
		if(this.data.whitelist)
			this.container.setText("textInfoMode", Translation.translate("Mode: Whitelist"));
		else
			this.container.setText("textInfoMode", Translation.translate("Mode: Blacklist"));
		
		this.data.power_tier = this.defaultValues.power_tier;
		var max_scan_count = 5;
		var upgrades = UpgradeAPI.getUpgrades(this, this.container);
		for(var i in upgrades){
			var item = upgrades[i];
			if(item.id == ItemID.upgradeOverclocker){
				max_scan_count *= item.count+1;
			}
			if(item.id == ItemID.upgradeTransformer){
				this.data.power_tier += item.count;
			}
		}
		
		var scanR = 0;
		if(this.data.isEnabled && this.y + this.data.y >= 0 && this.data.energy >= 512){
			var scanner = this.container.getSlot("slotScanner");
			if(scanner.id == ItemID.scanner) scanR = 16;
			if(scanner.id == ItemID.scannerAdvanced) scanR = 32;
		}
		if(scanR > 0 && scanner.data + 64 <= Item.getMaxDamage(scanner.id)){
			if(World.getThreadTime()%20==0){
				if(this.data.y == 0){
					this.data.x = -scanR;
					this.data.y = -1;
					this.data.z = -scanR;
				}
				for(var i = 0; i < max_scan_count; i++){
					if(this.data.x > scanR){
						this.data.x = -scanR;
						this.data.z++;
					}
					if(this.data.z > scanR){
						this.data.z = -scanR;
						this.data.y--;
					}
					scanner.data += 64;
					var x = this.x + this.data.x, y = this.y + this.data.y, z = this.z + this.data.z;
					this.data.x++;
					var block = World.getBlock(x, y, z);
					if(this.isValidBlock(block.id, block.data)){
						if(this.harvestBlock(x, y, z, block))
						break;
					}
					if(scanner.data + 64 > Item.getMaxDamage(scanner.id)) break;
				}
			}
			this.activate();
		} else {
			this.deactivate();
		}
		
		if(this.data.y < 0)
			this.container.setText("textInfoXYZ", "X: "+ this.data.x + ", Y: "+ Math.min(this.data.y, -1) + ", Z: "+ this.data.z);
		else
			this.container.setText("textInfoXYZ", "");
		
		var tier = this.getTier();
		var energyStorage = this.getEnergyStorage();
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotScanner"), "Eu", this.data.energy, tier);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, tier);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},

	destroyBlock: function(coords, player){
		var itemID = Player.getCarriedItem().id;
		var level = ToolAPI.getToolLevelViaBlock(itemID, this.blockID)
		var drop = MachineRegistry.getMachineDrop(coords, this.blockID, level, BlockID.machineBlockAdvanced, this.data.energy);
		if(drop.length > 0){
			World.drop(coords.x + .5, coords.y + .5, coords.z + .5, drop[0][0], drop[0][1], drop[0][2]);
		}
	},
	
	redstone: function(signal){
		this.data.isEnabled = (signal.power == 0);
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	getEnergyStorage: function(){
		return 4000000;
	},
	
	renderModel: MachineRegistry.renderModelWithRotation
});

MachineRegistry.setStoragePlaceFunction("advancedMiner");




// file: machine/resource/crop_harvester.js

IDRegistry.genBlockID("cropHarvester");
Block.createBlock("cropHarvester", [
	{name: "Crop Harvester", texture: [["machine_bottom", 0], ["crop_harvester", 0]], inCreative: true}
], "stone");
ItemName.addTierTooltip("cropHarvester", 1);

MachineRegistry.setMachineDrop("cropHarvester", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
    Recipes.addShaped({id: BlockID.cropHarvester, count: 1, data: 0}, [
        "zcz",
        "s#s",
        "pap"
    ], ['#', BlockID.machineBlockBasic, 0, 'z', ItemID.circuitBasic, 0, 'c', 54, -1, 'a', ItemID.agriculturalAnalyzer, 0, 'p', ItemID.plateIron, 0, 's', 359, 0]);
});

var cropHarvesterGuiObject = {
    standart: {
        header: {text: {text: Translation.translate("Crop Harvester")}},
        inventory: {standart: true},
        background: {standart: true}
    },

    drawing: [
        {type: "bitmap", x: 409, y: 167, bitmap: "energy_small_background", scale: GUI_SCALE}
    ],

    elements: {
        "energyScale": {type: "scale", x: 409, y: 167, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
        "slotEnergy": {type: "slot", x: 400, y: 230, isValid: MachineRegistry.isValidEUStorage},
        "slotUpgrade0": {type: "slot", x: 880, y: 110, isValid: UpgradeAPI.isValidUpgrade},
        "slotUpgrade1": {type: "slot", x: 880, y: 170, isValid: UpgradeAPI.isValidUpgrade},
        "slotUpgrade2": {type: "slot", x: 880, y: 230, isValid: UpgradeAPI.isValidUpgrade}
    }
};

for(let i = 0; i < 15; i++){
    let x = i % 5;
    let y = Math.floor(i / 5) + 1;
    cropHarvesterGuiObject.elements["outSlot" + i] = {type: "slot", x: 520 + x*60, y: 50 + y*60};
};


var guiCropHarvester = new UI.StandartWindow(cropHarvesterGuiObject);
Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiCropHarvester, "Crop Harvester");
});

MachineRegistry.registerElectricMachine(BlockID.cropHarvester, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 10000,
        scanX: -5,
        scanY: -1,
        scanZ: -5
    },
	
    upgrades: ["transformer", "energyStorage", "itemEjector"],
	
    getGuiScreen: function(){
        return guiCropHarvester;
    },
	
    getTier: function(){
        return this.data.power_tier;
    },
	
    resetValues: function(){
        this.data.power_tier = this.defaultValues.power_tier;
        this.data.energy_storage = this.defaultValues.energy_storage;
    },
	
    tick: function(){
        this.resetValues();
        UpgradeAPI.executeUpgrades(this);
        StorageInterface.checkHoppers(this);

        if(this.data.energy > 100) this.scan();

        var energyStorage = this.getEnergyStorage();
        this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());

        this.container.setScale("energyScale", this.data.energy / energyStorage);
        this.container.validateAll();
	},
	
	scan: function(){
        this.data.scanX++;
        if (this.data.scanX > 5) {
            this.data.scanX = -5;
            this.data.scanZ++;
            if (this.data.scanZ > 5) {
                this.data.scanZ = -5;
                this.data.scanY++;
                if (this.data.scanY > 1) {
                    this.data.scanY = -1;
                }
            }
        }
        this.data.energy -= 1;
        var cropTile = World.getTileEntity(this.x + this.data.scanX, this.y + this.data.scanY, this.z + this.data.scanZ);
        if(cropTile && cropTile.crop && !this.isInvFull()){
            var drops = null;
            if(cropTile.data.currentSize == cropTile.crop.getOptimalHarvestSize(cropTile)){
                drops = cropTile.performHarvest();
            }
            else if (cropTile.data.currentSize == cropTile.crop.maxSize) {
                drops = cropTile.performHarvest();
            }
            if(drops && drops.length){
                for(let i in drops){
                    var item = drops[i];
                    this.putItem(item);
                    this.data.energy -= 100;

                    if(item.count > 0){
                        World.drop(this.x, this.y + 1, this.z, item.id, item.count, item.data);
                    }
                }
            }
        }
    },
	
    putItem: function(item){
        for(var i = 0; i < 15; i++){
            var slot = this.container.getSlot("outSlot" + i);
            if(!slot.id || slot.id == item.id && slot.count < Item.getMaxStack(item.id)){
                var add = Math.min(Item.getMaxStack(item.id) - slot.count, item.count);
                slot.id = item.id;
                slot.count += add;
                slot.data = item.data;
                item.count -= add;
            }
        }
    },
	
    isInvFull: function(){
        for(var i = 0; i < 15; i++){
            var slot = this.container.getSlot("outSlot" + i);
            var maxStack = Item.getMaxStack(slot.id);
            if(!slot.id || slot.count < maxStack) return false;
        }
        return true;
    },
	
    getEnergyStorage: function(){
        return this.data.energy_storage;
    }
});

StorageInterface.createInterface(BlockID.cropHarvester, {
	slots: {
		"outSlot^0-14": {output: true}
	}
});




// file: machine/resource/crop_matron.js

IDRegistry.genBlockID("cropMatron");
Block.createBlock("cropMatron", [
	{name: "Crop Matron", texture: [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0]], inCreative: true}
], "stone");
TileRenderer.setStandartModel(BlockID.cropMatron, [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0]], true);
TileRenderer.registerRotationModel(BlockID.cropMatron, 0, [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0]]);
TileRenderer.registerRotationModel(BlockID.cropMatron, 4, [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 3], ["cropmatron_side", 1], ["cropmatron_side", 2], ["cropmatron_side", 2]]);

ItemName.addTierTooltip("cropMatron", 1);

MachineRegistry.setMachineDrop("cropMatron", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
    Recipes.addShaped({id: BlockID.cropMatron, count: 1, data: 0}, [
        "cxc",
        "a#a",
        "nnn"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', 54, 0, 'c', ItemID.circuitBasic, 0, 'a', ItemID.cellEmpty, 0, 'n', ItemID.cropStick, 0]);
});

function isFertilizer(id){
	return id == ItemID.fertilizer;
}
function isWeedEx(id){
	return id == ItemID.weedEx;
}

var newGuiMatronObject = {
	standart: {
		header: {text: {text: Translation.translate("Crop Matron")}},
		inventory: {standart: true},
		background: {standart: true}
	},

	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},

	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
        {type: "bitmap", x: 870, y: 270, bitmap: "energy_small_background", scale: GUI_SCALE},
        {type: "bitmap", x: 511, y: 243, bitmap: "water_storage", scale: GUI_SCALE}
	],

	elements: {
        "energyScale": {type: "scale", x: 870, y: 270, direction: 1, value: .5, bitmap: "energy_small_scale", scale: GUI_SCALE},
        "liquidScale": {type: "scale", x: 572, y: 256, direction: 1, value: 1, bitmap: "matron_water_storage", scale: GUI_SCALE},
        "slotEnergy": {type: "slot", x: 804, y: 265, isValid: MachineRegistry.isValidEUStorage},
        "slotFertilizer0": {type: "slot", x: 441, y: 75, bitmap: "dust_slot", isValid: isFertilizer},
        "slotWeedEx0": {type: "slot", x: 441, y: 155, bitmap: "weedEx_slot", isValid: isWeedEx},
        "slotWaterIn": {type: "slot", x: 441, y: 235,  bitmap: "cell_slot", isValid: function(id, count, data){
            return LiquidLib.getItemLiquid(id, data) == "water";
        }},
        "slotWaterOut": {type: "slot", x: 441, y: 295, isValid: function(){
            return false;
        }}
	}
};

for(let i = 1; i < 7; i++){
    newGuiMatronObject.elements["slotWeedEx" + i] = {type: "slot", x: 441 + 60*i, y: 155, isValid: isWeedEx};
}
for(let i = 1; i < 7; i++){
    newGuiMatronObject.elements["slotFertilizer" + i] = {type: "slot", x: 441 + 60*i, y: 75, isValid: isFertilizer};
}

var guiCropMatron = new UI.StandartWindow(newGuiMatronObject);

Callback.addCallback("LevelLoaded", function(){
    MachineRegistry.updateGuiHeader(guiCropMatron, "Crop Matron");
});

MachineRegistry.registerElectricMachine(BlockID.cropMatron, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 10000,
        meta: 0,
        isActive: false,
        scanX: -5,
        scanY: -1,
        scanZ: -5
    },

    getGuiScreen: function(){
        return guiCropMatron;
    },

    init: function(){
		this.liquidStorage.setLimit("water", 2);
		this.renderModel();
    },
	
	getLiquidFromItem: MachineRegistry.getLiquidFromItem,
	
	click: function(id, count, data, coords){
		if(Entity.getSneaking(player)){
			return this.getLiquidFromItem("water", {id: id, count: count, data: data}, null, true);
		}
	},
	
    tick: function(){
        StorageInterface.checkHoppers(this);

        var slot1 = this.container.getSlot("slotWaterIn");
		var slot2 = this.container.getSlot("slotWaterOut");
		this.getLiquidFromItem("water", slot1, slot2);
		
        if(this.data.energy >= 31){
            this.scan();
            this.setActive(true);
        } else {
			this.setActive(false);
        }

		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());

        this.container.setScale("energyScale", this.data.energy / energyStorage);
        this.liquidStorage.updateUiScale("liquidScale", "water");
    },

    scan: function(){
        this.data.scanX++;
        if (this.data.scanX > 5) {
            this.data.scanX = -5;
            this.data.scanZ++;
            if (this.data.scanZ > 5) {
                this.data.scanZ = -5;
                this.data.scanY++;
                if (this.data.scanY > 1) {
                    this.data.scanY = -1;
                }
            }
        }
        this.data.energy -= 1;

        var tileentity = World.getTileEntity(this.x + this.data.scanX, this.y + this.data.scanY, this.z + this.data.scanZ);
        if(tileentity && tileentity.crop){
            var slotFertilizer = this.getSlot("slotFertilizer");
            var weedExSlot = this.getSlot("slotWeedEx");
            if(slotFertilizer && tileentity.applyFertilizer(false)){
                slotFertilizer.count--;
                this.data.energy -= 10;
            }
            var liquidAmount = this.liquidStorage.getAmount("water");
            if(liquidAmount > 0){
                amount = tileentity.applyHydration(liquidAmount);
                if(amount > 0){
                    this.liquidStorage.getLiquid("water", amount / 1000);
                }
            }
            if(weedExSlot && tileentity.applyWeedEx(weedExSlot.id, false)){
                this.data.energy -= 10;
                weedExSlot.data++;
                if(weedExSlot.data >= 10) weedExSlot.id = 0;
            }
            this.container.validateAll();
        }
    },

    getSlot: function(type){
        for(let i = 0; i < 7; i++){
            var slot = this.container.getSlot(type + i);
            if(slot.id) return slot;
        }
        return null;
    },

    getTier: function(){
        return this.data.power_tier;
    },

    getEnergyStorage: function(){
        return this.data.energy_storage;
    },

    renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.cropMatron, true);

StorageInterface.createInterface(BlockID.cropMatron, {
	slots: {
		"slotFertilizer^0-6": {input: true, isValid: function(item){
			return item.id == ItemID.fertilizer;
		}},
		"slotWeedEx^0-6": {input: true, isValid: function(item){
			return item.id == ItemID.weedEx;
        }},
        "slotWaterIn": {input: true, isValid: function(item){
			return LiquidLib.getItemLiquid(item.id, item.data) == "water";
        }},
        "slotWaterOut": {output: true}
    },
    canReceiveLiquid: function(liquid, side){return liquid == "water"}
});




// file: machine/misc/teleporter.js

IDRegistry.genBlockID("teleporter");
Block.createBlock("teleporter", [
	{name: "Teleporter", texture: [["machine_advanced_bottom", 0], ["teleporter_top", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0]], inCreative: true},
], "stone");
ItemName.setRarity(BlockID.teleporter, 2, true);
TileRenderer.setStandartModel(BlockID.teleporter, [["machine_advanced_bottom", 0], ["teleporter_top", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0]]);
TileRenderer.registerRenderModel(BlockID.teleporter, 0, [["machine_advanced_bottom", 0], ["teleporter_top", 1], ["teleporter_side", 1], ["teleporter_side", 1], ["teleporter_side", 1], ["teleporter_side", 1]]);

MachineRegistry.setMachineDrop("teleporter", BlockID.machineBlockAdvanced);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.teleporter, count: 1, data: 0}, [
		"xax",
		"c#c",
		"xdx"
	], ['#', BlockID.machineBlockAdvanced, 0, 'x', ItemID.circuitAdvanced, 0, 'a', ItemID.freqTransmitter, 0, 'c', ItemID.cableOptic, 0, 'd', 264, 0]);
});


MachineRegistry.registerPrototype(BlockID.teleporter, {
	defaultValues: {
		isActive: false,
		frequency: null
	},
	
	getNearestStorages: function(x, y, z){
		var directions = StorageInterface.directionsBySide;
		var storages = [];
		for(var i in directions){
			dir = directions[i];
			var machine = EnergyTileRegistry.accessMachineAtCoords(x + dir.x, y + dir.y, z + dir.z);
			if(machine && machine.isTeleporterCompatible){
				storages.push(machine);
			}
		}
		return storages;
	},

	getWeight: function(ent){
		var type = Entity.getType(ent);
		if(ent == player || type == EntityType.MINECART) return 1000;
		if(type == EntityType.ITEM) return 100;
		if(isFriendlyMob(type)) return 200;
		if(isHostileMob(type)) return 500;
		return 0;
	},
	
	tick: function(){
		if(World.getThreadTime()%11 == 0 && this.data.isActive && this.data.frequency){
			var entities = Entity.getAll();
			var storages = this.getNearestStorages(this.x, this.y, this.z);
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
							if(Config.debugMode){Debug.m(energyNeed);}
							if(energyNeed < energyAvailable){
								for(var i in storages){
									var data = storages[i].data;
									var energyChange = Math.min(energyNeed, data.energy);
									data.energy -= energyChange;
									energyNeed -= energyChange;
									if(energyNeed <= 0){break;}
								}
								SoundAPI.playSound("Machines/Teleporter/TeleUse.ogg")
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
		this.renderModel();
	},
	
	renderModel: MachineRegistry.renderModel
});




// file: machine/misc/lamp.js

IDRegistry.genBlockID("luminator");
Block.createBlock("luminator", [
	{name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false},
	{name: "Luminator", texture: [["luminator", 0]], inCreative: true},
	{name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false},
	{name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false},
	{name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false},
	{name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false}
], {renderlayer: 7});

Block.setBlockShape(BlockID.luminator, {x: 0, y: 15/16, z: 0}, {x: 1, y: 1, z: 1}, 0);
Block.setBlockShape(BlockID.luminator, {x: 0, y: 0, z: 0}, {x: 1, y: 1/16, z: 1}, 1);
Block.setBlockShape(BlockID.luminator, {x: 0, y: 0, z: 15/16}, {x: 1, y: 1, z: 1}, 2);
Block.setBlockShape(BlockID.luminator, {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1/16}, 3);
Block.setBlockShape(BlockID.luminator, {x: 15/16, y: 0, z: 0}, {x: 1, y: 1, z: 1}, 4);
Block.setBlockShape(BlockID.luminator, {x: 0, y: 0, z: 0}, {x: 1/16, y: 1, z: 1}, 5);

Block.registerDropFunction("luminator", function(coords, blockID, blockData, level, enchant){
	return [[blockID, 1, 1]];
});


IDRegistry.genBlockID("luminator_on");
Block.createBlock("luminator_on", [
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false},
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false},
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false},
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false},
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false},
	{name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false}
], {
	destroytime: 2,
	explosionres: 0.5,
	lightlevel: 15,
	renderlayer: 7
});

Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 15/16, z: 0}, {x: 1, y: 1, z: 1}, 0);
Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 0, z: 0}, {x: 1, y: 1/16, z: 1}, 1);
Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 0, z: 15/16}, {x: 1, y: 1, z: 1}, 2);
Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1/16}, 3);
Block.setBlockShape(BlockID.luminator_on, {x: 15/16, y: 0, z: 0}, {x: 1, y: 1, z: 1}, 4);
Block.setBlockShape(BlockID.luminator_on, {x: 0, y: 0, z: 0}, {x: 1/16, y: 1, z: 1}, 5);

Block.registerDropFunction("luminator_on", function(coords, blockID, blockData, level, enchant){
	return [[BlockID.luminator, 1, 1]];
});


Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.luminator, count: 8, data: 1}, [
		"cxc",
		"aba",
		"aaa",
	], ['a', 20, 0, 'x', ItemID.cableCopper1, 0, 'b', ItemID.cableTin0, 0, 'c', ItemID.casingIron, 0]);
});


MachineRegistry.registerElectricMachine(BlockID.luminator, {
	defaultValues: {
		isActive: false
	},
	
	getEnergyStorage: function(){
		return 100;
	},
	
	click: function(id, count, data, coords){
		this.data.isActive = true;
		return true;
	},
	
	tick: function(type, src){
		if(this.data.isActive && this.data.energy >= 0.25){
			var x = this.x, y = this.y, z = this.z;
			var blockData = World.getBlock(x, y, z).data;
			var data = this.data;
			this.selfDestroy();
			World.setBlock(x, y, z, BlockID.luminator_on, blockData);
			var tile = World.addTileEntity(x, y, z);
			tile.data = data;
		}
	}
});

MachineRegistry.registerElectricMachine(BlockID.luminator_on, {
	defaultValues: {
		isActive: true
	},
	
	getEnergyStorage: function(){
		return 100;
	},
	
	disable: function(){
		var x = this.x, y = this.y, z = this.z;
		var blockData = World.getBlock(x, y, z).data;
		var data = this.data;
		this.selfDestroy();
		World.setBlock(x, y, z, BlockID.luminator, blockData);
		tile = World.addTileEntity(x, y, z);
		tile.data = data;
	},
	
	click: function(id, count, data, coords){
		this.data.isActive = false;
		this.disable();
		return true;
	},
	
	tick: function(type, src){
		if(this.data.energy < 0.25){
			this.disable();
		} else {
			this.data.energy -= 0.25;
		}
	}
});

Block.registerPlaceFunction("luminator", function(coords, item, block){
	var x = coords.relative.x
	var y = coords.relative.y
	var z = coords.relative.z
	block = World.getBlockID(x, y, z)
	if(GenerationUtils.isTransparentBlock(block)){
		World.setBlock(x, y, z, item.id, coords.side);
		World.addTileEntity(x, y, z);
	}
});




// file: machine/misc/tesla_coil.js

IDRegistry.genBlockID("teslaCoil");
Block.createBlock("teslaCoil", [
	{name: "Tesla Coil", texture: [["tesla_coil", 0], ["tesla_coil", 0], ["tesla_coil", 1], ["tesla_coil", 1], ["tesla_coil", 1], ["tesla_coil", 1]], inCreative: true},
], "stone");
ItemName.addTierTooltip("teslaCoil", 3);

MachineRegistry.setMachineDrop("teslaCoil", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.teslaCoil, count: 1, data: 0}, [
		"ror",
		"r#r",
		"cxc"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.casingIron, 0, 'o', ItemID.coil, 0, 'r', 331, 0]);
});


MachineRegistry.registerElectricMachine(BlockID.teslaCoil, {
	getTier: function(){
		return 3;
	},
	
	tick: function(){
		if(this.data.energy >= 400 && this.data.isActive){
			if(World.getThreadTime()%32==0){
				var entities = Entity.getAll();
				var discharge = false;
				var damage = Math.floor(this.data.energy/400);
				for(var i in entities){
					var ent = entities[i];
					var coords = Entity.getPosition(ent);
					var dx = this.x + 0.5 - coords.x;
					var dy = this.y + 0.5 - coords.y;
					var dz = this.z + 0.5 - coords.z;
					if(Math.sqrt(dx*dx + dy*dy + dz*dz) < 4.5 && canTakeDamage(ent, "electricity") && Entity.getHealth(ent) > 0){
						discharge = true;
						if(damage >= 24){
							Entity.setFire(ent, 1, true);
							Entity.damageEntity(ent, damage, 6);
						}
						else Entity.damageEntity(ent, damage);
					}
				}
				if(discharge) this.data.energy = 1;
			}
			this.data.energy--;
		}
	},

	redstone: function(signal){
		this.data.isActive = signal.power > 0;
	},

	getEnergyStorage: function(){
		return 10000;
	}
});




// file: machine/misc/nuke.js

IDRegistry.genBlockID("nuke");
Block.createBlock("nuke", [
	{name: "Nuke", texture: [["nuke_bottom", 0], ["nuke_top", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0]], inCreative: true}
], "stone");
ItemName.setRarity(BlockID.nuke, 1, true);
TileRenderer.setStandartModel(BlockID.nuke, [["nuke_bottom", 0], ["nuke_top", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0]]);
TileRenderer.registerRenderModel(BlockID.nuke, 0, [["tnt_active", 0]]);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.nuke, count: 1, data: 0}, [
		"ncn",
		"x#x",
		"ncn"
	], ['#', 46, -1, 'x', ItemID.uranium235, 0, 'c', ItemID.circuitAdvanced, 0, 'n', ItemID.neutronReflectorThick, 0]);
	
	Recipes.addShaped({id: BlockID.nuke, count: 1, data: 0}, [
		"ncn",
		"x#x",
		"ncn"
	], ['#', 46, -1, 'x', ItemID.plutonium, 0, 'c', ItemID.circuitAdvanced, 0, 'n', ItemID.neutronReflectorThick, 0]);
});


MachineRegistry.registerPrototype(BlockID.nuke, {
	defaultValues: {
		activated: false,
		timer: 300
	},
	
	explode: function(radius){
		let x = this.x, y = this.y, z = this.z;
		World.explode(x + 0.5, y + 0.5, z + 0.5, 1);
		let entities = Entity.getAll();
		let rad = radius * 1.5;
		for(let i in entities){
			let ent = entities[i];
			let c = Entity.getPosition(ent);
			let dx = Math.abs(x - c.x), dy = Math.abs(y - c.y), dz = Math.abs(z - c.z);
			let dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
			if(dist <= rad){
				let damage = Math.ceil(rad*rad * 25 / (dist*dist));
				if(damage >= 100){
					Entity.damageEntity(ent, damage);
				} else {
					Entity.damageEntity(ent, damage, 11);
				}
			}
		}
		
		let height = radius/2;
		for(let dx = -radius; dx <= radius; dx++)
		for(let dy = -height; dy <= height; dy++)
		for(let dz = -radius; dz <= radius; dz++){
			if(Math.sqrt(dx*dx + dy*dy*4 + dz*dz) <= radius){
				let block = World.getBlock(x + dx, y + dy, z + dz);
				if(Block.getExplosionResistance(block.id) < 10000){
					World.setBlock(x + dx, y + dy, z + dz, 0);
					if(Math.random() < 0.01){
						let drop = getBlockDrop({x: x + dx, y: y + dy, z: z + dz}, block.id, block.data, 100);
						if(drop)
						for(let i in drop){
							let item = drop[i];
							World.drop(x + dx, y + dy, z + dz, item[0], item[1], item[2]);
						}
					}
				}
			}
		}

		let sound = SoundAPI.playSoundAt(this, "Tools/NukeExplosion.ogg", false, 128);
		RadiationAPI.addRadiationSource(this.x + 0.5, this.y + 0.5, this.z + 0.5, radius * 2, 600);
	},
	
	tick: function(){
		if(this.data.activated){
			if(this.data.timer <= 0){
				this.explode(20);
				this.selfDestroy();
				return;
			}
			if(this.data.timer % 10 < 5){
				TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, 0);
			} else {
				BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
			}
			this.data.timer--;
		}
	},
	
	redstone: function(signal){
		if(signal.power > 0){
			this.data.activated = true; 
		}
	}
});




// file: items/resource/rubber.js

IDRegistry.genItemID("latex");
Item.createItem("latex", "Latex", {name: "latex", data: 0});

IDRegistry.genItemID("rubber");
Item.createItem("rubber", "Rubber", {name: "rubber", data: 0});

Recipes.addFurnace(ItemID.latex, ItemID.rubber, 0);

Recipes.addShaped({id: 50, count: 4, data: 0}, [
	"a",
	"b"
], ['a', ItemID.latex, 0, 'b', 280, 0]);

Recipes.addShaped({id: 29, count: 1, data: 0}, [
	"a",
	"b"
], ['a', ItemID.latex, 0, 'b', 33, 0]);




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

Item.addCreativeGroup("oreCrushed", Translation.translate("Crushed Ores"), [
	ItemID.crushedCopper,
	ItemID.crushedTin,
	ItemID.crushedIron,
	ItemID.crushedLead,
	ItemID.crushedGold,
	ItemID.crushedSilver,
	ItemID.crushedUranium
]);

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

Item.addCreativeGroup("oreCrushedPurified", Translation.translate("Purified Crushed Ores"), [
	ItemID.crushedPurifiedCopper,
	ItemID.crushedPurifiedTin,
	ItemID.crushedPurifiedIron,
	ItemID.crushedPurifiedLead,
	ItemID.crushedPurifiedGold,
	ItemID.crushedPurifiedSilver,
	ItemID.crushedPurifiedUranium
]);




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

IDRegistry.genItemID("dustSteel");
Item.createItem("dustSteel", "Steel Dust", {name: "dust_steel"});

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

Item.addCreativeGroup("dust", Translation.translate("Dusts"), [
	ItemID.dustCopper,
	ItemID.dustTin,
	ItemID.dustBronze,
	ItemID.dustIron,
	ItemID.dustSteel,
	ItemID.dustLead,
	ItemID.dustGold,
	ItemID.dustSilver,
	ItemID.dustStone,
	ItemID.dustCoal,
	ItemID.dustSulfur,
	ItemID.dustLapis,
	ItemID.dustDiamond,
	ItemID.dustEnergium
]);

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

Item.addCreativeGroup("dustSmall", Translation.translate("Small Dusts"), [
	ItemID.dustSmallCopper,
	ItemID.dustSmallTin,
	ItemID.dustSmallIron,
	ItemID.dustSmallLead,
	ItemID.dustSmallGold,
	ItemID.dustSmallSilver,
	ItemID.dustSmallSulfur
]);

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

// alternative
Recipes.addShaped({id: 348, count: 1, data: 0}, [
	"xax",
	"axa",
	"xax",
], ['x', 331, 0, 'a', ItemID.dustGold, 0]);

Recipes.addShaped({id: 289, count: 3, data: 0}, [
	"xax",
	"axa",
	"xax",
], ['x', 331, 0, 'a', ItemID.dustCoal, 0]);




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

IDRegistry.genItemID("ingotAlloy");
Item.createItem("ingotAlloy", "Alloy Ingot", {name: "ingot_alloy"});

Item.addCreativeGroup("ingot", Translation.translate("Ingots"), [
	ItemID.ingotCopper,
	ItemID.ingotTin,
	ItemID.ingotBronze,
	ItemID.ingotSteel,
	ItemID.ingotLead,
	ItemID.ingotSilver,
	ItemID.ingotAlloy
]);

Callback.addCallback("PreLoaded", function(){
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
	Recipes.addFurnace(ItemID.dustSteel, ItemID.ingotSteel, 0);
	Recipes.addFurnace(ItemID.dustIron, 265, 0);
	Recipes.addFurnace(ItemID.dustGold, 266, 0);
	Recipes.addFurnace(ItemID.dustSilver, ItemID.ingotSilver, 0);
	// from plates
	Recipes.addFurnace(ItemID.plateCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(ItemID.plateTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(ItemID.plateBronze, ItemID.ingotBronze, 0);
	Recipes.addFurnace(ItemID.plateSteel, ItemID.ingotSteel, 0);
	Recipes.addFurnace(ItemID.plateIron, 265, 0);
	Recipes.addFurnace(ItemID.plateGold, 266, 0);
	Recipes.addFurnace(ItemID.plateLead, ItemID.ingotLead, 0);
	
	Recipes.addShaped({id: ItemID.ingotAlloy, count: 2, data: 0}, [
		"aaa",
		"bbb",
		"ccc"
	], ['a', ItemID.plateSteel, 0, 'b', ItemID.plateBronze, 0, 'c', ItemID.plateTin, 0]);
	
	// alternative
	Recipes.addShaped({id: 66, count: 12, data: 0}, [
		"a a",
		"axa",
		"a a"
	], ['x', 280, 0, 'a', ItemID.ingotBronze, 0]);
	
	Recipes.addShaped({id: 33, count: 1, data: 0}, [
		"ppp",
		"cbc",
		"cxc"
	], ['x', 331, 0, 'b', ItemID.ingotBronze, 0, 'c', 4, -1, 'p', 5, -1]);
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

Item.addCreativeGroup("plate", Translation.translate("Plates"), [
	ItemID.plateCopper,
	ItemID.plateTin,
	ItemID.plateBronze,
	ItemID.plateIron,
	ItemID.plateSteel,
	ItemID.plateGold,
	ItemID.plateLead,
	ItemID.plateLapis
]);

// recipes
Callback.addCallback("PreLoaded", function(){
	ICTool.addRecipe({id: ItemID.plateCopper, count: 1, data: 0}, [{id: ItemID.ingotCopper, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.plateTin, count: 1, data: 0}, [{id: ItemID.ingotTin, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.plateBronze, count: 1, data: 0}, [{id: ItemID.ingotBronze, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.plateIron, count: 1, data: 0}, [{id: 265, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.plateGold, count: 1, data: 0}, [{id: 266, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.plateLead, count: 1, data: 0}, [{id: ItemID.ingotLead, data: 0}], ItemID.craftingHammer);
});




// file: items/resource/dense_plates.js

IDRegistry.genItemID("densePlateCopper");
Item.createItem("densePlateCopper", "Dense Copper Plate", {name: "dense_plate_copper"});

IDRegistry.genItemID("densePlateTin");
Item.createItem("densePlateTin", "Dense Tin Plate", {name: "dense_plate_tin"});

IDRegistry.genItemID("densePlateBronze");
Item.createItem("densePlateBronze", "Dense Bronze Plate", {name: "dense_plate_bronze"});

IDRegistry.genItemID("densePlateIron");
Item.createItem("densePlateIron", "Dense Iron Plate", {name: "dense_plate_iron"});

IDRegistry.genItemID("densePlateSteel");
Item.createItem("densePlateSteel", "Dense Steel Plate", {name: "dense_plate_steel"});

IDRegistry.genItemID("densePlateGold");
Item.createItem("densePlateGold", "Dense Gold Plate", {name: "dense_plate_gold"});

IDRegistry.genItemID("densePlateLead");
Item.createItem("densePlateLead", "Dense Lead Plate", {name: "dense_plate_lead"});

Item.addCreativeGroup("plateDense", Translation.translate("Desne Plates"), [
	ItemID.densePlateCopper,
	ItemID.densePlateTin,
	ItemID.densePlateBronze,
	ItemID.densePlateIron,
	ItemID.densePlateSteel,
	ItemID.densePlateGold,
	ItemID.densePlateLead
]);




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

// creative group
Item.addCreativeGroup("casingMetal", Translation.translate("Metal Casings"), [
	ItemID.casingCopper,
	ItemID.casingLead,
	ItemID.casingGold,
	ItemID.casingSteel,
	ItemID.casingIron,
	ItemID.casingBronze,
	ItemID.casingTin
]);

// recipes
Callback.addCallback("PreLoaded", function(){
	ICTool.addRecipe({id: ItemID.casingCopper, count: 2, data: 0}, [{id: ItemID.plateCopper, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingTin, count: 2, data: 0}, [{id: ItemID.plateTin, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingBronze, count: 2, data: 0}, [{id: ItemID.plateBronze, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingIron, count: 2, data: 0}, [{id: ItemID.plateIron, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingGold, count: 2, data: 0}, [{id: ItemID.plateGold, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingLead, count: 2, data: 0}, [{id: ItemID.plateLead, data: 0}], ItemID.craftingHammer);
});




// file: items/resource/nuclear.js

IDRegistry.genItemID("uranium");
Item.createItem("uranium", "Enriched Uranium", {name: "uranium"});
RadiationAPI.regRadioactiveItem(ItemID.uranium, 60);

IDRegistry.genItemID("uranium235");
Item.createItem("uranium235", "Uranium 235", {name: "uranium235"});
RadiationAPI.regRadioactiveItem(ItemID.uranium235, 150);

IDRegistry.genItemID("smallUranium235");
Item.createItem("smallUranium235", "Piece of Uranium 235", {name: "small_uranium235"});
RadiationAPI.regRadioactiveItem(ItemID.smallUranium235, 150);

IDRegistry.genItemID("uranium238");
Item.createItem("uranium238", "Uranium 238", {name: "uranium238"});
RadiationAPI.regRadioactiveItem(ItemID.uranium238, 10, true);

IDRegistry.genItemID("smallUranium238");
Item.createItem("smallUranium238", "Piece of Uranium 238", {name: "small_uranium238"});
RadiationAPI.regRadioactiveItem(ItemID.smallUranium238, 10, true);

IDRegistry.genItemID("plutonium");
Item.createItem("plutonium", "Plutonium", {name: "plutonium"});
RadiationAPI.regRadioactiveItem(ItemID.plutonium, 150);

IDRegistry.genItemID("smallPlutonium");
Item.createItem("smallPlutonium", "Piece of Plutonium", {name: "small_plutonium"});
RadiationAPI.regRadioactiveItem(ItemID.smallPlutonium, 150);

IDRegistry.genItemID("mox");
Item.createItem("mox", "MOX Nuclear Fuel", {name: "mox"});
RadiationAPI.regRadioactiveItem(ItemID.mox, 300);

IDRegistry.genItemID("rtgPellet");
Item.createItem("rtgPellet", "Pellets of RTG Fuel", {name: "rtg_pellet"}, {stack: 1});
RadiationAPI.regRadioactiveItem(ItemID.rtgPellet, 1, true);

Item.addCreativeGroup("nuclear", Translation.translate("Nuclear"), [
	ItemID.uranium,
	ItemID.uranium235,
	ItemID.smallUranium235,
	ItemID.uranium238,
	ItemID.smallUranium238,
	ItemID.plutonium,
	ItemID.smallPlutonium,
	ItemID.mox,
	ItemID.rtgPellet
]);

Recipes.addShaped({id: ItemID.uranium, count: 1, data: 0}, [
	"xxx",
	"aaa",
	"xxx"
], ['x', ItemID.uranium238, 0, 'a', ItemID.smallUranium235, 0]);

Recipes.addShaped({id: ItemID.uranium235, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx"
], ['x', ItemID.smallUranium235, 0]);

Recipes.addShaped({id: ItemID.plutonium, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx"
], ['x', ItemID.smallPlutonium, 0]);

Recipes.addShaped({id: ItemID.mox, count: 1, data: 0}, [
	"xxx",
	"aaa",
	"xxx"
], ['x', ItemID.smallPlutonium, 0, 'a', ItemID.uranium238, 0]);

Recipes.addShaped({id: ItemID.rtgPellet, count: 1, data: 0}, [
	"xxx",
	"aaa",
	"xxx"
], ['x', ItemID.densePlateIron, 0, 'a', ItemID.plutonium, 0]);

Recipes.addShapeless({id: ItemID.smallUranium235, count: 9, data: 0}, [{id: ItemID.uranium235, data: 0}]);
Recipes.addShapeless({id: ItemID.smallPlutonium, count: 9, data: 0}, [{id: ItemID.plutonium, data: 0}]);




// file: items/resource/scrap.js

IDRegistry.genItemID("scrap");
Item.createItem("scrap", "Scrap", {name: "scrap"});
Recipes.addFurnaceFuel(ItemID.scrap, 0, 350);

IDRegistry.genItemID("scrapBox");
Item.createItem("scrapBox", "Scrap Box", {name: "scrap_box"});
Recipes.addFurnaceFuel(ItemID.scrapBox, 0, 3150);

Recipes.addShaped({id: ItemID.scrapBox, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx"
], ['x', ItemID.scrap, 0]);
	
MachineRecipeRegistry.addRecipeFor("catalyser", ItemID.scrap, {input: 5000, output: 30000});
MachineRecipeRegistry.addRecipeFor("catalyser", ItemID.scrapBox, {input: 45000, output: 270000});


var SCRAP_BOX_RANDOM_DROP = [
	{chance: 0.1, id: 264, data: 0},
	{chance: 1.8, id: 15, data: 0},
	{chance: 1, id: 14, data: 0},
	{chance: 3, id: 331, data: 0},
	{chance: 0.8, id: 348, data: 0},
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
	{chance: 1.2, id: ItemID.dustCoal, data: 0},
	{chance: 1.2, id: ItemID.dustCopper, data: 0},
	{chance: 1.2, id: ItemID.dustTin, data: 0},
	{chance: 1.2, id: ItemID.dustIron, data: 0},
	{chance: 0.8, id: ItemID.dustGold, data: 0},
	{chance: 0.8, id: ItemID.dustLead, data: 0},
	{chance: 0.6, id: ItemID.dustSilver, data: 0},
	{chance: 0.4, id: ItemID.dustDiamond, data: 0},
	{chance: 0.4, id: BlockID.oreUranium, data: 0},
	{chance: 2, id: BlockID.oreCopper, data: 0},
	{chance: 1.5, id: BlockID.oreTin, data: 0},
	{chance: 1, id: BlockID.oreLead, data: 0},
	{chance: 2, id: ItemID.rubber, data: 0},
	{chance: 2, id: ItemID.latex, data: 0},
	{chance: 2.5, id: ItemID.tinCanFull, data: 0},
];

function getScrapDropItem(){
	var total = 0;
	for (var i in SCRAP_BOX_RANDOM_DROP){
		total += SCRAP_BOX_RANDOM_DROP[i].chance;
	}
	var random = Math.random() * total * 1.35;
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

Item.registerUseFunction("scrapBox", function(coords, item, block){
	var drop = getScrapDropItem();
	World.drop(coords.relative.x + 0.5, coords.relative.y + 0.1, coords.relative.z + 0.5, drop.id, 1, drop.data);
	Player.decreaseCarriedItem(1);
});




// file: items/resource/matter.js

IDRegistry.genItemID("matter");
Item.createItem("matter", "UU-Matter", {name: "uu_matter"});
ItemName.setRarity(ItemID.matter, 2, true);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: ItemID.iridiumChunk, count: 1, data: 0}, [
		"xxx",
		" x ",
		"xxx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 264, count: 1, data: 0}, [
		"xxx",
		"xxx",
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
	
	Recipes.addShaped({id: 2, count: 16, data: 0}, [
		"   ",
		"x  ",
		"x  "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 80, count: 4, data: 0}, [
		"x x",
		"   ",
		"   "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 8, count: 1, data: 0}, [
		"   ",
		" x ",
		" x "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 10, count: 1, data: 0}, [
		" x ",
		" x ",
		" x "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 35, count: 12, data: 0}, [
		"x x",
		"   ",
		" x "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 106, count: 24, data: 0}, [
		"x  ",
		"x  ",
		"x  "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 332, count: 24, data: 0}, [
		"   ",
		"   ",
		"xxx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 20, count: 32, data: 0}, [
		" x ",
		"x x",
		" x "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 49, count: 12, data: 0}, [
		"x x",
		"x x",
		"   "
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
	
	Recipes.addShaped({id: 351, count: 32, data: 3}, [
		"xx ",
		"  x",
		"xx "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 351, count: 9, data: 4}, [
		" x ",
		" x ",
		" xx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 337, count: 48, data: 0}, [
		"xx ",
		"x  ",
		"xx "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 110, count: 24, data: 0}, [
		"   ",
		"x x",
		"xxx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 318, count: 32, data: 0}, [
		" x ",
		"xx ",
		"xx "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 98, count: 48, data: 0}, [
		"xx ",
		"xx ",
		"x  "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 89, count: 8, data: 0}, [
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
	
	Recipes.addShaped({id: 289, count: 16, data: 0}, [
		"xxx",
		"x  ",
		"xxx"
	], ['x', ItemID.matter, -1]);

	Recipes.addShaped({id: 263, count: 20, data: 0}, [
		"  x",
		"x  ",
		"  x"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 331, count: 24, data: 0}, [
		"   ",
		" x ",
		"xxx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 388, count: 2, data: 0}, [
		"xxx",
		"xxx",
		" x "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: ItemID.latex, count: 21, data: 0}, [
		"x x",
		"   ",
		"x x"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 14, count: 2, data: 0}, [
		" x ",
		"xxx",
		" x "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 15, count: 2, data: 0}, [
		"x x",
		" x ",
		"x x"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: BlockID.oreCopper, count: 5, data: 0}, [
		"  x",
		"x x",
		"   "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: BlockID.oreTin, count: 5, data: 0}, [
		"   ",
		"x x",
		"  x"
	], ['x', ItemID.matter, -1]);
});




// file: items/resource/material.js

IDRegistry.genItemID("iridiumChunk");
Item.createItem("iridiumChunk", "Iridium", {name: "iridium"});
ItemName.setRarity(ItemID.iridiumChunk, 2, true);

IDRegistry.genItemID("plateReinforcedIridium");
Item.createItem("plateReinforcedIridium", "Iridium Reinforced Plate", {name: "plate_reinforced_iridium"});
ItemName.setRarity(ItemID.plateReinforcedIridium, 2, true);

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

Item.addCreativeGroup("ic2_material", Translation.translate("Materials"), [
	ItemID.iridiumChunk,
	ItemID.plateReinforcedIridium,
	ItemID.plateAlloy,
	ItemID.carbonFibre,
	ItemID.carbonMesh,
	ItemID.carbonPlate,
	ItemID.coalBall,
	ItemID.coalBlock,
	ItemID.coalChunk
]);

Callback.addCallback("PreLoaded", function(){
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
});




// file: items/resource/liquid.js

LiquidRegistry.registerLiquid("biomass", "Biomass", ["liquid_biomass", "liquid_biomass_48x30", "liquid_biomass_55x47"]);
LiquidRegistry.registerLiquid("biogas", "Biogas", ["liquid_biogas", "liquid_biogas_55x47"]);
LiquidRegistry.registerLiquid("coolant", "Coolant", ["liquid_coolant", "liquid_coolant_110x94"]);

LiquidRegistry.getLiquidData("lava").uiTextures.push("gui_lava_texture_55x47");
LiquidRegistry.getLiquidData("water").uiTextures.push("gui_water_texture_47x24");
LiquidRegistry.getLiquidData("water").uiTextures.push("gui_water_texture_55x47");




// file: items/resource/cells.js

IDRegistry.genItemID("cellEmpty");
Item.createItem("cellEmpty", "Cell", {name: "cell_empty"});
Item.setLiquidClip(ItemID.cellEmpty, true);

IDRegistry.genItemID("cellWater");
IDRegistry.genItemID("cellLava");
IDRegistry.genItemID("cellBiomass");
IDRegistry.genItemID("cellBiogas");
IDRegistry.genItemID("cellCoolant");
IDRegistry.genItemID("cellMatter");
IDRegistry.genItemID("cellAir");
Item.createItem("cellWater", "Water Cell", {name: "cell_water"});
Item.createItem("cellLava", "Lava Cell", {name: "cell_lava"});
Item.createItem("cellBiomass", "Biomass Cell", {name: "cell_biomass"});
Item.createItem("cellBiogas", "Biogas Cell", {name: "cell_biogas"});
Item.createItem("cellCoolant", "Coolant Cell", {name: "cell_coolant"});
//Item.createItem("cellMatter", "UU-Matter Cell", {name: "cell_uu_matter"});
Item.createItem("cellAir", "Compressed Air Cell", {name: "cell_air"});

LiquidLib.registerItem("water", ItemID.cellEmpty, ItemID.cellWater, 1000);
LiquidLib.registerItem("lava", ItemID.cellEmpty, ItemID.cellLava, 1000);
LiquidLib.registerItem("biomass", ItemID.cellEmpty, ItemID.cellBiomass, 1000);
LiquidLib.registerItem("biogas", ItemID.cellEmpty, ItemID.cellBiogas, 1000);
LiquidLib.registerItem("coolant", ItemID.cellEmpty, ItemID.cellCoolant, 1000);

ItemName.addStoredLiquidTooltip(ItemID.cellWater);
ItemName.addStoredLiquidTooltip(ItemID.cellLava);
ItemName.addStoredLiquidTooltip(ItemID.cellBiomass);
ItemName.addStoredLiquidTooltip(ItemID.cellBiogas);
ItemName.addStoredLiquidTooltip(ItemID.cellCoolant);

Recipes.addShaped({id: ItemID.cellEmpty, count: 1, data: 0}, [
	" x ",
	"xgx",
	" x "
], ['x', ItemID.casingTin, 0, 'g', 102, 0]);

Recipes.addShaped({id: 49, count: 1, data: 0}, [
	"aa",
	"bb"
], ['a', ItemID.cellLava, 0, 'b', ItemID.cellWater, 0]);

Item.registerUseFunction("cellEmpty",function(coords, item, block){
	if(block.id > 7 && block.id < 12 && block.data == 0){
		World.setBlock(coords.x, coords.y, coords.z, 0);
		if(block.id == 8 || block.id == 9){
			Player.addItemToInventory(ItemID.cellWater, 1);
		} else {
			Player.addItemToInventory(ItemID.cellLava, 1);
		}
		Player.decreaseCarriedItem(1);
	}
});

Item.registerUseFunction("cellWater", function(coords, item, block){
	if(item.data > 0 || block.id == BlockID.crop) return;
	var x = coords.relative.x
	var y = coords.relative.y
	var z = coords.relative.z
	var block = World.getBlockID(x,y,z)
	if(block == 0 || block > 7 && block < 12){
		World.setBlock(x, y, z, 8);
		Player.addItemToInventory(ItemID.cellEmpty, 1);
		Player.decreaseCarriedItem(1);
	}
});

Item.registerUseFunction("cellLava", function(coords, item, block){
	if(item.data > 0) return;
	var x = coords.relative.x
	var y = coords.relative.y
	var z = coords.relative.z
	var block = World.getBlockID(x,y,z)
	if(block == 0 || block > 7 && block < 12){
		World.setBlock(x, y, z, 10);
		Player.addItemToInventory(ItemID.cellEmpty, 1);
		Player.decreaseCarriedItem(1);
	}
});

// creative group
Item.addCreativeGroup("cells", Translation.translate("Cells"), [
	ItemID.cellEmpty,
	ItemID.cellWater,
	ItemID.cellLava,
	ItemID.cellBiomass,
	ItemID.cellBiogas,
	ItemID.cellCoolant,
	ItemID.cellMatter,
	ItemID.cellAir
]);




// file: items/resource/waste.js

IDRegistry.genItemID("ashes");
Item.createItem("ashes", "Ashes", {name: "ashes"});

IDRegistry.genItemID("slag");
Item.createItem("slag", "Slag", {name: "slag"});

IDRegistry.genItemID("bioChaff");
Item.createItem("bioChaff", "Bio Chaff", {name: "bio_chaff"});




// file: items/crop/crop_seed_bag.js

IDRegistry.genItemID("cropSeedBag");
Item.createItem("cropSeedBag", "Seed Bag (%s)", {name: "crop_seed_bag"}, {stack: 1, isTech: true});
Item.registerUseFunction("cropSeedBag", function(coords, item, block){
    if(block.id == BlockID.crop){
        var te = World.getTileEntity(coords.x,coords.y,coords.z);
        if(!te.data.crop){
            var data = {
                statGrowth: item.extra.getInt("growth"),
                statGain: item.extra.getInt("gain"),
                statResistance: item.extra.getInt("resistance"),
                scanLevel: item.extra.getInt("scan")
            };
            let isCropPlanted = te.tryPlantIn(item.data, 1, data.statGrowth, data.statGain, data.statResistance, data.scanLevel);
            if(isCropPlanted && Game.getGameMode() != 1){
				Player.decreaseCarriedItem(1);
			}
        }
    }
});

Item.addCreativeGroup("cropSeedBag", Translation.translate("Seed Bags"), [ItemID.cropSeedBag]);

Item.registerNameOverrideFunction(ItemID.cropSeedBag, function(item, name){
    var extra = item.extra;
    var scanLvl = extra.getInt("scan");
    var cropClassName = scanLvl > 0 ? AgricultureAPI.cropCards[item.data].id : "Unknown";
    var translatedCropName = Translation.translate(cropClassName);

    var newName = Translation.translate("Seed Bag (%s)").replace("%s", translatedCropName) + '\n';
    if(scanLvl >= 4){
        newName += "§2Gr: " + extra.getInt("growth") + '\n';
        newName += "§6Ga: " + extra.getInt("gain") + '\n';
        newName += "§bRe: " + extra.getInt("resistance");
    }
    if(Config.debugMode){
		newName += "[DEBUG]scanLevel: " + scanLvl;
	}
    return newName;
});




// file: items/crop/crop_cards.js

AgricultureAPI.registerCropCard({
    id: "weed",
    attributes: ["Weed", "Bad"],
    properties: {
        tier: 0,
        chemistry: 0,
        consumable: 0 ,
        defensive: 1,
        colorful: 0 ,
        weed: 5
    },
    baseSeed: {
        addToCreative: false,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 5,
    getOptimalHarvestSize: function(crop){return 1},
    canBeHarvested: function(tileentity){return false},
    getGrowthDuration: function(){return 300},
    getGain: function(tileentity){return null},
    onLeftClick: function(te){return false}
});

AgricultureAPI.registerCropCard({
    id: "wheat",
    texture: "ic2_wheat",
    attributes: ["Yellow", "Food", "Wheat"],
    base: "CropVanilla",
    properties: {
        tier: 1,
        chemistry: 0,
        consumable: 4 ,
        defensive: 0,
        colorful: 0 ,
        weed: 2
    },
    baseSeed: {
        id: 295,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 7,
    sizeAfterHarvest: 2,
    getProduct: function(){
        return {id: 296, count: 1, data: 0};
    },
    getSeed: function(){
        return {id: 295, count: 1, data: 0};
    }
});

AgricultureAPI.registerCropCard({
    id: "pumpkin",
    attributes: ["Orange", "Decoration", "Stem"],
    base: "CropVanilla",
    properties: {
        tier: 1,
        chemistry: 0,
        consumable: 1 ,
        defensive: 0,
        colorful: 3 ,
        weed: 1
    },
    baseSeed: {
        id: 361,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 4,
    getProduct: function(){
        return {id: 86, count: 1, data: 0}
    },
    getGrowthDuration: function(te) {
        if (te.data.currentSize == 3) return 600;
        return 200;
    },
    getSeed: function(){
        return {id: 361, count: random(1, 4), data: 0}
    },
    getSizeAfterHarvest: function(te){
        return this.maxSize - 1;
    }
});

AgricultureAPI.registerCropCard({
    id: "melon",
    attributes: [ "Green", "Food", "Stem" ],
    base: "CropVanilla",
    properties: {
        tier: 2,
        chemistry: 0,
        consumable: 4 ,
        defensive: 0,
        colorful: 2 ,
        weed: 0
    },
    baseSeed: {
        id: 362,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 4,
    getProduct: function(){
        if(Math.random() < 0.5){
            return {id: 103, count: 1, data: 0}
        }
        return {id: 360, count: random(2, 6), data: 0}
    },
    getGrowthDuration: function(te) {
        if (te.currentSize == 3) {
            return 700;
        }
        return 250;
    },
    getSizeAfterHarvest: function(te){
        return this.maxSize - 1;
    },
    getSeed: function(){
        return {id: 362, count: random(1, 3), data: 0}
    }
});

AgricultureAPI.registerCropCard({
    id: "dandelion",
    attributes: [  "Yellow", "Flower"],
    base: "CropColorFlower",
    baseSeed: {
        id: 37,
        size: 4,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    color: 0
});

AgricultureAPI.registerCropCard({
    id: "rose",
    attributes: ["Red", "Flower", "Rose"],
    base: "CropColorFlower",
    baseSeed: {
        id: 38,
        size: 4,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    color: 1
});

AgricultureAPI.registerCropCard({
    id: "blackthorn",
    attributes: ["Black", "Flower", "Rose" ],
    base: "CropColorFlower",
    color: 0
});

AgricultureAPI.registerCropCard({
    id: "tulip",
    attributes: ["Purple", "Flower", "Tulip" ],
    base: "CropColorFlower",
    color: 5
});

AgricultureAPI.registerCropCard({
    id: "cyazint",
    attributes: ["Blue", "Flower"],
    base: "CropColorFlower",
    color: 6
});

AgricultureAPI.registerCropCard({
    id: "venomilia",
    attributes: ["Purple", "Flower", "Tulip", "Poison"],
    properties: {
        tier: 3,
        chemistry: 3,
        consumable: 1 ,
        defensive: 3,
        colorful: 3 ,
        weed: 3
    },
    maxSize: 6,
    getOptimalHarvestSize: function(crop){return 4},
    getDiscoveredBy: function() {
        return "raGan";
    },
    canGrow: function(tileentity){
        var light = World.getLightLevel(tileentity.x, tileentity.y, tileentity.z);
        return (tileentity.data.currentSize <= 4 && light >= 12) || tileentity.data.currentSize == 5;
    },
    canBeHarvested: function(crop) {
        return crop.data.currentSize >= 4;
    },
    getGain: function(crop) {
        if (crop.data.currentSize == 5) {
            return {id: ItemID.grinPowder, count: 1, data: 0};
        }
        if (crop.data.currentSize >= 4) {
            return {id: 351, count: 1, data: 5}
        }
        return null;
    },
    getSizeAfterHarvest: function(crop) {return 3},
    getGrowthDuration: function(crop) {
        if (crop.data.currentSize >= 3) {
            return 600;
        }
        return 400;
    },
    onRightClick: function(crop) {
        if (Player.getCarriedItem().id) this.onEntityCollision(crop);
        return crop.performManualHarvest();
    },
    onLeftClick: function(crop) {
        if (Player.getCarriedItem().id) this.onEntityCollision(crop);
        return crop.pick();
    },
    onEntityCollision: function(crop) {
        if (crop.data.currentSize == 5) {
            var armorSlot = Player.getArmorSlot(3);
            if (random(0,50)&&armorSlot.id){
                return AgricultureAPI.abstractFunctions["IC2CropCard"].onEntityCollision(crop);
            }
            Entity.addEffect(Player.get(), MobEffect.poison, 1, (random(0,10) + 5) * 20);
            crop.data.currentSize = 4;
            crop.updateRender();
        }
        return AgricultureAPI.abstractFunctions["IC2CropCard"].onEntityCollision(crop);
    },
    isWeed: function(crop) {
        return crop.data.currentSize == 5 && crop.data.statGrowth >= 8;
    }
});


AgricultureAPI.registerCropCard({
    id: "reed",
    attributes: [ "Reed" ],
    properties: {
        tier: 2,
        chemistry: 0,
        consumable: 0 ,
        defensive: 2,
        colorful: 0 ,
        weed: 2
    },
    baseSeed: {
        id: 338,
        size: 1,
        growth: 3,
        gain: 0,
        resistance: 2
    },
    maxSize: 3,
    getDiscoveredBy: AgricultureAPI.abstractFunctions["CropVanilla"].getDiscoveredBy,
    canBeHarvested: function(te) {
        return te.data.currentSize > 1
    },
    getGain: function(tileentity) {
        return {id: 338, count: tileentity.data.currentSize - 1, data: 0};
    },
    onEntityCollision: function(te) {return false},
    getGrowthDuration: function(te) {
        return 200;
    }
});

AgricultureAPI.registerCropCard({
    id: "stickreed",
    attributes: ["Reed", "Resin" ],
    properties: {
        tier: 2,
        chemistry: 0,
        consumable: 0 ,
        defensive: 2,
        colorful: 0 ,
        weed: 2
    },
    maxSize: 4,
    getOptimalHarvestSize: function(crop) {return 4},
    getDiscoveredBy: function() {
        return "raa1337";
    },
    canGrow: function(crop) {
        return crop.data.currentSize < 4;
    },
    canBeHarvested: function(te) {
        return te.data.currentSize > 1
    },
    getGain: function(crop) {
        if (crop.data.currentSize <= 3) {
            return {id: 338, count: crop.data.currentSize - 1, data: 0};
        }
        return {id: ItemID.latex, count: 1, data: 0};
    },
    getSizeAfterHarvest: function(crop) {
        if (crop.data.currentSize == 4) {return random(0, 3)}
        return 1;
    },
    onEntityCollision: function(crop) {return false},
    getGrowthDuration: function(crop) {
        if (crop.data.currentSize == 4) {return 400}
        return 100;
    }
});

AgricultureAPI.registerCropCard({
    id: "cocoa",
    texture: "ic2_cocoa",
    attributes: ["Brown", "Food", "Stem"],
    properties: {
        tier: 3,
        chemistry: 1,
        consumable: 3 ,
        defensive: 0,
        colorful: 4 ,
        weed: 0
    },
    baseSeed: {
        id: 351,
        data: 3,
        size: 1,
        growth: 0,
        gain: 0,
        resistance: 0
    },
    maxSize: 4,
    getDiscoveredBy: AgricultureAPI.abstractFunctions["IC2CropCard"].getDiscoveredBy,
    getOptimalHarvestSize: function(crop){return 4},
    canGrow: function(crop) {
        return crop.data.currentSize <= 3 && crop.data.storageNutrients >= 3;
    },
    canBeHarvested: function(crop) {
        return crop.data.currentSize == 4;
    },
    getGain: function(tileentity){
        return {id: 351, count: 1, data: 3};
    },
    getGrowthDuration: function(crop) {
        if (crop.data.currentSize == 3) {
            return 900;
        }return 400;
    },
    getSizeAfterHarvest: function(crop){
        return 3;
    }
});

AgricultureAPI.registerCropCard({
    id: "red_mushroom",
    attributes: [ "Red", "Food", "Mushroom"],
    base: "CropBaseMushroom",
    baseSeed: {
        id: 40,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    getGain: function(te){
        return {id: 40, count: 1, data: 0}
    }
});

AgricultureAPI.registerCropCard({
    id: "brown_mushroom",
    attributes: [ "Brown", "Food", "Mushroom" ],
    base: "CropBaseMushroom",
    baseSeed: {
        id: 39,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    getGain: function(te){
        return {id: 39, count: 1, data: 0}
    }
});

AgricultureAPI.registerCropCard({
    id: "nether_wart",
    attributes: [ "Red", "Nether", "Ingredient", "Soulsand"],
    properties: {
        tier: 5,
        chemistry: 4,
        consumable: 2 ,
        defensive: 0,
        colorful: 2 ,
        weed: 1
    },
    baseSeed: {
        id: 372,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 3,
    getDiscoveredBy: AgricultureAPI.abstractFunctions["CropVanilla"].getDiscoveredBy,
    dropGainChance: function(te) {return 2},
    getGain: function(te){
        return {id: 372, count: 1, data: 0}
    },
    tick: function(te){
        if(te.isBlockBelow(88)){
            if (te.crop.canGrow(te)) {
                te.data.growthPoints += 100;
            }else if(te.isBlockBelow(80) && Math.random() < 1 / 300){
                te.data.crop = AgricultureAPI.getCardIndexFromid("terra_wart");
                te.crop = AgricultureAPI.cropCards[te.data.crop];
            }
        }
    }
});

AgricultureAPI.registerCropCard({
    id: "terra_wart",
    attributes: [ "Blue", "Aether", "Consumable", "Snow"],
    properties: {
        tier: 5,
        chemistry: 2,
        consumable: 4 ,
        defensive: 0,
        colorful: 3 ,
        weed: 0
    },
    baseSeed: {
        id: "ItemID.terraWart",
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 3,
    dropGainChance: function(te) {return .8},
    getGain: function(te){
        return {id: ItemID.terraWart, count: 1, data: 0}
    },
    tick: function(te){
        if(te.isBlockBelow(80)){
            if (te.crop.canGrow(te)) {
                te.data.growthPoints += 100;
            }
			else if(te.isBlockBelow(88) && Math.random() < 1 / 300){
                te.data.crop = AgricultureAPI.getCardIndexFromid("nether_wart");
                te.crop = AgricultureAPI.cropCards[te.data.crop];
            }
        }
    }
});

AgricultureAPI.registerCropCard({
    id: "ferru",
    attributes: ["Gray", "Leaves", "Metal"],
    base: "CropBaseMetalCommon",
    cropRootsRequirement: [15, 42],
    getGain: function(crop) {
        return {id: ItemID.dustSmallIron, count: 1, data: 0}
    }
});

AgricultureAPI.registerCropCard({
    id: "cyprium",
    attributes: ["Orange", "Leaves", "Metal"],
    base: "CropBaseMetalCommon",
    cropRootsRequirement: ["BlockID.blockCopper", "BlockID.oreCopper"],
    getGain: function(crop) {
        return {id: ItemID.dustSmallCopper, count: 1, data: 0}
    }
});

AgricultureAPI.registerCropCard({
    id: "stagnium",
    attributes: ["Shiny", "Leaves", "Metal"],
    base: "CropBaseMetalCommon",
    cropRootsRequirement: ["BlockID.blockTin","BlockID.oreTin"],
    getGain: function(crop) {
        return {id: ItemID.dustSmallTin, count: 1, data: 0}
    }
});

AgricultureAPI.registerCropCard({
    id: "plumbiscus",
    attributes: ["Dense", "Leaves", "Metal"],
    base: "CropBaseMetalCommon",
    cropRootsRequirement: ["BlockID.blockLead","BlockID.oreLead"],
    getGain: function(crop) {
        return {id: ItemID.dustSmallLead, count: 1, data: 0}
    }
});

AgricultureAPI.registerCropCard({
    id: "aurelia",
    attributes: [ "Gold", "Leaves", "Metal"],
    base: "CropBaseMetalUncommon",
    cropRootsRequirement: [14,41],
    getGain: function(crop) {
        return {id: 371, count: 1, data: 0}
    }
});

AgricultureAPI.registerCropCard({
    id: "shining",
    attributes: [ "Silver", "Leaves", "Metal" ],
    base: "CropBaseMetalUncommon",
    cropRootsRequirement: ["BlockID.blockSilver","BlockID.oreSilver"],
    getGain: function(crop) {
        return {id: ItemID.dustSmallSilver, count: 1, data: 0}
    }
});

AgricultureAPI.registerCropCard({
    id: "redwheat",
    attributes: [  "Red", "Redstone", "Wheat"],
    properties: {
        tier: 6,
        chemistry: 3,
        consumable: 0 ,
        defensive: 0,
        colorful: 2 ,
        weed: 0
    },
    maxSize: 7,
    getOptimalHarvestSize: function(crop){return 7},
    getDiscoveredBy: function() {
        return "raa1337";
    },
    canGrow: function(crop) {
        var light = World.getLightLevel(crop.x,crop.y,crop.z);
        return crop.data.currentSize < 7 && light <= 10 && light >= 5;
    },
    dropGainChance: function() {return 0.5},
    getGain: function(crop) {
        if (Math.random() < 0.5) return {id: 331, count: 1, data: 0};
        return {id: 295, count: 1, data: 0}
    },
    getGrowthDuration: function(crop){return 600},
    getSizeAfterHarvest: function(crop) {return 2}
});

AgricultureAPI.registerCropCard({
    id: "coffee",
    attributes: ["Leaves", "Ingredient", "Beans"],
    properties: {
        tier: 7,
        chemistry: 1,
        consumable: 4,
        defensive: 1,
        colorful: 2 ,
        weed: 0
    },
    baseSeed: {
        id: "ItemID.coffeeBeans",
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 5,
    getDiscoveredBy: function() {
        return "Snoochy";
    },
    canGrow: function(crop) {
        var light = World.getLightLevel(crop.x,crop.y,crop.z);
        return crop.data.currentSize < 5 && light >= 9;
    },
    getGrowthDuration(crop) {
        var base = AgricultureAPI.abstractFunctions["IC2CropCard"];
        if (crop.data.currentSize == 3) {
            return Math.round(base.getGrowthDuration(crop) * .5);
        }
        if (crop.data.currentSize == 4) {
            return Math.round(base.getGrowthDuration(crop) * 1.5);
        }
        return base.getGrowthDuration(crop);
    },
    canBeHarvested(crop) {
        return crop.data.currentSize>= 4;
    },
    getGain: function(crop) {
        if (crop.data.currentSize == 4) return null;
        return {id: ItemID.coffeeBeans, count: 1, data: 0};
    },
    getSizeAfterHarvest: function(crop) {return 3}
});

AgricultureAPI.registerCropCard({
    id: "hops",
    attributes: [ "Green", "Ingredient", "Wheat"],
    properties: {
        tier: 5,
        chemistry: 2,
        consumable: 2,
        defensive: 0,
        colorful: 1 ,
        weed: 1
    },
    maxSize: 7,
    canGrow: function(crop) {
        var light = World.getLightLevel(crop.x, crop.y, crop.z);
        return crop.data.currentSize < 7 && light >= 9;
    },
    getGrowthDuration: function(crop) {
       return 600;
    },
    canBeHarvested: function(crop) {
        return crop.data.currentSize >= 4;
    },
    getGain: function(crop) {
        return {id: ItemID.hops, count: 1, data: 0};
    },
    getSizeAfterHarvest: function(crop) {return 3}
});

AgricultureAPI.registerCropCard({
    id: "carrots",
    texture: "ic2_carrots",
    attributes: ["Orange", "Food", "Carrots" ],
    base: "CropVanilla",
    properties: {
        tier: 2,
        chemistry: 0,
        consumable: 4 ,
        defensive: 0,
        colorful: 0 ,
        weed: 2
    },
    baseSeed: {
        id: 391,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 3,
    getProduct: function(){
        return {id: 391, count: 1, data: 0}
    },
    getSeed: this.getProduct
});

AgricultureAPI.registerCropCard({
    id: "potato",
    attributes: ["Yellow", "Food", "Potato" ],
    properties: {
        tier: 2,
        chemistry: 0,
        consumable: 4 ,
        defensive: 0,
        colorful: 0 ,
        weed: 2
    },
    baseSeed: {
        id: 392,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 4,
    canGrow: AgricultureAPI.abstractFunctions["IC2CropCard"].canGrow,
    getOptimalHarvestSize: function(crop){return 3},
    canBeHarvested: function(crop) {
        return crop.data.currentSize >= 3;
    },
    getGain: function(crop) {
        if (crop.data.currentSize >= 4 && Math.random() < 0.05) {
            return {id: 394, count: 1, data: 0};
        }
        if (crop.data.currentSize >= 3) {
            return {id: 392, count: 1, data: 0};
        }
        return null;
    },
    getSizeAfterHarvest: function(te){return 1}
});

AgricultureAPI.registerCropCard({
    id: "eatingplant",
    attributes: ["Bad", "Food"],
    properties: {
        tier: 6,
        chemistry: 1,
        consumable: 1 ,
        defensive: 3,
        colorful: 1 ,
        weed: 4
    },
    baseSeed: {
        id: 81,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 6,
    getOptimalHarvestSize: function(crop){return 4},
    getDiscoveredBy: function() {
        return "Hasudako";
    },
    canGrow: function(crop) {
        var light = World.getLightLevel(crop.x, crop.y, crop.z);
        if (crop.data.currentSize < 3) {
            return light > 10;
        }
        return crop.isBlockBelow(10) && crop.data.currentSize< this.maxSize() && light > 10;
    },
    canBeHarvested: function(crop) {
        return crop.data.currentSize >= 4 && crop.data.currentSize< 6;
    },
    getGain: function(crop) {
        if (crop.data.currentSize >= 4 && crop.data.currentSize < 6) {
            return {id: 81, count: 1, data: 0};
        }
        return null;
    },
    tick: function(te){
        if(te.data.currentSize == 1) return;

        var entity = Entity.findNearest({x: this.x + .5, y: this.y + .5, z: this.z + .5}, null, 2);
        if(!entity)return;

        Entity.damageEntity(entity, te.data.currentSize * 2);
        if(entity == player && !this.hasMetalArmor()){
            Entity.addEffect(player, MobEffect.poison, 1, 50);
        }
        if(te.crop.canGrow(te)) te.data.growthPoints += 100;
        nativeDropItem(this.x, this.y, this.z, 0, 367, 1, 0, null);
    },
    nonMetalCheck: {
        298: true,
        299: true,
        300: true,
        301: true
    },
    hasMetalArmor: function(){
        for(var i = 0; i < 4; i++){
            var armorSlot = Player.getArmorSlot(i);
            if(!armorSlot.id || this.nonMetalCheck[armorSlot.id]) return false;
        }
        return true;
    },
    getGrowthDuration: function(crop) {
        var multiplier = 1;
        var base = AgricultureAPI.abstractFunctions["IC2CropCard"];
        //todo: compare with PC version when BiomeDictionary will be available
        return Math.round(base.getGrowthDuration(crop) * multiplier);
    },
    getSizeAfterHarvest: function(te){return 1},
    getRootsLength: function(crop){return 5}
});


AgricultureAPI.registerCropCard({
    id: "beetroots",
    attributes: [ "Red", "Food", "Beetroot"],
    base: "CropVanilla",
    properties: {
        tier: 1,
        chemistry: 0,
        consumable: 4,
        defensive: 0,
        colorful: 1,
        weed: 2
    },
    baseSeed: {
        id: 458,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 4,
    getProduct: function(){
        return {id: 457, count: 1, data: 0};
    },
    getSeed: function(){
        return {id: 458, count: 1, data: 0};
    }
});




// file: items/crop/crop_stick.js

IDRegistry.genItemID("cropStick");
Item.createItem("cropStick", "Crop", {name: "crop_stick"});

Recipes.addShaped({id: ItemID.cropStick , count: 2 , data: 0}, [
	"x x",
	"x x"
], ['x', 280, 0]);

Item.registerUseFunction("cropStick", function(coords, item, block){
    if(block.id == 60 && coords.side == 1){
		var place = coords.relative;
		var tile = World.getBlock(place.x, place.y, place.z);
		if(World.canTileBeReplaced(tile.id, tile.data)){
			World.setBlock(place.x, place.y, place.z, BlockID.crop, 0);
			World.addTileEntity(place.x, place.y, place.z);
			Player.decreaseCarriedItem(1);
		}
    }
});




// file: items/crop/crop_utils.js

IDRegistry.genItemID("fertilizer");
Item.createItem("fertilizer", "Fertilizer", {name: "fertilizer"});

IDRegistry.genItemID("weedEx");
Item.createItem("weedEx", "Weed EX", {name: "weed_ex"}, {stack: 1});
Item.setMaxDamage(ItemID.weedEx, 10);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShapeless({id: ItemID.fertilizer, count: 2, data: 0}, [{id: ItemID.scrap, data: 0}, {id: 351, data: 15}]);
	Recipes.addShapeless({id: ItemID.fertilizer, count: 2, data: 0}, [{id: ItemID.scrap, data: 0}, {id: ItemID.ashes, data: 0}]);
	Recipes.addShapeless({id: ItemID.fertilizer, count: 2, data: 0}, [{id: ItemID.scrap, data: 0}, {id: ItemID.scrap, data: 0}, {id: ItemID.fertilizer, data: 0}]);
	
	Recipes.addShaped({id: ItemID.weedEx, count: 1, data: 0}, [
        "z",
        "x",
        "c"
    ], ['z', 331, 0, 'x', ItemID.grinPowder, 0, 'c', ItemID.cellEmpty, 0]);
});




// file: items/crop/crop_items.js

IDRegistry.genItemID("grinPowder");
Item.createItem("grinPowder", "Grin Powder", {name: "grin_powder"});

IDRegistry.genItemID("hops");
Item.createItem("hops", "Hops", {name: "hops"});

IDRegistry.genItemID("weed");
Item.createItem("weed", "Weed", {name: "weed"});




// file: items/crop/coffee_beans.js

IDRegistry.genItemID("coffeeBeans");
Item.createItem("coffeeBeans", "Coffee Beans", {name: "coffee_beans"});

IDRegistry.genItemID("coffeePowder");
Item.createItem("coffeePowder", "Coffee Powder", {name: "coffee_powder"});
Recipes.addShapeless({id: ItemID.coffeePowder, count: 1, data: 0}, [{id: ItemID.coffeeBeans, data: 0}]);




// file: items/food/terra_wart.js

var negativePotions = [
    MobEffect.movementSlowdown,
    MobEffect.digSlowdown,
    MobEffect.confusion,
    MobEffect.blindness,
    MobEffect.hunger,
    MobEffect.weakness,
    MobEffect.poison,
    MobEffect.wither
];

IDRegistry.genItemID("terraWart");
Item.createFoodItem("terraWart", "Terra Wart", {name: "terra_wart"}, {food: 1});
ItemName.setRarity(ItemID.terraWart, 2, true);

Callback.addCallback("FoodEaten", function(heal, satRatio){
    if(Player.getCarriedItem().id == ItemID.terraWart){
		RadiationAPI.addRadiation(-600);
		for(var i in negativePotions){
			var potionID = negativePotions[i];
			Entity.clearEffect(Player.get(), potionID);
		}
	}
});




// file: items/food/mug.js

IDRegistry.genItemID("mugEmpty");
Item.createItem("mugEmpty", "Stone Mug", {name: "mug_empty"}, {stack: 1});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.mugEmpty, count: 1, data: 0}, [
		"xx ",
		"xxx",
		"xx ",
	], ['x', 1, -1]);
});




// file: items/food/coffee.js

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

Item.addCreativeGroup("mug_coffee", Translation.translate("Coffee"), [
	ItemID.mugEmpty,
	ItemID.mugColdCoffee,
	ItemID.mugDarkCoffee,
	ItemID.mugCoffee
]);

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




// file: items/food/can.js

IDRegistry.genItemID("tinCanEmpty");
Item.createItem("tinCanEmpty", "Tin Can", {name: "tin_can", meta: 0});

IDRegistry.genItemID("tinCanFull");
Item.createItem("tinCanFull", "Filled Tin Can", {name: "tin_can", meta: 1});

Item.registerNameOverrideFunction(ItemID.tinCanFull, function(item, name){
	if(item.data > 0){
		return name + "\n§7" + Translation.translate("This looks bad...");
	}
	return name;
});

let getMaxHunger = function(){return 20;}
ModAPI.addAPICallback("ThirstAPI", function(api){
	getMaxHunger = api.getMaxHunger;
});

Item.registerNoTargetUseFunction("tinCanFull", function(){
	var item = Player.getCarriedItem();
	var hunger = Player.getHunger();
	var saturation = Player.getSaturation();
	var count = Math.min(getMaxHunger() - hunger, item.count);
	if(count > 0){
		Player.setHunger(hunger + count);
		Player.setSaturation(Math.min(20, saturation + count*0.6));
		if(item.data == 1 && Math.random() < 0.2*count){
			Entity.addEffect(Player.get(), MobEffect.hunger, 1, 600);
		}
		if(item.data == 2){
			Entity.addEffect(Player.get(), MobEffect.poison, 1, 80);
		}
		if(item.count == count){
			Player.setCarriedItem(ItemID.tinCanEmpty, count, 0);
		} else {
			Player.setCarriedItem(item.id, item.count - count, item.data);
			Player.addItemToInventory(ItemID.tinCanEmpty, count, 0);
		}
		SoundAPI.playSound("Tools/eat.ogg");
	}
});




// file: items/electric/cable.js

IDRegistry.genItemID("cableTin0");
IDRegistry.genItemID("cableTin1");
Item.createItem("cableTin0", "Tin Cable", {name: "cable_tin", meta: 0});
Item.createItem("cableTin1", "Insulated Tin Cable", {name: "cable_tin", meta: 1});

IDRegistry.genItemID("cableCopper0");
IDRegistry.genItemID("cableCopper1");
Item.createItem("cableCopper0", "Copper Cable", {name: "cable_copper", meta: 0});
Item.createItem("cableCopper1", "Insulated Copper Cable", {name: "cable_copper", meta: 1});

IDRegistry.genItemID("cableGold0");
IDRegistry.genItemID("cableGold1");
IDRegistry.genItemID("cableGold2");
Item.createItem("cableGold0", "Gold Cable", {name: "cable_gold", meta: 0});
Item.createItem("cableGold1", "Insulated Gold Cable", {name: "cable_gold", meta: 1});
Item.createItem("cableGold2", "2x Ins. Gold Cable", {name: "cable_gold", meta: 2});

IDRegistry.genItemID("cableIron0");
IDRegistry.genItemID("cableIron1");
IDRegistry.genItemID("cableIron2");
IDRegistry.genItemID("cableIron3");
Item.createItem("cableIron0", "HV Cable", {name: "cable_iron", meta: 0});
Item.createItem("cableIron1", "Insulated HV Cable", {name: "cable_iron", meta: 1});
Item.createItem("cableIron2", "2x Ins. HV Cable", {name: "cable_iron", meta: 2});
Item.createItem("cableIron3", "3x Ins. HV Cable", {name: "cable_iron", meta: 3});

IDRegistry.genItemID("cableOptic");
Item.createItem("cableOptic", "Glass Fibre Cable", {name: "cable_optic", meta: 0});

Item.addCreativeGroup("cableEU", Translation.translate("Cables"), [
	ItemID.cableTin0,
	ItemID.cableTin1,
	ItemID.cableCopper0,
	ItemID.cableCopper1,
	ItemID.cableGold0,
	ItemID.cableGold1,
	ItemID.cableGold2,
	ItemID.cableIron0,
	ItemID.cableIron1,
	ItemID.cableIron2,
	ItemID.cableIron3,
	ItemID.cableOptic
]);

Recipes.addShaped({id: ItemID.cableOptic, count: 6, data: 0}, [
	"aaa",
	"x#x",
	"aaa"
], ['#', ItemID.dustSilver, 0, 'x', ItemID.dustEnergium, 0, 'a', 20, -1]);

Callback.addCallback("PreLoaded", function(){
	// cutting recipes
	ICTool.addRecipe({id: ItemID.cableTin0, count: 2, data: 0}, [{id: ItemID.plateTin, data: 0}], ItemID.cutter);
	ICTool.addRecipe({id: ItemID.cableCopper0, count: 2, data: 0}, [{id: ItemID.plateCopper, data: 0}], ItemID.cutter);
	ICTool.addRecipe({id: ItemID.cableGold0, count: 3, data: 0}, [{id: ItemID.plateGold, data: 0}], ItemID.cutter);

	// isolation recipes
	Recipes.addShapeless({id: ItemID.cableTin1, count: 1, data: 0}, [{id: ItemID.cableTin0, data: 0}, {id: ItemID.rubber, data: 0}]);
	Recipes.addShapeless({id: ItemID.cableCopper1, count: 1, data: 0}, [{id: ItemID.cableCopper0, data: 0}, {id: ItemID.rubber, data: 0}]);
	
	Recipes.addShapeless({id: ItemID.cableGold1, count: 1, data: 0}, [{id: ItemID.cableGold0, data: 0}, {id: ItemID.rubber, data: 0}]);
	Recipes.addShapeless({id: ItemID.cableGold2, count: 1, data: 0}, [{id: ItemID.cableGold1, data: 0}, {id: ItemID.rubber, data: 0}]);
	addShapelessRecipe({id: ItemID.cableGold2, count: 1, data: 0}, [{id: ItemID.cableGold0, count: 1, data: 0}, {id: ItemID.rubber, count: 2, data: 0}]);

	Recipes.addShapeless({id: ItemID.cableIron1, count: 1, data: 0}, [{id: ItemID.cableIron0, data: 0}, {id: ItemID.rubber, data: 0}]);
	Recipes.addShapeless({id: ItemID.cableIron2, count: 1, data: 0}, [{id: ItemID.cableIron1, data: 0}, {id: ItemID.rubber, data: 0}]);
	Recipes.addShapeless({id: ItemID.cableIron3, count: 1, data: 0}, [{id: ItemID.cableIron2, data: 0}, {id: ItemID.rubber, data: 0}]);
	addShapelessRecipe({id: ItemID.cableIron3, count: 1, data: 0}, [{id: ItemID.cableIron0, count: 1, data: 0}, {id: ItemID.rubber, count: 3, data: 0}]);
});


function registerCablePlaceFunc(nameID, blockID, blockData){
	Item.registerUseFunction(nameID, function(coords, item, block){
		var place = coords;
		if(!World.canTileBeReplaced(block.id, block.data)){
			place = coords.relative;
			block = World.getBlock(place.x, place.y, place.z);
			if(!World.canTileBeReplaced(block.id, block.data)){
				return;
			}
		}
		World.setBlock(place.x, place.y, place.z, blockID, blockData);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyTypeRegistry.onWirePlaced(place.x, place.y, place.z);
	});
}

for(var i = 0; i < 2; i++){
	registerCablePlaceFunc("cableTin"+i, BlockID["cableTin"+i], 0);
	Item.registerNameOverrideFunction(ItemID["cableTin"+i], function(item, name){
		return name + "\n§7" + Translation.translate("Max voltage: ") + "32 EU/t";
	});
}

for(var i = 0; i < 2; i++){
	registerCablePlaceFunc("cableCopper"+i, BlockID["cableCopper"+i], 0);
	Item.registerNameOverrideFunction(ItemID["cableCopper"+i], function(item, name){
		return name + "\n§7" + Translation.translate("Max voltage: ") + "128 EU/t";
	});
}

for(var i = 0; i < 3; i++){
	registerCablePlaceFunc("cableGold"+i, BlockID["cableGold"+i], 0);
	Item.registerNameOverrideFunction(ItemID["cableGold"+i], function(item, name){
		return name + "\n§7" + Translation.translate("Max voltage: ") + "512 EU/t";
	});
}

for(var i = 0; i < 4; i++){
	registerCablePlaceFunc("cableIron"+i, BlockID["cableIron"+i], 0);
	Item.registerNameOverrideFunction(ItemID["cableIron"+i], function(item, name){
		return name + "\n§7" + Translation.translate("Max voltage: ") + "2048 EU/t";
	});
}

registerCablePlaceFunc("cableOptic", BlockID.cableOptic, 0);
Item.registerNameOverrideFunction(ItemID.cableOptic, function(item, name){
	return name + "\n§7" + Translation.translate("Max voltage: ") + "8192 EU/t";
});




// file: items/electric/components.js

IDRegistry.genItemID("circuitBasic");
IDRegistry.genItemID("circuitAdvanced");
Item.createItem("circuitBasic", "Electronic Circuit", {name: "circuit_basic", meta: 0});
Item.createItem("circuitAdvanced", "Advanced Circuit", {name: "circuit_advanced", meta: 0});
ItemName.setRarity(ItemID.circuitAdvanced, 1, true);

IDRegistry.genItemID("coil");
IDRegistry.genItemID("electricMotor");
IDRegistry.genItemID("powerUnit");
IDRegistry.genItemID("powerUnitSmall");
Item.createItem("coil", "Coil", {name: "coil", meta: 0});
Item.createItem("electricMotor", "Electric Motor", {name: "electric_motor", meta: 0});
Item.createItem("powerUnit", "Power Unit", {name: "power_unit", meta: 0});
Item.createItem("powerUnitSmall", "Small Power Unit", {name: "power_unit_small", meta: 0});

IDRegistry.genItemID("heatConductor");
Item.createItem("heatConductor", "Heat Conductor", {name: "heat_conductor", meta: 0});

Item.addCreativeGroup("ic2_component", Translation.translate("Crafting Components"), [
	ItemID.circuitBasic,
	ItemID.circuitAdvanced,
	ItemID.coil,
	ItemID.electricMotor,
	ItemID.powerUnit,
	ItemID.powerUnitSmall,
	ItemID.heatConductor
]);

Callback.addCallback("PreLoaded", function(){
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
	], ['x', ItemID.circuitBasic, 0, 'e', ItemID.electricMotor, 0,  'a', ItemID.storageBattery, -1, 's', ItemID.casingIron, 0, 'c', ItemID.cableCopper0, 0]);

	Recipes.addShaped({id: ItemID.powerUnitSmall, count: 1, data: 0}, [
		" cs",
		"axe",
		" cs"
	], ['x', ItemID.circuitBasic, 0, 'e', ItemID.electricMotor, 0,  'a', ItemID.storageBattery, -1, 's', ItemID.casingIron, 0, 'c', ItemID.cableCopper0, 0]);
	
	Recipes.addShaped({id: ItemID.heatConductor, count: 1, data: 0}, [
		"aсa",
		"aсa",
		"aсa"
	], ['с', ItemID.plateCopper, 0, 'a', ItemID.rubber, 0]);
});




// file: items/electric/storage.js

IDRegistry.genItemID("storageBattery");
Item.createItem("storageBattery", "RE-Battery", {name: "re_battery", meta: 0}, {stack: 1, isTech: true});
Item.addToCreative(ItemID.storageBattery, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.storageBattery, "Eu", 10000, 100, 1, "storage", true, true);

IDRegistry.genItemID("storageAdvBattery");
Item.createItem("storageAdvBattery", "Advanced RE-Battery", {name: "adv_re_battery", meta: 0}, {stack: 1, isTech: true});
Item.addToCreative(ItemID.storageAdvBattery, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.storageAdvBattery, "Eu", 100000, 256, 2, "storage", true, true);

IDRegistry.genItemID("storageCrystal");
Item.createItem("storageCrystal", "Energy Crystal", {name: "energy_crystal", meta: 0}, {stack: 1, isTech: true});
Item.addToCreative(ItemID.storageCrystal, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.storageCrystal, "Eu", 1000000, 2048, 3, "storage", true, true);

IDRegistry.genItemID("storageLapotronCrystal");
Item.createItem("storageLapotronCrystal", "Lapotron Crystal", {name: "lapotron_crystal", meta: 0}, {stack: 1, isTech: true});
Item.addToCreative(ItemID.storageLapotronCrystal, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.storageLapotronCrystal, "Eu", 10000000, 8192, 4, "storage", true, true);
ItemName.setRarity(ItemID.storageLapotronCrystal, 1);

IDRegistry.genItemID("debugItem");
Item.createItem("debugItem", "Debug Item", {name: "debug_item", meta: 0}, {isTech: !Config.debugMode});
ChargeItemRegistry.registerItem(ItemID.debugItem, "Eu", -1, 0, "storage");

Item.addCreativeGroup("batteryEU", Translation.translate("Batteries"), [
	ItemID.storageBattery,
	ItemID.storageAdvBattery,
	ItemID.storageCrystal,
	ItemID.storageLapotronCrystal,
	ItemID.debugItem
]);

Item.registerNameOverrideFunction(ItemID.storageBattery, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.storageAdvBattery, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.storageCrystal, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.storageLapotronCrystal, ItemName.showItemStorage);

Item.registerIconOverrideFunction(ItemID.storageBattery, function(item, name){
	return {name: "re_battery", meta: Math.round((27 - item.data) / 26 * 4)}
});

Item.registerIconOverrideFunction(ItemID.storageAdvBattery, function(item, name){
	return {name: "adv_re_battery", meta: Math.round((27 - item.data) / 26 * 4)}
});

Item.registerIconOverrideFunction(ItemID.storageCrystal, function(item, name){
	return {name: "energy_crystal", meta: Math.round((27 - item.data) / 26 * 4)};
});

Item.registerIconOverrideFunction(ItemID.storageLapotronCrystal, function(item, name){
	return {name: "lapotron_crystal", meta: Math.round((27 - item.data) / 26 * 4)};
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: ItemID.storageBattery, count: 1, data: Item.getMaxDamage(ItemID.storageBattery)}, [
		" x ",
		"c#c",
		"c#c"
	], ['x', ItemID.cableTin1, 0, 'c', ItemID.casingTin, 0, '#', 331, 0]);

	Recipes.addShaped({id: ItemID.storageAdvBattery, count: 1, data: Item.getMaxDamage(ItemID.storageAdvBattery)}, [
		"xbx",
		"bab",
		"bcb"
	], ['x', ItemID.cableCopper1, 0, 'a', ItemID.dustSulfur, 0, 'b', ItemID.casingBronze, 0, 'c', ItemID.dustLead, 0]);

	Recipes.addShaped({id: ItemID.storageLapotronCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageLapotronCrystal)}, [
		"x#x",
		"xax",
		"x#x"
	], ['a', ItemID.storageCrystal, -1, 'x', ItemID.dustLapis, 0, '#', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);
});

ChargeItemRegistry.registerChargeFunction(ItemID.debugItem, function(item, amount, transf, level){
	return amount;
});

ChargeItemRegistry.registerDischargeFunction(ItemID.debugItem, function(item, amount, transf, level){
	return amount;
});

Item.registerUseFunction("debugItem", function(coords, item, block){
	Game.message(block.id+":"+block.data);
	var tile = World.getTileEntity(coords.x, coords.y, coords.z);
	if(tile){
		var liquid = tile.liquidStorage.getLiquidStored();
		if(liquid){
			Game.message(liquid + " - " + tile.liquidStorage.getAmount(liquid)*1000 + "mB");
		}
		for(var i in tile.data){
			if(i != "energy_storage"){
				if(i == "__liquid_tanks"){
					var tanks = tile.data[i];
					Game.message(tanks.input.liquid + ": "+ tanks.input.amount*1000 + "mB");
					Game.message(tanks.output.liquid + ": "+ tanks.output.amount*1000 + "mB");
				}
				else if(i == "energy"){
					Game.message("energy: " + tile.data[i] + "/" + tile.getEnergyStorage());
				}
				else try {
					Game.message(i + ": " + tile.data[i]);
				} catch(e){
					Game.message(i);
				}
			}
		}
	}
	tile = EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z);
	if(tile){
		for (var i in tile.__energyNets){
			var net = tile.__energyNets[i];
			if(net) Game.message(net.toString());
		}
	} else {
		var net = EnergyNetBuilder.getNetOnCoords(coords.x, coords.y, coords.z);
		if(net) Game.message(net.toString());
	}
});




// file: items/electric/charging.js

IDRegistry.genItemID("chargingBattery");
Item.createItem("chargingBattery", "Charging RE-Battery", {name: "charging_re_battery", meta: 0}, {stack: 1, isTech: true});
Item.addToCreative(ItemID.chargingBattery, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.chargingBattery, "Eu", 40000, 128, 1, "storage", true, true);

IDRegistry.genItemID("chargingAdvBattery");
Item.createItem("chargingAdvBattery", "Advanced Charging Battery", {name: "adv_charging_battery", meta: 0}, {stack: 1, isTech: true});
Item.addToCreative(ItemID.chargingAdvBattery, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.chargingAdvBattery, "Eu", 400000, 512, 2, "storage", true, true);

IDRegistry.genItemID("chargingCrystal");
Item.createItem("chargingCrystal", "Charging Energy Crystal", {name: "charging_energy_crystal", meta: 0}, {stack: 1, isTech: true});
Item.addToCreative(ItemID.chargingCrystal, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.chargingCrystal, "Eu", 4000000, 2048, 3, "storage", true, true);

IDRegistry.genItemID("chargingLapotronCrystal");
Item.createItem("chargingLapotronCrystal", "Charging Lapotron Crystal", {name: "charging_lapotron_crystal", meta: 0}, {stack: 1, isTech: true});
Item.addToCreative(ItemID.chargingLapotronCrystal, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.chargingLapotronCrystal, "Eu", 40000000, 8192, 4, "storage", true, true);
ItemName.setRarity(ItemID.chargingLapotronCrystal, 1);

Item.addCreativeGroup("chargingBatteryEU", Translation.translate("Charging Batteries") , [
	ItemID.chargingBattery,
	ItemID.chargingAdvBattery,
	ItemID.chargingCrystal,
	ItemID.chargingLapotronCrystal
]);

Item.registerIconOverrideFunction(ItemID.chargingBattery, function(item, name){
	return {name: "charging_re_battery", meta: Math.round((27 - item.data) / 26 * 4)}
});

Item.registerIconOverrideFunction(ItemID.chargingAdvBattery, function(item, name){
	return {name: "adv_charging_battery", meta: Math.round((27 - item.data) / 26 * 4)}
});

Item.registerIconOverrideFunction(ItemID.chargingCrystal, function(item, name){
	return {name: "charging_energy_crystal", meta: Math.round((27 - item.data) / 26 * 4)}
});

Item.registerIconOverrideFunction(ItemID.chargingLapotronCrystal, function(item, name){
	return {name: "charging_lapotron_crystal", meta: Math.round((27 - item.data) / 26 * 4)}
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: ItemID.chargingBattery, count: 1, data: Item.getMaxDamage(ItemID.chargingBattery)}, [
		"xbx",
		"b b",
		"xbx"
	], ['x', ItemID.circuitBasic, 0, 'b', ItemID.storageBattery, -1], ChargeItemRegistry.transferEnergy);

	Recipes.addShaped({id: ItemID.chargingAdvBattery, count: 1, data: Item.getMaxDamage(ItemID.chargingAdvBattery)}, [
		"xbx",
		"b#b",
		"xbx"
	], ['#', ItemID.chargingBattery, -1, 'x', ItemID.heatExchanger, 1, 'b', ItemID.storageAdvBattery, -1], ChargeItemRegistry.transferEnergy);

	Recipes.addShaped({id: ItemID.chargingCrystal, count: 1, data: Item.getMaxDamage(ItemID.chargingCrystal)}, [
		"xbx",
		"b#b",
		"xbx"
	], ['#', ItemID.chargingAdvBattery, -1, 'x', ItemID.heatExchangerComponent, 1, 'b', ItemID.storageCrystal, -1], ChargeItemRegistry.transferEnergy);
	
	Recipes.addShaped({id: ItemID.chargingLapotronCrystal, count: 1, data: Item.getMaxDamage(ItemID.chargingLapotronCrystal)}, [
		"xbx",
		"b#b",
		"xbx"
	], ['#', ItemID.chargingCrystal, -1, 'x', ItemID.heatExchangerAdv, 1, 'b', ItemID.storageLapotronCrystal, -1], ChargeItemRegistry.transferEnergy);
});

var ChargingBattery = {
	itemIDs: {},
	
	registerItem: function(nameID){
		var id = ItemID[nameID];
		this.itemIDs[id] = true;
		Item.registerNoTargetUseFunction(nameID, this.switchFunction);
		Item.registerNameOverrideFunction(id, this.getName);
	},
	
	switchFunction: function(item){
		var extra = item.extra;
		if(!extra){
			extra = new ItemExtraData();
		}
		var mode = (extra.getInt("mode")+1)%3;
		extra.putInt("mode", mode);
		if(mode == 0){
			Game.message(Translation.translate("Mode: Enabled"));
		}
		if(mode == 1){
			Game.message(Translation.translate("Mode: Charge items not in hand"));
		}
		if(mode == 2){
			Game.message(Translation.translate("Mode: Disabled"));
		}
		Player.setCarriedItem(item.id, 1, item.data, extra);
	},
	
	getName: function(item, name){
		var mode = item.extra? item.extra.getInt("mode") : 0;
		if(mode == 0){
			var tooltip = Translation.translate("Mode: Enabled");
		}
		if(mode == 1){
			var tooltip = Translation.translate("Mode: Charge items not in hand");
		}
		if(mode == 2){
			var tooltip = Translation.translate("Mode: Disabled");
		}
		name = ItemName.showItemStorage(item, name);
		return name + '\n' + tooltip;
	}
}

ChargingBattery.registerItem("chargingBattery");
ChargingBattery.registerItem("chargingAdvBattery");
ChargingBattery.registerItem("chargingCrystal");
ChargingBattery.registerItem("chargingLapotronCrystal");

function checkCharging(){
	for(var i = 0; i < 36; i++){
		var slot = Player.getInventorySlot(i);
		if(ChargingBattery.itemIDs[slot.id]){
			var mode = slot.extra? slot.extra.getInt("mode") : 0;
			var energyStored = ChargeItemRegistry.getEnergyStored(slot);
			if(mode == 2 || energyStored <= 0) continue;
			var chargeData = ChargeItemRegistry.getItemData(slot.id);
			for(var index = 0; index < 9; index++){
				if(mode == 1 && Player.getSelectedSlotId() == index) continue;
				var item = Player.getInventorySlot(index);
				if(!ChargeItemRegistry.isValidStorage(item.id, "Eu", 5)){
					var energyAdd = ChargeItemRegistry.addEnergyTo(item, "Eu", energyStored, chargeData.transferLimit*20, chargeData.level);
					if(energyAdd > 0){
						energyStored -= energyAdd;
						Player.setInventorySlot(index, item.id, 1, item.data, item.extra);
					}
				}
			}
			ChargeItemRegistry.setEnergyStored(slot, energyStored);
			Player.setInventorySlot(i, slot.id, 1, slot.data, slot.extra);
		}
	}
}

Callback.addCallback("tick", function(){
	if(World.getThreadTime() % 20 == 0){
		checkCharging();
	}
});




// file: items/electric/upgrades.js

IDRegistry.genItemID("upgradeOverclocker");
Item.createItem("upgradeOverclocker", "Overclocker Upgrade", {name: "upgrade_overclocker", meta: 0});
Item.registerNameOverrideFunction(ItemID.upgradeOverclocker, function(item, name){
	let percent = "%%%%"; // it's one % in name
	if(currentUIscreen == "in_game_play_screen" || currentUIscreen == "world_loading_progress_screen - local_world_load"){
		percent += "%%%%"; // this game is broken
	}
	let timeTooltip = Translation.translate("Decrease process time to ") + 70 + percent;
	let powerTooltip = Translation.translate("Increase power to ") + 160 + percent;
	return name + "§7\n" + timeTooltip + "\n" + powerTooltip;
});

IDRegistry.genItemID("upgradeTransformer");
Item.createItem("upgradeTransformer", "Transformer Upgrade", {name: "upgrade_transformer", meta: 0});
Item.registerNameOverrideFunction(ItemID.upgradeTransformer, function(item, name){
	return name + "§7\n" + Translation.translate("Increase energy tier by 1");
});

IDRegistry.genItemID("upgradeEnergyStorage");
Item.createItem("upgradeEnergyStorage", "Energy Storage Upgrade", {name: "upgrade_energy_storage", meta: 0});
Item.registerNameOverrideFunction(ItemID.upgradeEnergyStorage, function(item, name){
	return name + "§7\n" + Translation.translate("Increase energy storage by 10k EU");
});

IDRegistry.genItemID("upgradeRedstone");
Item.createItem("upgradeRedstone", "Redstone Signal Inverter Upgrade", {name: "upgrade_redstone_inv", meta: 0});

IDRegistry.genItemID("upgradeEjector");
Item.createItem("upgradeEjector", "Ejector Upgrade", {name: "upgrade_ejector", meta: 0});
Item.registerNameOverrideFunction(ItemID.upgradeEjector, function(item, name){
	name += "§7\n" + Translation.translate("Automatically output to\nthe %s side").replace("%s", ItemName.getSideName(item.data-1));
	return name;
});
Item.registerIconOverrideFunction(ItemID.upgradeEjector, function(item, name){
	return {name: "upgrade_ejector", meta: item.data}
});

IDRegistry.genItemID("upgradePulling");
Item.createItem("upgradePulling", "Pulling Upgrade", {name: "upgrade_pulling", meta: 0});
Item.registerNameOverrideFunction(ItemID.upgradePulling, function(item, name){
	name += "§7\n" + Translation.translate("Automatically input from\nthe %s side").replace("%s", ItemName.getSideName(item.data-1));
	return name;
});
Item.registerIconOverrideFunction(ItemID.upgradePulling, function(item, name){
	return {name: "upgrade_pulling", meta: item.data}
});

IDRegistry.genItemID("upgradeFluidEjector");
Item.createItem("upgradeFluidEjector", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 0});
Item.registerNameOverrideFunction(ItemID.upgradeFluidEjector, function(item, name){
	name += "§7\n" + Translation.translate("Automatically output to\nthe %s side").replace("%s", ItemName.getSideName(item.data-1));
	return name;
});
Item.registerIconOverrideFunction(ItemID.upgradeFluidEjector, function(item, name){
	return {name: "upgrade_fluid_ejector", meta: item.data}
});

IDRegistry.genItemID("upgradeFluidPulling");
Item.createItem("upgradeFluidPulling", "Fluid Pulling Upgrade", {name: "upgrade_fluid_pulling", meta: 0});
Item.registerNameOverrideFunction(ItemID.upgradeFluidPulling, function(item, name){
	name += "§7\n" + Translation.translate("Automatically input from\nthe %s side").replace("%s", ItemName.getSideName(item.data-1));
	return name;
});
Item.registerIconOverrideFunction(ItemID.upgradeFluidPulling, function(item, name){
	return {name: "upgrade_fluid_pulling", meta: item.data}
});

IDRegistry.genItemID("upgradeMFSU");
Item.createItem("upgradeMFSU", "MFSU Upgrade Kit", {name: "mfsu_upgrade", meta: 0});

Item.addCreativeGroup("ic2_upgrade", Translation.translate("Machine Upgrades"), [
	ItemID.upgradeOverclocker,
	ItemID.upgradeTransformer,
	ItemID.upgradeEnergyStorage,
	ItemID.upgradeRedstone,
	ItemID.upgradeEjector,
	ItemID.upgradePulling,
	ItemID.upgradeFluidEjector,
	ItemID.upgradeFluidPulling,
	ItemID.upgradeMFSU
]);


Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: ItemID.upgradeOverclocker, count: 1, data: 0}, [
		"aaa",
		"x#x",
	], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', ItemID.coolantCell, 1]);

	Recipes.addShaped({id: ItemID.upgradeOverclocker, count: 3, data: 0}, [
		"aaa",
		"x#x",
	], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', ItemID.coolantCell3, 1]);
	
	Recipes.addShaped({id: ItemID.upgradeOverclocker, count: 6, data: 0}, [
		"aaa",
		"x#x",
	], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', ItemID.coolantCell6, 1]);
	
	Recipes.addShaped({id: ItemID.upgradeTransformer, count: 1, data: 0}, [
		"aaa",
		"x#x",
		"aca"
	], ['#', BlockID.transformerMV, 0, 'x', ItemID.cableGold2, -1, 'a', 20, -1, 'c', ItemID.circuitBasic, -1]);
	
	Recipes.addShaped({id: ItemID.upgradeEnergyStorage, count: 1, data: 0}, [
		"aaa",
		"x#x",
		"aca"
	], ['#', ItemID.storageBattery, -1, 'x', ItemID.cableCopper1, -1, 'a', 5, -1, 'c', ItemID.circuitBasic, -1]);
	
	Recipes.addShaped({id: ItemID.upgradeRedstone, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x",
	], ['x', ItemID.plateTin, -1, '#', 69, -1]);
	
	Recipes.addShaped({id: ItemID.upgradeEjector, count: 1, data: 0}, [
		"aba",
		"x#x",
	], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', 33, -1, 'b', 410, 0]);
	
	Recipes.addShaped({id: ItemID.upgradePulling, count: 1, data: 0}, [
		"aba",
		"x#x",
	], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', 29, -1, 'b', 410, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeFluidEjector, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x",
	], ['x', ItemID.plateTin, -1, '#', ItemID.electricMotor, -1]);
	
	Recipes.addShaped({id: ItemID.upgradeFluidPulling, count: 1, data: 0}, [
		"xcx",
		" # ",
		"x x",
	], ['x', ItemID.plateTin, -1, '#', ItemID.electricMotor, -1, 'c', ItemID.treetap, 0]);
	
	Recipes.addShaped({id: ItemID.upgradeMFSU, count: 1, data: 0}, [
		"aca",
		"axa",
		"aba"
	], ['b', ItemID.wrenchBronze, 0, 'a', ItemID.storageLapotronCrystal, -1, 'x', BlockID.machineBlockAdvanced, 0, 'c', ItemID.circuitAdvanced, -1]);
});


UpgradeAPI.registerUpgrade(ItemID.upgradeOverclocker, "overclocker", function(item, machine, container, data){
	if(data.work_time){
		data.energy_consumption = Math.round(data.energy_consumption * Math.pow(1.6, item.count));
		data.work_time = Math.round(data.work_time * Math.pow(0.7, item.count));
	}
});

UpgradeAPI.registerUpgrade(ItemID.upgradeTransformer, "transformer", function(item, machine, container, data){
	var tier = data.power_tier + item.count
	if(tier > 14) tier = 14;
	data.power_tier = tier;
});

UpgradeAPI.registerUpgrade(ItemID.upgradeEnergyStorage, "energyStorage", function(item, machine, container, data){
	data.energy_storage += 10000 * item.count;
});

UpgradeAPI.registerUpgrade(ItemID.upgradeRedstone, "redstone", function(item, machine, container, data){
	data.isHeating = !data.isHeating;
});

UpgradeAPI.registerUpgrade(ItemID.upgradeEjector, "itemEjector", function(item, machine, container, data){
	var items = [];
	var slots = machine.getTransportSlots().output;
	for(var i in slots){
		var slot = container.getSlot(slots[i]);
		if(slot.id) items.push(slot);
	}
	if(items.length){
		var containers = StorageInterface.getNearestContainers(machine, item.data-1);
		StorageInterface.putItems(items, containers);
	}
});

UpgradeAPI.registerUpgrade(ItemID.upgradePulling, "itemPulling", function(item, machine, container, data){
	if(World.getThreadTime()%20 == 0){
		var containers = StorageInterface.getNearestContainers(machine, item.data-1);
		for(var side in containers){
			StorageInterface.extractItemsFromContainer(machine, containers[side], parseInt(side));
		}
	}
});

UpgradeAPI.registerUpgrade(ItemID.upgradeFluidEjector, "fluidEjector", function(item, machine, container, data){
	var input = StorageInterface.getNearestLiquidStorages(machine, item.data-1);
	for(var side in input){
		var liquid = machine.interface.getLiquidStored("output", side);
		if(liquid){
			StorageInterface.transportLiquid(liquid, 0.25, machine, input[side], parseInt(side));
		}
	}
});

UpgradeAPI.registerUpgrade(ItemID.upgradeFluidPulling, "fluidPulling", function(item, machine, container, data){
	var output = StorageInterface.getNearestLiquidStorages(machine, item.data-1);
	for(var side in output){
		var liquid = machine.interface.getLiquidStored("input", side);
		StorageInterface.extractLiquid(liquid, 0.25, machine, output[side], parseInt(side));
	}
});


Item.registerUseFunction("upgradeMFSU", function(coords, item, block){
	if(block.id == BlockID.storageMFE){
		var tile = World.getTileEntity(coords.x ,coords.y, coords.z);
		var data = tile.data;
		tile.selfDestroy();
		World.setBlock(coords.x, coords.y, coords.z, BlockID.storageMFSU, 0);
		block = World.addTileEntity(coords.x, coords.y, coords.z);
		block.data = data;
		TileRenderer.mapAtCoords(coords.x, coords.y, coords.z, BlockID.storageMFSU, data.meta);
		Player.decreaseCarriedItem(1);
	}
});

Item.registerUseFunction("upgradePulling", function(coords, item, block){
	if(item.data == 0){
		Player.setCarriedItem(ItemID.upgradePulling, item.count, coords.side+1);
	} else {
		Player.setCarriedItem(ItemID.upgradePulling, item.count);
	}
});

Item.registerUseFunction("upgradeEjector", function(coords, item, block){
	if(item.data == 0){
		Player.setCarriedItem(ItemID.upgradeEjector, item.count, coords.side+1);
	} else {
		Player.setCarriedItem(ItemID.upgradeEjector, item.count);
	}
});

Item.registerUseFunction("upgradeFluidEjector", function(coords, item, block){
	if(item.data == 0){
		Player.setCarriedItem(ItemID.upgradeFluidEjector, item.count, coords.side+1);
	} else {
		Player.setCarriedItem(ItemID.upgradeFluidEjector, item.count);
	}
});

Item.registerUseFunction("upgradeFluidPulling", function(coords, item, block){
	if(item.data == 0){
		Player.setCarriedItem(ItemID.upgradeFluidPulling, item.count, coords.side+1);
	} else {
		Player.setCarriedItem(ItemID.upgradeFluidPulling, item.count, 0);
	}
});




// file: items/reactor/fuel_rod.js

IDRegistry.genItemID("fuelRod");
Item.createItem("fuelRod", "Fuel Rod (Empty)", {name: "fuel_rod", meta: 0});

IDRegistry.genItemID("fuelRodUranium");
IDRegistry.genItemID("fuelRodUranium2");
IDRegistry.genItemID("fuelRodUranium4");
Item.createItem("fuelRodUranium", "Fuel Rod (Uranium)", {name: "fuel_rod_uranium", meta: 0});
Item.createItem("fuelRodUranium2", "Dual Fuel Rod (Uranium)", {name: "fuel_rod_uranium", meta: 1}, {stack: 32});
Item.createItem("fuelRodUranium4", "Quad Fuel Rod (Uranium)", {name: "fuel_rod_uranium", meta: 2}, {stack: 16});
ReactorAPI.registerComponent(ItemID.fuelRodUranium, new ReactorAPI.fuelRod(1, 20000, ItemID.fuelRodDepletedUranium));
ReactorAPI.registerComponent(ItemID.fuelRodUranium2, new ReactorAPI.fuelRod(2, 20000, ItemID.fuelRodDepletedUranium2));
ReactorAPI.registerComponent(ItemID.fuelRodUranium4, new ReactorAPI.fuelRod(4, 20000, ItemID.fuelRodDepletedUranium4));
RadiationAPI.regRadioactiveItem(ItemID.fuelRodUranium, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodUranium2, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodUranium4, 10);

IDRegistry.genItemID("fuelRodMOX");
IDRegistry.genItemID("fuelRodMOX2");
IDRegistry.genItemID("fuelRodMOX4");
Item.createItem("fuelRodMOX", "Fuel Rod (MOX)", {name: "fuel_rod_mox", meta: 0});
Item.createItem("fuelRodMOX2", "Dual Fuel Rod (MOX)", {name: "fuel_rod_mox", meta: 1}, {stack: 32});
Item.createItem("fuelRodMOX4", "Quad Fuel Rod (MOX)", {name: "fuel_rod_mox", meta: 2}, {stack: 16});
ReactorAPI.registerComponent(ItemID.fuelRodMOX, new ReactorAPI.fuelRodMOX(1, 10000, ItemID.fuelRodDepletedMOX));
ReactorAPI.registerComponent(ItemID.fuelRodMOX2, new ReactorAPI.fuelRodMOX(2, 10000, ItemID.fuelRodDepletedMOX2));
ReactorAPI.registerComponent(ItemID.fuelRodMOX4, new ReactorAPI.fuelRodMOX(4, 10000, ItemID.fuelRodDepletedMOX4));
RadiationAPI.regRadioactiveItem(ItemID.fuelRodMOX, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodMOX2, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodMOX4, 10);

IDRegistry.genItemID("fuelRodDepletedUranium");
IDRegistry.genItemID("fuelRodDepletedUranium2");
IDRegistry.genItemID("fuelRodDepletedUranium4");
Item.createItem("fuelRodDepletedUranium", "Fuel Rod (Depleted Uranium)", {name: "fuel_rod_depleted_uranium", meta: 0});
Item.createItem("fuelRodDepletedUranium2", "Dual Fuel Rod (Depleted Uranium)", {name: "fuel_rod_depleted_uranium", meta: 1}, {stack: 32});
Item.createItem("fuelRodDepletedUranium4", "Quad Fuel Rod (Depleted Uranium)", {name: "fuel_rod_depleted_uranium", meta: 2}, {stack: 16});
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedUranium, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedUranium2, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedUranium4, 10);

IDRegistry.genItemID("fuelRodDepletedMOX");
IDRegistry.genItemID("fuelRodDepletedMOX2");
IDRegistry.genItemID("fuelRodDepletedMOX4");
Item.createItem("fuelRodDepletedMOX", "Fuel Rod (Depleted MOX)", {name: "fuel_rod_depleted_mox", meta: 0});
Item.createItem("fuelRodDepletedMOX2", "Dual Fuel Rod (Depleted MOX)", {name: "fuel_rod_depleted_mox", meta: 1}, {stack: 32});
Item.createItem("fuelRodDepletedMOX4", "Quad Fuel Rod (Depleted MOX)", {name: "fuel_rod_depleted_mox", meta: 2}, {stack: 16});
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedMOX, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedMOX2, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedMOX4, 10);

Item.addCreativeGroup("ic2_fuelRod", Translation.translate("Nuclear Fuel Rods"), [
	ItemID.fuelRod,
	ItemID.fuelRodUranium,
	ItemID.fuelRodUranium2,
	ItemID.fuelRodUranium4,
	ItemID.fuelRodMOX,
	ItemID.fuelRodMOX2,
	ItemID.fuelRodMOX4,
	ItemID.fuelRodDepletedUranium,
	ItemID.fuelRodDepletedUranium2,
	ItemID.fuelRodDepletedUranium4,
	ItemID.fuelRodDepletedMOX,
	ItemID.fuelRodDepletedMOX2,
	ItemID.fuelRodDepletedMOX4
]);

Recipes.addShaped({id: ItemID.fuelRodUranium2, count: 1, data: 0}, [
	"fxf"
], ['x', ItemID.plateIron, 0, 'f', ItemID.fuelRodUranium, 0]);

Recipes.addShaped({id: ItemID.fuelRodUranium4, count: 1, data: 0}, [
	" f ",
	"bab",
	" f "
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodUranium2, 0]);

Recipes.addShaped({id: ItemID.fuelRodUranium4, count: 1, data: 0}, [
	"faf",
	"bab",
	"faf"
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodUranium, 0]);

Recipes.addShaped({id: ItemID.fuelRodMOX2, count: 1, data: 0}, [
	"fxf"
], ['x', ItemID.plateIron, 0, 'f', ItemID.fuelRodMOX, 0]);

Recipes.addShaped({id: ItemID.fuelRodMOX4, count: 1, data: 0}, [
	" f ",
	"bab",
	" f "
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodMOX2, 0]);

Recipes.addShaped({id: ItemID.fuelRodMOX4, count: 1, data: 0}, [
	"faf",
	"bab",
	"faf"
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodMOX, 0]);




// file: items/reactor/plating.js

IDRegistry.genItemID("reactorPlating");
IDRegistry.genItemID("reactorPlatingContainment");
IDRegistry.genItemID("reactorPlatingHeat");
Item.createItem("reactorPlating", "Reactor Plating", {name: "reactor_plating", meta: 0});
Item.createItem("reactorPlatingContainment", "Containment Reactor Plating", {name: "reactor_plating", meta: 1});
Item.createItem("reactorPlatingHeat", "Heat-Capacity Reactor Plating", {name: "reactor_plating", meta: 2});
ReactorAPI.registerComponent(ItemID.reactorPlating, new ReactorAPI.plating(1000, 0.95));
ReactorAPI.registerComponent(ItemID.reactorPlatingContainment, new ReactorAPI.plating(500, 0.9));
ReactorAPI.registerComponent(ItemID.reactorPlatingHeat, new ReactorAPI.plating(2000, 0.99));

Item.addCreativeGroup("ic2_reactorPlating", Translation.translate("Reactor Platings"), [
	ItemID.reactorPlating,
	ItemID.reactorPlatingContainment,
    ItemID.reactorPlatingHeat
]);

Recipes.addShapeless({id: ItemID.reactorPlating, count: 1, data: 0}, [{id: ItemID.plateAlloy, data: 0}, {id: ItemID.plateLead, data: 0}]);

Recipes.addShapeless({id: ItemID.reactorPlatingContainment, count: 1, data: 0}, [{id: ItemID.reactorPlating, data: 0}, {id: ItemID.plateAlloy, data: 0}, {id: ItemID.plateAlloy, data: 0}]);

Recipes.addShaped({id: ItemID.reactorPlatingHeat, count: 1, data: 0}, [
	"aaa",
	"axa",
	"aaa"
], ['x', ItemID.reactorPlating, 0, 'a', ItemID.plateCopper, 0]);




// file: items/reactor/reflector.js

IDRegistry.genItemID("neutronReflector");
IDRegistry.genItemID("neutronReflectorThick");
IDRegistry.genItemID("neutronReflectorIridium");
Item.createItem("neutronReflector", "Neutron Reflector", {name: "neutron_reflector", meta: 0});
Item.createItem("neutronReflectorThick", "Thick Neutron Reflector", {name: "neutron_reflector", meta: 1});
Item.createItem("neutronReflectorIridium", "Iridium Neutron Reflector", {name: "neutron_reflector", meta: 2});
ReactorAPI.registerComponent(ItemID.neutronReflector, new ReactorAPI.reflector(30000));
ReactorAPI.registerComponent(ItemID.neutronReflectorThick, new ReactorAPI.reflector(120000));
ReactorAPI.registerComponent(ItemID.neutronReflectorIridium, new ReactorAPI.reflectorIridium());

Item.addCreativeGroup("ic2_reactorNeutronReflector", Translation.translate("Neutron Reflectors"), [
    ItemID.neutronReflector,
    ItemID.neutronReflectorThick,
    ItemID.neutronReflectorIridium
]);

Recipes.addShaped({id: ItemID.neutronReflector, count: 1, data: 0}, [
	"bab",
	"axa",
	"bab"
], ["x", ItemID.plateCopper, 0, 'a', ItemID.dustCoal, 0, 'b', ItemID.dustTin, 0]);

Recipes.addShaped({id: ItemID.neutronReflectorThick, count: 1, data: 0}, [
	"axa",
	"xax",
	"axa"
], ["x", ItemID.neutronReflector, 0, 'a', ItemID.plateCopper, 0]);

Recipes.addShaped({id: ItemID.neutronReflectorIridium, count: 1, data: 0}, [
	"aaa",
	"bxb",
	"aaa"
], ["x", ItemID.plateReinforcedIridium, 0, 'a', ItemID.neutronReflectorThick, 0, 'b', ItemID.densePlateCopper, 0]);

Recipes.addShaped({id: ItemID.neutronReflectorIridium, count: 1, data: 0}, [
	"aba",
	"axa",
	"aba"
], ["x", ItemID.plateReinforcedIridium, 0, 'a', ItemID.neutronReflectorThick, 0, 'b', ItemID.plateCopper, 0]);




// file: items/reactor/coolant.js

IDRegistry.genItemID("coolantCell");
IDRegistry.genItemID("coolantCell3");
IDRegistry.genItemID("coolantCell6");
Item.createItem("coolantCell", "10k Coolant Cell", {name: "coolant_cell", meta: 0}, {isTech: true});
Item.createItem("coolantCell3", "30k Coolant Cell", {name: "coolant_cell", meta: 1}, {isTech: true});
Item.createItem("coolantCell6", "60k Coolant Cell", {name: "coolant_cell", meta: 2}, {isTech: true});
ReactorAPI.registerComponent(ItemID.coolantCell, new ReactorAPI.heatStorage(10000));
ReactorAPI.registerComponent(ItemID.coolantCell3, new ReactorAPI.heatStorage(30000));
ReactorAPI.registerComponent(ItemID.coolantCell6, new ReactorAPI.heatStorage(60000));

Item.addCreativeGroup("ic2_reactorCoolant", Translation.translate("Reactor Coolants"), [
	ItemID.coolantCell,
	ItemID.coolantCell3,
	ItemID.coolantCell6
]);

Recipes.addShaped({id: ItemID.coolantCell, count: 1, data: 1}, [
	" a ",
	"axa",
	" a ",
], ['x', 373, 0, 'a', ItemID.plateTin, 0]);

Recipes.addShaped({id: ItemID.coolantCell, count: 1, data: 1}, [
	" a ",
	"axa",
	" a ",
], ['x', ItemID.cellCoolant, 0, 'a', ItemID.plateTin, 0]);

Recipes.addShaped({id: ItemID.coolantCell3, count: 1, data: 1}, [
	"aaa",
	"xxx",
	"aaa",
], ['x', ItemID.coolantCell, 1, 'a', ItemID.plateTin, 0]);

Recipes.addShaped({id: ItemID.coolantCell3, count: 1, data: 1}, [
	"axa",
	"axa",
	"axa",
], ['x', ItemID.coolantCell, 1, 'a', ItemID.plateTin, 0]);

Recipes.addShaped({id: ItemID.coolantCell6, count: 1, data: 1}, [
	"aaa",
	"xbx",
	"aaa",
], ['x', ItemID.coolantCell3, 1, 'a', ItemID.plateTin, 0, 'b', ItemID.plateIron, 0]);

Recipes.addShaped({id: ItemID.coolantCell6, count: 1, data: 1}, [
	"axa",
	"aba",
	"axa",
], ['x', ItemID.coolantCell3, 1, 'a', ItemID.plateTin, 0, 'b', ItemID.plateIron, 0]);




// file: items/reactor/heat_exchanger.js

IDRegistry.genItemID("heatExchanger");
Item.createItem("heatExchanger", "Heat Exchanger", {name: "heat_exchanger", meta: 0}, {isTech: true});

IDRegistry.genItemID("heatExchangerReactor");
Item.createItem("heatExchangerReactor", "Reactor Heat Exchanger", {name: "heat_exchanger", meta: 1}, {isTech: true});

IDRegistry.genItemID("heatExchangerComponent");
Item.createItem("heatExchangerComponent", "Component Heat Exchanger", {name: "heat_exchanger", meta: 2}, {isTech: true});

IDRegistry.genItemID("heatExchangerAdv");
Item.createItem("heatExchangerAdv", "Advanced Heat Exchanger", {name: "heat_exchanger", meta: 3}, {isTech: true});

ReactorAPI.registerComponent(ItemID.heatExchanger, new ReactorAPI.heatExchanger(2500, 12, 4));
ReactorAPI.registerComponent(ItemID.heatExchangerReactor, new ReactorAPI.heatExchanger(5000, 0, 72));
ReactorAPI.registerComponent(ItemID.heatExchangerComponent, new ReactorAPI.heatExchanger(5000, 36, 0));
ReactorAPI.registerComponent(ItemID.heatExchangerAdv, new ReactorAPI.heatExchanger(10000, 24, 8));

Item.addCreativeGroup("ic2_reactorHeatExchanger", Translation.translate("Reactor Heat Exchangers"), [
	ItemID.heatExchanger,
	ItemID.heatExchangerReactor,
	ItemID.heatExchangerComponent,
	ItemID.heatExchangerAdv
]);

Recipes.addShaped({id: ItemID.heatExchanger, count: 1, data: 1}, [
	"aca",
	"bab",
	"aba"
], ['c', ItemID.circuitBasic, 0, 'a', ItemID.plateCopper, 0, 'b', ItemID.plateTin, 0]);

Recipes.addShaped({id: ItemID.heatExchangerReactor, count: 1, data: 1}, [
	"aaa",
	"axa",
	"aaa"
], ['x', ItemID.heatExchanger, 1, 'a', ItemID.plateCopper, 0]);

Recipes.addShaped({id: ItemID.heatExchangerComponent, count: 1, data: 1}, [
	" a ",
	"axa",
	" a "
], ['x', ItemID.heatExchanger, 1, 'a', ItemID.plateGold, 0]);

Recipes.addShaped({id: ItemID.heatExchangerAdv, count: 1, data: 1}, [
	"pcp",
	"xdx",
	"pcp"
], ['x', ItemID.heatExchanger, 1, 'c', ItemID.circuitBasic, 0, 'd', ItemID.densePlateCopper, 0, 'p', ItemID.plateLapis, 0]);




// file: items/reactor/heat_vent.js

IDRegistry.genItemID("heatVent");
Item.createItem("heatVent", "Heat Vent", {name: "heat_vent", meta: 0}, {isTech: true});

IDRegistry.genItemID("heatVentReactor");
Item.createItem("heatVentReactor", "Reactor Heat Vent", {name: "heat_vent", meta: 1}, {isTech: true});

IDRegistry.genItemID("heatVentComponent");
Item.createItem("heatVentComponent", "Component Heat Vent", {name: "heat_vent", meta: 2});

IDRegistry.genItemID("heatVentAdv");
Item.createItem("heatVentAdv", "Advanced Heat Vent", {name: "heat_vent", meta: 3}, {isTech: true});

IDRegistry.genItemID("heatVentOverclocked");
Item.createItem("heatVentOverclocked", "Overclocked Heat Vent", {name: "heat_vent", meta: 4}, {isTech: true});

ReactorAPI.registerComponent(ItemID.heatVent, new ReactorAPI.heatVent(1000, 6, 0));
ReactorAPI.registerComponent(ItemID.heatVentReactor, new ReactorAPI.heatVent(1000, 5, 5));
ReactorAPI.registerComponent(ItemID.heatVentComponent, new ReactorAPI.heatVentSpread(4));
ReactorAPI.registerComponent(ItemID.heatVentAdv, new ReactorAPI.heatVent(1000, 12, 0));
ReactorAPI.registerComponent(ItemID.heatVentOverclocked, new ReactorAPI.heatVent(1000, 20, 36));

Item.addCreativeGroup("ic2_reactorHeatVent", Translation.translate("Reactor Heat Vents"), [
	ItemID.heatVent,
	ItemID.heatVentReactor,
	ItemID.heatVentComponent,
    ItemID.heatVentAdv,
	ItemID.heatVentOverclocked
]);

Recipes.addShaped({id: ItemID.heatVent, count: 1, data: 1}, [
	"bab",
	"axa",
	"bab"
], ['x', ItemID.electricMotor, 0, 'a', ItemID.plateIron, 0, 'b', 101, -1]);

Recipes.addShaped({id: ItemID.heatVentReactor, count: 1, data: 1}, [
	"a",
	"x",
	"a"
], ['x', ItemID.heatVent, 1, 'a', ItemID.densePlateCopper, 0]);

Recipes.addShaped({id: ItemID.heatVentComponent, count: 1, data: 0}, [
	"bab",
	"axa",
	"bab"
], ['x', ItemID.heatVent, 1, 'a', ItemID.plateTin, 0, 'b', 101, -1]);

Recipes.addShaped({id: ItemID.heatVentAdv, count: 1, data: 1}, [
	"bxb",
	"bdb",
	"bxb"
], ['x', ItemID.heatVent, 1, 'd', 264, 0, 'b', 101, -1]);

Recipes.addShaped({id: ItemID.heatVentOverclocked, count: 1, data: 1}, [
	"a",
	'x',
	"a"
], ['x', ItemID.heatVentReactor, 1, 'a', ItemID.plateGold, 0]);




// file: items/reactor/condensator.js

IDRegistry.genItemID("rshCondensator");
IDRegistry.genItemID("lzhCondensator");
Item.createItem("rshCondensator", "RSH-Condensator", {name: "rsh_condensator"}, {isTech: true});
Item.createItem("lzhCondensator", "LZH-Condensator", {name: "lzh_condensator"}, {isTech: true});
ReactorAPI.registerComponent(ItemID.rshCondensator, new ReactorAPI.condensator(20000));
ReactorAPI.registerComponent(ItemID.lzhCondensator, new ReactorAPI.condensator(100000));

Recipes.addShaped({id: ItemID.rshCondensator, count: 1, data: 1}, [
	"rrr",
	"rar",
	"rxr"
], ['a', ItemID.heatVent, 1, 'x', ItemID.heatExchanger, 1, 'r', 331, 0]);

Recipes.addShaped({id: ItemID.lzhCondensator, count: 1, data: 1}, [
	"rar",
	"cbc",
	"rxr"
], ['a', ItemID.heatVentReactor, 1, 'b', 22, -1, 'c', ItemID.rshCondensator, -1, 'x', ItemID.heatExchangerReactor, 1, 'r', 331, 0]);

Recipes.addShapeless({id: ItemID.rshCondensator, count: 1, data: 1}, [{id: ItemID.rshCondensator, data: -1}, {id: 331, data: 0}],
function(api, field, result){
	var index = 0;
	var canBeRepaired = false;
	for (var i in field){
		var slot = field[i];
		if (slot.id == ItemID.rshCondensator){
			if(slot.data <= 1) break;
			canBeRepaired = true;
			slot.data = Math.max(parseInt(slot.data - 10000 / slot.count), 1);
		} else if(slot.id != 0){
			index = i;
		}
	}
	if(canBeRepaired){
		api.decreaseFieldSlot(index);
	}
	result.id = result.count = 0;
});

Recipes.addShapeless({id: ItemID.lzhCondensator, count: 1, data: 1}, [{id: ItemID.lzhCondensator, data: -1}, {id: 331, data: 0}],
function(api, field, result){
	var index = 0;
	var canBeRepaired = false;
	for (var i in field){
		var slot = field[i];
		if (slot.id == ItemID.lzhCondensator){
			if(slot.data <= 1) break;
			canBeRepaired = true;
			slot.data = Math.max(parseInt(slot.data - 10000 / slot.count), 1);
		} else if(slot.id != 0){
			index = i;
		}
	}
	if(canBeRepaired){
		api.decreaseFieldSlot(index);
	}
	result.id = result.count = 0;
});

Recipes.addShapeless({id: ItemID.lzhCondensator, count: 1, data: 1}, [{id: ItemID.lzhCondensator, data: -1}, {id: 351, data: 4}],
function(api, field, result){
	var index = 0;
	var canBeRepaired = false;
	for (var i in field){
		var slot = field[i];
		if (slot.id == ItemID.lzhCondensator){
			if(slot.data <= 1) break;
			canBeRepaired = true;
			slot.data = Math.max(parseInt(slot.data - 40000 / slot.count), 1);
		} else if(slot.id != 0){
			index = i;
		}
	}
	if(canBeRepaired){
		api.decreaseFieldSlot(index);
	}
	result.id = result.count = 0;
});




// file: items/armor/hazmat.js

IDRegistry.genItemID("hazmatHelmet");
IDRegistry.genItemID("hazmatChestplate");
IDRegistry.genItemID("hazmatLeggings");
IDRegistry.genItemID("rubberBoots");

Item.createArmorItem("hazmatHelmet", "Scuba Helmet", {name: "hazmat_helmet"}, {type: "helmet", armor: 1, durability: 64, texture: "armor/hazmat_1.png"});
Item.createArmorItem("hazmatChestplate", "Hazmat Suit", {name: "hazmat_chestplate"}, {type: "chestplate", armor: 1, durability: 64, texture: "armor/hazmat_1.png"});
Item.createArmorItem("hazmatLeggings", "Hazmat Suit Leggings", {name: "hazmat_leggins"}, {type: "leggings", armor: 1, durability: 64, texture: "armor/hazmat_2.png"});
Item.createArmorItem("rubberBoots", "Rubber Boots", {name: "rubber_boots"}, {type: "boots", armor: 1, durability: 64, texture: "armor/rubber_1.png"});

RadiationAPI.registerHazmatArmor(ItemID.hazmatHelmet);
RadiationAPI.registerHazmatArmor(ItemID.hazmatChestplate);
RadiationAPI.registerHazmatArmor(ItemID.hazmatLeggings);
RadiationAPI.registerHazmatArmor(ItemID.rubberBoots);

Recipes.addShaped({id: ItemID.hazmatHelmet, count: 1, data: 0}, [
	" d ",
	"xax",
	"x#x"
], ['x', ItemID.rubber, 0, 'a', 20, -1, 'd', 351, 14, '#', 101, -1]);

Recipes.addShaped({id: ItemID.hazmatChestplate, count: 1, data: 0}, [
	"x x",
	"xdx",
	"xdx"
], ['x', ItemID.rubber, 0, 'd', 351, 14]);

Recipes.addShaped({id: ItemID.hazmatLeggings, count: 1, data: 0}, [
	"xdx",
	"x x",
	"x x"
], ['x', ItemID.rubber, 0, 'd', 351, 14]);

Recipes.addShaped({id: ItemID.rubberBoots, count: 1, data: 0}, [
	"x x",
	"x x",
	"xwx"
], ['x', ItemID.rubber, 0, 'w', 35, -1]);


var RUBBER_ARMOR_FUNC = {
	hurt: function(params, item, index, maxDamage){
		var type = params.type;
		if(type==2 || type==3 || type==11){
			item.data += params.damage;
			if(item.data >= maxDamage){
				item.id = item.count = 0;
			}
			return true;
		}
		if(type==9 && index==0){
			for(var i = 0; i < 36; i++){
				var slot = Player.getInventorySlot(i);
				if(slot.id==ItemID.cellAir){
					Game.prevent();
					Entity.addEffect(player, MobEffect.waterBreathing, 1, 2);
					Player.setInventorySlot(i, slot.count > 1 ? slot.id : 0, slot.count - 1, 0);
					Player.addItemToInventory(ItemID.cellEmpty, 1, 0);
					break;
				}
			}
		}
		if(type==5 && index==3){
			var Dp = Math.floor(params.damage/8);
			var Db = Math.floor(params.damage*7/16);
			if(Dp < 1){
				Game.prevent();
			} else {
				Entity.setHealth(player, Entity.getHealth(player) + params.damage - Dp);
			}
			item.data += Db;
			if(item.data >= maxDamage){
				item.id = item.count = 0;
			}
			return true;
		}
		return false;
	},
	tick: function(slot, index, maxDamage){
		if(index==0 && Player.getArmorSlot(1).id==ItemID.hazmatChestplate && Player.getArmorSlot(2).id==ItemID.hazmatLeggings && Player.getArmorSlot(3).id==ItemID.rubberBoots){
			if(RadiationAPI.playerRad <= 0){
				Entity.clearEffect(player, MobEffect.poison);
			}
			Entity.clearEffect(player, MobEffect.wither);
		}
		return false;
	}
};

Armor.registerFuncs("hazmatHelmet", RUBBER_ARMOR_FUNC);
Armor.registerFuncs("hazmatChestplate", RUBBER_ARMOR_FUNC);
Armor.registerFuncs("hazmatLeggings", RUBBER_ARMOR_FUNC);
Armor.registerFuncs("rubberBoots", RUBBER_ARMOR_FUNC);




// file: items/armor/bronze.js

IDRegistry.genItemID("bronzeHelmet");
IDRegistry.genItemID("bronzeChestplate");
IDRegistry.genItemID("bronzeLeggings");
IDRegistry.genItemID("bronzeBoots");

Item.createArmorItem("bronzeHelmet", "Bronze Helmet", {name: "bronze_helmet"}, {type: "helmet", armor: 2, durability: 149, texture: "armor/bronze_1.png"});
Item.createArmorItem("bronzeChestplate", "Bronze Chestplate", {name: "bronze_chestplate"}, {type: "chestplate", armor: 6, durability: 216, texture: "armor/bronze_1.png"});
Item.createArmorItem("bronzeLeggings", "Bronze Leggings", {name: "bronze_leggings"}, {type: "leggings", armor: 5, durability: 203, texture: "armor/bronze_2.png"});
Item.createArmorItem("bronzeBoots", "Bronze Boots", {name: "bronze_boots"}, {type: "boots", armor: 2, durability: 176, texture: "armor/bronze_1.png"});

Item.setEnchantType(ItemID.bronzeHelmet, EnchantType.helmet, 14);
Item.setEnchantType(ItemID.bronzeChestplate, EnchantType.chestplate, 14);
Item.setEnchantType(ItemID.bronzeLeggings, EnchantType.leggings, 14);
Item.setEnchantType(ItemID.bronzeBoots, EnchantType.boots, 14);

Item.addRepairItemIds(ItemID.bronzeHelmet, [ItemID.ingotBronze]);
Item.addRepairItemIds(ItemID.bronzeChestplate, [ItemID.ingotBronze]);
Item.addRepairItemIds(ItemID.bronzeLeggings, [ItemID.ingotBronze]);
Item.addRepairItemIds(ItemID.bronzeBoots, [ItemID.ingotBronze]);

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

Item.setEnchantType(ItemID.compositeHelmet, EnchantType.helmet, 7);
Item.setEnchantType(ItemID.compositeChestplate, EnchantType.chestplate, 7);
Item.setEnchantType(ItemID.compositeLeggings, EnchantType.leggings, 7);
Item.setEnchantType(ItemID.compositeBoots, EnchantType.boots, 7);

Item.addRepairItemIds(ItemID.compositeHelmet, [ItemID.plateAlloy]);
Item.addRepairItemIds(ItemID.compositeChestplate, [ItemID.plateAlloy]);
Item.addRepairItemIds(ItemID.compositeLeggings, [ItemID.plateAlloy]);
Item.addRepairItemIds(ItemID.compositeBoots, [ItemID.plateAlloy]);

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




// file: items/armor/nightvision.js

IDRegistry.genItemID("nightvisionGoggles");
Item.createArmorItem("nightvisionGoggles", "Nightvision Goggles", {name: "nightvision"}, {type: "helmet", armor: 1, durability: 27, texture: "armor/nightvision_1.png", isTech: true});
ChargeItemRegistry.registerExtraItem(ItemID.nightvisionGoggles, "Eu", 100000, 256, 2, "armor", true, true);
Item.registerNameOverrideFunction(ItemID.nightvisionGoggles, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.nightvisionGoggles, count: 1, data: 27}, [
	"xbx",
	"aga",
	"rcr"
], ['a', BlockID.luminator, -1, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitAdvanced, 0, 'x', ItemID.heatExchangerAdv, 1, 'g', 20, 0,'r', ItemID.rubber, 0], ChargeItemRegistry.transferEnergy);

UIbuttons.setArmorButton(ItemID.nightvisionGoggles, "button_nightvision");

Armor.registerFuncs("nightvisionGoggles", {
	hurt: function(){
		return false;
	},
	tick: function(slot, index, maxDamage){
		var nightvision = slot.extra? slot.extra.getBoolean("nv") : false;
		var energyStored = ChargeItemRegistry.getEnergyStored(slot);
		if(nightvision && energyStored > 0){
			var coords = Player.getPosition();
			var time = World.getWorldTime()%24000;
			if(World.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000){
				Entity.addEffect(Player.get(), MobEffect.blindness, 1, 25);
				Entity.clearEffect(Player.get(), MobEffect.nightVision);
			} else {
				Entity.addEffect(Player.get(), MobEffect.nightVision, 1, 225);
			}
			if(World.getThreadTime()%20 == 0){
				ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - 20, 0));
				Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
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

Item.createArmorItem("nanoHelmet", "Nano Helmet", {name: "nano_helmet"}, {type: "helmet", armor: 4, durability: 27, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoChestplate", "Nano Bodyarmor", {name: "nano_chestplate"}, {type: "chestplate", armor: 8, durability: 27, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoLeggings", "Nano Leggings", {name: "nano_leggings"}, {type: "leggings", armor: 6, durability: 27, texture: "armor/nano_2.png", isTech: true});
Item.createArmorItem("nanoBoots", "Nano Boots", {name: "nano_boots"}, {type: "boots", armor: 4, durability: 27, texture: "armor/nano_1.png", isTech: true});

ChargeItemRegistry.registerExtraItem(ItemID.nanoHelmet, "Eu",1000000, 2048, 3, "armor", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.nanoChestplate, "Eu", 1000000, 2048, 3, "armor", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.nanoLeggings, "Eu", 1000000, 2048, 3, "armor", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.nanoBoots, "Eu", 1000000, 2048, 3, "armor", true, true);

ItemName.setRarity(ItemID.nanoHelmet, 1);
ItemName.setRarity(ItemID.nanoChestplate, 1);
ItemName.setRarity(ItemID.nanoLeggings, 1);
ItemName.setRarity(ItemID.nanoBoots, 1);

Item.registerNameOverrideFunction(ItemID.nanoHelmet, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.nanoChestplate, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.nanoLeggings, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.nanoBoots, ItemName.showItemStorage);


IDRegistry.genItemID("nanoHelmetUncharged");
IDRegistry.genItemID("nanoChestplateUncharged");
IDRegistry.genItemID("nanoLeggingsUncharged");
IDRegistry.genItemID("nanoBootsUncharged");

Item.createArmorItem("nanoHelmetUncharged", "Nano Helmet", {name: "nano_helmet"}, {type: "helmet", armor: 2, durability: 27, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoChestplateUncharged", "Nano Bodyarmor", {name: "nano_chestplate"}, {type: "chestplate", armor: 6, durability: 27, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoLeggingsUncharged", "Nano Leggings", {name: "nano_leggings"}, {type: "leggings", armor: 3, durability: 27, texture: "armor/nano_2.png", isTech: true});
Item.createArmorItem("nanoBootsUncharged", "Nano Boots", {name: "nano_boots"}, {type: "boots", armor: 2, durability: 27, texture: "armor/nano_1.png", isTech: true});

ChargeItemRegistry.registerExtraItem(ItemID.nanoHelmetUncharged, "Eu", 1000000, 2048, 3, "armor", true);
ChargeItemRegistry.registerExtraItem(ItemID.nanoChestplateUncharged, "Eu", 1000000, 2048, 3, "armor", true);
ChargeItemRegistry.registerExtraItem(ItemID.nanoLeggingsUncharged, "Eu", 1000000, 2048, 3, "armor", true);
ChargeItemRegistry.registerExtraItem(ItemID.nanoBootsUncharged, "Eu", 1000000, 2048, 3, "armor", true);

ItemName.setRarity(ItemID.nanoHelmetUncharged, 1);
ItemName.setRarity(ItemID.nanoChestplateUncharged, 1);
ItemName.setRarity(ItemID.nanoLeggingsUncharged, 1);
ItemName.setRarity(ItemID.nanoBootsUncharged, 1);

Item.registerNameOverrideFunction(ItemID.nanoHelmetUncharged, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.nanoChestplateUncharged, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.nanoLeggingsUncharged, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.nanoBootsUncharged, ItemName.showItemStorage);


Recipes.addShaped({id: ItemID.nanoHelmet, count: 1, data: 27}, [
	"x#x",
	"xax"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0, 'a', ItemID.nightvisionGoggles, -1], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.nanoChestplate, count: 1, data: 27}, [
	"x x",
	"x#x",
	"xxx"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.nanoLeggings, count: 1, data: 27}, [
	"x#x",
	"x x",
	"x x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.nanoBoots, count: 1, data: 27}, [
	"x x",
	"x#x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], ChargeItemRegistry.transferEnergy);


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

UIbuttons.setArmorButton(ItemID.nanoHelmet, "button_nightvision");

var NANO_ARMOR_FUNCS = {
	hurt: function(params, slot, index, maxDamage){
		var energyStored = ChargeItemRegistry.getEnergyStored(slot);
		var type = params.type;
		if(energyStored >= 2000){
			if(type==2 || type==3 || type==11){
				var energy = params.damage * 2000;
				ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - energy, 0));
				return true;
			}
			if(type==5 && index==3){
				var damage = 0;
				var vel = Player.getVelocity().y;
				var time = vel / -0.06;
				var height = 0.06 * time*time / 2;
				if(height < 22){
					if(height < 17){
						var damage = Math.floor(height) - 3;
					} else {
						var damage = Math.ceil(height)- 3;
					}
				}
				if(damage > 0 || height >= 22){
					params.damage = damage;
					damage = Math.min(Math.min(params.damage, 9), Math.floor((maxDamage - slot.data)/2000));
					if(params.damage > damage){
						Entity.setHealth(player, Entity.getHealth(player) + damage);
					} else {
						Game.prevent();
					}
					ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - damage * 2000, 0));
					return true;
				}
			}
		}
		return false;
	},
	
	tick: function(slot, index, maxDamage){
		var armor = MachineRecipeRegistry.getRecipeResult("nano-armor-charge", slot.id);
		var energyStored = ChargeItemRegistry.getEnergyStored(slot);
		if(energyStored < 2000){
			var newId = armor.uncharged;
		} else {
			var newId = armor.charged;
		}
		if(slot.id != newId){
			slot.id = newId;
			Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
		}
		
		if(index == 0 && energyStored > 0){
			var nightvision = slot.extra? slot.extra.getBoolean("nv") : false;
			if(nightvision){
				var coords = Player.getPosition();
				var time = World.getWorldTime()%24000;
				if(World.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000){
					Entity.addEffect(Player.get(), MobEffect.blindness, 1, 25);
					Entity.clearEffect(Player.get(), MobEffect.nightVision);
				} else {
					Entity.addEffect(Player.get(), MobEffect.nightVision, 1, 225);
				}
				Entity.addEffect(Player.get(), MobEffect.nightVision, 1, 225);
				if(World.getThreadTime()%20 == 0){
					ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - 20, 0));
					Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
				}
			}
		}
		return false;
	}
};

Armor.registerFuncs("nanoHelmet", NANO_ARMOR_FUNCS);
Armor.registerFuncs("nanoHelmetUncharged", NANO_ARMOR_FUNCS);
Armor.registerFuncs("nanoChestplate", NANO_ARMOR_FUNCS);
Armor.registerFuncs("nanoChestplateUncharged", NANO_ARMOR_FUNCS);
Armor.registerFuncs("nanoLeggings", NANO_ARMOR_FUNCS);
Armor.registerFuncs("nanoLeggingsUncharged", NANO_ARMOR_FUNCS);
Armor.registerFuncs("nanoBoots", NANO_ARMOR_FUNCS);
Armor.registerFuncs("nanoBootsUncharged", NANO_ARMOR_FUNCS);




// file: items/armor/quantum.js

IDRegistry.genItemID("quantumHelmet");
IDRegistry.genItemID("quantumChestplate");
IDRegistry.genItemID("quantumLeggings");
IDRegistry.genItemID("quantumBoots");

Item.createArmorItem("quantumHelmet", "Quantum Helmet", {name: "quantum_helmet"}, {type: "helmet", armor: 5, durability: 27, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumChestplate", "Quantum Bodyarmor", {name: "quantum_chestplate"}, {type: "chestplate", armor: 9, durability: 27, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumLeggings", "Quantum Leggings", {name: "quantum_leggings"}, {type: "leggings", armor: 7, durability: 27, texture: "armor/quantum_2.png", isTech: true});
Item.createArmorItem("quantumBoots", "Quantum Boots", {name: "quantum_boots"}, {type: "boots", armor: 4, durability: 27, texture: "armor/quantum_1.png", isTech: true});

ChargeItemRegistry.registerExtraItem(ItemID.quantumHelmet, "Eu", 10000000, 8192, 4, "armor", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.quantumChestplate, "Eu", 10000000, 8192, 4, "armor", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.quantumLeggings, "Eu", 10000000, 8192, 4, "armor", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.quantumBoots, "Eu", 10000000, 8192, 4, "armor", true, true);

ItemName.setRarity(ItemID.quantumHelmet, 2);
ItemName.setRarity(ItemID.quantumChestplate, 2);
ItemName.setRarity(ItemID.quantumLeggings, 2);
ItemName.setRarity(ItemID.quantumBoots, 2);

Item.registerNameOverrideFunction(ItemID.quantumHelmet, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumChestplate, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumLeggings, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumBoots, ItemName.showItemStorage);

RadiationAPI.registerHazmatArmor(ItemID.quantumHelmet);
RadiationAPI.registerHazmatArmor(ItemID.quantumChestplate);
RadiationAPI.registerHazmatArmor(ItemID.quantumLeggings);
RadiationAPI.registerHazmatArmor(ItemID.quantumBoots);


IDRegistry.genItemID("quantumHelmetUncharged");
IDRegistry.genItemID("quantumChestplateUncharged");
IDRegistry.genItemID("quantumLeggingsUncharged");
IDRegistry.genItemID("quantumBootsUncharged");

Item.createArmorItem("quantumHelmetUncharged", "Quantum Helmet", {name: "quantum_helmet"}, {type: "helmet", armor: 2, durability: 27, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumChestplateUncharged", "Quantum Bodyarmor", {name: "quantum_chestplate"}, {type: "chestplate", armor: 6, durability: 27, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumLeggingsUncharged", "Quantum Leggings", {name: "quantum_leggings"}, {type: "leggings", armor: 3, durability: 27, texture: "armor/quantum_2.png", isTech: true});
Item.createArmorItem("quantumBootsUncharged", "Quantum Boots", {name: "quantum_boots"}, {type: "boots", armor: 2, durability: 27, texture: "armor/quantum_1.png", isTech: true});

ChargeItemRegistry.registerExtraItem(ItemID.quantumHelmetUncharged, 10000000, 8192, 4, "armor", true);
ChargeItemRegistry.registerExtraItem(ItemID.quantumChestplateUncharged, 10000000, 8192, 4, "armor", true);
ChargeItemRegistry.registerExtraItem(ItemID.quantumLeggingsUncharged, 10000000, 8192, 4, "armor", true);
ChargeItemRegistry.registerExtraItem(ItemID.quantumBootsUncharged, 10000000, 8192, 4, "armor", true);

ItemName.setRarity(ItemID.quantumHelmetUncharged, 2);
ItemName.setRarity(ItemID.quantumChestplateUncharged, 2);
ItemName.setRarity(ItemID.quantumLeggingsUncharged, 2);
ItemName.setRarity(ItemID.quantumBootsUncharged, 2);

Item.registerNameOverrideFunction(ItemID.quantumHelmetUncharged, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumChestplateUncharged, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumLeggingsUncharged, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.quantumBootsUncharged, ItemName.showItemStorage);


Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: ItemID.quantumHelmet, count: 1, data: Item.getMaxDamage(ItemID.quantumHelmet)}, [
		"a#a",
		"bxb",
		"cqc"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoHelmet, -1, 'q', ItemID.hazmatHelmet, 0, 'a', ItemID.plateReinforcedIridium, 0, 'b', BlockID.reinforcedGlass, 0, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);
	
	Recipes.addShaped({id: ItemID.quantumChestplate, count: 1, data: Item.getMaxDamage(ItemID.quantumChestplate)}, [
		"bxb",
		"a#a",
		"aca"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoChestplate, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.plateAlloy, 0, 'c', ItemID.jetpack, -1], ChargeItemRegistry.transferEnergy);
	
	Recipes.addShaped({id: ItemID.quantumLeggings, count: 1, data: Item.getMaxDamage(ItemID.quantumLeggings)}, [
		"m#m",
		"axa",
		"c c"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoLeggings, -1, 'a', ItemID.plateReinforcedIridium, 0, 'm', BlockID.machineBlockBasic, 0, 'c', 348, 0], ChargeItemRegistry.transferEnergy);
	
	Recipes.addShaped({id: ItemID.quantumBoots, count: 1, data: Item.getMaxDamage(ItemID.quantumBoots)}, [
		"axa",
		"b#b"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoBoots, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.rubberBoots, 0], ChargeItemRegistry.transferEnergy);
});


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

UIbuttons.setArmorButton(ItemID.quantumHelmet, "button_nightvision");
UIbuttons.setArmorButton(ItemID.quantumChestplate, "button_fly");
UIbuttons.setArmorButton(ItemID.quantumChestplate, "button_hover");
UIbuttons.setArmorButton(ItemID.quantumBoots, "button_jump");

var runTime = 0;

var QUANTUM_ARMOR_FUNCS = {
	hurt: function(params, slot, index, maxDamage){
		var energyStored = ChargeItemRegistry.getEnergyStored(slot);
		var type = params.type;
		if(energyStored >= 2500 && (type==2 || type==3 || type==11)){
			var energy = params.damage * 2500;
			ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - energy, 0));
			return true;
		}
		if(type==5 && (index==1 || index==3)){
			var damage = 0;
			var vel = Player.getVelocity().y;
			var time = vel / -0.06;
			var height = 0.06 * time*time / 2;
			if(height < 22){
				if(height < 17){
					var damage = Math.floor(height) - 3;
				} else {
					var damage = Math.ceil(height)- 3;
				}
			}
			if(index==1){
				if(damage <= 0 && height < 22){
					Game.prevent();
				}
				else if(params.damage > damage){
					Entity.setHealth(player, Entity.getHealth(player) + params.damage - damage);
				}
			}
			else if(energyStored >= 2500 && (damage > 0 || height >= 22)){
				params.damage = damage;
				damage = Math.min(params.damage, Math.floor((maxDamage - slot.data)/2500));
				if(params.damage > damage){
					Entity.setHealth(player, Entity.getHealth(player) + damage);
				} else {
					Game.prevent();
				}
				ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - damage * 2500, 0));
				return true;
			}
		}
		if(type==9 && index==0 && energyStored >= 500){
			Game.prevent();
			Entity.addEffect(player, MobEffect.waterBreathing, 1, 2);
			ChargeItemRegistry.setEnergyStored(slot, energyStored - 500);
			return true;
		}
		return false;
	},
	
	tick: function(slot, index, maxDamage){
		var armor = MachineRecipeRegistry.getRecipeResult("quantum-armor-charge", slot.id);
		var energyStored = ChargeItemRegistry.getEnergyStored(slot);
		if(energyStored < 2500){
			var newId = armor.uncharged;
		} else {
			var newId = armor.charged;
		}
		if(slot.id != newId){
			slot.id = newId;
			Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
		}
		if(energyStored > 0){
			switch (index){
			case 0:
				var newEnergyStored = energyStored;
				if(RadiationAPI.playerRad > 0){
					if(energyStored >= 100000){
						RadiationAPI.playerRad = 0;
						Entity.clearEffect(player, MobEffect.poison);
						newEnergyStored -= 100000;
					}
				} else {
					Entity.clearEffect(player, MobEffect.poison);
				}
				Entity.clearEffect(player, MobEffect.wither);
				
				var hunger = Player.getHunger();
				if(hunger < 20 && newEnergyStored >= 500){
					var i = World.getThreadTime%36;
					var item = Player.getInventorySlot(i);
					if(item.id == ItemID.tinCanFull){
						var count = Math.min(20 - hunger, item.count);
						Player.setHunger(hunger + count);
						item.count -= count;
						Player.setInventorySlot(i, item.count ? item.id : 0, item.count, item.data);
						Player.addItemToInventory(ItemID.tinCanEmpty, count, 0);
						newEnergyStored -= 500;
						break;
					}
				}
				
				var nightvision = slot.extra? slot.extra.getBoolean("nv") : false;
				if(nightvision && newEnergyStored > 0){
					var coords = Player.getPosition();
					var time = World.getWorldTime()%24000;
					if(World.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000){
						Entity.addEffect(Player.get(), MobEffect.blindness, 1, 25);
						Entity.clearEffect(Player.get(), MobEffect.nightVision);
					} else {
						Entity.addEffect(Player.get(), MobEffect.nightVision, 1, 225);
					}
					if(World.getThreadTime()%20 == 0){
						newEnergyStored = Math.max(newEnergyStored - 20, 0);
					}
				}
				
				if(energyStored != newEnergyStored){
					ChargeItemRegistry.setEnergyStored(slot, newEnergyStored);
					Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
				}
			break;
			case 1:
				var hover = slot.extra? slot.extra.getBoolean("hover") : false;
				if(hover){
					var vel = Player.getVelocity();
					if(vel.y.toFixed(4) == fallVelocity || energyStored < 8){
						slot.extra.putBoolean("hover", false);
						Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
						Game.message("§4" + Translation.translate("Hover mode disabled"));
					}
					else if(vel.y < -0.1){
						Player.setVelocity(vel.x, -0.1, vel.z);
						if(World.getThreadTime()%5 == 0){
							ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - 20, 0));
							Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
						}
					}
				}
				Entity.setFire(player, 0, true);
			break;
			case 2:
				var vel = Player.getVelocity();
				var horizontalVel = Math.sqrt(vel.x*vel.x + vel.z*vel.z)
				if(horizontalVel > 0.15){
					if(vel.y.toFixed(4) == fallVelocity){runTime++;}
				}
				else{runTime = 0;}
				if(runTime > 2 && !Player.getFlying()){
					Entity.addEffect(player, MobEffect.movementSpeed, 6, 5);
					if(World.getThreadTime()%5==0){
						ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - Math.floor(horizontalVel*600)));
						Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
					}
				}
			break;
			}
		}
		return false;
	}
};

Armor.registerFuncs("quantumHelmet", QUANTUM_ARMOR_FUNCS);
Armor.registerFuncs("quantumHelmetUncharged", QUANTUM_ARMOR_FUNCS);
Armor.registerFuncs("quantumChestplate", QUANTUM_ARMOR_FUNCS);
Armor.registerFuncs("quantumChestplateUncharged", QUANTUM_ARMOR_FUNCS);
Armor.registerFuncs("quantumLeggings", QUANTUM_ARMOR_FUNCS);
Armor.registerFuncs("quantumLeggingsUncharged", QUANTUM_ARMOR_FUNCS);
Armor.registerFuncs("quantumBoots", QUANTUM_ARMOR_FUNCS);
Armor.registerFuncs("quantumBootsUncharged", QUANTUM_ARMOR_FUNCS);




// file: items/armor/jetpack.js

IDRegistry.genItemID("jetpack");
Item.createArmorItem("jetpack", "Jetpack", {name: "electric_jetpack"}, {type: "chestplate", armor: 3, durability: 27, texture: "armor/jetpack_1.png", isTech: true});
ChargeItemRegistry.registerExtraItem(ItemID.jetpack, "Eu", 30000, 100, 1, "armor", true, true);
Item.registerNameOverrideFunction(ItemID.jetpack, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.jetpack, count: 1, data: 27}, [
	"bcb",
	"bab",
	"d d"
], ['a', BlockID.storageBatBox, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0, 'd', 348, 0]);

UIbuttons.setArmorButton(ItemID.jetpack, "button_fly");
UIbuttons.setArmorButton(ItemID.jetpack, "button_hover");

Armor.registerFuncs("jetpack", {
	hurt: function(params, slot, index, maxDamage){
		if(params.type==5){
			var vel = Player.getVelocity().y;
			var time = vel / -0.06;
			var height = 0.06 * time*time / 2;
			if(height < 22){
				if(height < 17){
					var damage = Math.floor(height) - 3;
				} else {
					var damage = Math.ceil(height) - 3;
				}
			}
			//Game.message(height + ", "+damage+", "+params.damage)
			if(damage <= 0 && height < 22){
				Game.prevent();
			}
			else if(params.damage > damage){
				Entity.setHealth(player, Entity.getHealth(player) + params.damage - damage);
			}
		}
		return false;
	},
	tick: function(slot, index, maxDamage){
		var energyStored = ChargeItemRegistry.getEnergyStored(slot);
		var hover = slot.extra? slot.extra.getBoolean("hover") : false;
		if(hover){
			var vel = Player.getVelocity();
			if(vel.y.toFixed(4) == fallVelocity || energyStored < 8){
				slot.extra.putBoolean("hover", false);
				Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
				Game.message("§4" + Translation.translate("Hover mode disabled"));
			}
			else if(vel.y < -0.1){
				Player.setVelocity(vel.x, -0.1, vel.z);
				if(World.getThreadTime()%5 == 0){
					ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - 20, 0));
					Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
				}
			}
		}
		return false;
	},
});




// file: items/armor/energy_packs.js

IDRegistry.genItemID("batpack");
IDRegistry.genItemID("advBatpack");
IDRegistry.genItemID("energypack");
IDRegistry.genItemID("lappack");

Item.createArmorItem("batpack", "Batpack", {name: "batpack"}, {type: "chestplate", armor: 3, durability: 27, texture: "armor/batpack_1.png", isTech: true});
Item.createArmorItem("advBatpack", "Advanced Batpack", {name: "advanced_batpack"}, {type: "chestplate", armor: 3, durability: 27, texture: "armor/advbatpack_1.png", isTech: true});
Item.createArmorItem("energypack", "Energy Pack", {name: "energy_pack"}, {type: "chestplate", armor: 3, durability: 27, texture: "armor/energypack_1.png", isTech: true});
Item.createArmorItem("lappack", "Lappack", {name: "lappack"}, {type: "chestplate", armor: 3, durability: 27, texture: "armor/lappack_1.png", isTech: true});
ItemName.setRarity(ItemID.lappack, 1);

ChargeItemRegistry.registerExtraItem(ItemID.batpack, "Eu",  60000, 128, 1, "storage", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.advBatpack, "Eu",  600000, 512, 2, "storage", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.energypack, "Eu", 2000000, 2048, 3, "storage", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.lappack, "Eu", 10000000, 8192, 4, "storage", true, true);

Item.registerNameOverrideFunction(ItemID.batpack, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.advBatpack, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.energypack, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.lappack, ItemName.showItemStorage);

Item.addCreativeGroup("batteryPack", Translation.translate("Battery Packs"), [
	ItemID.batpack,
	ItemID.advBatpack,
	ItemID.energypack,
	ItemID.lappack
]);

Recipes.addShaped({id: ItemID.batpack, count: 1, data: 27}, [
    "bcb",
    "bab",
    "b b"
], ['a', 5, -1, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitBasic, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.advBatpack, count: 1, data: 27}, [
    "bcb",
    "bab",
    "b b"
], ['a', ItemID.plateBronze, 0, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitBasic, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.energypack, count: 1, data: 27}, [
    "cbc",
    "aba",
    "b b"
], ['a', ItemID.storageCrystal, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.lappack, count: 1, data: 27}, [
    "e",
    "c",
    "a"
], ['e', ItemID.energypack, -1, 'a', ItemID.storageLapotronCrystal, -1, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);


function registerStoragePack(id, level, tranfer){
	Armor.registerFuncs(id, {
		hurt: function(){
			return false;
		},
		tick: function(slot){
			ENERGY_PACK_TICK(slot, level, tranfer);
			return false;
		}
	});
}

var ENERGY_PACK_TICK = function(slot, level, transfer){
	if(World.getThreadTime()%20==0){
		var item = Player.getCarriedItem();
		if(ChargeItemRegistry.isValidItem(item.id, "Eu", level, "tool")){
			var energyStored = ChargeItemRegistry.getEnergyStored(slot);
			var energyAdd = ChargeItemRegistry.addEnergyTo(item, "Eu", energyStored, transfer*20, level);
			if(energyAdd > 0){
				ChargeItemRegistry.setEnergyStored(slot, energyStored - energyAdd);
				Player.setCarriedItem(item.id, 1, item.data, item.extra);
				Player.setArmorSlot(1, slot.id, 1, slot.data, slot.extra);
			}
		}
	}
}

registerStoragePack("batpack", 1, 128);
registerStoragePack("advBatpack", 2, 512);
registerStoragePack("energypack", 3, 2048);
registerStoragePack("lappack", 4, 8192);




// file: items/tool/eu-meter.js

IDRegistry.genItemID("EUMeter");
Item.createItem("EUMeter", "EU Meter", {name: "eu_meter", meta: 0}, {stack: 1});

Recipes.addShaped({id: ItemID.EUMeter, count: 1, data: 0}, [
	" g ",
	"xcx",
	"x x"
], ['c', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'g', 348, -1]);


var guiEUReader = null;
Callback.addCallback("LevelLoaded", function(){
	guiEUReader = new UI.Window({
		location: {
			x: 0,
			y: 0,
			width: 1000,
			height: 1000
		},
		
		drawing: [
			{type: "background", color: 0},
			{type: "bitmap", x: 218, y: 50, bitmap: "eu_meter_background", scale: GUI_SCALE},
		],
		
		elements: {
			"arrow": {type: "image", x: 576, y: 226, bitmap: "eu_meter_arrow_0", scale: GUI_SCALE},
			"textName": {type: "text", font: {size: 36}, x: 378, y: 66, width: 256, height: 42, text: Translation.translate("EU Meter")},
			"textAvg": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 184, width: 256, height: 42, text: Translation.translate("Avg:")},
			"textAvgValue": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 214, width: 256, height: 42, text: "0 EU/t"},
			"textMaxMin": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 260, width: 256, height: 42, text: Translation.translate("Max/Min")},
			"textMax": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 290, width: 256, height: 42, text: "0 EU/t"},
			"textMin": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 320, width: 256, height: 42, text: "0 EU/t"},
			"textMode1": {type: "text", font: {size: 22, color: Color.GREEN}, x: 554, y: 184, width: 100, height: 42, text: Translation.translate("Mode:")},
			"textMode2": {type: "text", font: {size: 22, color: Color.GREEN}, x: 554, y: 368, width: 256, height: 42, text: Translation.translate("EnergyIn")},
			"textTime": {type: "text", font: {size: 22, color: Color.GREEN}, x: 266, y: 368, width: 256, height: 42, text: "Cycle: 0 sec"},
			"textReset": {type: "text", font: {size: 22, color: Color.GREEN}, x: 330, y: 412, width: 256, height: 42, text: Translation.translate("Reset")},
			"closeButton": {type: "button", x: 727, y: 60, bitmap: "close_button_small", scale: GUI_SCALE, clicker: {
				onClick: function(container){
					container.close();
					EUReader.container = null;
					EUReader.net = null;
					EUReader.tile = null;
				}
			}},
			"resetButton": {type: "button", x: 298, y: 405, bitmap: "eu_meter_reset_button", scale: GUI_SCALE, clicker: {
				onClick: function(container){
					EUReader.resetValues();
				}
			}},
			"arrowButton0": {type: "button", x: 576, y: 226, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
				onClick: function(container){
					EUReader.mode = 0;
					EUReader.resetValues();
					var elements = container.getGuiContent().elements;
					elements.arrow.bitmap = "eu_meter_arrow_0";
					elements.textMode2.text = Translation.translate("EnergyIn");
				}
			}},
			"arrowButton1": {type: "button", x: 640, y: 226, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
				onClick: function(container){
					EUReader.mode = 1;
					EUReader.resetValues();
					var elements = container.getGuiContent().elements;
					elements.arrow.bitmap = "eu_meter_arrow_1";
					elements.textMode2.text = Translation.translate("EnergyOut");
				}
			}},
			"arrowButton2": {type: "button", x: 576, y: 290, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
				onClick: function(container){
					EUReader.mode = 2;
					EUReader.resetValues();
					var elements = container.getGuiContent().elements;
					elements.arrow.bitmap = "eu_meter_arrow_2";
					elements.textMode2.text = Translation.translate("EnergyGain");
				}
			}},
			"arrowButton3": {type: "button", x: 640, y: 290, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
				onClick: function(container){
					EUReader.mode = 3;
					EUReader.resetValues();
					var elements = container.getGuiContent().elements;
					elements.arrow.bitmap = "eu_meter_arrow_3";
					elements.textMode2.text = Translation.translate("Voltage");
				}
			}},
		}
	});
});

var EUReader = {
	container: null,
	mode: 0,
	time: 0,
	sum: 0,
	minValue: 0,
	maxValue: 0,
	net: null,
	tile: null,
	resetValues: function(){
		this.time = 0;
		this.sum = 0;
		this.minValue = 2e9;
		this.maxValue = -2e9;
	}
}

Item.registerUseFunction("EUMeter", function(coords, item, block){
	var tile = EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z);
	if(tile){
		var net = tile.__energyNets.Eu;
	} else {
		var net = EnergyNetBuilder.getNetOnCoords(coords.x, coords.y, coords.z);
	}
	if(!EUReader.container && (net || tile)){
		EUReader.net = net;
		EUReader.tile = tile;
		EUReader.resetValues();
		EUReader.container = new UI.Container();
		EUReader.container.openAs(guiEUReader);
	}
});

Callback.addCallback("tick", function(){
	var item = Player.getCarriedItem()
	if(item.id == ItemID.EUMeter){
		if(EUReader.container){
			var r = function(x) {return Math.round(x * 100) / 100};
			var currentValue = 0;
			var elements = guiEUReader.content.elements;
			if(EUReader.mode < 3){
				var unit = " EU/t";
				var energyIn = energyOut = 0;
				if(EUReader.tile){
					energyIn = r(EUReader.tile.data.last_energy_receive) || 0;
					if(EUReader.net){
						energyOut = r(EUReader.net.lastTransfered) || 0;
					}
				}
				else if(EUReader.net){
					energyIn = energyOut = r(EUReader.net.lastTransfered) || 0;
				}
				switch (EUReader.mode) {
					case 0:
						currentValue = energyIn;
					break;
					case 1:
						currentValue = energyOut;
					break;
					case 2:
						currentValue = energyIn - energyOut;
					break;
				}
			} else {
				var unit = " V";
				if(EUReader.tile){
					currentValue = r(EUReader.tile.data.last_voltage) || 0;
				}
				else if(EUReader.net){
					currentValue = r(EUReader.net.lastVoltage) || 0;
				}
			}
			EUReader.time++;
			EUReader.sum += currentValue;
			EUReader.maxValue = Math.max(currentValue, EUReader.maxValue);
			EUReader.minValue = Math.min(currentValue, EUReader.minValue);
			elements.textAvgValue.text = r(EUReader.sum / EUReader.time) + unit;
			elements.textMax.text = EUReader.maxValue + unit;
			elements.textMin.text = EUReader.minValue + unit;
			elements.textTime.text = Translation.translate("Cycle: ") + Math.floor(EUReader.time/20) + " sec";
		}
	}
});




// file: items/tool/transmitter.js

IDRegistry.genItemID("freqTransmitter");
Item.createItem("freqTransmitter", "Frequency Transmitter", {name: "frequency_transmitter"}, {stack: 1});

Recipes.addShaped({id: ItemID.freqTransmitter, count: 1, data: 0}, [
	"x",
	"#",
	"b"
], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'b', ItemID.casingIron, 0]);

Item.registerNameOverrideFunction(ItemID.freqTransmitter, function(item, name){
	var carried = Player.getCarriedItem();
	if(carried.id == item.id){
		var extra = carried.extra;
		if(extra){
			var x = extra.getInt("x");
			var y = extra.getInt("y");
			var z = extra.getInt("z");
			name += "\n§7x: " + x + ", y: " + y + ", z: " + z;
		}
	}
	return name;
});

Item.registerUseFunction("freqTransmitter", function(coords, item, block){
	var receiveCoords;
	var extra = item.extra;
	if(!extra){
		extra = new ItemExtraData();
		item.extra = extra;
	} else {
		var x = extra.getInt("x");
		var y = extra.getInt("y");
		var z = extra.getInt("z");
		receiveCoords = {x: x, z: z, y: y};
	}
	if(block.id == BlockID.teleporter){
		if(!receiveCoords){
			extra.putInt("x", coords.x);
			extra.putInt("y", coords.y);
			extra.putInt("z", coords.z);
			Player.setCarriedItem(item.id, 1, item.data, extra);
			Game.message("Frequency Transmitter linked to Teleporter");
		}
		else{
			if(x == coords.x && y == coords.y && z == coords.z){
				Game.message("Can`t link Teleporter to itself");
			}
			else{
				var data = World.getTileEntity(coords.x, coords.y, coords.z).data;
				var distance = Entity.getDistanceBetweenCoords(coords, receiveCoords);
				var basicTeleportCost = Math.floor(5 * Math.pow((distance+10), 0.7));
				receiver = World.getTileEntity(x, y, z);
				if(receiver){
					data.frequency = receiveCoords;
					data.frequency.energy = basicTeleportCost;
					data = receiver.data;
					data.frequency = coords;
					data.frequency.energy = basicTeleportCost;
					Game.message("Teleportation link established");
				}
			}
		}
	}
	else if(receiveCoords){
		Player.setCarriedItem(item.id, 1, item.data);
		Game.message("Frequency Transmitter unlinked");
	}
});




// file: items/tool/scanner.js

IDRegistry.genItemID("scanner");
IDRegistry.genItemID("scannerAdvanced");
Item.createItem("scanner", "OD Scanner", {name: "scanner", meta: 0}, {stack: 1, isTech: true});
Item.createItem("scannerAdvanced", "OV Scanner", {name: "scanner", meta: 1}, {stack: 1, isTech: true});
ChargeItemRegistry.registerExtraItem(ItemID.scanner, "Eu", 10000, 100, 1, "tool", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.scannerAdvanced, "Eu", 100000, 256, 2, "tool", true, true);

Item.registerNameOverrideFunction(ItemID.scanner, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.scannerAdvanced, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.scanner, count: 1, data: 27}, [
	"gdg",
	"cbc",
	"xxx"
], ['x', ItemID.cableCopper1, -1, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitBasic, -1, 'd', 348, 0, 'g', ItemID.casingGold, -1], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.scannerAdvanced, count: 1, data: 27}, [
	"gbg",
	"dcd",
	"xsx"
], ['x', ItemID.cableGold2, -1, 's', ItemID.scanner, -1, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitAdvanced, -1, 'd', 348, 0, 'g', ItemID.casingGold, -1], ChargeItemRegistry.transferEnergy);


let scan_radius = 3;
let adv_scan_radius = 6;
let ore_blocks = [14, 15, 16, 21, 73, 74, 56, 129, 153];

Callback.addCallback("PreLoaded", function(coords, item, block){
	for(let id in BlockID){
		if(id[0]=='o' && id[1]=='r' && id[2]=='e' && !TileEntity.isTileEntityBlock(BlockID[id])){
			ore_blocks.push(BlockID[id]);
		}
	}
});

Item.registerUseFunction("scanner", function(coords, item, block){
	let energyStored = ChargeItemRegistry.getEnergyStored(item);
	if(energyStored >= 50){
		ChargeItemRegistry.setEnergyStored(item, energyStored - 50);
		Player.setCarriedItem(item.id, 1, item.data, item.extra);
		SoundAPI.playSound("Tools/ODScanner.ogg");
		Game.message("Scan result for: " + coords.x + ", " + coords.y + ", " + coords.z);
		let ores = {};
		for(let x = coords.x - scan_radius; x <= coords.x + scan_radius; x++){
			for(let y = coords.y - scan_radius; y <= coords.y + scan_radius; y++){
				for(let z = coords.z - scan_radius; z <= coords.z + scan_radius; z++){
					let blockID = World.getBlockID(x, y, z);
					if(ore_blocks.indexOf(blockID) != -1){
						ores[blockID] = ores[blockID]+1 || 1;
					}
				}
			}
		}
		for(let id in ores){
			Game.message(Item.getName(id) + " - " + ores[id]);
		}
	}
});

Item.registerUseFunction("scannerAdvanced", function(coords, item, block){
	let energyStored = ChargeItemRegistry.getEnergyStored(item);
	if(energyStored >= 200){
		ChargeItemRegistry.setEnergyStored(item, energyStored - 200);
		Player.setCarriedItem(item.id, 1, item.data, item.extra);
		SoundAPI.playSound("Tools/ODScanner.ogg");
		Game.message("Scan result for: " + coords.x + ", " + coords.y + ", " + coords.z);
		let ores = {};
		for(let x = coords.x - adv_scan_radius; x <= coords.x + adv_scan_radius; x++){
			for(let y = coords.y - adv_scan_radius; y <= coords.y + adv_scan_radius; y++){
				for(let z = coords.z - adv_scan_radius; z <= coords.z + adv_scan_radius; z++){
					let blockID = World.getBlockID(x, y, z);
					if(ore_blocks.indexOf(blockID) != -1){
						ores[blockID] = ores[blockID]+1 || 1;
					}
				}
			}
		}
		for(let id in ores){
			Game.message(Item.getName(id) + " - " + ores[id]);
		}
	}
});




// file: items/tool/treetap.js

IDRegistry.genItemID("treetap");
Item.createItem("treetap", "Treetap", {name: "treetap", data: 0}, {stack: 1});
Item.setMaxDamage(ItemID.treetap, 17);

Item.registerUseFunction("treetap", function(coords, item, block){
	if(block.id == BlockID.rubberTreeLogLatex && block.data - 2 == coords.side){
		SoundAPI.playSound("Tools/Treetap.ogg");
		World.setBlock(coords.x, coords.y, coords.z, BlockID.rubberTreeLogLatex, block.data - 4);
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




// file: items/tool/crafting.js

IDRegistry.genItemID("craftingHammer");
Item.createItem("craftingHammer", "Forge Hammer", {name: "crafting_hammer"}, {stack: 1});
Item.setMaxDamage(ItemID.craftingHammer, 80);

IDRegistry.genItemID("cutter");
Item.createItem("cutter", "Cutter", {name: "cutter"}, {stack: 1});
Item.setMaxDamage(ItemID.cutter, 60);

Recipes.addShaped({id: ItemID.craftingHammer, count: 1, data: 0}, [
	"xx ",
	"x##",
	"xx "
], ['x', 265, 0, '#', 280, 0]);

Recipes.addShaped({id: ItemID.cutter, count: 1, data: 0}, [
	"x x",
	" x ",
	"a a"
], ['a', 265, 0, 'x', ItemID.plateIron, 0]);

Callback.addCallback("DestroyBlockStart", function(coords, block){
	var item = Player.getCarriedItem();
	var cableData = CableRegistry.getCableData(block.id);
	if(item.id == ItemID.cutter && cableData && cableData.insulation > 0){
		Game.prevent();
		ToolAPI.breakCarriedTool(1);
		SoundAPI.playSound("Tools/InsulationCutters.ogg");
		var blockID = BlockID[cableData.name + (cableData.insulation - 1)]
		World.setBlock(coords.x, coords.y, coords.z, blockID, 0);
		World.drop(coords.x + 0.5, coords.y + 1, coords.z + 0.5, ItemID.rubber, 1);
	}
});

Item.registerUseFunction("cutter", function(coords, item, block){
	var cableData = CableRegistry.getCableData(block.id);
	if(cableData && cableData.insulation < cableData.maxInsulation){
		for(var i = 9; i < 45; i++){
			var slot = Player.getInventorySlot(i);
			if(slot.id == ItemID.rubber){
				var blockID = BlockID[cableData.name + (cableData.insulation + 1)]
				World.setBlock(coords.x, coords.y, coords.z, blockID, 0);
				slot.count--;
				Player.setInventorySlot(i, slot.count ? slot.id : 0, slot.count, slot.data);
				break;
			}
		}
	}
});




// file: items/tool/tool_box.js

IDRegistry.genItemID("toolbox");
Item.createItem("toolbox", "Tool Box", {name: "tool_box", meta: 0}, {stack: 1});

Recipes.addShaped({id: ItemID.toolbox, count: 1, data: 0}, [
	"axa",
	"aaa",
], ['x', 54, 0, 'a', ItemID.casingBronze, 0]);

let toolbox_items = [
	ItemID.treetap, ItemID.craftingHammer, ItemID.cutter, ItemID.electricHoe, ItemID.electricTreetap, ItemID.EUMeter,
	ItemID.cableTin0, ItemID.cableTin1, ItemID.cableCopper0, ItemID.cableCopper1,
	ItemID.cableGold0, ItemID.cableGold1, ItemID.cableGold2,
	ItemID.cableIron0, ItemID.cableIron1, ItemID.cableIron2, ItemID.cableIron3, ItemID.cableOptic
];

BackpackRegistry.register(ItemID.toolbox, {
	title: "Tool Box",
	slots: 10,
	inRow: 5,
	slotsCenter: true,
	isValidItem: function(id, count, data){
		if(toolbox_items.indexOf(id) != -1) return true;
		if(ToolAPI.getToolData(id) || ICTool.getWrenchData(id)) return true;
		return false;
	}
});

Callback.addCallback("ItemUse", function(coords, item, block){
	if(block.id == 58){
		for(let i = 9; i < 45; i++){
			let slot = Player.getInventorySlot(i);
			if(item.id == ItemID.toolbox){
				let container = BackpackRegistry.containers["d" + slot.data];
				if(container){
					let isEmpty = true;
					for(let i = 1; i <= 10; i++){
						if(container.getSlot("slot"+i).id != 0){
							isEmpty = false;
						}
					}
					if(isEmpty){
						delete BackpackRegistry.containers["d" + slot.data];
						Player.setInventorySlot(i, slot.id, 1, 0);
					}
				}
			}
		}
	}
});





// file: items/tool/containment_box.js

IDRegistry.genItemID("containmentBox");
Item.createItem("containmentBox", "Containment Box", {name: "containment_box", meta: 0}, {stack: 1});

Recipes.addShaped({id: ItemID.containmentBox, count: 1, data: 0}, [
	"aaa",
	"axa",
	"aaa",
], ['x', 54, 0, 'a', ItemID.casingLead, 0]);

let guiContainmentBox = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Containment Box")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	drawing: [
		{type: "background", color: Color.parseColor("#d5d9b9")},
		{type: "bitmap", x: 415, y: 112, bitmap: "containment_box_image", scale: GUI_SCALE},
		{type: "bitmap", x: 805, y: 112, bitmap: "containment_box_image", scale: GUI_SCALE},
		{type: "bitmap", x: 415, y: 232, bitmap: "containment_box_image", scale: GUI_SCALE},
		{type: "bitmap", x: 805, y: 232, bitmap: "containment_box_image", scale: GUI_SCALE},
	],
	elements: {
		"slot0": {type: "slot", x: 530, y: 120, isValid: function(id){return RadiationAPI.isRadioactiveItem(id)}},
		"slot1": {type: "slot", x: 590, y: 120, isValid: function(id){return RadiationAPI.isRadioactiveItem(id)}},
		"slot2": {type: "slot", x: 650, y: 120, isValid: function(id){return RadiationAPI.isRadioactiveItem(id)}},
		"slot3": {type: "slot", x: 710, y: 120, isValid: function(id){return RadiationAPI.isRadioactiveItem(id)}},
		"slot4": {type: "slot", x: 530, y: 180, isValid: function(id){return RadiationAPI.isRadioactiveItem(id)}},
		"slot5": {type: "slot", x: 590, y: 180, isValid: function(id){return RadiationAPI.isRadioactiveItem(id)}},
		"slot6": {type: "slot", x: 650, y: 180, isValid: function(id){return RadiationAPI.isRadioactiveItem(id)}},
		"slot7": {type: "slot", x: 710, y: 180, isValid: function(id){return RadiationAPI.isRadioactiveItem(id)}},
		"slot8": {type: "slot", x: 530, y: 240, isValid: function(id){return RadiationAPI.isRadioactiveItem(id)}},
		"slot9": {type: "slot", x: 590, y: 240, isValid: function(id){return RadiationAPI.isRadioactiveItem(id)}},
		"slot10": {type: "slot", x: 650, y: 240, isValid: function(id){return RadiationAPI.isRadioactiveItem(id)}},
		"slot11": {type: "slot", x: 710, y: 240, isValid: function(id){return RadiationAPI.isRadioactiveItem(id)}},
	}
});

BackpackRegistry.register(ItemID.containmentBox, {
	title: "Containment Box",
    gui: guiContainmentBox
});




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
ToolLib.setTool(ItemID.bronzeSword, "bronze", ToolType.sword);
ToolLib.setTool(ItemID.bronzeShovel, "bronze", ToolType.shovel);
ToolLib.setTool(ItemID.bronzePickaxe, "bronze", ToolType.pickaxe);
ToolLib.setTool(ItemID.bronzeAxe, "bronze", ToolType.axe);
ToolLib.setTool(ItemID.bronzeHoe, "bronze", ToolType.hoe);

Item.addRepairItemIds(ItemID.bronzeSword, [ItemID.ingotBronze]);
Item.addRepairItemIds(ItemID.bronzeShovel, [ItemID.ingotBronze]);
Item.addRepairItemIds(ItemID.bronzePickaxe, [ItemID.ingotBronze]);
Item.addRepairItemIds(ItemID.bronzeAxe, [ItemID.ingotBronze]);
Item.addRepairItemIds(ItemID.bronzeHoe, [ItemID.ingotBronze]);

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

IDRegistry.genItemID("wrenchBronze");
Item.createItem("wrenchBronze", "Wrench", {name: "bronze_wrench", meta: 0}, {stack: 1});
Item.setMaxDamage(ItemID.wrenchBronze, 161);

IDRegistry.genItemID("electricWrench");
Item.createItem("electricWrench", "Electric Wrench", {name: "electric_wrench", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerExtraItem(ItemID.electricWrench, "Eu", 10000, 100, 1, "tool", true, true);

Item.registerNameOverrideFunction(ItemID.electricWrench, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.wrenchBronze, count: 1, data: 0}, [
	"a a",
	"aaa",
	" a "
], ['a', ItemID.ingotBronze, 0]);

Recipes.addShapeless({id: ItemID.electricWrench, count: 1, data: 27}, [
	{id: ItemID.wrenchBronze, data: 0}, {id: ItemID.powerUnitSmall, data: 0}
]);

ICTool.registerWrench(ItemID.wrenchBronze, 0.8);
ICTool.registerWrench(ItemID.electricWrench, 1, 50);




// file: items/tool/electric.js

IDRegistry.genItemID("electricHoe");
Item.createItem("electricHoe", "Electric Hoe", {name: "electric_hoe", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerExtraItem(ItemID.electricHoe, "Eu", 10000, 100, 1, "tool", true, true);
Item.setToolRender(ItemID.electricHoe, true);
Item.registerNameOverrideFunction(ItemID.electricHoe, ItemName.showItemStorage);

IDRegistry.genItemID("electricTreetap");
Item.createItem("electricTreetap", "Electric Treetap", {name: "electric_treetap", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerExtraItem(ItemID.electricTreetap, "Eu", 10000, 100, 1, "tool", true, true);
Item.registerNameOverrideFunction(ItemID.electricTreetap, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.electricHoe, count: 1, data: 27}, [
	"pp",
	" p",
	" x"
], ['x', ItemID.powerUnitSmall, 0, 'p', ItemID.plateIron, 0]);

Recipes.addShapeless({id: ItemID.electricTreetap, count: 1, data: 27}, [{id: ItemID.powerUnitSmall, data: 0}, {id: ItemID.treetap, data: 0}]);

ICTool.registerElectricHoe("electricHoe");
ICTool.registerElectricTreerap("electricTreetap");




// file: items/tool/drills.js

IDRegistry.genItemID("drill");
IDRegistry.genItemID("diamondDrill");
IDRegistry.genItemID("iridiumDrill");

Item.createItem("drill", "Mining Drill", {name: "drill"}, {stack: 1, isTech: true});
Item.createItem("diamondDrill", "Diamond Drill", {name: "drill_diamond"}, {stack: 1, isTech: true});
Item.createItem("iridiumDrill", "Iridium Drill", {name: "drill_iridium"}, {stack: 1, isTech: true});

Item.setGlint(ItemID.iridiumDrill, true);
ItemName.setRarity(ItemID.iridiumDrill, 2);

Item.addCreativeGroup("ic2_drills", Translation.translate("Mining Drills"), [
	ItemID.drill,
	ItemID.diamondDrill,
	ItemID.iridiumDrill
]);

ChargeItemRegistry.registerExtraItem(ItemID.drill, "Eu", 30000, 100, 1, "tool", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.diamondDrill, "Eu", 30000, 100, 1, "tool", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.iridiumDrill, "Eu", 1000000, 2048, 3, "tool", true, true);

Item.registerNameOverrideFunction(ItemID.drill, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.diamondDrill, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.iridiumDrill, function(item, name){
	name = ItemName.showItemStorage(item, name);
	let mode = item.extra? item.extra.getInt("mode") : 0;
	switch(mode){
		case 0:
			name += "\n" + Translation.translate("Mode: ") + Translation.translate("Fortune III");
		break;
		case 1:
			name += "\n" + Translation.translate("Mode: ") + Translation.translate("Silk Touch");
		break;
		case 2:
			name += "\n" + Translation.translate("Mode: ") + "3x3 " + Translation.translate("Fortune III");
		break;
		case 3:
			name += "\n" + Translation.translate("Mode: ") + "3x3 " + Translation.translate("Silk Touch");
		break;
	}
	
	return name;
});


Recipes.addShaped({id: ItemID.drill, count: 1, data: 27}, [
	" p ",
	"ppp",
	"pxp"
], ['x', ItemID.powerUnit, 0, 'p', ItemID.plateIron, 0]);

Recipes.addShaped({id: ItemID.diamondDrill, count: 1, data: 27}, [
	" a ",
	"ada"
], ['d', ItemID.drill, -1, 'a', 264, 0], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.iridiumDrill, count: 1, data: 27}, [
	" a ",
	"ada",
	" e "
], ['d', ItemID.diamondDrill, -1, 'e', ItemID.storageCrystal, -1, 'a', ItemID.plateReinforcedIridium, 0], ChargeItemRegistry.transferEnergy);

UIbuttons.setToolButton(ItemID.iridiumDrill, "button_switch");

UIbuttons.registerSwitchFunction(ItemID.iridiumDrill, function(item){
	let extra = item.extra;
	if(!extra){
		extra = new ItemExtraData();
	}
	let mode = (extra.getInt("mode")+1)%4;
	extra.putInt("mode", mode);
	switch(mode){
	case 0:
		Game.message("§e" + Translation.translate("Mode: ") + Translation.translate("Fortune III"));
	break;
	case 1:
		Game.message("§9" + Translation.translate("Mode: ") + Translation.translate("Silk Touch"));
	break;
	case 2:
		Game.message("§c" + Translation.translate("Mode: ") + "3x3 " + Translation.translate("Fortune III"));
	break;
	case 3:
		Game.message("§2" + Translation.translate("Mode: ") + "3x3 " + Translation.translate("Silk Touch"));
	break;
	}
	Player.setCarriedItem(item.id, 1, item.data, extra);
});

ToolType.drill = {
	damage: 0,
	blockTypes: ["stone", "dirt"],
	onDestroy: function(item, coords, block){
		if(Block.getDestroyTime(block.id) > 0){
			ICTool.dischargeItem(item, this.toolMaterial.energyPerUse);
		}
		return true;
	},
	onBroke: function(item){return true;},
	onAttack: function(item, mob){
		ICTool.dischargeItem(item, this.toolMaterial.energyPerUse);
		return true;
	},
	calcDestroyTime: function(item, coords, block, params, destroyTime, enchant){
		if(ChargeItemRegistry.getEnergyStored(item) >= this.toolMaterial.energyPerUse){
			return destroyTime;
		}
		return params.base;
	},
	useItem: function(coords, item, block){
		let place = coords;
		if(!World.canTileBeReplaced(block.id, block.data)){
			place = coords.relative;
			let tile = World.getBlock(place.x, place.y, place.z);
			if(!World.canTileBeReplaced(tile.id, tile.data)){
				return;
			}
		}
		for(let i = 9; i < 45; i++){
			let slot = Player.getInventorySlot(i);
			if(slot.id == 50){
				if(Block.isSolid(block.id)){
					World.setBlock(place.x, place.y, place.z, 50, (6 - coords.side)%6);
				} else {
					block = World.getBlock(place.x, place.y - 1, place.z);
					if(Block.isSolid(block.id)){
						World.setBlock(place.x, place.y, place.z, 50, 5);
					} else {
						break;
					}
				}
				slot.count--;
				if(slot.count == 0) slot.id = 0;
				Player.setInventorySlot(i, slot.id, slot.count, 0);
				break;
			}
		}
	},
	continueDestroyBlock: function(item, coords, block, progress){
		if(progress > 0){
			this.playDestroySound(item, block);
		}
	},
	destroyBlock: function(coords, side, item, block){
		this.playDestroySound(item, block);
	},
	playDestroySound: function(item, block){
		if(Config.soundEnabled && ChargeItemRegistry.getEnergyStored(item) >= this.toolMaterial.energyPerUse){
			let hardness = Block.getDestroyTime(block.id);
			if(hardness > 1 || hardness < 0){
				SoundAPI.playSound("Tools/Drill/DrillHard.ogg", false, true);
			}
			else if(hardness > 0){
				SoundAPI.playSound("Tools/Drill/DrillSoft.ogg", false, true);
			}
		}
	}
}

ToolLib.setTool(ItemID.drill, {energyPerUse: 50, level: 3, efficiency: 8, damage: 3},  ToolType.drill);
ToolLib.setTool(ItemID.diamondDrill, {energyPerUse: 80, level: 4, efficiency: 16, damage: 4}, ToolType.drill);
ToolLib.setTool(ItemID.iridiumDrill, {energyPerUse: 800, level: 5, efficiency: 24, damage: 5}, {
	damage: 0,
	blockTypes: ["stone", "dirt"],
	soundType: "drill",
	modifyEnchant: function(enchant, item){
		let mode = item.extra? item.extra.getInt("mode") : 0;
		if(mode%2){
		enchant.silk = true;}
		else{
		enchant.fortune = 3;}
	},
	onDestroy: ToolType.drill.onDestroy,
	onBroke: function(item){return true;},
	onAttack: ToolType.drill.onAttack,
	calcDestroyTime: function(item, coords, block, params, destroyTime){
		if(ChargeItemRegistry.getEnergyStored(item) >= 800){
			let mode = item.extra? item.extra.getInt("mode") : 0;
			let material = ToolAPI.getBlockMaterialName(block.id);
			if(mode >= 2 && (material == "dirt" || material == "stone")){
				destroyTime = 0;
				let side = coords.side;
				let X = 1;
				let Y = 1;
				let Z = 1;
				if(side==BlockSide.EAST || side==BlockSide.WEST){
				X = 0;}
				if(side==BlockSide.UP || side==BlockSide.DOWN){
				Y = 0;}
				if(side==BlockSide.NORTH || side==BlockSide.SOUTH){
				Z = 0;}
				for(let xx = coords.x - X; xx <= coords.x + X; xx++){
					for(let yy = coords.y - Y; yy <= coords.y + Y; yy++){
						for(let zz = coords.z - Z; zz <= coords.z + Z; zz++){
							let blockID = World.getBlockID(xx, yy, zz);
							material = ToolAPI.getBlockMaterial(blockID) || {};
							if(material.name == "dirt" || material.name == "stone"){
								destroyTime = Math.max(destroyTime, Block.getDestroyTime(blockID) / material.multiplier / 24);
							}
						}
					}
				}
			}
			return destroyTime;
		}
		return params.base;
	},
	destroyBlock: function(coords, side, item, block){
		this.playDestroySound(item, block);
		let mode = item.extra? item.extra.getInt("mode") : 0;
		let material = ToolAPI.getBlockMaterialName(block.id);
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		if(mode >= 2 && (material == "dirt" || material == "stone") && energyStored >= 800){
			let X = 1;
			let Y = 1;
			let Z = 1;
			if(side==BlockSide.EAST || side==BlockSide.WEST){
			X = 0;}
			if(side==BlockSide.UP || side==BlockSide.DOWN){
			Y = 0;}
			if(side==BlockSide.NORTH || side==BlockSide.SOUTH){
			Z = 0;}
			for(let xx = coords.x - X; xx <= coords.x + X; xx++){
				for(let yy = coords.y - Y; yy <= coords.y + Y; yy++){
					for(let zz = coords.z - Z; zz <= coords.z + Z; zz++){
						if(xx == coords.x && yy == coords.y && zz == coords.z){
							continue;
						}
						blockID = World.getBlockID(xx, yy, zz);
						let material = ToolAPI.getBlockMaterialName(blockID);
						if(material == "dirt" || material == "stone"){
							energyStored -= 800;
							World.destroyBlock(xx, yy, zz, true);
							if(energyStored < 800){
								ChargeItemRegistry.setEnergyStored(item, energyStored);
								Player.setCarriedItem(item.id, 1, item.data, item.extra);
								return;
							}
						}
					}
				}
			}
			ChargeItemRegistry.setEnergyStored(item, energyStored);
			Player.setCarriedItem(item.id, 1, item.data, item.extra);
		}
	},
	useItem: ToolType.drill.useItem,
	continueDestroyBlock: ToolType.drill.continueDestroyBlock,
	playDestroySound: ToolType.drill.playDestroySound,
});




// file: items/tool/chainsaw.js

IDRegistry.genItemID("chainsaw");
Item.createItem("chainsaw", "Chainsaw", {name: "chainsaw", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerExtraItem(ItemID.chainsaw, "Eu", 30000, 100, 1, "tool", true, true);

Item.registerNameOverrideFunction(ItemID.chainsaw, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.chainsaw, count: 1, data: 27}, [
	" pp",
	"ppp",
	"xp "
], ['x', ItemID.powerUnit, 0, 'p', ItemID.plateIron, 0]);

ToolAPI.addBlockMaterial("wool", 1.5);
ToolAPI.registerBlockMaterial(35, "wool");

ToolType.chainsaw = {
	damage: 4,
	toolDamage: 0,
	blockTypes: ["wood", "wool", "fibre", "plant"],
	soundType: "chainsaw",
	onDestroy: function(item, coords, block){
		if(Block.getDestroyTime(block.id) > 0){
			if(ICTool.dischargeItem(item, this.toolMaterial.energyPerUse) && (block.id == 18 || block.id == 161)){
				World.destroyBlock(coords.x, coords.y, coords.z);
				World.drop(coords.x + .5, coords.y + .5, coords.z + .5, block.id, 1, block.data%4);
			}
		}
		return true;
	},
	onBroke: function(item){return true;},
	onAttack: function(item, mob){
		var material = this.toolMaterial;
		if(!this.toolDamage) this.toolDamage = material.damage;
		if(ICTool.dischargeItem(item, this.toolMaterial.energyPerUse)){
			material.damage = this.toolDamage;
		}
		else{
			material.damage = 0;
		}
		return true;
	},
	calcDestroyTime: function(item, coords, block, params, destroyTime, enchant){
		if(ChargeItemRegistry.getEnergyStored(item) >= this.toolMaterial.energyPerUse){
			return destroyTime;
		}
		else{
			return params.base;
		}
	},
}

ToolLib.setTool(ItemID.chainsaw, {energyPerUse: 60, level: 3, efficiency: 16, damage: 6}, ToolType.chainsaw);

let chainsawLoop = SoundAPI.addSoundPlayer("Tools/Chainsaw/ChainsawIdle.ogg", true, 1);
SoundAPI.addSoundPlayer("Tools/Chainsaw/ChainsawStop.ogg", false, 1);
Callback.addCallback("tick", function(){
	if(!SoundAPI.isSoundEnabled()) {return;}
	let item = Player.getCarriedItem();
	let tool = ToolAPI.getToolData(item.id);
	let energyStored = ChargeItemRegistry.getEnergyStored(item);
	if(tool && tool.soundType == "chainsaw" && energyStored >= tool.toolMaterial.energyPerUse){
		if(!chainsawLoop.isPlaying()){
			chainsawLoop.start();
		}
	}
	else if(chainsawLoop.isPlaying()){
		chainsawLoop.stop();
		SoundAPI.playSound("Tools/Chainsaw/ChainsawStop.ogg", false, true);
	}
});




// file: items/tool/nano_saber.js

IDRegistry.genItemID("nanoSaber");
Item.createItem("nanoSaber", "Nano Saber", {name: "nano_saber", meta: 0}, {stack: 1, isTech: true});
Item.setToolRender(ItemID.nanoSaber, true);
ChargeItemRegistry.registerExtraItem(ItemID.nanoSaber, "Eu", 1000000, 2048, 3, "tool", true, true);
ItemName.setRarity(ItemID.nanoSaber, 1);
Item.registerNameOverrideFunction(ItemID.nanoSaber, ItemName.showItemStorage);

IDRegistry.genItemID("nanoSaberActive");
Item.createItem("nanoSaberActive", "Nano Saber", {name: "nano_saber_active", meta: 0}, {stack: 1, isTech: true});
Item.setToolRender(ItemID.nanoSaberActive, true);
ChargeItemRegistry.registerExtraItem(ItemID.nanoSaberActive, "Eu", 1000000, 2048, 3, "tool", true);
ItemName.setRarity(ItemID.nanoSaberActive, 1);
Item.registerNameOverrideFunction(ItemID.nanoSaberActive, ItemName.showItemStorage);

Item.registerIconOverrideFunction(ItemID.nanoSaberActive, function(item, name){
	return {name: "nano_saber_active", meta: World.getThreadTime()%2}
});

Recipes.addShaped({id: ItemID.nanoSaber, count: 1, data: 27}, [
	"ca ",
	"ca ",
	"bxb"
], ['x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, 'b', ItemID.carbonPlate, 0, "c", 348, 0], ChargeItemRegistry.transferEnergy);

ToolAPI.registerSword(ItemID.nanoSaber, {level: 0, durability: 27, damage: 4}, {
	damage: 0,
	onBroke: function(item){
		return true;
	},
	onAttack: function(item, mob){
		return true;
	}
});

ToolAPI.registerSword(ItemID.nanoSaberActive, {level: 0, durability: 27, damage: 20}, {
	damage: 0,
	onBroke: function(item){
		return true;
	},
	onAttack: function(item, mob){
		return true;
	}
});

let NanoSaber = {
	activationTime: 0,
	startSound: null,
	idleSound: null,
	
	noTargetUse: function(item){
		if(ChargeItemRegistry.getEnergyStored(item) >= 64){
			Player.setCarriedItem(ItemID.nanoSaberActive, 1, item.data, item.extra);
			this.startSound = SoundAPI.playSound("Tools/Nanosaber/NanosaberPowerup.ogg");
			this.activationTime = World.getThreadTime();
		}
	},
	
	noTargetUseActive: function(item){
		if(this.activationTime > 0){
			let energyStored = ChargeItemRegistry.getEnergyStored(item);
			let discharge = World.getThreadTime() - this.activationTime;
			ChargeItemRegistry.setEnergyStored(Math.max(energyStored - discharge*64, 0));
			this.activationTime = 0;
		}
		if(this.idleSound){
			this.idleSound.stop();
			this.idleSound = null;
		}
		Player.setCarriedItem(ItemID.nanoSaber, 1, item.data, item.extra);
	},
	
	tick: function(){
		let item = Player.getCarriedItem();
		if(SoundAPI.isSoundEnabled()){
			if(item.id == ItemID.nanoSaberActive){
				if(!this.idleSound && (!this.startSound || !this.startSound.isPlaying())){
					this.idleSound = SoundAPI.playSound("Tools/Nanosaber/NanosaberIdle.ogg", true, true);
					this.startSound = null;
				}
			}
			else if(this.idleSound){
				this.idleSound.stop();
				this.idleSound = null;
			}
		}
		
		if(World.getThreadTime() % 20 == 0){
			for(let i = 0; i < 36; i++){
				let item = Player.getInventorySlot(i);
				if(item.id == ItemID.nanoSaberActive){
					let energyStored = ChargeItemRegistry.getEnergyStored(item);
					if(this.activationTime > 0){
						let discharge = World.getThreadTime() - this.activationTime;
						energyStored = Math.max(energyStored - discharge*64, 0);
						this.activationTime = 0;
					} else {
						energyStored = Math.max(energyStored - 1280, 0);
					}
					if(energyStored < 64){
						item.id = ItemID.nanoSaber;
					}
					ChargeItemRegistry.setEnergyStored(item, energyStored);
					Player.setInventorySlot(i, item.id, 1, item.data, item.extra);
				}
			}
		}
	}
}

Item.registerNoTargetUseFunction("nanoSaber", function(item){
	NanoSaber.noTargetUse(item);
});

Item.registerNoTargetUseFunction("nanoSaberActive", function(item){
	NanoSaber.noTargetUseActive(item);
});

Callback.addCallback("LevelLeft", function(){
	NanoSaber.startSound = null;
	NanoSaber.idleSound = null;
});

Callback.addCallback("tick", function(){
	NanoSaber.tick();
});




// file: items/tool/mining_laser.js

IDRegistry.genItemID("miningLaser");
Item.createItem("miningLaser", "Mining Laser", {name: "mining_laser", meta: 0}, {stack: 1, isTech: true});
Item.setToolRender(ItemID.miningLaser, true);
ChargeItemRegistry.registerExtraItem(ItemID.miningLaser, "Eu", 1000000, 2048, 3, "tool", true, true);

ItemName.setRarity(ItemID.miningLaser, 1);
Item.registerNameOverrideFunction(ItemID.miningLaser, function(item, name){
	//name =  ItemName.showItemStorage(item, name);
	//var mode = item.extra? item.extra.getInt("mode") : 0;
	//name += "\n"+MiningLaser.getModeInfo(mode);
	return "§e" + name +" (WIP)" + ItemName.getItemStorageText(item);
});

Recipes.addShaped({id: ItemID.miningLaser, count: 1, data: 27}, [
	"ccx",
	"aa#",
	" aa"
], ['#', ItemID.circuitAdvanced, 0, 'x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, "c", 331, 0], ChargeItemRegistry.transferEnergy);

UIbuttons.setToolButton(ItemID.miningLaser, "button_switch", true);

UIbuttons.registerSwitchFunction(ItemID.miningLaser, function(item){
	var extra = item.extra;
	if(!extra){
		extra = new ItemExtraData();
	}
	var mode = (extra.getInt("mode")+1)%7;
	extra.putInt("mode", mode);
	Game.message(MiningLaser.getModeInfo(mode));
	Player.setCarriedItem(item.id, 1, item.data, extra);
});

var MiningLaser = {
	modes: {
		0: {name: "Mining", energy: 1250, power: 6},
		1: {name: "Low-Focus", energy: 100, range: 4, power: 6, blockBreaks: 1, dropChance: 1, sound: "MiningLaserLowFocus.ogg"},
		2: {name: "Long-Range", energy: 5000, power: 20, sound: "MiningLaserLongRange.ogg"},
		3: {name: "Horizontal", energy: 1250, power: 6},
		4: {name: "Super-Heat", energy: 2500, power: 8, smelt: true},
		5: {name: "Scatter", energy: 10000, power: 12, blockBreaks: 16, sound: "MiningLaserScatter.ogg"},
		6: {name: "3x3", energy: 10000, power: 6}
	},
	getModeData: function(n){
		return this.modes[n];
	},
	getModeInfo: function(n){
		var modeName = this.getModeData(n).name;
		return Translation.translate("Mode: ") + Translation.translate(modeName);
	},
	lasers: [],
	shootLaser: function(pos, vel, mode){
		var ent = Entity.spawn(pos.x, pos.y, pos.z, EntityType.ARROW);
		Entity.setSkin(ent, "models/laser.png");
		Entity.setVelocity(ent, vel.x, vel.y, vel.z);
		this.lasers.push({ent: ent, start: pos, vel: vel, range: mode.range || 64, power: mode.power, blockBreaks: mode.blockBreaks || 128, smelt: mode.smelt || false, dropChance: mode.dropChance || 0.9, hitblock: false});
	},
	useItem: function(item){
		var laserSetting = item.extra? item.extra.getInt("mode") : 0;
		if(laserSetting == 3 || laserSetting == 6) return;
		var mode = this.getModeData(laserSetting);
		if(ICTool.useElectricItem(item, mode.energy)){
			SoundAPI.playSound("Tools/MiningLaser/" + (mode.sound || "MiningLaser.ogg"));
			var pos = Player.getPosition();
			var angle = Entity.getLookAngle(Player.get());
			var dir = new Vector3(Entity.getLookVectorByAngle(angle));
			if (laserSetting == 5) {
				var look = dir;
				right = look.copy().cross(Vector.UP);
				if (right.lengthSquared() < 1e-4) {
					right.set(Math.sin(angle.yaw), 0.0, -Math.cos(angle.yaw));
				} else {
					right.normalize();
				}
				var up = right.copy().cross(look);
				look.scale(8.0);
				for (var r = -2; r <= 2; r++) {
					for (var u = -2; u <= 2; u++) {
						dir = look.copy().addScaled(right, r).addScaled(up, u).normalize();
						this.shootLaser(pos, dir, mode);
                    }
				}
			} else {
				this.shootLaser(pos, dir, mode);
			}
		}
	},
	useItemOnBlock: function(item, coords){
		var laserSetting = item.extra? item.extra.getInt("mode") : 0;
		if(laserSetting != 3 && laserSetting != 6){
			this.useItem(item);
			return;
		}
		var mode = this.getModeData(laserSetting);
		if(ICTool.useElectricItem(item, mode.energy)){
			SoundAPI.playSound("Tools/MiningLaser/" + (mode.sound || "MiningLaser.ogg"));
			var pos = Player.getPosition();
			var angle = Entity.getLookAngle(Player.get());
			var dir = new Vector3(Entity.getLookVectorByAngle(angle));
			if (Math.abs(angle.pitch) < 1/Math.sqrt(2)) {
				dir.y = 0;
				dir.normalize();
				var start = {x: pos.x, y: coords.y + 0.5, z: pos.z};
				if (laserSetting == 6) {
					var playerRotation = TileRenderer.getBlockRotation();
					if (playerRotation <= 1) {
						for (var y = start.y - 1; y <= start.y + 1; y++){
							for (var x = start.x - 1; x <= start.x + 1; x++){
								this.shootLaser({x: x, y: y, z: start.z}, dir, mode);
							}
						}
					}
					else {
						for (var y = start.y - 1; y <= start.y + 1; y++){
							for (var z = start.z - 1; z <= start.z + 1; z++){
								this.shootLaser({x: start.x, y: y, z: z}, dir, mode);
							}
						}
					}
				} else {
					this.shootLaser(start, dir, mode);
				}
			}
			else if (laserSetting == 6) {
                dir.x = 0.0;
				dir.z = 0.0;
				dir.normalize();
				var start = {x: coords.x + 0.5, y: pos.y, z: coords.z + 0.5};
				for (var x = start.x - 1; x <= start.x + 1; x++){
					for (var z = start.z - 1; z <= start.z + 1; z++){
						this.shootLaser({x: x, y: start.y, z: z}, dir, mode);
					}
				}
			} else {
				Game.message("Mining laser aiming angle too steep");
			}
		}
	},
	destroyBlock: function(laser, x, y, z, block){
		var hardness = Block.getDestroyTime(block.id);
		laser.power -= hardness / 1.5;
        if (laser.power < 0) {
            return;
        }
        if(hardness > 0){
        	laser.blockBreaks--;
       }
       var material = ToolAPI.getBlockMaterialName(block.id);
		if(Math.random() < 0.5 && (material == "wood" || material == "plant" || material == "fibre" || material == "wool")){
			World.setBlock(x, y, z, 51);
		} else {
			World.setBlock(x, y, z, 0);
		}
		var drop = getBlockDrop({x: x, y: y, z: z}, block.id, block.data, 100, true);
		if(drop)
		for(var i in drop){
			var item = drop[i];
			if(laser.smelt && material == "stone"){
				laser.power = 0;
				var result = Recipes.getFurnaceRecipeResult(item[0]);
				if(result){
					item[0] = result.id;
					item[2] = result.data;
				}
				World.drop(x+0.5, y+0.5, z+0.5, item[0], item[1], item[2]);
			}
			else if(Math.random() < laser.dropChance){
				World.drop(x+0.5, y+0.5, z+0.5, item[0], item[1], item[2]);
			}
		}
	},
	update: function(){
		for(var i in this.lasers){
			laser = this.lasers[i];
			var distance = Entity.getDistanceBetweenCoords(Entity.getPosition(laser.ent), laser.start)
			if(laser.power <= 0 || laser.blockBreaks <= 0 || distance > laser.range){
				Entity.remove(laser.ent);
				this.lasers.splice(i, 1);
				i--;
			} else {
				if(laser.hitblock){
					laser.hitblock = false;
				} else {
					laser.power -= 0.25;
				}
				var vel = laser.vel;
				Entity.setVelocity(laser.ent, vel.x, vel.y, vel.z);
				var c = Entity.getPosition(laser.ent);
				this.checkBlock(laser, Math.floor(c.x), Math.floor(c.y), Math.floor(c.z));
			}
		}
	},
	checkBlock: function(laser, x, y, z){
		var block = World.getBlock(x, y, z);
		var material = ToolAPI.getBlockMaterialName(block.id);
		if(material == "unbreaking"){
			laser.power = 0;
		}
		else if(block.id > 0 && block.id != 50 && block.id != 51){
			this.destroyBlock(laser, x, y, z, block);
		}
	},
	projectileHit: function(projectile, target){
		for(var i in this.lasers){
			var laser = this.lasers[i];
			if(laser.ent==projectile){
				if(laser.power <= 0 || laser.blockBreaks <= 0){
					Entity.remove(laser.ent);
					this.lasers.splice(i, 1);
					break;
				}
				if(target.coords){
					Game.prevent();
					var c = target.coords;
					var block = World.getBlock(c.x, c.y, c.z);
					if(block.id != 7 && block.id != 120){
						this.destroyBlock(laser, c.x, c.y, c.z, block);
						laser.hitblock = true;
						var vel = laser.vel;
						Entity.setVelocity(laser.ent, vel.x, vel.y, vel.z);	
					} else {
						Entity.remove(laser.ent);
						this.lasers.splice(i, 1);
					}
				}
				else{
					var damage = laser.power;
					if(damage > 0){
						if(laser.smelt) damage *= 2;
						Entity.setFire(target.entity, 100, true);
						Entity.damageEntity(target.entity, damage, 3, {attacker: Player.get()});
					}
					Entity.remove(laser.ent);
					this.lasers.splice(i, 1);
				}
				break;
			}
		}
	}
}
/*
Callback.addCallback("tick", function(){
	MiningLaser.update();
});

Callback.addCallback("ProjectileHit", function(projectile, item, target){
	MiningLaser.projectileHit(projectile, target);
});

Item.registerUseFunction("miningLaser", function(coords, item, block){
	MiningLaser.useItemOnBlock(item, coords);
});

Item.registerNoTargetUseFunction("miningLaser", function(item){
	MiningLaser.useItem(item);
});*/




// file: items/tool/crop_analyzer.js

IDRegistry.genItemID("agriculturalAnalyzer");
Item.createItem("agriculturalAnalyzer", "Crop Analyzer", {name: "cropnalyzer"}, {stack: 1});

Recipes.addShaped({id: ItemID.agriculturalAnalyzer , count: 1 , data: 0}, [
	"xx ",
	"rgr",
	"rcr"
], ['x', ItemID.cableCopper1, 0, 'r', 331, 0, 'g', 20, 0, "c", ItemID.circuitBasic, 0]);

var guiAddConst = 14;
var guiAnalyserObject = {
	location: {
		x: 0,
		y: 0,
		width: 1000,
		height: 1000
	},
	
	drawing: [
		{type: "background", color: 0},
		{type: "bitmap", x: 250, y: UI.getScreenHeight() / 10, bitmap: "agricultural_analyser", scale: GUI_SCALE / 2.3},
	],
	
	elements: {
		"closeButton": {type: "button", x: 672, y: 77, bitmap: "close_button_small", scale: GUI_SCALE, clicker: {onClick: function(container){
			AgriculturalAnalyser.dropItems(container);
            AgriculturalAnalyser.hideAllValues(container);
            container.close();
		}}},
		"textName": {type: "text", font: {size: 18}, x: 432, y: 86, width: 256, height: 42, text: Translation.translate("Crop Analyzer")},
		"slotSeedIn": {type: "slot", x: 265, y: 75, size: GUI_SCALE * 16, isValid: function(id, count, data){
			return id == ItemID.cropSeedBag;
		}},
		"slotSeedOut": {type: "slot", x: 360, y: 75, size: GUI_SCALE * 16, isValid: function(){return false;}},
		"slotEnergy": {type: "slot", x: 615, y: 75, size: GUI_SCALE * 16, isValid: MachineRegistry.isValidEUStorage}
	}
};
for(var i = 0; i < 10; i++){
	guiAnalyserObject.elements["slot" + i] = {type: "invSlot", x: 270 + i * 45, y: 455, size:GUI_SCALE * guiAddConst, index: i};
}
var guiAgriculturalAnalyzer = new UI.Window(guiAnalyserObject);
guiAgriculturalAnalyzer.setInventoryNeeded(true);

var AgriculturalAnalyser = {
    container: null,
    tick: function(){
        var container = AgriculturalAnalyser.container;
        if(!container) return;

        var slotIn = container.getSlot("slotSeedIn");
        var slotOut = container.getSlot("slotSeedOut");
        var slotEnergy = container.getSlot("slotEnergy");
        var currentEnergy = ChargeItemRegistry.getEnergyStored(slotEnergy, "Eu");

        if(slotIn.id && !slotOut.id && currentEnergy){
            var level = slotIn.extra.getInt("scan");
            if(level < 4){
                var ned = AgriculturalAnalyser.energyForLevel(level);
                if(currentEnergy > ned){
                    ICTool.dischargeItem(slotEnergy, ned);
                    slotIn.extra.putInt("scan", level + 1);
                }
            }
            slotOut.id = slotIn.id;
            slotOut.count = slotIn.count;
            slotOut.data = slotIn.data;
            slotOut.extra = slotIn.extra;
            slotIn.id = 0;

            AgriculturalAnalyser.showAllValues(container, slotOut);
            container.validateAll();
        }else if(!slotOut.id){
            AgriculturalAnalyser.hideAllValues(container);
        }
    },
    hideAllValues: function(container){
        var content = container.getGuiContent();
        if(!content) return;
        var elements = content.elements;
        elements["cropName"] = null;
        elements["textTier"] = null;
        elements["discoveredBy"] = null;
        elements["discoveredByText"] = null;
        elements["attributes0"] = null;
        elements["attributes1"] = null;
        elements["attributes2"] = null;
        elements["growth"] = null;
        elements["gain"] = null;
        elements["resist"] = null;
        elements["growthText"] = null;
        elements["gainText"] = null;
        elements["resistText"] = null;
    },
    showAllValues: function(container, seedBagSlot){
        var elements = container.getGuiContent().elements;
        var font = {size: 18, color: Color.WHITE}
        var level = seedBagSlot.extra.getInt("scan");
        var crop = AgricultureAPI.cropCards[seedBagSlot.data];

        switch(level){
            case 4:
                this.showStats(seedBagSlot, elements);
            case 3:
                this.showAttributes(crop, font, elements);
            case 2:
                this.showTier(crop, font, elements);
                this.showDiscoveredBy(crop, font, elements);
            case 1:
                this.showName(crop, font, elements);
        }
    },
    showStats: function(slot, elements){
        var growth = slot.extra.getInt("growth");
        var gain = slot.extra.getInt("gain");
        var resist = slot.extra.getInt("resistance");
        var statsXpos = 560;

        elements["growthText"] = {type: "text", font: {size: 18, color: Color.rgb(0, 128, 0)}, x: statsXpos, y: 160, width: 256, height: 42, text: "Growth: "};
        elements["growth"] = {type: "text", font: {size: 18, color: Color.rgb(0, 128, 0)}, x: statsXpos, y: 200, width: 256, height: 42, text: growth.toString()};
        elements["gainText"] = {type: "text", font: {size: 18, color: Color.rgb(255, 255, 0)}, x: statsXpos, y: 240, width: 256, height: 42, text: "Gain: "};
        elements["gain"] = {type: "text", font: {size: 18, color: Color.rgb(255, 255, 0)}, x: statsXpos, y: 280, width: 256, height: 42, text: gain.toString()};
        elements["resistText"] = {type: "text", font: {size: 18, color: Color.rgb(0, 255, 255)}, x: statsXpos, y: 320, width: 256, height: 42, text: "Resistance: "};
        elements["resist"] = {type: "text", font: {size: 18, color: Color.rgb(0, 255, 255)}, x: statsXpos, y: 360, width: 256, height: 42, text: resist.toString()};
    },
    showDiscoveredBy: function(crop, font, elements){
        var discBy = crop.getDiscoveredBy();
        elements["discoveredByText"] = {type: "text", font: font, x: 270, y: 240, width: 256, height: 42, text: "Discovered by: "};
        elements["discoveredBy"] = {type: "text", font: font, x: 270, y: 280, width: 256, height: 42, text: discBy};
    },
    showTier: function(crop, font, elements){
        var tier = "Tier: " + AgriculturalAnalyser.getStringTier(crop.properties.tier);
        elements["textTier"] = {type: "text", font: font, x: 270, y: 200, width: 256, height: 42, text: tier};
    },
    showAttributes: function(crop, font, elements){
        var arr = AgriculturalAnalyser.getAttributesText(crop.attributes)
        for(var i in arr){
            elements["attributes"+i] = {type: "text", font: font, x: 270, y: 320 + 40 * i, width: 256, height: 42, text: arr[i]};
        }
    },
    showName: function(crop, font, elements){
        var name = AgriculturalAnalyser.getSeedName(crop.id);
        elements["cropName"] = {type: "text", font: font, x: 270, y: 160, width: 256, height: 42, text: name};
    },
    getStringTier: function(tier){
        switch (tier) {
            default: {
                return "0";
            }
            case 1: {
                return "I";
            }
            case 2: {
                return "II";
            }
            case 3: {
                return "III";
            }
            case 4: {
                return "IV";
            }
            case 5: {
                return "V";
            }
            case 6: {
                return "VI";
            }
            case 7: {
                return "VII";
            }
            case 8: {
                return "VIII";
            }
            case 9: {
                return "IX";
            }
            case 10: {
                return "X";
            }
            case 11: {
                return "XI";
            }
            case 12: {
                return "XII";
            }
            case 13: {
                return "XIII";
            }
            case 14: {
                return "XIV";
            }
            case 15: {
                return "XV";
            }
            case 16: {
                return "XVI";
            }
        }
    },
    energyForLevel: function(level){
        switch (level) {
            default: {
                return 10;
            }
            case 1: {
                return 90;
            }
            case 2: {
                return 900;
            }
            case 3: {
                return 9000;
            }
        }
    },
    getSeedName: function(name){
        return Translation.translate(name);
    },
    getAttributesText: function(attributes){
        var arr = ["", "", ""];
        for(var i in attributes){
            var indForPush = Math.floor((i) / 3);
            arr[indForPush] += attributes[i]+' ';
        }
        return arr;
    },
    dropItems: function(container){
        var coords = Player.getPosition();
        var slots = ["slotSeedIn", "slotSeedOut", "slotEnergy"]
        for(var i in slots){
            var slot = container.getSlot(slots[i]);
            nativeDropItem(coords.x, coords.y, coords.z, 0, slot.id, slot.count, slot.data, slot.extra);
            slot.id = 0;
        }
        container.validateAll();
    },
    showCropValues: function(te){
        switch(te.data.scanLevel){
            case 4:
                Game.message("Growth: " + te.data.statGrowth);
                Game.message("Gain: " + te.data.statGain);
                Game.message("Resistance: " + te.data.statResistance);
            case 2:
                Game.message("Tier: " + te.crop.properties.tier);
                Game.message("Discovered by: " + te.crop.getDiscoveredBy());
            case 1:
                Game.message(Translation.translate(te.crop.id));
        }
    },
    useFunction: function(coords, item, block){
        if(block.id == BlockID.crop){
            var tileEntity = World.getTileEntity(coords.x, coords.y, coords.z);
            if(!tileEntity.crop) return;
            AgriculturalAnalyser.showCropValues(tileEntity);
        } else {
            AgriculturalAnalyser.noTargetUseFunction(item);
        }
    },
    noTargetUseFunction: function(item){
        if(!AgriculturalAnalyser.container) AgriculturalAnalyser.container = new UI.Container();
        AgriculturalAnalyser.container.openAs(guiAgriculturalAnalyzer);
    }
};

Item.registerUseFunction("agriculturalAnalyzer", AgriculturalAnalyser.useFunction);
Item.registerNoTargetUseFunction("agriculturalAnalyzer", AgriculturalAnalyser.noTargetUseFunction);
Callback.addCallback("tick", AgriculturalAnalyser.tick);




// file: items/tool/weeding_trovel.js

IDRegistry.genItemID("weeding_trowel");
Item.createItem("weeding_trowel", "Weeding Trowel", {name: "weeding_trowel"}, {stack: 1});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.weeding_trowel , count: 1 , data: 0}, [
		"c c",
		" c ",
		"zcz"
	], ['c', 265, 0, 'z', ItemID.rubber, 0]);
});

Item.registerUseFunction("weeding_trowel",function(coords, item, block){
    var te = World.getTileEntity(coords.x, coords.y, coords.z);
    if(block.id == BlockID.crop && te.crop && te.crop.id == "weed"){
        World.drop(coords.x, coords.y, coords.z, ItemID.weed, te.data.currentSize, 0);
        te.reset();
        te.updateRender();
    }
});




// file: items/tool/painter.js

IDRegistry.genItemID("icPainter");
Item.createItem("icPainter", "Painter", {name: "ic_painter", meta: 0});

let painterCreativeGroup = [ItemID.icPainter];
for(let i = 1; i <= 16; i++){
	IDRegistry.genItemID("icPainter"+i);
	Item.createItem("icPainter"+i, "Painter", {name: "ic_painter", meta: i});
	Item.setMaxDamage(ItemID["icPanter"+i], 32);
	painterCreativeGroup.push(ItemID["icPainter"+i]);
}

Item.addCreativeGroup("ic2_painter", Translation.translate("Painter"), painterCreativeGroup);

Recipes.addShaped({id: ItemID.icPainter, count: 1, data: 0}, [
	" aa",
	" xa",
	"x  "
], ['x', 265, -1, 'a', 35, 0]);

Recipes.addShapeless({id: ItemID.icPainter1, count: 1, data: 0}, [{id: ItemID.icPainter, data: 0}, {id: 351, data: 16}]);
Recipes.addShapeless({id: ItemID.icPainter2, count: 1, data: 0}, [{id: ItemID.icPainter, data: 0}, {id: 351, data: 1}]);
Recipes.addShapeless({id: ItemID.icPainter3, count: 1, data: 0}, [{id: ItemID.icPainter, data: 0}, {id: 351, data: 2}]);
Recipes.addShapeless({id: ItemID.icPainter4, count: 1, data: 0}, [{id: ItemID.icPainter, data: 0}, {id: 351, data: 17}]);
Recipes.addShapeless({id: ItemID.icPainter5, count: 1, data: 0}, [{id: ItemID.icPainter, data: 0}, {id: 351, data: 18}]);

for(let i = 6; i <= 15; i++){
	Recipes.addShapeless({id: ItemID["icPainter"+i], count: 1, data: 0}, [{id: ItemID.icPainter, data: 0}, {id: 351, data: i-1}]);
}

Recipes.addShapeless({id: ItemID.icPainter16, count: 1, data: 0}, [{id: ItemID.icPainter, data: 0}, {id: 351, data: 19}]);

for(let i = 1; i <= 16; i++){
	Item.registerUseFunction("icPainter"+i, function(coords, item, block){
		if(CableRegistry.canBePainted(block.id)){
			World.setBlock(coords.x, coords.y, coords.z, block.id, i);
			item.data++;
			if(item.data >= Item.getMaxDamage(item.id))
				item.id = ItemID.icPainter;
			Player.setCarriedItem(item.id, 1, item.data);
		}
	});
}




// file: integration/recipe_viewer.js

ModAPI.addAPICallback("RecipeViewer", function(api){
	let RecipeViewer = api.Core;
	const Bitmap = android.graphics.Bitmap;
	const Canvas = android.graphics.Canvas;
	const Rect = android.graphics.Rect;

	let bmp, cvs, source;
	let x = y = 0;


	RecipeViewer.registerRecipeType("icpe_macerator", {
		contents: {
			icon: BlockID.macerator,
			drawing: [
				{type: "bitmap", x: 430, y: 200, scale: 6, bitmap: "macerator_bar_scale"}
			],
			elements: {
				input0: {type: "slot", x: 280, y: 190, size: 120},
				output0: {type: "slot", x: 600, y: 190, size: 120}
			}
		},
		getList: function(id, data, isUsage){
			let result;
			if(isUsage){
				result = MachineRecipeRegistry.getRecipeResult("macerator", id, data);
				return result ? [{
					input: [{id: id, count: 1, data: data}],
					output: [result]
				}] : [];
			}
			let list = [];
			let recipe = MachineRecipeRegistry.requireRecipesFor("macerator");
			let item;
			for(let key in recipe){
				result = recipe[key];
				if(result.id == id && (result.data == data || data == -1)){
					item = key.split(":");
					list.push({
						input: [{id: parseInt(item[0]), count: result.sourceCount || 1, data: parseInt(item[1] || 0)}],
						output: [result]
					});
				}
			}
			return list;
		}
	});


	RecipeViewer.registerRecipeType("icpe_compressor", {
		contents: {
			icon: BlockID.compressor,
			drawing: [
				{type: "bitmap", x: 430, y: 200, scale: 6, bitmap: "compressor_bar_scale"}
			],
			elements: {
				input0: {type: "slot", x: 280, y: 190, size: 120},
				output0: {type: "slot", x: 600, y: 190, size: 120}
			}
		},
		getList: function(id, data, isUsage){
			let result;
			if(isUsage){
				result = MachineRecipeRegistry.getRecipeResult("compressor", id, data);
				return result ? [{
					input: [{id: id, count: result.sourceCount || 1, data: data}],
					output: [{id: result.id, count: result.count, data: result.data}]
				}] : [];
			}
			let list = [];
			let recipe = MachineRecipeRegistry.requireRecipesFor("compressor");
			let item;
			for(let key in recipe){
				result = recipe[key];
				if(result.id == id && (result.data == data || data == -1)){
					item = key.split(":");
					list.push({
						input: [{id: parseInt(item[0]), count: result.sourceCount || 1, data: parseInt(item[1] || 0)}],
						output: [{id: result.id, count: result.count, data: result.data}]
					});
				}
			}
			return list;
		}
	});


	RecipeViewer.registerRecipeType("icpe_extractor", {
		contents: {
			icon: BlockID.extractor,
			drawing: [
				{type: "bitmap", x: 430, y: 200, scale: 6, bitmap: "extractor_bar_scale"}
			],
			elements: {
				input0: {type: "slot", x: 280, y: 190, size: 120},
				output0: {type: "slot", x: 600, y: 190, size: 120}
			}
		},
		getList: function(id, data, isUsage){
			let result;
			if(isUsage){
				result = MachineRecipeRegistry.getRecipeResult("extractor", id);
				return result ? [{
					input: [{id: id, count: 1, data: data}],
					output: [{id: result.id, count: result.count, data: 0}]
				}] : [];
			}
			let list = [];
			let recipe = MachineRecipeRegistry.requireRecipesFor("extractor");
			for(let key in recipe){
				result = recipe[key];
				if(result.id == id){
					list.push({
						input: [{id: parseInt(key), count: 1, data: 0}],
						output: [{id: result.id, count: result.count, data: 0}]
					});
				}
			}
			return list;
		}
	});


	RecipeViewer.registerRecipeType("icpe_solid_canner", {
		contents: {
			icon: BlockID.solidCanner,
			drawing: [
				{type: "bitmap", x: 325, y: 205, scale: 6, bitmap: "canner_arrow"},
				{type: "bitmap", x: 520, y: 205, scale: 6, bitmap: "arrow_bar_scale"}
			],
			elements: {
				input0: {type: "slot", x: 200, y: 190, size: 120},
				input1: {type: "slot", x: 390, y: 190, size: 120},
				output0: {type: "slot", x: 660, y: 190, size: 120}
			}
		},
		getList: function(id, data, isUsage){
			let list = [];
			let recipe = MachineRecipeRegistry.requireRecipesFor("solidCanner");
			let result;
			if(isUsage){
				result = MachineRecipeRegistry.getRecipeResult("solidCanner", id);
				if(result){
					return [{
						input: [{id: id, count: 1, data: 0}, {id: result.storage[0], count: result.storage[1], data: 0}],
						output: [{id: result.result[0], count: result.result[1], data: result.result[2]}]
					}];
				}
				for(let key in recipe){
					result = recipe[key];
					if(result.storage[0] == id){
						list.push({
							input: [{id: parseInt(key), count: 1, data: 0}, {id: result.storage[0], count: result.storage[1], data: 0}],
							output: [{id: result.result[0], count: result.result[1], data: result.result[2]}]
						});
					}
				}
				return list;
			}
			for(let key in recipe){
				result = recipe[key];
				if(result.result[0] == id){
					list.push({
						input: [{id: parseInt(key), count: 1, data: 0}, {id: result.storage[0], count: result.storage[1], data: 0}],
						output: [{id: result.result[0], count: result.result[1], data: result.result[2]}]
					});
				}
			}
			return list;
		}
	});
	
	
	RecipeViewer.registerRecipeType("icpe_canner", {
		contents: {
			icon: BlockID.canner,
			drawing: [
				{type: "bitmap", x: 200, y: 50, bitmap: "canner_background_recipe", scale: 6},
				{type: "bitmap", x: 194, y: 216, bitmap: "liquid_bar", scale: 6},
				{type: "bitmap", x: 662, y: 216, bitmap: "liquid_bar", scale: 6}
			],
			elements: {
				input0: {type: "slot", x: 200, y: 50, size: 108, bitmap: "default_slot"},
				input1: {type: "slot", x: 434, y: 212, size: 108, bitmap: "canner_slot_source_0"},
				output0: {type: "slot", x: 668, y: 50, size: 108, bitmap: "default_slot"}
			}
		},
		getList: function(id, data, isUsage){
			let list = [];
			let recipe = MachineRecipeRegistry.requireRecipesFor("solidCanner");
			let result;
			if(isUsage){
				result = MachineRecipeRegistry.getRecipeResult("solidCanner", id);
				if(result){
					return [{
						input: [{id: id, count: 1, data: 0}, {id: result.storage[0], count: result.storage[1], data: 0}],
						output: [{id: result.result[0], count: result.result[1], data: result.result[2]}]
					}];
				}
				for(let key in recipe){
					result = recipe[key];
					if(result.storage[0] == id){
						list.push({
							input: [{id: parseInt(key), count: 1, data: 0}, {id: result.storage[0], count: result.storage[1], data: 0}],
							output: [{id: result.result[0], count: result.result[1], data: result.result[2]}]
						});
					}
				}
				return list;
			}
			for(let key in recipe){
				result = recipe[key];
				if(result.result[0] == id){
					list.push({
						input: [{id: parseInt(key), count: 1, data: 0}, {id: result.storage[0], count: result.storage[1], data: 0}],
						output: [{id: result.result[0], count: result.result[1], data: result.result[2]}]
					});
				}
			}
			return list;
		}
	});

	let iconMetalFormer = [ItemID.craftingHammer, ItemID.cutter, ItemID.cableCopper0];

	RecipeViewer.registerRecipeType("icpe_metal_former", {
		contents: {
			icon: BlockID.metalFormer,
			drawing: [
				{type: "bitmap", x: 360, y: 220, scale: 6, bitmap: "metalformer_bar_scale"},
				{type: "bitmap", x: 450, y: 320, scale: 6, bitmap: "empty_button_up"}
			],
			elements: {
				slotMode: {type: "slot", x: 445, y: 320, z: 1, size: 112, visual: true, needClean: true, bitmap: "_default_slot_empty", source: {id: 0, count: 0, data: 0}},
				input0: {type: "slot", x: 220, y: 190, size: 120},
				output0: {type: "slot", x: 660, y: 190, size: 120}
			}
		},
		getList: function(id, data, isUsage){
			let list = [];
			let result;
			if(isUsage){
				for(let mode = 0; mode < 3; mode++){
					result = MachineRecipeRegistry.getRecipeResult("metalFormer" + mode, id);
					if(result){
						list.push({
							input: [{id: id, count: 1, data: data}],
							output: [{id: result.id, count: result.count, data: 0}],
							mode: mode
						});
					}
				}
				return list;
			}
			for(let mode = 0; mode < 3; mode++){
				let recipe = MachineRecipeRegistry.requireRecipesFor("metalFormer" + mode);
				for(let key in recipe){
					result = recipe[key];
					if(result.id == id){
						list.push({
							input: [{id: parseInt(key), count: 1, data: 0}],
							output: [{id: result.id, count: result.count, data: 0}],
							mode: mode
						});
					}
				}
			}
			return list;
		},
		onOpen: function(elements, data){
			if(!data){
				return;
			}
			let elem = elements.get("slotMode");
			elem.onBindingUpdated("source", {id: iconMetalFormer[data.mode], count: 1, data: 0});
		}
	});


	bmp = new Bitmap.createBitmap(63, 55, Bitmap.Config.ARGB_8888);
	cvs = new Canvas(bmp);
	source = UI.TextureSource.get("ore_washer_background");
	cvs.drawBitmap(source, new Rect(56, 17, 80, 72), new Rect(0, 0, 24, 55), null);
	cvs.drawBitmap(source, new Rect(80, 34, 119, 55), new Rect(24, 17, 63, 38), null);
	cvs.drawBitmap(UI.TextureSource.get("gui_water_scale"), 4, 4, null);
	cvs.drawBitmap(UI.TextureSource.get("ore_washer_bar_scale"), 42, 18, null);
	RecipeViewer.transparentBackground(bmp, Color.parseColor("#b3b3b3"));
	UI.TextureSource.put("ore_washer_background_edit", bmp);

	RecipeViewer.registerRecipeType("icpe_ore_washer", {
		contents: {
			icon: BlockID.oreWasher,
			drawing: [
				{type: "bitmap", x: 300, y: 110, scale: 5, bitmap: "ore_washer_background_edit"}
			],
			elements: {
				input0: {type: "slot", x: 515, y: 90, size: 90},
				output0: {type: "slot", x: 425, y: 315, size: 90},
				output1: {type: "slot", x: 515, y: 315, size: 90},
				output2: {type: "slot", x: 605, y: 315, size: 90}
			}
		},
		getList: function(id, data, isUsage){
			let result;
			if(isUsage){
				result = MachineRecipeRegistry.getRecipeResult("oreWasher", id);
				return result ? [{
					input: [{id: id, count: 1, data: data}],
					output: [
						{id: result[0] || 0, count: result[1] || 0, data: 0},
						{id: result[2] || 0, count: result[3] || 0, data: 0},
						{id: result[4] || 0, count: result[5] || 0, data: 0}
					]
				}] : [];
			}
			let list = [];
			let recipe = MachineRecipeRegistry.requireRecipesFor("oreWasher");
			for(let key in recipe){
				result = recipe[key];
				if(result[0] == id || result[2] == id || result[4] == id){
					list.push({
						input: [{id: parseInt(key), count: 1, data: 0}],
						output: [
							{id: result[0] || 0, count: result[1] || 0, data: 0},
							{id: result[2] || 0, count: result[3] || 0, data: 0},
							{id: result[4] || 0, count: result[5] || 0, data: 0}
						]
					});
				}
			}
			return list;
		}
	});


	bmp = Bitmap.createBitmap(80, 60, Bitmap.Config.ARGB_8888);
	cvs = new Canvas(bmp);
	cvs.drawBitmap(UI.TextureSource.get("thermal_centrifuge_background"), -36, -15, null);
	cvs.drawBitmap(UI.TextureSource.get("thermal_centrifuge_scale"), 44, 7, null);
	cvs.drawBitmap(UI.TextureSource.get("heat_scale"), 28, 48, null);
	cvs.drawBitmap(UI.TextureSource.get("indicator_green"), 52, 44, null);
	RecipeViewer.transparentBackground(bmp, Color.parseColor("#b3b3b3"));
	UI.TextureSource.put("thermal_centrifuge_background_edit", bmp);

	RecipeViewer.registerRecipeType("icpe_thermal_centrifuge", {
		contents: {
			icon: BlockID.thermalCentrifuge,
			drawing: [
				{type: "bitmap", x: 300, y: 100, scale: 5, bitmap: "thermal_centrifuge_background_edit"}
			],
			elements: {
				input0: {type: "slot", x: 200, y: 110, size: 90},
				output0: {type: "slot", x: 710, y: 110, size: 90},
				output1: {type: "slot", x: 710, y: 200, size: 90},
				output2: {type: "slot", x: 710, y: 290, size: 90},
				textHeat: {type: "text", x: 430, y: 410}
			}
		},
		getList: function(id, data, isUsage){
			let result;
			if(isUsage){
				result = MachineRecipeRegistry.getRecipeResult("thermalCentrifuge", id);
				return result ? [{
					input: [{id: id, count: 1, data: data}],
					output: [
						{id: result.result[0] || 0, count: result.result[1] || 0, data: 0},
						{id: result.result[2] || 0, count: result.result[3] || 0, data: 0},
						{id: result.result[4] || 0, count: result.result[5] || 0, data: 0}
					],
					heat: result.heat
				}] : [];
			}
			let list = [];
			let recipe = MachineRecipeRegistry.requireRecipesFor("thermalCentrifuge");
			for(let key in recipe){
				result = recipe[key];
				if(result.result[0] == id || result.result[2] == id || result.result[4] == id){
					list.push({
						input: [{id: parseInt(key), count: 1, data: 0}],
						output: [
							{id: result.result[0] || 0, count: result.result[1] || 0, data: 0},
							{id: result.result[2] || 0, count: result.result[3] || 0, data: 0},
							{id: result.result[4] || 0, count: result.result[5] || 0, data: 0}
						],
						heat: result.heat
					});
				}
			}
			return list;
		},
		onOpen: function(elements, data){
			let elem = elements.get("textHeat");
			elem.onBindingUpdated("text", data ? Translation.translate("Heat: ") + data.heat : "");
		}
	});


	bmp = Bitmap.createBitmap(104, 64, Bitmap.Config.ARGB_8888);
	cvs = new Canvas(bmp);
	cvs.drawBitmap(UI.TextureSource.get("blast_furnace_background"), 0, -11, null);
	cvs.drawBitmap(UI.TextureSource.get("progress_scale"), 50, 16, null);
	cvs.drawBitmap(UI.TextureSource.get("heat_scale"), 46, 52, null);
	cvs.drawBitmap(UI.TextureSource.get("indicator_green"), 70, 48, null);
	RecipeViewer.transparentBackground(bmp, Color.parseColor("#b3b3b3"));
	UI.TextureSource.put("blast_furnace_background_edit", bmp);

	RecipeViewer.registerRecipeType("icpe_blast_furnace", {
		contents: {
			icon: BlockID.blastFurnace,
			drawing: [
				{type: "bitmap", x: 200, y: 100, scale: 5, bitmap: "blast_furnace_background_edit"}
			],
			elements: {
				input0: {type: "slot", x: 240, y: 160, size: 90},
				input1: {type: "slot", x: 200, y: 284, size: 90, bitmap: "_default_slot_empty"},
				output0: {type: "slot", x: 730, y: 284, size: 90},
				output1: {type: "slot", x: 820, y: 284, size: 90}
			}
		},
		getList: function(id, data, isUsage){
			let list = [];
			let result, recipe;
			if(isUsage){
				result = MachineRecipeRegistry.getRecipeResult("blastFurnace", id);
				if(result){
					return [{
						input: [
							{id: id, count: 1, data: 0},
							{id: ItemID.cellAir, count: 1, data: 0},
						],
						output: [
							{id: result.result[0], count: result.result[1], data: 0},
							{id: result.result[2] || 0, count: result.result[3] || 0, data: 0}
						]
					}];
				}
				if(id == ItemID.cellAir){
					recipe = MachineRecipeRegistry.requireRecipesFor("blastFurnace");
					for(let key in recipe){
						result = recipe[key];
						list.push({
							input: [
								{id: parseInt(key), count: 1, data: 0},
								{id: ItemID.cellAir, count: 1, data: 0},
							],
							output: [
								{id: result.result[0], count: result.result[1], data: 0},
								{id: result.result[2] || 0, count: result.result[3] || 0, data: 0}
							]
						});
					}
					return list;
				}
				return [];
			}
			recipe = MachineRecipeRegistry.requireRecipesFor("blastFurnace");
			for(let key in recipe){
				result = recipe[key];
				if(result.result[0] == id || result.result[2] == id){
					list.push({
						input: [
							{id: parseInt(key), count: 1, data: 0},
							{id: ItemID.cellAir, count: 1, data: 0},
						],
						output: [
							{id: result.result[0], count: result.result[1], data: 0},
							{id: result.result[2] || 0, count: result.result[3] || 0, data: 0}
						]
					});
				}
			}
			return list;
		}
	});


});




// file: integration/tree_capitator.js

ModAPI.addAPICallback("TreeCapitator", function(api){
	api.registerTree([[BlockID.rubberTreeLog, -1], [BlockID.rubberTreeLogLatex, -1]], [BlockID.rubberTreeLeaves, -1]);
});




// file: core/shared.js

ModAPI.registerAPI("ICore", {
	Machine: MachineRegistry,
	Recipe: MachineRecipeRegistry,
	ChargeRegistry: ChargeItemRegistry,
	Cable: CableRegistry,
	Upgrade: UpgradeAPI,
	Reactor: ReactorAPI,
	Radiation: RadiationAPI,
	Tool: ICTool,
	Sound: SoundAPI,
	Agriculture: AgricultureAPI,
	ItemName: ItemName,
	UI: UIbuttons,
	Config: Config,
	Ore: OreGenerator,
	Integration: IntegrationAPI,
	
	registerEnergyPack: registerStoragePack,
	requireGlobal: function(command){
		return eval(command);
	}
});

Logger.Log("Industrial Core API shared with name ICore.", "API");




