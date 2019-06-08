
// Constants
const ADD = "+";
const DELETE = "-";

const DEFAULT_FONT_SIZE = "40px";




function isScrolling(el) {  
  return el.scrollHeight > el.clientHeight;
}

document.getElementById("caption1").style.fontSize = DEFAULT_FONT_SIZE;

document.getElementById("caption1").oninput = () => {
  var el = document.getElementById("caption1");

  if (isScrolling(el)) {
    removeScrolling(el);
  } else {
    tryFontGrowth(el);
  }
}






// Helper Methods
function getFontSizeInt(el) {
  return parseInt(el.style.fontSize);
}


function tryFontGrowth(el) {
  if (el.style.fontSize === DEFAULT_FONT_SIZE) return;

  var fontSize = getFontSizeInt(el);
  var maxFont = parseInt(DEFAULT_FONT_SIZE);

  // So now we just try to scroll
  while (fontSize < maxFont) {
    fontSize++;
    el.style.fontSize = fontSize + "px";

    if (isScrolling(el)) {
      fontSize--;
      el.style.fontSize = fontSize + "px";
      break;
    }
  }
}


function removeScrolling(el) {
  var fontSize = getFontSizeInt(el);

  while (isScrolling(el) && fontSize > 1) {
    fontSize--;
    el.style.fontSize = fontSize + "px";
  }
}


function addControlButton(parentElement, action, position) {
  // This is where I'd like, curry out an action function based on the position?
  // I think I like that style :)
}
