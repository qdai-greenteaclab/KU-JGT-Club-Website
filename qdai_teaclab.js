document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.menu');

  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      menu.classList.toggle('active');

      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
    });

    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        menu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const moreToggle = document.querySelector('.more-toggle');
  const moreDropdown = document.querySelector('.more-dropdown');

  if (moreToggle && moreDropdown) {
    moreToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isActive = moreDropdown.classList.toggle('active');
      moreToggle.setAttribute('aria-expanded', String(isActive));
    });

    document.addEventListener('click', (event) => {
      if (!moreDropdown.contains(event.target) && event.target !== moreToggle) {
        moreDropdown.classList.remove('active');
        moreToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ヘッダー：スクロールしたら影をつける
  const header = document.querySelector('.site-header');
  if (header) {
    const updateHeaderShadow = () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    };
    updateHeaderShadow();
    window.addEventListener('scroll', updateHeaderShadow, { passive: true });
  }

  // トップページ：キャッチコピーのタイピング演出
  const typingEl = document.querySelector('.hero-typing-text');
  if (typingEl) {
    const fullText = typingEl.dataset.text || '';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      typingEl.textContent = fullText;
    } else {
      let charIndex = 0;
      const typeNextChar = () => {
        charIndex += 1;
        typingEl.textContent = fullText.slice(0, charIndex);
        if (charIndex < fullText.length) {
          setTimeout(typeNextChar, 110);
        }
      };
      setTimeout(typeNextChar, 900);
    }
  }

  // トップページ：ヒーロー写真のスライドショー
  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 5000);
  }

  // スクロールで要素をフェードインさせる（IntersectionObserverが使える場合のみ）
  if ('IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.title-a, .pj-card, .faq-item, .voice-card, .shop-card, .info-box, .about_us-layout .botton-link, .notice-item, .report-card'
    );

    revealTargets.forEach((el, index) => {
      el.classList.add('reveal-init');
      const siblingIndex = Array.prototype.indexOf.call(el.parentElement ? el.parentElement.children : [], el);
      const delay = (siblingIndex >= 0 ? siblingIndex : index) % 6 * 0.08;
      el.style.transitionDelay = `${delay}s`;
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => revealObserver.observe(el));
  }
});
