"use strict";
const slider = document.querySelector(".slider-wrapper"),
  slides = document.querySelectorAll(".slide");

let isDragging = false,
  startPosition = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  currentIndex = 0,
  animationID = 0;

// add multiple event to each slide
slides.forEach((slide, index) => {
  // touch event
  slide.addEventListener("touchstart", touchStart(index));
  slide.addEventListener("touchmove", touchMove);
  slide.addEventListener("touchend", touchEnd);

  // mouse event
  slide.addEventListener("mousedown", touchStart(index));
  slide.addEventListener("mouseup", touchEnd);
  slide.addEventListener("mousemove", touchMove);
  slide.addEventListener("mouseleave", touchEnd);
});

function touchStart(index) {
  return function (event) {
    currentIndex = index;
    startPosition = getPositionX(event);
    isDragging = true;
    animationID = requestAnimationFrame(animation);
    slider.classList.add("grabbing");
  };
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPosition;
  }
}

function touchEnd() {
  cancelAnimationFrame(animationID);
  isDragging = false;

  const movedBy = currentTranslate - prevTranslate;
  if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex++;
  if (movedBy > 100 && currentIndex > 0) currentIndex--;

  setSliderPositionByIndex();
  slider.classList.remove("grabbing");
}

function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

function setSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`;
}

function animation() {
  setSliderPosition();
  if (isDragging) requestAnimationFrame(animation);
}

function setSliderPositionByIndex() {
  currentTranslate = currentIndex * -window.innerWidth;
  prevTranslate = currentTranslate;
  setSliderPosition();
}
window.oncontextmenu = (event) => {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

window.onresize = () => {
  setSliderPositionByIndex();
};
