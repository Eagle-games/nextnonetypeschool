import * as THREE from'https://unpkg.com/three@0.126.1/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';


let model;
animate();

// Canvas
const canvas = document.querySelector("#webgl");

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

//GridHelperの設定
const gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//オブジェクトの追加
const geometry = new THREE.BoxGeometry(5, 5, 5, 10);
const material = new THREE.MeshNormalMaterial();

const box = new THREE.Mesh(geometry, material);
box.position.set(0, 0.5, -15);
box.rotation.set(1, 1, 0);
scene.add(box);


///////////////////////////////////////////////////////////////////////////////////////////////////
    //glbファイルの読み込み
    const loader = new GLTFLoader();

    loader.load('https://eagle-games.github.io/nextnonetypeschool/untitled.glb', function(gltf) {
        model = gltf.scene;
        model.traverse((object) => { //モデルの構成要素
            if(object.isMesh) { //その構成要素がメッシュだったら
            object.material.trasparent = true;//透明許可
            object.material.opacity = 0.8;//透過
            object.material.depthTest = true;//陰影で消える部分
            }})
        scene.add(model);
    }, undefined, function(e) {
        console.error(e);
    });

    document.getElementById("webgl").appendChild(renderer.domElement);
///////////////////////////////////////////////////////////////////////////////////////////////////



/**
 * 線形補間
 * lerp(min, max, ratio)
 * 例：
 * lerp(20, 60, .5)) = 40
 * lerp(-20, 60, .5)) = 20
 * lerp(20, 60, .75)) = 50
 * lerp(-20, -10, .1)) = -.19
 */
function lerp(x, y, a) {
  return (1 - a) *x + a * y;
}

/**
 * 特定のスクロール率で開始、終了
 **/
function scaleParcent(start, end) {
  return (scrollParcent - start) / (end - start);
}

/**
 * スクロールアニメーション関数定義
 */
const animationScripts = [];

/**
 * スクロールアニメーション開始関数
 */
animationScripts.push({
  start: 0,
  end: 40,
  function() {
    camera.lookAt(box.position);
    camera.position.set(0, 1 ,10);
    box.position.z = lerp(-15, 2, scaleParcent(0, 40));
  },
});

animationScripts.push({
  start: 40,
  end: 60,
  function() {
    camera.lookAt(box.position);
    camera.position.set(0, 1 ,10);
    box.rotation.z = lerp(2, Math.PI, scaleParcent(40, 60));
  },
});

animationScripts.push({
  start: 60,
  end: 80,
  function() {
    camera.lookAt(box.position);
    camera.position.x = lerp(0, 10, scaleParcent(60, 80));
    camera.position.y = lerp(1, 12, scaleParcent(60, 80));
    camera.position.z = lerp(10, 20, scaleParcent(60, 80));
  },
});

animationScripts.push({
  start: 80,
  end: 101,
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  },
});
/**
* スクロールアニメーション開始
*/
function playScollAnimation() {
  animationScripts.forEach((animation) => {
    if (scrollParcent >= animation.start && scrollParcent < animation.end) {
      animation.function();
    }
  })
}

/**
 * ブラウザのスクロール率を導出
 */
let scrollParcent = 0;

document.body.onscroll = () => {
  scrollParcent = 
    (document.documentElement.scrollTop / 
      (document.documentElement.scrollHeight - 
        document.documentElement.clientHeight)) * 
    100;
};

//アニメーション
const tick = () => {
  window.requestAnimationFrame(tick);
  /**
    * スクロールアニメーション開始
    */
  playScollAnimation();
  renderer.render(scene, camera);
};

tick();

//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.scrollTo({ top: 0, behavior: "smooth" });
