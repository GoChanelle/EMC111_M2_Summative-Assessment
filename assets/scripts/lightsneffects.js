import * as THREE from 'three';

export function setupLights(scene, renderer) {
  renderer.shadowMap.enabled = true;

  const sceneAmbientLight = new THREE.AmbientLight(0x4a0073, 0.6);
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

  const sceneDirectionalLight = new THREE.DirectionalLight(0x4622b3, 1);
  sceneDirectionalLight.position.set(-17, 5, 0);       
  sceneDirectionalLight.target.position.set(2, 0, 0);   
  scene.add(sceneDirectionalLight, sceneDirectionalLight.target);
  
  sceneDirectionalLight.castShadow = true;
  sceneDirectionalLight.shadow.mapSize.set(2048, 2048);
  sceneDirectionalLight.shadow.bias = -0.0005;
  sceneDirectionalLight.shadow.normalBias = 0.03;

  const sc = sceneDirectionalLight.shadow.camera;
  sc.left = -24;
  sc.right = 24;
  sc.top = 24;
  sc.bottom = -24;
  sc.near = 1;
  sc.far = 60;
  sc.updateProjectionMatrix();

  return {sceneAmbientLight, light, spawnLight, sceneDirectionalLight};
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
        color: 0xb6c8ff,
        sizeAttenuation: false,
        size: 2.5,
        map: sprite,
    });


  const stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);

  return stars;
}