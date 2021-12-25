const pageTitle = document.querySelector("title").innerText;

if(pageTitle==="Goal Manager | Home") {
    const form = document.querySelector("form");
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const progress = document.querySelector("progress");
    const progressPoint = document.querySelector(".progress-point");
    let checkboxCnt = checkboxes.length;
    let checkedCnt = document.querySelectorAll("input[checked]").length;
    const remainingTimeSpan = document.querySelector(".daily-container__ramaining-time");
    const previousDaily = document.querySelector(".previous-daily");
    
    function timeFormat(time){
        return String(time).padStart(2, "0");
    }
    
    function countDown(){
        const midNight = new Date();
        midNight.setHours(0, 0, 0, 0);
        midNight.setDate(midNight.getDate() + 1);
        const now = new Date();
        const timeleft = midNight.getTime() - now.getTime();
        const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
        const remaingTime = `${timeFormat(hours)}:${timeFormat(minutes)}:${timeFormat(seconds)}`;
            
        remainingTimeSpan.innerText = remaingTime;
    }
    
    window.onload = function() {
        if(remainingTimeSpan) {
            countDown();
        };
            
        if(progress){
        progress.value=checkedCnt/checkboxCnt*100;
        progressPoint.innerText = `${Math.round(checkedCnt/checkboxCnt*100)}%`;
        };
    }
    
    function changeOnCheckbox(event){
        progress.value=checkedCnt/checkboxCnt*100;
        progressPoint.innerText = `${Math.round(checkedCnt/checkboxCnt*100)}%`;
        const id = event.target.value;
        const td = event.target.parentElement;
        const input = document.createElement("input");
        input.setAttribute("class","hidden");
        input.setAttribute("type","text");
        input.setAttribute("name","changed");
        input.setAttribute("value", id);
        td.appendChild(input);
        form.submit();
    }
    
    function getPreviousDaily(){
        const date = previousDaily.value;
        window.location.href=`daily/${date}`;
    }
    
    
    for(let i=0; i<checkboxes.length; i++){
        checkboxes[i].addEventListener("change", changeOnCheckbox);
    }
    
    previousDaily.addEventListener("change", getPreviousDaily);
    
    if(remainingTimeSpan) {
        setInterval(countDown, 1000);
        
    }
}
