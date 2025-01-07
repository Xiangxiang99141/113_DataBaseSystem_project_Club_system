// 獲取成員列表
function getmemberlist(){
    let select = document.getElementById('userSelect');
    for(i=0;i<=select.options.length;i++){
        select.remove(i);
    };
    fetch('/api/members',{
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        }
    }).then(response=>{
        if(response.ok){
            response.json().then(data=>{
                const select = document.getElementById('userSelect');
                data.data.forEach(member => {
                    option = document.createElement('option');
                    option.value = member.M_id;
                    option.text = member.M_name;
                    select.add(option);
                });
                new bootstrap.Modal(document.getElementById('addMemberModal')).show();
            });
        }
    })
}
function addMember(id){
    let formDataObj = {};
    const form = document.getElementById('addMemberForm');
    const formData = new FormData(form);
    formData.forEach((value,key)=>{
        formDataObj[key] = value;
    });
    fetch(`/api/club/${id}/member`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify(formDataObj)
    }).then(response=>{
        if(response.ok){
            response.json().then(data=>{
                if(data.success){
                    window.location.reload();
                }else{
                    alert(data.message);
                }
            });
        }
    });
}
