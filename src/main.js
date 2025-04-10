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
const checked = document.querySelector("#checked");
const label_cheack = document.querySelector("#label_cheack");
const notif = document.querySelector("#notif")


let engin = false; // run and stop motor





select.addEventListener("change",()=>{
  console.log(select.value);
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
  
  let engins = canvaer.scene.children[1];

  animate = new THREE.AnimationMixer(canvaer.scene);
  let animateion = animate.clipAction(canvaer.animations[0]);
 

  function createEngin(cunt){
    for(let i = 0; i < cunt; i++){
      let engin_clon = engins.clone();

      engin_clon.position.copy(engins.position); // کپی موقعیت
      engin_clon.rotation.copy(engins.rotation); // کپی موقعیت
      engin_clon.scale.copy(engins.scale); // کپی موقعیت

      scene.add(engin_clon);
    }
  }



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

// dir left
  btn_left.addEventListener("click",()=>{
    console.log("dir = left");
    animateion.timeScale = -1
  });
  
  // dir right
  btn_right.addEventListener("click",()=>{
    console.log("dir = right");
    animateion.timeScale = 1
  });
  




  let isCeackAddMotor = false;
// add motor in map
  add_motor.addEventListener("keydown",(e)=>{
    if(e.key == "Enter"){

      isCeackAddMotor = true;
      add_motor.disabled = true;
      btn_engines.style.background = "red";
      checked.checked = true;
      label_cheack.textContent = "Enabled add engin"
      let value = parseInt(add_motor.value);
      createEngin(value)
    }
  });
  
  // add motor in map
  btn_engines.addEventListener("click", ()=>{
    let value = add_motor.value;
    if(!add_motor.value){
       notif.textContent = "Enter Yor value";
     setInterval(()=>{
        notif.textContent = "";
     },2000);

    }else{

      if(isCeackAddMotor == true){
        btn_engines.disabled = true;

      }else{
        createEngin(value)
        checked.checked = true;
        label_cheack.textContent = "Enabled add engin";
        add_motor.disabled = true;
        btn_engines.disabled = true;
        btn_engines.style.background = "red";
      };
    };

      
  });

// dis and enabled add motor
  checked.addEventListener("change", (e)=>{
   
    if(e.target.checked == true){
      isCeackAddMotor = true;
      add_motor.disabled = true;
      btn_engines.disabled = true;
      label_cheack.textContent = "Enabled add engin";
      btn_engines.style.background = "red";

    }else{
      isCeackAddMotor = false;
      add_motor.disabled = false;
      btn_engines.disabled = false;
      label_cheack.textContent = "Disabled add engin";
      btn_engines.style.background = "#005eec";

    };
  })
  



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
camera.position.set(50,35);





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