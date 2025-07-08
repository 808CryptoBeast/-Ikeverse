// Quantum Knowledge Matrix
const knowledgeNodes = [
  // AFRICAN SYSTEMS
  {
    name: "KEMET SACRED GEOMETRY",
    type: "ancestral",
    position: { x: -4, y: 0, z: 1 },
    desc: "The Rhind Papyrus (1650 BCE) contains pyramid construction algorithms that precisely match quantum angular momentum formulas.",
    links: ["FRACTAL GEOMETRY", "QUANTUM SPIN"],
    color: 0x9d00ff,
    icon: "𓃭"
  },
  {
    name: "YORUBA IFÁ BINARY",
    type: "ancestral",
    position: { x: -3, y: -1, z: -1 },
    desc: "The 256 Odù patterns form a binary decision tree identical to modern machine learning architectures. Ifá divination uses binary operations centuries before Leibniz's formalization.",
    links: ["COMPUTER SCIENCE", "BOOLEAN ALGEBRA", "NEURAL NETS"],
    color: 0xff00aa,
    icon: "𓃗"
  },

  // AMERICAS
  {
    name: "OLMEC SERPENT WISDOM",
    type: "ancestral",
    position: { x: 0, y: -2, z: 2 },
    desc: "Feathered serpent motifs at La Venta depict DNA-like helical structures with 94% geometric accuracy to the double helix, predating Watson & Crick by 2500 years.",
    links: ["MOLECULAR BIOLOGY", "TOPOLOGY", "FLUID DYNAMICS"],
    color: 0x00b48a,
    icon: "𓃚"
  },

  // POLYNESIA
  {
    name: "KUMULIPO CHANT",
    type: "ancestral",
    position: { x: 2, y: 2, z: -1 },
    desc: "The creation chant's particle pairs ('pō' and 'ao') describe quantum entanglement 1200 years before Schrödinger. Recursive structure matches superstring vibration patterns.",
    links: ["QUANTUM PHYSICS", "STRING THEORY", "HOLOGRAPHY"],
    color: 0x00f7ff,
    icon: "🌊"
  },

  // MODERN SCIENCE
  {
    name: "QUANTUM SPIN",
    type: "modern",
    position: { x: 4, y: 0, z: -1 },
    desc: "Subatomic angular momentum ratios match Kemet pyramid capstone dimensions (51.84°). The mathematics of spin-2 particles mirrors pyramid construction algorithms.",
    links: ["KEMET SACRED GEOMETRY"],
    color: 0xffffff,
    icon: "⚛"
  }
];

// Scene Initialization
let scene, camera, renderer, labelRenderer, stars;
let isRotating = true;

function init() {
  try {
    // Check if container exists
    const galaxyContainer = document.getElementById('galaxy');
    if (!galaxyContainer) {
      throw new Error("Could not find element with ID 'galaxy'");
    }

    // Verify Three.js is loaded
    if (!window.THREE) {
      throw new Error("Three.js is not loaded");
    }

    // Verify CSS2DRenderer is available
    if (typeof CSS2DRenderer === 'undefined') {
      throw new Error("CSS2DRenderer is not loaded. Make sure to include three.js renderer scripts");
    }

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.002);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
      75, 
      galaxyContainer.offsetWidth / galaxyContainer.offsetHeight, 
      0.1, 
      1000
    );
    camera.position.z = 7;

    // WebGL Renderer setup
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(galaxyContainer.offsetWidth, galaxyContainer.offsetHeight);
    galaxyContainer.appendChild(renderer.domElement);

    // CSS2D Renderer setup
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(galaxyContainer.offsetWidth, galaxyContainer.offsetHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    galaxyContainer.appendChild(labelRenderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00f7ff, 1, 100);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // Create nodes
    createKnowledgeNodes();

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      
      if (isRotating) {
        stars.rotation.x += 0.0005;
        stars.rotation.y += 0.001;
      }
      
      renderer.render(scene, camera);
      if (labelRenderer) {
        labelRenderer.render(scene, camera);
      }
    }
    animate();

    // Event Listeners
    window.addEventListener('resize', () => {
      camera.aspect = galaxyContainer.offsetWidth / galaxyContainer.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(galaxyContainer.offsetWidth, galaxyContainer.offsetHeight);
      if (labelRenderer) {
        labelRenderer.setSize(galaxyContainer.offsetWidth, galaxyContainer.offsetHeight);
      }
    });

  } catch (error) {
    console.error("Initialization error:", error);
    
    // Show user-friendly error message
    const errorContainer = document.getElementById('galaxy') || document.body;
    errorContainer.innerHTML = `
      <div class="error-fallback">
        <h3>Unable to load 3D visualization</h3>
        <p>${error.message}</p>
        <button onclick="window.location.reload()">Try Again</button>
      </div>
    `;
    
    // Add basic styles if they don't exist
    const style = document.createElement('style');
    style.textContent = `
      .error-fallback {
        padding: 2rem;
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid #ff5555;
        border-radius: 8px;
        color: white;
        text-align: center;
      }
      .error-fallback button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: #00f7ff;
        color: #0a0e17;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }
}

function createKnowledgeNodes() {
  stars = new THREE.Group();
  
  knowledgeNodes.forEach(nodeData => {
    // Create sphere
    const geometry = new THREE.SphereGeometry(0.25, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
      color: nodeData.color,
      emissive: nodeData.color,
      emissiveIntensity: 0.3
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(nodeData.position.x, nodeData.position.y, nodeData.position.z);
    sphere.userData = nodeData;
    stars.add(sphere);

    // Create label
    const labelDiv = document.createElement('div');
    labelDiv.className = 'node-label';
    labelDiv.textContent = nodeData.name;
    labelDiv.style.color = `rgb(${nodeData.color >> 16}, ${(nodeData.color >> 8) & 0xff}, ${nodeData.color & 0xff})`;
    labelDiv.style.fontSize = '14px';
    labelDiv.style.fontFamily = 'Orbitron, sans-serif';
    labelDiv.style.textShadow = '0 0 5px black';
    
    const label = new CSS2DObject(labelDiv);
    label.position.copy(sphere.position);
    label.position.y -= 0.5;
    scene.add(label);
  });
  
  scene.add(stars);
}

function onWindowResize() {
  camera.aspect = document.getElementById('galaxy').offsetWidth / document.getElementById('galaxy').offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(document.getElementById('galaxy').offsetWidth, document.getElementById('galaxy').offsetHeight);
  labelRenderer.setSize(document.getElementById('galaxy').offsetWidth, document.getElementById('galaxy').offsetHeight);
}

// Initialize
document.addEventListener('DOMContentLoaded', init);