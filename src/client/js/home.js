import {
  calculateProgress,
  changeOnCheckbox,
  dailyCountDown,
} from "./sharedDaily";
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
      changeOnCheckbox(event, progressControlObj)
    )
  );

  const measureBoxes = document.querySelectorAll("input[type=number]");
  function checkUnreflected(measureBoxes) {
    for (let i = 0; i < measureBoxes.length; i++) {
      const value = measureBoxes[i].value;
      const max = measureBoxes[i].max;
      const checkbox = measureBoxes[
        i
      ].parentElement.parentElement.querySelector("input[type=checkbox]");
      if (
        (value === max && !checkbox.checked) ||
        (value < max && checkbox.checked)
      ) {
        checkbox.click();
      }
    }
  }
  if (measureBoxes) {
    checkUnreflected(measureBoxes);
  }
  function changeOnMeasure(event) {
    const { id } = event.target.dataset;
    const { value, max } = event.target;
    fetch(`/api/home/measure/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    const checkbox = event.target.parentElement.parentElement.querySelector(
      "input[type=checkbox]"
    );
    if (
      (value === max && !checkbox.checked) ||
      (value < max && checkbox.checked)
    ) {
      checkbox.click();
    }
  }
  measureBoxes.forEach((box) =>
    box.addEventListener("change", changeOnMeasure)
  );

  //이전 일일 목표로 이동
  const previousDaily = document.querySelector(".previous-daily");
  function getPreviousDaily() {
    const date = previousDaily.value;
    window.location.href = `daily/${date}`;
  }
  previousDaily.addEventListener("input", getPreviousDaily);

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
