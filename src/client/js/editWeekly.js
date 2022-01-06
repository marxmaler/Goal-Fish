import { preventSubmit, timeFormat } from "./shared";

let numberOfSubs = 0;
const hiddenSubNumInput = document.querySelector(".sub-num");

// 시작일 & 종료일 조정
const termStart = document.querySelector(".term-start");
const termEnd = document.querySelector(".term-end");

function adjustTermEnd() {
  const termStartValue = termStart.value;
  const aWeekLater = new Date(termStartValue);
  aWeekLater.setDate(aWeekLater.getDate() + 7);
  const year = aWeekLater.getFullYear();
  const month = aWeekLater.getMonth() + 1;
  const date = aWeekLater.getDate();
  termEnd.value = `${year}-${timeFormat(month)}-${timeFormat(date)}`;
}

termStart.addEventListener("change", adjustTermEnd);

//form submit
const form = document.querySelector(".newWeekly__form");
const addSubBtn = document.querySelector(".addSub-btn");
const submitBtn = document.querySelector(".submit-btn");

form.addEventListener("submit", preventSubmit);
addSubBtn.addEventListener("click", addSub);
submitBtn.addEventListener("click", () => {
  manualSubmit(form);
});

// 기존 월간 목표 제거 기능
const oldSubDeleteBtns = document.querySelectorAll(".sub-delete-btn");
function deleteSub(event) {
  const div = document.createElement("div");
  const li = event.target.parentElement.parentElement;
  const select = li.querySelector("select");
  select.remove();
  const input = li.querySelector("input");
  input.setAttribute("name", `deletedSub-${input.name}`);
  const inters = li.querySelector(".weeklySubInter-input-container");
  inters.remove();
  const ul = li.parentElement;
  ul.appendChild(div);
  div.classList.add("hidden");
  div.appendChild(li);
}

for (let i = 0; i < oldSubDeleteBtns.length; i++) {
  oldSubDeleteBtns[i].addEventListener("click", deleteSub);
}

// 새 월간 목표 추가 기능
const subList = document.querySelector(".newWeekly__form__form-container__ul");

function addSub() {
  const subLi = document.createElement("li");
  const liContainer = document.createElement("div");
  const subImp = document.createElement("select");
  const subInput = document.createElement("input");
  const options = ["A", "B", "C"];
  for (let i = 0; i < options.length; i++) {
    const option = document.createElement("option");
    option.value = options[i];
    option.innerText = options[i];
    subImp.appendChild(option);
  }
  const hideBtn = document.createElement("i");
  const addBtn = document.createElement("i");
  const cancelBtn = document.createElement("i");
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
  cancelBtn.classList.add("fas");
  cancelBtn.classList.add("fa-trash-alt");
  cancelBtn.classList.add("sub-delete-btn");
  cancelBtn.addEventListener("click", cancelAddedSub);
  liContainer.appendChild(subImp);
  liContainer.appendChild(subInput);
  liContainer.appendChild(hideBtn);
  liContainer.appendChild(addBtn);
  liContainer.appendChild(cancelBtn);
  subLi.appendChild(liContainer);

  const interContainer = document.createElement("div");
  interContainer.classList.add("weeklySubInter-input-container");
  const ul = document.createElement("ul");
  interContainer.appendChild(ul);
  subLi.appendChild(interContainer);

  subList.appendChild(subLi);
}

//새 월간 목표 제거 기능
function cancelAddedSub(event) {
  const li = event.target.parentElement.parentElement;
  li.remove();
}

//중간 목표 추가 기능
const addInterBtns = document.querySelectorAll(".add-inter-btn");
function addInter(event) {
  const ul = event.target.parentElement.parentElement.querySelector("ul");
  const li = document.createElement("li");
  const input = document.createElement("input");
  input.setAttribute("type", "text");
  const subNum = ul.parentElement.parentElement
    .querySelector(".sub-input")
    .name.replace("sub-", "");
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

for (let i = 0; i < addInterBtns.length; i++) {
  addInterBtns[i].addEventListener("click", addInter);
}

//중간 목표 제거 기능
const removeInterBtns = document.querySelectorAll(".remove-inter-btn");
function removeInter(event) {
  const inputs = event.target.parentElement.querySelectorAll("input");
  const input = inputs[0];
  if (input.name.startsWith("inters")) {
    event.target.parentElement.remove();
  } else {
    input.setAttribute("name", `deletedInter-${input.name}`);
    inputs[1].remove();
    const ul = event.target.parentElement.parentElement;
    const li = event.target.parentElement;
    const div = document.createElement("div");
    ul.appendChild(div);
    div.appendChild(li);

    div.classList.add("hidden"); // 이상하게 li에 hidden을 쓰니 안숨겨져서 div안에 넣고 숨김
  }
}

for (let i = 0; i < removeInterBtns.length; i++) {
  removeInterBtns[i].addEventListener("click", removeInter);
}

//중간 목표 숨기기 기능
const hideInterBtns = document.querySelectorAll(".hide-inter-btn");
function hideInter(event) {
  const i = event.target;
  i.parentElement.parentElement.querySelector("ul").classList.add("hidden");
  i.classList.replace("fa-caret-square-up", "fa-caret-square-down");
  i.removeEventListener("click", hideInter);
  i.addEventListener("click", showInter);
}

for (let i = 0; i < hideInterBtns.length; i++) {
  hideInterBtns[i].addEventListener("click", hideInter);
}

//중간 목표 보이기 기능
function showInter(event) {
  const i = event.target;
  i.parentElement.parentElement.querySelector("ul").classList.remove("hidden");
  i.classList.replace("fa-caret-square-down", "fa-caret-square-up");
  i.removeEventListener("click", showInter);
  i.addEventListener("click", hideInter);
}
