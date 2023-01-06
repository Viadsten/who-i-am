import {scrollTrigger} from "../smooth-scroll/init-scroll-trigger.js";
import {resizeObserver} from "../../utils/observers.js";
import {MyTitles} from "./my-titles.js";

export class HorizontalMyTitles {
  constructor() {
    this.container = document.querySelector('[data-animate-horizontal="my-titles"]');

    if (!this.container) {
      return;
    }

    this.content = this.container.querySelector('.horizontal-section__container');
    this.titleContainer = this.container.querySelector('[data-animate-my-titles]');

    this.timeline = null;
    this.touchVp = window.matchMedia('(pointer: coarse');

    this.init = this.init.bind(this);
    this.calculateHeight = this.calculateHeight.bind(this);

    resizeObserver.subscribe(this.init);
  }

  calculateHeight() {
    this.container.style.height = window.innerHeight * 4 + this.content.getBoundingClientRect().width + 'px';
  }

  killTimeline() {
    this.hideTimeline.kill();
    this.hideTimeline = null;

    this.timeline.kill();
    this.timeline = null;

    gsap.set(this.content, {clearProps: 'transform'});
    gsap.set(this.titleContainer, {clearProps: 'transform'});

  }

  initHorizontalAnimations() {
    if (this.myTitles) {
      this.myTitles.killTimelines();
      this.myTitles = null;
    }

    this.myTitles = new MyTitles(this.timeline);
  }

  init() {
    this.calculateHeight();
    if (this.timeline || this.hideTimeline) {
      this.killTimeline();
    }

    this.timeline = gsap.to(this.content, {
      x: () => window.innerWidth - this.content.getBoundingClientRect().width,
      ease: 'none',
    });

    scrollTrigger.create({
      trigger: this.container,
      scroller: '[data-scroll-container]',
      start: 'top top',
      end: () => window.innerHeight * 4,
      animation: this.timeline,
      scrub: this.touchVp ? 1 : true,
      invalidateOnRefresh: true,
    });

    this.hideTimeline = gsap.to(this.titleContainer, {
      x: () => `-=${window.innerWidth * 1.5}`,
    });
    //
    scrollTrigger.create({
      trigger: this.container,
      scroller: '[data-scroll-container]',
      start: () => `top top-=${window.innerHeight * 4}`,
      end: () => `+=${window.innerHeight * 2.5}`,
      animation: this.hideTimeline,
      scrub: this.touchVp ? 1 : true,
      invalidateOnRefresh: true,
    });

    this.initHorizontalAnimations();
  }
}
