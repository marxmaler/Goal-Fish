import {
  getAMonthLater,
  getAWeekLater,
  getAYearLater,
} from "../../functions/time";

export function manualSubmit(form) {
  form.submit();
}

export function preventSubmit(event) {
  event.preventDefault();
}

export function timeFormat(time) {
  return String(time).padStart(2, "0");
}

export function formSubmit(form) {
  form.submit();
}

export function addSub(ul) {
  const li = document.createElement("li");
  const impNCntBox = document.createElement("div");
  const impSelect = document.createElement("select");
  const cntInput = document.createElement("input");
  const impSelectOptions = ["A", "B", "C"];
  for (let i = 0; i < impSelectOptions.length; i++) {
    const option = document.createElement("option");
    option.value = impSelectOptions[i];
    option.innerText = impSelectOptions[i];
    impSelect.appendChild(option);
  }
  impNCntBox.classList.add("li__container");
  impNCntBox.classList.add("importance-and-content-setting-box");
  impSelect.name = "importances";
  impSelect.required = "true";
  cntInput.type = "text";
  cntInput.name = "subs";
  cntInput.required = "true";
  impNCntBox.appendChild(impSelect);
  impNCntBox.appendChild(cntInput);

  const cancelBtn = document.createElement("i");
  cancelBtn.classList.add("fas");
  cancelBtn.classList.add("fa-trash-alt");
  cancelBtn.addEventListener("click", cancelAdd);
  impNCntBox.appendChild(cancelBtn);
  li.appendChild(impNCntBox);
  ul.appendChild(li);

  const measureBox = document.createElement("div");
  measureBox.classList.add("li__container");
  measureBox.classList.add("measurement-setting-box");

  const useMeasureBox = document.createElement("div");
  const useMeasureSpan = document.createElement("span");
  useMeasureSpan.innerText = "단위 사용:";
  const useMeasureInput = document.createElement("input");
  useMeasureInput.setAttribute("type", "checkbox");
  useMeasureInput.setAttribute("name", "useMeasures");
  useMeasureInput.classList.add(
    "measurement-setting-box__use-measurement-checkbox"
  );
  useMeasureInput.addEventListener("click", showOrHideMeasureSettings);
  useMeasureBox.appendChild(useMeasureSpan);
  useMeasureBox.appendChild(useMeasureInput);
  measureBox.appendChild(useMeasureBox);

  const measureNameBox = document.createElement("div");
  measureNameBox.className = "hidden";
  const measureNameSpan = document.createElement("span");
  measureNameSpan.innerText = "단위명:";
  const measureNameSelect = document.createElement("select");
  measureNameSelect.name = "measureNames";
  const measureNameOptions = ["시간", "회", "개", "쪽"];
  for (let i = 0; i < measureNameOptions.length; i++) {
    const option = document.createElement("option");
    option.value = measureNameOptions[i];
    option.innerText = measureNameOptions[i];
    measureNameSelect.appendChild(option);
  }
  measureNameBox.appendChild(measureNameSpan);
  measureNameBox.appendChild(measureNameSelect);

  const targetValueBox = document.createElement("div");
  targetValueBox.className = "hidden";
  const targetValueSpan = document.createElement("span");
  targetValueSpan.innerText = "목표 달성 요구치:";
  const targetValueInput = document.createElement("input");
  targetValueInput.setAttribute("type", "number");
  targetValueInput.setAttribute("name", "targetValues");
  targetValueInput.setAttribute("min", "0");
  targetValueInput.setAttribute("max", "9999");
  targetValueInput.classList.add("measurement-setting-box__targetValue");
  targetValueBox.appendChild(targetValueSpan);
  targetValueBox.appendChild(targetValueInput);

  const eachAsIndependBox = document.createElement("div");
  eachAsIndependBox.className = "hidden";
  const eachAsIndependSpan = document.createElement("span");
  eachAsIndependSpan.innerText = "각 단위를 단일 목표로 간주:";
  const eachAsIndependInput = document.createElement("input");
  eachAsIndependInput.setAttribute("type", "checkbox");
  eachAsIndependInput.setAttribute("name", "eachAsIndepend");
  eachAsIndependBox.appendChild(eachAsIndependSpan);
  eachAsIndependBox.appendChild(eachAsIndependInput);

  measureBox.appendChild(measureNameBox);
  measureBox.appendChild(targetValueBox);
  measureBox.appendChild(eachAsIndependBox);
  li.appendChild(measureBox);
  ul.appendChild(li);
}

