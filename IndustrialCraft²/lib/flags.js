var Flags = {
	allFlags: {},
	
	addFlag: function(name) {
		if (this.allFlags[name]) {
			return true;
		}
		else {
			this.allFlags[name] = true;
			return false;
		}
	},
	
	getFlag: function(name) {
		return this.allFlags[name] ? true : false;
	},
	
	addUniqueAction: function(name, action) {
		if (!this.addFlag(name)) {
			action();
		}
	},
	
	assertFlag: function(name) {
		if (!this.getFlag(name)) {
			Logger.Log("Assertion failed: flag '" + name + "' does not exist", "ERROR");
		}
	}
};

registerAPIUnit("Flags", Flags);