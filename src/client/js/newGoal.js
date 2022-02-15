import {
  manualSubmit,
  preventSubmit,
  addSub,
  showOrHideMeasureSettings,
  formatMeasureSettingDatas,
  cancelAdd,
  handleTermStartChange,
} from "./sharedAll";

const header = document.querySelector("header");
const lang = header.dataset.lang;

const form = document.querySelector(".newGoal__form");
const subList = document.querySelector(".newGoal__form__form-container__ul");
const addSubBtn = document.querySelector(".addSub-btn");
const submitBtn = document.querySelector(".submit-btn");
const unfinished = document.querySelectorAll(".unfinished");
const goalType = document
  .querySelector("title")
  .text.split("|")[1]
  .split(" ")[2]
  .toLowerCase();
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
    let message = "";
    if (goalType === "daily") {
      message =
        lang === "ko"
          ? "어제 세운 목표 중 완수하지 못한 목표가 있습니다. 불러오시겠습니까?"
          : "It seems you didn't complete all the goals of yesterday. Should I bring the unfinished goals?";
      loadUnfinished = window.confirm(message);
    } else if (goalType === "weekly") {
      message =
        lang === "ko"
          ? "지난 주간 목표에 완수하지 못한 목표가 있습니다. 불러오시겠습니까?"
          : "It seems you didn't complete all the goals of last week. Should I bring the unfinished goals?";
    } else if (goalType === "monthly") {
      message =
        lang === "ko"
          ? "지난 월간 목표에 완수하지 못한 목표가 있습니다. 불러오시겠습니까?"
          : "It seems you didn't complete all the goals of last month. Should I bring the unfinished goals?";
    } else {
      message =
        lang === "ko"
          ? "지난 연간 목표 중 완수하지 못한 목표가 있습니다. 불러오시겠습니까?"
          : "It seems you didn't complete all the goals of last year. Should I bring the unfinished goals?";
    }
    loadUnfinished = window.confirm(message);
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
addSubBtn.addEventListener("click", () => addSub(subList, lang));
submitBtn.addEventListener("click", () => {
  formatMeasureSettingDatas();
  manualSubmit(form);
});

//시작일 input에 따른 종료일 조정
const termStart = document.getElementById("termStart");
const termEnd = document.getElementById("termEnd");

if (termStart) {
  termStart.addEventListener("change", (event) =>
    handleTermStartChange(event, termEnd, goalType)
  );
}
