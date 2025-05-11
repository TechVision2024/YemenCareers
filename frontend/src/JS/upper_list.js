// انتظر حتى يتم إدراج الهيدر بالكامل في الصفحة قبل تفعيل الأحداث عليه
setTimeout(() => {
  const menuToggle = document.getElementById("menu-toggle");
  const menuClose = document.getElementById("menu-close");
  const mobileMenu = document.getElementById("mobile-menu");
  const backdrop = document.getElementById("backdrop");
  const accountBtns = document.querySelectorAll("#account-menu-button");
  const accountMenu = document.getElementById("account-dropdown");
  const dropdownIcon = document.getElementById("dropdown-icon");

  function openMenu() {
    mobileMenu.classList.remove("-translate-x-full");
    mobileMenu.classList.add("translate-x-0");
    backdrop.classList.remove("hidden");
  }

  function closeMenu() {
    mobileMenu.classList.remove("translate-x-0");
    mobileMenu.classList.add("-translate-x-full");
    backdrop.classList.add("hidden");
  }

  if (menuToggle && menuClose && mobileMenu && backdrop) {
    menuToggle.addEventListener("click", openMenu);
    menuClose.addEventListener("click", closeMenu);
    backdrop.addEventListener("click", closeMenu);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });

  // القائمة المنسدلة لحساب المستخدم
  if (accountBtns.length && accountMenu && dropdownIcon) {
    accountBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        accountMenu.classList.toggle("hidden");
        dropdownIcon.classList.toggle("rotate-180");
      });
    });

    window.addEventListener("click", () => {
      accountMenu.classList.add("hidden");
      dropdownIcon.classList.remove("rotate-180");
    });

    accountMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
}, 100);
