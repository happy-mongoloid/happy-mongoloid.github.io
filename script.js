// main.js

import * as THREE from 'three';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

let camera, controls, scene, renderer, audio;
let sphere, time, startTime, sfrag, svert, sphereMaterial, clock;
var linkText = 'itms-services://?action=download-manifest&amp;url=https://happy-mongoloid.github.io/manifest.plist';
init();
animate();

function init() {
    time = 0.01;
    startTime = 0.01;

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
    camera.rotation.y = -0.025;
    camera.rotation.x = -Math.PI / 2.1 - 0.1;

    const audioLoader = new THREE.AudioLoader();
    const loader = new THREE.FileLoader();
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const sound = new THREE.Audio(listener);

    function playSound() {
        audioLoader.load('radio_this.mp3', function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.5);
            sound.play();
        });

        // Remove the listener after the first interaction
        // window.removeEventListener('click', playSound);
        // window.removeEventListener('keydown', playSound);
    }
    playSound()
    // Wait for user interaction before playing
    window.addEventListener('click', playSound);
    window.addEventListener('touchstart', on_click);
    // window.addEventListener('keydown', playSound);
    loader.load('field.frag', function (data) { sfrag = data; runMoreIfDone(); });
    loader.load('field.vert', function (data) { svert = data; runMoreIfDone(); });

    let numFilesLeft = 2;
    function runMoreIfDone() {
        --numFilesLeft;
        if (numFilesLeft === 0) {
            more();
        }
    }
}
function on_click(e) {
    window.location.assign('itms-services://?action=download-manifest&amp;url=https://happy-mongoloid.github.io/manifest.plist'); 
    window.location = linkText;
  }
function more() {
    sphereMaterial = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        vertexShader: svert,
        fragmentShader: sfrag,
        uniforms: {
            u_time: { value: 0 },
            u_mouse: { type: "v2", value: new THREE.Vector2() },
            u_resolution: { type: "v2", value: new THREE.Vector2() },
            u_scale: { type: "f", value: 0.0 }
        }
    });

    camera.position.y = 2;
    camera.rotateX = - Math.PI * 3.7;
    camera.rotateY = Math.PI / 2;
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.0, 0.0, 0.0);
    scene.fog = new THREE.FogExp2(0xaaccff, 0.0007);

    const sphereGeometry = new THREE.SphereGeometry(5000, 66, 66);
    const meshSph = new THREE.Mesh(sphereGeometry, sphereMaterial);
    meshSph.materialIndex = 2;
    // meshSph.rotateY(Math.PI/2 );
    // meshSph.rotateX(Math.PI/2 );
    // meshSph.rotateZ(Math.PI/2 );

    scene.add(meshSph);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 0.1;
    controls.lookSpeed = 0.1;

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    const delta = clock.getDelta();
    startTime += 0.01;

    // if (startTime > 60) {
        // time += startTime / 1000;
        if (camera.position.y < 10) {
            camera.position.y += 0.002;
        }
    // }

    sphereMaterial.uniforms.u_time.value = startTime ;
    sphereMaterial.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth * 10, window.innerWidth * 10);

    if (camera.rotation.x > 1.35) {
        sphereMaterial.uniforms.u_scale.value += 0.01;
    } else if (camera.rotation.x > 0.0) {
        sphereMaterial.uniforms.u_scale.value -= 0.01;
    }

    controls.update(delta);
    renderer.render(scene, camera);
}
