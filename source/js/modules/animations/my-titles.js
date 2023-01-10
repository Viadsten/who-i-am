import {scrollTrigger} from "../smooth-scroll/init-scroll-trigger.js";

export class MyTitles {
  constructor(containerTimeline) {
    this.container = document.querySelector('[data-animate-my-titles]');

    if (!this.container) {
      return;
    }

    this.titles = this.container.querySelectorAll('.title');

    this.containerTimeline = containerTimeline;

    this.init();
  }

  killTimelines() {
    this.timeline.seek(0);
    this.timeline.kill();
    this.timeline = null;

    this.bgTimeline.seek(0);
    this.bgTimeline.kill();
    this.bgTimeline = null;
  }

  init() {
    if (this.timeline || this.bgTimeline) {
      this.killTimelines();
    }

    this.timeline = gsap.timeline({paused: true});

    this.timeline.to(['[data-animate-my-titles="frontend"]', '[data-animate-my-titles="developer"]'], {
      x: 0,
    }, 0);

    scrollTrigger.create({
      trigger: this.container,
      scroller: '[data-scroll-container]',
      containerAnimation: this.containerTimeline,
      start: 'left left',
      end: 'right right',
      scrub: true,
      animation: this.timeline,
      invalidateOnRefresh: true,
    });

    // after horizontal

    this.bgTimeline = gsap.timeline({paused: true});
    this.bgTimeline.to(['[data-animate-my-titles="developer"] .title', '[data-animate-my-titles="frontend"] .title'], {
      x: 0,
    }, 0);

    this.bgTimeline.to('[data-animate-bg]', {
      clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)',
    }, 0);

    scrollTrigger.create({
      scroller: '[data-scroll-container]',
      trigger: '[data-animate-horizontal="my-titles"]',
      start: () => `top top-=${window.innerHeight * 2}`,
      end: () => `+=${window.innerHeight * 2}`,
      animation: this.bgTimeline,
      scrub: true,
      invalidateOnRefresh: true,
    });

  }
}
