const pageTitle = document.querySelector("title").innerText;

if(pageTitle==="Goal Manager | New Weekly"){

    let numberOfSubs = 1;
    const hiddenSubNumInput = document.querySelector(".sub-num");

    // 시작일 & 종료일 조정
    const termStart = document.querySelector(".term-start");
    const termEnd = document.querySelector(".term-end");

    function timeFormat(time){
        return String(time).padStart(2, "0");
    }

    function adjustTermEnd(){
        const termStartValue = termStart.value;
        const aWeekLater = new Date(termStartValue);
        aWeekLater.setDate(aWeekLater.getDate()+7)
        const year = aWeekLater.getFullYear();
        const month = aWeekLater.getMonth()+1;
        const date = aWeekLater.getDate();
        termEnd.value = `${year}-${timeFormat(month)}-${timeFormat(date)}`
    }

    termStart.addEventListener("change", adjustTermEnd);

    //form submit
    const form = document.querySelector(".newWeekly__form");
    const addSubBtn = document.querySelector(".addSub-btn");
    const submitBtn = document.querySelector(".submit-btn");

    function preventSubmit(event) {
        event.preventDefault();
    };

    function manualSubmit(){
        form.submit();
    }

    form.addEventListener("submit", preventSubmit);
    addSubBtn.addEventListener("click", addSub);
    submitBtn.addEventListener("click", manualSubmit);

    // 새 월간 목표 추가 기능
    const subList = document.querySelector(".newWeekly__form__form-container__ul");

    function addSub(){
        const subLi = document.createElement("li");
        const liContainer = document.createElement("div");
        const subImp = document.createElement("select");
        const subInput = document.createElement("input");
        const options = ["A", "B", "C"];
        for(let i=0; i<options.length; i++){
            const option = document.createElement("option");
            option.value = options[i];
            option.innerText = options[i];
            subImp.appendChild(option);
        }
        const hideBtn = document.createElement("i");
        const addBtn = document.createElement("i");
        liContainer.className = "li__container";
        liContainer.classList.add("weeklySub-input-container");
        subImp.required = "true";
        subInput.type = "text";
        numberOfSubs += 1;
        subImp.setAttribute("name", `importance-${numberOfSubs}`);
        subInput.setAttribute("name", `sub-${numberOfSubs}`);
        hiddenSubNumInput.setAttribute("value", numberOfSubs);
        subInput.required = "true";
        subInput.classList.add("sub-input");
        hideBtn.classList.add("fas");
        hideBtn.classList.add("fa-caret-square-up");
        hideBtn.classList.add("hide-inter-btn");
        hideBtn.addEventListener("click", hideInter);
        addBtn.classList.add("fas");
        addBtn.classList.add("fa-plus-square");
        addBtn.classList.add("add-inter-btn");
        addBtn.addEventListener("click", addInter);
        liContainer.appendChild(subImp);
        liContainer.appendChild(subInput);
        liContainer.appendChild(hideBtn);
        liContainer.appendChild(addBtn);
        subLi.appendChild(liContainer);
        
        const interContainer = document.createElement("div");
        interContainer.classList.add("weeklySubInter-input-container");
        const ul = document.createElement("ul");
        interContainer.appendChild(ul);
        subLi.appendChild(interContainer);

        subList.appendChild(subLi);
    };

    //중간 목표 추가 기능
    const addInterBtn = document.querySelector(".add-inter-btn");
    function addInter(event){
        const ul = event.target.parentElement.parentElement.querySelector("ul")
        const li = document.createElement("li");
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        const subNum = ul.parentElement.parentElement.querySelector(".sub-input").name.replace("sub-","");
        input.setAttribute("name", `inters-${subNum}`);
        input.setAttribute("required", "true");
        const i = document.createElement("i");
        i.classList.add("fas");
        i.classList.add("fa-minus-square");
        i.classList.add("remove-inter-btn");
        i.addEventListener("click", removeInter);
        li.appendChild(input);
        li.appendChild(i);
        ul.appendChild(li);
    }

    addInterBtn.addEventListener("click", addInter);

    //중간 목표 제거 기능
    const removeInterBtn = document.querySelector(".remove-inter-btn");
    function removeInter(event){
        event.target.parentElement.remove();
    }
    removeInterBtn.addEventListener("click", removeInter);

    //중간 목표 숨기기 기능
    const hideInterBtn = document.querySelector(".hide-inter-btn");
    function hideInter(event){
        const i = event.target;
        i.parentElement.parentElement.querySelector("ul").classList.add("hidden");
        i.classList.replace("fa-caret-square-up", "fa-caret-square-down");
        i.removeEventListener("click", hideInter);
        i.addEventListener("click", showInter);
    }

    hideInterBtn.addEventListener("click", hideInter);

    //중간 목표 보이기 기능
    function showInter(event){
        const i = event.target;
        i.parentElement.parentElement.querySelector("ul").classList.remove("hidden");
        i.classList.replace("fa-caret-square-down", "fa-caret-square-up");
        i.removeEventListener("click", showInter);
        i.addEventListener("click", hideInter);
    }

}