import * as LocomotiveScroll from '../../vendor/locomotive-scroll.js';

let locomotive;

const initLocomotiveScroll = () => {
  const el = document.querySelector('[data-scroll-container]');

  if (!el) {
    return;
  }

  // главная переменная в этом файле. из неё можно получить все методы скролла для анимаций и любых других манипуляций
  locomotive = new LocomotiveScroll({
    el,
    smooth: true,
    lerp: 0.025,
    getDirection: true,
    tablet: {
      breakpoint: 1023,
    },
  });

  // обновляем скролл по ресайзу
  const resizeObserver = new ResizeObserver(() => {
    locomotive.update();
  });

  resizeObserver.observe(document.documentElement);
  window.locomotive = locomotive;
};

export {initLocomotiveScroll, locomotive};
