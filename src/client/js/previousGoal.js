import { getPreviousDaily } from "./sharedDaily";
import {
  handleMinus,
  handlePlus,
  calculateProgress,
  changeOnCheckbox,
  checkUnreflected,
  changeOnMeasure,
  getPreviousGoal,
  preventSubmit,
  handleChartSwap,
} from "./sharedAll";

const header = document.querySelector("header");
const lang = header.dataset.lang ? header.dataset.lang : detectLanguage();

const goalType = document
  .querySelector("title")
  .text.split("|")[1]
  .split(" ")[2]
  .toLowerCase();

//이전 일일 목표로 이동
const goalContainer = document.querySelector(".goal-container");
let goalId = null;

if (goalContainer) {
  goalId = goalContainer.dataset.goalid;
}

if (goalType === "daily") {
  const previousGoalSelector = document.getElementById(
    "previous-goal-selector"
  );
  if (previousGoalSelector) {
    previousGoalSelector.addEventListener("input", () =>
      getPreviousDaily(previousGoalSelector)
    );
  }
} else {
  const previousGoalBtn = document.getElementById("previous-goal-btn");
  if (previousGoalBtn) {
    previousGoalBtn.addEventListener("click", (event) => {
      preventSubmit(event);
      getPreviousGoal(goalId, goalType);
    });
  }
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
      box.addEventListener("change", (event) =>
        changeOnMeasure(event, goalType, progressControlObj)
      )
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

  //chart-btn
  const chartSwapBtnBox = document.querySelector(".chart-swap-btn");
  const chartSwapBtn = document.getElementById("swap-to-line");

  chartSwapBtn.addEventListener("click", (event) =>
    handleChartSwap(event, chartSwapBtnBox, charRenderObject, lang)
  );
}
