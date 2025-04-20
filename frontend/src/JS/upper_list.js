//للقائمة الكبيرة
const menuToggle = document.getElementById("menu-toggle");
const menuClose = document.getElementById("menu-close");
const mobileMenu = document.getElementById("mobile-menu");
const backdrop = document.getElementById("backdrop");

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

menuToggle.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);
backdrop.addEventListener("click", closeMenu);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMenu();
  }
});

// للقائمة الصغيرة
// const accountBtn = document.getElementById("account-menu-button");
// const accountMenu = document.getElementById("account-dropdown");

// accountBtn.addEventListener("click", (e) => {
//   e.stopPropagation();
//   accountMenu.classList.toggle("hidden");
// });

// window.addEventListener("click", () => {
//   accountMenu.classList.add("hidden");
// });