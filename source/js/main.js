import {iosVhFix} from './utils/ios-vh-fix';
import {initModals} from './modules/modals/init-modals';
import {Form} from './modules/form-validate/form';
import {CustomSelect} from './modules/select/custom-select';
import {initLocomotiveScroll, locomotive} from "./modules/smooth-scroll/init-locomotive.js";
import {initScrollTrigger, scrollTrigger} from "./modules/smooth-scroll/init-scroll-trigger.js";
import {initAnimationModule} from "./modules/animations/index.js";
import {ScrollLock} from "./utils/scroll-lock.js";
import {Cursor} from "./modules/cursor.js";
// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  const loaderScrollLock = new ScrollLock();
  loaderScrollLock.disableScrolling();
  // Utils
  // ---------------------------------

  iosVhFix();

  // Modules
  // ---------------------------------

  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  window.addEventListener('load', () => {
    loaderScrollLock.enableScrolling();

    initModals();


    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1);

    setTimeout(() => {
      initLocomotiveScroll();
      initScrollTrigger();
      initAnimationModule();

      new Cursor();
      console.log('install')
    }, 5);

    setTimeout(() => {
      if (locomotive) {
        locomotive.update();
      }
      scrollTrigger.refresh();
    }, 20);
  });
});

// ---------------------------------

// ❗❗❗ обязательно установите плагины eslint, stylelint, editorconfig в редактор кода.

// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// выносим все в дата атрибуты
// url до иконок пинов карты, настройки автопрокрутки слайдера, url к json и т.д.

// для адаптивного JS используейтся matchMedia и addListener
// const breakpoint = window.matchMedia(`(min-width:1024px)`);
// const breakpointChecker = () => {
//   if (breakpoint.matches) {
//   } else {
//   }
// };
// breakpoint.addListener(breakpointChecker);
// breakpointChecker();

// используйте .closest(el)
