import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { setupLights, particles } from './lightsneffects.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1, 3);
controls.update();

const textureLoader = new THREE.TextureLoader();

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load(
    [
        'assets/textures/sky.jpg',
        'assets/textures/sky.jpg',
        'assets/textures/sky.jpg',
        'assets/textures/sky.jpg',
        'assets/textures/sky.jpg',
        'assets/textures/sky.jpg'
    ]
);

// -------------------------------------------------------
setupLights(scene, renderer);
const stars = particles(scene);

scene.fog = new THREE.Fog(0x2c136b, 4, 15);

// 3D MODELS ----
const loader = new GLTFLoader();
const TwoTime = await loader.loadAsync('assets/2TimeModel/scene.gltf');
const TwoTimemodel = TwoTime.scene;

scene.add(TwoTimemodel);
TwoTimemodel.position.set(0, 0.35, 1); // <- ORIGINAL POSITION
TwoTimemodel.rotation.y = Math.PI / 2;
TwoTimemodel.traverse(o => { if (o.isMesh) o.castShadow = true; });
TwoTimemodel.scale.set(12, 12, 12);

const Azure = await loader.loadAsync('assets/AzureModel/scene.gltf');
const Azuremodel = Azure.scene;

scene.add(Azuremodel);
Azuremodel.position.set(0, 0, 1); // <- ORIGINAL POSITION
Azuremodel.rotation.y = Math.PI / 2;
Azuremodel.traverse(o => { if (o.isMesh) o.castShadow = true; });
Azuremodel.scale.set(0.15, 0.15, 0.15);


// UNIVERSAL MATERIALS ----
const stoneLightMat = new THREE.MeshLambertMaterial({map: textureLoader.load('assets/textures/stoneLight.jpg'), side: THREE.DoubleSide});
const stoneDarkMat = new THREE.MeshLambertMaterial({map: textureLoader.load('assets/textures/stoneDark.jpg'), side: THREE.DoubleSide});

const graniteLightMat = new THREE.MeshPhongMaterial({ 
  map: textureLoader.load('assets/textures/graniteLight.jpg'), 
  shininess: 20,
  specular: 0x91969e,
  side: THREE.DoubleSide
}); 
const graniteDarkMat = new THREE.MeshPhongMaterial({ 
  map: textureLoader.load('assets/textures/graniteDark.jpg'), 
  shininess: 20,
  specular: 0x30343b,
  side: THREE.DoubleSide
});

const graniteLightLambMat = new THREE.MeshLambertMaterial({map: textureLoader.load('assets/textures/graniteLight.jpg'), side: THREE.DoubleSide});
const graniteDarkLambMat = new THREE.MeshLambertMaterial({map: textureLoader.load('assets/textures/graniteDark.jpg'), side: THREE.DoubleSide});

const woodMat = new THREE.MeshLambertMaterial({map: textureLoader.load('assets/textures/wood.jpg'), side: THREE.DoubleSide});
const woodDarkerMat = new THREE.MeshLambertMaterial({map: textureLoader.load('assets/textures/woodDarker.jpg'), side: THREE.DoubleSide});
const woodCoolerMat = new THREE.MeshLambertMaterial({map: textureLoader.load('assets/textures/woodCooler.jpg'), side: THREE.DoubleSide});

const fenceMat = new THREE.MeshStandardMaterial({
  map: textureLoader.load('assets/textures/fence.png'), 
  transparent: true,
  alphaTest: 0.5,
  roughness: 0.3,
  metalness: 0.8,
  side: THREE.DoubleSide
});


// MAP ----
const mapWidth = 32;
const mapDepth = 32;

const mapGroundGeo = new THREE.BoxGeometry(mapWidth, 1, mapDepth);
const mapGroundMat = new THREE.MeshLambertMaterial({map: textureLoader.load('assets/textures/grass.jpg'), side: THREE.DoubleSide});
const mapGround = new THREE.Mesh(mapGroundGeo, mapGroundMat);
mapGround.position.set(0, -0.5, 0);
mapGround.receiveShadow = true;
scene.add(mapGround);

const TheSpawnGeo = new THREE.PlaneGeometry(10, 10);
const TheSpawnMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load('assets/textures/TheSpawn.png'), 
  transparent: true,
  opacity: 0.8,
  side: THREE.DoubleSide
});
const TheSpawn = new THREE.Mesh(TheSpawnGeo, TheSpawnMat);
TheSpawn.position.set(0, 11.5, -2);
TheSpawn.rotation.x = Math.PI / 2.5;

const glowMat = new THREE.MeshBasicMaterial({
  map: TheSpawnMat.map,
  color: 0xa070ff,             
  transparent: true,
  opacity: 0.2,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  side: THREE.DoubleSide
});

const TheSpawnGlow = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), glowMat);
TheSpawnGlow.position.copy(TheSpawn.position);
TheSpawnGlow.rotation.copy(TheSpawn.rotation);
TheSpawnGlow.position.y -= 0.05;   

scene.add(TheSpawn, TheSpawnGlow);


// FENCE ----
const mapFence = new THREE.Group();

const mapFenceGeo = new THREE.PlaneGeometry(mapDepth / 2, 3);

const sideMapFenceL1 = new THREE.Mesh(mapFenceGeo, fenceMat);
const sideMapFenceL2 = new THREE.Mesh(mapFenceGeo, fenceMat);


sideMapFenceL1.position.set(-mapWidth / 2.05, 1.5, -mapDepth / 4);
sideMapFenceL1.rotation.y = Math.PI / 2;
sideMapFenceL2.position.set(-mapWidth / 2.05, 1.5, mapDepth / 4);
sideMapFenceL2.rotation.y = Math.PI / 2;

const backMapFence1 = new THREE.Mesh(mapFenceGeo, fenceMat);
const backMapFence2 = new THREE.Mesh(mapFenceGeo, fenceMat);

backMapFence1.position.set(-mapWidth / 4.4, 1.5, -mapDepth / 2);
backMapFence2.position.set(mapWidth / 4, 1.5, -mapDepth / 2);

const frontMapFence1 = new THREE.Mesh(mapFenceGeo, fenceMat);
const frontMapFence2 = new THREE.Mesh(mapFenceGeo, fenceMat);

frontMapFence1.position.set(-mapWidth / 4.4, 1.5, mapDepth / 2);
frontMapFence2.position.set(mapWidth / 4, 1.5, mapDepth / 2);

mapFence.add(sideMapFenceL1, sideMapFenceL2, backMapFence1, backMapFence2, frontMapFence1, frontMapFence2);
scene.add(mapFence);

mapFence.traverse(o => {if (o.isMesh) {o.castShadow = true;}});


// REUSED GEOMETRIES ----
// Gravestones
const graveGeoCache = {};

function createGravestone(material, {width = 0.6, height = 1, depth = 0.15} = {}) {
  const key = `${width}_${height}_${depth}`;

  if (!graveGeoCache[key]) {
    const r = width / 2;
    const shape = new THREE.Shape();
    shape.moveTo(-r, 0);
    shape.lineTo(r, 0);
    shape.lineTo(r, height - r);
    shape.absarc(0, height - r, r, 0, Math.PI, false);  
    shape.lineTo(-r, 0);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02,
      bevelSegments: 2,
      curveSegments: 24
    });
    geo.translate(0, 0, -depth / 2); 

    graveGeoCache[key] = geo;
  }

  return new THREE.Mesh(graveGeoCache[key], material);
}

// Lamp  
const lampGlassMat = new THREE.MeshPhongMaterial({
  color: 0xadcced,
  transparent: true,
  opacity: 0.5,
  depthWrite: false
});

const lampFrameMat = new THREE.MeshStandardMaterial({
  map: textureLoader.load('assets/textures/lampFrame.jpg'),
  roughness: 0.3,
  metalness: 0.8, 
  side: THREE.DoubleSide
});

const lampLightMat = new THREE.MeshBasicMaterial({color: 0xc8a6ff});

function createLamp({width = 0.2, height = 0.25, postWidth = 0.05} = {}) {
  const lamp = new THREE.Group();
  const capH = 0.05; 
  const half = width / 2;

  const baseGeo = new THREE.BoxGeometry(width + postWidth, capH, width + postWidth);
  const base = new THREE.Mesh(baseGeo, lampFrameMat);
  base.position.y = capH / 2;
  lamp.add(base);

  const glassGeo = new THREE.BoxGeometry(width, height, width);
  const glass = new THREE.Mesh(glassGeo, lampGlassMat);
  glass.position.y = capH + height / 2;
  lamp.add(glass);

  const postGeo = new THREE.BoxGeometry(postWidth, height, postWidth);
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const post = new THREE.Mesh(postGeo, lampFrameMat);
      post.position.set(sx * half, capH + height / 2, sz * half);
      lamp.add(post);
    }
  }

  const cap = new THREE.Mesh(baseGeo, lampFrameMat);
  cap.position.y = capH + height + capH / 2;
  lamp.add(cap);

  const topCapGeo = new THREE.BoxGeometry(width , capH, width);
  const topCap = new THREE.Mesh(topCapGeo, lampFrameMat);
  topCap.position.y = capH + height + capH;
  lamp.add(topCap);

  const lightGeo = new THREE.CylinderGeometry(width * 0.3, width * 0.3, height * 0.8, 32);
  const light = new THREE.Mesh(lightGeo, lampLightMat);
  light.position.y = capH + height / 2;
  lamp.add(light);

  const pointLight = new THREE.PointLight(0xdba6ff, 1, 3, 2);
  pointLight.position.copy(light.position);
  lamp.add(pointLight);

  lamp.traverse(o => {if (o.isMesh && o.material === lampFrameMat) o.castShadow = true;});

  return lamp;
}

