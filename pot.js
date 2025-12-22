const container = document.getElementById('corn-container');

function initCorn() {
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8); 
    scene.add(ambient);
    const topLight = new THREE.DirectionalLight(0x74c365, 1.2);
    topLight.position.set(2, 5, 3);
    scene.add(topLight);

    const plantGroup = new THREE.Group();

    const solidMat = (color) => new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide });
    const holoMat = (color) => new THREE.MeshPhongMaterial({ 
        color: color, 
        transparent: true, 
        opacity: 0.3, 
        wireframe: true, 
        emissive: color,
        emissiveIntensity: 0.5 
    });

    const potGeo = new THREE.CylinderGeometry(0.3, 0.22, 0.4, 12);
    const potBase = new THREE.Mesh(potGeo, solidMat(0xff7043));
    potBase.position.y = 0.25; 
    plantGroup.add(potBase);

    const potHolo = new THREE.Mesh(potGeo, holoMat(0x74c365));
    potHolo.scale.set(1.05, 1.05, 1.05);
    potHolo.position.y = 0.25; 
    plantGroup.add(potHolo);

    const soilGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.05, 12);
    const soil = new THREE.Mesh(soilGeo, solidMat(0x3e2723));
    soil.position.y = 0.43; 
    plantGroup.add(soil);

    const gridHelper = new THREE.GridHelper(1.5, 12, 0x4a5441, 0x1a1a1a);
    gridHelper.position.y = 0.05; 
    scene.add(gridHelper);

    const ringGeo = new THREE.TorusGeometry(0.5, 0.005, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xa3b18a, transparent: true, opacity: 0.5 });
    const scanningRing = new THREE.Mesh(ringGeo, ringMat);
    scanningRing.rotation.x = Math.PI / 2;
    scanningRing.position.y = 0.05; 
    scene.add(scanningRing);

    scene.add(plantGroup);
    
    camera.position.set(0, 1.2, 2.2); 

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enableRotate = false; 
    controls.autoRotate = true;
    controls.autoRotateSpeed = 4.0; 

    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.002;
        
        potHolo.material.opacity = 0.2 + Math.sin(time) * 0.2;
        
        scanningRing.position.y = 0.05 + Math.abs(Math.sin(time * 0.5) * 0.5);
        scanningRing.material.opacity = 0.8 - (scanningRing.position.y - 0.05);

        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
}

window.addEventListener('load', () => setTimeout(initCorn, 200));