import {
  formSubmit,
  preventSubmit,
  addSub,
  showOrHideMeasureSettings,
  formatMeasureSettingDatas,
  hideDeleted,
  handleTermStartChange,
  detectLanguage,
} from "./sharedAll";

const header = document.querySelector("header");
const lang = header.dataset.lang ? header.dataset.lang : detectLanguage();

const form = document.querySelector("form");
const subList = document.querySelector("div.editGoal__form__form-container ul");
const addSubBtn = document.querySelector(".addSub-btn");
const submitBtn = document.querySelector(".submit-btn");
const deleteBtns = document.querySelectorAll(".deleteBtn");
const goalType = document
  .querySelector("title")
  .text.split("|")[1]
  .split(" ")[2]
  .toLowerCase();
for (let i = 0; i < deleteBtns.length; i++) {
  deleteBtns[i].addEventListener("click", hideDeleted);
}

//단위 사용 체크 시 단위명, 목표 달성 요구치 입력란 보여주기(체크 해제 시 숨기기)
const useMeasureCheckboxes = document.querySelectorAll(
  ".measurement-setting-box__use-measurement-checkbox"
);

useMeasureCheckboxes.forEach((box) =>
  box.addEventListener("click", showOrHideMeasureSettings)
);

form.addEventListener("submit", preventSubmit);
addSubBtn.addEventListener("click", () => addSub(subList, lang));
submitBtn.addEventListener("click", () => {
  formatMeasureSettingDatas();
  formSubmit(form);
});

//시작일 input에 따른 종료일 조정
const termStart = document.getElementById("termStart");
const termEnd = document.getElementById("termEnd");

if (termStart) {
  //daily를 edit하는 경우에는 undefined가 됨
  termStart.addEventListener("change", (event) =>
    handleTermStartChange(event, termEnd, goalType)
  );
}
