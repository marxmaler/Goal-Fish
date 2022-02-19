import { detectLanguage, detectLocalTime } from "./sharedAll";

const loginFormWrapper = document.querySelector(".form-wrapper");
export let { lang, timediff } = loginFormWrapper.dataset;
lang = lang ?? detectLanguage();
timediff = timediff ?? detectLocalTime();
const noti = document.querySelector(".lang-detection-noti");
if (lang && timediff) {
  noti.remove();
}
