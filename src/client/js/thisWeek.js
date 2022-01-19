// currentWeekly에 있는 코드 취사 선택해서 가져오기
import { weeklyCountDown, getPreviousWeekly } from "./sharedWeekly";

import {
  changeOnCheckbox,
  calculateProgress,
  changeOnMeasure,
  handlePlus,
  handleMinus,
  checkUnreflected,
} from "./sharedAll";
//weekly

const progress = document.querySelector("progress");
//weekly가 있다면
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
      changeOnCheckbox(event, progressControlObj, "weekly")
    )
  );

  const measureBoxes = document.querySelectorAll("input[type=number]");

  if (measureBoxes) {
    checkUnreflected(measureBoxes);
  }

  measureBoxes.forEach((box) =>
    box.addEventListener("change", (event) => {
      changeOnMeasure(event, "weekly");
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
  const previousWeekly = document.querySelector(".previous-weekly");
  previousWeekly.addEventListener("input", () =>
    getPreviousWeekly(previousWeekly)
  );

  // 남은 시간
  const weeklyTerm = document.getElementById("weekly-term").innerText;
  const termEnd = weeklyTerm.split("~")[1];
  const termEndDate = new Date(termEnd);
  termEndDate.setHours(0, 0, 0, 0);
  termEndDate.setDate(termEndDate.getDate() + 1); //날짜를 termEnd보다 하루 뒤로 해야 남은 날짜가 정확하게 나옴
  const remainingTimeSpan = document.querySelector(
    ".weekly-container__ramaining-time"
  );

  if (remainingTimeSpan) {
    weeklyCountDown(remainingTimeSpan, termEndDate);
    setInterval(() => {
      weeklyCountDown(remainingTimeSpan, termEndDate);
    }, 1000);
  }
}
