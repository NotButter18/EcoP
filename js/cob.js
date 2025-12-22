const container = document.getElementById('corn-container');

function initCorn() {
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.2); 
    scene.add(ambient);
    const blueLight = new THREE.PointLight(0x00ffff, 0.5);
    blueLight.position.set(2, 2, 2);
    scene.add(blueLight);

    const plantGroup = new THREE.Group();

    const holoMat = (color) => new THREE.MeshPhongMaterial({ 
        color: color, 
        transparent: true, 
        opacity: 0.85, 
        shininess: 100,
        side: THREE.DoubleSide
    });

    const potGeo = new THREE.CylinderGeometry(0.3, 0.22, 0.4, 12);
    const pot = new THREE.Mesh(potGeo, holoMat(0xff7043));
    pot.position.y = -0.4;
    plantGroup.add(pot);

    const soilGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.05, 12);
    const soil = new THREE.Mesh(soilGeo, holoMat(0x3e2723));
    soil.position.y = -0.22; 
    plantGroup.add(soil);

    const stalkGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.8, 8);
    const stalk = new THREE.Mesh(stalkGeo, holoMat(0xadff2f));
    stalk.position.y = 0.1;
    plantGroup.add(stalk);

    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.15, 0.3, 0, 0.8); 
    leafShape.quadraticCurveTo(-0.15, 0.3, 0, 0);

    const extrudeSettings = { depth: 0.02, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01 };
    const leafGeo = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
    const leafMaterial = holoMat(0x7cfc00);

    const leaves = [];
    function addLeaf(rz, rx, ry) {
        const p = new THREE.Group();
        const m = new THREE.Mesh(leafGeo, leafMaterial);
        m.rotation.set(rx, 0, 0); 
        p.add(m);
        p.rotation.set(0, ry, rz);
        p.position.y = 0.25;
        plantGroup.add(p);
        leaves.push(p);
    }

    addLeaf(0.7, 0.3, 0);            
    addLeaf(-0.7, 0.3, Math.PI);     
    addLeaf(0.1, 0.8, Math.PI / 2);  

    plantGroup.scale.set(0.8, 0.8, 0.8);
    
    const box = new THREE.Box3().setFromObject(plantGroup);
    const center = box.getCenter(new THREE.Vector3());
    plantGroup.position.y = -center.y;
    
    scene.add(plantGroup);
    camera.position.set(0, 0, 1.8);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 8.0; 

    function setStage(stage) {
        if (stage === 1) {
            stalk.visible = false;
            leaves.forEach(l => l.visible = false);
        } else if (stage === 2) {
            stalk.visible = true;
            stalk.scale.y = 0.6;
            stalk.position.y = -0.1;
            leaves[0].visible = true;
            leaves[0].position.y = -0.1; 
            leaves[1].visible = false;
            leaves[2].visible = false;
        } else if (stage === 3) {
            stalk.visible = true;
            stalk.scale.y = 1.0;
            stalk.position.y = 0.1;
            leaves.forEach(l => {
                l.visible = true;
                l.position.y = 0.25;
            });
        }
    }

    const w1 = document.getElementById('week1');
    const w2 = document.getElementById('week2');
    const w3 = document.getElementById('week3');

    if(w1) w1.addEventListener('mouseenter', () => setStage(1));
    if(w2) w2.addEventListener('mouseenter', () => setStage(2));
    if(w3) w3.addEventListener('mouseenter', () => setStage(3));

    setStage(1);

    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.002;
        const pulse = 0.7 + Math.sin(time) * 0.2; 
        plantGroup.traverse((child) => {
            if (child.isMesh) {
                child.material.opacity = pulse;
            }
        });
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
