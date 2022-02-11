ConfigureMultiplayer({
	isClientOnly: false
});
ModAPI.addAPICallback("KernelExtension", function(api) {
	Launch(api);
});
