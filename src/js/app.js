import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
let scene, camera, renderer, controls, dynamicTexture, glb,mesh, inputElement;
let manager = new THREE.LoadingManager;
let sceneloader = new GLTFLoader(manager);
manager.onLoad = function (){
  init();
  render();
};
sceneloader.load("mesh/cube_UV.glb", function(gltf){
  gltf.scene.traverse((child) => {
    glb = child
  })
});
function updateCanvas(text) {
    const canvas = dynamicTexture.image;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "40px Arial";
    context.fillStyle = "red";
    context.fillText(text, 10, 50);
    dynamicTexture.needsUpdate = true;
}
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    controls = new OrbitControls( camera, renderer.domElement);
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    dynamicTexture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ map: dynamicTexture });
    // const geometry = new THREE.BoxGeometry();
    // mesh = new THREE.Mesh(geometry, material);
    glb.material = material;
    scene.add(glb);
    inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.placeholder = "Type something...";
    document.body.appendChild(inputElement);
    inputElement.addEventListener("input", function () {
        const userInput = inputElement.value;
        updateCanvas(userInput);
        console.log("input")
    });
    updateCanvas("canka!");
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
window.addEventListener("resize", onWindowResize);

