import * as THREE from './../../vendor/three-js/three'
import {FontLoader} from "../../vendor/three-js/FontLoader.js";
import {TextGeometry} from "../../vendor/three-js/TextGeometry.js";
import {scrollTrigger} from "../smooth-scroll/init-scroll-trigger.js";
import {resizeObserver} from "../../utils/observers.js";

export class IntroTitle {
  constructor() {
    this.container = document.querySelector('[data-animate-intro]');
    if (!this.container) {
      return;
    }
    this.canvas = this.container.querySelector('[data-animate-intro="canvas"]');
    this.fontSrc = this.container.dataset.font;

    this.text = 'viadsten';
    this.fontName = 'Mulish Medium';
    this.fontWeight = 'bold';
    this.height = 20;
    this.size = 70;
    this.hover = 40;
    this.curveSegments = 2;
    this.bevelEnabled = true;
    this.bevelThickness = 0;
    this.bevelSize = 2;
    this.targetRotation = 0;
    this.targetRotationOnPointerDown = 0;

    this.fov = () => window.innerHeight / window.innerWidth * 50;
    this.meshVar = {
      position: {
        x: 0,
        y: 40,
        z: 30,
      },
      rotation: {
        x: 0,
        y: 0,
      },
    };
    this.mousePos = {x: 0, y: 0};
    this.pointerX = 0;

    this.eventFontLoaded = new Event('fontLoaded');
    this.vp767 = window.matchMedia('(max-width: 767px)');

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.fontPromise = this.fontPromise.bind(this);
    this.animate = this.animate.bind(this);
    this.render = this.render.bind(this);
    this.onResize = this.onResize.bind(this);
    this.calculateTextCenter = this.calculateTextCenter.bind(this);

    this.setThree();
    this.setScroll();

    window.addEventListener('mousemove', this.handleMouseMove);
    resizeObserver.subscribe(this.onResize);
  }

  handleMouseMove(e) {
    this.mousePos = {
      y: (e.clientX - window.innerWidth / 2) / window.innerWidth * 5,
      x: (e.clientY - window.innerHeight / 2) / window.innerHeight / 1,
    };
  }

  setScroll() {
    this.timeline = gsap.timeline({paused: true});
    this.timeline.to(this.meshVar.position, {z: this.vp767.matches ? '-=300' : '-=200'});
    this.timeline.to(this.meshVar.position, {y: this.vp767.matches ? '+=200' : '+=75'}, 0);
    this.timeline.to('[data-animate-intro="content"]', {
      scale: 0.7,
      y: '-40%',
    }, 0);
    scrollTrigger.create({
      animation: this.timeline,
      scroller: '[data-scroll-container]',
      trigger: this.container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    });
  }

  setThree() {
    this.setCamera();
    this.setScene();
    this.setLight();
    this.group = new THREE.Group();
    this.group.position.y = 100;

    this.scene.add(this.group);
    this.loadFont();
    this.setRenderer();

    this.animate();
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(this.fov(), window.innerWidth / window.innerHeight, 1, 1500);
    this.camera.position.set(0, 100, 500);
    this.cameraTarget = new THREE.Vector3(0, 150, 0);
    window.camera = this.camera;
  }

  setScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000 );
    this.scene.fog = new THREE.Fog(0x000000, 200, 200 );
    this.scene.fog.color = 0x000000;
  }

  setLight() {
    this.dirLight = new THREE.DirectionalLight( 0xffffff, 0.3 );
    this.dirLight.position.set(0, 0.5, 1 ).normalize();
    this.scene.add(this.dirLight);

    this.ambiLight = new THREE.AmbientLight(0xffffff, 0.25 );
    this.ambiLight.position.set(0, 0.5, 1).normalize();
    this.scene.add(this.ambiLight);

    this.pointLight = new THREE.PointLight(0xffffff, 1.2 );
    this.pointLight.color.setHSL(0xffffff, 1, 1);
    this.pointLight.position.set(100, 500, 430 );
    this.scene.add(this.pointLight);
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.canvas.appendChild(this.renderer.domElement);
  }

  onResize() {
    this.camera.fov = this.fov();
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  fontPromise(response) {
    window.dispatchEvent(this.eventFontLoaded);
    this.font = response;
    this.refreshText();
  }

  loadFont() {
    const loader = new FontLoader();
    loader.load(this.fontSrc, this.fontPromise);
  }

  createText() {
    this.textGeo = new TextGeometry(this.text, {
      font: this.font,

      size: this.size,
      height: this.height,
      curveSegments: this.curveSegments,

      bevelThickness: this.bevelThickness,
      bevelSize: this.bevelSize,
      bevelEnabled: this.bevelEnabled,

    });

    const materia = new THREE.MeshPhongMaterial({color: 0xffffff, emissive: 0x000000, wireframe: true, fog: {color: 0x000000}});
    this.textMesh = new THREE.Mesh(this.textGeo, materia);

    this.calculateTextCenter();
    this.textMesh.position.y = this.meshVar.position.y;
    this.textMesh.position.z = this.meshVar.position.z;

    this.textMesh.rotation.x = 0;
    this.textMesh.rotation.y = 0;
    this.group.add(this.textMesh);
    window.mesh = this.textMesh;
  }

  calculateTextCenter() {
    this.textGeo.computeBoundingBox();
    const centerOffset = -0.5 * (this.textGeo.boundingBox.max.x - this.textGeo.boundingBox.min.x);
    this.textMesh.position.x = centerOffset;
  }

  refreshText() {
    this.group.remove(this.textMesh);

    if (!this.text) {
      return;
    }

    this.createText();
  }

  animate() {
    requestAnimationFrame(this.animate);

    this.render();
  }

  render() {
    this.group.rotation.y += (this.targetRotation - this.group.rotation.y) * 0.05;

    if (this.textMesh) {
      this.meshVar.rotation.y = this.meshVar.rotation.y + this.mousePos.y * 0.005;
      this.meshVar.rotation.x = this.meshVar.rotation.x + this.mousePos.x * 0.005;

      this.textMesh.position.z = this.meshVar.position.z;
      this.textMesh.position.y = this.meshVar.position.y;
      this.group.rotation.y = this.group.rotation.y + (this.mousePos.y - this.group.rotation.y) * 0.01;
      this.group.rotation.x = this.group.rotation.x + (this.mousePos.x - this.group.rotation.x) * 0.01;
    }

    this.camera.lookAt(this.cameraTarget);

    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);

  }
}
