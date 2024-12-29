let selectedClubId = null;
let selectedUserId = null;
let cause = '';
function applyClub(clubId, userId) {
    selectedClubId = clubId;
    selectedUserId = userId;
    // 顯示確認對話框
    new bootstrap.Modal(document.getElementById('applyModal')).show();
}

document.getElementById('confirmApply').addEventListener('click', async function() {
    //獲取報名原因
    cause = document.getElementById('signup_cause').value
    if (!selectedClubId || !selectedUserId) return;
    
    try {
        const response = await fetch(`/api/club/${selectedClubId}/signUp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: selectedUserId,
                cause: cause
            })
        });

        const data = await response.json();
        
        if (data.success) {
            // 關閉 Modal
            bootstrap.Modal.getInstance(document.getElementById('applyModal')).hide();
            // 重新載入頁面以更新狀態
            location.reload();
        } else {
            alert(data.message || '報名失敗');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('報名過程中發生錯誤');
    }
});