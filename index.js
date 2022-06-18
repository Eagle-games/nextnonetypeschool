import * as THREE from'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';
import "./index.css";

let camera;
let scene;
let renderer;
let model;

init();
animate();

function init() {
    //シーンの作成
    scene = new THREE.Scene();

    //カメラの作成
    cameraa = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    //カメラセット
    cameraa.position.set(-20, 30, 50);
    cameraa.lookAt(new THREE.Vector3(0, 10, 0));
    
    //光源
    const dirLight = new THREE.SpotLight(0xffffff,1.5);//color,強度
    dirLight.position.set(-20, 30, 30);
    scene.add(dirLight);

    //レンダラー
    renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true
    });
    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setSize(window.innerWidth, window.innerHeight);

    //glbファイルの読み込み
    const loader = new GLTFLoader();

    loader.load('https://eagle-games.github.io/nonetypeschool/untitled.glb', function(gltf) {
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

    document.getElementById("WebGL-output").appendChild(renderer.domElement);
}


// Canvas
const canvas = document.querySelector("#WebGL-output");

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//GridHelperの設定
const gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);

// Camera
const camerab = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camerab.position.z = 6;
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
    camerab.lookAt(box.position);
    camerab.position.set(0, 1 ,10);
    box.position.z = lerp(-15, 2, scaleParcent(0, 40));
  },
});

animationScripts.push({
  start: 40,
  end: 60,
  function() {
    camerab.lookAt(box.position);
    camerab.position.set(0, 1 ,10);
    box.rotation.z = lerp(2, Math.PI, scaleParcent(40, 60));
  },
});

animationScripts.push({
  start: 60,
  end: 80,
  function() {
    camerab.lookAt(box.position);
    camerab.position.x = lerp(0, 10, scaleParcent(60, 80));
    camerab.position.y = lerp(1, 12, scaleParcent(60, 80));
    camerab.position.z = lerp(10, 20, scaleParcent(60, 80));
  },
});

animationScripts.push({
  start: 80,
  end: 101,
////////////////////////////////////////////////////////////////////////////////////////////////////////
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, cameraa);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  renderer.render(scene, camerab);
};

tick();

//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camerab.aspect = sizes.width / sizes.height;
  camerab.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.scrollTo({ top: 0, behavior: "smooth" });
