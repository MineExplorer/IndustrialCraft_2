var IntegrationAPI = {
	addToRecyclerBlacklist: function(id){
		recyclerBlacklist.push(id);
	},
	addToolBooxValidItem: function(id){
		toolbox_items.push(id);
	},
	registerQuantumArmorItem: function(id){
		QuantumArmor.chargedIDs.push(id);
	}
}