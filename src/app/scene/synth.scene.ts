import { RuttEtraShader } from './rutt.shader';

declare let THREE: any;
declare let System: any;
declare let navigator: any;

export class Synth {
  clock: any;
  control: any; // TODO: expecting in constructor
  cam: any; // TODO: expecting in constructor
  container: any; // TODO: expecting in constructor
  camera: any;
  scene: any;
  renderer: any;
  texture: any;
  material: any;
  mesh: any;
  geometry: any;
  detail: number = 480;
  hd: boolean = true;
  back: any;
  fill: any;
  key: any;
  composer: any;
  renderModel: any;
  effectBloom: any;
  effectHue: any;
  effectCopy: any;
  mouseX: number = 0;
  mouseY: number = 0;
  windowHalfX: number; //window.innerWidth / 2;
  windowHalfY: number; //window.innerHeight / 2;
  videoPlayer: any; //document.getElementById('videoplayer');
  videoInput: any; //document.getElementById('video');
  //videoInput.current = 0;
  vendorURL: any; //window.URL || window.webkitURL;
  videoObject: any;
  videoisplaying: boolean = false;
  vplaylist: any[];
  aplaylist: any[];
  audioin: boolean = false;
  audioContext: any; //new webkitAudioContext();
  //audioContext.fftSize = 1024;
  //  gainNode = audioContext.createGain();
  //  audioAnalyzer = audioContext.createAnalyser();
  audioSource: any;
  //freqBars = document.getElementsByClassName('audio-input');
  //audioInput = document.getElementById('audio');
  //audioInput.current = 0;
  audioisplaying: boolean = false;
  videoStream: any;
  audioStream: any;
  //frequencyData = new Uint8Array(audioAnalyzer.frequencyBinCount);
  //console.log(audioAnalyzer, frequencyData);
  // dropZone = document.getElementById('drop_zone');
  // readFiles = document.getElementById('read_files');
  // dropZoneVideo = document.getElementById('video_drop');
  // readFilesVideo = document.getElementById('read_video');
  webcam: boolean = false;
  guiSetup: boolean = false;
  initComplete: boolean = false;
  menusEnabled: boolean = true;
  controls: boolean = false;
  pointer: any[];
  setting: any[];
  trigger: boolean = false;
  mousex: number; //that.mouseX;
  mousey: number; //that.mouseY;
  shape: string = '';
  meshUpdate: boolean = false;
  wireframe: boolean = false;
  videoMaterial: any;
  camerax: number = 0.0;
  cameray: number = -1130.0;
  cameraz: number = 1680.0;
  scale: number = 5.0;
  multiplier: number = 1.0;
  displace: number = 1.0;
  transparency: any = 0.8;
  originArray : number[];
  originX: any = 0.0;
  originY: any = 0.0;
  originZ: any = -2000.0;
  hue: number = 0;
  saturation: number = 0.9;
  bgColor: string = '#000000';
  guiContainer: any;
  originPos : string;
  cameraPos : string
  multiply : number;
  displacement : number;
  opacity : any = 1;
  bg : string;
  //setting.current = 0;
  presets: any[] = [];
  config: any;
  elem: any;

  constructor(private _video: any, 
              private _control: any,
              private _cam: any,
              private _json: any) {

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

  init(_conf: any) {
    
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
      vertexShader: RuttEtraShader.vertexShader,
      fragmentShader: RuttEtraShader.fragmentShader,
      depthWrite: true,
      depthTest: true,
      wireframe: this.wireframe,
      transparent: true,
      overdraw: false
    });
    
    this.videoMaterial.renderToScreen = false;
   
    
    // this.fill = new THREE.AmbientLight(0xffffff); // soft white light
    // this.scene.add(this.fill);

    this.key = new THREE.DirectionalLight(0xffffff);
    this.key.position.set(0, -100, 100).normalize();

    this.key.intensity = 0.3;
    this.key.castShadow = true;
    this.scene.add(this.key);
   

    this.fill = new THREE.DirectionalLight(0xffffff);
    this.fill.position.set(0, 100, 100).normalize();
   
    this.fill.intensity = 0.1;
    this.fill.castShadow = true;
    this.scene.add(this.fill);
   
    
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.autoClear = false;
    
    // var size = 10;
    // var step = 1;

    // var gridHelper = new THREE.GridHelper( size, step );
    // this.scene.add( gridHelper );
    
    
    Promise.all([
      
      System.import('/vendor/three/examples/js/shaders/CopyShader.js'),
      System.import('/vendor/three/examples/js/shaders/ConvolutionShader.js'),
      System.import('/vendor/three/examples/js/shaders/BokehShader.js'),
      System.import('/vendor/three/examples/js/shaders/HueSaturationShader.js'),
      System.import('/vendor/three/examples/js/postprocessing/EffectComposer.js')
    ]).then(function(){
      
      return Promise.all([
      System.import('/vendor/three/examples/js/postprocessing/MaskPass.js'),
      System.import('/vendor/three/examples/js/postprocessing/RenderPass.js'),
      System.import('/vendor/three/examples/js/postprocessing/ShaderPass.js'),
      System.import('/vendor/three/examples/js/postprocessing/BloomPass.js')]);
      
    }).then(function(){
      
      //postprocessing
      that.composer = new THREE.EffectComposer(that.renderer);

      that.renderModel = new THREE.RenderPass(that.scene, that.camera);
      that.composer.addPass(that.renderModel);
      
      //that.effectBloom = new THREE.BloomPass(3.3, 20, 4.0, 256);
      //that.effectBloom = new THREE.BloomPass(1.5, 5.0, 2.4, 256);
      //that.composer.addPass(that.effectBloom);

      that.effectHue = new THREE.ShaderPass(THREE.HueSaturationShader);
      that.effectHue.renderToScreen = true;
      that.composer.addPass(that.effectHue);   
          
      that.setDefaults(_conf, 0);
      that.initComplete = true;
      
    });

