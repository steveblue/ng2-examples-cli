"use strict";
var Scene = (function () {
    function Scene() {
        this.landscape = [
            [0, 0, 0],
            [0, 1, 0],
            [0, 1, 1]
        ];
    }
    Scene.prototype.fetch = function (path) {
        var terrainLoader = new THREE.TerrainLoader();
        return new Promise(function (res, rej) {
            terrainLoader.load(path, function (data) {
                res([data, path]);
            });
        });
    };
    return Scene;
}());
exports.Scene = Scene;
//# sourceMappingURL=terrain.js.map