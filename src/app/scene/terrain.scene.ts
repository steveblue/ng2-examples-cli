import { Scene } from '../models/terrain';

declare let THREE:any;


export class TerrainWorld {
  
  x: number;
  y: number;
  z: number;
  angle: number;
  width: number;
  height: number;
  aspect: number;
  frame: number;
  speed: number;
  clock: any;
  scene: any;
  camera: any;
  controls: any;
  renderer: any;
  sunLight: any;
  sunLightHelper: any;
  shadowLight: any;
  mesh: any;
  uiControls: any;
  elem: any;
  projector: any;
  controlsVector: any;
  raycaster: any;
  intersects: any;
  
  constructor(light: boolean, helper: boolean) {
    
      var s = this,
          i = 0;

      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.angle = Math.PI / 180;

      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.aspect = this.width / this.height;

      this.frame = 0;
      this.speed = this.frame / 100;


      this.clock = new THREE.Clock();

      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0xd6f1f1, 0.001);

      this.camera = new THREE.PerspectiveCamera(90, s.width / s.height, 0.1, 1000);

      this.camera.position.y = 0.8;

      this.camera.lookAt(new THREE.Vector3(0,0,0));

      this.controls = new THREE.FirstPersonControls( this.camera );
      this.controls.movementSpeed = 4;
      this.controls.lookSpeed = 0.05;
      this.controls.noFly = true;
      this.controls.lookVertical = false;
      
      this.raycaster = new THREE.Raycaster();
      this.controlsVector = new THREE.Vector3(0, 0, 0);
      this.controlsVector.unproject( this.camera );


      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setClearColor(new THREE.Color(0x121212, 1.0));
      this.renderer.setSize(s.width, s.height);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Skybox

      var cubeTexLoader = new THREE.CubeTextureLoader();

      var urls = [ '/assets/skybox/posz.jpg',
                  '/assets/skybox/negz.jpg',
                  '/assets/skybox/posy.jpg',
                  '/assets/skybox/negy.jpg',
                  '/assets/skybox/posx.jpg',
                  '/assets/skybox/negx.jpg' ];

      cubeTexLoader.load( urls, function(tex) {
          var cubeShader = THREE.ShaderLib.cube;
          cubeShader.uniforms.tCube.value = tex;

          var skyBoxMaterial = new THREE.ShaderMaterial({
              fragmentShader: cubeShader.fragmentShader,
              vertexShader: cubeShader.vertexShader,
              uniforms: cubeShader.uniforms,
              depthWrite: false,
              side: THREE.BackSide
          });
          var skyBoxGeo = new THREE.BoxGeometry( 10, 10, 10, 1, 1, 1 );

          this.skyMesh = new THREE.Mesh( skyBoxGeo, skyBoxMaterial );
          this.skyMesh.scale.set( 100, 100, 100 );
          this.skyMesh.position.set ( 0, 0, 0 );
          this.scene.add( this.skyMesh );

      }.bind(this));

      this.sunLight = new THREE.DirectionalLight(0xd63710, 10);
      this.sunLight.position.set(-300, 100, -400);
      this.sunLight.position.multiplyScalar(5.0);

      this.sunLight.castShadow = true;
      // this.sunLight.shadowCameraVisible = true;
      this.sunLightHelper = new THREE.CameraHelper( this.sunLight.shadow.camera );

      this.sunLight.shadow.mapSize.width = 512;
      this.sunLight.shadow.mapSize.height = 512;

      this.sunLight.lookAt( new THREE.Vector3(0,0,0) );

      this.scene.add(this.sunLight);

      this.shadowLight = new THREE.AmbientLight( 0x0000ff );
      this.shadowLight.intensity = 0.33336;
      this.scene.add( this.shadowLight );

      var ratio;
      var geometry = new THREE.PlaneGeometry(20, 20, 120, 120);
      // var geometry = new THREE.SphereGeometry(20, 120, 120);
      geometry.verticesNeedUpdate = true;
      // create a simple square shape. We duplicate the top left and bottom right
      // vertices because each vertex needs to appear once per triangle.

      var material = new THREE.MeshPhongMaterial( {
        color: 0xefefef,
        shininess: 0.0,
        // specular: 0xefefef,
        shading: THREE.SmoothShading,
        // emissive: 0x2323ef
      });

      // var material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0xffffff, fog: true, wireframeLinewidth: 1, wireframe: false, shading: THREE.FlatShading } );

      this.mesh = new THREE.Mesh( geometry, material );
      this.mesh.rotation.x = -Math.PI/2;
      this.mesh.position.y = -1;
      this.mesh.castShadow = true;

      var scene = new Scene();
      
       scene.fetch('models/death-valley.dem').then(function(data){

        //ratio = Math.round(Math.sqrt(data[0].length));
        ratio = 36;
        console.log(ratio, Math.sqrt(this.mesh.geometry.vertices.length), data[1]);

        this.mesh.geometry = new THREE.PlaneGeometry(ratio, ratio, ratio, ratio);

        for (var i = 0, l = this.mesh.geometry.vertices.length; i < l; i++) {
          this.mesh.geometry.vertices[i].z = data[0][i] / 12000;
          //console.log(mesh.geometry.vertices[i]);
        }

        this.mesh.geometry.verticesNeedUpdate = true;
        this.mesh.geometry.normalsNeedUpdate = true;
        this.mesh.geometry.computeVertexNormals();
        // this.mesh.geometry.computeFaceNormals();

      }.bind(this));

      this.scene.add(this.mesh);
      
      
      if(helper) {
        var gridHelper = new THREE.GridHelper( 10, 1 );
        gridHelper.rotation.x = 1.5708;
        gridHelper.setColors (0x00ff00, 0x004400);
        this.scene.add( gridHelper );
      }


      this.update();

      window.addEventListener('resize', function(){

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.aspect = this.width / this.height;
        this.elem.setAttribute('width', this.width);
        this.elem.setAttribute('height', this.height);

      }.bind(this));

      this.controls.update(this.clock.getDelta());
      console.log(this.controls);

    }


    update() {
  
      this.controls.update(this.clock.getDelta());

      // this.raycaster.set( this.camera.position, this.controlsVector.sub( this.camera.position ).normalize() );
      // this.intersects = this.raycaster.intersectObjects( [this.mesh] );
      
      this.mesh.geometry.verticesNeedUpdate = true;
      this.mesh.geometry.normalsNeedUpdate = true;
      this.mesh.geometry.computeVertexNormals();
      this.mesh.geometry.computeFaceNormals();

      this.renderer.render(this.scene, this.camera);

      this.frame++;

      window.requestAnimationFrame(this.update.bind(this));

    }
    
    setContainer (elem) {
      
      this.elem = elem;
      this.elem.appendChild(this.renderer.domElement);

    }

    setUIControls (controls) {

      this.uiControls = controls;

   };
   
}