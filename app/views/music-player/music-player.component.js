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
var media_service_1 = require('../../services/media-service');
var track_list_component_1 = require("../../components/track-list/track-list.component");
var audio_player_component_1 = require("../../components/audio-player/audio-player.component");
var MusicPlayer = (function () {
    function MusicPlayer(mediaService) {
        var _this = this;
        this.mediaService = mediaService;
        this.playhead = 0;
        this.currentTrack = {};
        this.controller = new core_1.EventEmitter();
        mediaService.get().subscribe(function (res) {
            _this.tracks = res;
            _this.currentTrack = _this.tracks[_this.playhead];
        });
    }
    MusicPlayer.prototype.ngOnInit = function () {
    };
    MusicPlayer.prototype.onTrackSelected = function (track) {
        this.playhead = this.tracks.indexOf(track);
        this.currentTrack = this.tracks[this.playhead];
        this.controller.emit({
            action: 'play',
            track: this.currentTrack
        });
    };
    MusicPlayer.prototype.prevTrack = function () {
        this.playhead = this.tracks.indexOf(this.currentTrack);
        this.playhead--;
        this.currentTrack = this.tracks[this.playhead];
        this.controller.emit({
            action: 'play',
            track: this.currentTrack
        });
    };
    MusicPlayer.prototype.nextTrack = function () {
        this.playhead = this.tracks.indexOf(this.currentTrack);
        this.playhead++;
        this.currentTrack = this.tracks[this.playhead];
        this.controller.emit({
            action: 'play',
            track: this.currentTrack
        });
    };
    MusicPlayer = __decorate([
        core_1.Component({
            selector: 'view',
            moduleId: module.id,
            template: "\n  <div class=\"music__player\">\n  \n    <audio-player\n      [url]=\"currentTrack.url\"\n      [control]=\"controller\"\n      (onended)=\"nextTrack()\">\n    </audio-player>\n    \n    <track-list\n      [trackList]=\"tracks\"\n      [control]=\"controller\"\n      (onselect)=\"onTrackSelected($event)\">\n    </track-list>\n\n  </div>\n",
            styleUrls: ['music-player.component.css'],
            directives: [track_list_component_1.TrackList, audio_player_component_1.AudioPlayer],
            providers: [media_service_1.MediaService, core_1.provide('audioContext', { useValue: new (window['AudioContext'] || window['webkitAudioContext']) })]
        }), 
        __metadata('design:paramtypes', [media_service_1.MediaService])
    ], MusicPlayer);
    return MusicPlayer;
}());
exports.MusicPlayer = MusicPlayer;
//# sourceMappingURL=music-player.component.js.map