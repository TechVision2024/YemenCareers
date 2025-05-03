// اسماء الأعمدة
document.addEventListener("DOMContentLoaded", function () {
  fetch("/src/JSON/field-labels.json")
    .then((res) => res.json())
    .then((labels) => {
      document.querySelectorAll(".field-label").forEach((el) => {
        const key = el.getAttribute("data-key");
        if (labels[key]) {
          el.textContent = labels[key];
        }
      });
    })
    .catch((error) => console.error("فشل في تحميل بيانات الحقول:", error));
});

// تحديد الكل
const selectAllCheckboxes = document.querySelectorAll(".select-all-checkbox");
const jobCheckboxes = document.querySelectorAll(".jobCheckbox");

selectAllCheckboxes.forEach((selectAllCheckbox) => {
  selectAllCheckbox.addEventListener("change", function () {
    jobCheckboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  });
});

// تحديث حالة "تحديد الكل" تلقائيًا
jobCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    const allChecked = [...jobCheckboxes].every((cb) => cb.checked);
    selectAllCheckboxes.forEach((selectAllCheckbox) => {
      selectAllCheckbox.checked = allChecked;
    });
  });
});

