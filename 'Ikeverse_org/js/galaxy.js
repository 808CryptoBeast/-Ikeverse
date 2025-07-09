import { WEBGL } from 'three/examples/jsm/WebGL.js';

class KnowledgeGalaxy {
  constructor() {
    // Verify WebGL support
    if (!WEBGL.isWebGLAvailable()) {
      this.showWebGLError();
      return;
    }

    // Knowledge nodes data (keep your existing nodes data)
    this.knowledgeNodes = [ /* ... your existing nodes data ... */ ];
    
    // Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.labelRenderer = new CSS2DRenderer();
    this.controls = null;
    this.nodes = [];
    this.connections = [];
    this.isRotating = true;
    this.animationId = null;
    this.currentZoom = 7;
    this.nodeGroup = null;

    // Initialize
    this.init();
  }

  showWebGLError() {
    const container = document.getElementById('galaxy-viewport');
    container.innerHTML = `
      <div class="error-fallback">
        <h3>WebGL Not Supported</h3>
        <p>Your browser or device doesn't support WebGL, which is required for this visualization.</p>
        <p>Try updating your browser or using a different device.</p>
      </div>
    `;
  }

  init() {
    console.log("Initializing Knowledge Galaxy...");
    
    try {
      const container = document.getElementById('galaxy-viewport');
      if (!container) throw new Error("Container element not found");

      // Setup renderers
      this.setupRenderers(container);
      
      // Setup scene
      this.setupScene();
      
      // Setup camera and controls
      this.setupCamera();
      this.setupControls();
      
      // Add lighting
      this.addLighting();
      
      // Create nodes
      this.createNodes();
      
      // Start animation
      this.animate();
      
      // Handle window resize
      window.addEventListener('resize', () => this.onWindowResize(container));
      
      // Remove loading class
      container.classList.remove('loading');
      
    } catch (error) {
      console.error("Failed to initialize Knowledge Galaxy:", error);
      this.showErrorFallback();
    }
  }

  setupRenderers(container) {
    // Get computed dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Main WebGL renderer
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // Label renderer
    this.labelRenderer.setSize(width, height);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(this.labelRenderer.domElement);
  }

  // ... (keep all your other existing methods exactly as they were) ...
}

// Initialize when DOM is loaded and fonts are ready
document.addEventListener('DOMContentLoaded', () => {
  document.fonts.ready.then(() => {
    const galaxy = new KnowledgeGalaxy();
    window.galaxy = galaxy; // Make available for debugging
    
    // Setup UI controls
    document.getElementById('zoomIn')?.addEventListener('click', () => {
      galaxy.camera.position.z -= 0.5;
    });
    
    document.getElementById('zoomOut')?.addEventListener('click', () => {
      galaxy.camera.position.z += 0.5;
    });
    
    document.getElementById('rotateToggle')?.addEventListener('click', (e) => {
      if (galaxy) {
        galaxy.isRotating = !galaxy.isRotating;
        e.currentTarget.classList.toggle('active');
      }
    });
  });
});
