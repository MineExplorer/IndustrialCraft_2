var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ItemArmorIC2 = /** @class */ (function (_super) {
    __extends(ItemArmorIC2, _super);
    function ItemArmorIC2(nameID, name, params, inCreative) {
        var _this = _super.call(this, nameID, name, name, params) || this;
        _this.createItem(inCreative);
        return _this;
    }
    ItemArmorIC2.prototype.setArmorTexture = function (name) {
        var index = (this.armorType == "leggings") ? 2 : 1;
        this.texture = 'armor/' + name + '_' + index + '.png';
        return this;
    };
    return ItemArmorIC2;
}(ItemArmor));
