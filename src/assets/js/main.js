import "../scss/main.scss";
import { initHeroParallax } from "./components/hero-parallax.js";
import { initNavbar } from "./components/navbar.js";
import { initReferencesShowcase } from "./pages/references.js";

document.documentElement.classList.add("js-ready");

const runWhenIdle = (callback) => {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: 1200 });
    return;
  }

  window.setTimeout(callback, 120);
};

initNavbar();
initHeroParallax();
initReferencesShowcase();

runWhenIdle(async () => {
  const [
    { initAdditionalServicesReveal },
    { initAboutReveal },
    { initBenefitsReveal },
    { initFeaturesReveal },
    { initProcessTimeline },
    { initBlogFilters },
    { initContactForm },
    { initPricingConfigurator },
    { initMobileCardReveal },
    { initWebsiteAuditReveal },
  ] = await Promise.all([
    import("./components/additional-services-reveal.js"),
    import("./components/about-reveal.js"),
    import("./components/benefits-reveal.js"),
    import("./components/features-reveal.js"),
    import("./components/process-timeline.js"),
    import("./pages/blog.js"),
    import("./pages/contact.js"),
    import("./pages/pricing.js"),
    import("./components/mobile-card-reveal.js"),
    import("./pages/website-audit-reveal.js"),
  ]);

  initFeaturesReveal();
  initAdditionalServicesReveal();
  initBenefitsReveal();
  initAboutReveal();
  initProcessTimeline();
  initPricingConfigurator();
  initContactForm();
  initBlogFilters();
  initWebsiteAuditReveal();
  initMobileCardReveal();
});
