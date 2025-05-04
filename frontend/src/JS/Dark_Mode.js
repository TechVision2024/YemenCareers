document.addEventListener("DOMContentLoaded", () => {
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = storedTheme === "dark" || (!storedTheme && prefersDark);

  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");


  function updateIcon(dark) {
    // أضف التأثيرات مباشرة
    themeIcon.style.opacity = "0";
    themeIcon.style.transform = "rotate(180deg) scale(1.2)";
  
    setTimeout(() => {
      // غيّر الصورة بعد جزء من الثانية
      themeIcon.src = dark ? "/src/Images/sun.svg" : "/src/Images/moon.svg";
      themeIcon.alt = dark ? "Sun Icon" : "Moon Icon";
  
      // استرجاع الحالة الطبيعية
      themeIcon.style.opacity = "1";
      themeIcon.style.transform = "rotate(0deg) scale(1)";
    }, 200); // 200ms هي المهلة قبل تغيير الصورة
  }

  // تطبيق الوضع والرمز عند تحميل الصفحة
  document.documentElement.classList.toggle("dark", isDark);
  updateIcon(isDark);

  // عند الضغط على الزر
  if (themeToggle && themeIcon) {
    themeToggle.addEventListener("click", () => {
      const isDarkNow = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDarkNow ? "dark" : "light");
      updateIcon(isDarkNow);
    });
  }
});


//تغيير زر الرجوع في الوضع المظلم
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
