

function toggleTheme() {
const root = document.documentElement;
const isDark = root.classList.toggle("dark");
localStorage.theme = isDark ? "dark" : "light";
}

const toggleBtn = document.getElementById('menu-toggle');
const closeBtn = document.getElementById('menu-close');
const mobileNav = document.getElementById('mobile-nav');
const accountToggle = document.getElementById('account-toggle-mobile');
const accountMenu = document.getElementById('account-menu-mobile');

toggleBtn.addEventListener('click', () => {
    mobileNav.classList.remove('-translate-x-full');
});

closeBtn.addEventListener('click', () => {
    mobileNav.classList.add('-translate-x-full');
});

accountToggle.addEventListener('click', () => {
    accountMenu.classList.toggle('hidden');
});
    
// التحقق من الحقول عند الضغط على زر النشر
document.querySelector('#submit-button')?.addEventListener('click', function(event) {
    const title = document.querySelector('#job-title')?.value.trim();
    const name = document.querySelector('#name')?.value.trim();
    const jobType = document.querySelector('#job-type')?.value.trim();
    const date = document.querySelector('#job-date')?.value.trim();
    const city = document.querySelector('#city')?.value.trim();
    const link = document.querySelector('#apply-link')?.value.trim();
    const description = document.querySelector('#description')?.value.trim();
    
    // التحقق من الحقول الفارغة
        if (!title || !name || !jobType || !date || !city || !link || !description) {
            alert('يرجى تعبئة جميع الحقول قبل النشر.');
            event.preventDefault();
            return;
        }
        
        // التحقق من صحة الرابط
        const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;
            if (!urlPattern.test(link)) {
                alert('يرجى إدخال رابط تقديم صالح.');
                event.preventDefault();
                return;
        }
        
        alert('تم التحقق بنجاح! يمكنك الآن إرسال النموذج.');
        // هنا يمكنك إرسال البيانات للسيرفر 
        });
        
        // القائمة المنسدلة لحساب المستخدم
        const toggle = document.getElementById('account-toggle');
        const menu = document.getElementById('account-menu');
        
        toggle?.addEventListener('click', () => {
            menu?.classList.toggle('hidden');
        });
        
        // إغلاق القائمة عند النقر خارجها
        window.addEventListener('click', function (e) {
            if (!toggle?.contains(e.target) && !menu?.contains(e.target)) {
                menu?.classList.add('hidden');
            }
        });
        
        // تفعيل الوضع الليلي بناءً على التفضيل المخزن أو إعداد النظام
        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
            ) {
            document.documentElement.classList.add("dark");
        } else  {
            document.documentElement.classList.remove("dark");
        }

        function openJobDeleteModal() {
            document.getElementById("job-delete-modal").classList.remove("hidden");
        }

        function closeJobDeleteModal() {
            document.getElementById("job-delete-modal").classList.add("hidden");
        }

        function confirmJobDelete() {
        // هنا يتم تنفيذ عملية الحذف الفعلية
        alert("تم حذف الوظيفة!");
        closeJobDeleteModal();
        }

        function togglePasswordVisibility() {
            const passwordInput = document.getElementById("password-input");
            const toggleIcon = document.getElementById("toggle-password");
            const isHidden = passwordInput.type === "password";

            passwordInput.type = isHidden ? "text" : "password";
            toggleIcon.classList.toggle("bx-hide");
            toggleIcon.classList.toggle("bx-show");
        }

        function togglePassword() {
            const passwordInput = document.getElementById("password");
            const currentType = passwordInput.getAttribute("type");
            passwordInput.setAttribute("type", currentType === "password" ? "text" : "password");
        }