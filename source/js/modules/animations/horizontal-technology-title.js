import {resizeObserver} from "../../utils/observers.js";
import {MyTitles} from "./my-titles.js";
import {scrollTrigger} from "../smooth-scroll/init-scroll-trigger.js";

export class HorizontalTechnologyTitle {
  constructor() {
    this.container = document.querySelector('[data-animate-horizontal="technology-title"]');

    if (!this.container) {
      return;
    }

    this.content = this.container.querySelector('.horizontal-section__container');
    this.title = this.container.querySelector('[data-animate-technology-title]');
    this.titleChars = this.title.querySelectorAll('.char');

    this.timeline = null;
    this.touchVp = window.matchMedia('(pointer: coarse)');
    this.mediaOrientationPortret = () => (window.innerWidth - window.innerHeight < 0) ? true : false; // custom)

    this.randomDirection = gsap.utils.random([-1, 1], true);
    this.randomOffset = gsap.utils.random(window.innerHeight / 3, window.innerHeight / 8, 1, true);
    this.randomScale = gsap.utils.random(0.3, 0.85, 0, true);

    this.init = this.init.bind(this);
    this.calculateHeight = this.calculateHeight.bind(this);

    resizeObserver.subscribe(this.init);

    this.init();
  }

  calculateHeight() {
    this.height = this.mediaOrientationPortret()
      ? window.innerHeight * 5 + this.content.getBoundingClientRect().width
      : this.content.getBoundingClientRect().width;
    this.container.style.height = this.height + 'px';
  }

  killTimeline() {
    this.timeline.kill();
    this.timeline = null;

    gsap.set(this.content, {clearProps: 'transform'});

    this.titleTimeline.seek(0).kill();
    this.titleTimeline = null;
  }

  init() {
    this.calculateHeight();
    // console.log(this.height)
    if (this.timeline || this.titleTimeline) {
      this.killTimeline();
    }

    this.timeline = gsap.to(this.content, {
      x: () => -this.content.getBoundingClientRect().width - window.innerWidth / 10,
      ease: 'none',
    });

    scrollTrigger.create({
      trigger: this.container,
      scroller: '[data-scroll-container]',
      start: 'top top',
      end: 'bottom bottom',
      animation: this.timeline,
      scrub: this.touchVp ? 1 : true,
      invalidateOnRefresh: true,
    });

    this.titleTimeline = gsap.timeline({paused: true});


    this.titleChars.forEach((char) => {
      const charDirection = this.randomDirection();
      gsap.set(char, {
        y: this.randomOffset() * charDirection,
        scale: this.randomScale(),
        rotateX: charDirection * 45,
        opacity: 0,
      });
    });

    this.titleTimeline.to(this.titleChars, {
      opacity: 1,
      ease: 'power2.out',
      stagger: 0.1,
    }, 0);

    this.titleTimeline.to(this.titleChars, {
      y: 0,
      scale: 1,
      rotateX: 0,
      ease: 'back.inOut(3.5)',
      stagger: 0.1,
    }, 0);

    scrollTrigger.create({
      trigger: '[data-animate-technology-title] .title',
      scroller: '[data-scroll-container]',
      start: 'left 90%',
      end: 'right center',
      animation: this.titleTimeline,
      containerAnimation: this.timeline,
      scrub: this.touchVp ? 1 : true,
      invalidateOnRefresh: true,
    });
  }
}
