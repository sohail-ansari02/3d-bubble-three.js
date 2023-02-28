import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}
var msg = document.getElementById("msg");
msg.style.display = isMobile() ? "block" : "none";
const hdrTextureURL = new URL("griffintown.hdr", import.meta.url);
var scene = new THREE.Scene();
var renderer = new THREE.WebGL1Renderer({
  // precision: "lowp",
  // antialias: false,
  // powerPreference: "low-power",
  // depth: false
});
renderer.setSize(window.innerWidth, window.innerHeight);

var container = document.getElementById("renderer-container");
container.append(renderer.domElement);
renderer.domElement.style.width = "100%";
renderer.domElement.style.height = "100%";

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var orbit = new OrbitControls(camera, renderer.domElement);
orbit.enablePan = false;

camera.position.set(
  -6.213819779195119,
  -0.5690901066823985,
  3.1724722539621557
);
orbit.update();

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;

var loaderElement = document.getElementById("loader");
var loader = new RGBELoader();
loader.load(
  hdrTextureURL,
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;

    var sphereGeometry = new THREE.SphereGeometry(1.5, 30, 30);
    var sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      envMap: texture,
      roughness: 0,
      transmission: 1,
      side: THREE.DoubleSide,
      wireframe: true,
    });
    sphereMaterial2 = new THREE.MeshPhysicalMaterial({
      side: THREE.DoubleSide,
      envMap: texture,
      roughness: 0,
      metalness: 0,
      transmission: 1,
      ior: 2.33,
      // reflectivity: 1,
      thickness: 0.2,
      // clearcoat: 1
    });
    var bubble = new THREE.Mesh(sphereGeometry, sphereMaterial2);
    scene.add(bubble);
  },
  function (xhr) {
    loaderElement.innerText = `Loading ${Math.round(
      (xhr.loaded / xhr.total) * 100
    )}%`;
    // console.log((xhr.loaded / xhr.total) * 100);
    let per = (xhr.loaded / xhr.total) * 100;
    if (per == 100) {
      loaderElement.innerText =
        "wait until graphics render..bye(it depends on your device)";
      setTimeout(() => {
        loaderElement.style.display = "none";
      }, 4);
    }
  }
);

function animate() {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
