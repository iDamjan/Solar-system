import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
import gsap from "gsap";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

const marsContent = document.querySelector(".explanation-mars");
const explanationContainer = document.querySelector(".explanation");
const closeBtn = document.querySelector(".btn-close-content");

closeBtn.addEventListener("click", () => {
  explanationContainer.style = "display:none";
  marsContent.style = "display:none";
});

/**
 * Base
 */
// Debug
const gui = new GUI();

const loadingElement = document.querySelector(".loader");

const loadingManager = new THREE.LoadingManager(() => {
  setTimeout(() => {
    loadingElement.style.display = "none";
  }, 1000);
});
/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
const rgbeLoader = new RGBELoader(loadingManager);
/**
 * Mouse controls ?
 */
const mouse = new THREE.Vector2();
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

// Canvas
const canvas = document.querySelector("canvas.webgl");
const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();

fbxLoader.load("Models/saturn.fbx", (fbx) => {
  console.log(fbx);
  scene.add(fbx.children[0], fbx.children[1]);
});
// gltfLoader.load("/Models/saturn.glb", (gltf) => {
//   gltf.scene.position.x = -60;
//   scene.add(gltf.scene);
// });

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = global.envMapIntensity;

      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

// Scene
const scene = new THREE.Scene();

/**
 * Environment map
 */
scene.backgroundBlurriness = 0;
scene.backgroundIntensity = 0.5;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const startsTexture = textureLoader.load("textures/start-texture.jpg");
const sunTexture = textureLoader.load("textures/sun.jpg");
const marsTexture = textureLoader.load("textures/mars.jpg");
const mercuryTexture = textureLoader.load("textures/mercury.jpg");
const venusTexture = textureLoader.load("textures/venus.jpg");
const earthTexture = textureLoader.load("textures/earthColorMap.jpg");
const earthDisplacementTexture = textureLoader.load(
  "textures/earthDisplacementMap.jpg"
);
const jupiterTexture = textureLoader.load("textures/jupiter.jpg");
const saturnTexture = textureLoader.load("textures/saturn.jpg");
const saturnRingsOpacity = textureLoader.load("textures/rings.png");
const uranusTexture = textureLoader.load("textures/uranus.jpg");
const neptuneTexture = textureLoader.load("textures/neptune.jpg");

const cubeTextureLoader = new THREE.CubeTextureLoader();

// const environmentMap = cubeTextureLoader.load([
//   "/4kcubemap/px.png",
//   "/4kcubemap/nx.png",
//   "/4kcubemap/py.png",
//   "/4kcubemap/ny.png",
//   "/4kcubemap/pz.png",
//   "/4kcubemap/nz.png",
// ]);

// scene.environment = environmentMap;
// scene.background = environmentMap;

// HDR (RGBE) equirectangular
rgbeLoader.load("stars2kEnvMap.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const sun = new THREE.Mesh(new THREE.SphereGeometry(5, 100, 100), sunMaterial);
scene.add(sun);

function getPositionOnCircle(radius, theta) {
  const x = radius * Math.cos(theta);
  const z = radius * Math.sin(theta);
  const y = 0; // Assuming y = 0 for a circular path in the x-z plane

  return { x, y, z };
}

const mercury = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 100, 100),
  new THREE.MeshStandardMaterial({ map: mercuryTexture })
);
const mercuryPosition = getPositionOnCircle(
  10,
  (Math.PI * 2) / Math.random() + 4
);
mercury.position.set(mercuryPosition.x, mercuryPosition.y, mercuryPosition.z);
scene.add(mercury);

const venus = new THREE.Mesh(
  new THREE.SphereGeometry(1, 100, 100),
  new THREE.MeshStandardMaterial({ map: venusTexture })
);
const venusPosition = getPositionOnCircle(
  15,
  (Math.PI * 2) / Math.random() + 4
);
venus.position.set(venusPosition.x, venusPosition.y, venusPosition.z);
scene.add(venus);

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(1, 100, 100),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    displacementMap: earthDisplacementTexture,
    displacementScale: 0.05,
  })
);
const earthPosition = getPositionOnCircle(
  23,
  (Math.PI * 2) / Math.random() + 4
);
earth.position.set(earthPosition.x, earthPosition.y, earthPosition.z);
scene.add(earth);

const mars = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 100, 100),
  new THREE.MeshStandardMaterial({
    map: marsTexture,
  })
);
const marsPosition = getPositionOnCircle(30, (Math.PI * 2) / Math.random() + 4);
mars.position.set(marsPosition.x, marsPosition.y, marsPosition.z);
scene.add(mars);

const jupiter = new THREE.Mesh(
  new THREE.SphereGeometry(2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: jupiterTexture,
  })
);
const jupiterPosition = getPositionOnCircle(
  35,
  (Math.PI * 2) / Math.random() + 4
);
jupiter.position.set(jupiterPosition.x, jupiterPosition.y, jupiterPosition.z);
scene.add(jupiter);

