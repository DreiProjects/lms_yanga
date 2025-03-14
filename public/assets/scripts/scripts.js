import {
  HideShowComponent,
  ResetActiveComponent,
  SetActiveComponent,
  ToggleComponentClass,
} from "./modules/component/Tool.js";
import {
  FloatingContainer,
  POSITIONS,
} from "./classes/components/FloatingContainer.js";

function manageNavbar() {
  const navbar = document.querySelector(".main-navbar");
  const rightHeader = document.querySelector(".flex-container");
  const links = navbar.querySelectorAll(".nav-link-items .nav-link");
  const navButtonProfile = document.querySelector(".profile-container-link");
  const userMenu = document.querySelector(".user-menu");

  const float = new FloatingContainer(
    {
      name: "global/profileButtonContent",
    },
    {
      margin: { left: -100 },
      place: true,
      excepts: [navButtonProfile],
      disableClickOutside: false,
      onShow: () => {
        // Add active class to profile button when menu is shown
        navButtonProfile.classList.add("active");
      },
      onHide: () => {
        // Remove active class from profile button when menu is hidden
        navButtonProfile.classList.remove("active");
      },
    }
  );

  const getCurrentActive = () => {
    const path = window.location.pathname;
    const splited = path.split("/").filter((a) => a);
    return "/" + splited[0];
  };

  const showViaPath = (path) => {
    for (const link of links) {
      const sublink = link.querySelector(".sub-content");

      if (sublink) {
        const isLPath = sublink.getAttribute("data-path") === path;

        if (isLPath) {
          ResetActiveComponent(links);
          SetActiveComponent(link, isLPath);
        }

        ToggleComponentClass(
          sublink,
          "show-active",
          isLPath ? !sublink.classList.contains("show-active") : false
        );
      }
    }
  };

  for (const link of links) {
    link.querySelector(".main").addEventListener("click", function () {
      const sublink = link.querySelector(".sub-content");

      if (sublink) {
        showViaPath(sublink.getAttribute("data-path"));
      }
    });
  }

  // Handle profile menu click
  navButtonProfile.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    // Toggle the active class
    navButtonProfile.classList.toggle("active");

    // Toggle the show class on the menu
    userMenu.classList.toggle("show");
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!navButtonProfile.contains(e.target)) {
      navButtonProfile.classList.remove("active");
      userMenu.classList.remove("show");
    }
  });

  // Handle menu item clicks
  const menuItems = document.querySelectorAll(".user-menu .menu-item");
  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      // Allow the default link behavior
      e.stopPropagation();

      // Hide the menu after a short delay to allow the link to work
      setTimeout(() => {
        navButtonProfile.classList.remove("active");
        userMenu.classList.remove("show");
      }, 100);
    });
  });

  // Close menu on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      navButtonProfile.classList.remove("active");
      userMenu.classList.remove("show");
    }
  });

  showViaPath(getCurrentActive());
}

function init() {
  manageNavbar();
}

init();
