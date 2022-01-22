const sideMenu = document.querySelector("aside");
const menus = sideMenu.querySelectorAll("li.main-menu");

const handleMouseover = (event) => {
  const menu = event.target;
  if (menu !== event.currentTarget) {
    return;
  }
  for (let i = 0; i < menus.length; i++) {
    if (menus[i] !== menu && menus[i].classList.contains("highlighted")) {
      menus[i].classList.remove("highlighted");
    }
  }

  if (!menu.classList.contains("highlighted")) {
    menu.classList.add("highlighted");
  }
  const detail = menu.querySelector("div.detail");
  if (detail.classList.contains("hidden")) {
    detail.classList.remove("hidden");
  }
};
const handleMouseleave = (event) => {
  const menu = event.target;
  if (menu !== event.currentTarget) {
    return;
  }
  if (menu.classList.contains("highlighted")) {
    menu.classList.remove("highlighted");
  }
  const detail = menu.querySelector("div.detail");
  if (!detail.classList.contains("hidden")) {
    detail.classList.add("hidden");
  }
  defaultHighlight();
};

const defaultHighlight = () => {
  const title = document
    .querySelector("title")
    .text.split("|")[1]
    .replace(" ", "");
  if (title.includes("Daily")) {
    menus[0].classList.add("highlighted");
  } else if (title.includes("Weekly")) {
    menus[1].classList.add("highlighted");
  } else if (title.includes("Monthly")) {
    menus[2].classList.add("highlighted");
  } else if (title.includes("Yearly")) {
    menus[3].classList.add("highlighted");
  }
};

sideMenu.addEventListener("mouseleave", defaultHighlight);
menus.forEach((menu) => menu.addEventListener("mouseover", handleMouseover));
menus.forEach((menu) => menu.addEventListener("mouseleave", handleMouseleave));

//메뉴 고정
const fixBtn = document.getElementById("fix-btn");
const handleFix = (menu, btn) => {
  if (menu.classList.contains("no-fix")) {
    menu.classList.remove("no-fix");
    menu.classList.add("fix");
    btn.classList.remove("fa-thumbtack");
    btn.classList.add("fa-dot-circle");
  } else {
    menu.classList.remove("fix");
    menu.classList.add("no-fix");
    btn.classList.add("fa-thumbtack");
    btn.classList.remove("fa-dot-circle");
  }
};
fixBtn.addEventListener("click", () => handleFix(sideMenu, fixBtn));
