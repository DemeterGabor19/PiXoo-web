import "../scss/main.scss";
import { initHeroParallax } from "./components/hero-parallax.js";
import { initProcessTimeline } from "./components/process-timeline.js";

document.documentElement.classList.add("js-ready");

initHeroParallax();
initProcessTimeline();
