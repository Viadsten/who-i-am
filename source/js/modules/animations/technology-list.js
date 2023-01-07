import {resizeObserver} from "../../utils/observers.js";
import {scrollTrigger} from "../smooth-scroll/init-scroll-trigger.js";

export class TechnologyList {
  constructor() {
    this.container = document.querySelector('[data-animate-technology-list]');
    if (!this.container) {
      return;
    }

    this.titles = this.container.querySelectorAll('[data-animate-technology-list="title"]');
    this.descriptions = this.container.querySelectorAll('[data-animate-technology-list="description"]');

    this.timeline = null;
    this.touchVp = window.matchMedia('(pointer: coarse)');

    this.init = this.init.bind(this);
    this.checkActiveTitle = this.checkActiveTitle.bind(this);

    setTimeout(() => {
      resizeObserver.subscribe(this.init);
    }, 100);

    this.init();
  }

  checkActiveTitle() {
    this.descriptions.forEach((description, index) => {
      const rect = description.getBoundingClientRect();

      if (rect.top < window.innerHeight && rect.bottom > window.innerHeight) {
        this.titles[index].classList.add('is-shown');
        this.titles[index].classList.remove('is-hidden-up');
      }

      if (rect.top < 0) {
        this.titles[index].classList.remove('is-shown');
        this.titles[index].classList.add('is-hidden-up');
      }

      if (rect.top > window.innerHeight) {
        this.titles[index].classList.remove('is-shown');
        this.titles[index].classList.remove('is-hidden-up');
      }
    });
  }

  init() {
    scrollTrigger.create({
      trigger: this.container,
      scroller: '[data-scroll-container]',
      scrub: this.touchVp ? 1.5 : true,
      invalidateOnRefresh: true,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: () => {
        this.checkActiveTitle();
      }
    });
  }
}
