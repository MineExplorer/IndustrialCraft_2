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
var TileEntityMachine = /** @class */ (function (_super) {
    __extends(TileEntityMachine, _super);
    function TileEntityMachine() {
        var _this = _super.call(this) || this;
        // audio
        if (_this.getOperationSound) {
            _this.audioSource = null;
            _this.finishingSound = 0;
            if (!_this.getStartingSound) {
                _this.getStartingSound = function () { return null; };
            }
            if (!_this.getInterruptSound) {
                _this.getInterruptSound = function () { return null; };
            }
            _this.startPlaySound = _this.startPlaySound || function () {
                if (!ConfigIC.machineSoundEnabled)
                    return;
                if (!this.audioSource && !this.remove) {
                    if (this.finishingSound != 0) {
                        SoundManager.stop(this.finishingSound);
                    }
                    if (this.getStartingSound()) {
                        this.audioSource = SoundManager.createSource(AudioSource.TILEENTITY, this, this.getStartingSound());
                        this.audioSource.setNextSound(this.getOperationSound(), true);
                    }
                    else {
                        this.audioSource = SoundManager.createSource(AudioSource.TILEENTITY, this, this.getOperationSound());
                    }
                }
            };
            _this.stopPlaySound = _this.stopPlaySound || function () {
                if (this.audioSource) {
                    SoundManager.removeSource(this.audioSource);
                    this.audioSource = null;
                    if (this.getInterruptSound()) {
                        this.finishingSound = SoundManager.playSoundAtBlock(this, this.getInterruptSound());
                    }
                }
            };
        }
        // machine activation
        if (_this.defaultValues && _this.defaultValues.isActive !== undefined) {
            if (!_this.renderModel) {
                _this.renderModel = _this.renderModelWithRotation;
            }
            _this.setActive = _this.setActive || _this.setActive;
            _this.activate = _this.activate || function () {
                this.setActive(true);
            };
            _this.deactivate = _this.deactivate || function () {
                this.setActive(false);
            };
        }
        if (!_this.init && _this.renderModel) {
            _this.init = _this.renderModel;
        }
        return _this;
    }
    TileEntityMachine.prototype.onItemClick = function (id, count, data, coords) {
        if (id == ItemID.debugItem || id == ItemID.EUMeter)
            return false;
        return _super.prototype.onItemClick.call(this, id, count, data, coords);
    };
    TileEntityMachine.prototype.destroy = function () {
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
        return false;
    };
    return TileEntityMachine;
}(TileEntityBase));
