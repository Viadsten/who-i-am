import * as splitting from './../../vendor/splitting';
import {IntroAnimation} from "./intro-animation.js";
import {HorizontalSection} from "./horizontal-section.js";

export const initAnimationModule = () => {
  const splittingResult = splitting({by: 'chars'});
  const introAnimation = new IntroAnimation();
  const horizontalAbout = new HorizontalSection();

};
