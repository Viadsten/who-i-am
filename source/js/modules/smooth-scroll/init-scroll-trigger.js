import {ScrollTrigger} from './../../vendor/scroll-trigger.min.js';
import {locomotive} from './init-locomotive';
let scrollTrigger;

const initScrollTrigger = () => {
  gsap.registerPlugin(ScrollTrigger);

  if (!locomotive) {
    console.warn('LocomotiveScroll not initialized');
    return;
  }
  // при каждом обновлении локомотив будет дергать ScrollTrigger (синхронизируем их)
  locomotive.on('scroll', ScrollTrigger.update);

  // через scrollerProxy просим ScrollTrigger использовать ивенты локомотива вместо ивентов скролла js, пока локомотив работает
  ScrollTrigger.scrollerProxy('[data-scroll-container]', {
    scrollTop(value) {
      return arguments.length ? locomotive.scrollTo(value, 0, 0) : locomotive.scroll.instance.scroll.y;
    }, // настраиваем только по оси Y для вертикального скролла
    getBoundingClientRect() {
      return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
    },
    // хак для локомотива
    pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed',
  });

  // связываем локомотив и скроллтригер
  ScrollTrigger.addEventListener('refresh', () => locomotive.update());
  ScrollTrigger.refresh();

  window.addEventListener('scrolltrigger.update', () => {
    ScrollTrigger.refresh();
  });

  scrollTrigger = ScrollTrigger;
};

export {initScrollTrigger, scrollTrigger};