function createStandLamp({light = true, lightColor = 0xdba6ff, baseMat = graniteDarkMat} = {}) {
  const lamp = new THREE.Group();

  const bottom = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.6), baseMat);
  bottom.position.y = 0.1;

  const middle = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.5), baseMat);
  middle.position.y = 0.4;

  const baseTop = 0.75;               
  const lanternH = 0.4;
  const lanternY = baseTop + lanternH / 2;

  const glass = new THREE.Mesh(new THREE.BoxGeometry(0.44, lanternH, 0.44), lampGlassMat);
  glass.position.y = lanternY;

  const glow = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 20, 32), lampLightMat);
  glow.position.y = lanternY;

  const postGeo = new THREE.BoxGeometry(0.06, lanternH, 0.06);
  const posts = [];
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const post = new THREE.Mesh(postGeo, lampFrameMat);
      post.position.set(sx * 0.22, lanternY, sz * 0.22);
      posts.push(post);
    }
  }

  const cap = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.07, 0.56), lampFrameMat);
  cap.position.y = baseTop + lanternH + 0.035;

  const top = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.26), lampFrameMat);
  top.position.y = baseTop + lanternH + 0.12;

  lamp.add(bottom, middle, glass, glow, cap, top, ...posts);

  for (const m of [bottom, middle, cap, top, ...posts]) {
    m.castShadow = true;
    m.receiveShadow = true;
  }

  if (light) {
    const pointLight = new THREE.PointLight(lightColor, 3, 8, 2);
    pointLight.position.y = lanternY;
    lamp.add(pointLight);
  }

  return lamp; 
}

// CENTER SPAWN LOGO ----
const spawnGeo = new THREE.CircleGeometry(3.3, 64);
const spawnMat = new THREE.MeshLambertMaterial({
  map: textureLoader.load('assets/textures/spawnAltar.png'), 
  transparent: true,
  alphaTest: 0.5,
  side: THREE.DoubleSide});
  const spawnAltar = new THREE.Mesh(spawnGeo, spawnMat);
spawnAltar.position.set(0.02, 0.01, -0.03);
spawnAltar.rotation.x = -Math.PI / 2;
spawnAltar.receiveShadow = true;
scene.add(spawnAltar);


// ALTAR ----
const altar = new THREE.Group();

const altarBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.2), stoneLightMat);
altarBase.position.y = -0.1;
altar.add(altarBase);

const altarBottom = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.5, 0.8), stoneLightMat);
altar.add(altarBottom);

const trimW = 0.1;
const trimGeo = new THREE.BoxGeometry(trimW, 1.5, trimW);
const corner = 0.4;

for (const sx of [-1, 1]) {
  for (const sz of [-1, 1]) {
    const trim = new THREE.Mesh(trimGeo, stoneDarkMat);
    trim.position.set(sx * corner, 0, sz * corner);
    altar.add(trim);
  }
}

const trimBaseH = 0.05;
const trimBaseW = 0.2;
const trimBaseGeo = new THREE.BoxGeometry(trimBaseW, trimBaseH, trimBaseW);

for (const sx of [-1, 1]) {
  for (const sz of [-1, 1]) {
    const x = sx * corner;
    const z = sz * corner;

    const trim = new THREE.Mesh(trimGeo, stoneDarkMat);
    trim.position.set(x, 0, z);

    const capTop = new THREE.Mesh(trimBaseGeo, stoneDarkMat);
    capTop.position.set(x, 0.7, z);

    const capBottom = new THREE.Mesh(trimBaseGeo, stoneDarkMat);
    capBottom.position.set(x, 0.18, z);

    altar.add(trim, capTop, capBottom);
  }
}

const altarTopBase = new THREE.Mesh(new THREE.BoxGeometry(1, 0.05, 1), stoneDarkMat);
altar.add(altarTopBase);
altarTopBase.position.y = 0.75;

const altarTopTrim = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), stoneDarkMat);
altarTopTrim.position.y = 0.8;
altar.add(altarTopTrim);

const altarTop = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.6), stoneDarkMat);
altarTop.position.y = 1;
altar.add(altarTop);

const altarTopTopTrim = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.7), stoneDarkMat);
altarTopTopTrim.position.y = 1.25;
altar.add(altarTopTopTrim);

const altarGrave = createGravestone(stoneLightMat);
altarGrave.position.set(0, 1.2, -0.2);
altarGrave.scale.setScalar(0.5);
altar.add(altarGrave);

scene.add(altar);
altar.scale.setScalar(1.2);
altar.traverse(o => { if (o.isMesh) o.castShadow = true; });


// PILLARS -----
function createPillarBase({radius = 0.5, height = 0.08} = {}) {
  const group = new THREE.Group();

  const darkGeo = new THREE.CylinderGeometry(radius, radius, height, 32);
  const lightGeo = new THREE.CylinderGeometry(radius - 0.05, radius - 0.05, height, 32);

  const bottom = new THREE.Mesh(darkGeo, graniteDarkMat);
  const middle = new THREE.Mesh(lightGeo, graniteLightMat);
  const top = new THREE.Mesh(darkGeo, graniteDarkMat);

  bottom.position.y = height * 0.5;
  middle.position.y = height * 1.5;
  top.position.y = height * 2.5;

  group.add(bottom, middle, top);
  return group;
}

const trimCount = 6;
const trimWidth = 0.08;
const trimDepth = 0.05;

function createPillar({radius = 0.5, shaftHeight = 3, baseHeight = 0.08, topBase = true} = {}) {
  const pillar = new THREE.Group();
  const baseTotal = baseHeight * 3;

  const bottomBase = createPillarBase({radius, height: baseHeight});
  pillar.add(bottomBase);

  const shaftRadius = radius - 0.1;
  const shaftGeo = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftHeight, 16);
  const shaft = new THREE.Mesh(shaftGeo, graniteLightMat);
  shaft.position.y = baseTotal + shaftHeight / 2;
  pillar.add(shaft);

  const trimGeo = new THREE.BoxGeometry(trimWidth, shaftHeight, trimDepth);
  const trimRadius = shaftRadius + trimDepth / 2 - 0.01;

  for (let i = 0; i < trimCount; i++) {
    const angle = (i / trimCount) * Math.PI * 2;
    const trim = new THREE.Mesh(trimGeo, graniteDarkMat);
    trim.position.set(
      Math.sin(angle) * trimRadius,
      baseTotal + shaftHeight / 2,
      Math.cos(angle) * trimRadius
    );
    trim.rotation.y = angle; 
    pillar.add(trim);
  }

  if (topBase) {
    const top = createPillarBase({radius, height: baseHeight});
    top.position.y = baseTotal + shaftHeight;
    pillar.add(top);
  }

  return pillar;
}

// Full Pillars
const pillarRightBack = createPillar();
pillarRightBack.position.set(2.5, 0, -3);      
pillarRightBack.traverse(o => {if (o.isMesh) o.castShadow = true;});

const pillarLeftBack = createPillar();
pillarLeftBack.position.set(-2.5, 0, -3);    
pillarLeftBack.traverse(o => {if (o.isMesh) o.castShadow = true;});   

const pillarRightFront = createPillar();
pillarRightFront.position.set(2.5, 0, 3); 
pillarRightFront.traverse(o => {if (o.isMesh) o.castShadow = true;});    

const pillarLeftFront = createPillar();
pillarLeftFront.position.set(-2.5, 0, 3);      
pillarLeftFront.traverse(o => {if (o.isMesh) o.castShadow = true;});

scene.add(pillarRightBack, pillarLeftBack,  pillarRightFront, pillarLeftFront);

// Half Pillars
const halfPillarBack = createPillar({shaftHeight: 1.2, topBase: false});
halfPillarBack.position.set(2.5, 0.4, -5);
halfPillarBack.traverse(o => {if (o.isMesh) o.castShadow = true; o.receiveShadow = true;});
halfPillarBack.rotation.x = Math.PI / 2;
halfPillarBack.rotation.z = Math.PI / 4;

const halfPillarLeft = createPillar({shaftHeight: 1.2, topBase: false});
halfPillarLeft.position.set(-5, 0.4, -1.5);
halfPillarLeft.traverse(o => {if (o.isMesh) o.castShadow = true; o.receiveShadow = true;});
halfPillarLeft.rotation.x = Math.PI / 2;
halfPillarLeft.rotation.z = -Math.PI / 4;

