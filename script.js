// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis smooth scrolling with error handling
let lenis;
try {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    console.log('Lenis initialized successfully');
  } else {
    console.warn('Lenis not loaded, using default scrolling');
  }
} catch (error) {
  console.warn('Lenis initialization failed:', error);
}

// Smooth glowing cursor aura that follows mouse with delay - no libraries needed
document.addEventListener('DOMContentLoaded', function() {
  const cursorGlow = document.querySelector('.cursor-glow');

  if (!cursorGlow) {
    console.log('Cursor glow element not found');
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  
  // Smooth easing factor (lower = more delay/smoothness)
  const ease = 0.15;

  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Show cursor glow when mouse moves
    cursorGlow.style.opacity = '1';
  });

  // Hide cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });

  // Smooth animation loop for delayed following
  function animate() {
    // Smooth interpolation toward mouse position
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;
    
    // Update cursor position
    cursorGlow.style.left = cursorX + 'px';
    cursorGlow.style.top = cursorY + 'px';
    
    // Continue animation
    requestAnimationFrame(animate);
  }

  // Start the animation loop
  animate();

  console.log('Smooth cursor glow initialized successfully');
});

// GSAP reveal for sections with ScrollTrigger
gsap.utils.toArray('section').forEach((sec,i)=>{
  gsap.fromTo(sec, 
    {autoAlpha:0, y:24}, 
    {
      autoAlpha:1, 
      y:0, 
      duration:0.8, 
      ease:'power2.out',
      scrollTrigger: {
        trigger: sec,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none reverse"
      }
    }
  );
});

// Active nav highlighting based on scroll position
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

function updateActiveNav() {
  const scrollPos = window.scrollY + 200; // adjust offset for better detection
  
  let currentSection = '';
  
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    
    if (scrollPos >= top && scrollPos < top + height) {
      currentSection = section.getAttribute('id');
    }
  });
  
  // Update active nav link
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// Throttle scroll events for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  scrollTimeout = setTimeout(updateActiveNav, 10);
}, {passive: true});

// Initial call
updateActiveNav();

// Smooth scroll navigation
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      lenis.scrollTo(targetSection, {duration: 1.5});
    }
  });
});

// Accessibility: reduce motion if user prefers
if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('.skills-track, .cert-track').forEach(el => {
    el.style.animation = 'none';
  });
  document.querySelectorAll('section').forEach(el => {
    el.style.transition = 'none';
  });
  // Disable Lenis smooth scrolling
  if(lenis && lenis.destroy) {
    lenis.destroy();
  }
}