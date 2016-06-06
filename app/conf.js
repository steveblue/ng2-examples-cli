"use strict";
var uuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
var defaultRoom = function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
var config = {
    room: defaultRoom(),
    username: uuid(),
    server: 'https://synth-io-c7564.firebaseio.com/'
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = config;
//# sourceMappingURL=conf.js.map