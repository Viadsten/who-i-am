import * as splitting from './../../vendor/splitting';
import {IntroAnimation} from "./intro-animation.js";
import {HorizontalMyTitles} from "./horizontal-my-titles.js";
import {HorizontalTechnologyTitle} from "./horizontal-technology-title.js";

export const initAnimationModule = () => {
  const splittingResult = splitting({by: 'chars'});
  const introAnimation = new IntroAnimation();
  const horizontalMyTytles = new HorizontalMyTitles();
  const horizontaalTechnologyTitle = new HorizontalTechnologyTitle();
};