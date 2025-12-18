gsap.registerPlugin(ScrollTrigger);

// Hamburger menu
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const leftPanel = document.querySelector('.left-panel');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  if (hamburger && leftPanel) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      leftPanel.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        leftPanel.classList.remove('active');
      });
    });
    
    // close when clicking outside
    document.addEventListener('click', function(e) {
      if (!leftPanel.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        leftPanel.classList.remove('active');
      }
    });
  }
});

// cursor glow effect
document.addEventListener('DOMContentLoaded', function() {
  const cursorGlow = document.querySelector('.cursor-glow');
  if (!cursorGlow) return;

  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
  const ease = 0.15;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });

  function animate() {
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;
    
    cursorGlow.style.left = cursorX + 'px';
    cursorGlow.style.top = cursorY + 'px';
    
    requestAnimationFrame(animate);
  }
  animate();
});

// section fade-in animations
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

// active nav based on scroll
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

function updateActiveNav() {
  const scrollPos = window.scrollY + window.innerHeight / 2;
  let currentSection = '';
  
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    
    if (scrollPos >= top && scrollPos < top + height) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, {passive: true});
updateActiveNav();

// smooth scroll to sections
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {  
      targetSection.scrollIntoView({behavior: 'smooth', block: 'start'});  
    }
  });
});

// AOS init
document.addEventListener('DOMContentLoaded', function() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: false,
      offset: 100
    });
  }
});

// certificate overlay
function openCertificate(imagePath, title, description) {
  const overlay = document.getElementById('certificateOverlay');
  const overlayImage = document.getElementById('overlayImage');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayDescription = document.getElementById('overlayDescription');
  
  overlayImage.src = imagePath;
  overlayTitle.textContent = title;
  overlayDescription.textContent = description;
  
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeCertificate() {
  const overlay = document.getElementById('certificateOverlay');
  overlay.style.display = 'none';
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.getElementById('certificateOverlay');
  const overlayContent = overlay?.querySelector('.overlay-content');
  
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeCertificate();
    });
    
    // mobile - tap to show text
    if (overlayContent) {
      overlayContent.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
          e.stopPropagation();
          this.classList.toggle('show-text');
        }
      });
    }
  }
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeCertificate();
  });
});

window.openCertificate = openCertificate;
window.closeCertificate = closeCertificate;

// reduce motion if user prefers
if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('.skills-track, .cert-track').forEach(el => {
    el.style.animation = 'none';
  });
  document.querySelectorAll('section').forEach(el => {
    el.style.transition = 'none';
  });
}