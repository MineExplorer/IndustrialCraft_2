var IntegrationAPI = {
	addToRecyclerBlacklist: function(id){
		recyclerBlacklist.push(id);
	},
	addToolBooxValidItem: function(id){
		toolbox_items.push(id);
	}
}

ModAPI.addAPICallback("TreeCapitator", function(api){
	api.registerTree([[BlockID.rubberTreeLog, -1], [BlockID.rubberTreeLogLatex, -1]], [BlockID.rubberTreeLeaves, -1]);
});