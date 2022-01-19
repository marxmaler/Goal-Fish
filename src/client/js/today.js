import { dailyCountDown, getPreviousDaily } from "./sharedDaily";

import {
  changeOnCheckbox,
  calculateProgress,
  changeOnMeasure,
  handlePlus,
  handleMinus,
  checkUnreflected,
} from "./sharedAll";
//daily

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
      changeOnCheckbox(event, progressControlObj, "daily")
    )
  );

  const measureBoxes = document.querySelectorAll("input[type=number]");

  if (measureBoxes) {
    checkUnreflected(measureBoxes);
  }

  measureBoxes.forEach((box) =>
    box.addEventListener("change", (event) => {
      changeOnMeasure(event, "daily");
    })
  );

  //plus & minus btn 제어
  const plusBtns = document.querySelectorAll(".fa-plus-circle");
  const minusBtns = document.querySelectorAll(".fa-minus-circle");

  if (plusBtns) {
    plusBtns.forEach((btn) =>
      btn.addEventListener("click", (event) => {
        handlePlus(event, "weekly");
      })
    );
  }
  if (minusBtns) {
    minusBtns.forEach((btn) =>
      btn.addEventListener("click", (event) => {
        handleMinus(event, "weekly");
      })
    );
  }

  //이전 일일 목표로 이동
  const previousDaily = document.querySelector(".previous-daily");
  previousDaily.addEventListener("input", () =>
    getPreviousDaily(previousDaily)
  );

  // 남은 시간
  const remainingTimeSpan = document.querySelector(
    ".daily-container__ramaining-time"
  );

  if (remainingTimeSpan) {
    dailyCountDown(remainingTimeSpan);
    setInterval(() => {
      dailyCountDown(remainingTimeSpan);
    }, 1000);
  }
}