const halfPillarFront = createPillar({shaftHeight: 1.2, topBase: false});
halfPillarFront.position.set(0, 0, 4);
halfPillarFront.traverse(o => {if (o.isMesh) o.castShadow = true; o.receiveShadow = true;});
scene.add(halfPillarBack, halfPillarLeft, halfPillarFront);

// Quarter Pillars
const quarterPillarBack = createPillar({shaftHeight: 0.7, topBase: false});
quarterPillarBack.position.set(0.5, 0, -4);
quarterPillarBack.traverse(o => {if (o.isMesh) o.castShadow = true; o.receiveShadow = true;});

const quarterPillarLeft = createPillar({shaftHeight: 0.7, topBase: false});
quarterPillarLeft.position.set(-3.5, 0, 0.5);
quarterPillarLeft.traverse(o => {if (o.isMesh) o.castShadow = true; o.receiveShadow = true;});

const quarterPillarFront = createPillar({shaftHeight: 0.7, topBase: false});
quarterPillarFront.position.set(-1, 0.4, 6);
quarterPillarFront.rotation.x = -Math.PI / 2;
quarterPillarFront.rotation.z = -Math.PI / 4;
quarterPillarFront.traverse(o => {if (o.isMesh) o.castShadow = true; o.receiveShadow = true;});

scene.add(quarterPillarBack, quarterPillarLeft, quarterPillarFront);

// Boulders
const boulders = new THREE.Group();
const pillarBoulderGeo = new THREE.TorusKnotGeometry(0.1, 0.2, 100, 16);

const halfPBoulderB = new THREE.Mesh(pillarBoulderGeo, graniteLightMat);
halfPBoulderB.position.set(1.5, 0.4, -4);

const quarterPBoulderB = new THREE.Mesh(pillarBoulderGeo, graniteLightMat);
quarterPBoulderB.position.set(0.5, 0.9, -4);
quarterPBoulderB.rotation.x = Math.PI / 2;

const halfPBoulderL = new THREE.Mesh(pillarBoulderGeo, graniteLightMat);
halfPBoulderL.position.set(-4, 0.4, -0.6);
halfPBoulderL.rotation.y = Math.PI / 2;

const quarterPBoulderL = new THREE.Mesh(pillarBoulderGeo, graniteLightMat);
quarterPBoulderL.position.set(-3.5, 0.9, 0.5);
quarterPBoulderL.rotation.x = Math.PI / 2;

const halfPBoulderF = new THREE.Mesh(pillarBoulderGeo, graniteLightMat);
halfPBoulderF.position.set(0, 1.4, 4);
halfPBoulderF.rotation.x = -Math.PI / 2;

const quarterPBoulderF = new THREE.Mesh(pillarBoulderGeo, graniteLightMat);
quarterPBoulderF.position.set(-0.4, 0.4, 5.4);
quarterPBoulderF.rotation.y = Math.PI / 2;

boulders.add(halfPBoulderB, quarterPBoulderB, halfPBoulderL, quarterPBoulderL, halfPBoulderF, quarterPBoulderF);
scene.add(boulders);

boulders.traverse(o => {if (o.isMesh) {o.receiveShadow = true;}});


// GRAVEYARD ----
function createStand({width = 0.4, height = 1, depth = 0.4} = {}) {
  const stand = new THREE.Group();

  const standBaseGeo = new THREE.BoxGeometry(width, height, depth);
  const standBase = new THREE.Mesh(standBaseGeo, graniteDarkMat);
  standBase.position.y = height / 3; 
  stand.add(standBase);

  const standTopGeo = new THREE.BoxGeometry(width * 1.3, height / 8, depth * 1.3);
  const standTop = new THREE.Mesh(standTopGeo, stoneDarkMat);
  standTop.position.y = height / 1.5 + height / 5;              
  stand.add(standTop);

  const standCapGeo = new THREE.BoxGeometry(width * 0.9, height / 15, depth * 0.9);
  const standCap = new THREE.Mesh(standCapGeo, stoneDarkMat);
  standCap.position.y = height / 1.5 + height / 3.5;              
  stand.add(standCap);

  const standLamp = createLamp();
  standLamp.position.y = height / 1.5 + height / 3.1;
  stand.add(standLamp);

  stand.traverse(o => {if (o.isMesh) {o.castShadow = true; o.receiveShadow = true;}});

  return stand;                             
}

// Light Stand
const stand1 = createStand();
stand1.position.set(-15, 0.1, -3);

const stand2 = createStand();
stand2.position.set(-12.5, 0.1, -3);

const stand3 = createStand();
stand3.position.set(-9.5, 0.1, -3);

const stand4 = createStand();
stand4.position.set(-9.5, 0.1, -7);

const stand5 = createStand();
stand5.position.set(-9.5, 0.1, -9);

const stand6 = createStand();
stand6.position.set(-9.5, 0.1, -13);

const stand7 = createStand();
stand7.position.set(-9.5, 0.1, -15.8);

const stand8 = createStand();
stand8.position.set(-15.6, 0.1, -15.8);

scene.add(stand1, stand2, stand3, stand4, stand5, stand6, stand7, stand8);

//Grave Fence
const graveFence = new THREE.Group();

const graveyardFenceGeo = new THREE.PlaneGeometry(3.5, 4);

const graveyardFence1 = new THREE.Mesh(graveyardFenceGeo, fenceMat);
graveyardFence1.position.set(-11, 2, -3);

const graveyardFence2 = new THREE.Mesh(graveyardFenceGeo, fenceMat);
graveyardFence2.position.set(-9.5, 2, -5);
graveyardFence2.rotation.y = Math.PI / 2;

const graveyardFence3 = new THREE.Mesh(graveyardFenceGeo, fenceMat);
graveyardFence3.position.set(-9.5, 2, -11);
graveyardFence3.rotation.y = Math.PI / 2;

const graveyardFence4 = new THREE.Mesh(graveyardFenceGeo, fenceMat);
graveyardFence4.position.set(-9.5, 2, -14.3);
graveyardFence4.rotation.y = Math.PI / 2;

graveFence.add(graveyardFence1, graveyardFence2, graveyardFence3, graveyardFence4);
scene.add(graveFence);

graveFence.traverse(o => {if (o.isMesh) {o.castShadow = true; o.receiveShadow = true;}});

// Grave House 1
const graveHouse1 = new THREE.Group();

const graveHouse1BaseGeo = new THREE.BoxGeometry(1.9, 0.2, 1.9);
const graveHouse1Base = new THREE.Mesh(graveHouse1BaseGeo, stoneLightMat);
graveHouse1Base.position.set(-14.5, 0.1, -4.5);

const graveHouse1Geo = new THREE.BoxGeometry(1.7, 2.3, 1.7);
const graveHouseMid1 = new THREE.Mesh(graveHouse1Geo, stoneLightMat);
graveHouseMid1.position.set(-14.5, 0.6, -4.5);

const r = 1.13 * Math.SQRT2;
const graveHouse1RoofGeo = new THREE.CylinderGeometry(r * 0.25, r, 0.5, 4);
const graveHouse1Roof = new THREE.Mesh(graveHouse1RoofGeo, stoneLightMat);
graveHouse1Roof.position.set(-14.5, 2, -4.5);
graveHouse1Roof.rotation.y = Math.PI / 4;

graveHouse1.add(graveHouse1Base, graveHouseMid1, graveHouse1Roof);
scene.add(graveHouse1);

graveHouse1.traverse(o => {if (o.isMesh) {o.castShadow = true; o.receiveShadow = true;}});


// Grave House 2
const graveHouse2 = new THREE.Group();

const graveHouse2BaseGeo = new THREE.BoxGeometry(1.3, 1.5, 1.3);
const graveHouse2Base = new THREE.Mesh(graveHouse2BaseGeo, stoneLightMat);
graveHouse2Base.position.set(-10.3, 0.4, -6);
graveHouse2Base.castShadow = true;

const graveHouse2MidGeo = new THREE.BoxGeometry(1.3, 0.05, 1.3);
const graveHouse2MidMat = new THREE.MeshLambertMaterial({color: 0xafb9de});
const graveHouse2Mid = new THREE.Mesh(graveHouse2MidGeo, graveHouse2MidMat);
graveHouse2Mid.position.set(-10.3, 1.17, -6);
graveHouse2Mid.castShadow = true;

const graveHouse2TopGeo = new THREE.BoxGeometry(1.3, 0.5, 1.3);
const graveHouse2Top = new THREE.Mesh(graveHouse2TopGeo, stoneLightMat);
graveHouse2Top.position.set(-10.3, 1.43, -6);
graveHouse2Top.castShadow = true;

