export function initBlogFilters() {
  const filterRoot = document.querySelector("[data-blog-filters]");

  if (!filterRoot) {
    return;
  }

  const buttons = Array.from(filterRoot.querySelectorAll("[data-blog-filter]"));
  const searchInput = document.querySelector("[data-blog-search]");
  const cards = Array.from(document.querySelectorAll("[data-blog-card]"));
  const emptyState = document.querySelector("[data-blog-empty]");
  const pagination = document.querySelector("[data-blog-pagination]");
  let activeFilter = "all";

  const normalize = (value) => value.toLocaleLowerCase("hu-HU").trim();

  const applyFilters = () => {
    const query = normalize(searchInput?.value || "");
    let visibleCount = 0;

    cards.forEach((card) => {
      const categories = card.dataset.blogCategory || "";
      const text = normalize(card.textContent || "");
      const matchesCategory =
        activeFilter === "all" || categories.includes(activeFilter);
      const matchesSearch = !query || text.includes(query);
      const isVisible = matchesCategory && matchesSearch;

      card.hidden = !isVisible;

      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }

    if (pagination) {
      pagination.hidden = activeFilter !== "all" || Boolean(query);
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.blogFilter;

      buttons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });

      applyFilters();
    });
  });

  searchInput?.addEventListener("input", applyFilters);
  applyFilters();
}
