import * as splitting from './../../vendor/splitting';
import {IntroAnimation} from "./intro-animation.js";
import {HorizontalMyTitles} from "./horizontal-my-titles.js";
import {HorizontalTechnologyTitle} from "./horizontal-technology-title.js";
import {Marquee} from "./marquee.js";
import {TechnologyList} from "./technology-list.js";

export const initAnimationModule = () => {
  const splittingResult = splitting({by: 'chars'});
  const introAnimation = new IntroAnimation();
  const horizontalMyTytles = new HorizontalMyTitles();
  const horizontaalTechnologyTitle = new HorizontalTechnologyTitle();
  new Marquee();
  new TechnologyList();
};
