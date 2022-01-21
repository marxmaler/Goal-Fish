// currentYearly에 있는 코드 취사 선택해서 가져오기
import { yearlyCountDown, getPreviousYearly } from "./sharedYearly";

import {
  changeOnCheckbox,
  calculateProgress,
  changeOnMeasure,
  handlePlus,
  handleMinus,
  checkUnreflected,
} from "./sharedAll";
//yearly

const progress = document.querySelector("progress");
//yearly가 있다면
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
      changeOnCheckbox(event, progressControlObj, "yearly")
    )
  );

  const measureBoxes = document.querySelectorAll("input[type=number]");

  if (measureBoxes) {
    checkUnreflected(measureBoxes);
  }

  measureBoxes.forEach((box) =>
    box.addEventListener("change", (event) => {
      changeOnMeasure(event, "yearly");
    })
  );

  //plus & minus btn 제어
  const plusBtns = document.querySelectorAll(".fa-plus-circle");
  const minusBtns = document.querySelectorAll(".fa-minus-circle");

  if (plusBtns) {
    plusBtns.forEach((btn) =>
      btn.addEventListener("click", (event) => {
        handlePlus(event, "yearly");
      })
    );
  }
  if (minusBtns) {
    minusBtns.forEach((btn) =>
      btn.addEventListener("click", (event) => {
        handleMinus(event, "yearly");
      })
    );
  }

  //이전 일일 목표로 이동
  const previousYearly = document.querySelector(".previous-yearly");
  previousYearly.addEventListener("input", () =>
    getPreviousYearly(previousYearly)
  );

  // 남은 시간
  const yearlyTerm = document.getElementById("yearly-term").innerText;
  const termEnd = yearlyTerm.split("~")[1];
  const termEndDate = new Date(termEnd);
  termEndDate.setHours(0, 0, 0, 0);
  termEndDate.setDate(termEndDate.getDate() + 1); //날짜를 termEnd보다 하루 뒤로 해야 남은 날짜가 정확하게 나옴
  const remainingTimeSpan = document.querySelector(
    ".yearly-container__ramaining-time"
  );

  if (remainingTimeSpan) {
    yearlyCountDown(remainingTimeSpan, termEndDate);
    setInterval(() => {
      yearlyCountDown(remainingTimeSpan, termEndDate);
    }, 1000);
  }
}
