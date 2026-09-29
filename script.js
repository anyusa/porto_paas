/**
 * ============================================================================
 * PORTFOLIO SISWA SMK - MAIN JAVASCRIPT
 * Vanilla JavaScript (ES6+) • Tanpa Library / Framework Eksternal
 * Fitur: Mobile Nav, Dark/Light Mode, Filter Project, Scroll Reveal, 
 *        Active Nav Link, Back to Top, Form Validation, Dynamic Year.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. DYNAMIC COPYRIGHT YEAR
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. THEME SWITCHER (DARK / LIGHT MODE DENGAN LOCALSTORAGE)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Baca tema tersimpan di localStorage atau preferensi sistem pengguna
  const savedTheme = localStorage.getItem('portfolio_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Tentukan tema awal (default: dark)
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  rootElement.setAttribute('data-theme', initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Update DOM dan simpan preferensi ke LocalStorage
      rootElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio_theme', newTheme);
    });
  }

  // --------------------------------------------------------------------------
  // 3. NAVBAR SCROLL EFFECT & MOBILE NAVIGATION
  // --------------------------------------------------------------------------
  const header = document.getElementById('header');
  const navToggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Efek shadow dan border pada header saat scroll
  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // Toggle buka/tutup menu hamburger di mobile
  if (navToggleBtn && navMenu) {
    navToggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggleBtn.classList.toggle('open');
      navToggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Otomatis menutup menu mobile ketika link navigasi diklik
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggleBtn.classList.remove('open');
          navToggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. ACTIVE NAVIGATION LINK ON SCROLL
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const handleActiveNavOnScroll = () => {
    const scrollPosition = window.scrollY + 120; // Offset untuk navbar

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const currentNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (currentNavLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          currentNavLink.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', handleActiveNavOnScroll, { passive: true });

  // --------------------------------------------------------------------------
  // 5. PROJECT FILTERING (SEMUA, WEB, UI, JAVASCRIPT)
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Ubah status aktif tombol filter
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      // Tampilkan atau sembunyikan card sesuai kategori
      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
          // Trigger reflow untuk animasi halus
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Unobserve setelah animasi pertama kali muncul untuk efisiensi memori
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback jika browser lama tidak mendukung IntersectionObserver
    revealElements.forEach(el => el.classList.add('active'));
  }

  // --------------------------------------------------------------------------
  // 7. BACK TO TOP BUTTON
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 8. CONTACT FORM SIMULATION & VALIDATION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const formAlert = document.getElementById('form-alert');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  // Helper fungsi validasi email dengan regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Helper untuk membersihkan status error pada input
  const clearErrors = () => {
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (messageError) messageError.textContent = '';
    
    if (nameInput) nameInput.classList.remove('input-error');
    if (emailInput) emailInput.classList.remove('input-error');
    if (messageInput) messageInput.classList.remove('input-error');

    if (formAlert) {
      formAlert.className = 'form-alert';
      formAlert.textContent = '';
      formAlert.style.display = 'none';
    }
  };

  // Hapus error secara instan saat user mulai mengetik
  [nameInput, emailInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('input-error');
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) errorElement.textContent = '';
      });
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      // MENCEGAH PENGIRIMAN FORM BAWAAN BROWSER (STATIC WEBSITE TANPA BACKEND)
      e.preventDefault();
      clearErrors();

      let hasError = false;

      // Validasi Nama
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal) {
        nameError.textContent = 'Nama lengkap wajib diisi.';
        nameInput.classList.add('input-error');
        hasError = true;
      } else if (nameVal.length < 3) {
        nameError.textContent = 'Nama minimal terdiri dari 3 karakter.';
        nameInput.classList.add('input-error');
        hasError = true;
      }

      // Validasi Email
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!emailVal) {
        emailError.textContent = 'Alamat email wajib diisi.';
        emailInput.classList.add('input-error');
        hasError = true;
      } else if (!isValidEmail(emailVal)) {
        emailError.textContent = 'Format alamat email tidak valid (contoh: user@domain.com).';
        emailInput.classList.add('input-error');
        hasError = true;
      }

      // Validasi Pesan
      const messageVal = messageInput ? messageInput.value.trim() : '';
      if (!messageVal) {
        messageError.textContent = 'Pesan wajib diisi.';
        messageInput.classList.add('input-error');
        hasError = true;
      } else if (messageVal.length < 10) {
        messageError.textContent = 'Pesan minimal terdiri dari 10 karakter agar informatif.';
        messageInput.classList.add('input-error');
        hasError = true;
      }

      // Jika validasi gagal, hentikan proses
      if (hasError) {
        return;
      }

      /* ======================================================================
         CATATAN INTEGRASI:
         Website ini berjalan secara STATIC MURNI tanpa backend/database.
         Pada versi produksi sesungguhnya, form ini dapat dihubungkan ke layanan:
         1. Formspree (https://formspree.io)
         2. EmailJS (https://emailjs.com)
         3. Webhook / Serverless API endpoint
         ====================================================================== */

      // Tampilkan banner notifikasi simulasi sukses
      if (formAlert) {
        formAlert.className = 'form-alert success';
        formAlert.innerHTML = `
          <strong>✅ Pesan Berhasil Disiapkan!</strong><br>
          Terima kasih <em>${escapeHtml(nameVal)}</em>. Pesan Anda telah tervalidasi dengan baik. 
          <br><small style="opacity: 0.9;">*Pada versi production, formulir ini dapat langsung disambungkan ke endpoint backend/layanan email.</small>
        `;
        formAlert.style.display = 'block';
      }

      // Reset input form setelah pengiriman simulasi berhasil
      contactForm.reset();

      // Scroll halus ke pesan alert agar user melihat konfirmasi
      formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // Helper untuk sanitasi teks mencegah potensi XSS pada pesan preview
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
});
