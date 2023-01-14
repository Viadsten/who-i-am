import * as LocomotiveScroll from '../../vendor/locomotive-scroll.js';
import {resizeObserver} from "../../utils/observers.js";

let locomotive;

const initLocomotiveScroll = () => {
  const el = document.querySelector('[data-scroll-container]');
  const vpTouch = window.matchMedia('(pointer: coarse)');

  if (!el || vpTouch.matches) {
    return;
  }

  // главная переменная в этом файле. из неё можно получить все методы скролла для анимаций и любых других манипуляций
  locomotive = new LocomotiveScroll({
    el,
    smooth: true,
    lerp: 0.025,
    multiplier: 0.65,
    getDirection: true,
    tablet: {
      breakpoint: 1023,
    },
  });

  // обновляем скролл по ресайзу
  // resizeObserver.subscribe(locomotive.update);
  window.locomotive = locomotive;
};

export {initLocomotiveScroll, locomotive};
