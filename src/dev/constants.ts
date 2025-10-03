const NetworkDataKeys = {
  isActive: "active",
  isBoosted: "boosted",
  powerOutput: "power"
}

const IC2NetworkPackets = {
  demontage: "icpe.demontageMachine",
  cropLongClick: "icpe.cropDestroyStart",
  cutterLongClick: "icpe.cutterLongClick",
  hudClick: "icpe.clickHUDButton",
  jetpackFlying: "icpe.setFlying"
}

const EnergyProductionModifiers = {
	EUReactor: 5,
	FuelGenerator: 10,
  GeothermalGenerator: 20,
	SolarPanel: 1,
	Windmill: 10,
	Watermill: 3,
  RTGenerator: 1
}