document.addEventListener('DOMContentLoaded', function() {
    // 類型篩選
    document.getElementById('typeFilter').addEventListener('change', function() {
        const selectedType = this.value;
        const rows = document.querySelectorAll('#historicalDataTable tbody tr');
        
        rows.forEach(row => {
            const typeCell = row.querySelector('td:first-child');
            if (selectedType === '' || typeCell.textContent === selectedType) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // // 新增資料表單提交
    // document.getElementById('historicalDataForm').addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     // 這裡應該加入 AJAX 提交邏輯
    //     // 將表單資料發送到後端 API
    // });
});


function addHistory(clubId){

}