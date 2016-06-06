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
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/operator/share');
var DataChannel = (function () {
    function DataChannel(_key, _id, _url) {
        var _this = this;
        this._key = _key;
        this._id = _id;
        this._url = _url;
        var self = this;
        this.id = _id || Math.random().toString().replace('.', ''); // the username, unique id that makes each peer => make uuid?
        this.key = _key || '1234'; // the room name.
        this.url = _url; // replace with your server name
        this.name = 'channel'; // the name of the channel
        this.db = new Firebase(this.url); // only supports Firebase for now, support for custom web socket server in the future.
        this.count = 0;
        this.hasPulse = false;
        this.isOpen = false;
        this.connections = {};
        this.remotePeer = null;
        this.isWebSocket = false;
        this.debug = false;
        this.store = { messages: [] };
        this.stun = {
            iceServers: [{
                    url: 'stun:stun.l.google.com:19302'
                }]
        };
        this.conf = {
            ordered: false,
            maxRetransmitTime: 1000
        };
        this.channels = {
            announce: this.db.child('announce'),
            signal: this.db.child('messages').child(this.id)
        };
        this.channels.signal.on('child_added', this.onSignal.bind(self));
        this.channels.announce.on('child_added', this.onAnnounce.bind(self));
        this.emitter = new core_1.EventEmitter();
        this.observer = new Observable_1.Observable(function (observer) { return _this.channelObserver = observer; }).share();
        this.sendAnnounce();
    }
    DataChannel.prototype.sendAnnounce = function () {
        var _this = this;
        var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection ||
            window.webkitRTCPeerConnection;
        var msg = {
            sharedKey: this.key,
            id: this.id,
            method: !RTCPeerConnection ? 'socket' : 'webrtc'
        };
        if (!RTCPeerConnection) {
            this.isWebSocket = true;
        }
        this.channels.announce.remove(function () {
            _this.channels.announce.push(msg);
            if (_this.debug)
                console.log('Announced our sharedKey is ' + _this.key);
            if (_this.debug)
                console.log('Announced our ID is ' + _this.id);
        });
    };
    DataChannel.prototype.onAnnounce = function (snapshot) {
        var msg = snapshot.val();
        if (msg.id != this.id && msg.sharedKey == this.key) {
            if (this.debug)
                console.log('Discovered matching announcement from ' + msg.id);
            this.remotePeer = msg.id;
            if (msg.method === 'webrtc' && this.isWebSocket === false) {
                this.init();
                this.connect();
            }
            else {
                this.sendSignal({
                    id: this.id,
                    key: this.key,
                    url: this.url,
                    type: 'ws-offer'
                });
                if (!this.isOpen) {
                    this.initSocket(msg);
                }
            }
        }
    };
    DataChannel.prototype.sendSignal = function (msg) {
        msg.sender = this.id;
        this.db.child('messages').child(this.remotePeer).push(msg);
    };
    DataChannel.prototype.onOffer = function (msg) {
        var _this = this;
        var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;
        this.hasPulse = true;
        if (this.debug)
            console.log('Client has pulse');
        this.remotePeer = msg.sender;
        this.init();
        this.sendCandidates();
        this.peerConnection.setRemoteDescription(new RTCSessionDescription(msg));
        this.peerConnection.createAnswer(function (sessionDescription) {
            if (_this.debug)
                console.log('Sending answer to ' + msg.sender);
            _this.peerConnection.setLocalDescription(sessionDescription);
            _this.sendSignal(sessionDescription.toJSON());
        }, function (err) {
            if (this.debug)
                console.error('Could not create offer', err);
        });
    };
    DataChannel.prototype.onAnswerSignal = function (msg) {
        var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;
        if (this.debug)
            console.log('Handling answer from ' + this.remotePeer);
        this.peerConnection.setRemoteDescription(new RTCSessionDescription(msg));
    };
    DataChannel.prototype.onCandidateSignal = function (msg) {
        var candidate = new window.RTCIceCandidate(msg);
        if (this.debug)
            console.log('Adding candidate to peerConnection: ' + this.remotePeer);
        this.peerConnection.addIceCandidate(candidate);
    };
    DataChannel.prototype.onSignal = function (snapshot) {
        var msg = snapshot.val();
        var sender = msg.sender;
        var type = msg.type;
        if (!this.isOpen) {
            if (this.debug)
                console.log('Received a \'' + type + '\' signal from ' + sender + ' of type ' + type);
            if (type == 'message') {
                this.onWebSocketMessage(msg);
            }
            if (type == 'ws-offer') {
                if (!this.isOpen) {
                    this.initSocket(msg);
                }
            }
            if (type == 'offer') {
                this.onOffer(msg);
            }
            else if (type == 'answer') {
                this.onAnswerSignal(msg);
            }
            else if (type == 'candidate' && this.hasPulse) {
                this.onCandidateSignal(msg);
            }
        }
    };
    DataChannel.prototype.sendCandidates = function () {
        this.peerConnection.onicecandidate = this.onICECandidate.bind(this);
    };
    DataChannel.prototype.onICEStateChange = function () {
        if (this.peerConnection.iceConnectionState == 'disconnected') {
            if (this.debug)
                console.log('Client disconnected!');
            this.sendAnnounce();
        }
    };
    DataChannel.prototype.onICECandidate = function (ev) {
        var candidate = ev.candidate;
        if (candidate) {
            candidate = candidate.toJSON();
            candidate.type = 'candidate';
            if (this.debug)
                console.log('Sending candidate to ' + this.remotePeer);
            this.sendSignal(candidate);
        }
        else {
            if (this.debug)
                console.log('All candidates sent');
        }
    };
    DataChannel.prototype.onDataChannel = function (ev) {
        ev.channel.onmessage = this.onDataChannelMessage.bind(this);
    };
    DataChannel.prototype.onDataChannelOpen = function () {
        if (this.debug)
            console.log('Data channel created! The channel is: ' + this.channel.readyState);
        if (this.channel.readyState == 'open') {
            this.isOpen = true;
            this.emitter.emit('open');
        }
    };
    DataChannel.prototype.onDataChannelClosed = function () {
        if (this.debug)
            console.log('The data channel has been closed!');
    };
    DataChannel.prototype.onDataChannelMessage = function (ev) {
        this.store.messages.push({
            id: this.count++,
            data: JSON.parse(ev.data),
            sender: this.remotePeer,
            createdAt: new Date()
        });
        this.channelObserver.next(this.store.messages);
        if (this.debug)
            console.log('Received Message: ' + ev.data);
    };
    DataChannel.prototype.onWebSocketMessage = function (ev) {
        this.store.messages.push({
            id: this.count++,
            data: JSON.parse(ev.data),
            sender: ev.sender,
            createdAt: new Date()
        });
        console.log(JSON.parse(ev.data));
        this.channelObserver.next(this.store.messages);
        if (this.debug)
            console.log('Received Message: ' + ev.data);
    };
    DataChannel.prototype.onWebSocketSignal = function (snapshot) {
        var msg = snapshot.val();
        var sender = msg.sender;
        var type = msg.type;
        console.log(msg);
        if (sender === this.remotePeer) {
            if (this.debug)
                console.log('Received a \'' + type + '\' signal from ' + sender + ' of type ' + type);
            if (type == 'message') {
                this.onWebSocketMessage(msg);
            }
            if (type == 'ws-offer') {
                this.initSocket(msg);
            }
            if (type == 'offer') {
                this.onOffer(msg);
            }
            else if (type == 'answer') {
                this.onAnswerSignal(msg);
            }
            else if (type == 'candidate' && this.hasPulse) {
                this.onCandidateSignal(msg);
            }
        }
    };
    DataChannel.prototype.sendSocketMessage = function (data) {
        var msg = {
            type: 'message',
            sender: this.id,
            data: data
        };
        console.log(msg);
        if (this.debug)
            console.log('Sending WebSocket message from: ' + msg.sender + ' to: ' + this.remotePeer);
        this.db.child('messages').child(this.remotePeer).push(msg);
    };
    DataChannel.prototype.createWebSocketChannel = function () {
        return {
            send: this.sendSocketMessage.bind(this)
        };
    };
    DataChannel.prototype.connect = function () {
        var _this = this;
        this.sendCandidates();
        this.peerConnection.createOffer(function (sessionDescription) {
            if (_this.debug)
                console.log('Sending offer to ' + _this.remotePeer);
            _this.peerConnection.setLocalDescription(sessionDescription);
            _this.sendSignal(sessionDescription.toJSON());
        }, function (err) {
            console.error('Could not create offer for ' + this.remotePeer, err);
        });
    };
    DataChannel.prototype.init = function () {
        var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection ||
            window.webkitRTCPeerConnection;
        this.peerConnection = new RTCPeerConnection(this.stun);
        this.peerConnection.ondatachannel = this.onDataChannel.bind(this);
        this.peerConnection.oniceconnectionstatechange = this.onICEStateChange.bind(this);
        this.channel = this.peerConnection.createDataChannel(this.name, this.conf);
        this.channel.onopen = this.onDataChannelOpen.bind(this);
        this.channel.onmessage = this.onDataChannelMessage.bind(this);
        this.connections[this.remotePeer] = this.peerConnection;
        if (this.debug)
            console.log('Setting up peer connection with ' + this.remotePeer);
    };
    DataChannel.prototype.initSocket = function (conf) {
        this.remotePeer = conf.id;
        if (!this.isOpen) {
            this.isOpen = true;
            this.emitter.emit('open');
            this.channel = this.createWebSocketChannel();
            this.channels.websocket = this.db.child('messages').child(this.id);
            this.channels.websocket.on('child_added', this.onWebSocketSignal.bind(this));
            this.hasPulse = true;
            if (this.debug)
                console.log('Client has pulse');
            if (this.debug)
                console.log('Setting up websocket connection with ' + this.remotePeer);
        }
    };
    DataChannel = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [String, String, String])
    ], DataChannel);
    return DataChannel;
}());
exports.DataChannel = DataChannel;
//# sourceMappingURL=data-channel.js.map