const r2 = 0.9 * Math.SQRT2;
const graveHouse2RoofGeo = new THREE.CylinderGeometry(r2 * 0.25, r2, 0.7, 4);
const graveHouse2Roof = new THREE.Mesh(graveHouse2RoofGeo, stoneLightMat);
graveHouse2Roof.position.set(-10.3, 1.9, -6);
graveHouse2Roof.rotation.y = Math.PI / 4;
graveHouse2Roof.castShadow = true;

graveHouse2.add(graveHouse2Base, graveHouse2Mid, graveHouse2Top, graveHouse2Roof);
scene.add(graveHouse2)

graveHouse2.traverse(o => {if (o.isMesh) {o.castShadow = true; o.receiveShadow = true;}});

// Fancy Grave
const fancyGrave = new THREE.Group();

const graniteLighterMat = new THREE.MeshLambertMaterial({map: textureLoader.load('assets/textures/graniteLighter.jpg'), side: THREE.DoubleSide});

const fgB = 1.15 * Math.SQRT2;
const fancyGraveBaseGeo = new THREE.CylinderGeometry(fgB - 0.5, fgB, 0.2, 4);
const fancyGraveBase = new THREE.Mesh(fancyGraveBaseGeo, graniteLighterMat);
fancyGraveBase.position.set(-12.5, 0.1, -11.5);
fancyGraveBase.rotation.y = Math.PI / 4;

const fancyGraveMidGeo = new THREE.BoxGeometry(1.5, 1, 1.5);
const fancyGraveMid = new THREE.Mesh(fancyGraveMidGeo, graniteLighterMat);
fancyGraveMid.position.set(-12.5, 0.6, -11.5);

const fancyGraveTopGeo = new THREE.BoxGeometry(1.1, 0.5, 1.1);
const fancyGraveTop = new THREE.Mesh(fancyGraveTopGeo, graniteLighterMat);
fancyGraveTop.position.set(-12.5, 1.3, -11.5);

const fancyGraveItemGeo = new THREE.SphereGeometry(0.4, 32, 16);
const fancyGraveItem = new THREE.Mesh(fancyGraveItemGeo, graniteLighterMat);
fancyGraveItem.position.set(-12.5, 1.6, -11.5);

fancyGrave.add(fancyGraveBase, fancyGraveMid, fancyGraveTop, fancyGraveItem);
scene.add(fancyGrave);

fancyGrave.traverse(o => {if (o.isMesh) {o.castShadow = true; o.receiveShadow = true;}});

// Coffins
const coffinGeo = new THREE.BoxGeometry(0.5, 0.4, 1.4);

const coffin1 = new THREE.Mesh(coffinGeo, graniteDarkLambMat);
coffin1.position.set(-11.4, 0.3, -4.3);
coffin1.rotation.y = 5;
coffin1.castShadow = true;
coffin1.receiveShadow = true;

const coffin2 = new THREE.Mesh(coffinGeo, graniteDarkLambMat);
coffin2.position.set(-14, 0, -15);
coffin2.castShadow = true;
coffin2.receiveShadow = true;

const coffin3 = new THREE.Mesh(coffinGeo, graniteDarkLambMat);
coffin3.position.set(-12, 0, -15);
coffin3.castShadow = true;
coffin3.receiveShadow = true;

const coffin4 = new THREE.Mesh(coffinGeo, graniteDarkLambMat);
coffin4.position.set(-10.3, 0.3, -10.5);
coffin4.rotation.y = Math.PI / 10;
coffin4.castShadow = true;
coffin4.receiveShadow = true;

scene.add(coffin1, coffin2, coffin3, coffin4);

// Graveyard
const graveyard = new THREE.Group();

const grave1 = createGravestone(graniteDarkLambMat);
grave1.position.set(-10, 0, -3.5);
grave1.rotation.y = 10;
const grave2 = createGravestone(graniteDarkLambMat);
grave2.position.set(-10, 0, -15);
grave2.rotation.y = -10;

const grave3 = createGravestone(graniteDarkLambMat);
grave3.position.set(-15, -0.2, -8);
grave3.rotation.y = Math.PI / 2;

const grave4 = createGravestone(graniteDarkLambMat);
grave4.position.set(-15, -0.2, -9.5);
grave4.rotation.y = Math.PI / 2;

const grave5 = createGravestone(graniteDarkLambMat);
grave5.position.set(-15, -0.2, -11);
grave5.rotation.y = Math.PI / 2;

const grave6 = createGravestone(graniteDarkLambMat);
grave6.position.set(-14, -0.5, -7);
grave6.rotation.y = Math.PI / 2;

const grave7 = createGravestone(graniteDarkLambMat);
grave7.position.set(-14, -0.5, -9);
grave7.rotation.y = Math.PI / 2;

graveyard.add(grave1, grave2, grave3, grave4, grave5, grave6, grave7);
scene.add(graveyard);

graveyard.traverse(o => {if (o.isMesh) {o.castShadow = true; o.receiveShadow = true;}});


// LIBRARY ----
const library = new THREE.Group();

const W = 7.7, D = 6.1, H = 3, T = 0.1;     
const ROOF_H = 2.2, OV = 0.3;              
const DOOR_W = 1.7, DOOR_H = 2.2;

const fz = -D / 2, bz = D / 2, rx = -W / 2, lx = W / 2;   

const floorMat   = new THREE.MeshLambertMaterial({color: 0x120f14});
const lanternMat = new THREE.MeshBasicMaterial({ color: 0x7fb4ff });
const glassMat   = new THREE.MeshPhongMaterial({
  color: 0xbcd6f0, emissive: 0x3d5878,      
  transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false
});

function box(w, h, d, x, y, z, mat = woodMat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  library.add(m);
  return m;
}

// Walls
const sideW = (W - DOOR_W) / 2;
box(sideW, H, T, -(DOOR_W / 2 + sideW / 2), H / 2, fz);         
box(sideW, H, T,  (DOOR_W / 2 + sideW / 2), H / 2, fz);
box(DOOR_W, H - DOOR_H, T, 0, DOOR_H + (H - DOOR_H) / 2, fz);    
box(W, H, T, 0, H / 2, bz);     

// Right wall
const rDoorZ = 0;                                  
const rA = rDoorZ - DOOR_W / 2;                     
const rB = rDoorZ + DOOR_W / 2;                     

box(T, H, rA - fz, rx, H / 2, (fz + rA) / 2);                         
box(T, H, bz - rB, rx, H / 2, (rB + bz) / 2);                         
box(T, H - DOOR_H, DOOR_W, rx, DOOR_H + (H - DOOR_H) / 2, rDoorZ);    

box(0.14, 0.2, DOOR_W + 0.3, rx - 0.03, DOOR_H + 0.1, rDoorZ, graniteDarkLambMat);          
for (const s of [-1, 1]) {
  box(0.14, DOOR_H, 0.1, rx - 0.03, DOOR_H / 2, rDoorZ + s * (DOOR_W / 2 + 0.05), graniteDarkLambMat); 
}

const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), floorMat);

floor.rotation.x = -Math.PI / 2;
floor.position.y = 0.02;
library.add(floor);

// Gable Roof
function createGableRoof({width, length, height, overhang = 0.25, capMat = woodMat, slopeMat = graniteDarkMat}) {
  const w = width + overhang * 2, l = length + overhang * 2;
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, 0);
  shape.lineTo(w / 2, 0);
  shape.lineTo(0, height);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {depth: l, bevelEnabled: false});
  geo.translate(0, 0, -l / 2);
  return new THREE.Mesh(geo, [capMat, slopeMat]); 
}

const roof = createGableRoof({width: W, length: D, height: ROOF_H, overhang: OV});
roof.position.y = H;
library.add(roof);

// Gable Trim
const gz = fz - OV;                
const Wg = W + OV * 2;
const slope = Math.atan2(ROOF_H, Wg / 2);
const slopeLen = Math.hypot(Wg / 2, ROOF_H);

for (const s of [-1, 1]) {
  const b = box(slopeLen + 0.1, 0.14, 0.14, s * Wg / 4, H + ROOF_H / 2, gz - 0.02, graniteDarkLambMat);
  b.rotation.z = -s * slope;
}
box(Wg + 0.1, 0.18, 0.16, 0, H + 0.05, gz - 0.02, graniteDarkLambMat);

// Triangular Window
function bar(group, x1, y1, x2, y2, th = 0.05) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(x2 - x1, y2 - y1), th, 0.03), graniteDarkLambMat);
  m.position.set((x1 + x2) / 2, (y1 + y2) / 2, 0.03);
  m.rotation.z = Math.atan2(y2 - y1, x2 - x1);
  group.add(m);
}

const gw = new THREE.Group();
gw.position.set(0, H, gz - 0.01);
gw.rotation.y = Math.PI;                           

const cy = ROOF_H * 0.4, sc = 0.78;                
const hb = sc * Wg / 2;
const yb = cy * (1 - sc);
const ya = cy + sc * (ROOF_H - cy);

const triShape = new THREE.Shape();
triShape.moveTo(-hb, yb);
triShape.lineTo(hb, yb);
triShape.lineTo(0, ya);
triShape.closePath();

