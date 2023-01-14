import {resizeObserver} from '../../utils/observers.js';
import {scrollTrigger} from '../smooth-scroll/init-scroll-trigger.js';

export class IntroAnimation {
  constructor() {
    this.container = document.querySelector('[data-animate-intro]');
    if (!this.container) {
      return;
    }
    this.titleContainer = this.container.querySelector('[data-animate-intro="title"]');
    this.titles = this.titleContainer.querySelectorAll('.title');

    this.timeline = null;
    this.touchVp = window.matchMedia('(pointer: coarse)');

    this.init = this.init.bind(this);

    setTimeout(() => {
      resizeObserver.subscribe(this.init);
    }, 100);

    this.init();
  }

  killTimeline() {
    this.timeline.seek(0);
    this.timeline.kill();
    this.timeline = null;
  }

  init() {
    if (this.timeline) {
      this.timeline.seek(0);
      this.timeline.kill();
      this.timeline = null;
    }

    this.timeline = gsap.timeline({paused: true});
    this.timeline.addLabel('start');

    this.titles.forEach((title) => {

      const chars = title.querySelectorAll('.char');
      this.timeline.to(chars, {
        y: () => -Math.abs(title.getBoundingClientRect().bottom - this.titleContainer.getBoundingClientRect().top),
        scale: 0.8,
        x: () => -chars[0].getBoundingClientRect().left / 2 - window.innerWidth / 10,
        ease: 'back.in(2)',
        stagger: {
          amount: chars.length / 50,
        },
      }, `start+=${title.dataset.delay ? title.dataset.delay / 10 : 0}`);
    });

    scrollTrigger.create({
      trigger: this.container,
      scroller: '[data-scroll-container]',
      animation: this.timeline,
      scrub: this.touchVp ? 1.5 : true,
      invalidateOnRefresh: true,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        console.log(self.progress)
      }
    });
  }
}
