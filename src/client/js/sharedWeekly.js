import { timeFormat } from "./sharedAll";

export function weeklyCountDown(span, termEndDate) {
  const now = new Date();
  const timeleft = termEndDate.getTime() - now.getTime();
  if (timeleft < 1) {
    window.location.href = `/weekly`;
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

  span.innerText = remaingTime;
}

export function getPreviousWeekly(previousWeekly) {
  const date = previousWeekly.value;
  window.location.href = `/weekly/${date}`;
}
