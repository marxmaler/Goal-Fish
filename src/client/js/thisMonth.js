// currentMonthly에 있는 코드 취사 선택해서 가져오기
import { monthlyCountDown, getPreviousMonthly } from "./sharedMonthly";

import {
  changeOnCheckbox,
  calculateProgress,
  changeOnMeasure,
  handlePlus,
  handleMinus,
  checkUnreflected,
} from "./sharedAll";
//monthly

const progress = document.querySelector("progress");
//monthly가 있다면
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
      changeOnCheckbox(event, progressControlObj, "monthly")
    )
  );

  const measureBoxes = document.querySelectorAll("input[type=number]");

  if (measureBoxes) {
    checkUnreflected(measureBoxes);
  }

  measureBoxes.forEach((box) =>
    box.addEventListener("change", (event) => {
      changeOnMeasure(event, "monthly");
    })
  );

  //plus & minus btn 제어
  const plusBtns = document.querySelectorAll(".fa-plus-circle");
  const minusBtns = document.querySelectorAll(".fa-minus-circle");

  if (plusBtns) {
    plusBtns.forEach((btn) =>
      btn.addEventListener("click", (event) => {
        handlePlus(event, "monthly");
      })
    );
  }
  if (minusBtns) {
    minusBtns.forEach((btn) =>
      btn.addEventListener("click", (event) => {
        handleMinus(event, "monthly");
      })
    );
  }

  //이전 일일 목표로 이동
  const previousMonthly = document.querySelector(".previous-monthly");
  previousMonthly.addEventListener("input", () =>
    getPreviousMonthly(previousMonthly)
  );

  // 남은 시간
  const monthlyTerm = document.getElementById("monthly-term").innerText;
  const termEnd = monthlyTerm.split("~")[1];
  const termEndDate = new Date(termEnd);
  termEndDate.setHours(0, 0, 0, 0);
  termEndDate.setDate(termEndDate.getDate() + 1); //날짜를 termEnd보다 하루 뒤로 해야 남은 날짜가 정확하게 나옴
  const remainingTimeSpan = document.querySelector(
    ".monthly-container__ramaining-time"
  );

  if (remainingTimeSpan) {
    monthlyCountDown(remainingTimeSpan, termEndDate);
    setInterval(() => {
      monthlyCountDown(remainingTimeSpan, termEndDate);
    }, 1000);
  }
}
