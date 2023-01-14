import {scrollTrigger} from "../smooth-scroll/init-scroll-trigger.js";
import {resizeObserver} from "../../utils/observers.js";

export class Marquee {
  constructor() {
    this.container = document.querySelector('[data-marquee]');
    this.inner = this.container.querySelector('.marquee__inner');
    this.item = this.container.querySelector('.marquee__item');
    this.cloneItem = this.item.outerHTML;

    this.clamp = gsap.utils.clamp(-40, 40);
    this.speedScaleTimeout = null;
    this.direction = 1;
    this.marqueeTimeline = null;

    this.init = this.init.bind(this);

    resizeObserver.subscribe(this.init);
    this.init();
  }

  setMarqueeTimeline() {
    this.marqueeTimeline = gsap.timeline({});

    this.marqueeTimeline.to(this.items, {
      duration: 30,
      ease: 'none',
      x: -this.itemWidth,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % this.itemWidth), //force x value to be between 0 and itemWidth using modulus
      },
      repeat: -1,
    }).totalProgress(0.5);
  }

  removeCloneItems() {
    this.items.forEach((item, index) => {
      if (index !== 0) {
        item.remove();
      }
    });
  }

  renderCloneItems() {
    this.itemWidth = this.item.getBoundingClientRect().width;
    const duplicateCount = Math.ceil(window.innerWidth / this.itemWidth);

    for (let i = 0; i < duplicateCount; i++) {
      this.inner.insertAdjacentHTML('beforeend', this.cloneItem);
    }

    this.items = this.container.querySelectorAll('.marquee__item');
  }

  setSpeedScaleTimeout() {
    this.speedScaleTimeout = setTimeout(() => {
      gsap.to(this.marqueeTimeline, {
        timeScale: this.direction,
      });
      // this.marqueeTimeline.timeScale(this.direction);
    }, 100);
  }

  setScrollSpeedScale() {
    this.scrollTrigger = scrollTrigger.create({
      trigger: this.container,
      scroller: '[data-scroll-container]',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        let speedScale = (Math.abs(this.clamp(self.getVelocity() / -10)) + 1) * self.direction;

        gsap.to(this.marqueeTimeline, {
          timeScale: speedScale,
        });

        if (this.speedScaleTimeout) {
          clearTimeout(this.speedScaleTimeout);
        }
        this.direction = self.direction;
        this.setSpeedScaleTimeout();
      },
    });
  }

  init() {
    if (this.marqueeTimeline) {
      this.marqueeTimeline.seek(0).kill();
      this.marqueeTimeline = null;
      this.scrollTrigger.kill();
      this.removeCloneItems();
    }

    this.renderCloneItems();
    this.setMarqueeTimeline();
    this.setScrollSpeedScale();
  }
}
