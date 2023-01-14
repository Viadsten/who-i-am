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
    this.touchVp = window.matchMedia('(pointer: coarse)');
    this.mediaOrientationPortret = () => (window.innerWidth - window.innerHeight < 0) ? true : false; // custom)

    this.init = this.init.bind(this);
    this.calculateHeight = this.calculateHeight.bind(this);

    resizeObserver.subscribe(this.init);

    this.init();
  }

  calculateHeight() {
    this.height = this.mediaOrientationPortret()
      ? window.innerHeight * 4 + this.content.getBoundingClientRect().width
      : window.innerWidth * 3 + this.content.getBoundingClientRect().width;
    this.container.style.height = this.height + 'px';

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

    this.myTitles = new MyTitles(this.timeline, this.height);
  }

  init() {
    if (this.timeline || this.hideTimeline) {
      this.killTimeline();
    }
    this.calculateHeight();

    this.timeline = gsap.to(this.content, {
      x: () => window.innerWidth - this.content.getBoundingClientRect().width,
      ease: 'none',
    });

    console.log(this.mediaOrientationPortret());
    scrollTrigger.create({
      trigger: this.container,
      scroller: '[data-scroll-container]',
      start: this.mediaOrientationPortret() ? `top top+=${0}px` : 'top top',
      end: () => `+=${(this.height) / 4}`,
      animation: this.timeline,
      scrub: this.touchVp ? 1 : true,
      invalidateOnRefresh: true,
    });

    this.hideTimeline = gsap.to(this.titleContainer, {
      x: () => `-=${window.innerWidth * 2}`,
      ease: 'linear',
      paused: true,
    });

    if (!this.mediaOrientationPortret()) {
      scrollTrigger.create({
        trigger: this.container,
        scroller: '[data-scroll-container]',
        start: () => `top top-=${this.height / 2}`,
        end: () => `+=${this.height / 4}`,
        animation: this.hideTimeline,
        scrub: this.touchVp ? 1 : true,
        invalidateOnRefresh: true,
      });
    }

    this.initHorizontalAnimations();
  }
}
