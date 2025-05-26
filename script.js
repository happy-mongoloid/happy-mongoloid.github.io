// main.js
import * as THREE from 'three';

let scene, renderer, material, clock, camera;
let isReady = false;
let svert, sfrag;

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
            animate();
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
    
    // Create a simple plane with minimal segments
    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1); // Reduced segments to minimum
    
    // Optimize material settings
    material = new THREE.ShaderMaterial({
        vertexShader: svert,
        fragmentShader: sfrag,
        uniforms: {
            u_time: { value: 0 },
            u_resolution: { type: "v2", value: new THREE.Vector2(width, height) }
        },
        // Performance optimizations
        precision: 'mediump', // Use medium precision for better performance
        depthTest: false,    // Disable depth testing since we're rendering a fullscreen quad
        depthWrite: false,   // Disable depth writing
        transparent: false   // Disable transparency if not needed
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Optimize renderer settings
    renderer = new THREE.WebGLRenderer({ 
        antialias: false,  // Disable antialiasing for better performance
        powerPreference: 'high-performance',
        stencil: false,    // Disable stencil buffer if not needed
        depth: false       // Disable depth buffer since we're rendering a fullscreen quad
    });
    
    // Set optimal pixel ratio (capped at 2 for high DPI displays)
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    // Force an initial render
    renderer.render(scene, camera);

    // Handle window resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(onWindowResize, 100);
    });
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    renderer.setSize(width, height);
    if (material && material.uniforms) {
        material.uniforms.u_resolution.value.set(width, height);
    }
}

// Use requestAnimationFrame with timestamp for better performance
let lastTime = 0;
function animate(time = 0) {
    if (!isReady) return;
    
    // Calculate delta time for smoother animation
    const delta = (time - lastTime) / 1000;
    lastTime = time;
    
    requestAnimationFrame(animate);
    render(delta);
}

function render(delta) {
    if (!material || !material.uniforms) return;
    
    // Update time uniform with delta for smoother animation
    material.uniforms.u_time.value += delta;
    renderer.render(scene, camera);
}
