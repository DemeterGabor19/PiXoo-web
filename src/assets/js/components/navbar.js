export function initNavbar() {
  const header = document.querySelector(".site-header");

  if (!header) {
    return;
  }

  const toggle = header.querySelector(".site-header__toggle");
  const links = [...header.querySelectorAll(".site-header__menu a")];
  const currentPath = normalizePath(window.location.pathname);
  const isReferencesPage = [
    "/references.html",
    "/references",
    "/referenciak",
  ].some((path) => currentPath.endsWith(path));

  header.classList.toggle("is-pinned", isReferencesPage);
  setActiveNavLink(links);

  const closeMenu = () => {
    header.classList.remove("is-menu-open");
    toggle?.setAttribute("aria-expanded", "false");
  };

  toggle?.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-menu-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  let lastScrollY = window.scrollY;
  let isTicking = false;

  const updateHeader = () => {
    const currentScrollY = window.scrollY;
    const isScrolled = currentScrollY > 24;
    const isScrollingDown = currentScrollY > lastScrollY;
    const isMenuOpen = header.classList.contains("is-menu-open");

    header.classList.toggle("is-scrolled", isScrolled || isReferencesPage);

    if (!isReferencesPage) {
      header.classList.toggle(
        "is-hidden",
        isScrolled && isScrollingDown && !isMenuOpen
      );
    }

    if (!isScrolled) {
      header.classList.remove("is-hidden");
    }

    lastScrollY = currentScrollY;
    isTicking = false;
  };

  const scheduleHeaderUpdate = () => {
    if (isTicking) {
      return;
    }

    isTicking = true;
    window.requestAnimationFrame(updateHeader);
  };

  updateHeader();
  window.addEventListener("scroll", scheduleHeaderUpdate, { passive: true });
  window.addEventListener("resize", closeMenu);
}

function setActiveNavLink(links) {
  const currentPath = normalizePath(window.location.pathname);

  links.forEach((link) => {
    const linkPath = normalizePath(link.pathname);
    const isActive =
      linkPath === currentPath ||
      (currentPath === "/index.html" && linkPath === "/");

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function normalizePath(pathname) {
  if (pathname === "/" || pathname === "") {
    return "/";
  }

  return pathname.replace(/\/$/, "");
}
