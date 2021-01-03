"use strict";

const canvas = document.querySelector("canvas");

const btn = document
  .getElementById("start-exploring")
  .addEventListener("click", function () {
    const element = document.querySelector(".header__wrapper");
    element.style.opacity = 0;
    canvas.style.zIndex = 10;
  });