export const handlePlus = (event, goalType, progressControlObj) => {
  const measureInput =
    event.target.parentElement.querySelector("input[type=number]");
  if (parseInt(measureInput.value, 10) === parseInt(measureInput.max, 10)) {
    return;
  }
  if (measureInput.value === "") {
    measureInput.value = 1;
    return;
  }
  measureInput.value = parseInt(measureInput.value, 10) + 1;
  changeOnMeasureNoEvent(measureInput, goalType, progressControlObj);
};

export const handleMinus = (event, goalType, progressControlObj) => {
  const measureInput =
    event.target.parentElement.querySelector("input[type=number]");
  if (parseInt(measureInput.value, 10) === 0) {
    return;
  }
  if (measureInput.value === "") {
    measureInput.value = 0;
    return;
  }

  measureInput.value = parseInt(measureInput.value, 10) - 1;
  changeOnMeasureNoEvent(measureInput, goalType, progressControlObj);
};

export function checkUnreflected(measureBoxes) {
  for (let i = 0; i < measureBoxes.length; i++) {
    const value = measureBoxes[i].value;
    const max = measureBoxes[i].max;
    const checkbox = measureBoxes[
      i
    ].parentElement.parentElement.parentElement.querySelector(
      "input[type=checkbox]"
    );
    if (
      (value === max && !checkbox.checked) ||
      (value < max && checkbox.checked)
    ) {
      checkbox.click();
    }
  }
}

export function cancelAdd(event) {
  const subLi = event.target.parentElement.parentElement;
  subLi.remove();
}

export const showOrHideMeasureSettings = (event) => {
  const measurementSettingBox = event.target.parentElement.parentElement;
  const hiddenSettings = measurementSettingBox.querySelectorAll(".hidden");
  if (hiddenSettings.length > 0) {
    for (let i = 0; i < hiddenSettings.length; i++) {
      hiddenSettings[i].classList.remove("hidden");
    }
  } else {
    const divs = measurementSettingBox.querySelectorAll("div");
    for (let i = 1; i < divs.length; i++) {
      divs[i].classList.add("hidden");
    }
  }
};

export const formatMeasureSettingDatas = () => {
  const useMeasureCheckboxes = document.querySelectorAll(
    "input[name=useMeasures]"
  );
  for (let i = 0; i < useMeasureCheckboxes.length; i++) {
    useMeasureCheckboxes[i].setAttribute("value", `${i}`);
    const measurementSettingBox =
      useMeasureCheckboxes[i].parentElement.parentElement;
    const eachAsIndependCheckBox = measurementSettingBox.querySelector(
      "input[name=eachAsIndepend]"
    );
    if (eachAsIndependCheckBox.checked === true) {
      eachAsIndependCheckBox.value = i;
    }
    const targetValue = measurementSettingBox.querySelector(
      ".measurement-setting-box__targetValue"
    ).value;

    if (!(useMeasureCheckboxes[i].checked && targetValue > 0)) {
      while (measurementSettingBox.firstChild) {
        measurementSettingBox.removeChild(measurementSettingBox.lastChild);
      }
    }
  }
};

