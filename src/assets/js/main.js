import "../scss/main.scss";
import { initAdditionalServicesReveal } from "./components/additional-services-reveal.js";
import { initAboutReveal } from "./components/about-reveal.js";
import { initBenefitsReveal } from "./components/benefits-reveal.js";
import { initFeaturesReveal } from "./components/features-reveal.js";
import { initHeroParallax } from "./components/hero-parallax.js";
import { initNavbar } from "./components/navbar.js";
import { initProcessTimeline } from "./components/process-timeline.js";
import { initBlogFilters } from "./pages/blog.js";
import { initContactForm } from "./pages/contact.js";
import { initPricingConfigurator } from "./pages/pricing.js";
import { initReferencesShowcase } from "./pages/references.js";

document.documentElement.classList.add("js-ready");

initNavbar();
initHeroParallax();
initFeaturesReveal();
initAdditionalServicesReveal();
initBenefitsReveal();
initAboutReveal();
initProcessTimeline();
initReferencesShowcase();
initPricingConfigurator();
initContactForm();
initBlogFilters();
