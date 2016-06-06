"use strict";
var ParticleWorld = (function () {
    function ParticleWorld(light, helper) {
        var s = this, i = 0;
        this.angle = Math.PI / 180;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.aspect = this.width / this.height;
        this.frame = 0;
        this.speed = this.frame / 100;
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 0.001, 10);
        this.camera = new THREE.PerspectiveCamera(90, s.width / s.height, 0.1, 10);
        this.camera.position.y = 0.8;
        this.camera.position.z = 2;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(0x000000);
        this.renderer.setSize(s.width, s.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.geometry = new THREE.Geometry();
        this.geometry.verticesNeedUpdate = true;
        var circle = new THREE.TextureLoader().load('/assets/img/circle.svg');
        var pointmat = new THREE.PointsMaterial({ fog: true, size: 0.1, map: circle, transparent: true, alphaTest: 0.15 });
        var linemat = new THREE.LineBasicMaterial({ fog: true, color: 0xffffff, linewidth: 2 });
        // let geo = new THREE.BoxGeometry( 1, 1, 1 );
        // this.material = new THREE.MeshPhongMaterial( {
        //   color: 0xefefef,
        //   shininess: 0.0,
        //   specular: 0xefefef,
        //   shading: THREE.SmoothShading
        // });
        // this.mesh = new THREE.Mesh( geo, this.material );
        // this.mesh.position.x = 0;
        // this.mesh.position.y = 0;
        // this.mesh.position.z = 0;
        // this.mesh.castShadow = true;
        // this.scene.add(this.mesh);
        this.sunLight = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(this.sunLight);
        this.shadowLight = new THREE.SpotLight(0xffffff);
        this.shadowLight.position.set(-10, 10, -10);
        this.shadowLight.castShadow = true;
        this.scene.add(this.shadowLight);
        for (var i_1 = 0; i_1 < 500; i_1++) {
            var pos = new THREE.Vector3(this.randomPosition(-10, 10), this.randomPosition(-10, 10), this.randomPosition(-10, 10));
            this.geometry.vertices.push(pos);
        }
        this.particleCloud = new THREE.Points(this.geometry, pointmat);
        this.scene.add(this.particleCloud);
        this.particleLine = new THREE.Line(this.geometry, linemat);
        this.scene.add(this.particleLine);
        if (helper) {
            var gridHelper = new THREE.GridHelper(10, 1);
            gridHelper.rotation.x = 1.5708;
            gridHelper.setColors(0x00ff00, 0x004400);
            this.scene.add(gridHelper);
        }
        window.addEventListener('resize', function () {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.aspect = this.width / this.height;
            this.elem.setAttribute('width', this.width);
            this.elem.setAttribute('height', this.height);
        }.bind(this));
        Promise.all([
            System.import('/vendor/three/examples/js/shaders/CopyShader.js'),
            System.import('/vendor/three/examples/js/shaders/ConvolutionShader.js'),
            System.import('/vendor/three/examples/js/shaders/BokehShader.js'),
            System.import('/vendor/three/examples/js/shaders/DotScreenShader.js'),
            System.import('/vendor/three/examples/js/postprocessing/EffectComposer.js')
        ]).then(function () {
            return Promise.all([
                System.import('/vendor/three/examples/js/postprocessing/MaskPass.js'),
                System.import('/vendor/three/examples/js/postprocessing/RenderPass.js'),
                System.import('/vendor/three/examples/js/postprocessing/ShaderPass.js'),
                System.import('/vendor/three/examples/js/postprocessing/BokehPass.js')]);
        }).then(function () {
            s.composer = new THREE.EffectComposer(s.renderer);
            s.renderPass = new THREE.RenderPass(s.scene, s.camera);
            s.composer.addPass(s.renderPass);
            // // var dotScreenEffect = new THREE.ShaderPass( THREE.DotScreenShader );
            // // dotScreenEffect.uniforms[ 'scale' ].value = 4;
            // // dotScreenEffect.renderToScreen = true;
            // // s.composer.addPass( dotScreenEffect );
            // var bokeh = new THREE.BokehPass(s.scene, s.camera, {
            //   focus: 0.01,
            //   aspect: s.camera.aspect,
            //   aperture: 0.015,
            //   maxblur: 0.5
            // });
            // bokeh.renderToScreen = true;
            // s.composer.addPass( bokeh );
        });
    }
    ParticleWorld.prototype.render = function () {
        var delta = this.clock.getDelta();
        this.particleCloud.rotation.y += 0.0001;
        this.particleLine.rotation.y += 0.0001;
        // if( this.composer !== undefined ) {
        //    this.composer.render(delta);
        // }
        this.renderer.render(this.scene, this.camera);
    };
    ParticleWorld.prototype.update = function () {
        this.frame++;
        window.requestAnimationFrame(this.update.bind(this));
        this.render();
    };
    ParticleWorld.prototype.setContainer = function (elem) {
        this.elem = elem;
        this.elem.appendChild(this.renderer.domElement);
    };
    ParticleWorld.prototype.randomPosition = function (min, max) {
        return (Math.random() * (max - min + 1)) + min;
    };
    return ParticleWorld;
}());
exports.ParticleWorld = ParticleWorld;
//# sourceMappingURL=particle.scene.js.map