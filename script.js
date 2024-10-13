// main.js

import * as THREE from 'three';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

let camera, controls, scene, renderer, audio;
let mesh, geometry, sphere, time, frag, sfrag, svert, vert, material, sphereMaterial, clock;

const worldWidth = 128, worldDepth = 128;

init();
animate();

function init() {
    time = (0.01);
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
	camera.rotation.x = -Math.PI / 2;
    const audioLoader = new THREE.AudioLoader();
    var loader = new THREE.FileLoader();
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const sound = new THREE.Audio(listener);

    // Load a sound and set it as the Audio object's buffer
    audioLoader.load('sounds/sound.ogg', function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play();
    });

    loader.load('field.frag', function (data) { frag = data; runMoreIfDone(); });
    loader.load('field.vert', function (data) { vert = data; runMoreIfDone(); });
    loader.load('sphereField.frag', function (data) { sfrag = data; runMoreIfDone(); });
    loader.load('sphereField.vert', function (data) { svert = data; runMoreIfDone(); });

    var numFilesLeft = 4;
    function runMoreIfDone() {
        --numFilesLeft;
        if (numFilesLeft === 0) {
            more();
        }
    }
}

function more() {
    material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
            u_time: { value: 0 },
            u_mouse: { type: "v2", value: new THREE.Vector2() },
            u_resolution: { type: "v2", value: new THREE.Vector2() }
        }
    });
    sphereMaterial = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        vertexShader: svert,
        fragmentShader: sfrag,
        uniforms: {
            u_time: { value: 0 },
            u_mouse: { type: "v2", value: new THREE.Vector2() },
            u_resolution: { type: "v2", value: new THREE.Vector2() }
        }
    });

    camera.position.y = 10;
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.0, 0.0, 0.0);
    scene.fog = new THREE.FogExp2(0xaaccff, 0.0007);
    sphere = new THREE.SphereGeometry(4000, 66, 66);
    geometry = new THREE.PlaneGeometry(1000, 1000, worldWidth - 1, worldDepth - 1);
    geometry.rotateX(-Math.PI / 2);

    const position = geometry.attributes.position;
    position.usage = THREE.DynamicDrawUsage;
    camera.rotateX = 3.14;

    const texture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/water.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);
    texture.colorSpace = THREE.SRGBColorSpace;

    const meshSph = new THREE.Mesh(sphere, sphereMaterial);
    meshSph.materialIndex = 2;
    mesh = new THREE.Mesh(geometry, material);
    mesh.material = material;
    scene.add(mesh);
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
    time +=  0.1;
    sphereMaterial.uniforms.u_time.value = time / 112.;
    sphereMaterial.uniforms.u_resolution = { type: "v2", value: new THREE.Vector2(window.innerWidth * 10, window.innerWidth * 10) };
    material.uniforms.u_time.value = time / 112.;
    material.uniforms.u_resolution = { type: "v2", value: new THREE.Vector2(window.innerWidth * 10, window.innerWidth * 10) };
    const pos = geometry.attributes.position;
	var waveSize = time/1112.;

	if(waveSize > 1.0) {
		waveSize = 1.0;
	}

    for (let i = 0; i < pos.count; i++) {
        const y = 15 * (Math.sin((time / 12 + i / 512)) )*waveSize;
        pos.setY(i, y - 10*waveSize);
    }

    pos.needsUpdate = true;
    controls.update(delta);
    renderer.render(scene, camera);
}