const inc = yb + (ya - yb) / 3, k = 1.12;          
const triFrame = new THREE.Mesh(new THREE.ShapeGeometry(triShape), graniteDarkLambMat);
triFrame.scale.setScalar(k);
triFrame.position.set(0, inc * (1 - k), 0.005);
const triGlass = new THREE.Mesh(new THREE.ShapeGeometry(triShape), glassMat);
triGlass.position.z = 0.015;
gw.add(triFrame, triGlass);

const FAN = 3;                                     
for (let i = 0; i <= FAN; i++) {
  const t = i / FAN;
  const ex = hb * (1 - t), ey = yb + (ya - yb) * t;
  bar(gw, 0, yb, ex, ey);
  if (i < FAN) bar(gw, 0, yb, -ex, ey);
}
const crossY = yb + (ya - yb) * 0.45, crossHalf = hb * 0.55;
bar(gw, -crossHalf, crossY, crossHalf, crossY);
library.add(gw);

// Front Details
const bandY = 2.5, bandH = 0.1, bandT = 0.12;   
const off = bandT / 2 - 0.03;   

for (const z of [fz - off, bz + off]) {
  box(W + bandT * 2, bandH, bandT, 0, bandY, z, graniteDarkLambMat);
  box(DOOR_W + 0.3, 0.2, 0.14, 0, DOOR_H + 0.1, fz - 0.03, graniteDarkLambMat);   // header
  for (const s of [-1, 1]) {
    box(0.1, DOOR_H, 0.14, s * (DOOR_W / 2 + 0.05), DOOR_H / 2, fz - 0.03, graniteDarkLambMat);   // jambs
  }
}

for (const x of [rx - off, lx + off]) {
  box(bandT, bandH, D + bandT * 2, x, bandY, 0, graniteDarkLambMat);
}    

const libraryLantern1 = createLamp();
libraryLantern1.position.set(1.3, 1.6, fz - 0.2);

const libraryLantern2 = createLamp();
libraryLantern2.position.set(-1.3, 1.6, fz - 0.2);

library.add(libraryLantern1, libraryLantern2);

// Windows
function archShape(w, h) {
  const r = w / 2, s = new THREE.Shape();
  s.moveTo(-r, 0);
  s.lineTo(r, 0);
  s.lineTo(r, h - r);
  s.absarc(0, h - r, r, 0, Math.PI, false);
  s.lineTo(-r, 0);
  return s;
}

function addArchWindow(x, z, rotY, {y = 0.7, w = 1.1, h = 1.7} = {}) {
  const win = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.ShapeGeometry(archShape(w + 0.16, h + 0.08), 24), graniteDarkLambMat);
  frame.position.set(0, -0.04, 0.005);
  const glass = new THREE.Mesh(new THREE.ShapeGeometry(archShape(w, h), 24), glassMat);
  glass.position.z = 0.015;
  win.add(frame, glass);

  const barV = new THREE.Mesh(new THREE.BoxGeometry(0.05, h, 0.02), graniteDarkLambMat);
  barV.position.set(0, h / 2, 0.03);
  win.add(barV);
  for (const f of [0.33, 0.62]) {
    const barH = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, 0.02), graniteDarkLambMat);
    barH.position.set(0, h * f, 0.03);
    win.add(barH);
  }

  win.rotation.y = rotY;
  win.position.set(x + Math.sin(rotY) * 0.06, y, z + Math.cos(rotY) * 0.06);
  library.add(win);
}

addArchWindow( 2.35, fz, Math.PI);          
addArchWindow(-2.35, fz, Math.PI);
addArchWindow(rx, -1.6, -Math.PI / 2);     
addArchWindow(rx,  1.6, -Math.PI / 2);
addArchWindow( 2.35, bz, 0);                
addArchWindow(-2.35, bz, 0);

// Left Section
const ANNEX_Z   = -0.2;  
const ANNEX_LEN = 1.5;      
const ANNEX_W   = 4;         
const ANNEX_H   = H;         
const BAND_Y    = 2.5;  

const gapA = ANNEX_Z - ANNEX_W / 2;  
const gapB = ANNEX_Z + ANNEX_W / 2;    
const aEnd = lx + ANNEX_LEN;           

box(T, H, gapA - fz, lx, H / 2, (fz + gapA) / 2); 
box(T, H, bz - gapB, lx, H / 2, (gapB + bz) / 2);   

for (const s of [-1, 1]) {
  box(ANNEX_LEN, ANNEX_H, T, lx + ANNEX_LEN / 2, ANNEX_H / 2, ANNEX_Z + s * (ANNEX_W / 2 + 0.05));
}
box(T, ANNEX_H, ANNEX_W + 0.1, aEnd, ANNEX_H / 2, ANNEX_Z);

const annexFloor = new THREE.Mesh(new THREE.PlaneGeometry(ANNEX_LEN, ANNEX_W), floorMat);
annexFloor.rotation.x = -Math.PI / 2;
annexFloor.position.set(lx + ANNEX_LEN / 2, 0.02, ANNEX_Z);
library.add(annexFloor);

box(ANNEX_LEN + 0.3, 0.12, ANNEX_W + 0.4, lx + ANNEX_LEN / 2 + 0.1, H + 0.06, ANNEX_Z, graniteDarkLambMat);

for (const s of [-1, 1]) {
  box(ANNEX_LEN, 0.12, 0.14, lx + ANNEX_LEN / 2, BAND_Y, ANNEX_Z + s * (ANNEX_W / 2 + 0.12), graniteDarkLambMat);
}
box(0.14, 0.12, ANNEX_W + 0.3, aEnd + 0.04, BAND_Y, ANNEX_Z, graniteDarkLambMat);
box(0.14, 0.12, gapA - fz, lx + 0.04, BAND_Y, (fz + gapA) / 2, graniteDarkLambMat);
box(0.14, 0.12, bz - gapB, lx + 0.04, BAND_Y, (gapB + bz) / 2, graniteDarkLambMat);

library.position.set(-9.15, 0, 12);
library.traverse(o => {if (o.isMesh) {o.receiveShadow = true;o.castShadow = o.material !== glassMat && o.material !== lanternMat;}});
scene.add(library);

// Table & Chair
function createTable({width = 1.5, depth = 0.9, height = 0.65, topThickness = 0.1, legSize = 0.08, mat = woodDarkerMat} = {}) {
  const table = new THREE.Group();

  const top = new THREE.Mesh(new THREE.BoxGeometry(width, topThickness, depth), mat);
  top.position.y = height - topThickness / 2;          
  table.add(top);

  const legH = height - topThickness;
  const legGeo = new THREE.BoxGeometry(legSize, legH, legSize);
  const inset = 0.05;                                  

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const leg = new THREE.Mesh(legGeo, mat);
      leg.position.set(
        sx * (width / 2 - legSize / 2 - inset),
        legH / 2,
        sz * (depth / 2 - legSize / 2 - inset)
      );
      table.add(leg);
    }
  }

  table.traverse(o => {if (o.isMesh) {o.castShadow = true; o.receiveShadow = true;}});
  return table;
}

function createChair({size = 0.45, seatHeight = 0.4, backHeight = 0.5, seatThickness = 0.06, legSize = 0.05, mat = graniteDarkLambMat} = {}) {
  const chair = new THREE.Group();

  const seat = new THREE.Mesh(new THREE.BoxGeometry(size, seatThickness, size), mat);
  seat.position.y = seatHeight - seatThickness / 2;
  chair.add(seat);

  const back = new THREE.Mesh(new THREE.BoxGeometry(size, backHeight, 0.05), mat);
  back.position.set(0, seatHeight + backHeight / 2, -size / 2 + 0.025);
  chair.add(back);

  const legH = seatHeight - seatThickness;
  const legGeo = new THREE.BoxGeometry(legSize, legH, legSize);
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const leg = new THREE.Mesh(legGeo, mat);
      leg.position.set(sx * (size / 2 - legSize / 2), legH / 2, sz * (size / 2 - legSize / 2));
      chair.add(leg);
    }
  }

  chair.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return chair;
}

const table1 = createTable();
table1.position.set(-11.5, 0, 8.3);
const chair1 = createChair();
chair1.position.set(-12.35, 0, 8.3);  
chair1.rotation.y = Math.PI / 2; 

scene.add(table1, chair1);    


