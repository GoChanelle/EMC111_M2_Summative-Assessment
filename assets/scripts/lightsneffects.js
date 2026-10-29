import * as THREE from 'three';

export function setupLights(scene, renderer) {
  renderer.shadowMap.enabled = true;

  const sceneAmbientLight = new THREE.AmbientLight(0x4a0073, 0.9);
  scene.add(sceneAmbientLight);

  const light = new THREE.HemisphereLight(0x6206b8, 0x250061, 0.8);
  scene.add(light);

  const spawnLight = new THREE.SpotLight(0xa696f2, 300);
  spawnLight.position.set(0, 15, -2);
  spawnLight.target.position.set(0, 0, 0);
  spawnLight.angle = Math.PI / 6;
  spawnLight.penumbra = 0.6;
  spawnLight.decay = 1.5;
  spawnLight.distance = 20;

  spawnLight.shadow.bias = -0.0005;
  spawnLight.shadow.normalBias = 0.02;

  scene.add(spawnLight);
  scene.add(spawnLight.target);

  spawnLight.castShadow = true;
  spawnLight.shadow.mapSize.set(2048, 2048);
  spawnLight.shadow.camera.near = 1;
  spawnLight.shadow.camera.far = 30;

  return { sceneAmbientLight, light, spawnLight };
}

export function particles(scene) {
    const points = [];

    for (let i = 0; i < 2000; i++) {
    const dir = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ).normalize();
    points.push(dir.multiplyScalar(80 + Math.random() * 220));
  }

    const starGeo = new THREE.BufferGeometry().setFromPoints(points);

    let sprite = new THREE.TextureLoader().load("assets/textures/star.png");
    let starMaterial = new THREE.PointsMaterial({
        color: 0xffb6c1,
        sizeAttenuation: false,
        size: 2,
        map: sprite,
    });


  const stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);

  return stars;
}