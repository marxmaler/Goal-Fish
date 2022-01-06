import { timeFormat, calculateProgress } from "./shared";
//daily

const dailyProgress = document.querySelector(
  ".daily-container__progress-bar-container__progress-bar"
);
//daily가 있다면
if (dailyProgress) {
  const dailyProgressPoint = document.querySelector(
    ".daily-container__progress-bar-container__progress-point"
  );

  const dailyTableTbody = document.querySelector(".daily-table__tbody");
  const dailyCheckboxes = document.querySelectorAll(".daily-table__checkbox");
  let dailyCheckboxCnt = dailyCheckboxes.length;
  let dailyCheckedCnt =
    dailyTableTbody.querySelectorAll("input[checked]").length;

  calculateProgress(
    dailyProgress,
    dailyProgressPoint,
    dailyCheckedCnt,
    dailyCheckboxCnt
  );

  function dailyChangeOnCheckbox(event) {
    const checkbox = event.target;
    const tr = checkbox.parentElement.parentElement;
    const textTd = tr.querySelectorAll("td")[2];

    //checkbox에 checked attr 명시적으로 추가/제거(count할 수 있게)
    if (checkbox.checked) {
      checkbox.setAttribute("checked", "");
    } else {
      checkbox.removeAttribute("checked");
    }

    dailyCheckedCnt = dailyTableTbody.querySelectorAll("input[checked]").length;

    calculateProgress(
      dailyProgress,
      dailyProgressPoint,
      dailyCheckedCnt,
      dailyCheckboxCnt
    );

    //완수한 목표에 줄 그어주기(혹은 줄긋기 취소)
    if (checkbox.checked) {
      textTd.classList.add("checked");
    } else {
      textTd.classList.remove("checked");
    }

    const id = checkbox.dataset.id;

    fetch(`/api/home/checkbox/${id}`, {
      method: "POST",
    });
  }

  for (let i = 0; i < dailyCheckboxes.length; i++) {
    dailyCheckboxes[i].addEventListener("change", dailyChangeOnCheckbox);
  }

  const dailyRemainingTimeSpan = document.querySelector(
    ".daily-container__ramaining-time"
  );

  const previousDaily = document.querySelector(".previous-daily");

  function dailyCountDown() {
    const midNight = new Date();
    midNight.setHours(0, 0, 0, 0);
    midNight.setDate(midNight.getDate() + 1);
    const now = new Date();
    const timeleft = midNight.getTime() - now.getTime();
    if (timeleft < 1) {
      window.location.href = `/`;
    }
    const hours = Math.floor(
      (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
    const remaingTime = `${timeFormat(hours)}:${timeFormat(
      minutes
    )}:${timeFormat(seconds)}`;

    dailyRemainingTimeSpan.innerText = remaingTime;
  }

  function getPreviousDaily() {
    const date = previousDaily.value;
    window.location.href = `daily/${date}`;
  }

  previousDaily.addEventListener("input", getPreviousDaily);

  if (dailyRemainingTimeSpan) {
    dailyCountDown();
    setInterval(dailyCountDown, 1000);
  }
}
