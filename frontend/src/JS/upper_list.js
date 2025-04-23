// للقائمة الكبيرة والصغيرة
document.addEventListener("DOMContentLoaded", () => {
  const waitForHeader = setInterval(() => {
    const menuToggle = document.getElementById("menu-toggle");
    const menuClose = document.getElementById("menu-close");
    const mobileMenu = document.getElementById("mobile-menu");
    const backdrop = document.getElementById("backdrop");
    const accountBtn = document.getElementById("account-menu-button");
    const accountMenu = document.getElementById("account-dropdown");
    const dropdownIcon = document.getElementById("dropdown-icon"); // ← السهم

    // if (menuToggle && menuClose && mobileMenu && backdrop && accountBtn && accountMenu && dropdownIcon) {
    if (menuToggle && menuClose && mobileMenu && backdrop) {
      clearInterval(waitForHeader); // وقف الانتظار

      // فتح القائمة الجانبية
      function openMenu() {
        mobileMenu.classList.remove("-translate-x-full");
        mobileMenu.classList.add("translate-x-0");
        backdrop.classList.remove("hidden");
      }

      // إغلاق القائمة الجانبية
      function closeMenu() {
        mobileMenu.classList.remove("translate-x-0");
        mobileMenu.classList.add("-translate-x-full");
        backdrop.classList.add("hidden");
      }

      menuToggle.addEventListener("click", openMenu);
      menuClose.addEventListener("click", closeMenu);
      backdrop.addEventListener("click", closeMenu);

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeMenu();
        }
      });

      // تشغيل القائمة المنسدلة للمستخدم
      if (accountBtn && accountMenu) {
        accountBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          accountMenu.classList.toggle("hidden");
          dropdownIcon.classList.toggle("rotate-180");
        });

        window.addEventListener("click", () => {
          accountMenu.classList.add("hidden");
          dropdownIcon.classList.remove("rotate-180");
        });

        // منع الإغلاق عند الضغط داخل القائمة نفسها
        accountMenu.addEventListener("click", (e) => {
          e.stopPropagation();
        });
      }
    }
  }, 100);
});
