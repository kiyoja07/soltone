const progress = document.querySelector(".progress-container");

function scrollHandler() {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById("scrollBar").style.width = scrolled + "%";
}

function onScroll() {
  window.addEventListener("scroll", scrollHandler);
}

function init() {
  onScroll();
}

if (progress) {
  init();
}
