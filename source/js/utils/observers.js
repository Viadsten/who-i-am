export class EventObserver {
  constructor() {
    this.observers = [];
  }

  subscribe(fn) {
    this.observers.push(fn);
  }

  unsubscribe(fn) {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  }

  fire(data) {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}

const resizeObserver = new EventObserver();
const resizeObserverProto = new ResizeObserver(() => setTimeout(resizeObserver.fire('resize'), 10));
resizeObserverProto.observe(document.documentElement);


export {resizeObserver};

let scrollObserver;
export const initScrollObserver = () => {
  scrollObserver = new EventObserver();
  gsap.timeline({
    scrollTrigger: {
      trigger: '[data-scroll-container] main',
      scroller: '[data-scroll-container]',
      start: 'top',
      end: 'bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollObserver.fire(self);
      },
    },
  });
};
// инициализирует обсервер скролла. работает с локо и тачем
// везде следует использовать его прим: scrollObserver.subscribe(() => {console.log('asd')})
export {scrollObserver};
