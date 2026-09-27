/**
 * Mahmoud Bandari - Flutter Developer Portfolio
 * Main Interactive JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. TYPEWRITER EFFECT (HERO SECTION)
  // =========================================================================
  const typewriterText = document.getElementById('typewriterText');
  const phrases = [
    'Flutter Developer',
    'Software Engineer',
    'Mobile Application Specialist'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    if (!typewriterText) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at complete phrase
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // =========================================================================
  // 2. TESTIMONIALS SLIDER / CAROUSEL
  // =========================================================================
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  const sliderWrapper = document.querySelector('.slider-wrapper');

  let currentSlideIndex = 0;
  let slideInterval = null;
  const slideDuration = 5500; // 5.5 seconds

  function updateSlider(index) {
    if (slides.length === 0) return;

    // Boundary wrap
    if (index >= slides.length) {
      currentSlideIndex = 0;
    } else if (index < 0) {
      currentSlideIndex = slides.length - 1;
    } else {
      currentSlideIndex = index;
    }

    // Toggle active classes
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlideIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlideIndex);
    });
  }

  function nextSlide() {
    updateSlider(currentSlideIndex + 1);
  }

  function prevSlide() {
    updateSlider(currentSlideIndex - 1);
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.target.getAttribute('data-index'), 10);
      updateSlider(targetIndex);
      resetAutoSlide();
    });
  });

  // Touch Swipe for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (sliderWrapper) {
    sliderWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderWrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 50;
      if (touchEndX < touchStartX - threshold) {
        nextSlide();
        resetAutoSlide();
      } else if (touchEndX > touchStartX + threshold) {
        prevSlide();
        resetAutoSlide();
      }
    }

    // Pause on hover
    sliderWrapper.addEventListener('mouseenter', stopAutoSlide);
    sliderWrapper.addEventListener('mouseleave', startAutoSlide);
  }

  function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function stopAutoSlide() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  startAutoSlide();

  // =========================================================================
  // 3. HEADER SCROLL & ACTIVE SECTION NAVIGATION SPY
  // =========================================================================
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header background change
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll To Top button visibility
    if (scrollTopBtn) {
      if (scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Active Section Spy
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================================
  // 4. MOBILE HAMBURGER MENU
  // =========================================================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close mobile menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });

    // Close when clicking outside menu
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        hamburgerBtn.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });
  }

  // =========================================================================
  // 5. THEME TOGGLE (DARK / LIGHT)
  // =========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('mb_portfolio_theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('mb_portfolio_theme', newTheme);
    });
  }

  // =========================================================================
  // 6. COPY TO CLIPBOARD UTILITY WITH TOAST
  // =========================================================================
  const copyButtons = document.querySelectorAll('.copy-btn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(message) {
    if (!toastNotification) return;

    if (toastMessage) {
      toastMessage.textContent = message;
    }

    toastNotification.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2800);
  }

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied: ${textToCopy}`);
      } catch (err) {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`Copied: ${textToCopy}`);
      }
    });
  });

  // =========================================================================
  // 7. CONTACT FORM SUBMISSION HANDLER
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('senderSubject').value.trim();
      const message = document.getElementById('senderMessage').value.trim();

      if (!name || !email || !message) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please fill out all required fields.';
        formStatus.style.display = 'block';
        return;
      }

      // Show temporary loading status
      formStatus.className = 'form-status';
      formStatus.style.display = 'block';
      formStatus.style.background = 'rgba(0, 210, 255, 0.1)';
      formStatus.style.color = '#00D2FF';
      formStatus.textContent = 'Preparing your message...';

      setTimeout(() => {
        // Form submitted successfully feedback
        formStatus.className = 'form-status success';
        formStatus.textContent = `Thank you, ${name}! Your message has been sent. Mahmoud will reply soon.`;

        // Direct mailto backup trigger
        const mailtoUrl = `mailto:albndary2021@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Mahmoud,\n\n${message}\n\nFrom: ${name} (${email})`)}`;
        
        window.location.href = mailtoUrl;

        contactForm.reset();

        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 6000);
      }, 700);
    });
  }

  // =========================================================================
  // 8. SCROLL REVEAL MICRO-ANIMATIONS
  // =========================================================================
  const cardsToAnimate = document.querySelectorAll('.glass-card, .highlight-item');
  
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          cardObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    cardsToAnimate.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      cardObserver.observe(card);
    });
  }

});
