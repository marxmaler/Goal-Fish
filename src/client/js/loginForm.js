import { detectLanguage, detectLocalTime } from "./sharedAll";

const loginFormWrapper = document.querySelector(".form-wrapper");
export let { lang, timediff } = loginFormWrapper.dataset;
lang = lang ? lang : detectLanguage();
timediff = timediff ? timediff : detectLocalTime();
