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
var core_1 = require('@angular/core');
var track_item_component_1 = require('../track-item/track-item.component');
var TrackList = (function () {
    function TrackList(el) {
        this.el = el;
        this.onselect = new core_1.EventEmitter();
        this.elem = el.nativeElement;
    }
    TrackList.prototype.setTrack = function (track) {
        var _this = this;
        this.currentTrack = track;
        setTimeout(function () {
            var self = _this;
            var mult = 10;
            var frame = _this.elem.scrollTop;
            var end = _this.elem.querySelectorAll('.selected')[0].offsetTop;
            var cb = function () {
                if (frame >= end) {
                    return;
                }
                else {
                    frame += mult;
                    _this.elem.scrollTop = frame;
                    window.requestAnimationFrame(cb);
                }
            };
            window.requestAnimationFrame(cb);
        }, 100);
    };
    TrackList.prototype.ngOnInit = function () {
        var _this = this;
        this.control.subscribe(function (control) {
            _this.setTrack(control.track);
        });
    };
    TrackList.prototype.clicked = function (track) {
        this.onselect.emit(track);
    };
    TrackList.prototype.isSelected = function (track) {
        if (!track || !this.currentTrack || this.currentTrack.url !== track.url) {
            return false;
        }
        return track.url === this.currentTrack.url;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], TrackList.prototype, "trackList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', core_1.EventEmitter)
    ], TrackList.prototype, "control", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], TrackList.prototype, "onselect", void 0);
    TrackList = __decorate([
        core_1.Component({
            selector: 'track-list',
            template: "\n  <track-item *ngFor=\"let track of trackList\"\n   [track]=\"track\"\n   (click)='clicked(track)'\n   [class.selected]=\"isSelected(track)\">\n  </track-item>\n",
            moduleId: module.id,
            styleUrls: ['track-list.component.css'],
            directives: [track_item_component_1.TrackItem]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], TrackList);
    return TrackList;
}());
exports.TrackList = TrackList;
//# sourceMappingURL=track-list.component.js.map