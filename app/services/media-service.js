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
var http_1 = require('@angular/http');
var media_1 = require('../schema/media');
require('rxjs/add/operator/map');
var emitter = new core_1.EventEmitter();
var MediaService = (function () {
    function MediaService(http) {
        this.http = http;
        this.http = http;
        this.emitter = emitter;
    }
    MediaService.prototype.get = function () {
        return this.http.get('/app/models/media.json')
            .map(function (responseData) {
            return responseData.json().media;
        })
            .map(function (media) {
            var result = [];
            if (media) {
                media.forEach(function (media) {
                    result.push(new media_1.Media(media.artist, media.title, media.url, media.imageUrl, media.index));
                });
            }
            return result;
        });
    };
    MediaService.prototype.setFrequencyData = function (data) {
        emitter.next(data);
    };
    MediaService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], MediaService);
    return MediaService;
}());
exports.MediaService = MediaService;
//# sourceMappingURL=media-service.js.map