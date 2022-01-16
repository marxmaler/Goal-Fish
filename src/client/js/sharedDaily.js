import { timeFormat } from "./sharedAll";

export const calculateProgress = ({ progress, progressPoint, checkboxCnt }) => {
  const checkedCnt = document.querySelectorAll("input[checked]").length;
  progress.value = (checkedCnt / checkboxCnt) * 100;
  progressPoint.innerText = `${Math.round((checkedCnt / checkboxCnt) * 100)}%`;
};

export function changeOnCheckbox(event, progressControlObj) {
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

  // 이 부분의 url은 다른 home이 아닌 곳에서 쓰려면 바꾸기
  fetch(`/api/home/checkbox/${id}`, {
    method: "POST",
  });
}

export function dailyCountDown(span) {
  const midNight = new Date();
  midNight.setHours(0, 0, 0, 0);
  midNight.setDate(midNight.getDate() + 1);
  const now = new Date();
  const timeleft = midNight.getTime() - now.getTime();
  if (timeleft < 1) {
    window.location.href = `/`;
  }
  const hours = Math.floor(
    (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
  const remaingTime = `${timeFormat(hours)}:${timeFormat(minutes)}:${timeFormat(
    seconds
  )}`;

  span.innerText = remaingTime;
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

//newDaily & editDaily에서 사용
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
  cancelBtn.addEventListener("click", (event) => cancelAdd(event));
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
  measureBox.appendChild(measureNameBox);

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

  measureBox.appendChild(targetValueBox);
  li.appendChild(measureBox);
  ul.appendChild(li);
}

export function cancelAdd(event) {
  const subLi = event.target.parentElement.parentElement;
  console.log(subLi);
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
    for (let i = 1; i < 3; i++) {
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
