import { timeFormat } from "./sharedAll";

export function dailyCountDown(span) {
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
  const remaingTime = `${timeFormat(hours)}:${timeFormat(minutes)}:${timeFormat(
    seconds
  )}`;

  span.innerText = remaingTime;
}

export function getPreviousDaily(previousDaily) {
  const date = previousDaily.value;
  window.location.href = `/daily/${date}`;
}
