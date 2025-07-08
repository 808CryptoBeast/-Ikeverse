document.addEventListener('DOMContentLoaded', function() {
  // Initialize the globe visualization
  const width = document.getElementById('globe').clientWidth;
  const height = 600;
  
  // Set up projection and path
  const projection = d3.geoOrthographic()
    .scale(250)
    .center([0, 0])
    .rotate([-20, -30]) // Initial rotation to show more land
    .translate([width / 2, height / 2]);
  
  const path = d3.geoPath().projection(projection);
  
  // Create SVG container
  const svg = d3.select("#globe")
    .attr("width", width)
    .attr("height", height);
  
  // Add globe sphere
  svg.append("circle")
    .attr("fill", "rgba(0, 247, 255, 0.05)")
    .attr("stroke", "rgba(0, 247, 255, 0.15)")
    .attr("stroke-width", "0.5")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale());
  
  // Load world map data
  Promise.all([
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  ]).then(function([world, countries]) {
    const land = topojson.feature(world, world.objects.land);
    const countriesData = topojson.feature(world, world.objects.countries);
    
    // Draw land
    svg.append("path")
      .datum(land)
      .attr("class", "land")
      .attr("d", path)
      .attr("fill", "rgba(100, 100, 100, 0.2)");
    
    // Draw countries
    svg.selectAll(".country")
      .data(countriesData.features)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("fill", "rgba(100, 100, 100, 0.1)")
      .attr("stroke", "rgba(255, 255, 255, 0.1)")
      .attr("data-name", d => d.properties.name)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "rgba(0, 247, 255, 0.3)");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", "rgba(100, 100, 100, 0.1)");
      });
    
    // Define cultural nodes with precise coordinates
    const nodes = [
      {
        name: "Kemet (Ancient Egypt)",
        coords: [31.2357, 29.8497], // Cairo coordinates
        desc: "Ancient Egyptian civilization flourished along the Nile for over 3000 years, developing advanced mathematics, medicine, astronomy, and monumental architecture like the pyramids.",
        symbol: "𓃭",
        location: "Northeast Africa",
        tags: ["Mathematics", "Astronomy", "Architecture"],
        connections: [
          {name: "Sacred Geometry", desc: "Precise mathematical ratios in temple construction reflecting cosmic order"},
          {name: "Hieroglyphic Wisdom", desc: "Complex writing system preserving scientific and spiritual knowledge"},
          {name: "Nile Calendar", desc: "Early solar calendar based on Nile flood cycles"}
        ]
      },
      {
        name: "Polynesian Navigators",
        coords: [-157.8583, 21.3069], // Hawaii coordinates
        desc: "Polynesian voyagers mastered Pacific navigation using stars, waves, and wildlife, settling islands across 10 million square miles of ocean.",
        symbol: "🌊",
        location: "Pacific Ocean",
        tags: ["Navigation", "Ecology", "Oral Tradition"],
        connections: [
          {name: "Wayfinding", desc: "Non-instrument navigation using natural signs"},
          {name: "Star Compass", desc: "Mental construct mapping 32 directional points"},
          {name: "Wave Piloting", desc: "Reading ocean swells to maintain course"}
        ]
      },
      {
        name: "Maya Civilization",
        coords: [-88.5678, 17.2510], // Tikal coordinates
        desc: "The Maya developed sophisticated mathematics (including zero), precise calendars, and astronomical knowledge that guided their cities and agriculture.",
        symbol: "𓆣",
        location: "Mesoamerica",
        tags: ["Calendar", "Mathematics", "Astronomy"],
        connections: [
          {name: "Long Count Calendar", desc: "Cyclical timekeeping spanning 5,125 years"},
          {name: "Sacred Mathematics", desc: "Base-20 system with concept of zero"},
          {name: "Cosmological Architecture", desc: "Temples aligned with celestial events"}
        ]
      },
      {
        name: "Aboriginal Australians",
        coords: [133.7751, -25.2744], // Central Australia
        desc: "With over 65,000 years of continuous culture, Indigenous Australians developed deep ecological knowledge and complex spiritual systems like the Dreamtime.",
        symbol: "🦘",
        location: "Australia",
        tags: ["Ecology", "Astronomy", "Oral Tradition"],
        connections: [
          {name: "Songlines", desc: "Oral maps encoding navigation and law"},
          {name: "Firestick Farming", desc: "Sophisticated land management using controlled burns"},
          {name: "Astronomical Stories", desc: "Celestial knowledge encoded in oral traditions"}
        ]
      },
      {
        name: "Vedic Civilization",
        coords: [77.2090, 28.6139], // Delhi coordinates
        desc: "Ancient Indian tradition that developed profound philosophical systems, advanced mathematics, and holistic approaches to health and consciousness.",
        symbol: "🕉️",
        location: "South Asia",
        tags: ["Mathematics", "Philosophy", "Medicine"],
        connections: [
          {name: "Decimal System", desc: "Development of base-10 numbering including zero"},
          {name: "Ayurveda", desc: "Holistic system of medicine and wellness"},
          {name: "Yoga Philosophy", desc: "Science of consciousness and self-realization"}
        ]
      },
      {
        name: "Inca Civilization",
        coords: [-72.5449, -13.1631], // Cusco coordinates
        desc: "The Inca built a vast mountain empire with advanced engineering, astronomy, and a unique system of knotted-string accounting called quipu.",
        symbol: "🏔️",
        location: "Andes Mountains",
        tags: ["Engineering", "Astronomy", "Administration"],
        connections: [
          {name: "Quipu", desc: "Complex recording system using knotted strings"},
          {name: "Terrace Farming", desc: "Advanced agricultural engineering"},
          {name: "Celestial Observation", desc: "Mountain-top astronomical sites"}
        ]
      }
    ];
    
    // Create connections between nodes
    const connections = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        connections.push({
          source: nodes[i].coords,
          target: nodes[j].coords,
          sourceNode: nodes[i],
          targetNode: nodes[j],
          type: "cultural"
        });
      }
    }
    
    // Draw connections
    const connectionPaths = svg.selectAll(".connection")
      .data(connections)
      .enter()
      .append("line")
      .attr("class", "connection")
      .attr("x1", d => projection(d.source)[0])
      .attr("y1", d => projection(d.source)[1])
      .attr("x2", d => projection(d.target)[0])
      .attr("y2", d => projection(d.target)[1])
      .attr("stroke", "rgba(0, 247, 255, 0.3)")
      .attr("stroke-width", 1);
    
    // Add nodes
    const nodeCircles = svg.selectAll(".node")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("cx", d => projection(d.coords)[0])
      .attr("cy", d => projection(d.coords)[1])
      .attr("r", 6)
      .attr("fill", d => getNodeColor(d.location))
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("data-name", d => d.name)
      .on("mouseover", function(event, d) {
        // Highlight this node
        d3.select(this).attr("r", 8).attr("stroke-width", 2);
        
        // Highlight connections to this node
        connectionPaths
          .filter(conn => 
            conn.sourceNode.name === d.name || 
            conn.targetNode.name === d.name
          )
          .attr("stroke", "rgba(0, 247, 255, 0.8)")
          .attr("stroke-width", 2);
        
        // Show tooltip
        const tooltip = d3.select("#tooltip");
        tooltip.style("opacity", 1)
          .html(`
            <div class="tooltip-title">${d.name}</div>
            <div class="tooltip-location">
              <i class="fas fa-map-marker-alt"></i>
              ${d.location}
            </div>
          `)
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 20) + "px");
        
        // Update culture info panel
        updateCultureInfo(d);
      })
      .on("mousemove", function(event) {
        d3.select("#tooltip")
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 20) + "px");
      })
      .on("mouseout", function(event, d) {
        // Reset node appearance
        d3.select(this).attr("r", 6).attr("stroke-width", 1);
        
        // Reset all connections
        connectionPaths
          .attr("stroke", "rgba(0, 247, 255, 0.3)")
          .attr("stroke-width", 1);
        
        // Hide tooltip
        d3.select("#tooltip").style("opacity", 0);
      })
      .on("click", function(event, d) {
        // Center the globe on this node
        const targetRotation = getRotationToCenter(d.coords);
        rotateGlobe(targetRotation);
        
        // Update the info panel more prominently
        updateCultureInfo(d, true);
      });
    
    // Function to update culture info panel to match HTML structure
    function updateCultureInfo(cultureData, isClicked = false) {
      try {
        // Update each element separately
        document.getElementById("culture-symbol").textContent = cultureData.symbol;
        document.getElementById("culture-name").textContent = cultureData.name;
        document.getElementById("culture-location").textContent = cultureData.location;
        document.getElementById("culture-desc").textContent = cultureData.desc;
        
        // Update tags
        const tagsContainer = document.getElementById("culture-tags");
        tagsContainer.innerHTML = cultureData.tags.map(tag => 
          `<span class="culture-tag">${tag}</span>`
        ).join('');
        
        // Update connections
        const connectionsContainer = document.getElementById("connections");
        connectionsContainer.innerHTML = cultureData.connections.map(conn => `
          <div class="connection-card">
            <h4 class="connection-name">${conn.name}</h4>
            <p class="connection-desc">${conn.desc}</p>
          </div>
        `).join('');
        
        // Scroll to info panel if clicked
        if (isClicked) {
          document.querySelector(".culture-info").scrollIntoView({ behavior: 'smooth' });
        }
      } catch (error) {
        console.error("Error updating culture info:", error);
      }
    }
    
    // Function to get rotation to center specific coordinates
    function getRotationToCenter(coords) {
      return [-coords[0], -coords[1]];
    }
    
    // Function to animate globe rotation
    function rotateGlobe(targetRotation, duration = 1500) {
      autoRotate = false; // Pause auto-rotation
      
      const startRotation = projection.rotate();
      const startTime = Date.now();
      
      function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const interpolatedRotation = [
          startRotation[0] + (targetRotation[0] - startRotation[0]) * progress,
          startRotation[1] + (targetRotation[1] - startRotation[1]) * progress,
          0
        ];
        
        projection.rotate(interpolatedRotation);
        
        // Update all elements
        updateGlobeElements();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Resume auto-rotation after a pause
          setTimeout(() => {
            autoRotate = true;
            autoRotateGlobe();
          }, 3000);
        }
      }
      
      animate();
    }
    
    // Function to update all globe elements
    function updateGlobeElements() {
      // Update paths
      svg.selectAll(".land").attr("d", path);
      svg.selectAll(".country").attr("d", path);
      
      // Update nodes and connections
      nodeCircles
        .attr("cx", d => projection(d.coords)[0])
        .attr("cy", d => projection(d.coords)[1]);
        
      connectionPaths
        .attr("x1", d => projection(d.source)[0])
        .attr("y1", d => projection(d.source)[1])
        .attr("x2", d => projection(d.target)[0])
        .attr("y2", d => projection(d.target)[1]);
        
      svg.selectAll(".node-label")
        .attr("x", d => projection(d.coords)[0] + 10)
        .attr("y", d => projection(d.coords)[1] + 5);
    }
    
    // Add node labels
    svg.selectAll(".node-label")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "node-label")
      .attr("x", d => projection(d.coords)[0] + 10)
      .attr("y", d => projection(d.coords)[1] + 5)
      .text(d => d.name)
      .attr("fill", "rgba(0, 247, 255, 0.8)")
      .attr("font-size", "12px");
    
    // Add title explaining the visualization
    const title = svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("class", "globe-title")
      .text("Wisdom Traditions of the Ancient World");
    
    const subtitle = svg.append("text")
      .attr("x", width / 2)
      .attr("y", 50)
      .attr("text-anchor", "middle")
      .attr("class", "globe-subtitle")
      .text("Exploring the interconnected knowledge systems of indigenous cultures");
    
    // Add rotation interaction
    let rotation = projection.rotate();
    let isDragging = false;
    let lastX, lastY;
    
    svg.on("mousedown", function(event) {
      isDragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      autoRotate = false; // Pause auto-rotation when user interacts
    });
    
    svg.on("mousemove", function(event) {
      if (!isDragging) return;
      
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      
      rotation[0] += dx * 0.2;
      rotation[1] -= dy * 0.2;
      
      projection.rotate(rotation);
      updateGlobeElements();
      
      lastX = event.clientX;
      lastY = event.clientY;
    });
    
    svg.on("mouseup", function() {
      isDragging = false;
    });
    
    svg.on("mouseleave", function() {
      isDragging = false;
    });
    
    // Auto-rotation
    let autoRotate = true;
    const rotationSpeed = 0.1;
    
    function autoRotateGlobe() {
      if (!autoRotate) return;
      
      rotation[0] += rotationSpeed;
      projection.rotate(rotation);
      updateGlobeElements();
      
      requestAnimationFrame(autoRotateGlobe);
    }
    
    // Start auto-rotation
    autoRotateGlobe();
    
    // Helper function to assign colors based on location
    function getNodeColor(location) {
      const colors = {
        "Northeast Africa": "#FF5733",
        "Pacific Ocean": "#3385FF",
        "Mesoamerica": "#33FF57",
        "Australia": "#FF33F5",
        "South Asia": "#F5FF33",
        "Andes Mountains": "#33FFF5"
      };
      return colors[location] || "#FFFFFF";
    }
    
    // Initialize with first culture displayed
    updateCultureInfo(nodes[0]);
    
  }).catch(function(error) {
    console.error("Error loading the map data:", error);
    const infoPanel = document.querySelector(".culture-info");
    if (infoPanel) {
      infoPanel.innerHTML = `
        <div class="error-message">
          <h2>About Wisdom Traditions</h2>
          <p>This interactive globe explores the profound knowledge systems developed by ancient cultures worldwide.</p>
          <p>Each node represents a civilization that made significant contributions to human understanding in areas like astronomy, mathematics, ecology, and philosophy.</p>
          <p>The connections between them reveal how wisdom traditions often developed similar insights independently or through cultural exchange.</p>
          <p><strong>Click on any node</strong> to learn more about a specific culture and its contributions.</p>
          <p class="error-detail">(Note: Map data failed to load properly: ${error.message})</p>
        </div>
      `;
    }
  });
});