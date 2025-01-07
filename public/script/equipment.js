let selectClubId;
// 顯示器材詳細資訊
function showEquipmentDetails(id, clubId) {
    fetch(`/api/club/${clubId}/equipment/${id}`).
    then(response => {
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        response.json().then(data => {
            let equipment = data.data
            document.getElementById('detailName').textContent = equipment.Ce_name;
            document.getElementById('detailQuantity').textContent = equipment.Ce_count;
            document.getElementById('detailSpec').textContent = equipment.Ce_spec;
            document.getElementById('detailSource').textContent = equipment.Ce_source;
            document.getElementById('detailAdmin').textContent = equipment.Member.M_name
            document.getElementById('detailReport').textContent = equipment.Member.M_name;
            document.getElementById('detailUse').textContent = equipment.Ce_use;
            if(equipment.Ce_img != null){
                document.getElementById('detailImage').src = equipment.Ce_img;
            }else{
                document.getElementById('detailImage').style.display = 'none';
            }
        });
        
        new bootstrap.Modal(document.getElementById('equipmentDetailsModal')).show();   
    }).catch(error => {
        console.error('Error:', error);
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${error.message || '取得器材詳細資訊時發生錯誤'}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        document.querySelector('.container').insertAdjacentHTML('afterbegin', alertHtml);
    });

    
}
async function createEquipment(id){
    selectClubId = id;
    new bootstrap.Modal(addEquipmentModal).show();
} 
// 新增器材
document.getElementById('createEquipmentBtn').addEventListener('click', async function() {
    try {
        const form = document.getElementById('addEquipmentForm');
        const formData = new FormData(form);

        // 檢查必填欄位
        const requiredFields = ['name', 'quantity', 'spec', 'use', 'source', 'admin'];
        for (const field of requiredFields) {
            if (!formData.get(field)) {
                throw new Error(`${field} 是必填欄位`);
            }
        }

        // 檢查數量是否為正數
        const quantity = parseInt(formData.get('quantity'));
        if (isNaN(quantity) || quantity <= 0) {
            throw new Error('數量必須大於 0');
        }

        // 如果沒有選擇日期，使用當前日期
        if (!formData.get('date')) {
            formData.set('date', new Date().toISOString().split('T')[0]);
        }

        const response = await fetch(`/api/club/${selectClubId}/equipment?type=equipment`, {
            method: 'POST', // 已經使用form data，所以不需要設定content-type
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

        if (result.success) {
            bootstrap.Modal.getInstance(document.getElementById('addEquipmentModal')).hide();
            
            const alertHtml = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    器材新增成功
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            document.querySelector('.container').insertAdjacentHTML('afterbegin', alertHtml);

            location.reload();
        } else {
            throw new Error(result.message || '新增失敗');
        }
    } catch (error) {
        console.error('Error:', error);
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${error.message || '新增器材時發生錯誤'}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        document.querySelector('.container').insertAdjacentHTML('afterbegin', alertHtml);
        alert(error.message);
    }
});

// 預覽圖片
document.getElementById('equipmentPhoto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB
            alert('圖片大小不能超過 5MB');
            this.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewDiv = document.getElementById('photoPreview');
            const previewImg = previewDiv.querySelector('img');
            previewImg.src = e.target.result;
            previewDiv.classList.remove('d-none');
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById('previewBtn').addEventListener('click', function() {
    document.getElementById('equipmentPhoto').click();
});

// 清除 Modal 表單和預覽圖
document.getElementById('addEquipmentModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById('addEquipmentForm').reset();
    const previewDiv = document.getElementById('photoPreview');
    previewDiv.classList.add('d-none');
    previewDiv.querySelector('img').src = '';
});