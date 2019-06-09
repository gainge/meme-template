
// Constants
const ADD = "+";
const DELETE = "-";

const DEFAULT_FONT_SIZE = "40px";
const DEFAULT_IMAGE_NUM = 5;
const MAX_IMAGE_NUM = 17;

const BUTTON_PARENT_ID = "control-container";
const MEME_PARENT_ID = "meme";

// Class Names
const BUTTON_CONTAINER = "button-container";
const BUTTON_STRUCTURAL = "button-structural"

const GALAXY_PANEL = "galaxy-panel";
const CAPTION_CONTAINER = "caption-container";
const CAPTION = "caption";

const GALAXY_IMAGE = "galaxy-image";
const IMAGE_CLASS_PREFIX = "galaxy";








function isScrolling(el) {  
  return el.scrollHeight > el.clientHeight;
}

// Better method of regulating font size where we don't 
//    have to acces the element every time
function fontAdjustmentCurry(el) {
  return () => {
    if (isScrolling(el)) {
      removeScrolling(el);
    } else {
      tryFontGrowth(el);
    }
  }
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



// Variables
var numPanels = 2;  // TODO: don't leave this as 2 lol







/* Component Add/Delete Handlers */
function addPanel(position) {
  // Aight, so this shouldn't be too bad
  // Have to make sure the position is a valid index
  if (position < 0 || position > getNumPanels()) {
    alert("Invalid add attempted!");
    return;
  }

  // Otherwise, we can just add some ish

  // Add the buttons
  var buttonPanel = createButtonPanel(position);
  addChildAtPosition(buttonPanel, position, BUTTON_PARENT_ID);

  // Add the meme panel
  var memePanel = createMemePanel(position);
  addChildAtPosition(memePanel, position, MEME_PARENT_ID);

  // Then uhhhh idk
  // p sure we're done at this point
}



// Event Handlers
function deletePanel(position) {
  console.log("Bobby!");
}

















// Helper Methods
function addChildAtPosition(newChild, position, parentID) {
  var parent = document.getElementById(parentID);

  // Two cases, p much
  // Position is guaranteed to be 0 <= pos <= numPanels
  if (position === getNumPanels()) {
    parent.appendChild(newChild);
  } else {
    // Just prepend the child at the specified index
    parent.insertBefore(newChild, parent.children[position]);
  }
}



function createMemePanel(index) {
  var container = document.createElement("div");
  container.classList.add(GALAXY_PANEL);

  // Create the textarea section, fontsize fixes and all
  var captionContainer = createCaptionContainer();

  // Create the image div, pretty simple
  var image = document.createElement("div");
  image.classList.add(GALAXY_IMAGE);

  // Make the image dynamic based on the position
  var imageNum = (index < MAX_IMAGE_NUM) ? index + 1 : MAX_IMAGE_NUM;
  image.classList.add(IMAGE_CLASS_PREFIX + imageNum);

  // Add the caption and image to our container
  container.appendChild(captionContainer);
  container.appendChild(image);

  return container;
}


function createCaptionContainer() {
  var container = document.createElement("div");
  container.classList.add(CAPTION_CONTAINER);

  var captionBody = document.createElement("textarea");
  captionBody.classList.add(CAPTION);

  // Set up the font adjustment
  captionBody.style.fontSize = DEFAULT_FONT_SIZE;
  captionBody.oninput = fontAdjustmentCurry(captionBody);

  container.appendChild(captionBody);

  return container;
}

function createButtonPanel(index) {
  var container = document.createElement("div");
  container.classList.add(BUTTON_CONTAINER);

  // Create each button and add
  var delButton = createButton(DELETE, index);
  var addButton = createButton(ADD, index);

  container.appendChild(delButton);
  container.appendChild(addButton);

  return container;
}

function createButton(type, index) {
  var id;
  var clickCallback;

  if (type === ADD) {
    id = "add-";
    clickCallback = addPanel;
  } else {
    id = "del-";
    clickCallback = deletePanel;
  }

  // Update the index
  id = id + index;

  // Create our button widget
  var button = document.createElement("button");
  button.classList.add(BUTTON_STRUCTURAL);
  button.id = id;
  button.innerText = type;
  // Wire up the click handler, baby
  button.onclick = () => clickCallback(index);

  // Wrap the button up in a div
  var buttonContainer = document.createElement("div");
  buttonContainer.appendChild(button);

  return buttonContainer;
}



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


function getNumPanels() {
  return document.getElementById("meme").children.length;
}