export function changeOnMeasure(event, goalType, progressControlObj) {
  const { id } = event.target.dataset;
  const { value, max } = event.target;
  fetch(`/api/${goalType}/measure/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  const checkbox =
    event.target.parentElement.parentElement.parentElement.querySelector(
      "input[type=checkbox]"
    );

  checkbox.classList.contains("ind-check")
    ? calculateProgress(progressControlObj)
    : null;
  if (
    (parseInt(value, 10) === parseInt(max, 10) && !checkbox.checked) ||
    (parseInt(value, 10) < parseInt(max, 10) && checkbox.checked)
  ) {
    checkbox.click();
  }
}

//같은 함수 event handler가 아닌 버젼
export function changeOnMeasureNoEvent(
  measureInput,
  goalType,
  progressControlObj
) {
  const { id } = measureInput.dataset;
  const { value, max } = measureInput;
  fetch(`/api/${goalType}/measure/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  const checkbox =
    measureInput.parentElement.parentElement.parentElement.querySelector(
      "input[type=checkbox]"
    );

  checkbox.classList.contains("ind-check")
    ? calculateProgress(progressControlObj)
    : null;

  if (
    (parseInt(value, 10) === parseInt(max, 10) && !checkbox.checked) ||
    (parseInt(value, 10) < parseInt(max, 10) && checkbox.checked)
  ) {
    checkbox.click();
  }
}

export const calculateProgress = ({
  progress,
  progressPoint,
  checkboxCnt,
  indCheckboxes,
}) => {
  let checkedCnt = document.querySelectorAll("input[checked]").length;
  let indCheckedCnt = 0;
  let targetTotal = 0;
  let currentTotal = 0;
  for (let i = 0; i < indCheckboxes.length; i++) {
    indCheckboxes[i].checked ? indCheckedCnt++ : null;
    const tr = indCheckboxes[i].parentElement.parentElement;
    const measureValInput = tr.querySelector("input[type=number]");
    targetTotal += parseInt(measureValInput.max, 10);
    currentTotal += parseInt(measureValInput.value, 10);
  }

  checkedCnt -= indCheckedCnt;
  const progVal =
    ((checkedCnt + currentTotal) / (checkboxCnt + targetTotal)) * 100;
  progress.value = progVal;
  progressPoint.innerText = `${Math.round(progVal)}%`;
};

export function changeOnCheckbox(event, progressControlObj, goalType) {
  const checkbox = event.target;
  const tr = checkbox.parentElement.parentElement;
  const textTd = tr.querySelectorAll("td")[2];

  //checkbox에 checked attr 명시적으로 추가/제거(count할 수 있게)
  if (checkbox.checked) {
    checkbox.setAttribute("checked", "");
  } else {
    checkbox.removeAttribute("checked");
  }

  calculateProgress(progressControlObj);

  //완수한 목표에 줄 그어주기(혹은 줄긋기 취소)
  if (checkbox.checked) {
    textTd.classList.add("checked");
  } else {
    textTd.classList.remove("checked");
  }

  const id = checkbox.dataset.id;

  // 이 부분의 url은 다른 daily가 아니면 바꾸기
  fetch(`/api/${goalType}/checkbox/${id}`, {
    method: "POST",
  });
}

export function hideDeleted(event) {
  const li = event.target.parentElement.parentElement;
  const id = li.querySelector("input").name;
  li.setAttribute("class", "hidden");
  while (li.firstChild) {
    li.removeChild(li.lastChild);
  }
  const hiddenInput = document.createElement("input");
  hiddenInput.setAttribute("name", "deletedSubs");
  hiddenInput.setAttribute("value", id);
  const hiddenDiv = document.createElement("div");
  hiddenDiv.appendChild(hiddenInput);
  li.appendChild(hiddenDiv);
}

export const handleTermStartChange = (event, termEnd, goalType) => {
  const inputDate = event.target.value;
  if (goalType === "weekly") {
    const termEndValue = getAWeekLater(inputDate);
    termEnd.value = termEndValue;
  }
  if (goalType === "monthly") {
    const termEndValue = getAMonthLater(inputDate);
    termEnd.value = termEndValue;
  }
  if (goalType === "yearly") {
    const termEndValue = getAYearLater(inputDate);
    termEnd.value = termEndValue;
  }
};

export function getPreviousGoal(goalType) {
  fetch();
}
