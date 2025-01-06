
//沒有會回傳null
let InsuranceForm = document.getElementById('SignupFormInsurance'); //保險表單
let TransportForm = document.getElementById('SignupFormTransport'); //交通表單
let courseSignupForm = document.getElementById('courseSignupFormHeader');


//是否已成年選單
let adultSelect = document.getElementById('adult'); 
//國籍選單
let nationality = document.getElementById('nationality');
//緊急聯絡人姓名與電話
let liaison = document.getElementById('liaison');
let liaisonPhone = document.getElementById('liaisonPhone');
//英文姓名
let EnglishName = document.getElementById('EnglishName');
//護照或居留證正反面
let idcardImgFront = document.getElementById('idcardImgFront');
let idcardImgObverse = document.getElementById('idcardImgObverse');


function signupCourse(ClubId,CourseId){
    let InsuranceFormData;
    let TransportFormData;
    let mainFomrData = new FormData(courseSignupForm);
    
    if(InsuranceForm == null){
        InsuranceFormData = false;
        mainFomrData.append('useinsurance',false)
    }else{
        InsuranceFormData = new FormData(InsuranceForm);
        mainFomrData.append('useinsurance',true)
        InsuranceFormData.forEach((value,key)=>{
            mainFomrData.append(key,value);
        });
    }
    if(TransportForm == null){
        TransportFormData = false;
        mainFomrData.append('usetransport',false)
    }else{
        TransportFormData = new FormData(TransportForm);
        mainFomrData.append('usetransport',true)
        TransportFormData.forEach((value,key)=>{
            mainFomrData.append(key,value);
        });
    }
    
    fetch(`/api/club/${ClubId}/course/signup/${CourseId}`,{
        method:'POST',
        body:mainFomrData,
        
    }).then(response=>{
        if(response.ok){
            response.json().then(result=>{
                if(result.success==true){
                    alert('報名成功');
                    location.href = '/club/course' ;
                };
            });
        }
    });
}