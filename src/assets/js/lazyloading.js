// IntersectionObserver의 options를 설정합니다.
const options = {
  root: null,
  // 타겟 이미지 접근 전 이미지를 불러오기 위해 rootMargin을 설정했습니다.
  // rootMargin: "0px 0px 30px 0px",
  rootMargin: "0px 0px 30% 0px",
  threshold: 0,
};

// IntersectionObserver 를 등록한다.
const io = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    // 관찰 대상이 viewport 안에 들어온 경우 image 로드
    if (entry.isIntersecting) {
      // data-src 정보를 타켓의 src 속성에 설정
      entry.target.src = entry.target.dataset.src;
      // 이미지를 불러왔다면 타켓 엘리먼트에 대한 관찰을 멈춘다.
      observer.unobserve(entry.target);
    }
  });
}, options);

// 관찰할 대상을 선언하고, 해당 속성을 관찰시킨다.
const images = document.querySelectorAll(".lazyImg");

images.forEach((el) => {
  io.observe(el);
});
