const header = document.querySelector("header");
const menuOpenBtn = document.querySelector(".menu-open-btn");
const menuCloseBtn = document.querySelector(".menu-close-btn");
const menuBox = document.querySelector(".menu-box");
const handleMenuOpen = (event) => {
  menuBox.classList.toggle("opened");
  menuOpenBtn.classList.toggle("hidden");
};
const handleMenuClose = (event) => {
  menuBox.classList.toggle("closed");
  setTimeout(() => {
    menuBox.classList.toggle("opened");
    menuBox.classList.toggle("closed");
    menuOpenBtn.classList.toggle("hidden");
  }, 500);
};
menuOpenBtn.addEventListener("click", handleMenuOpen);
menuCloseBtn.addEventListener("click", handleMenuClose);
