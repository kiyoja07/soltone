const topBtn = document.querySelector('.topBtn');
let prevYAxis = window.pageYOffset;  // 브라우저 좌상단에서 스크롤된 픽셀

function scrollHandler(event) {
  let yScroll = window.pageYOffset;

  if (yScroll >= 1800) {
    topBtn.classList.remove('topBtnNone');
    topBtn.classList.add('topBtnBlock');
  } else {

    if (yScroll >= prevYAxis) {  // 아래로 스크롤되면 버튼 활성화
      topBtn.classList.remove('topBtnNone');
      topBtn.classList.add('topBtnBlock');
    } else { // 위로 스크롤되면 버튼 비활성화
      topBtn.classList.remove('topBtnBlock');
      topBtn.classList.add('topBtnNone');
      onClick();
    }
    
  }
  prevYAxis = yScroll;
}

function scrollToTop(event) {
  // returns the number of pixels an element's content is scrolled vertically
  // document.body.scrollTop : For Safari
  // document.documentElement.scrollTop : For Chrome, Firefox, IE and Opera
  
  const c = document.documentElement.scrollTop || document.body.scrollTop;

  if (c > 10) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 10);
  } else {
    window.scrollTo(0, 10);
  }
}

function onClick() {
  topBtn.addEventListener('click', scrollToTop);
}

function onScroll() {
  window.addEventListener('scroll', scrollHandler);

}

function init() {
  onScroll();
  onClick();
}

if (topBtn) {
    init();
  }