import Typewriter from "typewriter-effect/dist/core";

const typing = document.getElementById("typewriter");

if (typing) {
  const typewriter = new Typewriter(typing, {
    loop: false,
    delay: 75,
  });

  typewriter
    .pauseFor(500) // Add pause event to queue for ms provided.
    .typeString("내 손 안의 세금 계산기 솔톤")
    .start();
  //   .pauseFor(1000)
  //   .deleteChars(3) // Add delete character to event queue for amount of characters provided.
  //   .typeString('<strong>소득세</strong>')
  //   .pauseFor(1000)
  //   .deleteChars(3)
  //   .typeString('<strong>법인세</strong>')
  //   .pauseFor(1000)
  //   .start();

  // typewriter
  // .pauseFor(500) // Add pause event to queue for ms provided.
  // .typeString('솔톤으로 상담하는 <strong>양도세</strong>')
  // .pauseFor(1000)
  // .deleteChars(3) // Add delete character to event queue for amount of characters provided.
  // .typeString('<strong>소득세</strong>')
  // .pauseFor(1000)
  // .deleteChars(3)
  // .typeString('<strong>법인세</strong>')
  // .pauseFor(1000)
  // .start();
}
