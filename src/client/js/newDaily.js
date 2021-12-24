const pageTitle = document.querySelector("title").innerText;

if(pageTitle==="Goal Manager | New Daily"){
    const form = document.querySelector(".newDaily__form");
    const subList = document.querySelector(".newDaily__form__ul");
    const addSubBtn = document.querySelector(".addSub-btn");
    const submitBtn = document.querySelector(".submit-btn");
    const unfinished = document.querySelectorAll(".unfinished");
    window.onload = function() {
        let loadUnfinished = false;
        if(unfinished.length > 0){
            loadUnfinished = window.confirm("어제의 세운 목표 중 완수하지 못한 목표가 있습니다. 불러오시겠습니까?");
        }
        if(loadUnfinished){
            for(let i=0; i<unfinished.length; i++){
                unfinished[i].style.display="list-item";
            }
        }else{
            for(let i=0; i<unfinished.length; i++){
                unfinished[i].remove();
            }  
        }
    }
    function preventSubmit(event) {
        event.preventDefault();
    };
    
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
        liContainer.className = "li__container"
        subImp.name = "importances";
        subImp.required = "true";
        subInput.type = "text";
        subInput.name = "subs";
        subInput.required = "true";
        liContainer.appendChild(subImp);
        liContainer.appendChild(subInput);
        subLi.appendChild(liContainer);
        subList.appendChild(subLi);
    };
    
    function manualSubmit(){
        form.submit();
    }
    
    form.addEventListener("submit", preventSubmit);
    addSubBtn.addEventListener("click", addSub);
    submitBtn.addEventListener("click", manualSubmit);

}
