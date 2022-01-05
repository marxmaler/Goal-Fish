const form = document.querySelector("form");
const checkboxes = document.querySelectorAll("input[type='checkbox']");
const progress = document.querySelector("progress");
const progressPoint = document.querySelector(
  ".daily-container__progress-bar-container__progress-point"
);
let checkboxCnt = checkboxes.length;
let checkedCnt = document.querySelectorAll("input[checked]").length;

window.onload = function () {
  if (progress) {
    progress.value = (checkedCnt / checkboxCnt) * 100;
    progressPoint.innerText = `${Math.round(
      (checkedCnt / checkboxCnt) * 100
    )}%`;
  }
};

function changeOnCheckbox(event) {
  progress.value = (checkedCnt / checkboxCnt) * 100;
  progressPoint.innerText = `${Math.round((checkedCnt / checkboxCnt) * 100)}%`;
  const id = event.target.value;
  const td = event.target.parentElement;
  const input = document.createElement("input");
  input.setAttribute("class", "hidden");
  input.setAttribute("type", "text");
  input.setAttribute("name", "changed");
  input.setAttribute("value", id);
  td.appendChild(input);
  form.submit();
}

for (let i = 0; i < checkboxes.length; i++) {
  checkboxes[i].addEventListener("change", changeOnCheckbox);
}
