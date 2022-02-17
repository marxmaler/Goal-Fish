import { dailyCountDown, getPreviousDaily } from "./sharedDaily";
import { weeklyCountDown } from "./sharedWeekly";
import { monthlyCountDown } from "./sharedMonthly";
import { yearlyCountDown } from "./sharedYearly";

import {
  changeOnCheckbox,
  calculateProgress,
  changeOnMeasure,
  handlePlus,
  handleMinus,
  checkUnreflected,
  getPreviousGoal,
  preventSubmit,
  handleChartSwap,
} from "./sharedAll";

const goalType = document
  .querySelector("title")
  .text.split("|")[1]
  .replace(" ", "")
  .toLowerCase();

//이전 일일 목표로 이동
const goalContainer = document.querySelector(".goal-container");
let lang = goalContainer?.dataset.lang;
if (!lang) {
  const messageBox = document.querySelector(".no-goal-messeage-box");
  lang = messageBox.dataset.lang;
}

let goalId = null;

if (goalContainer) {
  goalId = goalContainer.dataset.goalid;
}

if (goalType === "daily") {
  const previousGoalSelector = document.getElementById(
    "previous-goal-selector"
  );
  previousGoalSelector.addEventListener("input", () =>
    getPreviousDaily(previousGoalSelector)
  );
} else {
  const previousGoalBtn = document.getElementById("previous-goal-btn");
  previousGoalBtn.addEventListener("click", (event) => {
    preventSubmit(event);
    getPreviousGoal(goalId, goalType);
  });
}

//goal이 있다면
if (goalContainer) {
  const progress = document.querySelector("progress");
  const progressPoint = document.getElementById("progress-point");
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  let checkboxCnt = checkboxes.length;
  const indCheckboxes = document.querySelectorAll(".ind-check");
  checkboxCnt -= indCheckboxes.length;

  const measureBoxes = document.querySelectorAll("input[type=number]");

  let indMeasureInputs = [];
  measureBoxes?.forEach((box) =>
    box.parentElement.parentElement.parentElement.querySelector(".ind-check")
      ? indMeasureInputs.push(box)
      : null
  );
  let noIndCheckboxes = [];
  checkboxes?.forEach((box) =>
    !box.classList.contains("ind-check") ? noIndCheckboxes.push(box) : null
  );

  const chartBox = document.querySelector("#chart");
  const chartType = document.getElementById("graph-type").innerText;
  const graphType = ["막대 그래프", "Bar Chart"].includes(chartType)
    ? "bar"
    : "line";
  const {
    avg: goalAvg,
    prevs: prevGoals,
    prevdates: prevGoalDates,
  } = chartBox.dataset;

  const progressControlObj = {
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
  };

  const charRenderObject = {
    chartBox,
    goalAvg,
    prevGoals,
    prevGoalDates,
    graphType,
    indMeasureInputs,
    noIndCheckboxes,
  };

  calculateProgress(progressControlObj);

  checkboxes.forEach((box) =>
    box.addEventListener("change", (event) =>
      changeOnCheckbox(event, progressControlObj, goalType)
    )
  );

  if (measureBoxes) {
    checkUnreflected(measureBoxes);
    measureBoxes.forEach((box) =>
      box.addEventListener("change", (event) => {
        changeOnMeasure(event, goalType, progressControlObj);
      })
    );
  }

  //plus & minus btn 제어
  const plusBtns = document.querySelectorAll(".fa-plus-circle");
  const minusBtns = document.querySelectorAll(".fa-minus-circle");

  if (plusBtns) {
    plusBtns.forEach((btn) =>
      btn.addEventListener("click", (event) => {
        handlePlus(event, goalType, progressControlObj);
      })
    );
  }
  if (minusBtns) {
    minusBtns.forEach((btn) =>
      btn.addEventListener("click", (event) => {
        handleMinus(event, goalType, progressControlObj);
      })
    );
  }

  // 남은 시간
  let goalTerm = "";
  let termEnd = "";
  let termEndDate = "";
  if (goalType !== "daily") {
    goalTerm = document.getElementById("goal-term").innerText;
    termEnd = goalTerm.split("~")[1];
    termEndDate = new Date(termEnd);
    termEndDate.setHours(0, 0, 0, 0);
    termEndDate.setDate(termEndDate.getDate() + 1); //날짜를 termEnd보다 하루 뒤로 해야 남은 날짜가 정확하게 나옴
  }
  const remainingTimeSpan = document.querySelector(
    ".goal-container__ramaining-time"
  );

  //chart-btn
  const chartSwapBtnBox = document.querySelector(".chart-swap-btn");
  const chartSwapBtn = document.getElementById("swap-to-line");

  chartSwapBtn.addEventListener("click", (event) =>
    handleChartSwap(event, chartSwapBtnBox, charRenderObject, lang)
  );

  if (remainingTimeSpan) {
    if (goalType === "daily") {
      dailyCountDown(remainingTimeSpan);
      setInterval(() => {
        dailyCountDown(remainingTimeSpan);
      }, 1000);
    } else if (goalType === "weekly") {
      weeklyCountDown(remainingTimeSpan, termEndDate);
      setInterval(() => {
        weeklyCountDown(remainingTimeSpan, termEndDate);
      }, 1000);
    } else if (goalType === "monthly") {
      monthlyCountDown(remainingTimeSpan, termEndDate);
      setInterval(() => {
        monthlyCountDown(remainingTimeSpan, termEndDate);
      }, 1000);
    } else if (goalType === "yearly") {
      yearlyCountDown(remainingTimeSpan, termEndDate);
      setInterval(() => {
        yearlyCountDown(remainingTimeSpan, termEndDate);
      }, 1000);
    }
  }
}
