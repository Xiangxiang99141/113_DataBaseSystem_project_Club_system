let selectClubId;
async function settingClub(clubId) {
    const response = await fetch(`/api/club/${clubId}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    //解析回應結果
    response.json().then(result=>{
        if (result.success) {
            selectClubId = clubId
            //設定modal內容
            document.getElementById('clubName').value = result.data.C_name;
            document.getElementById('clubType').value = result.data.C_type;
            document.getElementById('clubIntro').value = result.data.C_intro;
            document.getElementById('clubWeb').value = result.data.C_web;
            document.getElementById('clubQuota').value = result.data.C_quota;
            new bootstrap.Modal(document.getElementById('settingModal')).show();
        }
    });
}

document.getElementById('confirmApply').addEventListener('click',async ()=>{
    let formDataObj = {};
    new FormData(document.getElementById('settingForm')).forEach((value,key)=>{
        formDataObj[key] = value;
    });
    try {
        const response = await fetch(`/api/club/${selectClubId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObj)
        });

        const data = await response.json();
        
        if (data.success) {
            alert('更新成功');
            location.reload();
        } else {
            alert(data.message || '更新失敗');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('更新出錯拉');
    }
});