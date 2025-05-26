// main.js
import * as THREE from 'three';

let scene, renderer, material, clock, camera;
let isReady = false;
let svert, sfrag; // Move shader variables to global scope

init();

function init() {
    const loader = new THREE.FileLoader();
    
    // Load shader files
    loader.load('field.frag', function (data) { sfrag = data; runMoreIfDone(); });
    loader.load('field.vert', function (data) { svert = data; runMoreIfDone(); });

    let numFilesLeft = 2;
    function runMoreIfDone() {
        --numFilesLeft;
        if (numFilesLeft === 0) {
            setupScene();
            isReady = true;
            animate(); // Start animation only after setup is complete
        }
    }
}

function setupScene() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    
    // Create an orthographic camera for fullscreen shader
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    
    // Get initial window size
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Create a simple plane that fills the screen
    const geometry = new THREE.PlaneGeometry(2, 2);
    material = new THREE.ShaderMaterial({
        vertexShader: svert,
        fragmentShader: sfrag,
        uniforms: {
            u_time: { value: 0 },
            u_resolution: { type: "v2", value: new THREE.Vector2(width, height) }
        }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Setup renderer with initial size
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    // Force an initial render
    renderer.render(scene, camera);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (material && material.uniforms) {
        material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    }
}

function animate() {
    if (!isReady) return; // Don't animate if not ready
    requestAnimationFrame(animate);
    render();
}

function render() {
    if (!material || !material.uniforms) return; // Safety check
    material.uniforms.u_time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
}