// MANOR ----
{
  const W = 13, D = 8, H = 4.8, T = 0.3;   
  const FLOOR2 = 2.4;                      
  const ROOF_H = 3, OV = 0.5;              

  const manor = new THREE.Group();

  const floorMat   = new THREE.MeshLambertMaterial({map: textureLoader.load('assets/textures/floor.jpg'), side: THREE.DoubleSide});

  function box(w, h, d, x, y, z, mat = woodCoolerMat) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    manor.add(m);
    return m;
  }

  // Back & Side Walls
  box(W, H, T, 0, H / 2,  D / 2);                      
  for (const s of [-1, 1]) box(T, H, D, s * W / 2, H / 2, 0);  

  // Front Wall & Entrance
  const dw = 1.7, dh = 2.1, dr = dw / 2;              
  const fs = new THREE.Shape();
  fs.moveTo(-W / 2, 0);
  fs.lineTo(-dw / 2, 0);
  fs.lineTo(-dw / 2, dh - dr);
  fs.absarc(0, dh - dr, dr, Math.PI, 0, true);       
  fs.lineTo(dw / 2, 0);
  fs.lineTo(W / 2, 0);
  fs.lineTo(W / 2, H);
  fs.lineTo(-W / 2, H);
  fs.closePath();
  const frontGeo = new THREE.ExtrudeGeometry(fs, { depth: T, bevelEnabled: false });
  frontGeo.translate(0, 0, -T / 2);
  const frontWall = new THREE.Mesh(frontGeo, woodCoolerMat);
  frontWall.position.z = -D / 2;
  manor.add(frontWall);

  // Floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W - T * 2, D - T * 2), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.02;
  manor.add(floor);
  box(W - T * 2, 0.15, D - T * 2, 0, FLOOR2, 0, graniteDarkLambMat);

  box(W + 0.3, 0.2, 1.1, 0, FLOOR2, -(D / 2 + 0.55), graniteLightLambMat);
  for (const s of [-1, 1]) box(0.3, 0.2, D, s * (W / 2 + 0.15), FLOOR2, 0, graniteLightLambMat);

  // Front Pillars
  for (const s of [-1, 1]) {
    const px = s * 4.2, pz = -(D / 2 + 0.8);
    const ph = FLOOR2 - 0.1;                             
    box(0.5, ph, 0.5, px, ph / 2, pz, stoneLightMat);
    box(0.7, 0.15, 0.7, px, 0.075, pz, stoneLightMat);           
  }

  // Corner trim
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    box(0.3, H, 0.3, sx * W / 2, H / 2, sz * D / 2, graniteLightLambMat);
  }

  // Roof
  const rw = D + OV * 2, rl = W + T;
  const rs = new THREE.Shape();
  rs.moveTo(-rw / 2, 0);
  rs.lineTo(rw / 2, 0);
  rs.lineTo(0, ROOF_H);
  rs.closePath();
  const roofGeo = new THREE.ExtrudeGeometry(rs, {depth: rl, bevelEnabled: false});
  roofGeo.translate(0, 0, -rl / 2);
  const roof = new THREE.Mesh(roofGeo, [woodCoolerMat, graniteDarkLambMat]); 
  roof.rotation.y = Math.PI / 2;
  roof.position.y = H;
  manor.add(roof);

  for (const s of [-1, 1]) box(rl, 0.15, 0.15, 0, H, s * rw / 2, graniteDarkLambMat);

  // Windows
  function addWindow(x, y, z, rotY, { w = 0.9, h = 1.2, mat = glassMat } = {}) {
    const g = new THREE.Group();
    const f = 0.07, d = 0.08;
    const part = (pw, ph, pd, px, py, pm = stoneLightMat) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, pd), pm);
      m.position.set(px, py, 0);
      g.add(m);
    };
    part(w, h, 0.04, 0, h / 2, mat);                                   
    part(w + f * 2, f, d, 0, h + f / 2);                               
    part(w + f * 2, f, d, 0, -f / 2);                                  
    part(f, h, d, -(w / 2 + f / 2), h / 2);                            
    part(f, h, d,  (w / 2 + f / 2), h / 2);                            
    part(f, h, d, 0, h / 2);                                           
    part(w, f, d, 0, h / 3);                                           
    part(w, f, d, 0, h * 2 / 3);
    g.position.set(x, y, z);
    g.rotation.y = rotY;
    manor.add(g);
  }

  const fz = -(D / 2 + T / 2 + 0.02);
  for (const x of [-5.5, -2.6, 2.6, 5.5]) addWindow(x, 0.6, fz, Math.PI, { h: 1.4 });              
  for (const x of [-5.2, -2.6, 0, 2.6, 5.2]) addWindow(x, FLOOR2 + 0.5, fz, Math.PI, { h: 1.5 });    

  const bz = D / 2 + T / 2 + 0.02;
  for (const x of [-4, 0, 4]) {
    addWindow(x, 0.6, bz, 0, { h: 1.4 });
    addWindow(x, FLOOR2 + 0.5, bz, 0, { h: 1.5 });
  }

  for (const s of [-1, 1]) {
    const gx = s * (W / 2 + T / 2 + 0.02);
    addWindow(gx, FLOOR2 + 0.3, 0, s * Math.PI / 2, { w: 1.3, h: 2.0 });

    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.08, 24), graniteLightLambMat);
    ring.rotation.z = Math.PI / 2;
    ring.position.set(gx, H + 1.0, 0);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.1, 24), glassMat);
    disc.rotation.z = Math.PI / 2;
    disc.position.copy(ring.position);
    manor.add(ring, disc);
  }

  manor.traverse(o => {if (o.isMesh) {o.receiveShadow = true; o.castShadow = o.material !== glassMat}});

  manor.position.set(6, 0, 11.5); 
  scene.add(manor);
}

const standLamp1 = createStandLamp();
standLamp1.position.set(7.5, 0, 7); 

const standLamp2 = createStandLamp();
standLamp2.position.set(4.5, 0, 7);

scene.add(standLamp1, standLamp2);



// GREENHOUSE ----

// Left Room --
const leftRoomBase = new THREE.Mesh(new THREE.BoxGeometry(6, 0.7, 4.5), stoneDarkMat);
leftRoomBase.position.set(-5, 0.3, -13.5);
leftRoomBase.castShadow = true;
leftRoomBase.receiveShadow = true;
scene.add(leftRoomBase);

{
  const W = 6, H = 2, D = 4.5, T = 0.25;   
  const leftRoom = new THREE.Group();

  const roomGlassMat = new THREE.MeshPhongMaterial({
    color: 0xadcced, transparent: true, opacity: 0.35,
    side: THREE.DoubleSide, depthWrite: false
  });

  function part(w, h, d, x, y, z, mat = graniteLightMat) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    leftRoom.add(m);
    return m;
  }

  // Arch 
  function archPath(path, cx, y0, w, h) {
    const r = w / 2;
    path.moveTo(cx - r, y0);
    path.lineTo(cx + r, y0);
    path.lineTo(cx + r, y0 + h - r);
    path.absarc(cx, y0 + h - r, r, 0, Math.PI, false);
    path.lineTo(cx - r, y0);
    return path;
  }

  // Side & Back Wall
  part(T, H, D, -(W / 2 - T / 2), H / 2, 0);                  
  part(T, H, D,  (W / 2 - T / 2), H / 2, 0);                    
  part(W - T * 2, H, T, 0, H / 2, -(D / 2 - T / 2));           

  // Front Wall
  const archW = 1.5, r = archW / 2;
  const windows = [
    {x: 0, y0: 0.25, h: 1.45},
    {x: 2, y0: 0.25, h: 1.45}
  ];

  const frontShape = new THREE.Shape();
  frontShape.moveTo(-W / 2, 0);
  frontShape.lineTo(W / 2, 0);
  frontShape.lineTo(W / 2, H);
  frontShape.lineTo(-W / 2, H);
  frontShape.closePath();
  for (const o of windows) frontShape.holes.push(archPath(new THREE.Path(), o.x, o.y0, archW, o.h));

  const frontWall = new THREE.Mesh(
    new THREE.ExtrudeGeometry(frontShape, {depth: T, bevelEnabled: false, curveSegments: 24}),
    graniteLightMat
  );
  frontWall.position.z = D / 2 - T;
  leftRoom.add(frontWall);

  // Arched Canopy
  const canopyLen = 1.1;                      
  const canopyR = r + 0.12;                    
  const ribCount = 4;
  const groundY = -0.6;          
  const entX = -2, entH = 1.7, spring = entH - r;              

  const canopy = new THREE.Group();
  canopy.position.set(entX, spring, D / 2);   

  const ribGeo = new THREE.TorusGeometry(canopyR, 0.04, 8, 24, Math.PI);
  const legGeo = new THREE.BoxGeometry(0.08, spring - groundY, 0.08);
  for (let i = 0; i <= ribCount; i++) {
  const z = (canopyLen / ribCount) * i;
  const rib = new THREE.Mesh(ribGeo, graniteDarkMat);
  rib.position.z = z;
  canopy.add(rib);

  for (const s of [-1, 1]) {                 
    const leg = new THREE.Mesh(legGeo, graniteDarkMat);
    leg.position.set(s * canopyR, (groundY - spring) / 2, z);
    canopy.add(leg);
  }
  }

  for (const a of [0.35, 0.5, 0.65]) {      
  const ang = Math.PI * a;
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, canopyLen), graniteDarkMat);
  bar.position.set(Math.cos(ang) * canopyR, Math.sin(ang) * canopyR, canopyLen / 2);
  canopy.add(bar);
  }

  leftRoom.add(canopy);

  // Glass
  for (const o of windows) {
    const glass = new THREE.Mesh(
      new THREE.ShapeGeometry(archPath(new THREE.Shape(), o.x, o.y0, archW, o.h), 24),
      roomGlassMat
    );
    glass.position.z = D / 2 - T / 2;
    leftRoom.add(glass);

    part(0.05, o.h - r, 0.06, o.x, o.y0 + (o.h - r) / 2, D / 2 - T / 2, graniteDarkMat);  
    part(archW, 0.05, 0.06, o.x, o.y0 + o.h * 0.5, D / 2 - T / 2, graniteDarkMat);        
  }

  // Dark Band Top
  part(W + 0.2, 0.12, D + 0.2, 0, H + 0.06, 0, graniteDarkMat);

  // Roof
  const roofY = H + 0.12;
  const roofH = 1.2;
  const topFrac = 0.5;                                         

  const roofGeo = new THREE.CylinderGeometry(topFrac / Math.SQRT2, 1 / Math.SQRT2, roofH, 4);
  roofGeo.rotateY(Math.PI / 4);                                 
  const roofGlass = new THREE.Mesh(roofGeo, roomGlassMat);
  roofGlass.scale.set(W, 1, D);
  roofGlass.position.y = roofY + roofH / 2;
  leftRoom.add(roofGlass);

  function strut(a, b, t = 0.1) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(t, t, a.distanceTo(b)), graniteDarkMat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.lookAt(b);
    leftRoom.add(m);
  }

  const hx = W / 2, hz = D / 2, yb = roofY, yt = roofY + roofH;
  const corners = [[-hx, -hz], [hx, -hz], [hx, hz], [-hx, hz]];
  const baseC = corners.map(([x, z]) => new THREE.Vector3(x, yb, z));
  const topC  = corners.map(([x, z]) => new THREE.Vector3(x * topFrac, yt, z * topFrac));

  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    strut(baseC[i], topC[i]);       
    strut(baseC[i], baseC[j]);      
    strut(topC[i], topC[j]);        
  }

  for (const x of [-1.5, 0, 1.5]) {
    strut(new THREE.Vector3(x, yb,  hz), new THREE.Vector3(x * topFrac, yt,  hz * topFrac), 0.08);   // front
    strut(new THREE.Vector3(x, yb, -hz), new THREE.Vector3(x * topFrac, yt, -hz * topFrac), 0.08);   // back
  }
  for (const z of [-0.75, 0.75]) {
    strut(new THREE.Vector3( hx, yb, z), new THREE.Vector3( hx * topFrac, yt, z * topFrac), 0.08);   // left side
    strut(new THREE.Vector3(-hx, yb, z), new THREE.Vector3(-hx * topFrac, yt, z * topFrac), 0.08);   // right side
  }

  leftRoom.traverse(o => {
    if (o.isMesh && o.material !== roomGlassMat) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });

  leftRoom.position.set(-5, 0.6, -13.5);   
  scene.add(leftRoom);
}

