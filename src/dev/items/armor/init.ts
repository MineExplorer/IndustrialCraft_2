/// <reference path="./ItemArmorIC2.ts" />
/// <reference path="./ItemArmorHazmat.ts" />
/// <reference path="./ItemArmorJetpackElectric.ts" />
/// <reference path="./ItemArmorBatpack.ts" />
/// <reference path="./ItemArmorNightvisionGoggles.ts" />
/// <reference path="./ItemArmorNanoSuit.ts" />
/// <reference path="./ItemArmorQuantumSuit.ts" />
/// <reference path="./ItemArmorSolarHelmet.ts" />

ItemRegistry.addArmorMaterial("bronze", {durabilityFactor: 14, enchantability: 10, repairItem: ItemID.ingotBronze});

new ItemArmorIC2("bronzeHelmet", "bronze_helmet", {type: "helmet", defence: 2, texture: "bronze", material: "bronze"});
new ItemArmorIC2("bronzeChestplate", "bronze_chestplate", {type: "chestplate", defence: 6, texture: "bronze", material: "bronze"});
new ItemArmorIC2("bronzeLeggings", "bronze_leggings", {type: "leggings", defence: 6, texture: "bronze", material: "bronze"});
new ItemArmorIC2("bronzeBoots", "bronze_boots", {type: "boots", defence: 6, texture: "bronze", material: "bronze"});

ItemRegistry.addArmorMaterial("composite", {durabilityFactor: 50, enchantability: 8, repairItem: ItemID.plateAlloy});

new ItemArmorIC2("compositeHelmet", "composite_helmet", {type: "helmet", defence: 3, texture: "composite", material: "composite"});
new ItemArmorIC2("compositeChestplate", "composite_chestplate", {type: "chestplate", defence: 8, texture: "composite", material: "composite"});
new ItemArmorIC2("compositeLeggings", "composite_leggings", {type: "leggings", defence: 6, texture: "composite", material: "composite"});
new ItemArmorIC2("compositeBoots", "composite_boots", {type: "boots", defence: 3, texture: "composite", material: "composite"});

new ItemArmorHazmat("hazmatHelmet", "hazmat_helmet", {type: "helmet", defence: 1, texture: "hazmat"});
new ItemArmorHazmat("hazmatChestplate", "hazmat_chestplate", {type: "chestplate", defence: 1, texture: "hazmat"});
new ItemArmorHazmat("hazmatLeggings", "hazmat_leggings", {type: "leggings", defence: 1, texture: "hazmat"});
new ItemArmorHazmat("rubberBoots", "rubber_boots", {type: "boots", defence: 1, texture: "rubber"});

new ItemArmorJetpackElectric();

new ItemArmorBatpack("batpack", "batpack", 60000, 100, 1);
new ItemArmorBatpack("advBatpack", "advanced_batpack", 600000, 512, 2);
new ItemArmorBatpack("energypack", "energypack", 2000000, 2048, 3);
new ItemArmorBatpack("lappack", "lappack", 10000000, 8192, 4).setRarity(1);

Item.addCreativeGroup("batteryPack", Translation.translate("Battery Packs"), [
	ItemID.batpack,
	ItemID.advBatpack,
	ItemID.energypack,
	ItemID.lappack
]);

new ItemArmorNightvisionGoggles();

new ItemArmorNanoSuit("nanoHelmet", "nano_helmet", {type: "helmet", defence: 4});
new ItemArmorNanoSuit("nanoChestplate", "nano_chestplate", {type: "chestplate", defence: 9});
new ItemArmorNanoSuit("nanoLeggings", "nano_leggings", {type: "leggings", defence: 7});
new ItemArmorNanoSuit("nanoBoots", "nano_boots", {type: "boots", defence: 4});

new ItemArmorQuantumSuit("quantumHelmet", "quantum_helmet", {type: "helmet", defence: 4});
new ItemArmorQuantumSuit("quantumChestplate", "quantum_chestplate", {type: "chestplate", defence: 9});
new ItemArmorQuantumSuit("quantumLeggings", "quantum_leggings", {type: "leggings", defence: 7});
new ItemArmorQuantumSuit("quantumBoots", "quantum_boots", {type: "boots", defence: 4});

UIbuttons.setArmorButton(ItemID.quantumHelmet, "button_nightvision");
UIbuttons.setArmorButton(ItemID.quantumChestplate, "button_fly");
UIbuttons.setArmorButton(ItemID.quantumChestplate, "button_hover");
UIbuttons.setArmorButton(ItemID.quantumBoots, "button_jump");

new ItemArmorSolarHelmet("solarHelmet", "solar_helmet", {type: "helmet", defence: 2, texture: "solar"});