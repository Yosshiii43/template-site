// ドロップダウンメニューの制御関数（PC／SP共通）
// useToggleButton: true → ▼ボタン（.c-toggle）を使う場合
// useToggleButton: false → 親リンク（.p-nav__link）を直接トグルにする場合

/* ===========================================
   ナビゲーション全体のセットアップ
=========================================== */
function initNavigation() {
  initHamburger();      // ハンバーガー（SP）
  initDropdownMenus({ useToggleButton: true });  // ドロップダウン（PC/SP）
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
function initDropdownMenus({ useToggleButton = true } = {}) {
  // トグル対象のボタン（リンク or ▼ボタン）を取得
  const toggles = useToggleButton
    ? document.querySelectorAll('[data-has-child] > .c-toggle')
    : document.querySelectorAll('[data-has-child] > .p-nav__link');

  // 各トグルボタンに対して処理
  toggles.forEach(toggle => {
    const parentLi = toggle.closest('[data-has-child]');          // 親liを取得
    const submenu = parentLi.querySelector('.p-childNav__list');  // 子メニュー（ul）を取得
    const linkBtn = parentLi.querySelector('.p-nav__link');       // 親メニューのリンクを取得（aria更新用）

    if (!submenu) return; // 子メニューがなければスキップ

    // 開閉処理（クリック or キー操作）
    function openClose(e) {
      // aタグなら、まだ開いてないときにページ遷移をキャンセル
      if (toggle.tagName === 'A') {
        if (!parentLi.classList.contains('is-open')) {
          e.preventDefault();
        }
      } else {
        // button の場合は常にキャンセル（submitなどを防ぐ）
        e.preventDefault();
      }

      // 他の開いているメニューがあれば閉じる（1つだけ開くようにする）
      document.querySelectorAll('[data-has-child].is-open').forEach(li => {
        if (li !== parentLi) {
          li.classList.remove('is-open');
          li.querySelector('.p-nav__link')?.setAttribute('aria-expanded', false);
          li.querySelector('.c-toggle')?.setAttribute('aria-expanded', false);
        }
      });

      // 自分の開閉をトグル
      const isOpen = parentLi.classList.toggle('is-open');
      linkBtn.setAttribute('aria-expanded', isOpen);
      parentLi.querySelector('.c-toggle')?.setAttribute('aria-expanded', isOpen);

      // 開いたときは submenu 内の最初のリンクにフォーカス
      if (isOpen) submenu.querySelector('a')?.focus();
    }

    // クリック／Enter／Spaceキーで開閉
    ['click', 'keydown'].forEach(eventName => {
      toggle.addEventListener(eventName, e => {
        // keydown のときは Enter / Space 以外は無視
        if (eventName === 'keydown' && !(e.key === 'Enter' || e.key === ' ')) return;
        openClose(e);
      });
    });

    // submenu内で Escapeキーを押したら閉じる
    submenu.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        parentLi.classList.remove('is-open');
        linkBtn.setAttribute('aria-expanded', false);
        parentLi.querySelector('.c-toggle')?.setAttribute('aria-expanded', false);
        toggle.focus(); // フォーカスを親メニューに戻す
      }
    });
  });

  // 外側をクリックしたらすべて閉じる
  document.addEventListener('click', e => {
    toggles.forEach(tg => {
      const li = tg.closest('[data-has-child]');
      if (!li.contains(e.target)) {
        li.classList.remove('is-open');
        li.querySelector('.p-nav__link')?.setAttribute('aria-expanded', false);
        li.querySelector('.c-toggle')?.setAttribute('aria-expanded', false);
      }
    });
  });

  // aria-expanded をホバーでも補完する（PC用対応）
  const parentButtons = document.querySelectorAll('[data-has-child] > .p-nav__link');

  parentButtons.forEach(btn => {
    const parentLi = btn.closest('[data-has-child]');
    const submenu = parentLi.querySelector('.p-childNav__list');

    btn.addEventListener('mouseenter', () => {
      btn.setAttribute('aria-expanded', true);
    });

    // pointerleaveのあと、少し待ってからまだhover中かを確認
    btn.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!parentLi.matches(':hover')) {
          btn.setAttribute('aria-expanded', false);
        }
      }, 50); // ほんの少し待つことで子に移っただけのケースを回避
    });

    // 子メニューからも離れたら false に
    submenu?.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!parentLi.matches(':hover')) {
          btn.setAttribute('aria-expanded', false);
        }
      }, 50);
    });
  });

}

/* ==== 実行 ==== */
initNavigation();