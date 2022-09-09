// point class to store mouse coordinates
class Point {
  constructor(x, y) {
      this.x = x;
      this.y = y;
  }
}

// like jquery selector
function $(selector) {
  elem = document.querySelector(selector);
  return elem;
}

// hide and show function
function hide(elem) {
  elem.style.display = "none";
}

function show(elem) {
  elem.style.display = "block";
}

// creates click event listener on element
function addEventListener1(elem, work) {
  elem.addEventListener('click', work);
}

// important functions =====================
function findDistance() {
  let dis = Math.sqrt(Math.pow(currPos.x - startPos.x, 2) + Math.pow(currPos.y - startPos.y, 2));
  return dis;
}

// draw function
function draw(x, y) {
  context.lineTo(x, y);
  context.stroke();
  context.beginPath();
  context.moveTo(x, y);
}




let canvaBox = $('.board');
let board, context;

let startPos;
let currPos;
let savedPos;
let strikes = [];


let paintable, shapesOpened, bgListOpened = false;
let choosenShape = null;
let tool = "pen";

// Creating Canvas
function createBoard() {
  board = document.createElement('canvas');
  board.height = canvaBox.clientHeight;
  board.width = canvaBox.clientWidth;
  board.id = "board";
  context = board.getContext('2d');
  canvaBox.appendChild(board);
}
createBoard();

let menu = $('.menu');

filesDrawer = $('.filesDrawer');


let previewId;  
let previewList = document.createElement('ul');
previewList.id = "previewList";
newBoardBtn.addEventListener('click', () => {
  let preview = document.createElement('img');
  preview.classList.add('preview');
  preview.src = board.toDataURL();
  preview.title = "Right Click Enabled";
  // To open previews in board
  [preview, openBtnCM].forEach(elem => {
      elem.addEventListener('click', () => {
          context.clearRect(0, 0, board.width, board.height);
          let img = new Image();
          img.onload = function () {
              context.drawImage(img, 0, 0);
          }
          if (elem == preview) {
              img.src = preview.src;
          } else {
              img.src = previewId;
              hide(contextMenu);
          }
      });
  });

  // showing context-menu on click on each preview (using previewID)
  preview.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      previewId = preview.src;    // used for context menu
      contextMenu.style.top = e.clientY + "px";
      contextMenu.style.left = e.clientX + "px";
      show(contextMenu);
  });

  previewList.appendChild(preview);
  filesDrawer.appendChild(previewList);
  context.clearRect(0, 0, board.width, board.height);
});


function start(e) {
  paintable = true;

  hide(menu);

  savedPos = context.getImageData(0, 0, board.clientWidth, board.clientHeight);

  if (strikes.length >= 10) strikes.shift();  // removing first position if strikes > 10;
  strikes.push(savedPos);

  if (tool === "eraser") {
      let w, h = eraserSizeBtn.value;
      context.clearRect(startPos.x, startPos.y, w, h);
  } else {
      draw(e.clientX, e.clientY);
  }

  board.addEventListener('mousemove', move);
  document.addEventListener('mouseup', end);

  startPos = new Point(e.clientX, e.clientY);
}

function move(e) {
  currPos = new Point(e.clientX, e.clientY);

  if (!paintable) return;

  if (tool === "eraser") {
      erase(eraserSizeBtn.value);
  } else {
      if (choosenShape != null) {
          drawShapes();
      } else {
          draw(e.clientX, e.clientY);
      }
  }
}

function end(e) {
  board.removeEventListener('mousemove', move);
  document.removeEventListener('mouseup', end);
  paintable = false;
  context.beginPath();
}

// listening to board's events
board.addEventListener('mousedown', start);
board.addEventListener('mouseup', end);

board.addEventListener('mousemove', move);

