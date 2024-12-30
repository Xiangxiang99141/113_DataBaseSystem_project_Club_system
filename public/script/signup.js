document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const account = document.getElementById('account');
    const name = document.getElementById('name');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');

    // 切換密碼可見性
    function togglePasswordVisibility(inputId, buttonId) {
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);
        button.addEventListener('click', function() {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            button.querySelector('i').classList.toggle('fa-eye');
            button.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    togglePasswordVisibility('password', 'togglePassword');
    togglePasswordVisibility('confirmPassword', 'toggleConfirmPassword');

    // 表單驗證
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        try {
            const formData = new FormData(form);
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            const result = await response.json();

            if (result.success) {
                // 註冊成功，顯示成功訊息並重定向到登入頁面
                alert('註冊成功！請登入。');
                window.location.href = '/login';
            } else {
                // 顯示錯誤訊息
                const alertHtml = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        ${result.message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                form.insertAdjacentHTML('beforebegin', alertHtml);
            }
        } catch (error) {
            console.error('Error:', error);
            const alertHtml = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    註冊時發生錯誤，請稍後再試
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            form.insertAdjacentHTML('beforebegin', alertHtml);
        }
    });

    //即時格式驗證
    //帳號
    account.addEventListener('input',()=>{
        if(account.checkValidity()){
            document.getElementById('account-invalid-feedback').style.display = 'none';
        }else{
            document.getElementById('account-invalid-feedback').style.display = 'block';
        }
    });
    
    //名稱
    name.addEventListener('input',()=>{
        if(name.checkValidity()){
            document.getElementById('name-invalid-feedback').style.display = 'none';
        }else{
            document.getElementById('name-invalid-feedback').style.display = 'block';
        }
    });
    
    //密碼
    password.addEventListener('input',()=>{
        if(password.checkValidity()){
            document.getElementById('pwd-invalid-feedback').style.display = 'none';
        }else{
            document.getElementById('pwd-invalid-feedback').style.display = 'block';
        }
    });
    
    // 即時密碼驗證
    confirmPassword.addEventListener('input', function() {
        if (password.value !== confirmPassword.value) {
            document.getElementById('cofp-invalid-feedback').style.display = 'block';
        } else {
            document.getElementById('cofp-invalid-feedback').style.display = 'none';
        }
    });
    
    //電話
    phone.addEventListener('input',()=>{
        if(phone.checkValidity()){
            document.getElementById('phone-invalid-feedback').style.display = 'none';
        }else{
            document.getElementById('phone-invalid-feedback').style.display = 'block';
        }
    });
    //email
    email.addEventListener('input',()=>{
        if(email.checkValidity()){
            document.getElementById('email-invalid-feedback').style.display = 'none';
        }else{
            document.getElementById('email-invalid-feedback').style.display = 'block';
        }
    });
});