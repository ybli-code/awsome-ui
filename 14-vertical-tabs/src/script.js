document.addEventListener("DOMContentLoaded", function () {
  // Tab functionality
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");
  function switchTab(tabId) {
    // Remove active class from all buttons and panels
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabPanels.forEach((panel) => panel.classList.remove("active"));
    // Add active class to clicked button and corresponding panel
    const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
    const activePanel = document.getElementById(tabId);
    if (activeButton && activePanel) {
      activeButton.classList.add("active");
      activePanel.classList.add("active");
    }
  }
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      switchTab(tabId);
    });
    // Keyboard accessibility
    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const tabId = this.getAttribute("data-tab");
        switchTab(tabId);
      }
    });
  });
  // Toggle switch functionality
  const toggleSwitches = document.querySelectorAll(".toggle-switch");
  toggleSwitches.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      this.classList.toggle("active");

      // Optional: Add some visual feedback
      const toggleName = this.getAttribute("data-toggle");
      const isActive = this.classList.contains("active");
      console.log(`${toggleName}: ${isActive ? "Enabled" : "Disabled"}`);
    });
    // Keyboard accessibility for toggles
    toggle.setAttribute("tabindex", "0");
    toggle.setAttribute("role", "switch");
    toggle.setAttribute("aria-checked", toggle.classList.contains("active"));
    toggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
        this.setAttribute("aria-checked", this.classList.contains("active"));
      }
    });
  });
  // Animate progress bars on panel switch
  function animateProgressBars(panel) {
    const progressBars = panel.querySelectorAll(".progress-fill");
    progressBars.forEach((bar) => {
      const width = bar.style.width;
      bar.style.width = "0%";
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    });
  }
  // Animate stats on panel switch
  function animateStats(panel) {
    const statValues = panel.querySelectorAll(".stat-value");
    statValues.forEach((stat, index) => {
      stat.style.opacity = "0";
      stat.style.transform = "translateY(20px)";
      setTimeout(() => {
        stat.style.transition = "all 0.5s ease";
        stat.style.opacity = "1";
        stat.style.transform = "translateY(0)";
      }, index * 100);
    });
  }
  // Observer for panel changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const panel = mutation.target;
        if (panel.classList.contains("active")) {
          animateProgressBars(panel);
          animateStats(panel);
        }
      }
    });
  });
  tabPanels.forEach((panel) => {
    observer.observe(panel, { attributes: true });
  });
  // Initial animation for the first active panel
  const initialPanel = document.querySelector(".tab-panel.active");
  if (initialPanel) {
    animateProgressBars(initialPanel);
    animateStats(initialPanel);
  }
  // Add hover effect sound simulation (visual feedback)
  tabButtons.forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      this.style.transform = "translateX(4px)";
    });
    btn.addEventListener("mouseleave", function () {
      this.style.transform = "translateX(0)";
    });
  });
});
