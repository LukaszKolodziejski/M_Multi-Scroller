class Scroller {
  constructor(rootSelector) {
    const rootElement = document.querySelector(rootSelector);
    this.sections = document.querySelectorAll("section");
    const sectionsArr = [...this.sections];

    const currentSectionIndex = sectionsArr.findIndex(this.isScrolledIntoView);
    // this.currentSectionIndex = currentSectionIndex < 0 ? 0 : currentSectionIndex;
    this.currentSectionIndex = Math.max(currentSectionIndex, 0);
    this.isThrottlet = false;
    this.drawNavigation();
  }

  isScrolledIntoView = el => {
    const rect = el.getBoundingClientRect();
    const elemTop = Math.floor(rect.top);
    const elemBottom = Math.floor(rect.bottom);
    const isVissible = elemTop >= 0 && elemBottom <= window.innerHeight;
    return isVissible;
  };

  listenScroll = e => {
    if (this.isThrottlet) return;
    this.isThrottlet = true;
    setTimeout(() => (this.isThrottlet = false), 1000);
    const direction = e.wheelDelta < 0 ? 1 : -1;
    this.scroll(direction);
  };
  scroll = direction => {
    if (direction === 1) {
      const isLastSection =
        this.currentSectionIndex === this.sections.length - 1;
      if (isLastSection) return;
    } else if (direction === -1) {
      const isFirstSection = this.currentSectionIndex === 0;
      if (isFirstSection) return;
    }
    this.currentSectionIndex += direction;
    this.scrollToCurrentSection();
  };
  scrollToCurrentSection = () => {
    this.selectActiveNavItem();
    this.sections[this.currentSectionIndex].scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
  drawNavigation = () => {
    this.navigationContainer = document.createElement("aside");
    this.navigationContainer.setAttribute("class", "scroller__navigation");
    const list = document.createElement("ul");
    this.sections.forEach((section, index) => {
      const listItem = document.createElement("li");
      listItem.addEventListener("click", () => {
        this.currentSectionIndex = index;
        this.scrollToCurrentSection();
      });
      list.appendChild(listItem);
    });
    this.navigationContainer.appendChild(list);
    document.body.appendChild(this.navigationContainer);
    this.selectActiveNavItem();
  };
  selectActiveNavItem = () => {
    if (this.navigationContainer) {
      const navigationItems = this.navigationContainer.querySelectorAll("li");
      navigationItems.forEach((item, index) => {
        index === this.currentSectionIndex
          ? item.classList.add("active")
          : item.classList.remove("active");
      });
    }
  };
}
