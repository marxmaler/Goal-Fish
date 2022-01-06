import { manualSubmit, preventSubmit } from "./shared";

const form = document.querySelector(".newDaily__form");
const subList = document.querySelector(".newDaily__form__form-container__ul");
const addSubBtn = document.querySelector(".addSub-btn");
const submitBtn = document.querySelector(".submit-btn");
const unfinished = document.querySelectorAll(".unfinished");

window.onload = function () {
  let loadUnfinished = false;
  if (unfinished.length > 0) {
    loadUnfinished = window.confirm(
      "어제의 세운 목표 중 완수하지 못한 목표가 있습니다. 불러오시겠습니까?"
    );
  }
  if (loadUnfinished) {
    for (let i = 0; i < unfinished.length; i++) {
      unfinished[i].classList.remove("hidden");
    }
  } else {
    for (let i = 0; i < unfinished.length; i++) {
      unfinished[i].remove();
    }
  }
};

function addSub() {
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
  li.appendChild(impNCntBox);

  const measureBox = document.createElement("div");
  measureBox.classList.add("li__container");
  measureBox.classList.add("measurement-setting-box");

  const useMeasureBox = document.createElement("div");
  const useMeasureSpan = document.createElement("span");
  useMeasureSpan.innerText = "단위 사용: ";
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
  measureNameSpan.innerText = "단위명: ";
  const measureNameSelect = document.createElement("select");
  const measureNameOptions = ["시간", "회", "개", "쪽"];
  for (let i = 0; i < measureNameOptions.length; i++) {
    const option = document.createElement("option");
    option.value = measureNameOptions[i];
    option.innerText = measureNameOptions[i];
    measureNameSelect.appendChild(option);
  }
  measureNameBox.appendChild(measureNameSpan);
  measureNameBox.appendChild(measureNameSelect);
  measureBox.appendChild(measureNameBox);

  const targetValueBox = document.createElement("div");
  targetValueBox.className = "hidden";
  const targetValueSpan = document.createElement("span");
  targetValueSpan.innerText = "목표 달성 요구치: ";
  const targetValueInput = document.createElement("input");
  targetValueInput.setAttribute("type", "number");
  targetValueInput.setAttribute("name", "targetValues");
  targetValueInput.setAttribute("min", "0");
  targetValueInput.setAttribute("max", "9999");
  targetValueInput.classList.add("measurement-setting-box__targetValue");
  targetValueBox.appendChild(targetValueSpan);
  targetValueBox.appendChild(targetValueInput);

  measureBox.appendChild(targetValueBox);
  li.appendChild(measureBox);

  subList.appendChild(li);
}

const formatMeasureSettingDatas = () => {
  const useMeasureCheckboxes = document.querySelectorAll(
    ".measurement-setting-box__use-measurement-checkbox"
  );
  for (let i = 0; i < useMeasureCheckboxes.length; i++) {
    useMeasureCheckboxes[i].setAttribute("value", `${i}`);
    const measurementSettingBox =
      useMeasureCheckboxes[i].parentElement.parentElement;
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
// submit
form.addEventListener("submit", preventSubmit);
addSubBtn.addEventListener("click", addSub);
submitBtn.addEventListener("click", () => {
  formatMeasureSettingDatas();
  manualSubmit(form);
});

//단위 사용 체크 시 단위명, 목표 달성 요구치 입력란 보여주기(체크 해제 시 숨기기)
const useMeasurementCheckboxes = document.querySelectorAll(
  ".measurement-setting-box__use-measurement-checkbox"
);

const showOrHideMeasureSettings = (event) => {
  const measurementSettingBox = event.target.parentElement.parentElement;
  const hiddenSettings = measurementSettingBox.querySelectorAll(".hidden");
  if (hiddenSettings.length > 0) {
    for (let i = 0; i < hiddenSettings.length; i++) {
      hiddenSettings[i].classList.remove("hidden");
    }
  } else {
    const divs = measurementSettingBox.querySelectorAll("div");
    for (let i = 1; i < 3; i++) {
      divs[i].classList.add("hidden");
    }
  }
};

for (let i = 0; i < useMeasurementCheckboxes.length; i++) {
  useMeasurementCheckboxes[i].addEventListener(
    "click",
    showOrHideMeasureSettings
  );
}
