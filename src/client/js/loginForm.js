import { detectLanguage, detectLocalTime, updateSession } from "./sharedAll";

const loginFormWrapper = document.querySelector(".form-wrapper");
export let { lang, prevlang, timediff, prevtimediff } =
  loginFormWrapper.dataset;
lang = lang ?? prevlang;

if (!lang) lang = detectLanguage();

timediff = timediff ?? prevtimediff;
if (!timediff) timediff = detectLocalTime();

if (lang && timediff) updateSession(lang, timediff);

const noti = document.querySelector(".lang-detection-noti");
if (noti && lang && timediff) {
  noti.remove();
}
