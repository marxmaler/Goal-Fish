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
} from "./sharedAll";

const progress = document.querySelector("progress");
//daily가 있다면
if (progress) {
  const progressPoint = document.getElementById("progress-point");
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  const checkboxCnt = checkboxes.length;
  const progressControlObj = {
    progress,
    progressPoint,
    checkboxCnt,
  };
  const goalType = document
    .querySelector("title")
    .text.split("|")[1]
    .split(" ")[2]
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
      box.addEventListener("change", (event) =>
        changeOnMeasure(event, goalType)
      )
    );
  }

  //plus & minus btn 제어
  const plusBtns = document.querySelectorAll(".fa-plus-circle");
  const minusBtns = document.querySelectorAll(".fa-minus-circle");
  plusBtns.forEach((btn) =>
    btn.addEventListener("click", (event) => handlePlus(event, goalType))
  );
  minusBtns.forEach((btn) =>
    btn.addEventListener("click", (event) => handleMinus(event, goalType))
  );

  //이전 일일 목표로 이동
  if (goalType === "daily") {
    const previousGoalSelector = document.getElementById(
      "previous-goal-selector"
    );
    previousGoalSelector.addEventListener("change", () =>
      getPreviousDaily(previousGoalSelector)
    );
  } else {
    const previousGoalBtn = document.getElementById("previous-goal-btn");
    previousGoalBtn.addEventListener("click", (event) => {
      preventSubmit(event);
      getPreviousGoal(goalType);
    });
  }
}
