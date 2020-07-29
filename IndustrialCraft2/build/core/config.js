var Config = {
    debugMode: __config__.getBool("debug_mode"),
    soundEnabled: __config__.getBool("sound_enabled"),
    machineSoundEnabled: __config__.getBool("machine_sounds"),
    voltageEnabled: __config__.getBool("voltage_enabled"),
    wireDamageEnabled: __config__.getBool("wire_damage_enabled"),
    reload: function () {
        var lang = FileTools.ReadKeyValueFile("games/com.mojang/minecraftpe/options.txt").game_language;
        this.gameLanguage = (lang || "en_US").substring(0, 2);
    }
};
Config.reload();
var player;
Callback.addCallback("LevelLoaded", function () {
    Config.reload();
    player = Player.get();
});
isLevelDisplayed = false;
Callback.addCallback("LevelDisplayed", function () {
    isLevelDisplayed = true;
});
Callback.addCallback("LevelLeft", function () {
    isLevelDisplayed = false;
});
// debug
var lasttime = -1;
var frame = 0;
if (Config.debugMode) {
    Callback.addCallback("tick", function () {
        var t = Debug.sysTime();
        if (frame++ % 20 == 0) {
            if (lasttime != -1) {
                tps = 1000 / (t - lasttime) * 20;
                Game.tipMessage(Math.round(tps * 10) / 10 + "tps");
            }
            lasttime = t;
        }
    });
}
