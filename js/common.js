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