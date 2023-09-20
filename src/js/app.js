import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';


let scene, camera, renderer, controls, dynamicTexture, envMap;
let header;
let stones = [];
let manager = new THREE.LoadingManager;
let sceneloader = new GLTFLoader(manager);
let hdriloader = new RGBELoader(manager);
const input = document.querySelector('#text')
const enterButton = document.querySelector('.button')
let texts = ['New Commandments'];
let lineWidth = 500;
let loader = new FontLoader();
let monarch;
loader.load('fonts/Monarch_Regular.json', function(font){
  monarch = font;
} );


manager.onLoad = function (){
  godswork();
  render();
};
sceneloader.load("mesh/stone.glb", function(gltf){
  gltf.scene.traverse((child) => {
    if (child.name == "stone_head"){
      header = child;
    }else{
      stones.push(child)
    }
  })
});
hdriloader.load('images/hdri_01.hdr', function(hdri) {
  envMap = hdri;
  envMap.mapping = THREE.EquirectangularReflectionMapping

  
});


function updateCanvas(textsArr) {
  const canvas = dynamicTexture.image;
  const context = canvas.getContext("2d");
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = '50px monarch';
  context.fillStyle = "grey";
  dynamicTexture.needsUpdate = true;
  let nextLineX  = 300;
  let lineHeight = 60;

  textsArr.forEach((item,index)=>{
    context.fillText(textsArr[index], nextLineX, lineHeight + (index *  lineHeight));
  })  
}

function godswork() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1.5;
    renderer = new THREE.WebGLRenderer({canvas: document.querySelector(".canvas"), antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    scene.environment = envMap;

    window.addEventListener("resize", onWindowResize);
  
    controls = new OrbitControls( camera, renderer.domElement);

    const ambientLight = new THREE.AmbientLight(1);

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    dynamicTexture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshPhysicalMaterial({ map: dynamicTexture, side:  THREE.DoubleSide, bumpMap: dynamicTexture, bumpScale: 0.008});

    header.material = material;

    const nextstone = stones[1];
    nextstone.material = material;
    nextstone.position.y = -1;

    scene.add(header, nextstone, ambientLight);
    updateCanvas(texts)
}
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

enterButton.addEventListener('click', onButtonClick)

function onButtonClick(event){
  if(input.value){
    texts.unshift(input.value);
    updateCanvas(texts)
  }
}

