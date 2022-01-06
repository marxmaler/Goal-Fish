//weekly

//추후에 form 없애면 수정하기
const weeklyForm = document.querySelector(".weekly-container__form");
if (weeklyForm) {
  //weekly가 있다면
  // 남은 시간
  const weeklyTerm = document.querySelector(".weekly-term").innerText;
  const termEnd = weeklyTerm.split("~")[1];
  const termEndDate = new Date(termEnd);
  termEndDate.setHours(0, 0, 0, 0);
  const weeklyRemainingTimeSpan = document.querySelector(
    ".weekly-container__ramaining-time"
  );

  function weeklyCountDown() {
    const now = new Date();
    const timeleft = termEndDate.getTime() - now.getTime();
    if (timeleft < 1) {
      window.location.href = `/`;
    }
    const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
    const remaingTime = `${timeFormat(days)}:${timeFormat(hours)}:${timeFormat(
      minutes
    )}:${timeFormat(seconds)}`;

    weeklyRemainingTimeSpan.innerText = remaingTime;
  }

  if (weeklyRemainingTimeSpan) {
    weeklyCountDown();
    setInterval(weeklyCountDown, 1000);
  }

  // progress
  const weeklyCheckboxes = document.querySelectorAll(
    ".weekly-table__sub-checkbox"
  );
  const weeklyProgress = document.querySelector(
    ".weekly-container__progress-bar-container__progress-bar"
  );
  const weeklyProgressPoint = document.querySelector(
    ".weekly-container__progress-bar-container__progress-point"
  );
  let weeklyCheckboxCnt = weeklyCheckboxes.length;
  const weeklyTableTbody = document.querySelector(".weekly-table__tbody");
  let weeklyCheckedCnt = weeklyTableTbody.querySelectorAll(
    "input[checked].weekly-table__sub-checkbox"
  ).length;

  calculateProgress(
    weeklyProgress,
    weeklyProgressPoint,
    weeklyCheckedCnt,
    weeklyCheckboxCnt
  );

  function weeklyChangeOnCheckbox(event) {
    calculateProgress(
      weeklyProgress,
      weeklyProgressPoint,
      weeklyCheckedCnt,
      weeklyCheckboxCnt
    );
    const id = event.target.value;
    const td = event.target.parentElement;
    const input = document.createElement("input");
    input.setAttribute("class", "hidden");
    input.setAttribute("type", "text");
    input.setAttribute("name", "changedWeekly");
    input.setAttribute("value", id);
    td.appendChild(input);
    weeklyForm.submit();
  }

  for (let i = 0; i < weeklyCheckboxes.length; i++) {
    weeklyCheckboxes[i].addEventListener("change", weeklyChangeOnCheckbox);
  }

  // weekly의 inter가 체크될 때
  const weeklyInterCheckboxes = document.querySelectorAll(
    ".weekly-table__inter-checkbox"
  );

  function weeklyInterChangeOnCheckbox(event) {
    const id = event.target.value;
    const td = event.target.parentElement;
    const input = document.createElement("input");
    input.setAttribute("class", "hidden");
    input.setAttribute("type", "text");
    input.setAttribute("name", "changedWeeklyInter");
    input.setAttribute("value", id);
    td.appendChild(input);
    weeklyForm.submit();
  }

  for (let i = 0; i < weeklyInterCheckboxes.length; i++) {
    weeklyInterCheckboxes[i].addEventListener(
      "change",
      weeklyInterChangeOnCheckbox
    );
  }
}
