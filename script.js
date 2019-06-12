
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

function getPaddingTop(el) {
  let padPX = window.getComputedStyle(el, null).getPropertyValue('padding-top');
  return parseInt(padPX);
}

function isLargerThanRef(el, ref) {
  return el.offsetHeight > (getPaddingTop(ref) + 1.1);
}

// Better method of regulating font size where we don't 
//    have to acces the element every time
function fontAdjustmentCurry(el, ref) {
  return () => {
    if (isLargerThanRef(el, ref)) {
      removeScrolling(el, ref);
    } else {
      tryFontGrowth(el, ref);
    }
  }
}


document.getElementById("control-container").innerHTML = "";
document.getElementById("meme").innerHTML = "";


initModal();






/* Component Add/Delete Handlers */
function addPanel(position) {
  // Aight, so this shouldn't be too bad
  // Have to make sure the position is a valid index
  if (position < 0 || position > getNumPanels()) {
    alert("Invalid add attempted!");
    return;
  }

  console.log("Creating panel at pos: " + position);

  // Otherwise, we can just add some ish

  // Add the buttons
  var buttonPanel = createButtonPanel(position);
  addChildAtPosition(buttonPanel, getNumPanels(), BUTTON_PARENT_ID);

  // Add the meme panel
  var memePanel = createMemePanel(position);
  addChildAtPosition(memePanel, position, MEME_PARENT_ID);

  // Then uhhhh idk
  // p sure we're done at this point
  // Actually lets animate something
  animateFade(buttonPanel);
}



// Event Handlers
function deletePanel(position) {
  var index = position - 1;

  if (index < 0 || index >= getNumPanels()) {
    alert("Invalid deltion attempted!");
    return;
  }

  // Delete the last button control panel
  var buttonParent = document.getElementById(BUTTON_PARENT_ID);
  var lastChild = buttonParent.children[getNumPanels() - 1];
  buttonParent.removeChild(lastChild);

  // Delete the specified meme panel
  var memeParent = document.getElementById(MEME_PARENT_ID);
  var nthChild = memeParent.children[index];
  memeParent.removeChild(nthChild);
}

function downloadMeme() {
  var meme = document.getElementById("meme");

  if (!meme.children.length) {
    alert("Please add some panels to your meme");
    return;
  }

  // Otherwise we can use the library?
  html2canvas(meme, {
    windowHeight: document.body.offsetHeight
  }).then((canvasElm) => {

    // Let's try out this other library, then
    Canvas2Image.saveAsPNG(canvasElm, 
                           canvasElm.width, 
                           canvasElm.height);
  });
}

















// Helper Methods
function uuid() {
  return Math.floor(Math.random() * 0xFFFF);
}

function animateFade(el, delay = 600) {
  // Start at full opacity
  el.style.opacity = 1;  

  setTimeout(() => {
    el.style.opacity = 0; // Transition prop should take care of the speed by itself
    el.style.opacity = "";
  }, delay);
}

function initModal() {
  var imageContainer = document.getElementById("image-container");


  // Fill the modal up with images
  for (var i = 1; i <= MAX_IMAGE_NUM; i++) {
    var img = document.createElement("div");
    img.classList.add(GALAXY_IMAGE);
    img.classList.add("modal-image");
    img.classList.add(IMAGE_CLASS_PREFIX + i);

    let id = getModalImageID(i);

    img.id = id

    img.onclick = () => {selectModalImage(id)};

    // Add the image to the modal body
    imageContainer.appendChild(img);
  }
}

function getModalImageID(idNum) {
  return "modal-image-" + idNum;
}

function selectModalImage(imageID) {  
  // Remove selected from all
  var children = document.getElementById("image-container").children;
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    child.classList.toggle("selected", false);
  }

  // Mark the current one as selected
  document.getElementById(imageID).classList.toggle("selected", true);  
}

