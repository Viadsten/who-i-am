import {ScrollLock} from "../utils/scroll-lock.js";

export class Loader {
  constructor() {
    this.сontainer = document.querySelector('.preloader');

    if (!this.сontainer) {
      return;
    }

    this.scrollLock = new ScrollLock();
    this.event = new Event('loaderOff');
    this.pageLoaded = false;

    this.off = this.off.bind(this);
    this.hide = this.hide.bind(this);

    this.init();
  }

  hide() {
    const timeline = gsap.timeline({
      onComplete: () => {
        this.сontainer.classList.add('is-hidden');
      },
    });
    timeline.to('.preloader__bg', {
      rotateX: -93.5,
      duration: 0.45,
      borderBottomRightRadius: 50,
      borderBottomLeftRadius: 50,
      stagger: {
        each: 0.1,
        from: 'end',
      },
    });
    timeline.to('.preloader__bg', {
      duration: 0.1,
      delay: 0.35,
      opacity: 0,
      stagger: {
        each: 0.1,
        from: 'end',
      },
    }, 0).then(this.off);
  }

  on() {

  }

  off() {
    this.pageLoaded = true;
    this.scrollLock.enableScrolling();
    window.scrollTo(0, 0);
    window.dispatchEvent(this.event);
  }

  init() {
    window.addEventListener('fontLoaded', this.hide);
  }
}