    window.addEventListener('resize', this.onResize.bind(this), false);
    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
     
  }
  
  update() {

    window.requestAnimationFrame(this.update.bind(this));
    this.render();

  }
    
  
 render() {

    let delta = this.clock.getDelta();
    
    if (this.videoInput.readyState === 4) {
      if (this.texture) this.texture.needsUpdate = true;
      if (this.videoMaterial) this.videoMaterial.needsUpdate = true;
    }

    this.camera.lookAt(this.scene.position);

         
    if( this.composer !== undefined ) {
      this.composer.render(delta);
    } else {
      this.renderer.render(this.scene, this.camera);
    }

  }
  
  meshChange (shape, x, s) {
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
          //$('input#detail_value').val(480);
        } else {
          //$('input#detail_value').val(that.detail);
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
            } else {
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
            } else {
              that.geometry = new THREE.PlaneGeometry(x, s, x, s);
            }
            that.mesh = new THREE.Mesh(that.geometry, that.videoMaterial);

        }
        
        that.key.target = that.mesh;
        that.fill.target = that.mesh;
        that.meshUpdate = true;
        that.scene.add(that.mesh);
        that.mesh.doubleSided = true;
        that.mesh.position.x = that.mesh.position.y = that.mesh.position.z = 0.0;
        that.mesh.scale.x = that.mesh.scale.y = that.mesh.scale.z = that.scale;
        that.mesh.castShadow = true;
        that.geometry.dynamic = true;
        that.geometry.verticesNeedUpdate = true;
        that.videoMaterial.renderToScreen = true;

  }
  
  removeMesh (mesh) {
    this.scene.remove(mesh);
  }

  addMesh (mesh) {
    this.scene.add(mesh);
  }
  
  setParams() {
    
    this.videoMaterial.uniforms["displace"].value = this.displacement;
    this.videoMaterial.uniforms["multiplier"].value = this.multiply;
    this.videoMaterial.uniforms["opacity"].value = parseFloat(this.opacity);
    this.videoMaterial.uniforms["originX"].value = parseFloat(this.originX);
    this.videoMaterial.uniforms["originY"].value = parseFloat(this.originY);
    this.videoMaterial.uniforms["originZ"].value = parseFloat(this.originZ);

    
    this.effectHue.uniforms['hue'].value = this.hue;
    this.effectHue.uniforms['saturation'].value = this.saturation;

    this.renderer.setClearColor(parseInt(this.bg.replace('#', '0x')), 1.0);
    
  }
  
  setDefaults( _conf: any, _index: number ) {
    
    let json = _conf[_index];
    let origin = json.origin.split(',');
    let coords = json.camera.split(',');

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
    this.saturation = json.saturation;
    this.hue = json.hue;
    this.bg = json.bgColor;
    this.detail = json.detail;
    this.wireframe = json.wireframe;
    
    this.meshChange(json.shape, json.detail, json.detail);
    this.setParams();
    
  }
  
  defaultVideo ( url: string ) {

    this.videoInput.setAttribute('src', url);
    this.videoInput.load();
    this.videoInput.loop = true;
  
  }
  
  playVideo ( playlistId : number ) {

    this.webcam = false;
    this.videoInput.pause();
    this.videoisplaying = false;
    this.videoInput.src = this.vplaylist[playlistId];
    this.videoInput.muted = true;
    this.videoInput.play();
    this.videoisplaying = true;

  }
  
  streamVideo (stream : any) {
    
    this.webcam = true;
    this.videoObject = this.vendorURL.createObjectURL(stream);
    this.videoInput.src = this.videoObject;
    
  }
  
  initStream () {
  
    var that = this;
    var message = '';
    
    console.log('init Webcam!');
    //if (Modernizr.getusermedia && that.res.browser !== 'firefox') {
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      navigator.getUserMedia({
        video: true,
        audio: false
      }, function(stream) {
        //on webcam enabled
        if (navigator.mozGetUserMedia) {
          that.videoInput.mozSrcObject = stream;
        } else {
          that.videoStream = stream;
          //that.streamVideo(that.videoStream);
          //that.createWebcamItem();
        }

      }, function(error) {
        message = 'Unable to capture WebCam. Please reload the page or try with Google Chrome.';
      });
      navigator.getUserMedia({
        video: false,
        audio: true
      }, function(stream) {
        //on webcam enabled
        if (navigator.mozGetUserMedia) {
          that.videoInput.mozSrcObject = stream;
        } else {
          that.audioStream = stream;
          //that.createAudioItem();
        }

      }, function(error) {
        message = 'Unable to capture audio input. Please reload the page or try with Google Chrome.';
      });


   // } 

    // if (this.webcam === false) {
    //   this.playVideo(0);
    // }
    
  }
     
  onResize() {

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.reset();

  }
  
  onDocumentMouseMove( event : any ) {

    this.mouseX = (event.clientX - this.windowHalfX);
    this.mouseY = (event.clientY - this.windowHalfY) * 0.3;
    
  }

  setContainer( elem: any ) {

    this.elem = elem;
    this.elem.appendChild(this.renderer.domElement);

  }


}