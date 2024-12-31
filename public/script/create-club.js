
const form = document.getElementById('createClubForm')

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });

    try {
        const response = await fetch('/api/club/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObj)
        });

        const data = await response.json();
        
        if (data.success) {
            window.location.href = '/'; // 創建成功後重定向到首頁
        } else {
            alert(data.message || '創建失敗');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('創建過程中發生錯誤');
    }
});

// URL 格式驗證
document.getElementById('clubWeb').addEventListener('input', function(e) {
    if (e.target.value && !e.target.value.match(/^https?:\/\/.+/)) {
        this.classList.add('is-invalid');
        e.target.setCustomValidity('請輸入完整網址，包含 http:// 或 https://');
    } else {
        this.classList.remove('is-invalid');
        e.target.setCustomValidity('');
    }
});

// 社團介紹字數限制
document.getElementById('clubIntro').addEventListener('input', function() {
    const intro_invalid_feedback = document.getElementById('intro-invalid-feedback');
    if (this.value.length > 50) {
        this.classList.add('is-invalid');
        intro_invalid_feedback.style.display = 'block';
    }else{
        this.classList.remove('is-invalid');
        intro_invalid_feedback.style.display = 'none';
    }; 
});
