import "../scss/main.scss";
import { initAdditionalServicesReveal } from "./components/additional-services-reveal.js";
import { initAboutReveal } from "./components/about-reveal.js";
import { initBenefitsReveal } from "./components/benefits-reveal.js";
import { initFeaturesReveal } from "./components/features-reveal.js";
import { initHeroParallax } from "./components/hero-parallax.js";
import { initProcessTimeline } from "./components/process-timeline.js";

document.documentElement.classList.add("js-ready");

initHeroParallax();
initFeaturesReveal();
initAdditionalServicesReveal();
initBenefitsReveal();
initAboutReveal();
initProcessTimeline();
