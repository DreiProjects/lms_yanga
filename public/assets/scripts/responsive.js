/**
 * Responsive JavaScript for LMS Yanga
 * This file contains scripts to handle responsive functionality
 */

document.addEventListener("DOMContentLoaded", function () {
  // Add mobile menu toggle button to the DOM
  const mobileMenuToggle = document.createElement("div");
  mobileMenuToggle.className = "mobile-menu-toggle d-none";
  mobileMenuToggle.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  document.body.appendChild(mobileMenuToggle);

  // Get the navbar element
  const navbar = document.querySelector(".main-navbar");

  if (navbar) {
    // Show mobile menu toggle on smaller screens
    if (window.innerWidth <= 991) {
      mobileMenuToggle.classList.remove("d-none");
    }

    // Toggle navbar visibility when mobile menu button is clicked
    mobileMenuToggle.addEventListener("click", function () {
      navbar.classList.toggle("show");

      // Change icon based on menu state
      if (navbar.classList.contains("show")) {
        this.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      } else {
        this.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      }
    });

    // Handle window resize
    window.addEventListener("resize", function () {
      if (window.innerWidth <= 991) {
        mobileMenuToggle.classList.remove("d-none");
      } else {
        mobileMenuToggle.classList.add("d-none");
        navbar.classList.remove("show");
      }
    });
  }

  // Make tables responsive
  const tables = document.querySelectorAll("table:not(.custom-grid-table)");
  tables.forEach(function (table) {
    const wrapper = document.createElement("div");
    wrapper.style.overflowX = "auto";
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });

  // Add touch support for dropdown menus on mobile
  const dropdownTriggers = document.querySelectorAll(".nav-link .main");
  dropdownTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      if (window.innerWidth <= 991) {
        e.preventDefault();
        const subContent = this.parentNode.querySelector(".sub-content");
        if (subContent) {
          subContent.classList.toggle("show-active");
        }
      }
    });
  });

  // Handle form inputs on small screens
  const formGroups = document.querySelectorAll(
    ".form-group input, .form-group textarea"
  );
  formGroups.forEach(function (input) {
    input.addEventListener("focus", function () {
      if (window.innerWidth <= 575) {
        // Scroll to the input when focused on mobile
        setTimeout(() => {
          this.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    });
  });
});
