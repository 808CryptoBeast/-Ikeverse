document.addEventListener('DOMContentLoaded', function() {
  const crawlContainer = document.querySelector('.starwars-crawl');
  const crawlContent = document.querySelector('.starwars-crawl-content');
  const galaxyViewport = document.getElementById('galaxy-viewport');

  // 1. Create star particles
  function createStarParticles() {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 50 : 100;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'star-particle';
      
      // Random properties
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
      
      // Add animation
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
      if (crawlContainer) {
        crawlContainer.appendChild(particle);
      }
    }
  }

  // 2. Add pause functionality
  function addPauseButton() {
    const pauseBtn = document.createElement('button');
    pauseBtn.className = 'pause-crawl';
    pauseBtn.textContent = 'PAUSE SCROLL';
    let isPaused = false;
    
    pauseBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      if (isPaused) {
        if (crawlContent) crawlContent.style.animationPlayState = 'paused';
        pauseBtn.textContent = 'RESUME SCROLL';
        document.querySelectorAll('.star-particle').forEach(el => {
          el.style.animationPlayState = 'paused';
        });
      } else {
        if (crawlContent) crawlContent.style.animationPlayState = 'running';
        pauseBtn.textContent = 'PAUSE SCROLL';
        document.querySelectorAll('.star-particle').forEach(el => {
          el.style.animationPlayState = 'running';
        });
      }
    });
    
    document.body.appendChild(pauseBtn);
  }

  // 3. Create ending sequence with viewport fixes
  function createEndingSequence() {
    const endingContainer = document.createElement('div');
    endingContainer.className = 'crawl-ending-container';
    endingContainer.style.display = 'none';
    endingContainer.innerHTML = `
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
    `;

    if (crawlContainer) {
      crawlContainer.appendChild(endingContainer);
      
      // When crawl finishes
      setTimeout(() => {
        // 1. Hide crawl content
        if (crawlContent) {
          crawlContent.style.opacity = '0';
          crawlContent.style.transition = 'opacity 1s ease-out';
        }
        
        // 2. Brief pause then show ending
        setTimeout(() => {
          endingContainer.style.display = 'flex';
          
          // Check viewport fit
          const checkViewportFit = () => {
            const endingElement = endingContainer.querySelector('.crawl-ending');
            const viewportHeight = window.innerHeight;
            const endingHeight = endingElement.scrollHeight;
            
            if (endingHeight > viewportHeight * 0.9) {
              endingElement.style.transform = 'scale(0.9)';
              endingContainer.style.alignItems = 'flex-start';
              endingContainer.style.padding = '1rem 0';
              endingContainer.style.overflowY = 'auto';
            }
          };
          
          setTimeout(() => {
            endingContainer.style.opacity = '1';
            checkViewportFit();
            
            // Recheck on resize
            window.addEventListener('resize', checkViewportFit);
            
            // Animate symbols
            const symbols = endingContainer.querySelectorAll('.cultural-symbols span');
            symbols.forEach((symbol, i) => {
              symbol.style.animation = `floatSpin 6s ${i * 0.3}s infinite ease-in-out`;
            });
            
            // CTA button
            const ctaButton = endingContainer.querySelector('.ending-cta');
            if (ctaButton) {
              ctaButton.addEventListener('click', () => {
                document.body.classList.add('platform-transition');
                setTimeout(() => {
                  window.location.href = "/matrix";
                }, 2000);
              });
            }
          }, 50);
        }, 1500);
      }, 62000);
    }
  }

  // Initialize all effects
  function initEffects() {
    if (!crawlContainer) return;
    
    createStarParticles();
    addPauseButton();
    createEndingSequence();
    
    // Start crawl after intro sequence
    setTimeout(() => {
      if (crawlContent) {
        crawlContent.style.animationPlayState = 'running';
      }
    }, 5000);
  }

  // Adjust galaxy viewport during crawl
  if (galaxyViewport) {
    galaxyViewport.style.filter = 'blur(2px) brightness(0.5)';
    setTimeout(() => {
      galaxyViewport.style.transition = 'filter 2s ease-out';
      galaxyViewport.style.filter = 'blur(0) brightness(1)';
    }, 5000);
  }

  // Run initialization
  initEffects();
});