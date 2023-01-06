import {scrollTrigger} from "../smooth-scroll/init-scroll-trigger.js";

export class Marquee {
  constructor() {
    this.container = document.querySelector('[data-marquee]');
    this.inner = this.container.querySelector('.marquee__inner');
    this.item = this.container.querySelector('.marquee__item');
    this.cloneItem = this.item.outerHTML;

    this.clamp = gsap.utils.clamp(-20, 20);
    this.speedScaleTimeout = null;
    this.direction = 1;

    this.init();
  }

  setMarqueeTimeline() {
    this.marqueeTimeline = gsap.timeline({});

    this.marqueeTimeline.to(this.items, {
      duration: 20,
      ease: "none",
      x: -this.itemWidth,
      // modifiers: {
      //   x: gsap.utils.unitize(x => parseFloat(x) % this.itemWidth) //force x value to be between 0 and itemWidth using modulus
      // },
      repeat: -1,
    }).totalProgress(0.5);
  }

  renderCloneItems() {
    this.itemWidth = this.item.getBoundingClientRect().width;
    const duplicateCount = Math.ceil(window.innerWidth / this.itemWidth);

    for (let i = 0; i < duplicateCount; i++) {
      this.inner.insertAdjacentHTML('beforeend', this.cloneItem)
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
    scrollTrigger.create({
      trigger: this.container,
      scroller: '[data-scroll-container]',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        let speedScale = (Math.abs(this.clamp(self.getVelocity() / -100)) + 1) * self.direction;

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
    this.renderCloneItems();
    this.setMarqueeTimeline();
    this.setScrollSpeedScale();
  }
}
