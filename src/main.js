import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from "three/examples/jsm/Addons.js";



const canvas = document.querySelector(".web3");
const speed = document.querySelector("#speed");
const show_speed = document.querySelector("#show_speed");

const add_motor = document.querySelector("#add_motor"); // input
const btn_engines = document.querySelector(".btn_engines"); // btn
const select = document.querySelector("#engine"); // dropdown

const btn_left = document.querySelector(".btn_left");
const btn_S = document.querySelector(".btn_S");
const btn_right = document.querySelector(".btn_right");
const butn = document.querySelector("#butn");

let engin = false; // run and stop motor





select.addEventListener("change",()=>{
  console.log(select.value);
})





add_motor.addEventListener("keydown",(e)=>{
  if(e.key == "Enter"){
    console.log(add_motor.value);
  }
})


btn_engines.addEventListener("click", ()=>{
  let value = add_motor.value;
  console.log(value);
})








const scene = new THREE.Scene();
scene.background = new THREE.Color("gray")




const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco");

let animate = null


const gltf = new GLTFLoader();
gltf.setDRACOLoader(dracoLoader);


gltf.load("/Canvaer.glb", (canvaer)=>{
  scene.add(canvaer.scene)
  let rotations = -1.5

  animate = new THREE.AnimationMixer(canvaer.scene);
  let animateion = animate.clipAction(canvaer.animations[0]);
  console.log(animateion);
  

  let mesh = canvaer.scene
  mesh.rotation.y = rotations;

  btn_S.addEventListener("click",()=>{
    
    if(engin == false){
      engin = true;
      btn_S.innerHTML = "Stop";
      animateion.play()
      animateion.paused = false
      
      

    }else{
      engin = false;
      btn_S.innerHTML = "Start"
      animateion.paused = true
      
    }
  
  });

  btn_left.addEventListener("click",()=>{
    console.log("dir = left");
    animateion.timeScale = -1
  });
  
  
  btn_right.addEventListener("click",()=>{
    console.log("dir = right");
    animateion.timeScale = 1
  });
  


});


//light 
let aml = new THREE.AmbientLight("#FFFFFF", 5);

let dir1 = new THREE.DirectionalLight("#FFFFFF", 1);
dir1.position.set(0,0,-5);
let dir2 = new THREE.DirectionalLight("#FFFFFF", 1);
dir2.position.set(0,0,5);
let dir3 = new THREE.DirectionalLight("#FFFFFF", 1);
dir3.position.set(0,10,0);
let dir4 = new THREE.DirectionalLight("#FFFFFF", 1);
dir4.position.set(0,-10,0);
let dir5 = new THREE.DirectionalLight("#FFFFFF", 1);
dir5.position.set(20,0,0);
let dir6 = new THREE.DirectionalLight("#FFFFFF", 1);
dir6.position.set(-20,0,0);

scene.add(aml, dir1, dir2, dir3, dir4, dir5, dir6)



let size = {
  width: canvas.offsetWidth,
  height: canvas.offsetHeight
}


const camera = new THREE.PerspectiveCamera(75,size.width/size.height);
camera.position.set(0,5,8);





const renderer = new THREE.WebGLRenderer({
  canvas:canvas,
  antialias: true,
});



const controle = new OrbitControls(camera, canvas);
controle.enableDamping = true;
controle.minDistance = 8
controle.maxDistance = 12


window.addEventListener("resize",()=>{
  size.width = canvas.offsetWidth;
  size.height = canvas.offsetHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix()
  renderer.setSize(size.width, size.height)
});

//speed




let speedFactor = 0.0001;
let clock = new THREE.Clock();
let startTime = 0;

speed.addEventListener("input",()=>{
  show_speed.innerHTML = speed.value;
  speedFactor = parseFloat(speed.value / 10000)
  console.log(speedFactor);
});


const animateion = ()=>{

  let elapse = clock.getElapsedTime();
  let new_time = (elapse - startTime) * speedFactor;
  // startTime = elapse;

 
  if(animate){
    animate.update(speedFactor)
  }



  requestAnimationFrame(animateion);
  controle.update()
  renderer.render(scene, camera)
  renderer.setSize(size.width,size.height)
};


animateion();