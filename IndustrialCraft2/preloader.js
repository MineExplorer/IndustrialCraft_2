var File = java.io.File;

var target_path = __packdir__ + "assets/definitions/recipe";
var source_path = __dir__ + "assets/res/definitions/recipe";
var source = new File(source_path);
var files = source.list();
for (var i in files) {
	var fileName = files[i];
	new File(target_path, fileName).createNewFile();
}
