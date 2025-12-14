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

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
    console.log('AOS initialized successfully');
  } else {
    console.warn('AOS library not loaded');
  }
});

// Education Cards Functionality
const collegeCard = document.getElementById('collegeCard');
const schoolCard = document.getElementById('schoolCard');
let collegeFlipped = false;
let schoolFlipped = false;
let isAnimating = false;

// College card content
const collegeOriginal = {
  logo: '<img src="assets/images/college-logo.png" alt="Aalim Muhammed Salegh College" onerror="this.style.display=\'none\'">',
  text: '<h3>AALIM MUHAMMED SALEGH COLLEGE OF ENGINEERING</h3>'
};

const collegeDetails = {
  text: `<h3>Bachelor of Engineering — Computer Science</h3>
         <p>Aalim Muhammed Salegh College of Engineering</p>
         <p>2021 – 2025</p>
         <p><strong>CGPA: 8.35</strong></p>`
};

// School card content  
const schoolOriginal = {
  logo: '<img src="assets/images/school-logo.png" alt="Kendriya Vidyalaya" onerror="this.style.display=\'none\'">',
  text: '<h3>KENDRIYA VIDYALAYA AIR FORCE STATION AVADI</h3>'
};

const schoolDetails = {
  text: `<h3>Kendriya Vidyalaya Air Force Station, Avadi</h3>
         <p>CBSE Board</p>
         <p>2007-2019</p>
         <p><strong>10th Grade | 2017: 9.2 CGPA</strong></p>
         <p><strong>12th Grade | 2019: 71.2%</strong></p>`
};

function toggleEducationCard(card, isFlipped, originalContent, detailsContent, flipStateVar) {
  if (isAnimating) return;
  
  isAnimating = true;
  const cardContent = card.querySelector('.card-content');
  const cardLogo = card.querySelector('.card-logo');
  const cardText = card.querySelector('.card-text');
  
  // Add vanishOut animation
  card.classList.add('magictime', 'vanishOut');
  
  // Wait for animation to complete
  setTimeout(() => {
    // Change content based on current state
    if (!isFlipped) {
      cardLogo.innerHTML = detailsContent.logo;
      cardText.innerHTML = detailsContent.text;
      if (flipStateVar === 'college') collegeFlipped = true;
      if (flipStateVar === 'school') schoolFlipped = true;
    } else {
      cardLogo.innerHTML = originalContent.logo;
      cardText.innerHTML = originalContent.text;
      if (flipStateVar === 'college') collegeFlipped = false;
      if (flipStateVar === 'school') schoolFlipped = false;
    }
    
    // Remove vanishOut and add vanishIn
    card.classList.remove('vanishOut');
    card.classList.add('vanishIn');
    
    // Clean up animation classes
    setTimeout(() => {
      card.classList.remove('magictime', 'vanishIn');
      isAnimating = false;
    }, 600);
    
  }, 600); // Duration of vanishOut animation
}

// Event listeners for education cards
if (collegeCard) {
  collegeCard.addEventListener('click', () => {
    toggleEducationCard(collegeCard, collegeFlipped, collegeOriginal, collegeDetails, 'college');
  });
}

if (schoolCard) {
  schoolCard.addEventListener('click', () => {
    toggleEducationCard(schoolCard, schoolFlipped, schoolOriginal, schoolDetails, 'school');
  });
}

// Certificate Overlay Functionality
function openCertificate(imagePath, title, description) {
  const overlay = document.getElementById('certificateOverlay');
  const overlayImage = document.getElementById('overlayImage');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayDescription = document.getElementById('overlayDescription');
  
  overlayImage.src = imagePath;
  overlayTitle.textContent = title;
  overlayDescription.textContent = description;
  
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeCertificate() {
  const overlay = document.getElementById('certificateOverlay');
  overlay.style.display = 'none';
  document.body.style.overflow = ''; // Restore scrolling
}

// Close certificate overlay when clicking outside or pressing escape
document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.getElementById('certificateOverlay');
  const overlayContent = overlay?.querySelector('.overlay-content');
  
  if (overlay) {
    // Close when clicking outside the content
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeCertificate();
      }
    });
    
    // Handle mobile tap for text display
    if (overlayContent) {
      overlayContent.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
          e.stopPropagation(); // Prevent closing overlay
          this.classList.toggle('show-text');
        }
      });
    }
  }
  
  // Close with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeCertificate();
    }
  });
});

// Make openCertificate function globally available
window.openCertificate = openCertificate;
window.closeCertificate = closeCertificate;

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