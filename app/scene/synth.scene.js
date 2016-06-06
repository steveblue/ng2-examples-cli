"use strict";
var rutt_shader_1 = require('./rutt.shader');
var Synth = (function () {
    function Synth(_video, _control, _cam, _json) {
        this._video = _video;
        this._control = _control;
        this._cam = _cam;
        this._json = _json;
        this.detail = 480;
        this.hd = true;
        this.mouseX = 0;
        this.mouseY = 0;
        this.videoisplaying = false;
        this.audioin = false;
        //freqBars = document.getElementsByClassName('audio-input');
        //audioInput = document.getElementById('audio');
        //audioInput.current = 0;
        this.audioisplaying = false;
        //frequencyData = new Uint8Array(audioAnalyzer.frequencyBinCount);
        //console.log(audioAnalyzer, frequencyData);
        // dropZone = document.getElementById('drop_zone');
        // readFiles = document.getElementById('read_files');
        // dropZoneVideo = document.getElementById('video_drop');
        // readFilesVideo = document.getElementById('read_video');
        this.webcam = false;
        this.guiSetup = false;
        this.initComplete = false;
        this.menusEnabled = true;
        this.controls = false;
        this.trigger = false;
        this.shape = '';
        this.meshUpdate = false;
        this.wireframe = false;
        this.camerax = 0.0;
        this.cameray = -1130.0;
        this.cameraz = 1680.0;
        this.scale = 5.0;
        this.multiplier = 1.0;
        this.displace = 1.0;
        this.transparency = 0.8;
        this.originX = 0.0;
        this.originY = 0.0;
        this.originZ = -2000.0;
        this.hue = 0;
        this.saturation = 0.9;
        this.bgColor = '#000000';
        this.opacity = 1;
        //setting.current = 0;
        this.presets = [];
        this.videoInput = _video;
        this.cam = _cam;
        this.control = _control;
        this.mouseX = this.mousex = 0;
        this.mouseY = this.mousey = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        this.vendorURL = window.URL;
        this.config = _json;
        this.init(_json);
    }
    Synth.prototype.init = function (_conf) {
        var that = this;
        this.clock = new THREE.Clock();
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
        this.scene = new THREE.Scene();
        this.texture = new THREE.Texture(this.videoInput);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.format = THREE.RGBFormat;
        this.texture.generateMipmaps = true;
        this.videoMaterial = new THREE.ShaderMaterial({
            uniforms: {
                "tDiffuse": {
                    type: "t",
                    value: this.texture
                },
                "multiplier": {
                    type: "f",
                    value: this.multiplier
                },
                "displace": {
                    type: "f",
                    value: this.displace
                },
                "opacity": {
                    type: "f",
                    value: this.opacity
                },
                "originX": {
                    type: "f",
                    value: this.originX
                },
                "originY": {
                    type: "f",
                    value: this.originY
                },
                "originZ": {
                    type: "f",
                    value: this.originZ
                }
            },
            vertexShader: rutt_shader_1.RuttEtraShader.vertexShader,
            fragmentShader: rutt_shader_1.RuttEtraShader.fragmentShader,
            depthWrite: true,
            depthTest: true,
            wireframe: this.wireframe,
            transparent: true,
            overdraw: false
        });
        this.videoMaterial.renderToScreen = true;
        this.videoMaterial.wireframe = true;
        // this.renderer.autoClear = false;
        // this.fill = new THREE.AmbientLight(0x707070); // soft white light
        // this.scene.add(this.fill);
        this.key = new THREE.SpotLight(0xffffff);
        this.key.position.set(0, 0, 5000).normalize();
        //this.key.target = this.mesh;
        // this.key.intensity = 5000;
        // this.key.castShadow = true;
        this.scene.add(this.key);
        this.back = new THREE.SpotLight(0xffffff);
        this.back.position.set(0, 0, -5000).normalize();
        this.back.intensity = 5000;
        this.back.castShadow = true;
        this.scene.add(this.back);
        if (this.cam === true) {
            this.initStream();
        }
        Promise.all([
            System.import('/vendor/three/examples/js/shaders/CopyShader.js'),
            System.import('/vendor/three/examples/js/shaders/ConvolutionShader.js'),
            System.import('/vendor/three/examples/js/shaders/BokehShader.js'),
            System.import('/vendor/three/examples/js/shaders/HueSaturationShader.js'),
            System.import('/vendor/three/examples/js/postprocessing/EffectComposer.js')
        ]).then(function () {
            return Promise.all([
                System.import('/vendor/three/examples/js/postprocessing/MaskPass.js'),
                System.import('/vendor/three/examples/js/postprocessing/RenderPass.js'),
                System.import('/vendor/three/examples/js/postprocessing/ShaderPass.js'),
                System.import('/vendor/three/examples/js/postprocessing/BokehPass.js')]);
        }).then(function () {
            //postprocessing
            that.composer = new THREE.EffectComposer(that.renderer);
            that.renderModel = new THREE.RenderPass(that.scene, that.camera);
            that.composer.addPass(that.renderModel);
            that.effectHue = new THREE.ShaderPass(THREE.HueSaturationShader);
            that.effectHue.renderToScreen = true;
            that.effectHue.uniforms['hue'].value = 0.0;
            that.effectHue.uniforms['saturation'].value = 0.0;
            that.composer.addPass(that.effectHue);
            that.setDefaults(_conf, 0);
            that.initComplete = true;
        });
        window.addEventListener('resize', this.onResize.bind(this), false);
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    Synth.prototype.update = function () {
        window.requestAnimationFrame(this.update.bind(this));
        this.render();
    };
    Synth.prototype.render = function () {
        var delta = this.clock.getDelta();
        if (this.videoInput.readyState === 4) {
            if (this.texture)
                this.texture.needsUpdate = true;
            if (this.videoMaterial)
                this.videoMaterial.needsUpdate = true;
        }
        this.camera.lookAt(this.scene.position);
        if (this.composer !== undefined) {
            this.composer.render(delta);
        }
        else {
            this.renderer.render(this.scene, this.camera);
        }
    };
    Synth.prototype.meshChange = function (shape, x, s) {
        var that = this;
        that.shape = shape;
        if (x === null || x === undefined) {
            x = 64;
        }
        if (s === null || s === undefined) {
            s = 64;
        }
        if (x >= 480) {
            x = 480;
        }
        else {
        }
        if (s >= 480) {
            s = 480;
        }
        if (that.meshUpdate === true) {
            that.geometry.verticesNeedUpdate = false;
            that.geometry.dynamic = false;
            that.geometry = null;
            that.videoMaterial.renderToScreen = false;
            that.scene.remove(that.mesh);
        }
        switch (shape) {
            case 'plane':
                if (that.hd === true) {
                    var y = (9 * x) / 16;
                    that.geometry = new THREE.PlaneGeometry(x, x, y, y);
                }
                else {
                    that.geometry = new THREE.PlaneGeometry(x, s, x, s);
                }
                that.mesh = new THREE.Mesh(that.geometry, that.videoMaterial);
                break;
            case 'sphere':
                that.geometry = new THREE.SphereGeometry(x, s, s);
                that.mesh = new THREE.Mesh(that.geometry, that.videoMaterial);
                break;
            case 'cube':
                if (x > 60 || s > 60) {
                    x = s = 60;
                }
                that.geometry = new THREE.BoxGeometry(x, x, x, s, s, s);
                that.mesh = new THREE.Mesh(that.geometry, that.videoMaterial);
                break;
            case 'cylinder':
                that.geometry = new THREE.CylinderGeometry(that.scale * 2.0, that.scale * 2.0, x * 8.0, s, x, false);
                that.mesh = new THREE.Mesh(that.geometry, that.videoMaterial);
                break;
            case 'torus':
                that.geometry = new THREE.TorusGeometry(that.scale, x, x, x);
                that.mesh = new THREE.Mesh(that.geometry, that.videoMaterial);
                break;
            case 'ring':
                that.geometry = new THREE.RingGeometry(x, x, s, s);
                that.mesh = new THREE.Mesh(that.geometry, that.videoMaterial);
                break;
            case 'tetra':
                that.geometry = new THREE.TetrahedronGeometry(x, s);
                that.mesh = new THREE.Mesh(that.geometry, that.videoMaterial);
                break;
            case 'octa':
                that.geometry = new THREE.OctahedronGeometry(x, s);
                that.mesh = new THREE.Mesh(that.geometry, that.videoMaterial);
                break;
            case 'poly':
                that.geometry = new THREE.PolyhedronGeometry(x, s, that.scale, that.scale);
                that.mesh = new THREE.Mesh(that.geometry, that.videoMaterial);
                break;
            default:
                if (that.hd === true) {
                    var y = (9 * x) / 16;
                    that.geometry = new THREE.PlaneGeometry(x, x, y, y);
                }
                else {
                    that.geometry = new THREE.PlaneGeometry(x, s, x, s);
                }
                that.mesh = new THREE.Mesh(that.geometry, that.videoMaterial);
        }
        setTimeout(function () {
            //  that.shape = shape;
            that.key.target = that.mesh;
            that.back.target = that.mesh;
            that.meshUpdate = true;
            that.scene.add(that.mesh);
            that.mesh.doubleSided = true;
            that.mesh.position.x = that.mesh.position.y = that.mesh.position.z = 0.0;
            that.mesh.scale.x = that.mesh.scale.y = that.mesh.scale.z = that.scale;
            that.geometry.dynamic = true;
            that.geometry.verticesNeedUpdate = true;
            that.videoMaterial.renderToScreen = true;
        }, 100);
    };
    Synth.prototype.removeMesh = function (mesh) {
        this.scene.remove(mesh);
    };
    Synth.prototype.addMesh = function (mesh) {
        this.scene.add(mesh);
    };
    Synth.prototype.onResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.reset();
    };
    Synth.prototype.onDocumentMouseMove = function (event) {
        this.mouseX = (event.clientX - this.windowHalfX);
        this.mouseY = (event.clientY - this.windowHalfY) * 0.3;
    };
    Synth.prototype.setContainer = function (elem) {
        this.elem = elem;
        this.elem.appendChild(this.renderer.domElement);
    };
    Synth.prototype.setDefaults = function (_conf, _index) {
        var json = _conf[_index];
        var origin = json.origin.split(',');
        var coords = json.camera.split(',');
        this.originX = parseFloat(origin[0]);
        this.originY = parseFloat(origin[1]);
        this.originZ = parseFloat(origin[2]);
        this.camera.position.x = parseFloat(coords[0]);
        this.camera.position.y = parseFloat(coords[1]);
        this.camera.position.z = parseFloat(coords[2]);
        this.scale = json.scale;
        this.multiply = json.multiplier;
        this.displacement = json.displace;
        this.opacity = json.opacity;
        this.saturate = json.saturation;
        this.hue = json.hue;
        this.bg = json.bgColor;
        this.detail = json.detail;
        this.meshChange(json.shape, json.detail, json.detail);
        this.wireframe = json.wireframe;
        this.videoMaterial.uniforms["displace"].value = this.displacement;
        this.videoMaterial.uniforms["multiplier"].value = this.multiply;
        this.videoMaterial.uniforms["opacity"].value = parseFloat(this.opacity);
        this.videoMaterial.uniforms["originX"].value = parseFloat(this.originX);
        this.videoMaterial.uniforms["originY"].value = parseFloat(this.originY);
        this.videoMaterial.uniforms["originZ"].value = parseFloat(this.originZ);
        this.effectHue.uniforms['hue'].value = this.hue;
        if (this.saturation >= -1.0 && this.saturation < 1.0) {
            this.effectHue.uniforms['saturation'].value = this.saturation;
        }
        else if (this.saturation < -1.0) {
            this.effectHue.uniforms['saturation'].value = -1.0;
        }
        else if (this.saturation > 1.0) {
            this.effectHue.uniforms['saturation'].value = 1.0;
        }
        //this.hex = this.background;
        // $('#canvas').css('background-color', this.bgColor);
        this.renderer.setClearColor(parseInt(this.bg.replace('#', '0x')), 1.0);
    };
    Synth.prototype.defaultVideo = function (url) {
        this.videoInput.setAttribute('src', url);
        this.videoInput.load();
        this.videoInput.loop = true;
    };
    Synth.prototype.playVideo = function (playlistId) {
        this.webcam = false;
        this.videoInput.pause();
        this.videoisplaying = false;
        this.videoInput.src = this.vplaylist[playlistId];
        this.videoInput.muted = true;
        this.videoInput.play();
        this.videoisplaying = true;
    };
    Synth.prototype.streamVideo = function (stream) {
        this.webcam = true;
        this.videoObject = this.vendorURL.createObjectURL(stream);
        this.videoInput.src = this.videoObject;
    };
    Synth.prototype.initStream = function () {
        var that = this;
        var message = '';
        console.log('init Webcam!');
        //if (Modernizr.getusermedia && that.res.browser !== 'firefox') {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        navigator.getUserMedia({
            video: true,
            audio: false
        }, function (stream) {
            //on webcam enabled
            if (navigator.mozGetUserMedia) {
                that.videoInput.mozSrcObject = stream;
            }
            else {
                that.videoStream = stream;
            }
        }, function (error) {
            message = 'Unable to capture WebCam. Please reload the page or try with Google Chrome.';
        });
        navigator.getUserMedia({
            video: false,
            audio: true
        }, function (stream) {
            //on webcam enabled
            if (navigator.mozGetUserMedia) {
                that.videoInput.mozSrcObject = stream;
            }
            else {
                that.audioStream = stream;
            }
        }, function (error) {
            message = 'Unable to capture audio input. Please reload the page or try with Google Chrome.';
        });
        // } 
        // if (this.webcam === false) {
        //   this.playVideo(0);
        // }
    };
    return Synth;
}());
exports.Synth = Synth;
//# sourceMappingURL=synth.scene.js.map