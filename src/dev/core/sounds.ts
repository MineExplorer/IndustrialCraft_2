SoundRegistry.setBasePath(__dir__ + "assets/sounds/");

SoundRegistry.registerSound("GeneratorLoop.ogg", "Generators/GeneratorLoop.ogg");
SoundRegistry.registerSound("GeothermalLoop.ogg", "Generators/GeothermalLoop.ogg");
SoundRegistry.registerSound("WatermillLoop.ogg", "Generators/WatermillLoop.ogg");
SoundRegistry.registerSound("WindGenLoop.ogg", "Generators/WindGenLoop.ogg");
SoundRegistry.registerSound("MassFabLoop.ogg", "Generators/MassFabricator/MassFabLoop.ogg");
SoundRegistry.registerSound("MassFabScrapSolo.ogg", "Generators/MassFabricator/MassFabScrapSolo.ogg");
SoundRegistry.registerSound("GeigerHighEU.ogg", "Generators/NuclearReactor/GeigerHighEU.ogg");
SoundRegistry.registerSound("GeigerLowEU.ogg", "Generators/NuclearReactor/GeigerLowEU.ogg");
SoundRegistry.registerSound("GeigerMedEU.ogg", "Generators/NuclearReactor/GeigerMedEU.ogg");
SoundRegistry.registerSound("NuclearReactorLoop.ogg", "Generators/NuclearReactor/NuclearReactorLoop.ogg");

SoundRegistry.registerSound("CompressorOp.ogg", "Machines/CompressorOp.ogg");
SoundRegistry.registerSound("ElectrolyzerLoop.ogg", "Machines/ElectrolyzerLoop.ogg");
SoundRegistry.registerSound("ExtractorOp.ogg", "Machines/ExtractorOp.ogg");
SoundRegistry.registerSound("InterruptOne.ogg", "Machines/InterruptOne.ogg");
SoundRegistry.registerSound("IronFurnaceOp.ogg", "Machines/IronFurnaceOp.ogg");
SoundRegistry.registerSound("MaceratorOp.ogg", "Machines/MaceratorOp.ogg");
SoundRegistry.registerSound("MachineOverload.ogg", "Machines/MachineOverload.ogg");
SoundRegistry.registerSound("MagnetizerLoop.ogg", "Machines/MagnetizerLoop.ogg");
SoundRegistry.registerSound("MinerOp.ogg", "Machines/MinerOp.ogg");
SoundRegistry.registerSound("PumpOp.ogg", "Machines/PumpOp.ogg");
SoundRegistry.registerSound("RecyclerOp.ogg", "Machines/RecyclerOp.ogg");
SoundRegistry.registerSound("TerraformerGenericloop.ogg", "Machines/TerraformerGenericloop.ogg");
SoundRegistry.registerSound("ElectroFurnaceLoop.ogg", "Machines/Electro Furnace/ElectroFurnaceLoop.ogg");
SoundRegistry.registerSound("ElectroFurnaceStart.ogg", "Machines/Electro Furnace/ElectroFurnaceStart.ogg");
SoundRegistry.registerSound("ElectroFurnaceStop.ogg", "Machines/Electro Furnace/ElectroFurnaceStop.ogg");
SoundRegistry.registerSound("InductionLoop.ogg", "Machines/Induction Furnace/InductionLoop.ogg");
SoundRegistry.registerSound("InductionStart.ogg", "Machines/Induction Furnace/InductionStart.ogg");
SoundRegistry.registerSound("InductionStop.ogg", "Machines/Induction Furnace/InductionStop.ogg");
SoundRegistry.registerSound("TeleChargedLoop.ogg", "Machines/Teleporter/TeleChargedLoop.ogg");
SoundRegistry.registerSound("TeleUse.ogg", "Machines/Teleporter/TeleUse.ogg");

SoundRegistry.registerSound("BatteryUse.ogg", "Tools/BatteryUse.ogg");
SoundRegistry.registerSound("dynamiteomote.ogg", "Tools/dynamiteomote.ogg");
SoundRegistry.registerSound("eat.ogg", "Tools/eat.ogg");
SoundRegistry.registerSound("InsulationCutters.ogg", "Tools/InsulationCutters.ogg");
SoundRegistry.registerSound("JetpackLoop.ogg", "Tools/JetpackLoop.ogg");
SoundRegistry.registerSound("NukeExplosion.ogg", "Tools/NukeExplosion.ogg");
SoundRegistry.registerSound("ODScanner.ogg", "Tools/ODScanner.ogg");
SoundRegistry.registerSound("Painter.ogg", "Tools/Painter.ogg");
SoundRegistry.registerSound("RubberTrampoline.ogg", "Tools/RubberTrampoline.ogg");
SoundRegistry.registerSound("Treetap.ogg", "Tools/Treetap.ogg");
SoundRegistry.registerSound("Wrench.ogg", "Tools/Wrench.ogg");
SoundRegistry.registerSound("ChainsawIdle.ogg", "Tools/Chainsaw/ChainsawIdle.ogg");
SoundRegistry.registerSound("ChainsawStop.ogg", "Tools/Chainsaw/ChainsawStop.ogg");
SoundRegistry.registerSound("ChainsawUseOne.ogg", "Tools/Chainsaw/ChainsawUseOne.ogg");
SoundRegistry.registerSound("ChainsawUseTwo.ogg", "Tools/Chainsaw/ChainsawUseTwo.ogg");
SoundRegistry.registerSound("DrillHard.ogg", "Tools/Drill/DrillHard.ogg");
SoundRegistry.registerSound("DrillSoft.ogg", "Tools/Drill/DrillSoft.ogg");
SoundRegistry.registerSound("DrillUseLoop.ogg", "Tools/Drill/DrillUseLoop.ogg");
SoundRegistry.registerSound("MiningLaser.ogg", "Tools/MiningLaser/MiningLaser.ogg");
SoundRegistry.registerSound("MiningLaserExplosive.ogg", "Tools/MiningLaser/MiningLaserExplosive.ogg");
SoundRegistry.registerSound("MiningLaserLongRange.ogg", "Tools/MiningLaser/MiningLaserLongRange.ogg");
SoundRegistry.registerSound("MiningLaserLowFocus.ogg", "Tools/MiningLaser/MiningLaserLowFocus.ogg");
SoundRegistry.registerSound("MiningLaserScatter.ogg", "Tools/MiningLaser/MiningLaserScatter.ogg");
SoundRegistry.registerSound("NanosaberIdle.ogg", "Tools/Nanosaber/NanosaberIdle.ogg");
SoundRegistry.registerSound("NanosaberPowerup.ogg", "Tools/Nanosaber/NanosaberPowerup.ogg");
SoundRegistry.registerMultiSound("NanosaberSwing.ogg", ["Tools/Nanosaber/NanosaberSwing1.ogg", "Tools/Nanosaber/NanosaberSwing2.ogg", "Tools/Nanosaber/NanosaberSwing3.ogg"]);
SoundRegistry.registerSound("QuantumsuitBoots.ogg", "Tools/QuantumSuit/QuantumsuitBoots.ogg");

if (IC2Config.soundEnabled) {
    SoundManager.init(16);
}