function showModal(targetImageID) {
  // I could pass in a callback, maybe?
  // yeah, we could do something like that
  var selectedImageNum = document.getElementById(targetImageID).classList[1]; // Kind of ghetto
  selectedImageNum = selectedImageNum.substring(6);

  // Select the correct image
  selectModalImage(getModalImageID(selectedImageNum));
  

  // Show the container
  var modalContainer = document.getElementById("modal-container");
  modalContainer.classList.toggle("hidden", false);

  var modalBody = document.getElementById("modal-image-select");

  // Establish the callback here?
  // Lowkey I could store which image is selected in the dom, as a class or something
  //    That feels kind of ghetto to my cs bones, but it might be worth
  // I could also set up this "selected" image class thing or w/e from the passed ID, that way the modal already has a pre-selected image...
  //    Hmm... all very interesting

  // Let's do it lul
  var submitUpdateButton = document.getElementById("submit-modal");
  submitUpdateButton.onclick = () => submitImageUpdate(targetImageID);

}

function submitImageUpdate(targetImageID) {
  // Determine which image ended up as selected, if any
  let selectedImageNum = 0;

  var modalImages = document.getElementById("image-container").children;
  for (var i = 0; i < modalImages.length; i++) {
    var modalImage = modalImages[i];

    if (modalImage.classList.contains("selected")) {
      selectedImageNum = i + 1;
    }
  }

  if (selectedImageNum) {
    // Remove existing image class
    // selectedImageNum
    var targetImage = document.getElementById(targetImageID);

    targetImage.className = "";

    // Add back the image classname and our selected image num
    targetImage.classList.add(GALAXY_IMAGE);
    targetImage.classList.add(IMAGE_CLASS_PREFIX + selectedImageNum);
  }

  // finally, close the modal
  closeModal();

}

function closeModal() {  
  var modal = document.getElementById("modal-container");
  modal.classList.toggle("hidden", true);
}


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
  let container = document.createElement("div");
  container.classList.add(GALAXY_PANEL);

  // Create the image div, pretty simple
  let image = document.createElement("div");
  image.classList.add(GALAXY_IMAGE);
  let imageID = "image" + uuid();
  image.id = imageID;
  image.onclick = () => {showModal(imageID);};

  // Make the image dynamic based on the position
  var imageNum = (index < MAX_IMAGE_NUM) ? index + 1 : MAX_IMAGE_NUM;
  image.classList.add(IMAGE_CLASS_PREFIX + imageNum);

  // Create the textarea section, fontsize fixes and all
  var captionContainer = createCaptionContainer(image);

  // Add the caption and image to our container
  container.appendChild(captionContainer);
  container.appendChild(image);

  return container;
}


function createCaptionContainer(refImage) {
  let container = document.createElement("div");
  container.classList.add(CAPTION_CONTAINER);

  let captionBody = document.createElement("div");
  captionBody.classList.add(CAPTION);

  // Ok, I'm going to try to make this work with just the parent
  captionBody.contentEditable = true;

  // Set up the font adjustment
  captionBody.style.fontSize = DEFAULT_FONT_SIZE;
  captionBody.oninput = fontAdjustmentCurry(captionBody, refImage);

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
  var currentNumPanels = getNumPanels();
  button.onclick = () => clickCallback(currentNumPanels + 1);

  // Wrap the button up in a div
  var buttonContainer = document.createElement("div");
  buttonContainer.appendChild(button);

  return buttonContainer;
}



function getFontSizeInt(el) {
  return parseInt(el.style.fontSize);
}


function tryFontGrowth(el, ref) {
  if (el.style.fontSize === DEFAULT_FONT_SIZE) return;

  var fontSize = getFontSizeInt(el);
  var maxFont = parseInt(DEFAULT_FONT_SIZE);

  // So now we just try to scroll
  while (fontSize < maxFont) {
    fontSize++;
    el.style.fontSize = fontSize + "px";

    if (isLargerThanRef(el, ref)) {
      fontSize--;
      el.style.fontSize = fontSize + "px";
      break;
    }
  }
}


function removeScrolling(el, ref) {
  var fontSize = getFontSizeInt(el);

  while (isLargerThanRef(el, ref) && fontSize > 1) {
    fontSize--;
    el.style.fontSize = fontSize + "px";
  }
}


function getNumPanels() {
  return document.getElementById("meme").children.length;
}
