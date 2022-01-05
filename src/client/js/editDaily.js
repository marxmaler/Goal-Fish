const form = document.querySelector("form");
const subList = document.querySelector("ul");
const addSubBtn = document.querySelector(".addSub-btn");
const submitBtn = document.querySelector(".submit-btn");
const deleteBtns = document.querySelectorAll(".deleteBtn");

for (let i = 0; i < deleteBtns.length; i++) {
  deleteBtns[i].addEventListener("click", hideDeleted);
}

function hideDeleted(event) {
  const li = event.target.parentElement;
  const id = li.querySelector("input").name;
  li.setAttribute("class", "hidden");
  while (li.firstChild) {
    li.removeChild(li.lastChild);
  }
  const hiddenInput = document.createElement("input");
  hiddenInput.setAttribute("name", "deletedSubs");
  hiddenInput.setAttribute("value", id);
  li.appendChild(hiddenInput);
}

function preventSubmit(event) {
  event.preventDefault();
}

function formSubmit() {
  form.submit();
}

function cancelAdd(event) {
  const subLi = event.target.parentElement;
  subLi.remove();
}

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
  liContainer.className = "li__container";
  subImp.name = "newImps";
  subImp.required = "true";
  subInput.type = "text";
  subInput.name = "newSubs";
  subInput.required = "true";
  const cancelBtn = document.createElement("i");
  cancelBtn.classList.add("fas");
  cancelBtn.classList.add("fa-trash-alt");
  cancelBtn.addEventListener("click", cancelAdd);
  liContainer.appendChild(subImp);
  liContainer.appendChild(subInput);
  liContainer.appendChild(cancelBtn);
  subLi.appendChild(liContainer);
  subList.appendChild(subLi);
}

form.addEventListener("submit", preventSubmit);
addSubBtn.addEventListener("click", addSub);
submitBtn.addEventListener("click", formSubmit);
