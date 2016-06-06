"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var media_service_1 = require('../../services/media-service');
var waveform_component_1 = require('../waveform/waveform.component');
var AudioPlayer = (function () {
    function AudioPlayer(elem, mediaService, context) {
        this.context = context;
        this.elem = elem.nativeElement;
        this.mediaService = mediaService;
        this.ctx = context;
        this.analyzer = this.ctx.createAnalyser();
        this.processor = this.ctx.createScriptProcessor(1024);
        this.processor.connect(this.ctx.destination);
        this.analyzer.connect(this.processor);
        this.freqData = new Uint8Array(this.analyzer.frequencyBinCount);
        this.onended = new core_1.EventEmitter();
    }
    AudioPlayer.prototype.ngOnInit = function () {
        var _this = this;
        this.audioElem = this.elem.querySelector('audio');
        this.sourceNode = this.ctx.createMediaElementSource(this.audioElem);
        this.sourceNode.connect(this.analyzer);
        this.sourceNode.connect(this.ctx.destination);
        this.control.subscribe(function (control) {
            if (control.action === 'play') {
                _this.audioElem.play();
            }
            if (control.action === 'pause') {
                _this.audioElem.pause();
            }
        });
    };
    AudioPlayer.prototype.ngOnDestroy = function () {
        this.processor.onaudioprocess = function () { };
        this.sourceNode.disconnect();
        this.sourceNode = null;
    };
    AudioPlayer.prototype.onPlay = function (ev) {
        var _this = this;
        var uint8ArrayToArray = function (uint8Array) {
            var array = [];
            for (var i = 0; i < uint8Array.byteLength; i++) {
                array[i] = uint8Array[i];
            }
            return array;
        };
        this.processor.onaudioprocess = function (e) {
            _this.analyzer.getByteFrequencyData(_this.freqData);
            _this.mediaService.setFrequencyData(uint8ArrayToArray(_this.freqData));
        };
    };
    AudioPlayer.prototype.onTrackEnded = function (ev) {
        this.processor.onaudioprocess = function () { };
        this.onended.emit();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], AudioPlayer.prototype, "url", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], AudioPlayer.prototype, "control", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], AudioPlayer.prototype, "onended", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], AudioPlayer.prototype, "controls", void 0);
    AudioPlayer = __decorate([
        core_1.Component({
            selector: 'audio-player',
            template: "\n  <audio controls src=\"{{url}}\" type=\"audio/mpeg\"\n  (play)=\"onPlay($event)\"\n  (ended)=\"onTrackEnded($event)\">\n  </audio>\n  <waveform-monitor></waveform-monitor>\n",
            directives: [waveform_component_1.WaveformComponent],
            providers: [media_service_1.MediaService],
            moduleId: module.id,
            styleUrls: ['audio-player.component.css']
        }),
        __param(2, core_1.Inject('audioContext')), 
        __metadata('design:paramtypes', [core_1.ElementRef, media_service_1.MediaService, Object])
    ], AudioPlayer);
    return AudioPlayer;
}());
exports.AudioPlayer = AudioPlayer;
//# sourceMappingURL=audio-player.component.js.map