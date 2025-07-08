document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation Toggle with overflow protection
  const navToggle = document.createElement('button');
  navToggle.className = 'nav-toggle';
  navToggle.innerHTML = '<i class="fas fa-bars"></i>';
  document.querySelector('.quantum-nav').appendChild(navToggle);
  
  const navContainer = document.querySelector('.nav-links-container');
  const navLinks = document.querySelector('.nav-links');
  
  // Handle navigation overflow
  function checkNavOverflow() {
    const navWidth = navLinks.scrollWidth;
    const containerWidth = navContainer.offsetWidth;
    
    if (navWidth > containerWidth) {
      navLinks.style.flexWrap = 'wrap';
      navLinks.style.justifyContent = 'flex-end';
      navLinks.style.gap = '0.75rem 1.5rem';
    } else {
      navLinks.style.flexWrap = 'nowrap';
    }
  }
  
  // Initial check and window resize handler
  checkNavOverflow();
  window.addEventListener('resize', checkNavOverflow);

  navToggle.addEventListener('click', () => {
    navContainer.classList.toggle('active');
    navToggle.innerHTML = navContainer.classList.contains('active') ? 
      '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navContainer.classList.remove('active');
      navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

  // Initialize GSAP animations
  gsap.registerPlugin(ScrollTrigger);
  
  // Set random progress values (30-90%) for each phase
  document.querySelectorAll('.progress-bar').forEach(bar => {
    const randomProgress = Math.floor(Math.random() * 60) + 30;
    bar.style.width = `${randomProgress}%`;
    bar.setAttribute('data-progress', `${randomProgress}%`);
    
    // Remove percentage text if exists
    const progressText = bar.parentElement.querySelector('.progress-text');
    if (progressText) {
      progressText.textContent = '';
    }
  });
  
  // Animate roadmap phases with zig-zag effect
  gsap.utils.toArray('.phase').forEach((phase, i) => {
    const startX = i % 2 === 0 ? 100 : -100;
    const delay = i * 0.15;
    
    gsap.from(phase, {
      scrollTrigger: {
        trigger: phase,
        start: "top 75%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      x: startX,
      y: 30,
      duration: 0.8,
      delay: delay,
      ease: "back.out(1.2)"
    });
  });
  
  // Animate phase markers with bounce effect
  gsap.utils.toArray('.phase-marker').forEach((marker, i) => {
    const core = marker.querySelector('.marker-core');
    const aura = marker.querySelector('.marker-aura');
    
    // Bounce in animation
    gsap.from(marker, {
      scrollTrigger: {
        trigger: marker,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      scale: 0,
      duration: 0.6,
      delay: i * 0.1,
      ease: "elastic.out(1, 0.5)"
    });
    
    // Continuous pulse animation
    gsap.to(core, {
      scale: 1.2,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    gsap.to(aura, {
      scale: 1.8,
      opacity: 0,
      duration: 2.5,
      repeat: -1,
      ease: "none"
    });
  });
  
  // Animate progress bars on scroll
  gsap.utils.toArray('.progress-bar').forEach((bar, i) => {
    ScrollTrigger.create({
      trigger: bar.parentElement,
      start: "top 80%",
      onEnter: () => {
        const targetWidth = bar.getAttribute('data-progress') || "70%";
        gsap.fromTo(bar, 
          { width: "0%" },
          {
            width: targetWidth,
            duration: 1.5,
            ease: "power2.out",
            delay: i * 0.1
          }
        );
      }
    });
  });
  
  // Floating header glyphs with varied animation
  gsap.utils.toArray('.header-glyphs span').forEach((glyph, i) => {
    const duration = 3 + Math.random() * 2;
    const distance = 15 + Math.random() * 10;
    const rotation = 5 + Math.random() * 10;
    
    gsap.to(glyph, {
      y: distance,
      rotation: rotation,
      duration: duration,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: i * 0.5
    });
  });

  // Cosmic portal animation for nav logo
  gsap.utils.toArray('.portal-ring').forEach((ring, i) => {
    gsap.to(ring, {
      rotation: 360,
      duration: 8 + (i * 4),
      repeat: -1,
      ease: "none"
    });
  });

  // Video background effect
  const video = document.getElementById('roadmap-video');
  if (video) {
    video.playbackRate = 0.5;
    video.muted = true;
    
    // Try to autoplay with fallback
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Autoplay prevented, showing fallback");
        video.poster = "fallback-image.jpg"; // Add your fallback image
      });
    }
    
    // Smooth scroll-based video scrubbing
    ScrollTrigger.create({
      onUpdate: (self) => {
        video.currentTime = self.progress * 10;
      }
    });
  }

  // Add scroll-activated glow to timeline axis
  const timelineAxis = document.querySelector('.timeline-axis');
  if (timelineAxis) {
    ScrollTrigger.create({
      onUpdate: (self) => {
        gsap.to(timelineAxis, {
          boxShadow: `0 0 ${10 + (self.progress * 20)}px rgba(0, 247, 255, ${0.3 + (self.progress * 0.4)})`,
          duration: 0.5
        });
      }
    });
  }
});