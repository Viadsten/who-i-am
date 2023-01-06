import {scrollObserver} from "../utils/observers.js";

export class Cursor {
  constructor() {
    this.container = document.querySelector('body');
    if (!this.container) {
      return;
    }

    this.mediaTouchDevice = matchMedia('(pointer: coarse)');
    this.cursor = null;
    this.ease = 0.15;
    this.pos = {x: 0, y: 0};
    this.mouse = {x: 0, y: 0};

    this.clickIsPlaying = false;
    this.circleBtnInView = false;

    this.breakpointChecker = this.breakpointChecker.bind(this);
    this.setListeners = this.setListeners.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.handlerMouseMove = this.handlerMouseMove.bind(this);
    this.clickCursorAnimation = this.clickCursorAnimation.bind(this);
    this.hideCursor = this.hideCursor.bind(this);
    this.showCursor = this.showCursor.bind(this);

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
        gsap.to(this.cursorContent, {scale: ((btnRect.width / cursorRect.width).toFixed(2)), duration: 0.4, ease: 'Power1.out'});
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
        gsap.to(this.cursorContent, {scale: 1, duration: 0.6, ease: 'Power3.out'});
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
      duration: this.circleBtnInView ? 0.15 : 0.35,
      ease: 'Power2.inOut',
      x: this.pos.x,
      y: this.pos.y,
    });
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
    gsap.to(this.cursor, {scale: 0.85, yoyo: true, repeat: 1, ease: 'power1.out', duration: 0.3})
        .then(() => {
          this.clickIsPlaying = false;
        });
  }

  removeListeners() {
    this.cursor.classList.remove('is-initialized');
    gsap.ticker.remove(this.updatePosition);
    document.removeEventListener('mousemove', this.handlerMouseMove);
    window.removeEventListener('click', this.clickCursorAnimation);
  }

  setListeners() {
    this.cursor.classList.add('is-initialized');
    gsap.ticker.add(this.updatePosition);
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