const saturn = new THREE.Group();
const saturnSphere = new THREE.Mesh(
  new THREE.SphereGeometry(2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: saturnTexture,
  })
);
const saturnRings = new THREE.Mesh(
  new THREE.RingGeometry(2.5, 4, 30),
  new THREE.MeshStandardMaterial({
    map: saturnRingsOpacity,
    alphaMap: saturnRingsOpacity,
    transparent: true,
    side: THREE.DoubleSide,
  })
);

saturnRings.rotation.x = Math.PI * 0.5;
saturn.add(saturnRings);
saturn.add(saturnSphere);

const saturnPosition = getPositionOnCircle(
  40,
  (Math.PI * 2) / Math.random() + 4
);
saturn.position.set(saturnPosition.x, saturnPosition.y, saturnPosition.z);
scene.add(saturn);

// Add Uranus
const uranus = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 100, 100),
  new THREE.MeshStandardMaterial({
    map: uranusTexture,
  })
);
const uranusPosition = getPositionOnCircle(
  45,
  (Math.PI * 2) / Math.random() + 4
);
uranus.position.set(uranusPosition.x, uranusPosition.y, uranusPosition.z);
scene.add(uranus);

// Add Uranus
const neptune = new THREE.Mesh(
  new THREE.SphereGeometry(1, 100, 100),
  new THREE.MeshStandardMaterial({
    map: neptuneTexture,
  })
);
const neptunePosition = getPositionOnCircle(
  50,
  (Math.PI * 2) / Math.random() + 4
);
neptune.position.set(neptunePosition.x, neptunePosition.y, neptunePosition.z);

scene.add(neptune);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 100, 100, 1.2, 50, 1);
scene.add(pointLight);

// Raycaster mouse event

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  90,
  sizes.width / sizes.height,
  0.1,
  250
);
camera.position.z = 15;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const objectsToTest = [earth, mars, jupiter];

/**
 * Animate
 */
const clock = new THREE.Clock();

controls.minDistance = 10; // Set the minimum distance the camera can zoom in
controls.maxDistance = 80; // Set the maximum distance the camera can zoom out

let currentIntersectingObject = null;
let isIntersecting = false;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Rotate mercury around the sun
  // const mercuryOrbitRadius = 10;
  // const mercuryOrbitSpeed = 0.1; // Adjust the speed of rotation
  // const mercuryOrbitAngle = elapsedTime * mercuryOrbitSpeed;

  // // Convert polar coordinates to Cartesian coordinates
  // const mercuryX = Math.cos(mercuryOrbitAngle) * mercuryOrbitRadius;
  // const mercuryZ = Math.sin(mercuryOrbitAngle) * mercuryOrbitRadius;

  // // Set the position of mercury
  // mercury.position.set(mercuryX, 0, mercuryZ);

  // // Rotate mercury around the sun
  // const venusOrbitRadius = 15;
  // const venusOrbitSpeed = 0.12; // Adjust the speed of rotation
  // const venusOrbitAngle = elapsedTime * venusOrbitSpeed;

  // // Convert polar coordinates to Cartesian coordinates
  // const venusX = Math.cos(venusOrbitAngle) * venusOrbitRadius;
  // const venusZ = Math.sin(venusOrbitAngle) * venusOrbitRadius;

  // // Set the position of mercury
  // venus.position.set(venusX, 0, venusZ);

  // // Rotate mercury around the sun
  // const earthOrbitRadius = 20;
  // const earthOrbitSpeed = 0.14; // Adjust the speed of rotation
  // const earthOrbitAngle = elapsedTime * earthOrbitSpeed;

  // // Convert polar coordinates to Cartesian coordinates
  // const earthX = Math.cos(earthOrbitAngle) * earthOrbitRadius;
  // const earthZ = Math.sin(earthOrbitAngle) * earthOrbitRadius;

  // // Set the position of mercury
  // earth.position.set(earthX, 0, earthZ);

  // // Rotate mercury around the sun
  // const marsOrbitRadius = 24;
  // const marsOrbitSpeed = 0.15; // Adjust the speed of rotation
  // const marsOrbitAngle = elapsedTime * marsOrbitSpeed;

  // // Convert polar coordinates to Cartesian coordinates
  // const marsX = Math.cos(marsOrbitAngle) * marsOrbitRadius;
  // const marsZ = Math.sin(marsOrbitAngle) * marsOrbitRadius;

  // // Set the position of mercury
  // mars.position.set(marsX, 0, marsZ);

  // // Rotate mercury around the sun
  // const jupiterOrbitRadius = 30;
  // const jupitersOrbitSpeed = 0.15; // Adjust the speed of rotation
  // const jupiterOrbitAngle = elapsedTime * jupitersOrbitSpeed;

  // // Convert polar coordinates to Cartesian coordinates
  // const jupiterX = Math.cos(jupiterOrbitAngle) * jupiterOrbitRadius;
  // const jupiterZ = Math.sin(jupiterOrbitAngle) * jupiterOrbitRadius;

  // // Set the position of mercury
  // jupiter.position.set(jupiterX, 0, jupiterZ);
  // Update controls
  controls.update();

  raycaster.setFromCamera(mouse, camera);

  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
