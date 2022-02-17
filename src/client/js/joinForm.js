import { async } from "regenerator-runtime";
import { detectLanguage, preventSubmit } from "./sharedAll";

export const lang = detectLanguage();
detectLocalTime();
const emailValBtn = document.getElementById("email-val-btn");

const validateEmail = async (event) => {
  preventSubmit(event);
  const emailInput = document.getElementById("email");
  const email = emailInput.value;

  const emailFormat = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
  const valResult = document.getElementById("emailValResult");

  if (emailFormat.test(email) === false) {
    valResult.className = "invalid";
    valResult.innerText =
      lang === "ko"
        ? "이메일 주소를 다시 한번 확인해주세요."
        : "Please check your email address again.";
  } else {
    const { result } = await (
      await fetch("/user/join/check/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
    ).json();

    if (result) {
      const valResultInput = document.getElementById("emailValidation");
      valResultInput.value = true;
      valResult.className = "valid";
      valResult.innerText =
        lang === "ko" ? "사용 가능한 이메일입니다." : "This email is available";
    } else {
      valResult.className = "invalid";
      valResult.innerText =
        lang === "ko"
          ? "이미 사용 중인 이메일입니다."
          : "This email is already registered.";
    }
  }
};

emailValBtn.addEventListener("click", validateEmail);
