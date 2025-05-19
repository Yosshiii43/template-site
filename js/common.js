/* ===========================================
   ナビゲーション全体のセットアップ
=========================================== */
function initNavigation() {
  initHamburger();      // ハンバーガー（SP）
  initDropdownMenus();  // ドロップダウン（PC/SP）
}

/* ──────────────────────────────────────────
   1. ハンバーガー ＆ ドロワー（SP用）
────────────────────────────────────────── */
function initHamburger() {
  const ham  = document.querySelector('#js-hamburger');
  const nav  = document.querySelector('#js-nav');
  const body = document.body;

  if (!ham || !nav) return;

  function toggleNav() {
    const isOpen = ham.classList.toggle('is-open');
    nav.classList.toggle('is-open',  isOpen);
    body.classList.toggle('is-open', isOpen);
    ham.setAttribute('aria-expanded', isOpen);
  }

  ham.addEventListener('click', toggleNav);

  nav.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ham.classList.contains('is-open')) {
      toggleNav();
      ham.focus();
    }
  });
}

/* ──────────────────────────────────────────
   2. ドロップダウン（PC／SP共通）
────────────────────────────────────────── */
function initDropdownMenus () {
  const parentButtons = document.querySelectorAll('[data-has-child] > .p-nav__link');

  parentButtons.forEach(btn => {
    const parentLi  = btn.closest('[data-has-child]');
    const submenuId = btn.getAttribute('aria-controls');
    const submenu   = document.getElementById(submenuId);
    if (!submenu || !parentLi) return;

    function toggleSubmenu(e) {
      e.preventDefault();

      // 他の open を閉じる（自分以外）
      document.querySelectorAll('[data-has-child].is-open').forEach(item => {
        if (item !== parentLi) {
          item.classList.remove('is-open');
          const otherBtn = item.querySelector('.p-nav__link');
          if (otherBtn) {
            otherBtn.setAttribute('aria-expanded', false);
          }
        }
      });

      // 自分をトグル
      const isOpen = parentLi.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen);

      if (isOpen) {
        const firstLink = submenu.querySelector('a');
        if (firstLink) firstLink.focus();
      } else {
        btn.focus();
      }
    }

    btn.addEventListener('click', toggleSubmenu);

    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') toggleSubmenu(e);
    });

    submenu.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        parentLi.classList.remove('is-open');
        btn.setAttribute('aria-expanded', false);
        btn.focus();
      }
    });
  });

  // 外側クリックで全部閉じる（親 li に含まれない場合）
  document.addEventListener('click', (e) => {
    parentButtons.forEach((btn) => {
      const parentLi = btn.closest('[data-has-child]');
      if (!parentLi.contains(e.target)) {
        parentLi.classList.remove('is-open');
        btn.setAttribute('aria-expanded', false);
      }
    });
  });
}

/* ==== 実行 ==== */
initNavigation();


/**********************************
 * パララックス処理
 **********************************/

/***** パララックス更新 *****/
function updateParallax() {
  const parallaxEls = document.querySelectorAll('.js-parallax');

  parallaxEls.forEach(el => {
    const speed   = parseFloat(el.dataset.speed) || 0.3;
    const scrollY = window.scrollY || window.pageYOffset;
    const offset  = (scrollY - el.offsetTop) * speed;

    /* ★ 背景ラッパーを取得して translateY で動かす */
    const bg = el.querySelector('.parallax-bg');
    if (!bg) return;
    bg.style.transform = `translateY(${offset}px)`;
  });
}

// スクロールイベントにパララックス処理を紐づけ
function initParallax() {
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateParallax(); // 初期位置合わせ
}


/**********************************
 * ヒーロースライダー処理
 **********************************/

function initHeroSlider() {
  const heroSection = document.querySelector('#hero');
  const bg = heroSection?.querySelector('.parallax-bg'); // ← 背景ラッパー取得
  const dots = document.querySelectorAll('.p-hero__dot');
  const slides = [
    '../img/img_hero1_pc.jpg',
    '../img/img_hero2_pc.jpg',
    '../img/img_hero3_pc.jpg'
  ];

  if (!heroSection || !bg) return;

  let currentSlide = 0;

  function updateSlide(index) {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');

    heroSection.style.opacity = '0';
    setTimeout(() => {
      bg.style.backgroundImage = `url(${slides[index]})`;
      heroSection.style.opacity = '1';
      updateParallax(); // 位置調整
    }, 300);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateSlide(currentSlide);
    });
  });

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide(currentSlide);
  }, 5000);

  // 初期化
  bg.style.backgroundImage = `url(${slides[0]})`;
  updateSlide(currentSlide);
}


/**********************************
 * 初期化処理（DOM読み込み後に実行）
 **********************************/
document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initHeroSlider();
});