import {iosVhFix} from './utils/ios-vh-fix';
import {initModals} from './modules/modals/init-modals';
import {initLocomotiveScroll, locomotive} from "./modules/smooth-scroll/init-locomotive.js";
import {initScrollTrigger, scrollTrigger} from "./modules/smooth-scroll/init-scroll-trigger.js";
import {initAnimationModule} from "./modules/animations/index.js";
import {initScrollObserver} from "./utils/observers.js";
import {Loader} from "./modules/loader.js";
// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {
  // Utils
  // ---------------------------------

  iosVhFix();

  // Modules
  // ---------------------------------

  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  window.addEventListener('load', () => {
    initModals();

    setTimeout(() => {
      initLocomotiveScroll();
      initScrollTrigger();
      initScrollObserver();
      new Loader();
      initAnimationModule();
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
