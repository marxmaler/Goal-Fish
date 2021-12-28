const pageTitle = document.querySelector("title").innerText;

if(pageTitle==="Goal Manager | Home") {
        
    function timeFormat(time){
        return String(time).padStart(2, "0");
    }

    //daily

    const dailyForm = document.querySelector(".daily-container__form");
    if(dailyForm){ //daily가 있다면
        const dailyProgress = document.querySelector(".daily-container__progress-bar-container__progress-bar");
        const dailyProgressPoint = document.querySelector(".daily-container__progress-bar-container__progress-point");
        
        const dailyTableTbody = document.querySelector(".daily-table__tbody");
        const dailyCheckboxes = document.querySelectorAll(".daily-table__checkbox");
        let dailyCheckboxCnt = dailyCheckboxes.length;
        let dailyCheckedCnt = dailyTableTbody.querySelectorAll("input[checked]").length;
        
        dailyProgress.value=dailyCheckedCnt/dailyCheckboxCnt*100;
        dailyProgressPoint.innerText = `${Math.round(dailyCheckedCnt/dailyCheckboxCnt*100)}%`;

        function dailyChangeOnCheckbox(event){
            dailyProgress.value=dailyCheckedCnt/dailyCheckboxCnt*100;
            dailyProgressPoint.innerText = `${Math.round(dailyCheckedCnt/dailyCheckboxCnt*100)}%`;
            const id = event.target.value;
            const td = event.target.parentElement;
            const input = document.createElement("input");
            input.setAttribute("class","hidden");
            input.setAttribute("type","text");
            input.setAttribute("name","changedDaily");
            input.setAttribute("value", id);
            td.appendChild(input);
            dailyForm.submit();
        }
    
        for(let i=0; i<dailyCheckboxes.length; i++){
            dailyCheckboxes[i].addEventListener("change", dailyChangeOnCheckbox);
        }
    
    
        const dailyRemainingTimeSpan = document.querySelector(".daily-container__ramaining-time");
        
        const previousDaily = document.querySelector(".previous-daily");
        
        function dailyCountDown(){
            const midNight = new Date();
            midNight.setHours(0, 0, 0, 0);
            midNight.setDate(midNight.getDate() + 1);
            const now = new Date();
            const timeleft = midNight.getTime() - now.getTime();
            if(timeleft < 1){
                window.location.href=`/`;
            } 
            const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
            const remaingTime = `${timeFormat(hours)}:${timeFormat(minutes)}:${timeFormat(seconds)}`;
                
            dailyRemainingTimeSpan.innerText = remaingTime;
        }
        
        function getPreviousDaily(){
            const date = previousDaily.value;
            window.location.href=`daily/${date}`;
        }
        
        previousDaily.addEventListener("input", getPreviousDaily);
        
        if(dailyRemainingTimeSpan) {
            dailyCountDown();
            setInterval(dailyCountDown, 1000);
            
        }

    }

    //weekly
    
    const weeklyForm = document.querySelector(".weekly-container__form");
    if(weeklyForm){ //weekly가 있다면
        // 남은 시간
        const weeklyTerm = document.querySelector(".weekly-term").innerText;;
        const termEnd = weeklyTerm.split("~")[1];
        const termEndDate = new Date(termEnd);
        termEndDate.setHours(0, 0, 0, 0);
        const weeklyRemainingTimeSpan = document.querySelector(".weekly-container__ramaining-time");
    
        function weeklyCountDown(){
            const now = new Date();
            const timeleft = termEndDate.getTime() - now.getTime();
            if(timeleft < 1) {
                window.location.href=`/`;
            }
            const days = Math.floor(timeleft / (1000 * 60 * 60 * 24) );
            const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
            const remaingTime = `${timeFormat(days)}:${timeFormat(hours)}:${timeFormat(minutes)}:${timeFormat(seconds)}`;
                
            weeklyRemainingTimeSpan.innerText = remaingTime;
        }
    
        if(weeklyRemainingTimeSpan) {
            weeklyCountDown();
            setInterval(weeklyCountDown, 1000);
        }
    
        // progress
        const weeklyCheckboxes = document.querySelectorAll(".weekly-table__sub-checkbox");
        const weeklyProgress = document.querySelector(".weekly-container__progress-bar-container__progress-bar");
        const weeklyProgressPoint = document.querySelector(".weekly-container__progress-bar-container__progress-point");
        let weeklyCheckboxCnt = weeklyCheckboxes.length;
        const weeklyTableTbody = document.querySelector(".weekly-table__tbody");
        let weeklyCheckedCnt = weeklyTableTbody.querySelectorAll("input[checked].weekly-table__sub-checkbox").length;

        weeklyProgress.value=weeklyCheckedCnt/weeklyCheckboxCnt*100;
        weeklyProgressPoint.innerText = `${Math.round(weeklyCheckedCnt/weeklyCheckboxCnt*100)}%`;
        
        function weeklyChangeOnCheckbox(event){
            weeklyProgress.value=weeklyCheckedCnt/weeklyCheckboxCnt*100;
            weeklyProgressPoint.innerText = `${Math.round(weeklyCheckedCnt/weeklyCheckboxCnt*100)}%`;
            const id = event.target.value;
            const td = event.target.parentElement;
            const input = document.createElement("input");
            input.setAttribute("class","hidden");
            input.setAttribute("type","text");
            input.setAttribute("name","changedWeekly");
            input.setAttribute("value", id);
            td.appendChild(input);
            weeklyForm.submit();
        }
    
        for(let i=0; i<weeklyCheckboxes.length; i++){
            weeklyCheckboxes[i].addEventListener("change", weeklyChangeOnCheckbox);
        }

        // weekly의 inter가 체크될 때
        const weeklyInterCheckboxes = document.querySelectorAll(".weekly-table__inter-checkbox");
        
        function weeklyInterChangeOnCheckbox(event){
            const id = event.target.value;
            const td = event.target.parentElement;
            const input = document.createElement("input");
            input.setAttribute("class","hidden");
            input.setAttribute("type","text");
            input.setAttribute("name","changedWeeklyInter");
            input.setAttribute("value", id);
            td.appendChild(input);
            weeklyForm.submit();
        }
        
        for(let i=0; i<weeklyInterCheckboxes.length; i++){
            weeklyInterCheckboxes[i].addEventListener("change", weeklyInterChangeOnCheckbox)
        }




    }

}
