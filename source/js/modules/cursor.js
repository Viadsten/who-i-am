import {scrollObserver} from '../utils/observers.js';

export class Cursor {
  constructor() {
    this.container = document.querySelector('body');
    if (!this.container) {
      return;
    }

    this.mediaTouchDevice = matchMedia('(pointer: coarse)');
    this.cursor = null;
    this.scaleTimeline = null;
    this.ease = 0.15;
    this.pos = {x: 0, y: 0};
    this.mouse = {x: 0, y: 0};
    this.posPrev = {x: 0, y: 0};
    this.movementPos = {x: 0, y: 0};
    this.direction = {x: 0, y: 0};
    this.speed = {
      max: 0,
      prev: 0,
      maxPositiveAcc: 0,
      maxNegativeAcc: 0,
    };

    this.clickIsPlaying = false;
    this.circleBtnInView = false;

    this.breakpointChecker = this.breakpointChecker.bind(this);
    this.setListeners = this.setListeners.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.calculateVelocity = this.calculateVelocity.bind(this);
    this.handlerMouseMove = this.handlerMouseMove.bind(this);
    this.clickCursorAnimation = this.clickCursorAnimation.bind(this);
    this.hideCursor = this.hideCursor.bind(this);
    this.showCursor = this.showCursor.bind(this);
    this.setPosPrev = this.setPosPrev.bind(this);
    this.setSkewTransform = this.setSkewTransform.bind(this);

    this.init();
  }

  renderCursor() {
    return this.container.insertAdjacentHTML('beforeend', this.cursorTemplate());
  }

  cursorTemplate() {
    return (
      `<div class="cursor">
        <span class="cursor__content">
        </span>
      </div>`
    );
  }

  calculateVelocity() {
    const movementPos = {
      x: Math.abs(this.pos.x - this.posPrev.x),
      y: Math.abs(this.pos.y - this.posPrev.y),
    };
    this.movementPos = {x: movementPos.x, y: movementPos.y};
    this.movement = Math.sqrt(movementPos.x * movementPos.x + movementPos.y * movementPos.y);
  }

  setSkewTransform() {
    if (this.circleBtnInView) {
      return;
    }

    const skew = {
      x: gsap.utils.clamp(0, 30, this.movementPos.x * 0.25),
      y: gsap.utils.clamp(0, 30, this.movementPos.y * 0.25),
    };

    const skewRotate = (this.direction.x === 1 && this.direction.y === 1) || (this.direction.x === -1 && this.direction.y === -1) ? 1 : -1;
    const height = 100 + gsap.utils.clamp(0, 40, this.movementPos.y - this.movementPos.x) - gsap.utils.clamp(0, 20, this.movementPos.x - this.movementPos.y);
    const width = 100 + gsap.utils.clamp(0, 40, this.movementPos.x - this.movementPos.y) - gsap.utils.clamp(0, 20, this.movementPos.y - this.movementPos.x);

    const skewValue = gsap.utils.clamp(-20, 20, skew.x * skew.y * skewRotate);

    gsap.to(this.cursorContent, {
      duration: 0.005,
      ease: 'Power1.inOut',
      // transform: `skewX(${skewValue}deg)  skewY(${0}deg) translate3d(-50%, -50%, 0)`,
      skewX: skewValue,
      skewY: 0,
      height: height + '%',
      width: width + '%',
    });
  }

  setPosPrev() {
    this.posPrev = {
      x: this.pos.x,
      y: this.pos.y,
    };
  }

  handlerMouseMove(evt) {
    if (evt && evt.type === 'mousemove') {
      this.evt = evt;
    } else if (!this.evt && !evt) {
      return;
    }

    const btnCircle = this.evt.target.closest('[data-cursor-btn="circle"]');
    if (btnCircle) {
      const btnRect = btnCircle.getBoundingClientRect();
      const cursorRect = this.cursor.getBoundingClientRect();
      if (!this.circleBtnInView) {
        if (this.scaleTimeline) {
          this.scaleTimeline.kill();
        }

        this.scaleTimeline = gsap.to(this.cursorContent, {
          scale: ((btnRect.width / cursorRect.width).toFixed(2) - 0.3),
          duration: 0.3,
          skewX: 0,
          skewY: 0,
          width: '100%',
          height: '100%',
          ease: 'Power1.out',
          overwrite: true,
        });
        this.circleBtnInView = true;
      }

      const pos = {
        x: (btnRect.left + btnRect.width / 2),
        y: (btnRect.top + btnRect.height / 2),
      };

      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
    } else {
      if (this.circleBtnInView) {
        if (this.scaleTimeline) {
          this.scaleTimeline.kill();
        }

        this.scaleTimeline = gsap.to(this.cursorContent, {scale: 1, duration: 0.6, ease: 'Power3.out'});
        this.circleBtnInView = false;
      }

      this.mouse.x = this.evt.clientX;
      this.mouse.y = this.evt.clientY;
    }
  }

  updatePosition() {
    this.pos.x += (this.mouse.x - this.pos.x) * this.ease;
    this.pos.y += (this.mouse.y - this.pos.y) * this.ease;

    gsap.to(this.cursor, {
      duration: this.circleBtnInView ? 0.15 : 0.15,
      ease: 'Power2.inOut',
      x: this.pos.x,
      y: this.pos.y,
    });

    this.direction = {
      x: gsap.utils.clamp(1, -1, this.posPrev.x - this.pos.x),
      y: gsap.utils.clamp(1, -1, this.posPrev.y - this.pos.y),
    };
  }

  hideCursor() {
    this.cursor.classList.remove('is-shown');
    this.cursor.classList.remove('has-text');
  }

  showCursor() {
    this.cursor.classList.add('is-shown');
  }

  clickCursorAnimation() {
    if (this.clickIsPlaying) {
      return;
    }
    this.handlerMouseMove();
    this.clickIsPlaying = true;
    gsap.to(this.cursor, {scale: 0.85, yoyo: true, repeat: 1, ease: 'power1.out', duration: 0.15, overwrite: true})
        .then(() => {
          this.clickIsPlaying = false;
        });
  }

  removeListeners() {
    this.cursor.classList.remove('is-initialized');
    gsap.ticker.remove(this.updatePosition);
    gsap.ticker.remove(this.calculateVelocity);
    clearInterval(this.posPrev.interval);
    document.removeEventListener('mousemove', this.handlerMouseMove);
    window.removeEventListener('click', this.clickCursorAnimation);
  }

  setListeners() {
    this.cursor.classList.add('is-initialized');
    gsap.ticker.add(this.updatePosition);
    gsap.ticker.add(this.calculateVelocity);
    gsap.ticker.add(this.setSkewTransform);
    this.posPrev.interval = setInterval(this.setPosPrev, 10);
    document.addEventListener('mousemove', this.handlerMouseMove);
    window.addEventListener('click', this.clickCursorAnimation);
    scrollObserver.subscribe(() => this.handlerMouseMove());
  }

  breakpointChecker() {
    if (this.mediaTouchDevice.matches) {
      if (this.cursor.classList.contains('is-initialized')) {
        this.removeListeners();
      }
    } else {
      if (!this.cursor.classList.contains('is-initialized')) {
        this.setListeners();
      }
    }
  }

  init() {
    this.renderCursor();

    this.cursor = this.container.querySelector('.cursor');
    this.cursorContent = this.cursor.querySelector('.cursor__content');

    this.breakpointChecker();
    this.mediaTouchDevice.addListener(this.breakpointChecker);
  }
}
