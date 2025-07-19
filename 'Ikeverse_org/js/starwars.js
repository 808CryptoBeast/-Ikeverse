document.addEventListener('DOMContentLoaded', function() {
  const crawlContainer = document.querySelector('.starwars-crawl');
  const crawlContent = document.querySelector('.starwars-crawl-content');
  const introElement = document.querySelector('.crawl-intro');
  const startCrawlBtn = document.getElementById('startCrawl');
  const galaxyViewport = document.getElementById('galaxy-viewport');
  let isCrawlPlaying = false;
  let endingContainer = null;
  let crawlAnimation;
  let starParticles = [];

  // Initialize all effects
  function initEffects() {
    if (!crawlContainer) return;
    
    createStarParticles();
    createCrawlControls();
    setupEventListeners();
    
    // Initially hide crawl content
    if (crawlContent) {
      crawlContent.style.opacity = '0';
      crawlContent.style.animationPlayState = 'paused';
    }
    
    // Hide intro initially
    if (introElement) {
      introElement.style.display = 'none';
    }
    
    // Show play button
    if (startCrawlBtn) {
      startCrawlBtn.style.display = 'flex';
      startCrawlBtn.style.opacity = '1';
    }
  }

  // Create star particles
  function createStarParticles() {
    // Clear existing particles
    starParticles.forEach(particle => {
      if (particle && particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    starParticles = [];
    
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 200 : 400;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'star-particle';
      
      const size = Math.random() * 3 + 1;
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 20;
      const opacity = Math.random() * 0.7 + 0.3;
      
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${opacity};
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
      `;
      
      // Add unique animation for each particle
      const startX = Math.random() * 100;
      const startY = Math.random() * 100 + 100;
      const endX = startX + (Math.random() * 40 - 20);
      const endY = -50;
      
      const keyframes = `
        @keyframes particle-move-${i} {
          0% { transform: translate(${startX}vw, ${startY}vh); }
          100% { transform: translate(${endX}vw, ${endY}vh); }
        }
      `;
      
      const style = document.createElement('style');
      style.innerHTML = keyframes;
      document.head.appendChild(style);
      
      particle.style.animationName = `particle-move-${i}`;
      crawlContainer.appendChild(particle);
      starParticles.push(particle);
    }
  }

  // Create control buttons
  function createCrawlControls() {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'crawl-controls';
    
    controlsDiv.innerHTML = `
      <button class="crawl-control-btn" id="playCrawl" style="display:none">
        <i class="fas fa-play"></i>
      </button>
      <button class="crawl-control-btn" id="pauseCrawl" style="display:none">
        <i class="fas fa-pause"></i>
      </button>
      <button class="crawl-control-btn" id="replayCrawl">
        <i class="fas fa-redo"></i>
      </button>
    `;
    
    document.body.appendChild(controlsDiv); // Changed to body to ensure visibility
  }

  // Setup event listeners
  function setupEventListeners() {
    // Start crawl button
    if (startCrawlBtn) {
      startCrawlBtn.addEventListener('click', function() {
        this.style.opacity = '0';
        setTimeout(() => {
          this.style.display = 'none';
          showIntroSequence();
        }, 300);
      });
    }
    
    // Control buttons
    const playBtn = document.getElementById('playCrawl');
    const pauseBtn = document.getElementById('pauseCrawl');
    const replayBtn = document.getElementById('replayCrawl');
    
    if (playBtn) playBtn.addEventListener('click', startCrawl);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseCrawl);
    if (replayBtn) replayBtn.addEventListener('click', replayCrawl);
  }

  // Show intro sequence
  function showIntroSequence() {
    if (introElement) {
      introElement.style.display = 'block';
      introElement.style.opacity = '0';
      introElement.style.animation = 'introFade 3s ease-out forwards';
      
      // After intro completes, start crawl
      setTimeout(() => {
        startCrawl();
      }, 3000);
    }
  }

  // Start crawl animation
  function startCrawl() {
    if (crawlContent) {
      // Hide intro
      if (introElement) introElement.style.display = 'none';
      
      // Show and start crawl
      crawlContent.style.opacity = '1';
      crawlContent.style.animationPlayState = 'running';
      
      // Start particles
      document.querySelectorAll('.star-particle').forEach(el => {
        el.style.animationPlayState = 'running';
      });
      
      isCrawlPlaying = true;
      updateButtonStates();
      
      // Show ending after crawl completes
      setTimeout(() => {
        fadeOutCrawl();
      }, 45000);
    }
  }

  // Fade out crawl content
  function fadeOutCrawl() {
    if (crawlContent) {
      crawlContent.style.opacity = '0';
      crawlContent.style.transition = 'opacity 1s ease-out';
      
      // Show ending after fade out
      setTimeout(() => {
        showEndingSequence();
      }, 1000);
    }
  }

  // Show ending sequence
  function showEndingSequence() {
    // Remove existing ending if present
    if (endingContainer) endingContainer.remove();
    
    endingContainer = document.createElement('div');
    endingContainer.className = 'crawl-ending-container';
    endingContainer.innerHTML = `
      <div class="crawl-ending-wrapper">
        <div class="crawl-ending">
          <div class="cultural-symbols">
            <span class="hawaiian-symbol">🌺</span>
            <span class="kemet-symbol">𓃭</span>
            <span class="quantum-symbol">⚛</span>
          </div>
          
          <div class="dual-language-block">
            <h2 class="ending-title">
              <div class="language-line">
                <span class="hawaiian">Ua hōʻea mai ka wā hou</span>
                <span class="english">The new era has arrived</span>
              </div>
              <div class="language-line">
                <span class="kemet">𓄿𓏏𓉐𓃭𓏤𓊪𓏏𓇯</span>
                <span class="english">(The great awakening)</span>
              </div>
            </h2>
            
            <div class="sacred-message">
              <div class="language-group">
                <p class="hawaiian">Hoʻohui ʻia ke ʻike kahiko o Kemet a me Hawaiʻi</p>
                <p class="english">Ancient wisdom of Kemet and Hawaii united</p>
              </div>
              
              <div class="language-group">
                <p class="kemet">𓆓𓂧𓅓𓏏𓊖𓈖𓏏𓏭𓄿𓈖𓇌𓏏𓇯</p>
                <p class="english">(Sacred knowledge flows eternally)</p>
              </div>
              
              <div class="language-group">
                <p class="quantum">⚛ The Quantum Ancestral Frequency ⚛</p>
                <p class="english">Where science and spirituality become one</p>
              </div>
            </div>
            
            <div class="proverb-block">
              <div class="language-group">
                <p class="hawaiian">I ka wā ma mua, ka wā ma hope</p>
                <p class="english">"The future is in the past" - Hawaiian proverb</p>
              </div>
              
              <div class="language-group">
                <p class="kemet">𓂀𓏤𓈖𓏏𓍹𓇯𓍺𓈖𓏏𓄿𓏏𓂋𓏤𓊪𓏏𓇯</p>
                <p class="english">"Know the past to see tomorrow" - Kemet teaching</p>
              </div>
            </div>
          </div>
          
          <button class="ending-cta quantum-btn">
            <div class="language-line">
              <span class="hawaiian">E komo i ka Pūnāwai ʻIke</span>
              <span class="english">Enter the Wellspring of Knowledge</span>
            </div>
            <div class="language-line">
              <span class="kemet">𓃭𓂋𓈖𓏏𓊪𓏏𓇯</span>
              <span class="english">(Begin the journey)</span>
            </div>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(endingContainer);
    
    // Show ending with fade in
    setTimeout(() => {
      endingContainer.style.display = 'flex';
      setTimeout(() => {
        endingContainer.style.opacity = '1';
      }, 50);
      
      // Enable full scrolling
      endingContainer.scrollTop = 0;
      
      // Add click handler for CTA button
      const ctaButton = endingContainer.querySelector('.ending-cta');
      if (ctaButton) {
        ctaButton.addEventListener('click', () => {
          document.body.classList.add('platform-transition');
          setTimeout(() => {
            window.location.href = "/matrix";
          }, 2000);
        });
      }
    }, 100);
  }

  // Pause crawl animation
  function pauseCrawl() {
    if (crawlContent) {
      crawlContent.style.animationPlayState = 'paused';
      document.querySelectorAll('.star-particle').forEach(el => {
        el.style.animationPlayState = 'paused';
      });
      isCrawlPlaying = false;
      updateButtonStates();
    }
  }

  // Replay crawl animation
  function replayCrawl() {
    // Reset everything
    if (endingContainer) {
      endingContainer.style.opacity = '0';
      setTimeout(() => {
        endingContainer.remove();
        endingContainer = null;
      }, 500);
    }
    
    if (crawlContent) {
      crawlContent.style.animation = 'none';
      crawlContent.style.opacity = '0';
      void crawlContent.offsetHeight;
      crawlContent.style.animation = 'crawl 45s linear forwards';
      crawlContent.style.animationPlayState = 'paused';
    }
    
    // Restart particles
    createStarParticles();
    
    // Show start button again
    if (startCrawlBtn) {
      startCrawlBtn.style.display = 'flex';
      startCrawlBtn.style.opacity = '1';
    }
    
    // Update controls
    isCrawlPlaying = false;
    updateButtonStates();
  }

  // Update button states
  function updateButtonStates() {
    const playBtn = document.getElementById('playCrawl');
    const pauseBtn = document.getElementById('pauseCrawl');
    const replayBtn = document.getElementById('replayCrawl');
    
    if (playBtn && pauseBtn && replayBtn) {
      playBtn.style.display = isCrawlPlaying ? 'none' : 'flex';
      pauseBtn.style.display = isCrawlPlaying ? 'flex' : 'none';
      
      // Make sure controls are always clickable
      playBtn.style.pointerEvents = 'auto';
      pauseBtn.style.pointerEvents = 'auto';
      replayBtn.style.pointerEvents = 'auto';
    }
  }

  // Handle window resize
  window.addEventListener('resize', function() {
    createStarParticles();
  });

  // Run initialization
  initEffects();
});
