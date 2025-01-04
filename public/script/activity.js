function addActivity(clubId){
    let form = document.getElementById('addActivityForm');
    let formData = new FormData(form);
    if(document.getElementById('insurance').checked){
        formData.set('insurance', '1');
    }else{
        formData.set('insurance', '0');
    }
    if(document.getElementById('transportation').checked){
        formData.set('transportation', '1');
    }else{  
        formData.set('transportation', '0');
    }
    console.log(formData);
    
    fetch(`/api/club/${clubId}/activity?type=activity`, {
        method: 'POST', // 已經使用form data，所以不需要設定content-type
        body: formData
    }).then(response=>{
        response.json().then(data=>{
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            if(data.success){
                location.reload();
            }
        })
        
    });
}