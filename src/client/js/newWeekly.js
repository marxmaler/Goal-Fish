import {
  getAWeekFromToday,
  getAWeekLater,
  getToday,
} from "../../functions/time";
import {
  manualSubmit,
  preventSubmit,
  addSub,
  showOrHideMeasureSettings,
  formatMeasureSettingDatas,
  cancelAdd,
  newGoalDateValidation,
} from "./sharedAll";

const form = document.querySelector(".newWeekly__form");
const subList = document.querySelector(".newWeekly__form__form-container__ul");
const addSubBtn = document.querySelector(".addSub-btn");
const submitBtn = document.querySelector(".submit-btn");
const unfinished = document.querySelectorAll(".unfinished");
//default로 들어있는 li의 btn들에 event listener 추가
const cancelBtns = document.querySelectorAll(".fa-trash-alt");
cancelBtns.forEach((btn) => btn.addEventListener("click", cancelAdd));

const useMeasureCheckboxes = document.querySelectorAll(
  ".measurement-setting-box__use-measurement-checkbox"
);

useMeasureCheckboxes.forEach((box) =>
  box.addEventListener("click", showOrHideMeasureSettings)
);

window.onload = function () {
  let loadUnfinished = false;
  if (unfinished.length > 0) {
    loadUnfinished = window.confirm(
      "지난 주간 목표에 완수하지 못한 목표가 있습니다. 불러오시겠습니까?"
    );
  }
  if (loadUnfinished) {
    for (let i = 0; i < unfinished.length; i++) {
      unfinished[i].classList.remove("hidden");
    }
  } else {
    for (let i = 0; i < unfinished.length; i++) {
      unfinished[i].remove();
    }
  }
};

// submit
form.addEventListener("submit", preventSubmit);
addSubBtn.addEventListener("click", () => addSub(subList));
submitBtn.addEventListener("click", () => {
  formatMeasureSettingDatas();
  manualSubmit(form);
});

//시작일 input에 따른 종료일 조정
const termStart = document.getElementById("termStart");
const termEnd = document.getElementById("termEnd");

const handleTermStartChange = (event) => {
  const inputDate = event.target.value;
  if (newGoalDateValidation(inputDate)) {
    const termEndValue = getAWeekLater(inputDate);
    termEnd.value = termEndValue;
  } else {
    termStart.value = getToday();
    termEnd.value = getAWeekFromToday();
  }
};

termStart.addEventListener("change", handleTermStartChange);
