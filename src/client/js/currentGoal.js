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
} from "./sharedAll";
//daily

const progress = document.querySelector("progress");
//daily가 있다면
if (progress) {
  const progressPoint = document.getElementById("progress-point");
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  let checkboxCnt = checkboxes.length;
  const indCheckboxes = document.querySelectorAll(".ind-check");
  checkboxCnt -= indCheckboxes.length;
  const progressControlObj = {
    progress,
    progressPoint,
    checkboxCnt,
    indCheckboxes,
  };
  const goalType = document
    .querySelector("title")
    .text.split("|")[1]
    .replace(" ", "")
    .toLowerCase();

  calculateProgress(progressControlObj);

  checkboxes.forEach((box) =>
    box.addEventListener("change", (event) =>
      changeOnCheckbox(event, progressControlObj, goalType)
    )
  );

  const measureBoxes = document.querySelectorAll("input[type=number]");

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

  //이전 일일 목표로 이동
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
      getPreviousGoal(goalType);
    });
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
