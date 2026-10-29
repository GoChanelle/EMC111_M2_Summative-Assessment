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

  const dLightHelper1 = new THREE.SpotLightHelper(spawnLight);
  scene.add(dLightHelper1);

  spawnLight.castShadow = true;
  spawnLight.shadow.mapSize.set(2048, 2048);
  spawnLight.shadow.camera.near = 1;
  spawnLight.shadow.camera.far = 30;

  return { sceneAmbientLight, light, spawnLight };
}