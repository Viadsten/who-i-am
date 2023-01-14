import * as splitting from './../../vendor/splitting';
import {HorizontalMyTitles} from "./horizontal-my-titles.js";
import {HorizontalTechnologyTitle} from "./horizontal-technology-title.js";
import {Marquee} from "./marquee.js";
import {TechnologyList} from "./technology-list.js";
import {IntroTitle} from "./intro-title.js";
import {Cursor} from "./cursor.js";

export const initAnimationModule = () => {
  const splittingResult = splitting({by: 'chars'});
  const horizontalMyTytles = new HorizontalMyTitles();
  const horizontaalTechnologyTitle = new HorizontalTechnologyTitle();
  new Marquee();
  new TechnologyList();
  new IntroTitle();
  new Cursor();
};
