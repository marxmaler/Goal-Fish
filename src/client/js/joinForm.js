import { async } from "regenerator-runtime";
import { preventSubmit } from "./sharedAll";

const form = document.querySelector("form");
const usernameValBtn = document.getElementById("username-val-btn");
const emailValBtn = document.getElementById("email-val-btn");
const validateUsername = async (event) => {
  preventSubmit(event);
  const usernameInput = document.getElementById("username");
  const username = usernameInput.value;

  const lowercaseAlphabet = /[a-z]/;
  const numbers = /[0-9]/;

  if (numbers.test(username[0])) {
    valResult.className = "invalid";
    valResult.innerText = "아이디 첫 글자는 알파벳 소문자로 해주세요.";
  } else if (
    lowercaseAlphabet.test(username) &&
    numbers.test(username) !== true
  ) {
    const valResult = document.getElementById("valResult");
    valResult.className = "invalid";
    valResult.innerText = "아이디에는 숫자와 알파벳 소문자만 사용해주세요.";
  } else {
    const { result } = await (
      await fetch("/user/join/check/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })
    ).json();

    if (result) {
      const valResultInput = document.getElementById("usernameValidation");
      valResultInput.value = true;
      const valResult = document.getElementById("valResult");
      valResult.className = "valid";
      valResult.innerText = "사용 가능한 아이디입니다.";
    } else {
      const valResult = document.getElementById("valResult");
      valResult.className = "invalid";
      valResult.innerText = "이미 사용 중인 아이디입니다.";
    }
  }
};
const validateEmail = (event) => {
  preventSubmit(event);
};

usernameValBtn.addEventListener("click", validateUsername);
emailValBtn.addEventListener("click", validateEmail);
