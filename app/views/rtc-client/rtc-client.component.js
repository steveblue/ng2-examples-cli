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
var conf_1 = require('../../conf');
var core_1 = require('@angular/core');
var data_channel_1 = require('../../services/data-channel');
var DataChannelClient = (function () {
    function DataChannelClient(_ref, _el) {
        this._ref = _ref;
        this._el = _el;
        this.headline = 'DataChannel';
        this.copy = 'WebRTC DataChannels allow for fast peer to peer communication. This example creates a channel, gives the client a unique identifier (i.e. username), and establishes the connection. Firebase is used for signaling. Once the connection is established, the keyCode for whatever key is typed will appear in the remote UI. Open two windows of Chrome or Firefox to test DataChannel. This service will fallback to WebSocket connection via Firebase if the peer cannot support PeerConnection. A demo featuring first person controls in a WebGL scene is in the remote section.';
        this.ref = _ref;
        this.elem = _el.nativeElement;
        this.isConnected = false;
        console.log(conf_1.default);
    }
    DataChannelClient.prototype.onKeyDown = function (ev) {
        var msg = JSON.stringify({
            val: ev.keyCode
        });
        this.client.channel.send(msg);
        if (ev.keyCode === 13) {
            ev.target.value = '';
        }
    };
    DataChannelClient.prototype.updateMessages = function (message) {
        if (this.messages.length > 24)
            this.messages = [];
        this.ref.detectChanges();
    };
    DataChannelClient.prototype.onClick = function () {
        var _this = this;
        if (!this.isConnected) {
            this.client = new data_channel_1.DataChannel(conf_1.default.room, conf_1.default.username, conf_1.default.server);
            this.messages = [];
            this.client.emitter.subscribe(function (message) {
                if (message === 'open') {
                    _this.isConnected = true;
                    _this.elem.querySelector('input').focus();
                    _this.client.observer.subscribe(function (res) {
                        var data = res[res.length - 1];
                        console.log(data);
                        _this.messages.push(data);
                        _this.updateMessages(message);
                    });
                }
            });
        }
    };
    DataChannelClient = __decorate([
        core_1.Component({
            selector: 'view',
            moduleId: module.id,
            template: "\n  <h1>\n    {{ headline }}\n  </h1>\n  <p class=\"copy\">\n    {{copy}}\n  </p>\n  <p class=\"button\" (click)=\"onClick($event)\" [ngClass]=\"{ 'is--disabled' : isConnected }\">\n    <span *ngIf=\"!isConnected\"> Open Connection </span>\n    <span *ngIf=\"isConnected\"> Connected </span>\n  </p>\n  <input type=\"text\" (keypress)=\"onKeyDown($event)\"/>\n  <ul>\n    <li *ngFor=\"let message of messages\">\n      <p>{{message.data.val}}</p>\n    </li>\n  </ul>\n  ",
            styleUrls: ['rtc-client.component.css']
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef, core_1.ElementRef])
    ], DataChannelClient);
    return DataChannelClient;
}());
exports.DataChannelClient = DataChannelClient;
//# sourceMappingURL=rtc-client.component.js.map