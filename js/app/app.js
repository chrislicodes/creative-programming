"use strict";

const canvas = document.querySelector("canvas");

const removeWrapper = function () {
  const element = document.querySelector(".header__wrapper");
  element.style.opacity = 0;
  canvas.style.zIndex = 10;
};

const btn = document
  .getElementById("start-exploring")
  .addEventListener("click", removeWrapper);

let behindTheScenes = false;

["hashchange", "load"].forEach((event) => {
  window.addEventListener(event, function () {
    if (location.hash === "#dev") {
      behindTheScenes = true;
    } else {
      behindTheScenes = false;
    }
  });
});

if (behindTheScenes) {
  removeWrapper();
}
