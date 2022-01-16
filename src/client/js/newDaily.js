import { manualSubmit, preventSubmit } from "./sharedAll";
import {
  addSub,
  showOrHideMeasureSettings,
  formatMeasureSettingDatas,
  cancelAdd,
} from "./sharedDaily";

const form = document.querySelector(".newDaily__form");
const subList = document.querySelector(".newDaily__form__form-container__ul");
const addSubBtn = document.querySelector(".addSub-btn");
const submitBtn = document.querySelector(".submit-btn");
const unfinished = document.querySelectorAll(".unfinished");
//default로 들어있는 li의 btn들에 event listener 추가
const cancelBtns = document.querySelectorAll(".fa-trash-alt");
cancelBtns.forEach((btn) =>
  btn.addEventListener("click", (event) => cancelAdd(event))
);

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
      "어제 세운 목표 중 완수하지 못한 목표가 있습니다. 불러오시겠습니까?"
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
