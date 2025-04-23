document.addEventListener("DOMContentLoaded", () => {
  // قراءة التفضيل من localStorage أو تفعيل dark إذا النظام يفضل ذلك
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = storedTheme === "dark" || (!storedTheme && prefersDark);

  // تطبيق الوضع المخزن في localStorage أو تفضيل النظام
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // في صفحة home.html، إذا كان هناك زر لتغيير الوضع:
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  // تحقق إذا كان الزر موجودًا في الصفحة (مثل home.html)
  if (themeToggle && themeIcon) {
    themeToggle.addEventListener("click", () => {
      // تغيير الوضع وإضافة/إزالة الفئة dark
      const isDarkNow = document.documentElement.classList.toggle("dark");

      // حفظ التفضيل في localStorage
      localStorage.setItem("theme", isDarkNow ? "dark" : "light");

      // تبديل الأيقونات بين القمر والشمس
      themeIcon.classList.toggle("fa-moon", !isDarkNow);
      themeIcon.classList.toggle("fa-sun", isDarkNow);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const backArrow = document.getElementById("backArrow");
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = storedTheme === "dark" || (!storedTheme && prefersDark);

  if (isDark) {
    document.documentElement.classList.add("dark");
    if (backArrow) {
      backArrow.src = "/src/Images/arrow-light.svg";
    }
  } else {
    document.documentElement.classList.remove("dark");
    if (backArrow) {
      backArrow.src = "/src/Images/arrow-dark.svg";
    }
  }
});
