const toggle = document.querySelector("#navigationToggle") || null;
const header = document.querySelector(".header") || null;
let dummyDiv = null;

function removeDummyDiv() {
  dummyDiv.remove();
  toggle.checked = false;
}

function toggleCloseHandler() {
  dummyDiv.addEventListener("click", removeDummyDiv);
}

function addDummyDiv() {
  let checked = toggle.checked;
  if (checked) {
    dummyDiv = document.createElement("div");
    dummyDiv.id = "dummyDiv";
    dummyDiv.style = "z-index: 3; opacity: 0;";
    const dummyDivContainer = document.createElement("div");
    dummyDivContainer.id = "dummyDivContainer";
    dummyDivContainer.style =
      "height: 100vh; width: 100vw; position: fixed; z-index: 1;";
    header
      .insertBefore(dummyDiv, header.firstChild)
      .appendChild(dummyDivContainer);
    toggleCloseHandler();
  } else {
    document.querySelector("#dummyDiv")
      ? document.querySelector("#dummyDiv").remove()
      : null;
  }
}

function toggleOpenHandler() {
  toggle.addEventListener("input", addDummyDiv);
}

function init() {
  toggleOpenHandler();
}

if (toggle) {
  init();
}
