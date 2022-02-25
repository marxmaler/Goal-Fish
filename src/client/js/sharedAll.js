import { convertImp } from "../../functions/convertImp";
import {
  getAMonthLater,
  getAWeekLater,
  getAYearLater,
} from "../../functions/time";
import ApexCharts from "apexcharts";
import { animateModalValue } from "../../functions/animateModalValue";
import { async } from "regenerator-runtime";

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

export function addSub(ul, lang) {
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
  useMeasureSpan.innerText = lang === "ko" ? "단위 사용:" : "Use measurement:";
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
  measureNameSpan.innerText = lang === "ko" ? "단위명:" : "Unit name:";
  const measureNameSelect = document.createElement("select");
  measureNameSelect.name = "measureNames";
  const measureNameOptions =
    lang === "ko"
      ? [
          "시간",
          "회",
          "개",
          "쪽",
          "권",
          "걸음",
          "km",
          "hours",
          "times",
          "pages",
          "books",
          "steps",
          "miles",
        ]
      : [
          "hours",
          "times",
          "pages",
          "books",
          "steps",
          "miles",
          "km",
          "시간",
          "회",
          "개",
          "쪽",
          "권",
          "걸음",
        ];
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
  targetValueSpan.innerText =
    lang === "ko" ? "목표 달성 요구치:" : "Target value:";
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
  eachAsIndependSpan.innerText =
    lang === "ko"
      ? "각 단위를 단일 목표로 간주:"
      : "Consider each as independent goal:";
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
  changeOnMeasureNoEvent(measureInput, goalType, progressControlObj, true);
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
  changeOnMeasureNoEvent(measureInput, goalType, progressControlObj, false);
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
  let { id, oldval } = event.target.dataset;
  let { value, max } = event.target;
  oldval = parseInt(oldval, 10);
  value = parseInt(value, 10);
  max = parseInt(max, 10);

  if (max < value) {
    value = oldval;
    event.target.value = oldval;
  }

  const diff = value - oldval;
  const isPlus = diff > 0 ? true : false;
  if (diff !== 0) {
    fetch(`/api/${goalType}/measure/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });

    event.target.dataset.oldval = value;

    const checkbox =
      event.target.parentElement.parentElement.parentElement.querySelector(
        "input[type=checkbox]"
      );

    const tr = checkbox.parentElement.parentElement;
    const td = tr.querySelector(".measure-td");

    if (checkbox.classList.contains("ind-check") && isPlus) {
      calculateProgress(progressControlObj);
      const impPoint =
        convertImp(tr.querySelector(".importance").innerText) * diff;
      const modal = document.createElement("div");
      modal.className = "complete-modal";
      const modalFish = document.createElement("i");
      const fishColor =
        impPoint === 5 ? "red" : impPoint === 3 ? "orange" : "yellow";

      td.appendChild(modal);

      animateModalValue(modal, 0, 99, 750);
      animateModalValue(modal, 99, impPoint, 750);
      setTimeout(() => {
        modalFish.className = "fa-solid fa-fish modal-fish";
        modalFish.classList.add(fishColor);
        modal.appendChild(modalFish);
      }, 1000);
      setTimeout(() => {
        modalFish.classList.add("fade-away");
      }, 2000);
      setTimeout(() => {
        modal.remove();
      }, 3000);
    } else if (checkbox.classList.contains("ind-check")) {
      calculateProgress(progressControlObj);
    }

    if (
      (parseInt(value, 10) === parseInt(max, 10) && !checkbox.checked) ||
      (parseInt(value, 10) < parseInt(max, 10) && checkbox.checked)
    ) {
      checkbox.click();
    }
  }
}

//같은 함수 event handler가 아닌 버젼
export function changeOnMeasureNoEvent(
  measureInput,
  goalType,
  progressControlObj,
  isPlus
) {
  const { id } = measureInput.dataset;
  const { value, max } = measureInput;
  fetch(`/api/${goalType}/measure/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });

  measureInput.dataset.oldval = value;
  const checkbox =
    measureInput.parentElement.parentElement.parentElement.querySelector(
      "input[type=checkbox]"
    );
  const tr = checkbox.parentElement.parentElement;
  const td = tr.querySelector(".measure-td");

  if (checkbox.classList.contains("ind-check") && isPlus) {
    calculateProgress(progressControlObj);
    const impPoint = convertImp(tr.querySelector(".importance").innerText);
    const modal = document.createElement("div");
    modal.className = "complete-modal";

    const modalFish = document.createElement("i");
    const fishColor =
      impPoint === 5 ? "red" : impPoint === 3 ? "orange" : "yellow";

    td.appendChild(modal);

    animateModalValue(modal, 0, 99, 750);
    animateModalValue(modal, 99, impPoint, 750);
    setTimeout(() => {
      modalFish.className = "fa-solid fa-fish modal-fish";
      modalFish.classList.add(fishColor);
      modal.appendChild(modalFish);
    }, 1000);
    setTimeout(() => {
      modalFish.classList.add("fade-away");
    }, 2000);
    setTimeout(() => {
      modal.remove();
    }, 3000);
  } else if (checkbox.classList.contains("ind-check")) {
    calculateProgress(progressControlObj);
  }

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
  chartBox,
  goalAvg,
  prevGoals,
  prevGoalDates,
  indMeasureInputs,
  noIndCheckboxes,
}) => {
  let checkedCnt = document.querySelectorAll("input[checked]").length;
  let indCheckedCnt = 0;
  let targetTotal = 0;
  let currentTotal = 0;
  for (let i = 0; i < indCheckboxes.length; i++) {
    indCheckboxes[i].checked && indCheckedCnt++;
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

  const graphType = ["막대", "Bar"].includes(
    document.getElementById("graph-type").innerText
  )
    ? "bar"
    : "line";
  reRenderChart(
    chartBox,
    getOptions(
      goalAvg,
      prevGoals,
      prevGoalDates,
      graphType,
      indMeasureInputs,
      noIndCheckboxes
    )
  );
};

export function changeOnCheckbox(event, progressControlObj, goalType) {
  const checkbox = event.target;
  const td = checkbox.parentElement;
  const tr = td.parentElement;
  const textTd = tr.querySelectorAll("td")[2];

  //checkbox에 checked attr 명시적으로 추가/제거(count할 수 있게)
  if (checkbox.checked) {
    checkbox.setAttribute("checked", "");
  } else {
    checkbox.removeAttribute("checked");
  }

  if (!checkbox.classList.contains("ind-check") && checkbox.checked) {
    const impPoint = convertImp(tr.querySelector(".importance").innerText);
    const modal = document.createElement("div");
    modal.className = "complete-modal";
    const modalFish = document.createElement("i");
    const fishColor =
      impPoint === 5 ? "red" : impPoint === 3 ? "orange" : "yellow";

    td.appendChild(modal);

    animateModalValue(modal, 0, 99, 750);
    animateModalValue(modal, 99, impPoint, 750);
    setTimeout(() => {
      modalFish.className = "fa-solid fa-fish modal-fish";
      modalFish.classList.add(fishColor);
      modal.appendChild(modalFish);
    }, 1000);
    setTimeout(() => {
      modalFish.classList.add("fade-away");
    }, 2000);
    setTimeout(() => {
      modal.remove();
    }, 3000);
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

export function getOptions(
  goalAvg,
  prevGoals,
  prevGoalDates,
  graphType,
  indMeasureInputs,
  noIndCheckboxes
) {
  let todayTotal = 0;
  indMeasureInputs &&
    indMeasureInputs.forEach((input) => {
      const value = input.value;
      const imp = convertImp(
        input.parentElement.parentElement.parentElement.querySelector(
          ".importance"
        ).innerText
      );
      todayTotal += value * imp;
    });

  noIndCheckboxes &&
    noIndCheckboxes.forEach((box) => {
      box.checked &&
        (todayTotal += convertImp(
          box.parentElement.parentElement.querySelector(".importance").innerText
        ));
    });

  let adjustedPrevGoals = JSON.parse(prevGoals);
  adjustedPrevGoals[adjustedPrevGoals.length - 1] = todayTotal;
  const options = {
    theme: { mode: "dark" },
    chart: {
      type: graphType,
      height: "100%",
      background: "transparent",
      toolbar: {
        show: false,
      },
    },
    colors: ["#1bd5ea"],
    markers: {
      size: [3],
    },
    series: [
      {
        name: "Goal Management Score",
        data:
          graphType === "bar"
            ? [parseInt(goalAvg, 10), parseInt(todayTotal, 10)]
            : adjustedPrevGoals,
      },
    ],
    xaxis: {
      categories:
        graphType === "bar" ? ["average", "today"] : JSON.parse(prevGoalDates),
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
    },
  };

  return options;
}

export function reRenderChart(chartBox, options) {
  while (chartBox.firstChild) {
    chartBox.removeChild(chartBox.lastChild);
  }
  const div = document.createElement("div");
  chartBox.appendChild(div);
  const chart = new ApexCharts(div, options);
  chart.render();
}

export const handleChartSwap = (
  event,
  chartSwapBtnBox,
  charRenderObject,
  lang
) => {
  const {
    chartBox,
    goalAvg,
    prevGoals,
    prevGoalDates,
    indMeasureInputs,
    noIndCheckboxes,
  } = charRenderObject;

  const chartType = document.getElementById("graph-type");
  if (event.target.id === "swap-to-line") {
    event.target.style.animation = "slideRight 0.3s ease-in-out";
    setTimeout(() => {
      const newSwapBtn = document.createElement("span");
      newSwapBtn.setAttribute("id", "swap-to-bar");
      newSwapBtn.innerText = lang === "ko" ? "그래프 전환" : "Swap Chart";
      newSwapBtn.addEventListener("click", (event) =>
        handleChartSwap(event, chartSwapBtnBox, charRenderObject, lang)
      );
      event.target.remove();
      chartSwapBtnBox.appendChild(newSwapBtn);

      chartType.innerText = lang === "ko" ? "꺾은 선" : "Line";
    }, 300);

    const graphType = "line";
    reRenderChart(
      chartBox,
      getOptions(
        goalAvg,
        prevGoals,
        prevGoalDates,
        graphType,
        indMeasureInputs,
        noIndCheckboxes
      )
    );
  } else {
    event.target.style.animation = "slideLeft 0.3s ease-in-out";
    setTimeout(() => {
      const newSwapBtn = document.createElement("span");
      newSwapBtn.setAttribute("id", "swap-to-line");
      newSwapBtn.innerText = lang === "ko" ? "그래프 전환" : "Swap Chart";
      newSwapBtn.addEventListener("click", (event) =>
        handleChartSwap(event, chartSwapBtnBox, charRenderObject, lang)
      );
      event.target.remove();
      chartSwapBtnBox.prepend(newSwapBtn);
      chartType.innerText = lang === "ko" ? "막대" : "Bar";
    }, 300);

    const graphType = "bar";
    reRenderChart(
      chartBox,
      getOptions(
        goalAvg,
        prevGoals,
        prevGoalDates,
        graphType,
        indMeasureInputs,
        noIndCheckboxes
      )
    );
  }
};

export const getPreviousGoal = (goalId, goalType) => {
  window.location.href = goalId
    ? `/${goalType}/previous/${goalId}`
    : `/${goalType}/previous/`;
};

export const detectLanguage = async () => {
  let detectedLang = window.navigator.userLanguage || window.navigator.language;
  const { langChange, sessionLang } = await (
    await fetch(`/api/language/${detectedLang}`, {
      method: "POST",
    })
  ).json();
  if (langChange) {
    const currentUrl = window.location.href;
    window.location.href = currentUrl;
  }
  return sessionLang;
};

export const detectLocalTime = () => {
  const diff = -new Date().getTimezoneOffset() / 60;
  fetch(`/api/time/${diff}`, {
    method: "POST",
  });
  return diff;
};

export const updateSession = (lang, timeDiff) => {
  fetch(`/api/session/${lang}/${timeDiff}`, {
    method: "POST",
  });
};
