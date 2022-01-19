import { getPreviousDaily } from "./sharedDaily";
import {
  handleMinus,
  handlePlus,
  calculateProgress,
  changeOnCheckbox,
  checkUnreflected,
  changeOnMeasure,
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

  calculateProgress(progressControlObj);

  checkboxes.forEach((box) =>
    box.addEventListener("change", (event) =>
      changeOnCheckbox(event, progressControlObj)
    )
  );

  const measureBoxes = document.querySelectorAll("input[type=number]");

  if (measureBoxes) {
    checkUnreflected(measureBoxes);
  }

  measureBoxes.forEach((box) =>
    box.addEventListener("change", changeOnMeasure)
  );

  //plus & minus btn 제어
  const plusBtns = document.querySelectorAll(".fa-plus-circle");
  const minusBtns = document.querySelectorAll(".fa-minus-circle");
  plusBtns.forEach((btn) => btn.addEventListener("click", handlePlus));
  minusBtns.forEach((btn) => btn.addEventListener("click", handleMinus));
}

//이전 일일 목표로 이동
const previousDaily = document.querySelector(".previous-daily");
previousDaily.addEventListener("input", () => getPreviousDaily(previousDaily));