const standLamp3 = createStandLamp();
standLamp3.position.set(-8.5, 0, -11); 

const standLamp4 = createStandLamp();
standLamp4.position.set(-5.5, 0, -11);

scene.add(standLamp3, standLamp4);

// Middle Room --
const MiddleRoomBase = new THREE.Mesh(new THREE.BoxGeometry(5, 0.7, 8.5), stoneDarkMat);
MiddleRoomBase.position.set(0.5, 0.3, -11.5);
MiddleRoomBase.castShadow = true;
MiddleRoomBase.receiveShadow = true;
scene.add(MiddleRoomBase);

{
  const W = 5, H = 2, D = 8.5, T = 0.25;
  const midRoom = new THREE.Group();

  const midGlassMat = new THREE.MeshPhongMaterial({
    color: 0xadcced, transparent: true, opacity: 0.35,
    side: THREE.DoubleSide, depthWrite: false
  });

  function part(w, h, d, x, y, z, mat = graniteLightMat, parent = midRoom) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }

  function archPath(path, cx, y0, w, h) {
    const r = w / 2;
    path.moveTo(cx - r, y0);
    path.lineTo(cx + r, y0);
    path.lineTo(cx + r, y0 + h - r);
    path.absarc(cx, y0 + h - r, r, 0, Math.PI, false);
    path.lineTo(cx - r, y0);
    return path;
  }

  function glazedWall(width, openings) {
    const g = new THREE.Group();

    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(width / 2, 0);
    shape.lineTo(width / 2, H);
    shape.lineTo(-width / 2, H);
    shape.closePath();
    for (const o of openings) shape.holes.push(archPath(new THREE.Path(), o.x, o.y0, o.w, o.h));

    g.add(new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, { depth: T, bevelEnabled: false, curveSegments: 24 }),
      graniteLightMat
    ));

    for (const o of openings) {
      const glass = new THREE.Mesh(
        new THREE.ShapeGeometry(archPath(new THREE.Shape(), o.x, o.y0, o.w, o.h), 24),
        midGlassMat
      );
      glass.position.z = T / 2;
      g.add(glass);

      const r = o.w / 2;
      part(0.05, o.h - r, 0.06, o.x, o.y0 + (o.h - r) / 2, T / 2, graniteDarkMat, g);   // center bar
      part(o.w, 0.05, 0.06, o.x, o.y0 + o.h * 0.5, T / 2, graniteDarkMat, g);            // cross bar
    }
    return g;
  }

  part(T, H, D, W / 2 - T / 2, H / 2, 0);                       
  part(W - T * 2, H, T, 0, H / 2, -(D / 2 - T / 2));           

  // Front Wall
  const archW = 2.4, archH = 1.8, archY0 = 0.05;      
  const ar = archW / 2, spring = archY0 + archH - ar; 
  const frontZ = D / 2 - T / 2;

  const glassShape = new THREE.Shape();
  glassShape.moveTo(-(W - T * 2) / 2, 0);
  glassShape.lineTo((W - T * 2) / 2, 0);
  glassShape.lineTo((W - T * 2) / 2, H);
  glassShape.lineTo(-(W - T * 2) / 2, H);
  glassShape.closePath();
  glassShape.holes.push(archPath(new THREE.Path(), 0, archY0, archW, archH));

  const frontGlass = new THREE.Mesh(new THREE.ShapeGeometry(glassShape, 24), midGlassMat);
  frontGlass.position.z = frontZ;
  midRoom.add(frontGlass);

  const fw = 0.12, R = ar + fw;
  const frameShape = new THREE.Shape();
  frameShape.moveTo(-R, archY0);
  frameShape.lineTo(-R, spring);
  frameShape.absarc(0, spring, R, Math.PI, 0, true);
  frameShape.lineTo(R, archY0);
  frameShape.lineTo(ar, archY0);
  frameShape.lineTo(ar, spring);
  frameShape.absarc(0, spring, ar, 0, Math.PI, false);
  frameShape.lineTo(-ar, archY0);
  frameShape.closePath();

const archFrame = new THREE.Mesh(
  new THREE.ExtrudeGeometry(frameShape, {depth: 0.14, bevelEnabled: false, curveSegments: 24}),
  graniteDarkMat
);
archFrame.position.z = frontZ - 0.07;
midRoom.add(archFrame);


  // Left Wall
  const left = glazedWall(D, [
    {x: 2.5, y0: 0.25, w: 1.5, h: 1.45} 
  ]);
  left.rotation.y = -Math.PI / 2;
  left.position.x = -W / 2 + T;
  midRoom.add(left);

  part(W + 0.2, 0.12, D + 0.2, 0, H + 0.06, 0, graniteDarkMat);

  // Roof
  const roofY = H + 0.12;
  const roofH = 1.2;
  const topFrac = 0.5;

  const roofGeo = new THREE.CylinderGeometry(topFrac / Math.SQRT2, 1 / Math.SQRT2, roofH, 4);
  roofGeo.rotateY(Math.PI / 4);
  const roofGlass = new THREE.Mesh(roofGeo, midGlassMat);
  roofGlass.scale.set(W, 1, D);
  roofGlass.position.y = roofY + roofH / 2;
  midRoom.add(roofGlass);

  function strut(a, b, t = 0.1) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(t, t, a.distanceTo(b)), graniteDarkMat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.lookAt(b);
    midRoom.add(m);
  }

  const hx = W / 2, hz = D / 2, yb = roofY, yt = roofY + roofH;
  const corners = [[-hx, -hz], [hx, -hz], [hx, hz], [-hx, hz]];
  const baseC = corners.map(([x, z]) => new THREE.Vector3(x, yb, z));
  const topC  = corners.map(([x, z]) => new THREE.Vector3(x * topFrac, yt, z * topFrac));

  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    strut(baseC[i], topC[i]);      
    strut(baseC[i], baseC[j]);      
    strut(topC[i], topC[j]);       
  }

  for (const x of [-1.25, 0, 1.25]) {
    strut(new THREE.Vector3(x, yb,  hz), new THREE.Vector3(x * topFrac, yt,  hz * topFrac), 0.08);
    strut(new THREE.Vector3(x, yb, -hz), new THREE.Vector3(x * topFrac, yt, -hz * topFrac), 0.08);
  }
  for (const z of [-2.8, -1.4, 0, 1.4, 2.8]) {
    strut(new THREE.Vector3( hx, yb, z), new THREE.Vector3( hx * topFrac, yt, z * topFrac), 0.08);
    strut(new THREE.Vector3(-hx, yb, z), new THREE.Vector3(-hx * topFrac, yt, z * topFrac), 0.08);
  }

  // Ramp 
  const rampLen = 1, rampW = archW + 0.4;
  const groundY = -0.6;                               
  const rampShape = new THREE.Shape();
  rampShape.moveTo(0, groundY);
  rampShape.lineTo(rampLen, groundY);
  rampShape.lineTo(0, archY0);
  rampShape.closePath();

  const rampGeo = new THREE.ExtrudeGeometry(rampShape, {depth: rampW, bevelEnabled: false});
  rampGeo.rotateY(-Math.PI / 2);                    
  rampGeo.translate(rampW / 2, 0, 0);                
  const ramp = new THREE.Mesh(rampGeo, stoneDarkMat);
  ramp.position.z = D / 2;                           
  midRoom.add(ramp);

  midRoom.traverse(o => {
    if (o.isMesh && o.material !== midGlassMat) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });

  midRoom.position.set(0.5, 0.6, -11.5);   
  scene.add(midRoom);
}

