const input = document.getElementById('customFileInput');
  const label = document.getElementById('fileName');

  input.addEventListener('change', function () {
    if (this.files.length > 0) {
      label.textContent = this.files[0].name;
    } else {
      label.textContent = 'اختيار الصورة';
    }
  });