// Right Room
const rightRoom = new THREE.Group();
const RightRoomBase = new THREE.Mesh(new THREE.BoxGeometry(6, 0.7, 3.5), stoneDarkMat);
RightRoomBase.position.set(6, 0.3, -9);

const RightRoomBuild = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 3.5), graniteLightMat);
RightRoomBuild.position.set(6, 1.6, -9);

{
  const W = 6, D = 3.5;                
  const bodyTop = 2.6;                  

  const roofGlassMat = new THREE.MeshPhongMaterial({
    color: 0xadcced, transparent: true, opacity: 0.35,
    side: THREE.DoubleSide, depthWrite: false
  });

  const roof = new THREE.Group();     

  const band = new THREE.Mesh(new THREE.BoxGeometry(W + 0.2, 0.12, D + 0.2), graniteDarkMat);
  band.position.y = 0.06;
  roof.add(band);

  const roofY = 0.12, roofH = 1.2, topFrac = 0.5;
  const roofGeo = new THREE.CylinderGeometry(topFrac / Math.SQRT2, 1 / Math.SQRT2, roofH, 4);
  roofGeo.rotateY(Math.PI / 4);
  const glass = new THREE.Mesh(roofGeo, roofGlassMat);
  glass.scale.set(W, 1, D);
  glass.position.y = roofY + roofH / 2;
  roof.add(glass);

  function strut(a, b, t = 0.1) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(t, t, a.distanceTo(b)), graniteDarkMat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.lookAt(b);
    m.castShadow = true;
    roof.add(m);
  }

  const hx = W / 2, hz = D / 2, yb = roofY, yt = roofY + roofH;
  const corners = [[-hx, -hz], [hx, -hz], [hx, hz], [-hx, hz]];
  const baseC = corners.map(([x, z]) => new THREE.Vector3(x, yb, z));
  const topC  = corners.map(([x, z]) => new THREE.Vector3(x * topFrac, yt, z * topFrac));

  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    strut(baseC[i], topC[i]);    
    strut(baseC[i], baseC[j]);   
    strut(topC[i], topC[j]);     
  }

  for (const x of [-1.5, 0, 1.5]) {
    strut(new THREE.Vector3(x, yb,  hz), new THREE.Vector3(x * topFrac, yt,  hz * topFrac), 0.08);
    strut(new THREE.Vector3(x, yb, -hz), new THREE.Vector3(x * topFrac, yt, -hz * topFrac), 0.08);
  }
  for (const z of [-0.9, 0.9]) {
    strut(new THREE.Vector3( hx, yb, z), new THREE.Vector3( hx * topFrac, yt, z * topFrac), 0.08);
    strut(new THREE.Vector3(-hx, yb, z), new THREE.Vector3(-hx * topFrac, yt, z * topFrac), 0.08);
  }

  band.castShadow = true;
  roof.position.set(6, bodyTop, -9);
  rightRoom.add(roof);
}

rightRoom.traverse(o => {
      o.castShadow = true;
      o.receiveShadow = true;
  });

rightRoom.add(RightRoomBase, RightRoomBuild);
scene.add(rightRoom);

const standLamp5 = createStandLamp();
standLamp5.position.set(2.5, 0, -6.5); 

const standLamp6 = createStandLamp();
standLamp6.position.set(-1.5, 0, -6.5);

scene.add(standLamp5, standLamp6);

// FINAL DETAILS ----
// Wall Loop 1
const loopWall1 = new THREE.Group();

const loopWallBottom1Geo = new THREE.BoxGeometry(0.2, 2, 3);
const loopWallBottom1 = new THREE.Mesh(loopWallBottom1Geo, graniteLightLambMat);
loopWallBottom1.position.set(-11, 0, 2);

const loopWallTop1Geo = new THREE.BoxGeometry(0.2, 0.5, 1.6);
const loopWallTop1 = new THREE.Mesh(loopWallTop1Geo, graniteLightLambMat);
loopWallTop1.position.set(-11, 1.2, 2.5);

const loopWallBottomR1Geo = new THREE.BoxGeometry(0.2, 2, 1.5);
const loopWallBottomR1 = new THREE.Mesh(loopWallBottomR1Geo, graniteLightLambMat);
loopWallBottomR1.rotation.y = Math.PI / 2;
loopWallBottomR1.position.set(-10.2, 0, 3.4);

const loopWallTopR1Geo = new THREE.BoxGeometry(0.2, 0.4, 0.9);
const loopWallTopR1 = new THREE.Mesh(loopWallTopR1Geo, graniteLightLambMat);
loopWallTopR1.rotation.y = Math.PI / 2;
loopWallTopR1.position.set(-10.6, 1.2, 3.4);


loopWall1.add(loopWallBottom1, loopWallTop1, loopWallBottomR1, loopWallTopR1);

loopWall1.traverse(o => {if (o.isMesh) {o.castShadow = true; o.receiveShadow = true;}});

// Wall Loop 2
const loopWall2Geo = new THREE.BoxGeometry(0.2, 2, 4);
const loopWall2 = new THREE.Mesh(loopWall2Geo, graniteLightLambMat);
loopWall2.position.set(-6, 0.4, 5);
loopWall2.castShadow = true;
loopWall2.receiveShadow = true;

scene.add(loopWall2);

// Wall Loop 3
const loopWall3 = new THREE.Mesh(loopWall2Geo, graniteLightLambMat);
loopWall3.rotation.y = Math.PI / 2;
loopWall3.position.set(7, 0.4, -4);
loopWall3.castShadow = true;
loopWall3.receiveShadow = true;

scene.add(loopWall1, loopWall2, loopWall3);


const pathGeo = new THREE.BoxGeometry(1.5, 0.1, mapDepth / 2);
const pathMat = new THREE.MeshLambertMaterial({map: textureLoader.load('assets/textures/path.jpg'), side: THREE.DoubleSide});

const path1 = new THREE.Mesh(pathGeo, pathMat);
path1.position.set(15, 0.1, mapDepth / 4);
path1.receiveShadow = true;

const path2 = new THREE.Mesh(pathGeo, pathMat);
path2.position.set(13.5, 0.1, -mapDepth / 4);
path2.receiveShadow = true;

scene.add(path1, path2);

// ANIMATE ----
const walkRadius = 2;      
const walkSpeed = 0.5;        
const followGap = 1;       
const walkCenter = new THREE.Vector3(0, 0, 0); 
const twoTimeFacing = 0;
const azureFacing = Math.PI;  
const clock = new THREE.Clock();
const modelFacingOffset = 0;

function placeOnCircle(model, angle, y) {
  model.position.set(
    walkCenter.x + Math.cos(angle) * walkRadius,
    y,
    walkCenter.z + Math.sin(angle) * walkRadius
  );

  model.rotation.y = -angle + (walkSpeed > 0 ? 0 : Math.PI) + modelFacingOffset;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  const t = clock.getElapsedTime();
  const angle = t * walkSpeed;

  placeOnCircle(TwoTimemodel, angle, 0.35);
  placeOnCircle(Azuremodel, angle - followGap * Math.sign(walkSpeed), 0);

  TwoTimemodel.rotation.y = -angle + twoTimeFacing;
  Azuremodel.rotation.y = -(angle - followGap * Math.sign(walkSpeed)) + azureFacing;

  TheSpawn.rotation.z += 0.01;
  TheSpawnGlow.rotation.z -= 0.02;

  stars.rotation.y += 0.002;

  renderer.render(scene, camera);

}
animate();